import { RuleTester } from '@typescript-eslint/rule-tester';
import dedent from 'dedent';

import { consistentSchemaOutputTypeStyle } from './consistent-schema-output-type-style.js';

const ruleTester = new RuleTester();

ruleTester.run(
  `${consistentSchemaOutputTypeStyle.name} (output)`,
  consistentSchemaOutputTypeStyle,
  {
    valid: [
      {
        name: 'namespace import',
        code: dedent`
          import * as z from 'zod';
          type SchemaType = z.output<typeof Schema>;
        `,
      },
      {
        name: 'named z import',
        code: dedent`
          import { z } from 'zod';
          type SchemaType = z.output<typeof Schema>;
        `,
      },
      {
        name: 'namespace import - zod/v4',
        code: dedent`
          import * as z from 'zod/v4';
          type SchemaType = z.output<typeof Schema>;
        `,
      },
      {
        name: 'namespace import - zod/mini',
        code: dedent`
          import * as z from 'zod/mini';
          type SchemaType = z.output<typeof Schema>;
        `,
      },
      {
        name: 'non-zod import',
        code: dedent`
          import * as z from '@custom';
          type SchemaType = z.infer<typeof Schema>;
        `,
      },
      {
        name: 'aliased namespace import using output',
        code: dedent`
          import * as myZ from 'zod';
          type SchemaType = myZ.output<typeof Schema>;
        `,
      },
    ],
    invalid: [
      {
        name: 'namespace import',
        code: dedent`
          import * as z from 'zod';
          type SchemaType = z.infer<typeof Schema>;
        `,
        errors: [{ messageId: 'useOutput' }],
        output: dedent`
          import * as z from 'zod';
          type SchemaType = z.output<typeof Schema>;
        `,
      },
      {
        name: 'named z import',
        code: dedent`
          import { z } from 'zod';
          type SchemaType = z.infer<typeof Schema>;
        `,
        errors: [{ messageId: 'useOutput' }],
        output: dedent`
          import { z } from 'zod';
          type SchemaType = z.output<typeof Schema>;
        `,
      },
      {
        name: 'aliased namespace import',
        code: dedent`
          import * as myZ from 'zod';
          type SchemaType = myZ.infer<typeof Schema>;
        `,
        errors: [{ messageId: 'useOutput' }],
        output: dedent`
          import * as myZ from 'zod';
          type SchemaType = myZ.output<typeof Schema>;
        `,
      },
      {
        name: 'namespace import - zod/v4',
        code: dedent`
          import * as z from 'zod/v4';
          type SchemaType = z.infer<typeof Schema>;
        `,
        errors: [{ messageId: 'useOutput' }],
        output: dedent`
          import * as z from 'zod/v4';
          type SchemaType = z.output<typeof Schema>;
        `,
      },
      {
        name: 'multiple usages',
        code: dedent`
          import * as z from 'zod';
          type TypeA = z.infer<typeof SchemaA>;
          type TypeB = z.infer<typeof SchemaB>;
        `,
        errors: [{ messageId: 'useOutput' }, { messageId: 'useOutput' }],
        output: dedent`
          import * as z from 'zod';
          type TypeA = z.output<typeof SchemaA>;
          type TypeB = z.output<typeof SchemaB>;
        `,
      },
    ],
  },
);

ruleTester.run(
  `${consistentSchemaOutputTypeStyle.name} (output, named imports)`,
  consistentSchemaOutputTypeStyle,
  {
    valid: [
      {
        name: 'named output import',
        code: dedent`
        import type { output } from 'zod';
        type SchemaType = output<typeof Schema>;
      `,
      },
      {
        name: 'named output import with alias',
        code: dedent`
        import type { output as ZodOutput } from 'zod';
        type SchemaType = ZodOutput<typeof Schema>;
      `,
      },
      {
        name: 'non-zod named import',
        code: dedent`
        import type { output } from '@custom';
        type SchemaType = output<typeof Schema>;
      `,
      },
    ],
    invalid: [
      {
        // 'infer' as a named import only works via an alias;
        // only the alias is imported so no fix is possible
        name: 'named aliased infer import - output not imported, no fix',
        code: dedent`
          import type { infer as ZodInfer } from 'zod';
          type SchemaType = ZodInfer<typeof Schema>;
        `,
        errors: [{ messageId: 'useOutput' }],
        output: null,
      },
      {
        name: 'named aliased infer import - output also imported, fix is possible',
        code: dedent`
          import type { infer as ZodInfer, output } from 'zod';
          type SchemaType = ZodInfer<typeof Schema>;
        `,
        errors: [{ messageId: 'useOutput' }],
        output: dedent`
          import type { infer as ZodInfer, output } from 'zod';
          type SchemaType = output<typeof Schema>;
        `,
      },
    ],
  },
);

ruleTester.run(
  `${consistentSchemaOutputTypeStyle.name} (infer)`,
  consistentSchemaOutputTypeStyle,
  {
    valid: [
      {
        name: 'namespace import',
        code: dedent`
          import * as z from 'zod';
          type SchemaType = z.infer<typeof Schema>;
        `,
        options: [{ style: 'infer' }],
      },
      {
        name: 'named z import',
        code: dedent`
          import { z } from 'zod';
          type SchemaType = z.infer<typeof Schema>;
        `,
        options: [{ style: 'infer' }],
      },
      {
        name: 'non-zod import',
        code: dedent`
          import * as z from '@custom';
          type SchemaType = z.output<typeof Schema>;
        `,
        options: [{ style: 'infer' }],
      },
      {
        name: 'aliased namespace import using infer',
        code: dedent`
          import * as myZ from 'zod';
          type SchemaType = myZ.infer<typeof Schema>;
        `,
        options: [{ style: 'infer' }],
      },
    ],
    invalid: [
      {
        name: 'namespace import',
        code: dedent`
          import * as z from 'zod';
          type SchemaType = z.output<typeof Schema>;
        `,
        options: [{ style: 'infer' }],
        errors: [{ messageId: 'useInfer' }],
        output: dedent`
          import * as z from 'zod';
          type SchemaType = z.infer<typeof Schema>;
        `,
      },
      {
        name: 'named z import',
        code: dedent`
          import { z } from 'zod';
          type SchemaType = z.output<typeof Schema>;
        `,
        options: [{ style: 'infer' }],
        errors: [{ messageId: 'useInfer' }],
        output: dedent`
          import { z } from 'zod';
          type SchemaType = z.infer<typeof Schema>;
        `,
      },
      {
        name: 'multiple usages',
        code: dedent`
          import * as z from 'zod';
          type TypeA = z.output<typeof SchemaA>;
          type TypeB = z.output<typeof SchemaB>;
        `,
        options: [{ style: 'infer' }],
        errors: [{ messageId: 'useInfer' }, { messageId: 'useInfer' }],
        output: dedent`
          import * as z from 'zod';
          type TypeA = z.infer<typeof SchemaA>;
          type TypeB = z.infer<typeof SchemaB>;
        `,
      },
    ],
  },
);

ruleTester.run(
  `${consistentSchemaOutputTypeStyle.name} (infer, named imports)`,
  consistentSchemaOutputTypeStyle,
  {
    valid: [
      {
        // 'infer' as a named import can only be used via an alias because
        // 'infer' is a TypeScript keyword and cannot be used as a standalone type name
        name: 'named infer import with alias',
        code: dedent`
          import type { infer as ZodInfer } from 'zod';
          type SchemaType = ZodInfer<typeof Schema>;
        `,
        options: [{ style: 'infer' }],
      },
      {
        name: 'non-zod named import',
        code: dedent`
          import type { output } from '@custom';
          type SchemaType = output<typeof Schema>;
        `,
        options: [{ style: 'infer' }],
      },
    ],
    invalid: [
      {
        name: 'named output import - only output imported, no fix',
        code: dedent`
          import type { output } from 'zod';
          type SchemaType = output<typeof Schema>;
        `,
        options: [{ style: 'infer' }],
        errors: [{ messageId: 'useInfer' }],
        output: null,
      },
      {
        // When both are imported but 'infer' is unaliased, no fix is possible
        // because using 'infer' directly as a type name is a syntax error in TypeScript
        name: 'named output import - both styles imported but infer is unaliased, no fix',
        code: dedent`
          import type { infer, output } from 'zod';
          type SchemaType = output<typeof Schema>;
        `,
        options: [{ style: 'infer' }],
        errors: [{ messageId: 'useInfer' }],
        output: null,
      },
      {
        name: 'named output import - infer is aliased, fix uses the alias',
        code: dedent`
          import type { infer as ZodInfer, output } from 'zod';
          type SchemaType = output<typeof Schema>;
        `,
        options: [{ style: 'infer' }],
        errors: [{ messageId: 'useInfer' }],
        output: dedent`
          import type { infer as ZodInfer, output } from 'zod';
          type SchemaType = ZodInfer<typeof Schema>;
        `,
      },
    ],
  },
);
