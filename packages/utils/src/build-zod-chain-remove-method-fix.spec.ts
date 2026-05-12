import type { TSESLint, TSESTree } from '@typescript-eslint/utils';
import { describe, expect, it } from 'vitest';

import { buildZodChainRemoveMethodFix } from './build-zod-chain-remove-method-fix.js';

function makeNodeWithRange(start: number, end: number): TSESTree.CallExpression {
  return { range: [start, end] } as unknown as TSESTree.CallExpression;
}

function makeFixer(): {
  fixer: TSESLint.RuleFixer;
  calls: { removeRange?: [number, number] };
} {
  const calls: { removeRange?: [number, number] } = {};
  const fixer = {
    removeRange(range: [number, number]) {
      calls.removeRange = range;
      return { range };
    },
  } as unknown as TSESLint.RuleFixer;
  return { fixer, calls };
}

describe('buildZodChainRemoveMethodFix', () => {
  it('returns null when removeIndex < 1', () => {
    const { fixer } = makeFixer();
    const methods = [{ name: 'number', node: makeNodeWithRange(0, 10) }];
    expect(buildZodChainRemoveMethodFix({ fixer, methods, removeIndex: 0 })).toBeNull();
  });

  it('returns null when removeIndex is negative', () => {
    const { fixer } = makeFixer();
    const methods = [{ name: 'number', node: makeNodeWithRange(0, 10) }];
    expect(buildZodChainRemoveMethodFix({ fixer, methods, removeIndex: -1 })).toBeNull();
  });

  it('returns null when the target node has no range', () => {
    const { fixer } = makeFixer();
    const methods = [
      { name: 'number', node: makeNodeWithRange(0, 10) },
      { name: 'finite', node: {} as unknown as TSESTree.CallExpression },
    ];
    expect(buildZodChainRemoveMethodFix({ fixer, methods, removeIndex: 1 })).toBeNull();
  });

  it('removes a trailing method: z.number().min(0).finite()', () => {
    // ranges: z.number() = [0,10], z.number().min(0) = [0,18], z.number().min(0).finite() = [0,27]
    const { fixer, calls } = makeFixer();
    const methods = [
      { name: 'number', node: makeNodeWithRange(0, 10) },
      { name: 'min', node: makeNodeWithRange(0, 18) },
      { name: 'finite', node: makeNodeWithRange(0, 27) },
    ];
    buildZodChainRemoveMethodFix({ fixer, methods, removeIndex: 2 });
    // removes from end of methods[1] to end of methods[2]
    expect(calls.removeRange).toStrictEqual([18, 27]);
  });

  it('removes a middle method', () => {
    const { fixer, calls } = makeFixer();
    const methods = [
      { name: 'number', node: makeNodeWithRange(0, 10) },
      { name: 'min', node: makeNodeWithRange(0, 18) },
      { name: 'finite', node: makeNodeWithRange(0, 27) },
    ];
    buildZodChainRemoveMethodFix({ fixer, methods, removeIndex: 1 });
    expect(calls.removeRange).toStrictEqual([10, 18]);
  });
});
