import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusCircle } from "lucide-react"
import DashboardHeader from "@/components/dashboard-header"

export default function DashboardPage() {
  // Check if user is logged in
  const userCookie = cookies().get("user")
  if (!userCookie) {
    redirect("/login")
  }

  const user = JSON.parse(userCookie.value)

  // In a real app, you would fetch events from a database
  const events = [
    {
      id: "1",
      name: "Summer Wedding",
      date: "2023-07-15",
      code: "WED123",
      photoCount: 87,
      status: "completed",
    },
    {
      id: "2",
      name: "Birthday Party",
      date: "2023-08-20",
      code: "BDY456",
      photoCount: 42,
      status: "active",
    },
  ]

  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader user={user} />
      <main className="flex-1 container max-w-5xl py-6 space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Your Events</h1>
          <Link href="/create-event">
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Event
            </Button>
          </Link>
        </div>

        {events.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-xl font-medium text-gray-600 dark:text-gray-400">No events yet</h2>
            <p className="mt-2 text-gray-500 dark:text-gray-500">Create your first event to get started</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2">
            {events.map((event) => (
              <Card key={event.id}>
                <CardHeader>
                  <CardTitle>{event.name}</CardTitle>
                  <CardDescription>
                    {new Date(event.date).toLocaleDateString()} • {event.photoCount} photos
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">Event Code</div>
                    <div className="font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm">{event.code}</div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <div className="text-sm">
                    Status:{" "}
                    <span className={event.status === "active" ? "text-green-600" : "text-gray-600"}>
                      {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                    </span>
                  </div>
                  <Link href={`/event/${event.id}`}>
                    <Button variant="outline">View Details</Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
