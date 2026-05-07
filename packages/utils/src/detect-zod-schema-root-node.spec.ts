import { AST_NODE_TYPES } from '@typescript-eslint/utils';
import type { TSESTree } from '@typescript-eslint/utils';
import { describe, expect, it } from 'vitest';

import {
  detectZodSchemaRootNode,
  isZodNumberSchemaCallExpression,
} from './detect-zod-schema-root-node.js';

// --- minimal AST mock helpers ---

function makeIdent(name: string): TSESTree.Identifier {
  return {
    type: AST_NODE_TYPES.Identifier,
    name,
  } as unknown as TSESTree.Identifier;
}

function makeME(
  object: TSESTree.Expression,
  propertyName: string,
): TSESTree.MemberExpression {
  return {
    type: AST_NODE_TYPES.MemberExpression,
    object,
    property: makeIdent(propertyName),
    computed: false,
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

/** Sets node.parent to a non-call, non-member parent so it passes isOutermostCallExpression. */
function setOutermostParent(node: TSESTree.CallExpression): void {
  (node as unknown as Record<string, unknown>).parent = {
    type: AST_NODE_TYPES.ExpressionStatement,
  };
}

const zodNamespaces = new Set(['z']);
const zodNamedImports = new Set(['string', 'number', 'array']);

describe('detectZodSchemaRootNode', () => {
  it('returns null for non-CallExpression nodes', () => {
    const node = makeIdent('z') as unknown as TSESTree.Node;
    expect(
      detectZodSchemaRootNode(node, zodNamespaces, zodNamedImports),
    ).toBeNull();
  });

  it('returns null when the call is not the outermost in a chain', () => {
    // z.number() is not outermost because z.number().min(1) chains on top of it
    const numberCall = makeCall(makeME(makeIdent('z'), 'number'));
    const minCall = makeCall(makeME(numberCall, 'min'));
    // numberCall's parent is the MemberExpression z.number().min
    const minME = minCall.callee as TSESTree.MemberExpression;
    (numberCall as unknown as Record<string, unknown>).parent = minME;

    expect(
      detectZodSchemaRootNode(numberCall, zodNamespaces, zodNamedImports),
    ).toBeNull();
  });

  it('returns null for calls not in zodNamespaces or zodNamedImports', () => {
    const call = makeCall(makeME(makeIdent('notZod'), 'string'));
    setOutermostParent(call);
    expect(
      detectZodSchemaRootNode(call, zodNamespaces, zodNamedImports),
    ).toBeNull();
  });

  it('detects namespace style: z.string()', () => {
    const call = makeCall(makeME(makeIdent('z'), 'string'));
    setOutermostParent(call);

    const result = detectZodSchemaRootNode(
      call,
      zodNamespaces,
      zodNamedImports,
    );

    expect(result).not.toBeNull();
    expect(result?.schemaDecl).toBe('namespace');
    expect(result?.schemaType).toBe('string');
    expect(result?.methods).toStrictEqual(['string']);
    expect(result?.node).toBe(call);
  });

  it('detects namespace style with chain: z.number().min(1)', () => {
    const numberCall = makeCall(makeME(makeIdent('z'), 'number'));
    const minCall = makeCall(makeME(numberCall, 'min'), [
      { type: AST_NODE_TYPES.Literal, value: 1 } as unknown as TSESTree.Literal,
    ]);
    setOutermostParent(minCall);

    const result = detectZodSchemaRootNode(
      minCall,
      zodNamespaces,
      zodNamedImports,
    );

    expect(result?.schemaDecl).toBe('namespace');
    expect(result?.schemaType).toBe('number');
    expect(result?.methods).toStrictEqual(['number', 'min']);
    expect(result?.node).toBe(minCall);
  });

  it('detects named import style: string()', () => {
    const call = makeCall(makeIdent('string'));
    setOutermostParent(call);

    const result = detectZodSchemaRootNode(
      call,
      zodNamespaces,
      zodNamedImports,
    );

    expect(result?.schemaDecl).toBe('named');
    expect(result?.schemaType).toBe('string');
    expect(result?.methods).toStrictEqual([]);
    expect(result?.node).toBe(call);
  });

  it('detects named import chain: string().optional()', () => {
    const stringCall = makeCall(makeIdent('string'));
    const optCall = makeCall(makeME(stringCall, 'optional'));
    setOutermostParent(optCall);

    const result = detectZodSchemaRootNode(
      optCall,
      zodNamespaces,
      zodNamedImports,
    );

    expect(result?.schemaDecl).toBe('named');
    expect(result?.schemaType).toBe('string');
    expect(result?.methods).toStrictEqual(['optional']);
  });
});

describe('isZodNumberSchemaCallExpression', () => {
  it('returns false for non-CallExpression', () => {
    expect(
      isZodNumberSchemaCallExpression(
        makeIdent('z'),
        zodNamespaces,
        zodNamedImports,
      ),
    ).toBe(false);
  });

  it('returns true for z.number()', () => {
    const call = makeCall(makeME(makeIdent('z'), 'number'));
    expect(
      isZodNumberSchemaCallExpression(call, zodNamespaces, zodNamedImports),
    ).toBe(true);
  });

  it('returns true for z.number().min(1) (inner call)', () => {
    const numberCall = makeCall(makeME(makeIdent('z'), 'number'));
    expect(
      isZodNumberSchemaCallExpression(
        numberCall,
        zodNamespaces,
        zodNamedImports,
      ),
    ).toBe(true);
  });

  it('returns false for z.string()', () => {
    const call = makeCall(makeME(makeIdent('z'), 'string'));
    expect(
      isZodNumberSchemaCallExpression(call, zodNamespaces, zodNamedImports),
    ).toBe(false);
  });

  it('returns true for named import number()', () => {
    const call = makeCall(makeIdent('number'));
    expect(
      isZodNumberSchemaCallExpression(call, zodNamespaces, zodNamedImports),
    ).toBe(true);
  });
});
