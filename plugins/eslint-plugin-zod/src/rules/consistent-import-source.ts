import { zodImportScope } from '@eslint-zod/utils';
import type { TSESLint } from '@typescript-eslint/utils';

import { createZodPluginRule } from '../utils/create-plugin-rule.js';

type MessageIds = 'sourceNotAllowed' | 'replaceSource';

export const consistentImportSource = createZodPluginRule<
  [{ sources: Array<(typeof zodImportScope.sources)[number]> }],
  MessageIds
>({
  name: 'consistent-import-source',
  meta: {
    hasSuggestions: true,
    type: 'suggestion',
    docs: {
      description: 'Enforce consistent source from Zod imports',
    },
    messages: {
      sourceNotAllowed:
        '"{{source}}" is not allowed. Available values are: {{sources}}',
      replaceSource: 'Replace "{{invalid}}" with "{{valid}}"',
    },
    schema: [
      {
        type: 'object',
        properties: {
          sources: {
            type: 'array',
            description: 'An array of allowed Zod import sources.',
            items: {
              type: 'string',
              enum: [...zodImportScope.sources],
            },
            minItems: 1,
            uniqueItems: true,
          },
        },
        additionalProperties: false,
      },
    ],
  },
  defaultOptions: [{ sources: ['zod'] }],
  create(context, [{ sources }]) {
    return {
      ImportDeclaration(node): void {
        const sourceValue = node.source.value;
        if (!zodImportScope.isAllowed(sourceValue)) {
          return;
        }

        if ((sources as Array<string>).includes(sourceValue)) {
          return;
        }

        context.report({
          node,
          messageId: 'sourceNotAllowed',
          data: {
            source: sourceValue,
            sources: sources.map((s) => `"${s}"`).join(', '),
          },
          suggest: sources.map<
            TSESLint.ReportSuggestionArray<MessageIds>[number]
          >((it) => ({
            messageId: 'replaceSource',
            data: { valid: it, invalid: sourceValue },
            fix(fixer): TSESLint.RuleFix {
              return fixer.replaceText(
                node.source,
                // Replacing using the raw value
                // to keep quote style consistent with the user code
                node.source.raw.replace(sourceValue, it),
              );
            },
          })),
        });
      },
    };
  },
});
