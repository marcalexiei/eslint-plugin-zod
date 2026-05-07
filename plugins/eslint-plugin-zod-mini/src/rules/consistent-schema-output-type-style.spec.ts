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
          import * as z from 'zod/mini';
          type SchemaType = z.output<typeof UserSchema>;
        `,
      },
      {
        name: 'named z import',
        code: dedent`
          import { z } from 'zod/mini';
          type SchemaType = z.output<typeof UserSchema>;
        `,
      },
      {
        name: 'zod/v4-mini import',
        code: dedent`
          import * as z from 'zod/v4-mini';
          type SchemaType = z.output<typeof UserSchema>;
        `,
      },
      {
        name: 'non-zod/mini import',
        code: dedent`
          import * as z from '@custom';
          type SchemaType = z.infer<typeof UserSchema>;
        `,
      },
      {
        name: 'not triggered on zod import',
        code: dedent`
          import * as z from 'zod';
          type SchemaType = z.infer<typeof UserSchema>;
        `,
      },
    ],
    invalid: [
      {
        name: 'namespace import',
        code: dedent`
          import * as z from 'zod/mini';
          type SchemaType = z.infer<typeof UserSchema>;
        `,
        errors: [{ messageId: 'useOutput' }],
        output: dedent`
          import * as z from 'zod/mini';
          type SchemaType = z.output<typeof UserSchema>;
        `,
      },
      {
        name: 'named z import',
        code: dedent`
          import { z } from 'zod/mini';
          type SchemaType = z.infer<typeof UserSchema>;
        `,
        errors: [{ messageId: 'useOutput' }],
        output: dedent`
          import { z } from 'zod/mini';
          type SchemaType = z.output<typeof UserSchema>;
        `,
      },
      {
        name: 'aliased namespace import',
        code: dedent`
          import * as myZ from 'zod/mini';
          type SchemaType = myZ.infer<typeof UserSchema>;
        `,
        errors: [{ messageId: 'useOutput' }],
        output: dedent`
          import * as myZ from 'zod/mini';
          type SchemaType = myZ.output<typeof UserSchema>;
        `,
      },
      {
        name: 'zod/v4-mini import',
        code: dedent`
          import * as z from 'zod/v4-mini';
          type SchemaType = z.infer<typeof UserSchema>;
        `,
        errors: [{ messageId: 'useOutput' }],
        output: dedent`
          import * as z from 'zod/v4-mini';
          type SchemaType = z.output<typeof UserSchema>;
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
          import * as z from 'zod/mini';
          type SchemaType = z.infer<typeof UserSchema>;
        `,
        options: [{ style: 'infer' }],
      },
      {
        name: 'not triggered on zod import',
        code: dedent`
          import * as z from 'zod';
          type SchemaType = z.output<typeof UserSchema>;
        `,
        options: [{ style: 'infer' }],
      },
    ],
    invalid: [
      {
        name: 'namespace import',
        code: dedent`
          import * as z from 'zod/mini';
          type SchemaType = z.output<typeof UserSchema>;
        `,
        options: [{ style: 'infer' }],
        errors: [{ messageId: 'useInfer' }],
        output: dedent`
          import * as z from 'zod/mini';
          type SchemaType = z.infer<typeof UserSchema>;
        `,
      },
    ],
  },
);
