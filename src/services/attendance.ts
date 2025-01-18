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
      createdAt: {
        lte: new Date(`${moment().add(1, 'day').format('YYYY-MM-DD')} 05:00:00`),
        gte: new Date(`${moment().format('YYYY-MM-DD')} 00:00:00`),
      },
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
    let parts = imageUpload.split(';');
    let mimType = parts[0].split(':')[1];
    let imageData = parts[1].split(',')[1];

    var img = Buffer.from(imageData, 'base64');

    const newSize = await sharp(img)
      .resize(200, 200, { fit: 'outside' })
      .toBuffer()
      .then(resizedImageBuffer => {
        let resizedImageData = resizedImageBuffer.toString('base64');
        let resizedBase64 = `data:${mimType};base64,${resizedImageData}`;
        return resizedBase64
      }).catch((error) => {
        console.error('signin erorr', error);

        throw error
      })

    const time = moment();
    const idTime = time.tz('Asia/Jakarta').toISOString();

    try {
      await prisma.attendaceRecord.create({
        data: {
          userId: session.user.id as string,
          date: new Date(),
          checkInTime: new Date(),
          photoUrl: newSize,
        }
      })
    } catch (error) {
      // console.error('signin erorr', error);

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
      }
    })
  } catch (error) {
    throw error
  }

  redirect('/')
}

