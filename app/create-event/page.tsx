import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createEvent } from "@/app/actions"
import DashboardHeader from "@/components/dashboard-header"

export default function CreateEventPage() {
  // Check if user is logged in
  const userCookie = cookies().get("user")
  if (!userCookie) {
    redirect("/login")
  }

  const user = JSON.parse(userCookie.value)

  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader user={user} />
      <main className="flex-1 container max-w-2xl py-6 px-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl sm:text-2xl">Create New Event</CardTitle>
            <CardDescription>Set up a new photo collection event</CardDescription>
          </CardHeader>
          <CardContent>
            <form action={createEvent} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Event Name</Label>
                <Input id="name" name="name" placeholder="e.g., Summer Wedding" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Event Date</Label>
                <Input id="date" name="date" type="date" required />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (hours)</Label>
                  <Input
                    id="duration"
                    name="duration"
                    type="number"
                    min="1"
                    max="72"
                    defaultValue="24"
                    required
                    inputMode="numeric"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxPhotos">Max Photos per Guest</Label>
                  <Input
                    id="maxPhotos"
                    name="maxPhotos"
                    type="number"
                    min="1"
                    max="50"
                    defaultValue="10"
                    required
                    inputMode="numeric"
                  />
                </div>
              </div>

              <Button type="submit" className="w-full h-12 text-base mt-6">
                Create Event
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
