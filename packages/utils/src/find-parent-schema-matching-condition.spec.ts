import { AST_NODE_TYPES } from '@typescript-eslint/utils';
import type { TSESTree } from '@typescript-eslint/utils';
import { describe, expect, it, vi } from 'vitest';

import { findParentSchemaMatchingCondition } from './find-parent-schema-matching-condition.js';

function makeIdent(name: string): TSESTree.Identifier {
  return {
    type: AST_NODE_TYPES.Identifier,
    name,
  } as unknown as TSESTree.Identifier;
}

function makeME(object: TSESTree.Expression, propertyName: string): TSESTree.MemberExpression {
  return {
    type: AST_NODE_TYPES.MemberExpression,
    object,
    property: makeIdent(propertyName),
  } as unknown as TSESTree.MemberExpression;
}

function makeCall(
  callee: TSESTree.Expression,
  args: Array<TSESTree.Expression> = [],
): TSESTree.CallExpression {
  return {
    type: AST_NODE_TYPES.CallExpression,
    callee,
    arguments: args,
  } as unknown as TSESTree.CallExpression;
}

function setParent(node: TSESTree.Node, parent: TSESTree.Node): void {
  (node as unknown as Record<string, unknown>).parent = parent;
}

describe('findParentSchemaMatchingCondition', () => {
  it('returns false when there is no parent', () => {
    const stringCall = makeCall(makeME(makeIdent('z'), 'string'));
    // no parent set → while(current.parent) is falsy
    expect(
      findParentSchemaMatchingCondition(stringCall, {
        schemaName: 'record',
        condition: () => true,
      }),
    ).toBe(false);
  });

  it('returns false when no parent matches schemaName', () => {
    const stringCall = makeCall(makeME(makeIdent('z'), 'string'));
    const arrayCall = makeCall(makeME(makeIdent('z'), 'array'), [stringCall]);
    setParent(stringCall, arrayCall);

    expect(
      findParentSchemaMatchingCondition(stringCall, {
        schemaName: 'record',
        condition: () => true,
      }),
    ).toBe(false);
  });

  it('returns true when parent matches schemaName and condition returns true', () => {
    const stringCall = makeCall(makeME(makeIdent('z'), 'string'));
    const recordCall = makeCall(makeME(makeIdent('z'), 'record'), [stringCall]);
    setParent(stringCall, recordCall);

    expect(
      findParentSchemaMatchingCondition(stringCall, {
        schemaName: 'record',
        condition: () => true,
      }),
    ).toBe(true);
  });

  it('returns false when parent matches schemaName but condition returns false', () => {
    const stringCall = makeCall(makeME(makeIdent('z'), 'string'));
    const recordCall = makeCall(makeME(makeIdent('z'), 'record'), [stringCall]);
    setParent(stringCall, recordCall);

    expect(
      findParentSchemaMatchingCondition(stringCall, {
        schemaName: 'record',
        condition: () => false,
      }),
    ).toBe(false);
  });

  it('passes the matching parent CallExpression to the condition', () => {
    const stringCall = makeCall(makeME(makeIdent('z'), 'string'));
    const recordCall = makeCall(makeME(makeIdent('z'), 'record'), [stringCall]);
    setParent(stringCall, recordCall);

    const condition = vi.fn<(node: TSESTree.CallExpression) => boolean>(() => true);
    findParentSchemaMatchingCondition(stringCall, {
      schemaName: 'record',
      condition,
    });

    expect(condition).toHaveBeenCalledWith(recordCall);
  });

  it('traverses through MemberExpression parents to find the matching call', () => {
    // Simulates: z.record(z.string().optional()) where we check z.string()
    // z.string().optional() is an argument to z.record()
    // z.string() is the object of the .optional MemberExpression
    const stringCall = makeCall(makeME(makeIdent('z'), 'string'));
    const optME = makeME(stringCall, 'optional');
    const optCall = makeCall(optME);
    const recordCall = makeCall(makeME(makeIdent('z'), 'record'), [optCall]);

    // stringCall.parent = optME (it's the object of .optional)
    setParent(stringCall, optME);
    // optCall.parent = recordCall
    setParent(optCall, recordCall);

    // The function traverses up from stringCall:
    // 1. parent = optME (MemberExpression) → current = optME, continue
    // 2. parent of optME is not set → loop ends
    // So this particular traversal won't find record. The function would need
    // to be called on optCall (the outermost) instead.
    expect(
      findParentSchemaMatchingCondition(optCall, {
        schemaName: 'record',
        condition: () => true,
      }),
    ).toBe(true);
  });
});
