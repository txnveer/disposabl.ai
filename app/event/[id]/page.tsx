"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { QrCode, Share2, Download, Check, X } from "lucide-react"
import DashboardHeader from "@/components/dashboard-header"
import { useToast } from "@/hooks/use-toast"

interface Photo {
  id: string
  url: string
  approved: boolean
}

export default function EventPage({ params }: { params: { id: string } }) {
  const { toast } = useToast()

  // In a real app, you would fetch event details from a database
  const initialEvent = {
    id: params.id,
    name: params.id === "1" ? "Summer Wedding" : "Birthday Party",
    date: params.id === "1" ? "2023-07-15" : "2023-08-20",
    code: params.id === "1" ? "WED123" : "BDY456",
    duration: 24,
    maxPhotos: 10,
    status: params.id === "1" ? "completed" : "active",
    photos: [
      { id: "1", url: "/romantic-garden-vows.png", approved: true },
      { id: "2", url: "/retro-party-vibes.png", approved: false },
      { id: "3", url: "/vintage-friends.png", approved: true },
      { id: "4", url: "/city-cafe-moment.png", approved: false },
    ],
  }

  const [event, setEvent] = useState(initialEvent)
  const [activeTab, setActiveTab] = useState("all")

  const shareUrl = `${process.env.NEXT_PUBLIC_APP_URL || "https://disposabl.vercel.app"}/upload/${event.code}`

  const approvedPhotos = event.photos.filter((photo) => photo.approved)
  const pendingPhotos = event.photos.filter((photo) => !photo.approved)

  const handleApprovePhoto = (photoId: string) => {
    setEvent((prevEvent) => {
      const updatedPhotos = prevEvent.photos.map((photo) =>
        photo.id === photoId ? { ...photo, approved: true } : photo,
      )

      return {
        ...prevEvent,
        photos: updatedPhotos,
      }
    })

    toast({
      title: "Photo approved",
      description: "The photo has been moved to the approved section.",
    })

    // If we're in the pending tab and there are no more pending photos, switch to approved tab
    if (activeTab === "pending" && pendingPhotos.length === 1) {
      setActiveTab("approved")
    }
  }

  const handleRejectPhoto = (photoId: string) => {
    // In a real app, you might want to mark it as rejected rather than just leaving it as not approved
    toast({
      title: "Photo rejected",
      description: "The photo has been rejected.",
      variant: "destructive",
    })
  }

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      <DashboardHeader user={{ name: "User", email: "user@example.com" }} />
      <main className="flex-1 container max-w-5xl py-6 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">{event.name}</h1>
            <p className="text-gray-400">
              {new Date(event.date).toLocaleDateString()} • {event.photos.length} photos
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" className="flex items-center gap-2 border-white/20 bg-black hover:bg-white/10">
              <QrCode className="h-4 w-4" />
              <span className="hidden sm:inline">QR Code</span>
            </Button>
            <Button variant="outline" className="flex items-center gap-2 border-white/20 bg-black hover:bg-white/10">
              <Share2 className="h-4 w-4" />
              <span className="hidden sm:inline">Share Link</span>
            </Button>
            <Button className="flex items-center gap-2 bg-primary text-black hover:bg-primary/90">
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Download All</span>
            </Button>
          </div>
        </div>

        <Card className="overflow-hidden bg-black border border-white/10">
          <CardContent className="p-6">
            <div className="grid gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-medium">Event Details</h3>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-sm">
                    <span className="font-medium">Status: </span>
                    <span className={event.status === "active" ? "text-primary" : "text-gray-400"}>
                      {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                    </span>
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">Event Code: </span>
                    <span className="font-mono bg-white/5 px-2 py-1 rounded text-primary">{event.code}</span>
                  </div>
                </div>
              </div>
              <div className="grid sm:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-medium">Duration: </span>
                  {event.duration} hours
                </div>
                <div>
                  <span className="font-medium">Max Photos per Guest: </span>
                  {event.maxPhotos}
                </div>
                <div>
                  <span className="font-medium">Share URL: </span>
                  <span className="font-mono text-xs break-all text-gray-400">{shareUrl}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4 bg-black/20 border border-white/10">
            <TabsTrigger value="all" className="data-[state=active]:bg-primary data-[state=active]:text-black">
              All Photos ({event.photos.length})
            </TabsTrigger>
            <TabsTrigger value="approved" className="data-[state=active]:bg-primary data-[state=active]:text-black">
              Approved ({approvedPhotos.length})
            </TabsTrigger>
            <TabsTrigger value="pending" className="data-[state=active]:bg-primary data-[state=active]:text-black">
              Pending ({pendingPhotos.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-0">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4">
              {event.photos.map((photo) => (
                <div
                  key={photo.id}
                  className="relative aspect-[3/4] overflow-hidden rounded-lg border border-white/10 bg-black"
                >
                  <Image src={photo.url || "/placeholder.svg"} alt="Event photo" fill className="object-cover" />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                    <div className="flex justify-between items-center">
                      <div
                        className={`text-xs font-medium px-2 py-1 rounded ${
                          photo.approved ? "bg-primary text-black" : "bg-white/10 text-primary"
                        }`}
                      >
                        {photo.approved ? "Approved" : "Pending"}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-white hover:text-white hover:bg-white/20"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="approved" className="mt-0">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4">
              {approvedPhotos.map((photo) => (
                <div
                  key={photo.id}
                  className="relative aspect-[3/4] overflow-hidden rounded-lg border border-white/10 bg-black"
                >
                  <Image src={photo.url || "/placeholder.svg"} alt="Event photo" fill className="object-cover" />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                    <div className="flex justify-between items-center">
                      <div className="text-xs font-medium px-2 py-1 rounded bg-primary text-black">Approved</div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-white hover:text-white hover:bg-white/20"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}

              {approvedPhotos.length === 0 && (
                <div className="col-span-full py-12 text-center">
                  <p className="text-gray-400">No approved photos yet.</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="pending" className="mt-0">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4">
              {pendingPhotos.map((photo) => (
                <div
                  key={photo.id}
                  className="relative aspect-[3/4] overflow-hidden rounded-lg border border-white/10 bg-black"
                >
                  <Image src={photo.url || "/placeholder.svg"} alt="Event photo" fill className="object-cover" />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                    <div className="flex justify-between items-center">
                      <div className="text-xs font-medium px-2 py-1 rounded bg-white/10 text-primary">Pending</div>
                      <div className="flex">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-white hover:text-white hover:bg-white/20"
                          onClick={() => handleApprovePhoto(photo.id)}
                          aria-label="Approve photo"
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-white hover:text-white hover:bg-white/20"
                          onClick={() => handleRejectPhoto(photo.id)}
                          aria-label="Reject photo"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {pendingPhotos.length === 0 && (
                <div className="col-span-full py-12 text-center">
                  <p className="text-gray-400">No pending photos to review.</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
