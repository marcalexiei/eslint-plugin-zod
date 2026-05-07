import { RuleTester } from '@typescript-eslint/rule-tester';
import dedent from 'dedent';

import { schemaErrorPropertyStyle } from './schema-error-property-style.js';

const ruleTester = new RuleTester();

ruleTester.run(schemaErrorPropertyStyle.name, schemaErrorPropertyStyle, {
  valid: [
    {
      name: 'default option (namespace import)',
      code: dedent`
        import * as z from 'zod/mini';
        z.custom(() => true, { error: "my error" })
      `,
    },
    {
      name: 'default option (named import)',
      code: dedent`
        import { custom } from 'zod/mini';
        custom(() => true, { error: "my error" })
      `,
    },
    {
      name: 'default option (named z import)',
      code: dedent`
        import { z } from 'zod/mini';
        z.custom(() => true, { error: "my error" })
      `,
    },
    {
      name: 'not triggered on zod import',
      code: dedent`
        import { custom } from 'zod';
        custom(() => true, { error: () => "my error" })
      `,
    },
    {
      name: 'template string',
      code: dedent`
        import * as z from 'zod/mini';
        z.custom(() => true, \`asd\`);
      `,
    },
  ],
  invalid: [
    {
      name: 'arrow function error value',
      code: dedent`
        import * as z from 'zod/mini';
        z.custom(() => true, { error: () => "my error" })
      `,
      errors: [
        {
          messageId: 'invalidStyle',
          data: {
            selector: 'Literal,TemplateLiteral',
            example: "'error message'",
            actual: '() => "my error"',
          },
        },
      ],
      output: null,
    },
    {
      name: 'invalid ESQuery selector',
      options: [{ selector: '>!asd', example: 'test' }],
      code: dedent`
        import * as z from 'zod/mini';
        z.custom(() => true, \`template string\`)
      `,
      errors: [
        {
          messageId: 'invalidSelector',
          data: { selector: '>!asd' },
        },
      ],
      output: null,
    },
    {
      name: 'zod/v4-mini import',
      code: dedent`
        import * as z from 'zod/v4-mini';
        z.custom(() => true, { error: () => "my error" })
      `,
      errors: [
        {
          messageId: 'invalidStyle',
          data: {
            selector: 'Literal,TemplateLiteral',
            example: "'error message'",
            actual: '() => "my error"',
          },
        },
      ],
      output: null,
    },
  ],
});

ruleTester.run(
  `${schemaErrorPropertyStyle.name} (refine)`,
  schemaErrorPropertyStyle,
  {
    valid: [
      {
        name: 'default option',
        code: dedent`
          import * as z from 'zod/mini';
          z.string().check(z.refine(() => true, { error: "my error" }));
        `,
      },
      {
        name: 'template string',
        code: dedent`
          import * as z from 'zod/mini';
          z.string().check(z.refine(() => true, \`asd\`));
        `,
      },
    ],
    invalid: [
      {
        name: 'arrow function error value',
        code: dedent`
          import * as z from 'zod/mini';
          z.string().check(z.refine(() => true, { error: () => "my error" }))
        `,
        errors: [
          {
            messageId: 'invalidStyle',
            data: {
              selector: 'Literal,TemplateLiteral',
              example: "'error message'",
              actual: '() => "my error"',
            },
          },
        ],
        output: null,
      },
    ],
  },
);
