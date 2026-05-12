import {
  ZOD_NON_SCHEMA_PRODUCING_METHODS,
  createZodSchemaImportTrack,
  zodImportScope,
} from '@eslint-zod/utils';

import { createZodPluginRule } from '../utils/create-plugin-rule.js';

const { trackZodSchemaImports } = createZodSchemaImportTrack(zodImportScope);

export const noSchemaWithIsNullable = createZodPluginRule({
  name: 'no-schema-with-is-nullable',
  meta: {
    type: 'problem',
    // Note: `fixable` is intentionally omitted. Replacing `.isNullable()` with
    // `safeParse(null).success` may require extracting the schema to avoid
    // duplicating expressions or altering runtime behavior.
    docs: {
      description:
        'Disallow deprecated `.isNullable()` on a Zod schema; use `safeParse(null).success` instead.',
    },
    messages: {
      useSafeParse: '`.isNullable()` is deprecated. Try `schema.safeParse(null).success` instead.',
    },
    schema: [],
  },
  defaultOptions: [],

  create(context) {
    const { importDeclarationListener, detectZodSchemaRootNode } = trackZodSchemaImports();

    return {
      ImportDeclaration: importDeclarationListener,

      CallExpression(node): void {
        const zodSchemaMeta = detectZodSchemaRootNode(node);
        if (!zodSchemaMeta) {
          return;
        }

        const { methods } = zodSchemaMeta;

        // Check if the chain contains a is `isNullable`
        const isNullableIndex = methods.findIndex((it) => it === 'isNullable');
        if (isNullableIndex === -1) {
          return;
        }

        // Retrieve the chain methods before isNullable
        const methodsBeforeIsNullable = methods.slice(0, isNullableIndex);

        // if the chain contains a zod method not producing a schema stop,
        // the isNullable is not related to zod
        if (
          methodsBeforeIsNullable.some((method) =>
            ZOD_NON_SCHEMA_PRODUCING_METHODS.includes(method),
          )
        ) {
          return;
        }

        context.report({
          node,
          messageId: 'useSafeParse',
        });
      },
    };
  },
});
