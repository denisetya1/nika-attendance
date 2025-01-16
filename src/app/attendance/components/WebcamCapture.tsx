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
    <div className="flex flex-col items-center justify-center">
      <Webcam
        audio={false}
        height={720}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        width={1280}
        videoConstraints={videoConstraints}
      />
      <div className="mt-4">
        <Button variant="outline" onClick={capture}>Ambil Foto</Button>
      </div>
    </div>
  );
};

export default WebcamCapture;
