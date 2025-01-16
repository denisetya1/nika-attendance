import React from 'react'

const Preview = ({ dataUri, isFullscreen }: { dataUri: string, isFullscreen: boolean }) => {
  return (
    <div>
      <img src={dataUri} />
    </div>
  )
}

export default Preview