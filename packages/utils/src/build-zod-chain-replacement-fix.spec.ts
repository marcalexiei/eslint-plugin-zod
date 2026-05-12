import type { TSESLint, TSESTree } from '@typescript-eslint/utils';
import { AST_NODE_TYPES } from '@typescript-eslint/utils';
import { describe, expect, it } from 'vitest';

import { buildZodChainReplacementFix } from './build-zod-chain-replacement-fix.js';

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
  range: [number, number] = [0, 0],
): TSESTree.CallExpression {
  return {
    type: AST_NODE_TYPES.CallExpression,
    callee,
    arguments: args,
    range,
  } as unknown as TSESTree.CallExpression;
}

function makeSourceCode(textMap: Map<TSESTree.Node, string>): TSESLint.SourceCode {
  return {
    getText: (node: TSESTree.Node) => textMap.get(node) ?? '',
  } as unknown as TSESLint.SourceCode;
}

function makeFixer(): {
  fixer: TSESLint.RuleFixer;
  calls: { replaceTextRange?: { range: [number, number]; text: string } };
} {
  const calls: {
    replaceTextRange?: { range: [number, number]; text: string };
  } = {};
  const fixer = {
    replaceTextRange(range: [number, number], text: string) {
      calls.replaceTextRange = { range, text };
      return { range, text };
    },
  } as unknown as TSESLint.RuleFixer;
  return { fixer, calls };
}

describe('buildZodChainReplacementFix', () => {
  it('returns null when fromIndex node is missing', () => {
    const { fixer } = makeFixer();
    const sourceCode = makeSourceCode(new Map());
    expect(
      buildZodChainReplacementFix({
        sourceCode,
        fixer,
        methods: [],
        fromIndex: 0,
        toIndex: 1,
        toMethodName: 'int',
      }),
    ).toBeNull();
  });

  it('returns null when toIndex node is missing', () => {
    const zIdent = makeIdent('z');
    const numberCall = makeCall(makeME(zIdent, 'number'), [], [0, 10]);
    const textMap = new Map<TSESTree.Node, string>([[zIdent, 'z']]);
    const { fixer } = makeFixer();

    expect(
      buildZodChainReplacementFix({
        sourceCode: makeSourceCode(textMap),
        fixer,
        methods: [{ name: 'number', node: numberCall }],
        fromIndex: 0,
        toIndex: 1,
        toMethodName: 'int',
      }),
    ).toBeNull();
  });

  it('replaces z.number().int() → z.int() (no between methods, no args)', () => {
    const zIdent = makeIdent('z');
    const numberCall = makeCall(makeME(zIdent, 'number'), [], [0, 10]);
    const intCall = makeCall(makeME(numberCall, 'int'), [], [0, 16]);

    const textMap = new Map<TSESTree.Node, string>([[zIdent, 'z']]);
    const { fixer, calls } = makeFixer();

    buildZodChainReplacementFix({
      sourceCode: makeSourceCode(textMap),
      fixer,
      methods: [
        { name: 'number', node: numberCall },
        { name: 'int', node: intCall },
      ],
      fromIndex: 0,
      toIndex: 1,
      toMethodName: 'int',
    });

    expect(calls.replaceTextRange?.text).toBe('z.int()');
    expect(calls.replaceTextRange?.range).toStrictEqual([0, 16]);
  });

  it('replaces z.number().min(1).int() → z.int().min(1) (with between method)', () => {
    const zIdent = makeIdent('z');
    const numberCall = makeCall(makeME(zIdent, 'number'), [], [0, 10]);
    const minArg = {
      type: AST_NODE_TYPES.Literal,
      value: 1,
      raw: '1',
    } as unknown as TSESTree.Literal;
    const minCall = makeCall(makeME(numberCall, 'min'), [minArg], [0, 18]);
    const intCall = makeCall(makeME(minCall, 'int'), [], [0, 24]);

    const textMap = new Map<TSESTree.Node, string>([
      [zIdent, 'z'],
      [numberCall, 'z.number()'],
      [minCall, 'z.number().min(1)'],
      [minArg, '1'],
    ]);
    const { fixer, calls } = makeFixer();

    buildZodChainReplacementFix({
      sourceCode: makeSourceCode(textMap),
      fixer,
      methods: [
        { name: 'number', node: numberCall },
        { name: 'min', node: minCall },
        { name: 'int', node: intCall },
      ],
      fromIndex: 0,
      toIndex: 2,
      toMethodName: 'int',
    });

    expect(calls.replaceTextRange?.text).toBe('z.int().min(1)');
    expect(calls.replaceTextRange?.range).toStrictEqual([0, 24]);
  });

  it('preserves args on the replacement method: z.number().min(0) → z.min(0)', () => {
    const zIdent = makeIdent('z');
    const numberCall = makeCall(makeME(zIdent, 'number'), [], [0, 10]);
    const minArg = {
      type: AST_NODE_TYPES.Literal,
      value: 0,
      raw: '0',
    } as unknown as TSESTree.Literal;
    const minCall = makeCall(makeME(numberCall, 'min'), [minArg], [0, 18]);

    const textMap = new Map<TSESTree.Node, string>([
      [zIdent, 'z'],
      [minArg, '0'],
    ]);
    const { fixer, calls } = makeFixer();

    buildZodChainReplacementFix({
      sourceCode: makeSourceCode(textMap),
      fixer,
      methods: [
        { name: 'number', node: numberCall },
        { name: 'min', node: minCall },
      ],
      fromIndex: 0,
      toIndex: 1,
      toMethodName: 'min',
    });

    expect(calls.replaceTextRange?.text).toBe('z.min(0)');
  });
});
