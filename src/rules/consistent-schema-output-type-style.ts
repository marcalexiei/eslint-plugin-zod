import type { TSESTree } from '@typescript-eslint/utils';
import { AST_NODE_TYPES } from '@typescript-eslint/utils';

import { createZodPluginRule } from '../utils/create-plugin-rule.js';
import { createZodSchemaImportTrack } from '../utils/track-zod-schema-imports.js';

const ZOD_SCHEMA_TYPE_STYLES = ['infer', 'output'] as const;

type SchemaTypeStyle = (typeof ZOD_SCHEMA_TYPE_STYLES)[number];

interface Options {
  style: SchemaTypeStyle;
}

type MessageIds = 'useInfer' | 'useOutput';

const {
  //
  zodImportAllowedSource,
  trackZodSchemaImports,
} = createZodSchemaImportTrack('all');

export const consistentSchemaOutputTypeStyle = createZodPluginRule<
  [Options],
  MessageIds
>({
  name: 'consistent-schema-output-type-style',
  meta: {
    type: 'suggestion',
    fixable: 'code',
    docs: {
      zodImportAllowedSource,
      description:
        'Enforce consistent use of z.infer or z.output for schema type inference',
    },
    messages: {
      useInfer: 'Use infer instead of output.',
      useOutput: 'Use output instead of infer.',
    },
    schema: [
      {
        type: 'object',
        properties: {
          style: {
            description: 'Decides which style to use for schema type inference',
            type: 'string',
            enum: [...ZOD_SCHEMA_TYPE_STYLES],
          },
        },
        additionalProperties: false,
      },
    ],
  },
  defaultOptions: [{ style: 'output' }],
  create(context, [{ style }]) {
    const {
      importDeclarationListener,
      isZodNamespace,
      getNamedImportOriginal,
      getNamedImportLocal,
    } = trackZodSchemaImports();

    return {
      ImportDeclaration: importDeclarationListener,

      TSTypeReference(node: TSESTree.TSTypeReference): void {
        const { typeName } = node;

        if (typeName.type === AST_NODE_TYPES.TSQualifiedName) {
          const { left, right } = typeName;

          if (
            left.type !== AST_NODE_TYPES.Identifier ||
            !isZodNamespace(left.name)
          ) {
            return;
          }

          const usedStyle = right.name;

          if (
            (usedStyle !== 'infer' && usedStyle !== 'output') ||
            usedStyle === style
          ) {
            return;
          }

          context.report({
            node: right,
            messageId: style === 'infer' ? 'useInfer' : 'useOutput',
            fix(fixer) {
              return fixer.replaceText(right, style);
            },
          });

          return;
        }

        if (typeName.type === AST_NODE_TYPES.Identifier) {
          const originalName = getNamedImportOriginal(typeName.name);

          if (
            (originalName !== 'infer' && originalName !== 'output') ||
            originalName === style
          ) {
            return;
          }

          const targetLocalName = getNamedImportLocal(style);

          context.report({
            node: typeName,
            messageId: style === 'infer' ? 'useInfer' : 'useOutput',
            fix(fixer) {
              // 'infer' cannot be used as a standalone type name (TypeScript keyword),
              // so only fix when the target local name is safe to use directly.
              if (!targetLocalName || targetLocalName === 'infer') {
                return null;
              }
              return fixer.replaceText(typeName, targetLocalName);
            },
          });
        }
      },
    };
  },
});
