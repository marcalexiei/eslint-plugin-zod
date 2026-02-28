import type { TSESTree } from '@typescript-eslint/utils';

import { createZodPluginRule } from '../utils/create-plugin-rule.js';
import { createZodSchemaImportTrack } from '../utils/track-zod-schema-imports.js';

const {
  //
  zodImportAllowedSource,
  trackZodSchemaImports,
} = createZodSchemaImportTrack('all');

export const preferMeta = createZodPluginRule({
  name: 'prefer-meta',
  meta: {
    type: 'suggestion',
    fixable: 'code',
    docs: {
      zodImportAllowedSource,
      description: 'Enforce usage of `.meta()` over `.describe()`',
    },
    messages: {
      preferMeta:
        'The `.describe()` method still exists for compatibility with Zod 3, but `.meta()` is now the recommended approach.',
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

        if (!zodSchemaMeta) {
          return;
        }

        const describe = collectZodChainMethods(zodSchemaMeta.node).find(
          (it) => it.name === 'describe',
        );

        if (!describe) {
          return;
        }

        const {
          callee,
          arguments: [describeArg],
        } = describe.node;

        context.report({
          node,
          messageId: 'preferMeta',
          fix(fixer) {
            return [
              fixer.replaceText(
                (callee as TSESTree.MemberExpression).property,
                'meta',
              ),
              fixer.replaceText(
                describeArg,
                `{ description: ${context.sourceCode.getText(describeArg)} }`,
              ),
            ];
          },
        });
      },
    };
  },
});
