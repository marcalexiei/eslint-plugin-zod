import { IMPORT_SYNTAXES, buildConsistentImportCreate, zodImportScope } from '@eslint-zod/utils';
import type { ImportSyntax } from '@eslint-zod/utils';

import { createZodPluginRule } from '../utils/create-plugin-rule.js';

interface Options {
  syntax: ImportSyntax;
}
type MessageIds = 'changeImportSyntax' | 'removeDuplicate' | 'convertUsage';

export const consistentImport = createZodPluginRule<[Options], MessageIds>({
  name: 'consistent-import',
  meta: {
    type: 'problem',
    docs: {
      description: 'Enforce a consistent import style for Zod',
    },
    fixable: 'code',
    messages: {
      changeImportSyntax: 'Use a {{syntax}} import for Zod.',
      removeDuplicate: 'Remove duplicate Zod import; Zod is already imported.',
      convertUsage: 'Update Zod usage to match the {{syntax}} import syntax.',
    },
    schema: [
      {
        type: 'object',
        properties: {
          syntax: {
            description: 'Specifies the import syntax to use for Zod.',
            type: 'string',
            enum: IMPORT_SYNTAXES as never,
          },
        },
        additionalProperties: false,
      },
    ],
  },
  defaultOptions: [{ syntax: 'namespace' }],
  create: buildConsistentImportCreate(zodImportScope),
});
