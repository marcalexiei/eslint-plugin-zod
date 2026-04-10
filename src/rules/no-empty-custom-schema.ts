import { createZodPluginRule } from '../utils/create-plugin-rule.js';
import { createZodSchemaImportTrack } from '../utils/track-zod-schema-imports.js';

const {
  //
  zodImportAllowedSource,
  trackZodSchemaImports,
} = createZodSchemaImportTrack('all');

export const noEmptyCustomSchema = createZodPluginRule({
  name: 'no-empty-custom-schema',
  meta: {
    hasSuggestions: false,
    type: 'suggestion',
    docs: {
      zodImportAllowedSource,
      description: 'Disallow usage of `z.custom()` without arguments',
    },
    messages: {
      noEmptyCustomSchema:
        'You should provide a validate function within `z.custom()`',
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    const {
      //
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

        if (zodSchemaMeta.schemaType !== 'custom') {
          return;
        }

        // Find the actual custom() call node in the chain
        const chainMethods = collectZodChainMethods(node);
        const customCallNode = chainMethods.find(
          (method) => method.name === 'custom',
        )?.node;

        if (customCallNode?.arguments.length === 0) {
          context.report({
            node: customCallNode,
            messageId: 'noEmptyCustomSchema',
          });
        }
      },
    };
  },
});
