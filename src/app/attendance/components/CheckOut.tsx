'use client'

import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Dialog, DialogTrigger, DialogContent, DialogClose, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import Timer from "./Timer"
import { useState } from "react"
import moment from "moment"
import { checkOutAttendance } from "@/services/attendance"
import { useFormState } from "react-dom"
import { AttendaceRecord } from "@prisma/client"

const CheckOut = ({
  attendace,
  currentDate,
  name
}: {
  attendace: AttendaceRecord,
  currentDate: Date,
  name: string
}) => {
  const [__state, formAction] = useFormState(checkOutAttendance, null);
  const [openDialog, setOpenDialog] = useState<boolean>(false)

  return (

    <Card className='w-[90%]'>
      <CardHeader>
        <CardTitle>Rekam Absensi Keluar</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='flex justify-start gap-3 mb-4'>
          <div className="w-[130px]">Nama</div>
          <div>: {name}</div>
        </div>

        <div className='flex justify-start gap-3 mb-4'>
          <div className="w-[130px]">Tanggal</div>
          <div className="flex">: {moment(currentDate).format('LL')}</div>
        </div>

        <div className='flex justify-start gap-3 mb-4'>
          <div className="w-[130px]">Waktu Check In</div>
          <div className="flex"><div>:&nbsp;</div>{moment(attendace.checkInTime).format("HH:mm:ss")}</div>
        </div>

        <div className='flex justify-start gap-3 mb-4'>
          <div className="w-[130px]">Waktu Check Out</div>
          <div className="flex"><div>:&nbsp;</div><Timer serverDate={currentDate} /></div>
        </div>

        <div className='flex justify-start gap-3 mb-4 w-full'>
          <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            {/* <DialogTrigger asChild>
                <Button variant="outline">Share</Button>
              </DialogTrigger> */}
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Konfirmasi Check Out</DialogTitle>
                <DialogDescription>
                  Anda yakin akan check out?
                </DialogDescription>
              </DialogHeader>

              <DialogFooter className="flex flex-row items-center justify-center gap-2">

                <DialogClose asChild>
                  <form className="" action={formAction} >
                    <input type="hidden" name="attId" value={attendace.id} />
                    <Button type="submit" variant="secondary">
                      Ya
                    </Button>
                  </form>
                </DialogClose>

                <DialogClose asChild>
                  <Button type="button" variant="secondary">
                    Batal
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <div>
          <Button
            className="w-full p-8"
            onClick={() => setOpenDialog(true)}
            type="button"
          >Check Out</Button>
        </div>
      </CardContent>
    </Card >

  )
}

export default CheckOut