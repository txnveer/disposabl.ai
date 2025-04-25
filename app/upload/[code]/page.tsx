"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Film, Upload, X, ImageIcon } from "lucide-react"
import { useDropzone } from "react-dropzone"
import Link from "next/link"
import { applyFilmFilter } from "@/lib/utils"
import { useMobile } from "@/hooks/use-mobile"

export default function UploadPage({ params }: { params: { code: string } }) {
  const [event, setEvent] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [files, setFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [success, setSuccess] = useState(false)
  const [activeTab, setActiveTab] = useState("upload")

  // Camera related states
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [cameraActive, setCameraActive] = useState(false)
  const [cameraError, setCameraError] = useState<string | null>(null)
  const [facingMode, setFacingMode] = useState<"user" | "environment">("environment")

  const { isMobile, orientation } = useMobile()

  // In a real app, you would fetch event details from an API
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      if (params.code) {
        setEvent({
          name: `Event ${params.code}`,
          date: new Date().toISOString().split("T")[0],
          code: params.code,
          maxPhotos: 10,
          photosUploaded: 0,
          active: true,
        })
        setLoading(false)
      } else {
        setError("Event not found or has expired")
        setLoading(false)
      }
    }, 1000)
  }, [params.code])

  // Handle camera initialization
  useEffect(() => {
    if (activeTab === "camera" && !cameraActive) {
      startCamera()
    } else if (activeTab !== "camera" && cameraActive) {
      stopCamera()
    }

    return () => {
      if (cameraActive) {
        stopCamera()
      }
    }
  }, [activeTab, orientation])

  // Add this useEffect to handle orientation changes
  useEffect(() => {
    const handleOrientationChange = () => {
      if (cameraActive) {
        // Briefly stop and restart the camera to adjust to new orientation
        stopCamera()
        setTimeout(() => {
          startCamera()
        }, 300)
      }
    }

    window.addEventListener("orientationchange", handleOrientationChange)

    return () => {
      window.removeEventListener("orientationchange", handleOrientationChange)
    }
  }, [cameraActive])

  const startCamera = async () => {
    try {
      setCameraError(null)
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: facingMode },
        audio: false,
      })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setCameraActive(true)
      }
    } catch (err) {
      console.error("Error accessing camera:", err)
      setCameraError("Could not access camera. Please check permissions.")
    }
  }

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      const tracks = stream.getTracks()

      tracks.forEach((track) => {
        track.stop()
      })

      videoRef.current.srcObject = null
      setCameraActive(false)
    }
  }

  const switchCamera = async () => {
    const newFacingMode = facingMode === "user" ? "environment" : "user"
    setFacingMode(newFacingMode)

    if (cameraActive) {
      stopCamera()
      setTimeout(() => {
        startCamera()
      }, 300)
    }
  }

  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current
      const canvas = canvasRef.current
      const context = canvas.getContext("2d")

      if (!context) return

      // Set canvas dimensions to match video
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight

      // Draw video frame to canvas
      context.drawImage(video, 0, 0, canvas.width, canvas.height)

      // Apply film filter effect
      try {
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
        const filteredData = applyFilmFilter(imageData)
        context.putImageData(filteredData, 0, 0)
      } catch (err) {
        console.error("Error applying filter:", err)
      }

      // Convert canvas to blob
      canvas.toBlob(
        (blob) => {
          if (blob) {
            // Create a File object from the blob
            const file = new File(
              [blob],
              `photo_${Date.now()}.  {
            // Create a File object from the blob
            const file = new File([blob], \`photo_${Date.now()}.jpg`,
              { type: "image/jpeg" },
            )

            // Check if we would exceed the max photos limit
            if (event && files.length + 1 > event.maxPhotos - event.photosUploaded) {
              alert(`You can only upload ${event.maxPhotos - event.photosUploaded - files.length} more photos`)
              return
            }

            // Add to files array
            setFiles((prevFiles) => [...prevFiles, file])

            // Generate preview
            const preview = URL.createObjectURL(blob)
            setPreviews((prevPreviews) => [...prevPreviews, preview])

            // Switch to upload tab to show the captured photo
            setActiveTab("upload")
          }
        },
        "image/jpeg",
        0.9,
      )
    }
  }

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".heic"],
    },
    maxFiles: event?.maxPhotos ? event.maxPhotos - event.photosUploaded : 10,
    onDrop: (acceptedFiles) => {
      // Check if we would exceed the max photos limit
      if (event && files.length + acceptedFiles.length > event.maxPhotos - event.photosUploaded) {
        alert(`You can only upload ${event.maxPhotos - event.photosUploaded - files.length} more photos`)
        const allowedFiles = acceptedFiles.slice(0, event.maxPhotos - event.photosUploaded - files.length)
        setFiles((prevFiles) => [...prevFiles, ...allowedFiles])

        // Generate previews for allowed files
        const newPreviews = allowedFiles.map((file) => URL.createObjectURL(file))
        setPreviews((prevPreviews) => [...prevPreviews, ...newPreviews])
      } else {
        setFiles((prevFiles) => [...prevFiles, ...acceptedFiles])

        // Generate previews
        const newPreviews = acceptedFiles.map((file) => URL.createObjectURL(file))
        setPreviews((prevPreviews) => [...prevPreviews, ...newPreviews])
      }
    },
  })

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index))

    // Revoke the object URL to avoid memory leaks
    URL.revokeObjectURL(previews[index])
    setPreviews(previews.filter((_, i) => i !== index))
  }

  const handleUpload = () => {
    if (files.length === 0) return

    setUploading(true)

    // Simulate upload process
    let progress = 0
    const interval = setInterval(() => {
      progress += 5
      setUploadProgress(progress)

      if (progress >= 100) {
        clearInterval(interval)
        setTimeout(() => {
          setUploading(false)
          setSuccess(true)
          setFiles([])
          setPreviews([])
        }, 500)
      }
    }, 200)
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4 bg-black text-white">
        <Card className="w-full max-w-md text-center bg-black border border-white/10">
          <CardHeader>
            <CardTitle>Loading Event</CardTitle>
            <CardDescription className="text-gray-400">Please wait while we load the event details</CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={45} className="w-full bg-white/10" />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4 bg-black text-white">
        <Card className="w-full max-w-md text-center bg-black border border-white/10">
          <CardHeader>
            <CardTitle>Event Not Found</CardTitle>
            <CardDescription className="text-gray-400">{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-400">The event code may be incorrect or the event has expired.</p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full bg-primary text-black hover:bg-primary/90">
              <Link href="/join">Try Another Code</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4 bg-black text-white">
        <Card className="w-full max-w-md text-center bg-black border border-white/10">
          <CardHeader>
            <CardTitle>Upload Complete!</CardTitle>
            <CardDescription className="text-gray-400">Your photos have been successfully uploaded</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="my-6 flex items-center justify-center">
              <div className="rounded-full bg-primary/20 p-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-8 w-8 text-primary"
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </div>
            </div>
            <p className="text-sm text-gray-400">
              Thank you for contributing to {event?.name}! Your photos will be processed with a film-style aesthetic and
              will be available after the event ends.
            </p>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full bg-primary text-black hover:bg-primary/90"
              onClick={() => {
                setSuccess(false)
                setEvent({
                  ...event,
                  photosUploaded: event.photosUploaded + files.length,
                })
              }}
            >
              Upload More Photos
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      <header className="px-4 lg:px-6 h-14 flex items-center border-b border-white/10">
        <Link href="/" className="flex items-center justify-center">
          <Film className="h-6 w-6 mr-2 text-primary" />
          <span className="font-bold">disposabl</span>
        </Link>
      </header>
      <main className="flex-1 container max-w-lg py-6 px-4">
        <Card className="bg-black border border-white/10">
          <CardHeader>
            <CardTitle>{event?.name}</CardTitle>
            <CardDescription className="text-gray-400">Upload your photos to contribute to this event</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm space-y-2">
              <div className="flex justify-between">
                <span>Event Code:</span>
                <span className="font-mono text-primary">{event?.code}</span>
              </div>
              <div className="flex justify-between">
                <span>Photos Remaining:</span>
                <span>
                  {event?.maxPhotos - event?.photosUploaded - files.length} of {event?.maxPhotos}
                </span>
              </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-black/20 border border-white/10">
                <TabsTrigger value="upload" className="data-[state=active]:bg-primary data-[state=active]:text-black">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload
                </TabsTrigger>
                <TabsTrigger value="camera" className="data-[state=active]:bg-primary data-[state=active]:text-black">
                  <Film className="h-4 w-4 mr-2" />
                  Take Photo
                </TabsTrigger>
              </TabsList>

              <TabsContent value="upload" className="mt-4">
                {!uploading && (
                  <div
                    {...getRootProps()}
                    className="border-2 border-dashed border-white/20 rounded-lg p-6 text-center hover:bg-white/5 cursor-pointer transition-colors"
                  >
                    <input {...getInputProps()} />
                    <ImageIcon className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm font-medium">Drag photos here or click to upload</p>
                    <p className="text-xs text-gray-400 mt-1">
                      You can upload up to {event?.maxPhotos - event?.photosUploaded - files.length} more photos
                    </p>
                  </div>
                )}

                {uploading && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Uploading...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} className="w-full bg-white/10" />
                  </div>
                )}
              </TabsContent>

              <TabsContent value="camera" className="mt-4">
                <div className="space-y-4">
                  {cameraError && (
                    <div className="bg-red-900/20 text-red-400 p-3 rounded-md text-sm border border-red-900/30">
                      {cameraError}
                    </div>
                  )}
                  {activeTab === "camera" && isMobile && orientation === "landscape" && (
                    <div className="bg-yellow-900/20 text-yellow-400 p-3 rounded-md text-sm mb-4 border border-yellow-900/30">
                      For best results, please rotate your device to portrait mode.
                    </div>
                  )}

                  <div className="relative aspect-[3/4] bg-black rounded-lg overflow-hidden w-full max-w-md mx-auto border-8 border-black">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted // Add muted attribute to ensure autoplay works on iOS
                      className="absolute inset-0 w-full h-full object-cover"
                    />

                    {/* Overlay with film frame effect */}
                    <div className="absolute inset-0 pointer-events-none border-8 border-black opacity-20"></div>
                    <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/60 to-transparent pointer-events-none"></div>

                    {/* Hidden canvas for processing photos */}
                    <canvas ref={canvasRef} className="hidden" />
                  </div>

                  <div className="flex justify-between items-center mt-4">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={switchCamera}
                      disabled={!cameraActive}
                      className="h-12 w-12 rounded-full border-white/20 bg-black hover:bg-white/10"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-5 w-5"
                      >
                        <path d="M3 4h18"></path>
                        <path d="M12 17v.01"></path>
                        <path d="M7 11v.01"></path>
                        <path d="M17 11v.01"></path>
                        <path d="M12 14a2 2 0 0 0 0-4"></path>
                        <rect width="18" height="18" x="3" y="3" rx="2"></rect>
                      </svg>
                    </Button>
                    <Button
                      onClick={takePhoto}
                      disabled={!cameraActive}
                      className="rounded-full h-16 w-16 flex items-center justify-center bg-primary text-black hover:bg-primary/90"
                      aria-label="Take photo"
                    >
                      <div className="rounded-full h-12 w-12 border-2 border-black"></div>
                    </Button>
                    <div className="w-12"></div> {/* Spacer for alignment */}
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            {previews.length > 0 && !uploading && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Selected Photos ({previews.length})</h3>
                <div className="grid grid-cols-3 gap-2">
                  {previews.map((preview, index) => (
                    <div
                      key={index}
                      className="relative aspect-square rounded-md overflow-hidden bg-black border border-white/20"
                    >
                      <Image
                        src={preview || "/placeholder.svg"}
                        alt={`Preview ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                      <button
                        onClick={() => removeFile(index)}
                        className="absolute top-1 right-1 bg-black/60 rounded-full p-1 text-white hover:bg-black/80"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
          {previews.length > 0 && !uploading && (
            <CardFooter>
              <Button onClick={handleUpload} className="w-full bg-primary text-black hover:bg-primary/90">
                Upload {previews.length} {previews.length === 1 ? "Photo" : "Photos"}
              </Button>
            </CardFooter>
          )}
        </Card>
      </main>
    </div>
  )
}
