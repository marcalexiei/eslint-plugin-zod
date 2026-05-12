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
          import * as core from 'zod/v4/core';
          type SchemaType = core.output<typeof Schema>;
        `,
      },
      {
        name: 'non-zod-core import',
        code: dedent`
          import * as z from '@custom';
          type SchemaType = z.infer<typeof Schema>;
        `,
      },
      {
        name: 'aliased namespace import using output',
        code: dedent`
          import * as myCore from 'zod/v4/core';
          type SchemaType = myCore.output<typeof Schema>;
        `,
      },
      {
        name: 'not triggered on zod import',
        code: dedent`
          import * as z from 'zod/mini';
          type SchemaType = z.output<typeof Schema>;
        `,
      },
    ],
    invalid: [
      {
        name: 'namespace import',
        code: dedent`
          import * as core from 'zod/v4/core';
          type SchemaType = core.infer<typeof Schema>;
        `,
        errors: [{ messageId: 'useOutput' }],
        output: dedent`
          import * as core from 'zod/v4/core';
          type SchemaType = core.output<typeof Schema>;
        `,
      },
      {
        name: 'aliased namespace import',
        code: dedent`
          import * as myCore from 'zod/v4/core';
          type SchemaType = myCore.infer<typeof Schema>;
        `,
        errors: [{ messageId: 'useOutput' }],
        output: dedent`
          import * as myCore from 'zod/v4/core';
          type SchemaType = myCore.output<typeof Schema>;
        `,
      },
      {
        name: 'multiple usages',
        code: dedent`
          import * as core from 'zod/v4/core';
          type TypeA = core.infer<typeof SchemaA>;
          type TypeB = core.infer<typeof SchemaB>;
        `,
        errors: [{ messageId: 'useOutput' }, { messageId: 'useOutput' }],
        output: dedent`
          import * as core from 'zod/v4/core';
          type TypeA = core.output<typeof SchemaA>;
          type TypeB = core.output<typeof SchemaB>;
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
          import type { output } from 'zod/v4/core';
          type SchemaType = output<typeof Schema>;
        `,
      },
      {
        name: 'named output import with alias',
        code: dedent`
          import type { output as CoreOutput } from 'zod/v4/core';
          type SchemaType = CoreOutput<typeof Schema>;
        `,
      },
      {
        name: 'non-zod-core named import',
        code: dedent`
          import type { output } from '@custom';
          type SchemaType = output<typeof Schema>;
        `,
      },
    ],
    invalid: [
      {
        name: 'named aliased infer import - output not imported, no fix',
        code: dedent`
          import type { infer as CoreInfer } from 'zod/v4/core';
          type SchemaType = CoreInfer<typeof Schema>;
        `,
        errors: [{ messageId: 'useOutput' }],
        output: null,
      },
      {
        name: 'named aliased infer import - output also imported, fix is possible',
        code: dedent`
          import type { infer as CoreInfer, output } from 'zod/v4/core';
          type SchemaType = CoreInfer<typeof Schema>;
        `,
        errors: [{ messageId: 'useOutput' }],
        output: dedent`
          import type { infer as CoreInfer, output } from 'zod/v4/core';
          type SchemaType = output<typeof Schema>;
        `,
      },
    ],
  },
);

ruleTester.run(`${consistentSchemaOutputTypeStyle.name} (infer)`, consistentSchemaOutputTypeStyle, {
  valid: [
    {
      name: 'namespace import',
      code: dedent`
          import * as core from 'zod/v4/core';
          type SchemaType = core.infer<typeof Schema>;
        `,
      options: [{ style: 'infer' }],
    },
    {
      name: 'non-zod-core import',
      code: dedent`
          import * as z from '@custom';
          type SchemaType = z.output<typeof Schema>;
        `,
      options: [{ style: 'infer' }],
    },
    {
      name: 'aliased namespace import using infer',
      code: dedent`
          import * as myCore from 'zod/v4/core';
          type SchemaType = myCore.infer<typeof Schema>;
        `,
      options: [{ style: 'infer' }],
    },
  ],
  invalid: [
    {
      name: 'namespace import',
      code: dedent`
          import * as core from 'zod/v4/core';
          type SchemaType = core.output<typeof Schema>;
        `,
      options: [{ style: 'infer' }],
      errors: [{ messageId: 'useInfer' }],
      output: dedent`
          import * as core from 'zod/v4/core';
          type SchemaType = core.infer<typeof Schema>;
        `,
    },
    {
      name: 'multiple usages',
      code: dedent`
          import * as core from 'zod/v4/core';
          type TypeA = core.output<typeof SchemaA>;
          type TypeB = core.output<typeof SchemaB>;
        `,
      options: [{ style: 'infer' }],
      errors: [{ messageId: 'useInfer' }, { messageId: 'useInfer' }],
      output: dedent`
          import * as core from 'zod/v4/core';
          type TypeA = core.infer<typeof SchemaA>;
          type TypeB = core.infer<typeof SchemaB>;
        `,
    },
  ],
});

ruleTester.run(
  `${consistentSchemaOutputTypeStyle.name} (infer, named imports)`,
  consistentSchemaOutputTypeStyle,
  {
    valid: [
      {
        name: 'named infer import with alias',
        code: dedent`
          import type { infer as CoreInfer } from 'zod/v4/core';
          type SchemaType = CoreInfer<typeof Schema>;
        `,
        options: [{ style: 'infer' }],
      },
      {
        name: 'non-zod-core named import',
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
          import type { output } from 'zod/v4/core';
          type SchemaType = output<typeof Schema>;
        `,
        options: [{ style: 'infer' }],
        errors: [{ messageId: 'useInfer' }],
        output: null,
      },
      {
        name: 'named output import - both styles imported but infer is unaliased, no fix',
        code: dedent`
          import type { infer, output } from 'zod/v4/core';
          type SchemaType = output<typeof Schema>;
        `,
        options: [{ style: 'infer' }],
        errors: [{ messageId: 'useInfer' }],
        output: null,
      },
      {
        name: 'named output import - infer is aliased, fix uses the alias',
        code: dedent`
          import type { infer as CoreInfer, output } from 'zod/v4/core';
          type SchemaType = output<typeof Schema>;
        `,
        options: [{ style: 'infer' }],
        errors: [{ messageId: 'useInfer' }],
        output: dedent`
          import type { infer as CoreInfer, output } from 'zod/v4/core';
          type SchemaType = CoreInfer<typeof Schema>;
        `,
      },
    ],
  },
);
