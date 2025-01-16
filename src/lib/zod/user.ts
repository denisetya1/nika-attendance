import { object, string } from 'zod'

export const registerShcema = object({
  email: string().email("Format email salah!"),
  password: string().min(6).max(32),
  confirmPassword: string().min(6).max(32),
  name: string().min(3).max(100),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Pasword dan konfirmasi password tidak sama!",
  path: ["confirmPassword"],
})

export const loginSchema = object({
  email: string().email("Format email salah!"),
  password: string(),
})
