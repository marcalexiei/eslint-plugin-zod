import { ESLintUtils } from '@typescript-eslint/utils';

import { getRuleURL } from '../meta.js';
import { buildZodChainReplacementFix } from '../utils/build-zod-chain-replacement-fix.js';
import { trackZodSchemaImports } from '../utils/track-zod-schema-imports.js';

export const noNumberSchemaWithInt = ESLintUtils.RuleCreator(getRuleURL)({
  name: 'no-number-schema-with-int',
  meta: {
    fixable: 'code',
    type: 'problem',
    docs: {
      description:
        'Disallow usage of `z.number().int()` as it is considered legacy',
    },
    messages: {
      removeNumber:
        '`z.number().int()` is considered legacy. Use `z.int()` instead.',
    },
    schema: [],
  },
  defaultOptions: [],

  create(context) {
    const { sourceCode } = context;

    const {
      importDeclarationListener,
      detectZodSchemaRootNode,
      collectZodChainMethods,
    } = trackZodSchemaImports();

    return {
      ImportDeclaration: importDeclarationListener,

      CallExpression(node): void {
        const zodSchemaMeta = detectZodSchemaRootNode(node);

        // Only care about number schemas
        if (zodSchemaMeta?.schemaType !== 'number') {
          return;
        }

        // Collect the full chain from the outermost call (left-to-right)
        const methods = collectZodChainMethods(node);

        // find int position
        const intIndex = methods.findIndex((m) => m.name === 'int');
        if (intIndex === -1) {
          return;
        }

        const numberIndex = methods.findIndex((m) => m.name === 'number');

        // If it's a named import usage (e.g. `import { number } from 'zod'`), report but do not fix.
        if (zodSchemaMeta.schemaDecl === 'named') {
          context.report({
            node,
            messageId: 'removeNumber',
          });
          return;
        }

        // Namespace import (e.g. z.number()) — prepare a fixer
        context.report({
          node,
          messageId: 'removeNumber',
          fix(fixer) {
            return buildZodChainReplacementFix({
              sourceCode,
              fixer,
              methods,
              fromIndex: numberIndex,
              toIndex: intIndex,
              toMethodName: 'int',
            });
          },
        });
      },
    };
  },
});
