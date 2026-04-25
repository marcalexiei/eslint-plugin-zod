import { buildZodChainReplacementFix } from '../utils/build-zod-chain-replacement-fix.js';
import { createZodPluginRule } from '../utils/create-plugin-rule.js';
import { createZodSchemaImportTrack } from '../utils/track-zod-schema-imports.js';

const {
  //
  zodImportAllowedSource,
  trackZodSchemaImports,
} = createZodSchemaImportTrack('zod');

export const noNumberSchemaWithSafe = createZodPluginRule({
  name: 'no-number-schema-with-safe',
  meta: {
    fixable: 'code',
    type: 'problem',
    docs: {
      zodImportAllowedSource,
      description:
        'Disallow deprecated `z.number().safe()`. Use `z.int()`; `.safe()` is now identical to `.int()`.',
    },
    messages: {
      useInt:
        '`.safe()` is deprecated; it is identical to `.int()`. Use `z.int()` (or the equivalent) instead of chaining `.safe()` on `z.number()`.',
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

        if (zodSchemaMeta?.schemaType !== 'number') {
          return;
        }

        const methods = collectZodChainMethods(node);
        const safeIndex = methods.findIndex(
          (m) => m.name === 'safe' && m.node === node,
        );
        if (safeIndex === -1) {
          return;
        }

        const numberIndex = methods.findIndex((m) => m.name === 'number');

        // For named imports (e.g., `number().safe()`), we cannot safely auto-fix
        // because replacing the entire chain would require access to the namespace prefix.
        // Report the error without a fix in this case.
        if (zodSchemaMeta.schemaDecl === 'named') {
          context.report({
            node,
            messageId: 'useInt',
          });
          return;
        }

        context.report({
          node,
          messageId: 'useInt',
          fix(fixer) {
            return buildZodChainReplacementFix({
              sourceCode,
              fixer,
              methods,
              fromIndex: numberIndex,
              toIndex: safeIndex,
              toMethodName: 'int',
            });
          },
        });
      },
    };
  },
});
