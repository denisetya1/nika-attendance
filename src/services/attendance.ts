"use server"

import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import moment from "moment-timezone";
import sharp from 'sharp';
import { redirect } from "next/navigation";

export const getAttendance = async () => {
  const session = await auth();

  const attendance = prisma.attendaceRecord.findFirst({
    where: {
      userId: session?.user?.id,
      dateString: moment.tz("Asia/Jakarta").format("YYYY-MM-DD"),
      checkOutTime: null
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  return attendance;
}

export const recordAttendance = async (prevState: unknown, formData: FormData) => {
  const session = await auth();
  const imageUpload = formData.get('img')?.toString();

  if (imageUpload && session?.user) {
    const parts = imageUpload.split(';');
    const mimType = parts[0].split(':')[1];
    const imageData = parts[1].split(',')[1];

    const img = Buffer.from(imageData, 'base64');

    const newSize = await sharp(img)
      .resize(200, 200, { fit: 'outside' })
      .toBuffer()
      .then(resizedImageBuffer => {
        const resizedImageData = resizedImageBuffer.toString('base64');
        const resizedBase64 = `data:${mimType};base64,${resizedImageData}`;
        return resizedBase64
      }).catch((error) => {
        console.error('signin erorr', error);

        throw error
      })
    try {
      await prisma.attendaceRecord.create({
        data: {
          userId: session.user.id as string,
          dateString: moment().format("YYYY-MM-DD"),
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

  try {
    await prisma.attendaceRecord.update({
      where: {
        id: attId as string,
        userId: session?.user?.id as string
      },
      data: {
        checkOutTime: new Date(),
        checkOutTimeString: moment().tz('Asia/Jakarta').format("HH:mm:ss"),
      }
    })
  } catch (error) {
    throw error
  }

  redirect('/')
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

