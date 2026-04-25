import { AST_NODE_TYPES } from '@typescript-eslint/utils';

import { createZodPluginRule } from '../utils/create-plugin-rule.js';
import { createZodSchemaImportTrack } from '../utils/track-zod-schema-imports.js';

const {
  //
  zodImportAllowedSource,
  trackZodSchemaImports,
} = createZodSchemaImportTrack('zod');

export const noNumberSchemaWithIsFinite = createZodPluginRule({
  name: 'no-number-schema-with-is-finite',
  meta: {
    type: 'problem',
    // Note: `fixable` is intentionally omitted. There is no safe automatic fix
    // because `isFinite` is a deprecated property access that always returns true
    // in v4+. Automatically removing it could change code semantics.
    docs: {
      zodImportAllowedSource,
      description:
        'Disallow using deprecated `isFinite` on a Zod number schema; in v4+ it is always `true`.',
    },
    messages: {
      deprecated:
        '`isFinite` is deprecated. Number schemas no longer accept infinite values, so this is always `true` for `z.number()`.',
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
        if (node.property.name !== 'isFinite') {
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
          messageId: 'deprecated',
        });
      },
    };
  },
});
