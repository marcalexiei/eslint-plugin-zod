import type { TSESLint, TSESTree } from '@typescript-eslint/utils';

/**
 * Utility to generate a fixer for replacing a method chain like z.string().uuid() or z.number().int()
 * with z.uuid() or z.int(), preserving any intermediate methods.
 *
 * @param opts Object containing all options for the fixer
 * @returns Fixer replaceTextRange call
 */
export function buildZodChainReplacementFix(opts: {
  sourceCode: TSESLint.SourceCode;
  fixer: TSESLint.RuleFixer;
  methods: Array<{ name: string; node: TSESTree.CallExpression }>;
  fromIndex: number;
  toIndex: number;
  toMethodName: string;
}): TSESLint.RuleFix | null {
  const { sourceCode, fixer, methods, fromIndex, toIndex, toMethodName } = opts;
  // prettier-ignore
  const fromNode = methods[fromIndex]?.node as TSESTree.CallExpression | undefined;
  // prettier-ignore
  const toNode = methods[toIndex]?.node as TSESTree.CallExpression | undefined;

  if (!fromNode || !toNode) {
    return null;
  }

  // prefix is the namespace (e.g. "z")
  const fromCallee = fromNode.callee as TSESTree.MemberExpression;
  const prefixObj = fromCallee.object;
  const prefixText = sourceCode.getText(prefixObj);

  // Methods between number and int should be moved after .int()
  // Example: z.number().min(1).int() -> methodsBetween = [min]
  const methodsBetween = methods.slice(fromIndex + 1, toIndex);

  // For each intermediate method, extract only its ".name(args…)" suffix.
  // We do this by taking full text of the call expression and slicing off
  // the text of its callee.object (the part before the dot).
  const betweenSuffixes = methodsBetween.map((m) => {
    const betweenCallee = m.node.callee as TSESTree.MemberExpression;
    const objText = sourceCode.getText(betweenCallee.object);
    const fullText = sourceCode.getText(m.node);
    return fullText.slice(objText.length);
  });

  // Construct replacement: z.toMethodName() + betweenSuffixes
  let replacement = `${prefixText}.${toMethodName}(`;

  // Rebuild parameters
  if (toNode.arguments.length) {
    const argsText = toNode.arguments
      .map((arg) => sourceCode.getText(arg))
      .join(', ');

    replacement += argsText;
  }

  replacement += `)${betweenSuffixes.join('')}`;

  return fixer.replaceTextRange(
    [fromNode.range[0], toNode.range[1]],
    replacement,
  );
}
