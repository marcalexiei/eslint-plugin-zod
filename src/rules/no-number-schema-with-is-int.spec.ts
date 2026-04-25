import { RuleTester } from '@typescript-eslint/rule-tester';
import dedent from 'dedent';

import { noNumberSchemaWithIsInt } from './no-number-schema-with-is-int.js';

const ruleTester = new RuleTester();

ruleTester.run('no-number-schema-with-is-int', noNumberSchemaWithIsInt, {
  valid: [
    {
      name: 'z.number() without isInt',
      code: dedent`
        import * as z from 'zod';
        const n = z.number();
      `,
    },
    {
      name: 'isInt on non-zod',
      code: 'const o = { isInt: true }; o.isInt',
    },
  ],
  invalid: [
    {
      name: 'z.number().isInt',
      code: dedent`
        import * as z from 'zod';
        const _x = z.number().isInt;
      `,
      errors: [{ messageId: 'useFormat' }],
    },
    {
      name: 'z.number().min(0).isInt',
      code: dedent`
        import * as z from 'zod';
        void z.number().min(0).isInt;
      `,
      errors: [{ messageId: 'useFormat' }],
    },
  ],
});
