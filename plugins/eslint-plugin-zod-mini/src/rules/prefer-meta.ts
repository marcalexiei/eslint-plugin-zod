import { createZodSchemaImportTrack } from '@eslint-zod/utils';
import { AST_NODE_TYPES } from '@typescript-eslint/utils';

import { createZodMiniPluginRule } from '../utils/create-plugin-rule.js';

const {
  //
  zodImportAllowedSource,
  trackZodSchemaImports,
} = createZodSchemaImportTrack('zod-mini');

export const preferMeta = createZodMiniPluginRule({
  name: 'prefer-meta',
  meta: {
    type: 'suggestion',
    fixable: 'code',
    docs: {
      zodImportAllowedSource,
      description: 'Enforce usage of `z.meta()` over `z.describe()`',
    },
    messages: {
      preferMeta:
        'The `z.describe()` function still exists for compatibility with Zod 3, but `z.meta()` is now the recommended approach.',
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    const {
      importDeclarationListener,
      isZodNamespace,
      getNamedImportOriginal,
    } = trackZodSchemaImports();

    return {
      ImportDeclaration: importDeclarationListener,
      CallExpression(node): void {
        const { callee } = node;

        // z.describe("arg") — namespace or { z } named import
        if (
          callee.type === AST_NODE_TYPES.MemberExpression &&
          callee.property.type === AST_NODE_TYPES.Identifier &&
          callee.property.name === 'describe' &&
          callee.object.type === AST_NODE_TYPES.Identifier &&
          isZodNamespace(callee.object.name)
        ) {
          const [describeArg] = node.arguments;

          context.report({
            node,
            messageId: 'preferMeta',
            fix(fixer) {
              return [
                fixer.replaceText(callee.property, 'meta'),
                fixer.replaceText(
                  describeArg,
                  `{ description: ${context.sourceCode.getText(describeArg)} }`,
                ),
              ];
            },
          });

          return;
        }

        // describe("arg") — named import of the describe function
        if (
          callee.type === AST_NODE_TYPES.Identifier &&
          getNamedImportOriginal(callee.name) === 'describe'
        ) {
          context.report({ node, messageId: 'preferMeta' });
        }
      },
    };
  },
});
