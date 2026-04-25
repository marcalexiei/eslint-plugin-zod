import { RuleTester } from '@typescript-eslint/rule-tester';
import dedent from 'dedent';

import { noNumberSchemaWithStep } from './no-number-schema-with-step.js';

const ruleTester = new RuleTester();

ruleTester.run('no-number-schema-with-step', noNumberSchemaWithStep, {
  valid: [
    {
      name: 'z.number() with multipleOf',
      code: dedent`
        import * as z from 'zod';
        z.number().multipleOf(2);
      `,
    },
  ],
  invalid: [
    {
      name: 'z.number().step(2)',
      code: dedent`
        import * as z from 'zod';
        z.number().step(2);
      `,
      errors: [{ messageId: 'useMultipleOf' }],
      output: dedent`
        import * as z from 'zod';
        z.number().multipleOf(2);
      `,
    },
    {
      name: 'z.number().min(0).step(0.1, "err")',
      code: dedent`
        import * as z from 'zod';
        z.number().min(0).step(0.1, 'err');
      `,
      errors: [{ messageId: 'useMultipleOf' }],
      output: dedent`
        import * as z from 'zod';
        z.number().min(0).multipleOf(0.1, 'err');
      `,
    },
    {
      name: 'number().step(1) named import',
      code: dedent`
        import { number } from 'zod';
        number().step(1);
      `,
      errors: [{ messageId: 'useMultipleOf' }],
      output: dedent`
        import { number } from 'zod';
        number().multipleOf(1);
      `,
    },
  ],
});
