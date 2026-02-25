import type { TSESTree } from '@typescript-eslint/utils';
import { ESLintUtils } from '@typescript-eslint/utils';

import { getRuleURL } from '../meta.js';
import { trackZodSchemaImports } from '../utils/track-zod-schema-imports.js';

export const noStringSchemaWithUuid = ESLintUtils.RuleCreator(getRuleURL)({
  name: 'no-string-schema-with-uuid',
  meta: {
    fixable: 'code',
    type: 'problem',
    docs: {
      description:
        'Disallow usage of `z.string().uuid()` in favor of the dedicated `z.uuid()` schema',
      url: 'https://zod.dev/api#uuids',
    },
    messages: {
      useUuid: '`z.string().uuid()` is redundant. Use `z.uuid()` instead.',
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

        // Only care about string schemas
        if (zodSchemaMeta?.schemaType !== 'string') {
          return;
        }

        // Collect the full chain from the outermost call (left-to-right)
        const methods = collectZodChainMethods(node);

        // find string and uuid positions
        const stringIndex = methods.findIndex((m) => m.name === 'string');
        const uuidIndex = methods.findIndex((m) => m.name === 'uuid');

        if (stringIndex === -1 || uuidIndex === -1) {
          return;
        }

        const stringNode = methods[stringIndex].node;
        const uuidNode = methods[uuidIndex].node;

        // If it's a named import usage (e.g. `import { string } from 'zod'`), report but do not fix.
        if (zodSchemaMeta.schemaDecl === 'named') {
          context.report({
            node,
            messageId: 'useUuid',
          });
          return;
        }

        // Namespace import (e.g. z.string()) — prepare a fixer
        context.report({
          node,
          messageId: 'useUuid',
          fix(fixer) {
            // prefix is the namespace (e.g. "z")
            const stringCallee = stringNode.callee as TSESTree.MemberExpression;
            const prefixObj = stringCallee.object;
            const prefixText = sourceCode.getText(prefixObj);

            // Methods between string and uuid should be moved after .uuid()
            // Example: z.string().optional().uuid() -> methodsBetween = [optional]
            const methodsBetween = methods.slice(stringIndex + 1, uuidIndex);

            // For each intermediate method, extract only its ".name(args…)" suffix.
            const betweenSuffixes = methodsBetween.map((m) => {
              const callee = m.node.callee as TSESTree.MemberExpression;
              const objText = sourceCode.getText(callee.object);
              const fullText = sourceCode.getText(m.node);
              return fullText.slice(objText.length);
            });

            // Construct replacement: z.uuid() + betweenSuffixes
            const replacement = `${prefixText}.uuid()${betweenSuffixes.join('')}`;

            return fixer.replaceTextRange(
              [stringNode.range[0], uuidNode.range[1]],
              replacement,
            );
          },
        });
      },
    };
  },
});
