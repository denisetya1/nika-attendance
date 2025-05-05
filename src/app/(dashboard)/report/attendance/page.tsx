import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getListAttendance } from '@/services/attendance'
import { getEmployees } from '@/services/user';
import { Prisma } from '@prisma/client';
import moment from 'moment';
import React from 'react';
import FilterForm from '../../components/FilterForm';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { DialogHeader, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';

type AttendaceRecord = Prisma.AttendaceRecordGetPayload<{
  select: {
    id: true,
    dateString: true,
    createdAt: true,
    checkInTime: true,
    checkOutTime: true,
    checkInTimeString: true,
    checkOutTimeString: true,
    photoUrl: true,
    photoUrlCheckout: true,
    user: {
      select: {
        id: true,
        name: true
      }
    }
  }
}>

interface AttendaceRecordWithStatus extends AttendaceRecord {
  isAbsent?: boolean
  duration?: {
    hours: number
    minutes: number
  }
  isLate?: boolean
  lateDuration?: {
    hours: number
    minutes: number
  }
}

const AttendaceReport = async ({
  searchParams
}: {
  searchParams?: { [key: string]: string | undefined },
}) => {
  const month = searchParams?.month || moment().format('MM');
  const year = searchParams?.year || moment().format('YYYY');
  const userId = searchParams?.userId;

  const listAttendance = await getListAttendance(month, year, userId);
  const listEmployees = await getEmployees();

  const getDuration = (dateString?: string, checkInTimeString?: string, checkOutTimeString?: string | null) => {
    let hours = 0;
    let minutes = 0;
    if (checkOutTimeString) {
      const duration = moment(`${dateString} ${checkOutTimeString}`).diff(moment(`${dateString} ${checkInTimeString}`), 'minutes')
      hours = Math.floor(duration / 60);
      minutes = duration - (hours * 60);
    }

    return { hours, minutes }

  }

  const getLate = (dateString?: string, checkInTimeString?: string) => {
    const checkinDateTime = moment(`${dateString} ${checkInTimeString}`)
    let late = 0;

    const isSunday = moment(`${dateString}`).isoWeekday() === 7;

    if (isSunday) {
      late = checkinDateTime.diff(moment(`${dateString} 12:00:00`), 'minutes')
    } else if (checkinDateTime <= moment(`${dateString} 12:00:00`)) {
      late = checkinDateTime.diff(moment(`${dateString} 08:00:00`), 'minutes')
    } else {
      late = checkinDateTime.diff(moment(`${dateString} 13:00:00`), 'minutes')
    }

    if (late > 0) {
      const hours = Math.floor(late / 60);
      const minutes = late - (hours * 60);
      const isLate = late > 5;

      return {
        hours,
        minutes,
        isLate
      }
    }

    return {
      hours: 0,
      minutes: 0,
      isLate: false
    }
  }

  const mapDate = (attList: AttendaceRecordWithStatus[]) => {
    const totalDays = new Date(parseInt(year, 10), parseInt(month, 10), 0).getDate();

    const days = Array.from({ length: totalDays }, (_, i) => i + 1);;
    const allDays = days.map(day => `${year}-${month}-${day < 10 ? '0' + day : day}`)

    const mapAtt = new Map(attList.map(item => [item.dateString, item]));

    let totalAttendance = 0;
    let totalAbsent = 0;
    let totalLate = 0;

    allDays.forEach(date => {
      if (!mapAtt.has(date)) {
        if (date.localeCompare(moment().format('YYYY-MM-DD')) < 0) {
          totalAbsent++;
        }

        mapAtt.set(date, {
          ...attList[0],
          dateString: date,
          checkInTimeString: '--:--:--',
          checkOutTimeString: '--:--:--',
          photoUrl: '',
          photoUrlCheckout: '',
          isAbsent: true,
        });

      } else {
        totalAttendance++;

        const att = mapAtt.get(date)
        if (att?.isAbsent !== true) {
          const { hours, minutes } = getDuration(att?.dateString, att?.checkInTimeString, att?.checkOutTimeString)
          const { hours: lateHours, minutes: lateMinutes, isLate } = getLate(att?.dateString, att?.checkInTimeString)

          if (isLate) {
            totalLate++;
          }

          mapAtt.set(date, {
            ...att as AttendaceRecord,
            duration: {
              hours,
              minutes
            },
            lateDuration: {
              hours: lateHours,
              minutes: lateMinutes
            },
            isLate,
            isAbsent: false,
          });
        }
      }
    });

    const result = Array.from(mapAtt.values());
    result.sort((a, b) => a.dateString.localeCompare(b.dateString));

    return {
      list: result, totalAbsent, totalAttendance, totalLate
    }
  }

  const { list, totalAbsent, totalAttendance, totalLate } = mapDate(listAttendance)

  return (
    <div className='w-full h-full p-2'>
      <Card className='w-full'>
        <CardHeader>
          <CardTitle>
            <h1>Laporan Absensi Karyawan</h1>
          </CardTitle>
        </CardHeader>
        <CardContent>

          <Card className='mb-10'>
            <CardHeader></CardHeader>
            <CardContent>
              <div className='flex flex-col md:flex-row md:justify-between md:gap-20'>
                <div className='w-1/2'>
                  <FilterForm
                    employees={listEmployees}
                    year={year}
                    month={month}
                    userId={userId}
                  />
                </div>

                <div className='w-1/2'>
                  <div className='flex items-center gap-2 py-1 mb-4'>
                    <div className='w-1/2'>Jumlah Masuk Kerja</div>
                    <div className='w-1/2'>: {totalAttendance} hari</div>
                  </div>

                  <div className='flex items-center gap-2 py-1 mb-4'>
                    <div className='w-1/2'>Jumlah Terlambat &gt; 5 mnt</div>
                    <div className='w-1/2'>: {totalLate} kali</div>
                  </div>

                  <div className='flex items-center gap-2 py-1 mb-4'>
                    <div className='w-1/2'>Jumlah Libur</div>
                    <div className='w-1/2'>: {totalAbsent} hari</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>


          <Table>
            <TableHeader>
              <TableRow className='bg-slate-300'>
                <TableHead className="w-[100px] text-sm font-semibold text-gray-800">No.</TableHead>
                <TableHead className='text-sm font-semibold text-gray-800'>Tanggal</TableHead>
                <TableHead className='text-sm font-semibold text-gray-800'>Waktu Check In</TableHead>
                <TableHead className='text-sm font-semibold text-gray-800'>Waktu Check Out</TableHead>
                <TableHead className='text-sm font-semibold text-gray-800'>Durasi</TableHead>
                <TableHead className='text-sm font-semibold text-gray-800'>Keterlambatan</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {list.map((att, idx) => {
                return <TableRow key={att.id} className={`${att.isAbsent && att.dateString.localeCompare(moment().format('YYYY-MM-DD')) > -1 ? 'bg-gray-100' : ''}`}>
                  <TableCell className="font-medium">{idx + 1}.</TableCell>
                  <TableCell>{att.dateString}</TableCell>
                  <TableCell>
                    <div className='flex gap-2 justify-center items-center'>
                      {att.photoUrl !== '' && <Dialog>
                        <DialogTrigger asChild>
                          <Button className='p-0' variant="ghost">
                            <div className='relative w-[40px] h-[40px]'>
                              <Image
                                fill
                                style={{ objectFit: 'contain' }}
                                src={att.photoUrl}
                                alt={att?.user?.name as string}
                              />
                            </div>
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader>
                            <DialogTitle>Detail Photo</DialogTitle>
                            <DialogDescription className='w-full h-full flex items-center justify-center'>
                              <div className='w-[300px] h-[400px] relative'>
                                <Image
                                  fill
                                  style={{ objectFit: 'contain' }}
                                  src={att.photoUrl}
                                  alt={att?.user?.name as string}
                                />
                              </div>
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter>
                            <DialogClose>
                              <Button type="submit">Tutup</Button>
                            </DialogClose>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>}
                      <div>
                        {att.checkInTimeString}
                      </div>

                    </div>
                  </TableCell>
                  <TableCell>
                    <div className='flex gap-2 justify-center items-center'>
                      {att.photoUrlCheckout && <Dialog>
                        <DialogTrigger asChild>
                          <Button className='p-0' variant="ghost">
                            <div className='relative w-[40px] h-[40px]'>
                              <Image
                                fill
                                style={{ objectFit: 'contain' }}
                                src={att.photoUrlCheckout}
                                alt={att?.user?.name as string}
                              />
                            </div>
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader>
                            <DialogTitle>Detail Photo</DialogTitle>
                            <DialogDescription className='w-full h-full flex items-center justify-center'>
                              <div className='w-[300px] h-[400px] relative'>
                                <Image
                                  fill
                                  style={{ objectFit: 'contain' }}
                                  src={att.photoUrlCheckout}
                                  alt={att?.user?.name as string}
                                />
                              </div>
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter>
                            <DialogClose>
                              <Button type="submit">Tutup</Button>
                            </DialogClose>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>}
                      <div>{att.checkOutTimeString}</div>
                    </div>
                  </TableCell>
                  <TableCell>{att?.isAbsent || !att.checkOutTimeString ? '' : `${att?.duration?.hours} jam ${att?.duration?.minutes} menit`}</TableCell>
                  <TableCell className={`${att.isLate ? 'text-red-500' : ''}`}>{att?.isAbsent ? '' : `${att?.lateDuration?.hours} jam ${att?.lateDuration?.minutes} menit`}</TableCell>
                </TableRow>
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

    </div>
  )
}

export default AttendaceReport