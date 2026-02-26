import { ESLintUtils } from '@typescript-eslint/utils';

import { getRuleURL } from '../meta.js';
import { trackZodSchemaImports } from '../utils/track-zod-schema-imports.js';

export const preferStringSchemaWithTrim = ESLintUtils.RuleCreator(getRuleURL)({
  name: 'prefer-string-schema-with-trim',
  meta: {
    fixable: 'code',
    type: 'suggestion',
    docs: {
      description:
        'Require `z.string().trim()` to prevent accidental leading/trailing whitespace',
      url: 'https://zod.dev/api#strings',
    },
    messages: {
      preferTrim: '`z.string()` schemas should use `.trim()`.',
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

        if (zodSchemaMeta?.schemaType !== 'string') {
          return;
        }

        const methods = collectZodChainMethods(node);
        const hasTrim = methods.some((m) => m.name === 'trim');

        if (hasTrim) {
          return;
        }

        context.report({
          node,
          messageId: 'preferTrim',
          fix(fixer) {
            const lastMethod = methods[methods.length - 1];
            return fixer.insertTextAfter(lastMethod.node, '.trim()');
          },
        });
      },
    };
  },
});
