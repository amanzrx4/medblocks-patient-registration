import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { imageEncodeUint8Array, base64ToUint8Array } from '@/utils'
import { AlertCircle, Camera, Upload, X } from 'lucide-react'
import { useCallback, useRef, useState } from 'react'
import Webcam from 'react-webcam'

type PhotoDialogProps = {
  onPhotoCapture: (photo: Uint8Array) => void
  trigger: React.ReactNode
}

type SelectedFile =
  | {
      type: 'webcam'
      file: string
    }
  | {
      type: 'upload'
      file: File
    }

export default function PhotoDialog({
  onPhotoCapture,
  trigger
}: PhotoDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [mode, setMode] = useState<'upload' | 'capture'>('upload')
  const [selectedFile, setSelectedFile] = useState<SelectedFile | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [cameraError, setCameraError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const webcamRef = useRef<Webcam>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile({ file, type: 'upload' })
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCapture = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot()

      if (imageSrc) {
        // const imageUint8Array = webcamToUint8Array(imageSrc)
        setPreview(imageSrc)
        setSelectedFile({ type: 'webcam', file: imageSrc })
        // onPhotoCapture(imageUint8Array)
        // setIsOpen(false)
      }
    }
  }, [webcamRef, onPhotoCapture])

  const handleConfirm = async () => {
    // only here call the onPhotoCapture to return the photo back to main component
    if (selectedFile && preview) {
      let img: Uint8Array

      if (selectedFile.type === 'upload') {
        img = await imageEncodeUint8Array(selectedFile.file)
      } else {
        img = base64ToUint8Array(selectedFile.file)
      }
      onPhotoCapture(img)
      setIsOpen(false)
      setPreview(null)
      setCameraError(null)
      setIsOpen(false)
    }
  }

  const handleClose = () => {
    setSelectedFile(null)
    setPreview(null)
    setCameraError(null)
    setIsOpen(false)
  }

  const handleUserMediaError = (error: string | DOMException) => {
    if (error instanceof DOMException) {
      if (error.name === 'NotAllowedError') {
        setCameraError(
          'Camera access was denied. Please allow camera access to use this feature.'
        )
      } else if (error.name === 'NotFoundError') {
        setCameraError(
          'No camera device found. Please connect a camera and try again.'
        )
      } else {
        setCameraError('Failed to access camera. Please try again.')
      }
    } else {
      setCameraError('An unexpected error occurred while accessing the camera.')
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Photo</DialogTitle>
          <DialogDescription>
            Upload a photo or capture one using your camera
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="flex gap-2">
            <Button
              variant={mode === 'upload' ? 'default' : 'outline'}
              onClick={() => setMode('upload')}
              className="flex-1"
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload
            </Button>
            <Button
              variant={mode === 'capture' ? 'default' : 'outline'}
              onClick={() => setMode('capture')}
              className="flex-1"
            >
              <Camera className="w-4 h-4 mr-2" />
              Capture
            </Button>
          </div>

          {mode === 'upload' ? (
            <div className="space-y-4">
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="photo">Photo</Label>
                <Input
                  id="photo"
                  type="file"
                  accept="image/png, image/jpeg, image/jpg"
                  ref={inputRef}
                  onChange={handleFileChange}
                />
              </div>
              {preview && (
                <div className="relative aspect-square w-full max-w-[300px] mx-auto">
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={() => {
                      setPreview(null)
                      if (inputRef.current) {
                        inputRef.current.value = ''
                      }
                    }}
                  >
                    <X className="w-2 h-2" />
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {cameraError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{cameraError}</AlertDescription>
                </Alert>
              )}

              <div className="relative aspect-video w-full bg-black rounded-lg overflow-hidden">
                {preview ? (
                  <div className="absolute inset-0">
                    <img
                      src={preview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={() => setPreview(null)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <Webcam
                    ref={webcamRef}
                    audio={false}
                    screenshotFormat="image/jpeg"
                    videoConstraints={{
                      width: { ideal: 1280 },
                      height: { ideal: 720 },
                      facingMode: 'user'
                    }}
                    onUserMediaError={handleUserMediaError}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>

              {!preview && !cameraError && (
                <Button onClick={handleCapture} className="w-full">
                  <Camera className="w-4 h-4 mr-2" />
                  Capture Photo
                </Button>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          {preview && <Button onClick={handleConfirm}>Confirm</Button>}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
