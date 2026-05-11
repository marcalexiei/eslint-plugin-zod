import { createZodSchemaImportTrack, zodImportScope } from '@eslint-zod/utils';
import { AST_NODE_TYPES } from '@typescript-eslint/utils';

import { createZodPluginRule } from '../utils/create-plugin-rule.js';

const { trackZodSchemaImports } = createZodSchemaImportTrack(zodImportScope);

export const preferLooseObject = createZodPluginRule({
  name: 'prefer-loose-object',
  meta: {
    type: 'suggestion',
    fixable: 'code',
    docs: {
      description:
        'Prefer `z.looseObject()` over `z.object().passthrough()` and `z.object().loose()`',
    },
    messages: {
      preferLooseObject:
        'Use `z.looseObject()` instead of `.passthrough()` or `.loose()`.',
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
        const looseMethod = methods.find(
          (it) => it.name === 'passthrough' || it.name === 'loose',
        );

        if (!looseMethod) {
          return;
        }

        context.report({
          node: looseMethod.node,
          messageId: 'preferLooseObject',
          fix(fixer) {
            if (zodSchemaMeta.schemaDecl === 'named') {
              return null;
            }

            if (looseMethod.node.arguments.length !== 0) {
              return null;
            }

            const objectMethod = methods.find((it) => it.name === 'object');
            if (!objectMethod) {
              return null;
            }

            const { sourceCode } = context;
            const replacementText =
              objectMethod.node.callee.type === AST_NODE_TYPES.MemberExpression
                ? `${sourceCode.getText(objectMethod.node.callee.object)}.looseObject`
                : 'looseObject';

            const fixes = [
              fixer.replaceText(objectMethod.node.callee, replacementText),
            ];

            const calleeProperty =
              looseMethod.node.callee.type === AST_NODE_TYPES.MemberExpression
                ? looseMethod.node.callee.property
                : looseMethod.node.callee;
            const tokenBefore = sourceCode.getTokenBefore(calleeProperty);

            if (tokenBefore?.value === '.') {
              fixes.push(
                fixer.removeRange([
                  tokenBefore.range[0],
                  looseMethod.node.range[1],
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
