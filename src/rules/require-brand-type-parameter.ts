import type { TSESLint, TSESTree } from '@typescript-eslint/utils';

import { createZodPluginRule } from '../utils/create-plugin-rule.js';
import { createZodSchemaImportTrack } from '../utils/track-zod-schema-imports.js';

const {
  //
  zodImportAllowedSource,
  trackZodSchemaImports,
} = createZodSchemaImportTrack('all');

export const requireBrandTypeParameter = createZodPluginRule({
  name: 'require-brand-type-parameter',
  meta: {
    hasSuggestions: true,
    type: 'problem',
    docs: {
      zodImportAllowedSource,
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
  create(context) {
    const {
      importDeclarationListener,
      detectZodSchemaRootNode,
      collectZodChainMethods,
    } = trackZodSchemaImports();

    return {
      ImportDeclaration: importDeclarationListener,
      CallExpression(node): void {
        const zodSchemaMeta = detectZodSchemaRootNode(node);
        if (!zodSchemaMeta) {
          return;
        }

        const methods = collectZodChainMethods(zodSchemaMeta.node);

        const brandMethod = methods.find((it) => it.name === 'brand');

        if (!brandMethod) {
          return;
        }

        const brandNode = brandMethod.node;

        const { typeArguments } = brandNode;

        if (typeArguments && typeArguments.params.length > 0) {
          return;
        }

        const brandCalleeNode = brandNode.callee as TSESTree.MemberExpression;

        context.report({
          messageId: 'missingTypeParameter',
          node: brandCalleeNode.property,
          suggest: [
            {
              messageId: 'removeBrandFunction',
              fix(fixer): TSESLint.RuleFix {
                return fixer.removeRange([
                  brandCalleeNode.object.range[1],
                  brandNode.range[1],
                ]);
              },
            },
          ],
        });
      },
    };
  },
});
