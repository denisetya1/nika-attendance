"use server"

import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import moment from "moment-timezone";
import { redirect } from "next/navigation";
import { resizeBase64 } from "@/lib/image";

export const getAttendance = async () => {
  const session = await auth();

  const attendance = prisma.attendaceRecord.findFirst({
    where: {
      userId: session?.id,
      dateString: moment().tz("Asia/Jakarta").format("YYYY-MM-DD"),
      checkOutTime: null
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  return attendance;
}

export const checkInAttendance = async (prevState: unknown, formData: FormData) => {
  const session = await auth();
  const imageUpload = formData.get('img')?.toString();

  if (imageUpload && session?.id) {
    const newSize = await resizeBase64(imageUpload)

    try {
      await prisma.attendaceRecord.create({
        data: {
          userId: session.id as string,
          dateString: moment().tz("Asia/Jakarta").format("YYYY-MM-DD"),
          checkInTime: new Date(),
          checkInTimeString: moment().tz('Asia/Jakarta').format("HH:mm:ss"),
          photoUrl: newSize,
        }
      })
    } catch (error) {

      throw error
    }
    redirect('/')
  }

  return {
    message: "Absensi gagal!"
  }
}

export const checkOutAttendance = async (prevState: unknown, formData: FormData) => {
  const session = await auth();

  const attId = formData.get('attId')
  const imageUpload = formData.get('img')?.toString();

  if (imageUpload && attId) {
    const newSize = await resizeBase64(imageUpload)

    try {
      await prisma.attendaceRecord.update({
        where: {
          id: attId as string,
          userId: session?.id as string
        },
        data: {
          checkOutTime: new Date(),
          checkOutTimeString: moment().tz('Asia/Jakarta').format("HH:mm:ss"),
          photoUrlCheckout: newSize
        }
      })
    } catch (error) {
      throw error
    }

    redirect('/')

  } else {
    return {
      message: "Terjadi kesalahan!"
    }
  }
}

export const getListAttendance = async (month?: string, year?: string, userId?: string) => {
  month = month || moment().format('MM')
  year = year || moment().format('YYYY')
  userId = userId || '0'

  const listAttendance = await prisma.attendaceRecord.findMany({
    where: {
      dateString: {
        startsWith: `${year}-${month}`
      },
      user: {
        id: userId
      }
    },
    select: {
      id: true,
      dateString: true,
      createdAt: true,
      checkInTime: true,
      checkOutTime: true,
      checkInTimeString: true,
      checkOutTimeString: true,
      photoUrl: true,
      photoUrlCheckout: true, //
      user: {
        select: {
          id: true,
          name: true
        }
      }
    }
  })

  return listAttendance
}

