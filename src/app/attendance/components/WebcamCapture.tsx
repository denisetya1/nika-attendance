"use client"

import { Button } from "@/components/ui/button";
import { useCallback, useRef } from "react";
import Webcam from "react-webcam";

const videoConstraints = {
  width: 1280,
  height: 720,
  facingMode: "user"
};

const WebcamCapture = ({
  onCapture
}: {
  onCapture: (imgUri: string) => void
}) => {
  const webcamRef = useRef<any>()

  const capture = useCallback(
    () => {
      const imageSrc = webcamRef.current.getScreenshot();
      onCapture(imageSrc);
    },
    [webcamRef, onCapture]
  );

  return (
    <div className="flex flex-col items-center justify-center relative  overflow-hidden">
      <Webcam
        audio={false}
        height={720}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        width={1280}
        videoConstraints={videoConstraints}
      />
      <div className="mt-4 absolute bottom-[30px]">
        <div className="p-2 rounded-full overflow-hidden border-[1px] border-white">
          <Button className="rounded-full w-[40px] h-[40px] text-xs" variant="default" onClick={capture}>&nbsp;</Button>
        </div>
      </div>
    </div>
  );
};

export default WebcamCapture;
