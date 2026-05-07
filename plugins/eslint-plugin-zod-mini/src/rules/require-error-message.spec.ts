import { RuleTester } from '@typescript-eslint/rule-tester';
import dedent from 'dedent';

import { requireErrorMessage } from './require-error-message.js';

const ruleTester = new RuleTester();

ruleTester.run(requireErrorMessage.name, requireErrorMessage, {
  valid: [
    {
      name: 'object with error property (namespace import)',
      code: dedent`
        import * as z from 'zod/mini';
        z.string().check(z.refine(() => true, { error: "error msg" }));
      `,
    },
    {
      name: 'object with error property (named import)',
      code: dedent`
        import { string, refine } from 'zod/mini';
        string().check(refine(() => true, { error: "error msg" }));
      `,
    },
    {
      name: 'object with error property (named z import)',
      code: dedent`
        import { z } from 'zod/mini';
        z.string().check(z.refine(() => true, { error: "error msg" }));
      `,
    },
    {
      name: 'string error message',
      code: dedent`
        import * as z from 'zod/mini';
        z.string().check(z.refine(() => true, "error msg"));
      `,
    },
    {
      name: 'multiple chained checks with error',
      code: dedent`
        import * as z from 'zod/mini';
        z.string()
          .check(z.refine(() => true, { error: "error msg 1" }))
          .check(z.refine(() => true, { error: "error msg 2" }));
      `,
    },
    {
      name: 'not triggered on zod import',
      code: dedent`
        import * as z from 'zod';
        z.string().refine(() => true);
      `,
    },
  ],

  invalid: [
    {
      name: 'missing error message parameter',
      code: dedent`
        import * as z from 'zod/mini';
        z.string().check(z.refine(() => true));
      `,
      errors: [{ messageId: 'requireErrorMessage' }],
      output: null,
    },
    {
      name: 'missing error message (named import)',
      code: dedent`
        import { string, refine } from 'zod/mini';
        string().check(refine(() => true));
      `,
      errors: [{ messageId: 'requireErrorMessage' }],
      output: null,
    },
    {
      name: 'object without error message',
      code: dedent`
        import * as z from 'zod/mini';
        z.string().check(z.refine(() => true, { abort: true }));
      `,
      errors: [{ messageId: 'requireErrorMessage' }],
      output: null,
    },
    {
      name: 'deprecated message property',
      code: dedent`
        import * as z from 'zod/mini';
        z.string().check(z.refine(() => true, { message: "hello" }));
      `,
      errors: [{ messageId: 'preferError' }],
      output: dedent`
        import * as z from 'zod/mini';
        z.string().check(z.refine(() => true, { error: "hello" }));
      `,
    },
    {
      name: 'both message and error — remove message',
      code: dedent`
        import * as z from 'zod/mini';
        z.string().check(z.refine(() => true, { message: "hello", error: "hello" }));
      `,
      errors: [{ messageId: 'removeMessage' }],
      output: dedent`
        import * as z from 'zod/mini';
        z.string().check(z.refine(() => true, {  error: "hello" }));
      `,
    },
    {
      name: 'zod/v4-mini import',
      code: dedent`
        import * as z from 'zod/v4-mini';
        z.string().check(z.refine(() => true));
      `,
      errors: [{ messageId: 'requireErrorMessage' }],
      output: null,
    },
  ],
});

ruleTester.run(`${requireErrorMessage.name} (custom)`, requireErrorMessage, {
  valid: [
    {
      name: 'object with error property',
      code: dedent`
        import * as z from 'zod/mini';
        z.custom(() => true, { error: "hello there" });
      `,
    },
    {
      name: 'string error message',
      code: dedent`
        import * as z from 'zod/mini';
        z.custom(() => true, "error msg");
      `,
    },
  ],

  invalid: [
    {
      name: 'missing error message parameter',
      code: dedent`
        import * as z from 'zod/mini';
        z.custom(() => true)
      `,
      errors: [{ messageId: 'requireErrorMessage' }],
      output: null,
    },
    {
      name: 'missing error message parameter (named)',
      code: dedent`
        import { custom } from 'zod/mini';
        custom(() => true)
      `,
      errors: [{ messageId: 'requireErrorMessage' }],
      output: null,
    },
    {
      name: 'object without error message',
      code: dedent`
        import * as z from 'zod/mini';
        z.custom(() => true, { abort: true });
      `,
      errors: [{ messageId: 'requireErrorMessage' }],
      output: null,
    },
  ],
});
