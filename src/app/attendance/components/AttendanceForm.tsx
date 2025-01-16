'use client'

import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog"
import Timer from "./Timer"
import WebcamCapture from "./WebcamCapture"
import { useSession } from "next-auth/react"
import { useState } from "react"
import moment from "moment"
import Image from "next/image"

const AttendanceForm = ({
  currentDate
}: {
  currentDate: Date
}) => {
  const [openDialog, setOpenDialog] = useState<boolean>(false)
  const [imgUri, setImagUri] = useState<string>('')
  const session = useSession()

  const handleCapture = (imgUri: string) => {
    setImagUri(imgUri)
    setOpenDialog(false)
  }

  const saveAttendace = async () => {
    const blob = await fetch(imgUri).then((res) => res.blob());
    const formData = new FormData();

    formData.append('images', blob)

    fetch('/api/attencance/record', {
      method: 'POST',
      headers: {
        'content-type': 'multipart/form-data'
      },
      body: formData,
    })
  }

  return (
    <Card className='w-[90%]'>
      <CardHeader>
        <CardTitle>Rekam Absensi</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='flex justify-start gap-3 mb-4'>
          <div className="w-[60px]">Nama</div>
          <div>: {session?.data?.user.name}</div>
        </div>

        <div className='flex justify-start gap-3 mb-4'>
          <div className="w-[60px]">Tanggal</div>
          <div className="flex">: {moment(currentDate).format('LL')}</div>
        </div>

        <div className='flex justify-start gap-3 mb-4'>
          <div className="w-[60px]">Jam</div>
          <div className="flex"><div>:&nbsp;</div><Timer serverDate={currentDate} /></div>
        </div>

        <div className='flex justify-start gap-3 mb-4 w-full'>
          <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full h-[130px]">
                <div className="w-full h-full overflow-hidden flex flex-col items-center justify-start space-y-2">
                  <div className="w-full h-full flex items-center justify-center space-x-2 overflow-hidden">
                    <Image
                      src={imgUri !== '' ? imgUri : '/assets/images/selfie.png'}
                      alt="camera"
                      className={`h-full ${imgUri === '' ? 'opacity-40' : ''}`}
                    />
                  </div>
                  <div className="font-bold opacity-40">{imgUri === '' ? 'Ambil Foto' : 'Ulangi'}</div>
                </div>
              </Button>
            </DialogTrigger>

            <DialogContent>
              {/* <DialogHeader>
                  <DialogTitle>Foto Selfie</DialogTitle>
                </DialogHeader> */}
              <div className="w-full h-full">
                <WebcamCapture
                  onCapture={(imgUri: string) => handleCapture(imgUri)}
                />
              </div>

            </DialogContent>
          </Dialog>
        </div>
        <div>
          <Button
            className="w-full p-8"
            onClick={() => saveAttendace()}
            disabled={imgUri === ''}
          >Simpan</Button>
        </div>
      </CardContent>
    </Card >
  )
}

export default AttendanceForm