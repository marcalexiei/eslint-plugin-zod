import {
  createZodSchemaImportTrack,
  zodMiniImportScope,
} from '@eslint-zod/utils';

import { createZodMiniPluginRule } from '../utils/create-plugin-rule.js';

const { trackZodSchemaImports } =
  createZodSchemaImportTrack(zodMiniImportScope);

export const noUnknownSchema = createZodMiniPluginRule({
  name: 'no-unknown-schema',
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Disallow usage of `z.unknown()` in Zod Mini schemas',
    },
    messages: {
      noZUnknown:
        'Using `z.unknown()` is not allowed. Please use a more specific schema.',
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    const {
      //
      importDeclarationListener,
      detectZodSchemaRootNode,
    } = trackZodSchemaImports();

    return {
      ImportDeclaration: importDeclarationListener,
      CallExpression(node): void {
        const zodSchemaMeta = detectZodSchemaRootNode(node);

        if (zodSchemaMeta?.schemaType === 'unknown') {
          context.report({
            node,
            messageId: 'noZUnknown',
          });
        }
      },
    };
  },
});
