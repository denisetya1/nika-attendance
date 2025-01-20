import { prisma } from '@/lib/db';
import moment from 'moment';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  if (req.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({
      code: "UNATHORIZED",
      message: "Unathorized Error!"
    }, {
      status: 401
    });
  }

  const noCheckout = await prisma.attendaceRecord.findMany({
    where: {
      dateString: moment().subtract(1, 'days').format('YYYY-MM-DD'),
      checkOutTimeString: null
    }
  })

  if (noCheckout.length > 0) {
    noCheckout.map(async (data) => {
      const dateTime = `${data.dateString} ${data.checkInTimeString}`;

      if (dateTime.localeCompare(`${data.dateString} 12:00:00`) < 0) {
        await prisma.attendaceRecord.update({
          where: {
            id: data.id,
          },
          data: {
            checkOutTimeString: "16:00:00",
            checkOutTime: new Date(`${data.dateString} 16:00:00`)
          }
        })
      } else {
        await prisma.attendaceRecord.update({
          where: {
            id: data.id,
          },
          data: {
            checkOutTimeString: "21:00:00",
            checkOutTime: new Date(`${data.dateString} 21:00:00`)
          }
        })
      }
    })
  }

  return NextResponse.json({ ok: true });
}