'use client'

import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Dialog, DialogTrigger, DialogContent, DialogHeader } from "@/components/ui/dialog"
import Timer from "./Timer"
import WebcamCapture from "./WebcamCapture"
import { useState } from "react"
import moment from "moment"
import Image from "next/image"
import { checkInAttendance } from "@/services/attendance"
import { useFormState } from "react-dom"
import ButtonIndicator from "@/components/ButtonIndicator"

const AttendanceForm = ({
  currentDate,
  name
}: {
  currentDate: Date,
  name: string
}) => {
  const [__state, formAction] = useFormState(checkInAttendance, null);
  const [openDialog, setOpenDialog] = useState<boolean>(false)
  const [imgUri, setImagUri] = useState<string>('')

  const handleCapture = (imgUri: string) => {
    setImagUri(imgUri)
    setOpenDialog(false)
  }

  return (
    <form className="w-full h-full flex items-center justify-center" action={formAction} >
      <Card className='w-[90%]'>
        <CardHeader>
          <CardTitle className="text-center mb-5">
            <h1>Rekam Absensi Masuk (Check In)</h1>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex justify-start gap-3 mb-4'>
            <div className="w-[120px]">Nama</div>
            <div>: {name}</div>
          </div>

          <div className='flex justify-start gap-3 mb-4'>
            <div className="w-[120px]">Tanggal</div>
            <div className="flex">: {moment(currentDate).format('LL')}</div>
          </div>

          <div className='flex justify-start gap-3 mb-4'>
            <div className="w-[120px]">Waktu Check In</div>
            <div className="flex"><div>:&nbsp;</div><Timer serverDate={currentDate} /></div>
          </div>

          <div className='flex justify-start gap-3 mb-4 w-full'>
            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full h-[130px]">
                  <div className="w-full h-full overflow-hidden flex flex-col items-center justify-start space-y-2">
                    <div className="w-full h-full flex items-center justify-center space-x-2 overflow-hidden relative">
                      {imgUri && <Image
                        fill
                        objectFit="contain"
                        src={imgUri}
                        alt="photo"
                      />}
                      {imgUri === '' && <Image
                        src='/assets/images/selfie.png'
                        alt="camera"
                        className={`h-full ${imgUri === '' ? 'opacity-40' : ''}`}
                        width={80}
                        height={50}
                      />}
                      <input type="hidden" name="img" value={imgUri} />
                    </div>
                    <div className="font-bold opacity-40">{imgUri === '' ? 'Ambil Foto' : 'Ulangi'}</div>
                  </div>
                </Button>
              </DialogTrigger>

              <DialogContent className="p-0 overflow-hidden">
                <div className="w-full h-full overflow-hidden">
                  <WebcamCapture
                    onCapture={(imgUri: string) => handleCapture(imgUri)}
                  />
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <div>
            <ButtonIndicator
              className="w-full p-8"
              type="submit"
              text="Check In"
              disabled={imgUri === ''}
              pendingText="Memproses..."
            />
          </div>
        </CardContent>
      </Card >
    </form>
  )
}

export default AttendanceForm