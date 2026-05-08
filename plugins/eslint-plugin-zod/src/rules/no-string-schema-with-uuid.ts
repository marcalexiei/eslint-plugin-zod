import {
  buildZodChainReplacementFix,
  createZodSchemaImportTrack,
  zodImportScope,
} from '@eslint-zod/utils';

import { createZodPluginRule } from '../utils/create-plugin-rule.js';

const { trackZodSchemaImports } = createZodSchemaImportTrack(zodImportScope);

export const noStringSchemaWithUuid = createZodPluginRule({
  name: 'no-string-schema-with-uuid',
  meta: {
    fixable: 'code',
    type: 'problem',
    docs: {
      description:
        'Disallow usage of `z.string().uuid()` in favor of the dedicated `z.uuid()` schema',
      url: 'https://zod.dev/api#uuids',
    },
    messages: {
      useUuid: '`z.string().uuid()` is redundant. Use `z.uuid()` instead.',
    },
    schema: [],
  },
  defaultOptions: [],

  create(context) {
    const { sourceCode } = context;

    const {
      importDeclarationListener,
      detectZodSchemaRootNode,
      collectZodChainMethods,
    } = trackZodSchemaImports();

    return {
      ImportDeclaration: importDeclarationListener,

      CallExpression(node): void {
        const zodSchemaMeta = detectZodSchemaRootNode(node);

        // Only care about string schemas
        if (zodSchemaMeta?.schemaType !== 'string') {
          return;
        }

        // Collect the full chain from the outermost call (left-to-right)
        const methods = collectZodChainMethods(node);

        // find uuid position
        const uuidIndex = methods.findIndex((m) => m.name === 'uuid');

        if (uuidIndex === -1) {
          return;
        }

        const stringIndex = methods.findIndex((m) => m.name === 'string');

        // If it's a named import usage (e.g. `import { string } from 'zod'`), report but do not fix.
        if (zodSchemaMeta.schemaDecl === 'named') {
          context.report({
            node,
            messageId: 'useUuid',
          });
          return;
        }

        // Namespace import (e.g. z.string()) — prepare a fixer
        context.report({
          node,
          messageId: 'useUuid',
          fix(fixer) {
            return buildZodChainReplacementFix({
              sourceCode,
              fixer,
              methods,
              fromIndex: stringIndex,
              toIndex: uuidIndex,
              toMethodName: 'uuid',
            });
          },
        });
      },
    };
  },
});
