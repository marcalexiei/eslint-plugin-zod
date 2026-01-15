import type { TSESTree } from '@typescript-eslint/utils';
import { AST_NODE_TYPES, ESLintUtils } from '@typescript-eslint/utils';

import { getRuleURL } from '../meta.js';
import { trackZodSchemaImports } from '../utils/track-zod-schema-imports.js';

export const preferEnumOverLiteralUnion = ESLintUtils.RuleCreator(getRuleURL)({
  name: 'prefer-enum-over-literal-union',
  meta: {
    type: 'suggestion',
    fixable: 'code',
    docs: {
      description:
        'Prefer `z.enum()` over `z.union()` when all members are string literals.',
    },
    messages: {
      useEnum: 'Replace this union of string literals with `z.enum()`.',
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    const {
      //
      importDeclarationListener,
      detectZodSchemaRootNode,
    } = trackZodSchemaImports();

    return {
      ImportDeclaration: importDeclarationListener,
      CallExpression(node): void {
        const zodSchema = detectZodSchemaRootNode(node);
        if (zodSchema?.schemaType !== 'union') {
          return;
        }

        const unionArgument = node.arguments.at(0);
        if (unionArgument?.type !== AST_NODE_TYPES.ArrayExpression) {
          return;
        }

        /**
         * Collect zod literals name that later can be used to implement the fix,
         * if the item isn't a literal schema return null
         */
        const zodLiteralStrings = unionArgument.elements.map<string | null>(
          (s) => {
            if (!s) {
              return null;
            }
            const maybeLiteralSchema = detectZodSchemaRootNode(s);
            if (maybeLiteralSchema?.schemaType !== 'literal') {
              return null;
            }

            const [literalArgument] = maybeLiteralSchema.node.arguments;
            if (
              literalArgument.type === AST_NODE_TYPES.Literal &&
              // Literal could be also a number
              typeof literalArgument.value === 'string'
            ) {
              // Use raw to keep the string format consistent with the original source
              return literalArgument.raw;
            }

            return null;
          },
        );

        // if memberZodLiterals contains a null items means that at least one of the items
        // isn't a literal schema so stop processing this declaration
        if (zodLiteralStrings.some((it) => it === null)) {
          return;
        }

        if (zodSchema.schemaDecl === 'named') {
          context.report({
            node,
            messageId: 'useEnum',
          });
          return;
        }

        context.report({
          node,
          messageId: 'useEnum',
          fix(fixer) {
            return [
              // Replace just the name of the method.
              // The object property might have a named different from z.
              fixer.replaceText(
                (node.callee as TSESTree.MemberExpression).property,
                'enum',
              ),
              // replace parameters with just the literals
              fixer.replaceText(
                node.arguments[0],
                `[${zodLiteralStrings.join(', ')}]`,
              ),
            ];
          },
        });
      },
    };
  },
});
