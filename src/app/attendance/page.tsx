import AttendanceForm from './components/AttendanceForm';
import { getAttendance } from '@/services/attendance'
import CheckOut from './components/CheckOut';
import { auth } from '@/auth';

const AttendancePage = async () => {
  const currentDate = new Date();
  const attendance = await getAttendance();
  const session = await auth();

  return (
    <div className='flex justify-center items-center h-full w-full'>
      {attendance && <CheckOut name={session?.user?.name as string} attendace={attendance} currentDate={currentDate} />}
      {!attendance && <AttendanceForm name={session?.user?.name as string} currentDate={currentDate} />}
    </div>
  )
}

export default AttendancePage