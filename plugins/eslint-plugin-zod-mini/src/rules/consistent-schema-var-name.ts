import { zodMiniImportScope } from '@eslint-zod/utils';
import { buildConsistentSchemaVarNameCreate } from '@eslint-zod/utils/rule-builders/consistent-schema-var-name';

import { createZodMiniPluginRule } from '../utils/create-plugin-rule.js';

interface Options {
  before?: string;
  after?: string;
}

type MessageIds = 'invalidName';

export const consistentSchemaVarName = createZodMiniPluginRule<[Options], MessageIds>({
  name: 'consistent-schema-var-name',
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Enforce a consistent naming convention for Zod Mini schema variables',
    },
    messages: {
      invalidName: 'Rename this Zod Mini schema to "{{expected}}"',
    },
    schema: [
      {
        type: 'object',
        properties: {
          before: {
            type: 'string',
            description: 'The required prefix for Zod Mini schema variables',
          },
          after: {
            type: 'string',
            description: 'The required suffix for Zod Mini schema variables',
          },
        },
        additionalProperties: false,
      },
    ],
  },
  defaultOptions: [{ after: 'Schema' }],
  create: buildConsistentSchemaVarNameCreate(zodMiniImportScope),
});
