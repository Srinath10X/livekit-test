import { z } from 'zod'

export const joinSchema = z.object({
  room: z.string().min(1).max(64),
  username: z.string().min(1).max(32),
})

export type JoinValues = z.infer<typeof joinSchema>

export const tokenResponseSchema = z.object({
  token: z.string(),
  serverUrl: z.string().url(),
})

export type TokenResponse = z.infer<typeof tokenResponseSchema>
