import {
  IMPORT_SYNTAXES,
  buildConsistentImportCreate,
  zodMiniImportScope,
} from '@eslint-zod/utils';
import type { ImportSyntax } from '@eslint-zod/utils';

import { createZodMiniPluginRule } from '../utils/create-plugin-rule.js';

interface Options {
  syntax: ImportSyntax;
}
type MessageIds = 'changeImportSyntax' | 'removeDuplicate' | 'convertUsage';

export const consistentImport = createZodMiniPluginRule<[Options], MessageIds>({
  name: 'consistent-import',
  meta: {
    type: 'problem',
    docs: {
      description: 'Enforce a consistent import style for Zod Mini',
    },
    fixable: 'code',
    messages: {
      changeImportSyntax: 'Use a {{syntax}} import for Zod Mini.',
      removeDuplicate: 'Remove duplicate Zod Mini import; Zod Mini is already imported.',
      convertUsage: 'Update Zod Mini usage to match the {{syntax}} import syntax.',
    },
    schema: [
      {
        type: 'object',
        properties: {
          syntax: {
            description: 'Specifies the import syntax to use for Zod Mini.',
            type: 'string',
            enum: IMPORT_SYNTAXES as never,
          },
        },
        additionalProperties: false,
      },
    ],
  },
  defaultOptions: [{ syntax: 'namespace' }],
  create: buildConsistentImportCreate(zodMiniImportScope),
});
