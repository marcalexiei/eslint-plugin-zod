import type { TSESLint } from '@typescript-eslint/utils';

import { createZodSchemaImportTrack } from '../track-zod-schema-imports.js';
import type { ZodImportScope } from '../zod-import-scope.js';

export function buildNoUnknownSchemaCreate(
  scope: ZodImportScope,
): (context: Readonly<TSESLint.RuleContext<'noZUnknown', []>>) => TSESLint.RuleListener {
  const { trackZodSchemaImports } = createZodSchemaImportTrack(scope);

  return function create(context) {
    const { importDeclarationListener, detectZodSchemaRootNode } = trackZodSchemaImports();

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
  };
}
