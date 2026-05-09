import {
  IMPORT_SYNTAXES,
  getNamespaceAliasNameFrom,
  isGroupFirstImportKindValidForSyntax,
  shouldIdentifierBeRenamed,
  zodCoreImportScope,
} from '@eslint-zod/utils';
import type { ImportGroupData, ImportSyntax } from '@eslint-zod/utils';
import type { TSESTree } from '@typescript-eslint/utils';

import { createZodPluginRule } from '../utils/create-plugin-rule.js';

interface Options {
  syntax: ImportSyntax;
}
type MessageIds = 'changeImportSyntax' | 'removeDuplicate' | 'convertUsage';

export const consistentImport = createZodPluginRule<[Options], MessageIds>({
  name: 'consistent-import',
  meta: {
    type: 'problem',
    docs: {
      description: 'Enforce a consistent import style for Zod core',
    },
    fixable: 'code',
    messages: {
      changeImportSyntax: 'Use a {{syntax}} import for Zod core.',
      removeDuplicate:
        'Remove duplicate Zod core import; Zod core is already imported.',
      convertUsage:
        'Update Zod core usage to match the {{syntax}} import syntax.',
    },
    schema: [
      {
        type: 'object',
        properties: {
          syntax: {
            description: 'Specifies the import syntax to use for Zod core.',
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

        if (!zodCoreImportScope.isAllowed(source.value)) {
          return;
        }

        importGroups[source.value] ??= {
          hasOnlyTypeImports: true,
          nodes: [],
        };

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

          const nodesWithVariablesToUpdate: Array<TSESTree.ImportClause> = [];

          let namespaceAliasName: string | null = null;

          for (const specifier of nodes.flatMap((it) => it.specifiers)) {
            if (!namespaceAliasName) {
              namespaceAliasName = getNamespaceAliasNameFrom(specifier);
              if (namespaceAliasName) {
                continue;
              }
            }

            nodesWithVariablesToUpdate.push(specifier);
          }

          if (!namespaceAliasName) {
            namespaceAliasName = 'z';
            if (namespaceAliasNameIndex > 0) {
              namespaceAliasName = `z${namespaceAliasNameIndex}`;
              namespaceAliasNameIndex += 1;
            }
          }

          const isFirstImportValid = isGroupFirstImportKindValidForSyntax(
            importGroup,
            syntax,
          );

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
