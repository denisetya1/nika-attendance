"use server";

import { prisma } from "@/lib/db";
import {
  forgotPasswordSchema,
  loginSchema,
  registerShcema,
  resetPasswordSchema,
  tokenSchema,
} from "@/lib/zod/user";
import { hashSync } from "bcrypt-ts";
import { AuthError } from "next-auth";
import { signIn } from "@/auth";
import { redirect } from "next/navigation";
import {
  isRedirectError,
  RedirectType,
} from "next/dist/client/components/redirect";
import { sendMail } from "@/lib/mail";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";

export const getEmployees = async () => {
  const employees = await prisma.user.findMany({
    where: {
      role: "employee",
      isActive: true,
    },
    orderBy: {
      name: "asc",
    },
    select: {
      id: true,
      name: true,
      email: true,
    },
  });

  return employees;
};

export const addUser = async (prevState: unknown, formData: FormData) => {
  const validateFields = registerShcema.safeParse(
    Object.fromEntries(formData.entries()),
  );

  if (!validateFields.success) {
    return {
      errors: validateFields.error.flatten().fieldErrors,
    };
  }

  const { name, email, password } = validateFields.data;

  const checkEmail = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  if (checkEmail) {
    return {
      message: "Email sudah terdaftar!",
    };
  }

  try {
    await prisma.user.create({
      data: {
        name,
        email,
        password: hashSync(password, 10),
      },
    });
  } catch (error) {
    console.error(error);

    return {
      message: `Pendaftaran gagal! <br /> ${error}.`,
    };
  }

  redirect("/login");
};

export const loginUser = async (prevState: unknown, formData: FormData) => {
  const validateFields = loginSchema.safeParse(
    Object.fromEntries(formData.entries()),
  );

  if (!validateFields.success) {
    return {
      errors: validateFields.error.flatten().fieldErrors,
    };
  }

  const { email, password } = validateFields.data;

  try {
    await signIn("credentials", { email, password, redirectTo: "/" });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return {
            message: "Email atau password tidak ditemukan!",
          };
        default:
          return {
            message: "Tejadi kesalahan!",
          };
      }
    }

    if (isRedirectError(error)) {
      throw error;
    }

    console.error("signin erorr", error);
  }

  redirect("/", RedirectType.replace);
};

export const forgotPassword = async (
  prevState: unknown,
  formData: FormData,
) => {
  const validateFields = forgotPasswordSchema.safeParse(
    Object.fromEntries(formData.entries()),
  );

  if (!validateFields.success) {
    return {
      errors: validateFields.error.flatten().fieldErrors,
    };
  }

  const { email } = validateFields.data;

  try {
    const user = await prisma.user.findUnique({
      where: { email: email },
    });

    if (user) {
      const token = Math.floor(Math.random() * 899999 + 100000);
      const trxId = uuidv4();

      const saveToken = await prisma.forgotPassword.create({
        data: {
          userId: user.id,
          trxId,
          token: String(token),
          expires: moment().add(10, "minutes").toISOString(),
        },
      });

      if (saveToken) {
        await sendMail({
          from: "no-reply@resend.beautycat.id",
          to: user.email,
          subject: "Permintaan Reset Password",
          html: `<p>Hi ${user.name}</p><br /><p>Kami menerima permintaan reset password akun anda. <br />
          Berikut kode anda:</p>
          <p>&nbsp;</p>
          <p><span style="display:inline-block; padding: 8px 24px; background: #eee; font-size: 30px; font-weight:bold; letter-spacing: 10px">${token}</span></p>
          <p>&nbsp;</p>
          <p>Abaikan email ini jika anda tidak melakukan permintan rest password.</p>`,
        });

        return {
          message: JSON.stringify({
            success: true,
            trxId,
          }),
        };
      }
    } else {
      return {
        message: "Terjadi kesalahan!",
      };
    }
  } catch (error) {
    console.error("FORGOT_PASSWORD", error);
    return {
      message: "Terjadi kesalahan!",
    };
  }
};

export const verifyToken = async (prevState: unknown, formData: FormData) => {
  const validateFields = tokenSchema.safeParse(
    Object.fromEntries(formData.entries()),
  );

  if (!validateFields.success) {
    return {
      errors: validateFields.error.flatten().fieldErrors,
    };
  }

  const { token, trxId } = validateFields.data;

  try {
    const verified = await prisma.forgotPassword.findFirst({
      where: {
        token,
        trxId,
        expires: {
          gte: moment().toISOString(),
        },
      },
    });

    if (verified) {
      return {
        message: JSON.stringify({
          success: true,
          token,
        }),
      };
    } else {
      return {
        message: "Kode tidak valid!",
      };
    }
  } catch (error) {
    console.error(error);

    return {
      message: "Terjadi kesalahan!",
    };
  }
};

export const resetPassword = async (prevState: unknown, formData: FormData) => {
  const validateFields = resetPasswordSchema.safeParse(
    Object.fromEntries(formData.entries()),
  );

  if (!validateFields.success) {
    return {
      errors: validateFields.error.flatten().fieldErrors,
    };
  }

  const { token, password, trxId } = validateFields.data;

  try {
    const verified = await prisma.forgotPassword.findFirst({
      where: {
        token: token,
        trxId: trxId,
        expires: {
          gte: moment().toISOString(),
        },
      },
    });

    if (verified) {
      const updatePass = await prisma.user.update({
        where: {
          id: verified.userId,
        },
        data: {
          password: hashSync(password, 10),
        },
      });

      if (updatePass) {
        await prisma.forgotPassword.delete({
          where: {
            id: verified.id,
          },
        });
      }

      return {
        message: JSON.stringify({
          success: true,
        }),
      };
    }
  } catch (error) {
    console.error(error);

    return {
      message: "Reset password gagal!",
    };
  }

  redirect("/login");
};
