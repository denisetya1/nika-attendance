import AttendanceForm from './components/AttendanceForm';

const AttendancePage = async () => {
  const currentDate = new Date();

  return (
    <div className='flex justify-center items-center h-full w-full'>
      <AttendanceForm
        currentDate={currentDate}
      />
    </div>
  )
}

export default AttendancePage