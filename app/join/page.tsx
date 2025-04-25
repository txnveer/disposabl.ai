"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Film } from "lucide-react"
import Link from "next/link"

export default function JoinEventPage() {
  const [eventCode, setEventCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleJoinEvent = (e: React.FormEvent) => {
    e.preventDefault()

    if (!eventCode.trim()) {
      setError("Please enter an event code")
      return
    }

    setIsLoading(true)
    setError(null)

    // In a real app, you would validate the event code against your database
    // For demo purposes, we'll accept any code format and redirect
    setTimeout(() => {
      setIsLoading(false)
      router.push(`/upload/${eventCode.toUpperCase()}`)
    }, 1000)
  }

  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      <header className="px-4 lg:px-6 h-14 flex items-center border-b border-white/10">
        <Link href="/" className="flex items-center justify-center">
          <Film className="h-6 w-6 mr-2 text-primary" />
          <span className="font-bold">disposabl</span>
        </Link>
      </header>
      <main className="flex-1 container py-6 px-4 flex items-center justify-center">
        <Card className="w-full max-w-sm bg-black border border-white/10">
          <CardHeader className="text-center">
            <CardTitle className="text-xl sm:text-2xl">Join an Event</CardTitle>
            <CardDescription className="text-gray-400">Enter the event code to upload photos</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleJoinEvent} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="eventCode" className="text-sm sm:text-base">
                  Event Code
                </Label>
                <Input
                  id="eventCode"
                  placeholder="Enter event code (e.g. ABC123)"
                  value={eventCode}
                  onChange={(e) => setEventCode(e.target.value)}
                  className="uppercase text-center text-lg tracking-wider bg-black border-white/20 text-white"
                  inputMode="text" // Better keyboard on mobile
                  autoCapitalize="characters" // Auto capitalize on mobile
                />
                {error && <p className="text-sm text-red-500">{error}</p>}
              </div>
              <Button
                type="submit"
                className="w-full h-12 text-base bg-primary text-black hover:bg-primary/90"
                disabled={isLoading}
              >
                {isLoading ? "Joining..." : "Join Event"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="relative w-full">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-black px-2 text-gray-400">Or</span>
              </div>
            </div>
            <div className="text-center text-sm">
              <p className="text-gray-400">Are you an event host?</p>
              <Link href="/login" className="text-primary font-medium hover:underline">
                Log in to manage your events
              </Link>
            </div>
          </CardFooter>
        </Card>
      </main>
    </div>
  )
}
