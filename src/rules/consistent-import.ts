import type { TSESTree } from '@typescript-eslint/utils';
import { AST_NODE_TYPES } from '@typescript-eslint/utils';

import { createZodPluginRule } from '../utils/create-plugin-rule.js';
import { isZodImportSource } from '../utils/is-zod-import-source.js';

const IMPORT_SYNTAXES = ['namespace', 'named'] as const;
type ImportSyntax = (typeof IMPORT_SYNTAXES)[number];

interface Options {
  syntax: ImportSyntax;
}
type MessageIds = 'changeImportSyntax' | 'removeDuplicate' | 'convertUsage';

interface ImportGroupData {
  hasOnlyTypeImports: boolean;
  nodes: Array<TSESTree.ImportDeclaration>;
}

/**
 * Determines whether the first import in a group is valid for a given import
 * syntax (`named` or `namespace`), taking into account whether the group
 * contains only type imports.
 *
 * Rules enforced:
 * - For `named` syntax:
 *   - The first import must have exactly one specifier
 *   - That specifier must be a named import of identifier `z`
 * - For `namespace` syntax:
 *   - The first import must have exactly one namespace specifier
 * - If the group contains only type imports, the first import must explicitly
 *   be declared as `import type`
 *
 * @param group - Metadata describing the import group
 * @param syntax - Expected import syntax for the group
 * @returns `true` if the first import matches the expected syntax and type rules
 */
function isGroupFirstImportKindValidForSyntax(
  group: ImportGroupData,
  syntax: ImportSyntax,
): boolean {
  const { hasOnlyTypeImports, nodes } = group;
  const [firstImportNode] = nodes;
  const { specifiers, importKind } = firstImportNode;

  // All supported syntaxes require exactly one specifier
  if (specifiers.length !== 1) {
    return false;
  }

  const [specifier] = specifiers;

  // Validate syntax-specific constraints
  const isValidForSyntax =
    syntax === 'named'
      ? specifier.type === AST_NODE_TYPES.ImportSpecifier &&
        specifier.imported.type === AST_NODE_TYPES.Identifier &&
        specifier.imported.name === 'z'
      : specifier.type === AST_NODE_TYPES.ImportNamespaceSpecifier;

  if (!isValidForSyntax) {
    return false;
  }

  // If the group consists only of type imports, the first import
  // must explicitly use `import type`
  if (hasOnlyTypeImports) {
    return importKind === 'type';
  }

  return true;
}

function shouldIdentifierBeRenamed(node: TSESTree.Identifier): boolean {
  // Skip import specifier nodes themselves
  if (node.parent.type === AST_NODE_TYPES.ImportSpecifier) {
    return false;
  }

  // Skip if already qualified, e.g. z.array
  if (
    node.parent.type === AST_NODE_TYPES.MemberExpression &&
    node.parent.object.type === AST_NODE_TYPES.Identifier &&
    node.parent.object.name !== node.name
  ) {
    return false;
  }

  return true;
}

/**
 * From a given specifiers retrieve the most significant to use when creating an alias import
 */
function getNamespaceAliasNameFrom(node: TSESTree.ImportClause): string | null {
  if (
    node.type === AST_NODE_TYPES.ImportDefaultSpecifier ||
    node.type === AST_NODE_TYPES.ImportNamespaceSpecifier
  ) {
    return node.local.name;
  }

  if (
    // node.type === AST_NODE_TYPES.ImportSpecifier &&
    node.imported.type === AST_NODE_TYPES.Identifier &&
    // Search named imports for 'z'
    node.imported.name === 'z'
  ) {
    return node.local.name;
  }

  return null;
}

export const consistentImport = createZodPluginRule<[Options], MessageIds>({
  name: 'consistent-import',
  meta: {
    type: 'problem',
    docs: {
      zodImportAllowedSource: 'all',
      description: 'Enforce a consistent import style for Zod',
    },
    fixable: 'code',
    messages: {
      changeImportSyntax: 'Use a {{syntax}} import for Zod.',
      removeDuplicate: 'Remove duplicate Zod import; Zod is already imported.',
      convertUsage: 'Update Zod usage to match the {{syntax}} import syntax.',
    },
    schema: [
      {
        type: 'object',
        properties: {
          syntax: {
            description: 'Specifies the import syntax to use for Zod.',
            type: 'string',
            enum: IMPORT_SYNTAXES as never,
          },
        },
        additionalProperties: false,
      },
    ],
  },
  defaultOptions: [{ syntax: 'namespace' }],
  create(context, [options]) {
    const { syntax } = options;

    const { sourceCode } = context;

    const importGroups: Record<string, ImportGroupData> = {};

    return {
      ImportDeclaration(node): void {
        const { source, importKind } = node;

        if (!isZodImportSource(source.value, 'all')) {
          return;
        }

        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (!importGroups[source.value]) {
          importGroups[source.value] = {
            hasOnlyTypeImports: true,
            nodes: [],
          };
        }

        if (
          importGroups[source.value].hasOnlyTypeImports &&
          importKind === 'value'
        ) {
          importGroups[source.value].hasOnlyTypeImports = false;
        }

        importGroups[source.value].nodes.push(node);
      },

      // eslint-disable-next-line @typescript-eslint/naming-convention
      'Program:exit': function (): void {
        let namespaceAliasNameIndex = 0;

        for (const importGroup of Object.values(importGroups)) {
          const { hasOnlyTypeImports, nodes } = importGroup;
          const [firstImportNode, ...othersImportNodes] = nodes;

          /**
           * Variable to track all specifiers that later are used by {@link getDeclaredVariables}
           * to add the namespace prefix
           */
          const nodesWithVariablesToUpdate: Array<TSESTree.ImportClause> = [];

          let namespaceAliasName: string | null = null;

          for (const specifier of nodes.flatMap((it) => it.specifiers)) {
            // Search for name to use in the namespace import
            if (!namespaceAliasName) {
              namespaceAliasName = getNamespaceAliasNameFrom(specifier);
              if (namespaceAliasName) {
                continue;
              }
            }

            // If a name isn't found or has already been found,
            // this specifier must be processed later to add the namespace prefix
            nodesWithVariablesToUpdate.push(specifier);
          }

          // if specifiers name doesn't produce a valid identifier generate one
          if (!namespaceAliasName) {
            namespaceAliasName = 'z';
            if (namespaceAliasNameIndex > 0) {
              namespaceAliasName = `z${namespaceAliasNameIndex}`;
              namespaceAliasNameIndex += 1;
            }
          }

          // Check if first import node is a namespace import
          const isFirstImportValid = isGroupFirstImportKindValidForSyntax(
            importGroup,
            syntax,
          );

          // if first node is invalid turn it into a namespace import
          if (!isFirstImportValid) {
            context.report({
              node: firstImportNode,
              messageId: 'changeImportSyntax',
              data: { syntax },
              fix(fixer) {
                const importTypeKeyword = hasOnlyTypeImports ? 'type ' : '';
                let importSpecifier: string | undefined;
                if (syntax === 'named') {
                  if (namespaceAliasName === 'z') {
                    importSpecifier = '{ z }';
                  } else {
                    importSpecifier = `{ z as ${namespaceAliasName} }`;
                  }
                } else {
                  importSpecifier = `* as ${namespaceAliasName}`;
                }
                const newImportText = `import ${importTypeKeyword}${importSpecifier} from ${firstImportNode.source.raw};`;
                return fixer.replaceText(firstImportNode, newImportText);
              },
            });
          }

          // Setup fixer for all references of all previously specifiers references
          const allVariables = nodesWithVariablesToUpdate.flatMap((it) =>
            sourceCode.getDeclaredVariables(it),
          );
          const allReferences = allVariables.flatMap((it) => it.references);
          for (const ref of allReferences) {
            const { identifier } = ref;

            if (shouldIdentifierBeRenamed(identifier as TSESTree.Identifier)) {
              context.report({
                node: identifier,
                messageId: 'convertUsage',
                data: { syntax },
                fix(fixer) {
                  const newId = `${namespaceAliasName}.${identifier.name}`;
                  return fixer.replaceText(identifier, newId);
                },
              });
            }
          }

          // Remove duplicate imports, if any
          for (const extraImport of othersImportNodes) {
            context.report({
              node: extraImport,
              messageId: 'removeDuplicate',
              fix(fixer) {
                return fixer.removeRange(extraImport.range);
              },
            });
          }
        }
      },
    };
  },
});
