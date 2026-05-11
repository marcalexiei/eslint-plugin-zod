import { createZodSchemaImportTrack, zodImportScope } from '@eslint-zod/utils';
import { AST_NODE_TYPES } from '@typescript-eslint/utils';

import { createZodPluginRule } from '../utils/create-plugin-rule.js';

const { trackZodSchemaImports } = createZodSchemaImportTrack(zodImportScope);

export const preferStrictObject = createZodPluginRule({
  name: 'prefer-strict-object',
  meta: {
    type: 'suggestion',
    fixable: 'code',
    docs: {
      description: 'Prefer `z.strictObject()` over `z.object().strict()`',
    },
    messages: {
      preferStrictObject: 'Use `z.strictObject()` instead of `.strict()`.',
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

        if (zodSchemaMeta?.schemaType !== 'object') {
          return;
        }

        const methods = collectZodChainMethods(zodSchemaMeta.node);
        const strictMethod = methods.find((it) => it.name === 'strict');

        if (!strictMethod) {
          return;
        }

        context.report({
          node: strictMethod.node,
          messageId: 'preferStrictObject',
          fix(fixer) {
            if (zodSchemaMeta.schemaDecl === 'named') {
              return null;
            }

            if (strictMethod.node.arguments.length !== 0) {
              return null;
            }

            const objectMethod = methods.find((it) => it.name === 'object');
            if (!objectMethod) {
              return null;
            }

            const { sourceCode } = context;
            const replacementText =
              objectMethod.node.callee.type === AST_NODE_TYPES.MemberExpression
                ? `${sourceCode.getText(objectMethod.node.callee.object)}.strictObject`
                : 'strictObject';

            const fixes = [
              fixer.replaceText(objectMethod.node.callee, replacementText),
            ];

            const calleeProperty =
              strictMethod.node.callee.type === AST_NODE_TYPES.MemberExpression
                ? strictMethod.node.callee.property
                : strictMethod.node.callee;
            const tokenBefore = sourceCode.getTokenBefore(calleeProperty);

            if (tokenBefore?.value === '.') {
              fixes.push(
                fixer.removeRange([
                  tokenBefore.range[0],
                  strictMethod.node.range[1],
                ]),
              );
            }

            return fixes;
          },
        });
      },
    };
  },
});
