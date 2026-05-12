import {
  ZOD_NON_SCHEMA_PRODUCING_METHODS,
  createZodSchemaImportTrack,
  zodImportScope,
} from '@eslint-zod/utils';
import { AST_NODE_TYPES } from '@typescript-eslint/utils';

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
    const { importDeclarationListener, detectZodSchemaRootNode } =
      trackZodSchemaImports();

    return {
      ImportDeclaration: importDeclarationListener,

      CallExpression(node): void {
        if (node.callee.type !== AST_NODE_TYPES.MemberExpression) {
          return;
        }
        if (node.callee.computed) {
          return;
        }
        if (node.callee.property.type !== AST_NODE_TYPES.Identifier) {
          return;
        }
        if (node.callee.property.name !== 'isOptional') {
          return;
        }
        if (node.callee.object.type !== AST_NODE_TYPES.CallExpression) {
          return;
        }

        const zodSchemaMeta = detectZodSchemaRootNode(node);

        if (!zodSchemaMeta) {
          return;
        }

        if (
          ZOD_NON_SCHEMA_PRODUCING_METHODS.includes(zodSchemaMeta.schemaType)
        ) {
          return;
        }

        if (
          zodSchemaMeta.methods
            .slice(0, -1)
            .some((method) => ZOD_NON_SCHEMA_PRODUCING_METHODS.includes(method))
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
