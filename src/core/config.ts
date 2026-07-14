import { z } from 'zod'

const optionalProvider = z.preprocess(
  (value) => {
    if (typeof value !== 'string' || value.trim() === '') return undefined
    return value.trim().toLowerCase()
  },
  z.enum(['codex']).optional(),
)

const optionalMinutes = z.preprocess((value) => {
  if (typeof value !== 'string' || value.trim() === '') return undefined
  return value
}, z.coerce.number().int().positive().optional())

const ConfigSchema = z.object({
  coachProvider: optionalProvider,
  timerMode: z.enum(['off', 'checkpoints', 'all']).default('checkpoints'),
  timerMinutes: optionalMinutes,
})

export type WorkshopConfig = z.infer<typeof ConfigSchema>

export function loadConfig(environment: NodeJS.ProcessEnv = process.env): WorkshopConfig {
  const result = ConfigSchema.safeParse({
    coachProvider: environment.COACH_PROVIDER,
    timerMode: environment.WORKSHOP_TIMER_MODE || 'checkpoints',
    timerMinutes: environment.WORKSHOP_TIMER_MINUTES,
  })

  if (!result.success) {
    const details = result.error.issues.map((issue) => issue.message).join('; ')
    throw new Error(
      `Invalid workshop environment: ${details}. ` +
        'COACH_PROVIDER may be empty or "codex"; WORKSHOP_TIMER_MODE must be off, checkpoints, or all.',
    )
  }

  return result.data
}
