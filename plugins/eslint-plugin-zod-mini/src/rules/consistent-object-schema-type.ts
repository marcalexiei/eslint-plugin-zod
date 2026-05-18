import { buildConsistentObjectSchemaTypeCreate, zodMiniImportScope } from '@eslint-zod/utils';

import { createZodMiniPluginRule } from '../utils/create-plugin-rule.js';

const ZOD_OBJECT_METHODS = ['object', 'looseObject', 'strictObject'] as const;

type ZodObjectMethod = (typeof ZOD_OBJECT_METHODS)[number];

interface Options {
  allow: Array<ZodObjectMethod>;
}
type MessageIds = 'consistentMethod' | 'useMethod';

const defaultOptions: Options = { allow: ['object'] };

export const consistentObjectSchemaType = createZodMiniPluginRule<[Options], MessageIds>({
  name: 'consistent-object-schema-type',
  meta: {
    hasSuggestions: true,
    type: 'suggestion',
    docs: {
      description: 'Enforce consistent usage of Zod Mini schema methods',
    },
    messages: {
      consistentMethod:
        "Inconsistent Zod Mini object schema method '{{actual}}'. Allowed: {{allowedList}}.",
      useMethod: "Replace with '{{expected}}'.",
    },
    schema: [
      {
        type: 'object',
        properties: {
          allow: {
            type: 'array',
            description: 'Decides which object methods are allowed',
            items: {
              type: 'string',
              enum: [...ZOD_OBJECT_METHODS],
            },
            minItems: 1,
            uniqueItems: true,
          },
        },
        additionalProperties: false,
      },
    ],
  },
  defaultOptions: [defaultOptions],
  create: buildConsistentObjectSchemaTypeCreate(zodMiniImportScope),
});
