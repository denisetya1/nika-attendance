"use server"

import { prisma } from "@/lib/db";
import { loginSchema, registerShcema } from "@/lib/zod/user";
import { hashSync } from "bcrypt-ts";
import { AuthError } from "next-auth";
import { signIn } from "@/auth";
import { redirect } from "next/navigation";
import { isRedirectError } from "next/dist/client/components/redirect";

export const addUser = async (prevState: unknown, formData: FormData) => {

  const validateFields = registerShcema.safeParse(Object.fromEntries(formData.entries()));

  if (!validateFields.success) {
    return {
      errors: validateFields.error.flatten().fieldErrors,
    }
  }

  const { name, email, password } = validateFields.data;

  try {
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashSync(password, 10)
      }
    })
  } catch (error) {
    console.error(error);

    return {
      message: "Pendaftaran gagal!"
    }
  }

  redirect("/login");
}

export const loginUser = async (prevState: unknown, formData: FormData) => {

  const validateFields = loginSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validateFields.success) {
    return {
      errors: validateFields.error.flatten().fieldErrors,
    }
  }

  const { email, password } = validateFields.data;

  try {
    await signIn("credentials", { email, password, redirectTo: "/attendance" });
  } catch (error) {
    console.error('signin erorr', error);

    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return {
            message: "Email atau password toidak ditemukan!"
          }
        default:
          return {
            message: "Tejadi kesalahan!"
          }
      }
    }

    throw error
  }
}