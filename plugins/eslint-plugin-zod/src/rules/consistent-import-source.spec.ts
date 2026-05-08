import { RuleTester } from '@typescript-eslint/rule-tester';

import { consistentImportSource } from './consistent-import-source.js';

const ruleTester = new RuleTester();

ruleTester.run(consistentImportSource.name, consistentImportSource, {
  valid: [
    { code: 'import * as z from "zod"' },
    { code: 'import { z } from "zod"' },
    { code: 'import z from "zod"' },
    {
      code: 'import z from "zod"',
      options: [{ sources: ['zod'] }],
    },
    {
      code: 'import z from "zod/v4"',
      options: [{ sources: ['zod/v4'] }],
    },
    {
      name: 'zod-mini import is out of scope',
      code: 'import z from "zod/mini"',
    },
  ],
  invalid: [
    {
      name: 'namespace',
      code: 'import * as z from "zod/v4"',
      errors: [
        {
          messageId: 'sourceNotAllowed',
          data: { source: 'zod/v4', sources: '"zod"' },
          suggestions: [
            {
              messageId: 'replaceSource',
              data: { valid: 'zod', invalid: 'zod/v4' },
              output: 'import * as z from "zod"',
            },
          ],
        },
      ],
    },
    {
      name: 'default',
      code: 'import z from "zod"',
      options: [{ sources: ['zod/v4'] }],
      errors: [
        {
          messageId: 'sourceNotAllowed',
          data: { source: 'zod', sources: '"zod/v4"' },
          suggestions: [
            {
              messageId: 'replaceSource',
              data: { valid: 'zod/v4', invalid: 'zod' },
              output: 'import z from "zod/v4"',
            },
          ],
        },
      ],
    },
    {
      code: 'import z from "zod/v4"',
      errors: [
        {
          messageId: 'sourceNotAllowed',
          data: { source: 'zod/v4', sources: '"zod"' },
          suggestions: [
            {
              messageId: 'replaceSource',
              data: { valid: 'zod', invalid: 'zod/v4' },
              output: 'import z from "zod"',
            },
          ],
        },
      ],
    },
    {
      name: 'should keep quote style',
      code: "import z from 'zod/v3'",
      errors: [
        {
          messageId: 'sourceNotAllowed',
          data: { source: 'zod/v3', sources: '"zod"' },
          suggestions: [
            {
              messageId: 'replaceSource',
              data: { valid: 'zod', invalid: 'zod/v3' },
              output: "import z from 'zod'",
            },
          ],
        },
      ],
    },
    {
      name: 'multiple sources, multiple suggestions',
      code: 'import z from "zod/v3"',
      options: [{ sources: ['zod', 'zod/v4'] }],
      errors: [
        {
          messageId: 'sourceNotAllowed',
          data: { source: 'zod/v3', sources: '"zod", "zod/v4"' },
          suggestions: [
            {
              messageId: 'replaceSource',
              data: { valid: 'zod', invalid: 'zod/v3' },
              output: 'import z from "zod"',
            },
            {
              messageId: 'replaceSource',
              data: { valid: 'zod/v4', invalid: 'zod/v3' },
              output: 'import z from "zod/v4"',
            },
          ],
        },
      ],
    },
  ],
});
