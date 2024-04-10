import { z } from 'zod'

import { SettingsStore } from '../settings'

const schema: z.ZodDefault<z.ZodType<SettingsStore>> = z
  .object({
    animations: z.object({
      dragAndDrop: z.string(),
    }),
    styles: z.object({
      theme: z.string(),
      tabSize: z.number(),
      fontSize: z.number(),
    }),
  })
  .default({
    animations: {
      dragAndDrop: 'DragAndDrop',
    },
    styles: {
      theme: 'IliadDark',
      tabSize: 2,
      fontSize: 14,
    },
  })

export default schema
