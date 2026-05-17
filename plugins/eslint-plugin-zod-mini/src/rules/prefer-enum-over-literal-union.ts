import { createZodSchemaImportTrack, zodMiniImportScope } from '@eslint-zod/utils';
import type { TSESTree } from '@typescript-eslint/utils';
import { AST_NODE_TYPES } from '@typescript-eslint/utils';

import { createZodMiniPluginRule } from '../utils/create-plugin-rule.js';

const { trackZodSchemaImports } = createZodSchemaImportTrack(zodMiniImportScope);

export const preferEnumOverLiteralUnion = createZodMiniPluginRule({
  name: 'prefer-enum-over-literal-union',
  meta: {
    type: 'suggestion',
    fixable: 'code',
    docs: {
      description: 'Prefer `z.enum()` over `z.union()` when all members are string literals.',
    },
    messages: {
      useEnum: 'Replace this union of string literals with `z.enum()`.',
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    const { importDeclarationListener, detectZodSchemaRootNode, collectZodChainMethods } =
      trackZodSchemaImports();

    return {
      ImportDeclaration: importDeclarationListener,
      CallExpression(node): void {
        const zodSchemaMeta = detectZodSchemaRootNode(node);

        if (zodSchemaMeta?.schemaType !== 'union') {
          return;
        }

        const methods = collectZodChainMethods(zodSchemaMeta.node);
        const union = methods.find((it) => it.name === 'union');

        if (!union) {
          return;
        }

        const unionNode = union.node;

        const unionArgument = unionNode.arguments.at(0);
        if (unionArgument?.type !== AST_NODE_TYPES.ArrayExpression) {
          return;
        }

        const zodLiteralStrings = unionArgument.elements.map<string | null>((s) => {
          if (!s) {
            return null;
          }

          const maybeLiteralSchema = detectZodSchemaRootNode(s);
          if (maybeLiteralSchema?.schemaType !== 'literal') {
            return null;
          }

          const [literalArgument] = maybeLiteralSchema.node.arguments;
          if (
            literalArgument.type === AST_NODE_TYPES.Literal &&
            typeof literalArgument.value === 'string'
          ) {
            return literalArgument.raw;
          }

          return null;
        });

        if (zodLiteralStrings.some((it) => it === null)) {
          return;
        }

        context.report({
          node,
          messageId: 'useEnum',
          fix(fixer) {
            if (zodSchemaMeta.schemaDecl === 'named') {
              return null;
            }

            return [
              fixer.replaceText((unionNode.callee as TSESTree.MemberExpression).property, 'enum'),
              fixer.replaceText(unionNode.arguments[0], `[${zodLiteralStrings.join(', ')}]`),
            ];
          },
        });
      },
    };
  },
});
