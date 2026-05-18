import { zodCoreImportScope } from '@eslint-zod/utils';
import { buildConsistentSchemaOutputTypeStyleCreate } from '@eslint-zod/utils/rule-builders/consistent-schema-output-type-style';

import { createZodPluginRule } from '../utils/create-plugin-rule.js';

const ZOD_SCHEMA_TYPE_STYLES = ['infer', 'output'] as const;

type SchemaTypeStyle = (typeof ZOD_SCHEMA_TYPE_STYLES)[number];

interface Options {
  style: SchemaTypeStyle;
}

type MessageIds = 'useInfer' | 'useOutput';

export const consistentSchemaOutputTypeStyle = createZodPluginRule<[Options], MessageIds>({
  name: 'consistent-schema-output-type-style',
  meta: {
    type: 'suggestion',
    fixable: 'code',
    docs: {
      description: 'Enforce consistent use of core.infer or core.output for schema type inference',
    },
    messages: {
      useInfer: 'Use infer instead of output.',
      useOutput: 'Use output instead of infer.',
    },
    schema: [
      {
        type: 'object',
        properties: {
          style: {
            description: 'Decides which style to use for schema type inference',
            type: 'string',
            enum: [...ZOD_SCHEMA_TYPE_STYLES],
          },
        },
        additionalProperties: false,
      },
    ],
  },
  defaultOptions: [{ style: 'output' }],
  create: buildConsistentSchemaOutputTypeStyleCreate(zodCoreImportScope),
});
