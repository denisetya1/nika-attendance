import { create } from 'zustand'

interface ImageCaptureState {
  src: string
  save: (uri: string) => void
}

const useImageCapture = create<ImageCaptureState>((set) => ({
  src: '',
  save: (uri) => set({ src: uri }),
}))
