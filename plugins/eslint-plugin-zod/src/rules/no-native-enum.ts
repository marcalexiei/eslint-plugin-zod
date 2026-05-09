import { createZodSchemaImportTrack, zodImportScope } from '@eslint-zod/utils';
import { AST_NODE_TYPES } from '@typescript-eslint/utils';

import { createZodPluginRule } from '../utils/create-plugin-rule.js';

const { trackZodSchemaImports } = createZodSchemaImportTrack(zodImportScope);

export const noNativeEnum = createZodPluginRule({
  name: 'no-native-enum',
  meta: {
    type: 'problem',
    fixable: 'code',
    docs: {
      description:
        'Disallow deprecated `z.nativeEnum()` in favor of `z.enum()`.',
    },
    messages: {
      useEnum:
        '`z.nativeEnum()` is deprecated in Zod 4. Use `z.enum()` instead.',
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    const {
      importDeclarationListener,
      detectZodSchemaRootNode,
      collectZodChainMethods,
      getNamedImportOriginal,
    } = trackZodSchemaImports();

    return {
      ImportDeclaration: importDeclarationListener,

      CallExpression(node): void {
        const zodSchema = detectZodSchemaRootNode(node);
        const methods = zodSchema
          ? collectZodChainMethods(zodSchema.node)
          : undefined;
        const rootMethod = methods?.[0];

        const isNativeEnumRoot =
          zodSchema?.schemaDecl === 'namespace'
            ? rootMethod?.name === 'nativeEnum'
            : getNamedImportOriginal(rootMethod?.name ?? '') === 'nativeEnum';

        if (!zodSchema || !isNativeEnumRoot) {
          return;
        }

        // For named imports (e.g., `nativeEnum().optional()`), we cannot safely auto-fix
        // because replacing the entire chain would require access to the namespace prefix.
        // Report the error without a fix in this case.
        if (zodSchema.schemaDecl === 'named') {
          context.report({
            node,
            messageId: 'useEnum',
          });
          return;
        }

        context.report({
          node,
          messageId: 'useEnum',
          fix(fixer) {
            if (
              rootMethod?.node.callee.type !==
                AST_NODE_TYPES.MemberExpression ||
              rootMethod.node.callee.property.type !== AST_NODE_TYPES.Identifier
            ) {
              return null;
            }

            return fixer.replaceText(rootMethod.node.callee.property, 'enum');
          },
        });
      },
    };
  },
});
