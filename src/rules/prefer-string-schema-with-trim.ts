import { ESLintUtils } from '@typescript-eslint/utils';

import { getRuleURL } from '../meta.js';
import { trackZodSchemaImports } from '../utils/track-zod-schema-imports.js';

export const preferStringSchemaWithTrim = ESLintUtils.RuleCreator(getRuleURL)({
  name: 'prefer-string-schema-with-trim',
  meta: {
    type: 'problem',
    fixable: 'code',
    docs: {
      description:
        'Enforce `z.string().trim()` to prevent accidental leading/trailing whitespace',
    },
    messages: {
      addTrim: '`z.string()` schemas should use `.trim()`.',
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

        const methods = collectZodChainMethods(zodSchemaMeta.node);

        if (methods.some((it) => it.name === 'trim')) {
          return;
        }

        if (zodSchemaMeta.schemaDecl === 'named') {
          context.report({
            node,
            messageId: 'addTrim',
          });
          return;
        }

        context.report({
          node,
          messageId: 'addTrim',
          fix(fixer) {
            const lastMethod = methods.at(0)!;
            return fixer.insertTextAfter(lastMethod.node, '.trim()');
          },
        });
      },
    };
  },
});
