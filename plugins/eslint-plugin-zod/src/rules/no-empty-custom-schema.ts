import { buildNoEmptyCustomSchemaCreate, zodImportScope } from '@eslint-zod/utils';

import { createZodPluginRule } from '../utils/create-plugin-rule.js';

export const noEmptyCustomSchema = createZodPluginRule({
  name: 'no-empty-custom-schema',
  meta: {
    hasSuggestions: false,
    type: 'suggestion',
    docs: {
      description: 'Disallow usage of `z.custom()` without arguments',
    },
    messages: {
      noEmptyCustomSchema: 'You should provide a validate function within `z.custom()`',
    },
    schema: [],
  },
  defaultOptions: [],
  create: buildNoEmptyCustomSchemaCreate(zodImportScope),
});
