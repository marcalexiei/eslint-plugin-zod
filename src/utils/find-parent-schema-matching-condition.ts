import { AST_NODE_TYPES } from '@typescript-eslint/utils';
import type { TSESTree } from '@typescript-eslint/utils';

export function findParentSchemaMatchingCondition(
  outermostNode: TSESTree.CallExpression,
  options: {
    schemaName: string;
    condition: (node: TSESTree.CallExpression) => boolean;
  },
): boolean {
  const { schemaName, condition } = options;
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
        if (methodName === schemaName) {
          return condition(callParent);
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
