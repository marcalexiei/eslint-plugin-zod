import type { TSESLint } from '@typescript-eslint/utils';
import { AST_NODE_TYPES } from '@typescript-eslint/utils';

import { createZodSchemaImportTrack } from '../track-zod-schema-imports.js';
import type { ZodImportScope } from '../zod-import-scope.js';

type MessageIds = 'noZAny' | 'useUnknown';

export function buildNoAnySchemaCreate(
  scope: ZodImportScope,
): (context: Readonly<TSESLint.RuleContext<MessageIds, []>>) => TSESLint.RuleListener {
  const { trackZodSchemaImports } = createZodSchemaImportTrack(scope);

  return function create(context) {
    const { importDeclarationListener, detectZodSchemaRootNode, collectZodChainMethods } =
      trackZodSchemaImports();

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
                    return fixer.replaceText(schemaMethodCallee.property, 'unknown');
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
  };
}
