import { buildZodChainRemoveMethodFix } from '../utils/build-zod-chain-remove-method-fix.js';
import { createZodPluginRule } from '../utils/create-plugin-rule.js';
import { createZodSchemaImportTrack } from '../utils/track-zod-schema-imports.js';

const {
  //
  zodImportAllowedSource,
  trackZodSchemaImports,
} = createZodSchemaImportTrack('zod');

export const noNumberSchemaWithFinite = createZodPluginRule({
  name: 'no-number-schema-with-finite',
  meta: {
    fixable: 'code',
    type: 'problem',
    docs: {
      zodImportAllowedSource,
      description:
        'Disallow deprecated `z.number().finite()`. In Zod 4+ number schemas do not allow infinite values by default, so it is a no-op.',
    },
    messages: {
      removeFinite:
        '`.finite()` is deprecated. In Zod 4+ `z.number()` does not allow infinite values by default. Remove this call.',
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

        if (zodSchemaMeta?.schemaType !== 'number') {
          return;
        }

        const methods = collectZodChainMethods(node);
        const finiteIndex = methods.findIndex(
          (m) => m.name === 'finite' && m.node === node,
        );
        if (finiteIndex === -1) {
          return;
        }

        context.report({
          node,
          messageId: 'removeFinite',
          fix(fixer) {
            return buildZodChainRemoveMethodFix({
              fixer,
              methods,
              removeIndex: finiteIndex,
            });
          },
        });
      },
    };
  },
});
