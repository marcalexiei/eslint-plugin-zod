import { AST_NODE_TYPES } from '@typescript-eslint/utils';

import { createZodPluginRule } from '../utils/create-plugin-rule.js';
import { createZodSchemaImportTrack } from '../utils/track-zod-schema-imports.js';

const {
  //
  zodImportAllowedSource,
  trackZodSchemaImports,
} = createZodSchemaImportTrack('zod');

export const noNumberSchemaWithIsInt = createZodPluginRule({
  name: 'no-number-schema-with-is-int',
  meta: {
    type: 'problem',
    // Note: `fixable` is intentionally omitted. There is no safe automatic fix
    // because converting `schema.isInt` to checking the `format` property requires
    // understanding the runtime context and intended behavior.
    docs: {
      zodImportAllowedSource,
      description:
        'Disallow using deprecated `isInt` on a Zod number schema; check the `format` property instead.',
    },
    messages: {
      useFormat:
        '`isInt` is deprecated. Check the `format` property on the number schema instead (or compare to `"int"` or `"float"`).',
    },
    schema: [],
  },
  defaultOptions: [],

  create(context) {
    const { importDeclarationListener, isZodNumberSchemaCallExpression } =
      trackZodSchemaImports();

    return {
      ImportDeclaration: importDeclarationListener,

      MemberExpression(node): void {
        if (node.computed) {
          return;
        }
        if (node.property.type !== AST_NODE_TYPES.Identifier) {
          return;
        }
        if (node.property.name !== 'isInt') {
          return;
        }
        if (node.object.type !== AST_NODE_TYPES.CallExpression) {
          return;
        }
        if (!isZodNumberSchemaCallExpression(node.object)) {
          return;
        }

        context.report({
          node,
          messageId: 'useFormat',
        });
      },
    };
  },
});
