import { buildNoAnySchemaCreate, zodImportScope } from '@eslint-zod/utils';

import { createZodPluginRule } from '../utils/create-plugin-rule.js';

export const noAnySchema = createZodPluginRule({
  name: 'no-any-schema',
  meta: {
    hasSuggestions: true,
    type: 'suggestion',
    docs: {
      description: 'Disallow usage of `z.any()` in Zod schemas',
    },
    messages: {
      noZAny: 'Using `z.any()` is not allowed. Please use a more specific schema.',
      useUnknown: 'Replace `z.any()` with `z.unknown()`',
    },
    schema: [],
  },
  defaultOptions: [],
  create: buildNoAnySchemaCreate(zodImportScope),
});
