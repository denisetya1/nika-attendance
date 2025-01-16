"use client"

import { useEffect, useState } from "react";
import moment from "moment";
import "moment/locale/id";

const Timer = ({ serverDate }: { serverDate: Date }) => {
  const [time, setTime] = useState(moment(serverDate));
  moment.locale('id')

  useEffect(() => {
    const interval = setInterval(() => {
      setTime((currTime) => moment(currTime).add(1, "seconds"));
    }, 1000);

    return () => clearInterval(interval);
  }, [serverDate])

  return (
    <div>
      <div>{moment(time).locale('id').format("HH:mm:ss")}</div>
    </div>
  )
}

export default Timer