import {
  ZOD_NON_SCHEMA_PRODUCING_METHODS,
  createZodSchemaImportTrack,
  zodMiniImportScope,
} from '@eslint-zod/utils';
import { AST_NODE_TYPES } from '@typescript-eslint/utils';

import { createZodMiniPluginRule } from '../utils/create-plugin-rule.js';

interface Options {
  before?: string;
  after?: string;
}

type MessageIds = 'invalidName';

const { trackZodSchemaImports } = createZodSchemaImportTrack(zodMiniImportScope);

export const consistentSchemaVarName = createZodMiniPluginRule<[Options], MessageIds>({
  name: 'consistent-schema-var-name',
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Enforce a consistent naming convention for Zod Mini schema variables',
    },
    messages: {
      invalidName: 'Rename this Zod Mini schema to "{{expected}}"',
    },
    schema: [
      {
        type: 'object',
        properties: {
          before: {
            type: 'string',
            description: 'The required prefix for Zod Mini schema variables',
          },
          after: {
            type: 'string',
            description: 'The required suffix for Zod Mini schema variables',
          },
        },
        additionalProperties: false,
      },
    ],
  },
  defaultOptions: [{ after: 'Schema' }],
  create(context, [{ before = '', after = '' }]) {
    const { importDeclarationListener, detectZodSchemaRootNode, collectZodChainMethods } =
      trackZodSchemaImports();

    return {
      ImportDeclaration: importDeclarationListener,
      VariableDeclarator(node): void {
        const initNode = node.init;

        if (
          initNode?.type !== AST_NODE_TYPES.CallExpression ||
          !detectZodSchemaRootNode(initNode)
        ) {
          return;
        }

        const chainMethods = collectZodChainMethods(initNode).map((it) => it.name);

        if (ZOD_NON_SCHEMA_PRODUCING_METHODS.some((it) => chainMethods.includes(it))) {
          return;
        }

        if (node.id.type !== AST_NODE_TYPES.Identifier) {
          return;
        }

        const { name } = node.id;
        const validPrefix = !before || name.startsWith(before);
        const validSuffix = !after || name.endsWith(after);

        if (validPrefix && validSuffix) {
          return;
        }

        const expected = (validPrefix ? '' : before) + name + (validSuffix ? '' : after);

        context.report({
          node,
          messageId: 'invalidName',
          data: { expected },
        });
      },
    };
  },
});
