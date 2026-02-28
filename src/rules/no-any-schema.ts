import type { TSESLint } from '@typescript-eslint/utils';
import { AST_NODE_TYPES } from '@typescript-eslint/utils';

import { createZodPluginRule } from '../utils/create-plugin-rule.js';
import { createZodSchemaImportTrack } from '../utils/track-zod-schema-imports.js';

const {
  //
  zodImportAllowedSource,
  trackZodSchemaImports,
} = createZodSchemaImportTrack('all');

export const noAnySchema = createZodPluginRule({
  name: 'no-any-schema',
  meta: {
    hasSuggestions: true,
    type: 'suggestion',
    docs: {
      zodImportAllowedSource,
      description: 'Disallow usage of `z.any()` in Zod schemas',
    },
    messages: {
      noZAny:
        'Using `z.any()` is not allowed. Please use a more specific schema.',
      useUnknown: 'Replace `z.any()` with `z.unknown()`',
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    const {
      importDeclarationListener,
      detectZodSchemaRootNode,
      collectZodChainMethods,
    } = trackZodSchemaImports();

    return {
      ImportDeclaration: importDeclarationListener,
      CallExpression(node): void {
        const zodSchemaMeta = detectZodSchemaRootNode(node);

        if (zodSchemaMeta?.schemaType !== 'any') {
          return;
        }

        const { callee } = node;

        if (callee.type === AST_NODE_TYPES.Identifier) {
          context.report({
            node,
            messageId: 'noZAny',
          });
          return;
        }

        if (callee.type === AST_NODE_TYPES.MemberExpression) {
          const [{ node: schemaMethod }] = collectZodChainMethods(node);

          const schemaMethodCallee = schemaMethod.callee;

          if (
            schemaMethodCallee.type === AST_NODE_TYPES.MemberExpression &&
            schemaMethodCallee.property.type === AST_NODE_TYPES.Identifier
          ) {
            context.report({
              node,
              messageId: 'noZAny',
              suggest: [
                {
                  messageId: 'useUnknown',
                  fix(fixer): TSESLint.RuleFix {
                    return fixer.replaceText(
                      schemaMethodCallee.property,
                      'unknown',
                    );
                  },
                },
              ],
            });
            return;
          }

          context.report({
            node,
            messageId: 'noZAny',
          });
        }
      },
    };
  },
});
