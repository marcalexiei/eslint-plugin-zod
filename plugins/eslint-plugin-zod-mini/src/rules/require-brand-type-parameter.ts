import { buildRequireBrandTypeParameterCreate, zodMiniImportScope } from '@eslint-zod/utils';

import { createZodMiniPluginRule } from '../utils/create-plugin-rule.js';

export const requireBrandTypeParameter = createZodMiniPluginRule({
  name: 'require-brand-type-parameter',
  meta: {
    hasSuggestions: true,
    type: 'problem',
    docs: {
      description: 'Require type parameter on `.brand()` functions',
    },
    messages: {
      missingTypeParameter: 'Type parameter is required when using `.brand()`',
      removeBrandFunction:
        'Brand is a static-only construct. If not parameter is required consider removal',
    },
    schema: [],
  },
  defaultOptions: [],
  create: buildRequireBrandTypeParameterCreate(zodMiniImportScope),
});
