import type { TSESTree } from '@typescript-eslint/utils';
import { AST_NODE_TYPES } from '@typescript-eslint/utils';

import { createZodPluginRule } from '../utils/create-plugin-rule.js';
import { createZodSchemaImportTrack } from '../utils/track-zod-schema-imports.js';

const {
  //
  zodImportAllowedSource,
  trackZodSchemaImports,
} = createZodSchemaImportTrack('zod');

/**
 * Check if a string schema node is used as the key schema (first argument) of z.record()
 * Transforms on record keys cause data loss, so we should not warn in this case
 */
function isRecordKeySchema(outermostNode: TSESTree.CallExpression): boolean {
  let current = outermostNode;

  // Traverse the parent chain to find if this is an argument to z.record()
  // We need to go up: .min(1) -> MemberExpression (.min) -> parent chain...
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  while (current.parent) {
    const { parent } = current;

    // If parent is a CallExpression, check if it's z.record()
    if (parent.type === AST_NODE_TYPES.CallExpression) {
      const callParent = parent;

      // Check if the parent call is a method call (callee is MemberExpression)
      if (callParent.callee.type === AST_NODE_TYPES.MemberExpression) {
        const memberExpr = callParent.callee as TSESTree.MemberExpression;

        // Get the property name (method name)
        const methodName =
          memberExpr.property.type === AST_NODE_TYPES.Identifier
            ? memberExpr.property.name
            : null;

        // If this is z.record(), check if we're the first argument
        if (methodName === 'record') {
          return (
            callParent.arguments.length > 0 &&
            callParent.arguments[0] === current
          );
        }
      }
    }

    // If parent is a MemberExpression, continue up the chain
    if (parent.type === AST_NODE_TYPES.MemberExpression) {
      const memberParent = parent as TSESTree.MemberExpression;

      current = memberParent as unknown as TSESTree.CallExpression;
      continue;
    }

    // Move to parent for arguments case
    current = parent as TSESTree.CallExpression;
  }

  return false;
}

export const preferStringSchemaWithTrim = createZodPluginRule({
  name: 'prefer-string-schema-with-trim',
  meta: {
    type: 'problem',
    fixable: 'code',
    docs: {
      zodImportAllowedSource,
      description:
        'Enforce `z.string().trim()` to prevent accidental leading/trailing whitespace',
    },
    messages: {
      addTrim: '`z.string()` schemas should use `.trim()`.',
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

        if (zodSchemaMeta?.schemaType !== 'string') {
          return;
        }

        // Skip if this string schema is the key schema of z.record()
        // because transforms on record keys cause data loss
        if (isRecordKeySchema(zodSchemaMeta.node)) {
          return;
        }

        const methods = collectZodChainMethods(zodSchemaMeta.node);

        if (methods.some((it) => it.name === 'trim')) {
          return;
        }

        if (zodSchemaMeta.schemaDecl === 'named') {
          context.report({
            node,
            messageId: 'addTrim',
          });
          return;
        }

        context.report({
          node,
          messageId: 'addTrim',
          fix(fixer) {
            const lastMethod = methods.at(0)!;
            return fixer.insertTextAfter(lastMethod.node, '.trim()');
          },
        });
      },
    };
  },
});
