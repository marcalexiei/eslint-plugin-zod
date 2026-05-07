import { ZOD_IMPORT_SOURCES } from '@eslint-zod/utils';
import type { ZodImportSource } from '@eslint-zod/utils';
import type { TSESLint } from '@typescript-eslint/utils';

import { createZodMiniPluginRule } from '../utils/create-plugin-rule.js';

type MessageIds = 'sourceNotAllowed' | 'replaceSource';

export const consistentImportSource = createZodMiniPluginRule<
  [{ sources: Array<ZodImportSource> }],
  MessageIds
>({
  name: 'consistent-import-source',
  meta: {
    hasSuggestions: true,
    type: 'suggestion',
    docs: {
      zodImportAllowedSource: 'zod-mini',
      description: 'Enforce consistent source from Zod Mini imports',
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
              enum: [...ZOD_IMPORT_SOURCES],
            },
            minItems: 1,
            uniqueItems: true,
          },
        },
        additionalProperties: false,
      },
    ],
  },
  defaultOptions: [{ sources: ['zod/mini'] }],
  create(context, [{ sources }]) {
    return {
      ImportDeclaration(node): void {
        const sourceValue = node.source.value;
        if (!sourceValue.startsWith('zod')) {
          return;
        }

        if (sources.includes(sourceValue as ZodImportSource)) {
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
