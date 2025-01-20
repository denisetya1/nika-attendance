'use client'

import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Dialog, DialogTrigger, DialogContent, DialogClose, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import Timer from "./Timer"
import { useEffect, useState } from "react"
import moment from "moment"
import { checkOutAttendance } from "@/services/attendance"
import { useFormState } from "react-dom"
import { AttendaceRecord } from "@prisma/client"
import { CheckCircle } from "lucide-react"
import Image from "next/image"
import ButtonIndicator from "@/components/ButtonIndicator"
import WebcamCapture from "./WebcamCapture"
import { useToast } from "@/hooks/use-toast"

const CheckOut = ({
  attendace,
  currentDate,
  name
}: {
  attendace: AttendaceRecord,
  currentDate: Date,
  name: string
}) => {
  const [state, formAction] = useFormState(checkOutAttendance, null);
  const [openDialog, setOpenDialog] = useState<boolean>(false)
  const [imgUri, setImagUri] = useState<string>('')
  const { toast } = useToast();

  useEffect(() => {
    if (state?.message) {
      toast({
        title: "Error!",
        description: state?.message,
      });
    }
  }, [state?.message, toast])

  const handleCapture = (imgUri: string) => {
    setImagUri(imgUri)
    setOpenDialog(false)
  }

  return (
    <form className="w-[90%]" action={formAction} >
      <Card className='w-full'>
        <CardHeader>
          <CardTitle className="text-center mb-5">
            <h1>Rekam Absensi Keluar (Check Out)</h1>
          </CardTitle>
        </CardHeader>
        <CardContent>

          <div className="flex justify-center items-center mb-5">
            <div className="text-green-500 p-3 border-[1px] border-green-400 rounded-lg">
              <CheckCircle size={50} />
            </div>
          </div>

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
                      <input type="hidden" name="attId" value={attendace.id} />
                    </div>
                    <div className="font-bold opacity-40">{imgUri === '' ? 'Ambil Foto Check out' : 'Ulangi'}</div>
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
              text="Check Out"
              disabled={imgUri === ''}
              pendingText="Memproses..."
            />
          </div>

        </CardContent>
      </Card >
    </form>
  )
}

export default CheckOut