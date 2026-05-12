import {
  ZOD_NON_SCHEMA_PRODUCING_METHODS,
  createZodSchemaImportTrack,
  zodImportScope,
} from '@eslint-zod/utils';

import { createZodPluginRule } from '../utils/create-plugin-rule.js';

const { trackZodSchemaImports } = createZodSchemaImportTrack(zodImportScope);

export const noSchemaWithIsOptional = createZodPluginRule({
  name: 'no-schema-with-is-optional',
  meta: {
    type: 'problem',
    // Note: `fixable` is intentionally omitted. Replacing `.isOptional()` with
    // `safeParse(undefined).success` may require extracting the schema to avoid
    // duplicating expressions or altering runtime behavior.
    docs: {
      description:
        'Disallow deprecated `.isOptional()` on a Zod schema; use `safeParse(undefined).success` instead.',
    },
    messages: {
      useSafeParse:
        '`.isOptional()` is deprecated. Try `schema.safeParse(undefined).success` instead.',
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

        // Check if the chain contains a is `isOptional`
        const isOptionalIndex = methods.findIndex((it) => it === 'isOptional');
        if (isOptionalIndex === -1) {
          return;
        }

        // Retrieve the chain methods before isOptional
        const methodsBeforeIsOptional = methods.slice(0, isOptionalIndex);

        // if the chain contains a zod method not producing a schema stop,
        // the isOptional is not related to zod
        if (
          methodsBeforeIsOptional.some((method) =>
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
