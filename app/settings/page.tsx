"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SettingsIcon, Bell, Shield, Film, Moon, Sun } from "lucide-react"
import DashboardHeader from "@/components/dashboard-header"
import { useToast } from "@/hooks/use-toast"

export default function SettingsPage() {
  const { toast } = useToast()

  // Mock user data - in a real app, this would come from your database
  const [user, setUser] = useState({
    name: "User",
    email: "dsa1@gmail.com",
  })

  // Settings state
  const [eventSettings, setEventSettings] = useState({
    defaultMaxPhotos: 10,
    defaultDuration: 24,
    autoApprovePhotos: false,
    notifyOnUpload: true,
    allowGuestComments: false,
    defaultFilter: "classic",
  })

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    friendRequests: true,
    photoUploads: true,
    eventReminders: true,
  })

  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: "public",
    allowFriendRequests: true,
    showEventsToFriends: true,
  })

  const [appearanceSettings, setAppearanceSettings] = useState({
    theme: "light",
    highContrast: false,
  })

  const handleEventSettingsChange = (key: string, value: any) => {
    setEventSettings((prev) => ({ ...prev, [key]: value }))
  }

  const handleNotificationSettingsChange = (key: string, value: boolean) => {
    setNotificationSettings((prev) => ({ ...prev, [key]: value }))
  }

  const handlePrivacySettingsChange = (key: string, value: any) => {
    setPrivacySettings((prev) => ({ ...prev, [key]: value }))
  }

  const handleAppearanceSettingsChange = (key: string, value: any) => {
    setAppearanceSettings((prev) => ({ ...prev, [key]: value }))
  }

  const handleSaveSettings = (settingType: string) => {
    // In a real app, you would save these settings to your database
    toast({
      title: "Settings saved",
      description: `Your ${settingType} settings have been updated successfully.`,
    })
  }

  return (
    <div className="flex flex-col min-h-screen bg-white text-black">
      <DashboardHeader user={user} />
      <main className="flex-1 container max-w-4xl py-6 px-4">
        <h1 className="text-2xl font-bold mb-6">Settings</h1>

        <Tabs defaultValue="events" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6 bg-gray-100 border border-gray-200">
            <TabsTrigger value="events" className="data-[state=active]:bg-primary data-[state=active]:text-black">
              <Film className="h-4 w-4 mr-2" />
              Events
            </TabsTrigger>
            <TabsTrigger
              value="notifications"
              className="data-[state=active]:bg-primary data-[state=active]:text-black"
            >
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="privacy" className="data-[state=active]:bg-primary data-[state=active]:text-black">
              <Shield className="h-4 w-4 mr-2" />
              Privacy
            </TabsTrigger>
            <TabsTrigger value="appearance" className="data-[state=active]:bg-primary data-[state=active]:text-black">
              <SettingsIcon className="h-4 w-4 mr-2" />
              Appearance
            </TabsTrigger>
          </TabsList>

          <TabsContent value="events" className="space-y-6">
            <Card className="bg-white border border-gray-200">
              <CardHeader>
                <CardTitle>Event Defaults</CardTitle>
                <CardDescription className="text-gray-600">
                  Configure default settings for new events you create
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="defaultMaxPhotos">Default Max Photos Per Guest</Label>
                    <span className="text-sm font-medium text-primary">{eventSettings.defaultMaxPhotos}</span>
                  </div>
                  <Slider
                    id="defaultMaxPhotos"
                    min={1}
                    max={50}
                    step={1}
                    value={[eventSettings.defaultMaxPhotos]}
                    onValueChange={(value) => handleEventSettingsChange("defaultMaxPhotos", value[0])}
                    className="py-4"
                  />
                  <p className="text-xs text-gray-600">
                    This limits how many photos each guest can upload to your events
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="defaultDuration">Default Event Duration (hours)</Label>
                    <span className="text-sm font-medium text-primary">{eventSettings.defaultDuration}</span>
                  </div>
                  <Slider
                    id="defaultDuration"
                    min={1}
                    max={72}
                    step={1}
                    value={[eventSettings.defaultDuration]}
                    onValueChange={(value) => handleEventSettingsChange("defaultDuration", value[0])}
                    className="py-4"
                  />
                  <p className="text-xs text-gray-600">The default time window during which guests can upload photos</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="defaultFilter">Default Photo Filter</Label>
                  <Select
                    value={eventSettings.defaultFilter}
                    onValueChange={(value) => handleEventSettingsChange("defaultFilter", value)}
                  >
                    <SelectTrigger id="defaultFilter" className="bg-white border-gray-200">
                      <SelectValue placeholder="Select a filter" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-200">
                      <SelectItem value="classic">Classic Film</SelectItem>
                      <SelectItem value="vintage">Vintage</SelectItem>
                      <SelectItem value="blackAndWhite">Black & White</SelectItem>
                      <SelectItem value="sepia">Sepia</SelectItem>
                      <SelectItem value="none">No Filter</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-600">The default filter applied to photos uploaded to your events</p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="autoApprovePhotos">Auto-approve Photos</Label>
                    <p className="text-xs text-gray-600">Automatically approve all photos uploaded to your events</p>
                  </div>
                  <Switch
                    id="autoApprovePhotos"
                    checked={eventSettings.autoApprovePhotos}
                    onCheckedChange={(value) => handleEventSettingsChange("autoApprovePhotos", value)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="notifyOnUpload">Notify on Photo Upload</Label>
                    <p className="text-xs text-gray-600">
                      Receive notifications when guests upload photos to your events
                    </p>
                  </div>
                  <Switch
                    id="notifyOnUpload"
                    checked={eventSettings.notifyOnUpload}
                    onCheckedChange={(value) => handleEventSettingsChange("notifyOnUpload", value)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="allowGuestComments">Allow Guest Comments</Label>
                    <p className="text-xs text-gray-600">Let guests add comments to their uploaded photos</p>
                  </div>
                  <Switch
                    id="allowGuestComments"
                    checked={eventSettings.allowGuestComments}
                    onCheckedChange={(value) => handleEventSettingsChange("allowGuestComments", value)}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  className="bg-primary text-black hover:bg-primary/90"
                  onClick={() => handleSaveSettings("event")}
                >
                  Save Event Settings
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card className="bg-white border border-gray-200">
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription className="text-gray-600">
                  Control how and when you receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="emailNotifications">Email Notifications</Label>
                    <p className="text-xs text-gray-600">Receive notifications via email</p>
                  </div>
                  <Switch
                    id="emailNotifications"
                    checked={notificationSettings.emailNotifications}
                    onCheckedChange={(value) => handleNotificationSettingsChange("emailNotifications", value)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="pushNotifications">Push Notifications</Label>
                    <p className="text-xs text-gray-600">Receive push notifications on your device</p>
                  </div>
                  <Switch
                    id="pushNotifications"
                    checked={notificationSettings.pushNotifications}
                    onCheckedChange={(value) => handleNotificationSettingsChange("pushNotifications", value)}
                  />
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <h3 className="text-sm font-medium mb-4">Notification Types</h3>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="friendRequests">Friend Requests</Label>
                      <Switch
                        id="friendRequests"
                        checked={notificationSettings.friendRequests}
                        onCheckedChange={(value) => handleNotificationSettingsChange("friendRequests", value)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="photoUploads">Photo Uploads</Label>
                      <Switch
                        id="photoUploads"
                        checked={notificationSettings.photoUploads}
                        onCheckedChange={(value) => handleNotificationSettingsChange("photoUploads", value)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="eventReminders">Event Reminders</Label>
                      <Switch
                        id="eventReminders"
                        checked={notificationSettings.eventReminders}
                        onCheckedChange={(value) => handleNotificationSettingsChange("eventReminders", value)}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  className="bg-primary text-black hover:bg-primary/90"
                  onClick={() => handleSaveSettings("notification")}
                >
                  Save Notification Settings
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="privacy" className="space-y-6">
            <Card className="bg-white border border-gray-200">
              <CardHeader>
                <CardTitle>Privacy Settings</CardTitle>
                <CardDescription className="text-gray-600">
                  Control who can see your profile and interact with you
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="profileVisibility">Profile Visibility</Label>
                  <Select
                    value={privacySettings.profileVisibility}
                    onValueChange={(value) => handlePrivacySettingsChange("profileVisibility", value)}
                  >
                    <SelectTrigger id="profileVisibility" className="bg-white border-gray-200">
                      <SelectValue placeholder="Select visibility" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-200">
                      <SelectItem value="public">Public - Anyone can find you</SelectItem>
                      <SelectItem value="friends">Friends Only - Only friends can see your profile</SelectItem>
                      <SelectItem value="private">Private - Only you can see your profile</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-600">Control who can see your profile information</p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="allowFriendRequests">Allow Friend Requests</Label>
                    <p className="text-xs text-gray-600">Allow others to send you friend requests</p>
                  </div>
                  <Switch
                    id="allowFriendRequests"
                    checked={privacySettings.allowFriendRequests}
                    onCheckedChange={(value) => handlePrivacySettingsChange("allowFriendRequests", value)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="showEventsToFriends">Show Events to Friends</Label>
                    <p className="text-xs text-gray-600">Allow friends to see events you've created</p>
                  </div>
                  <Switch
                    id="showEventsToFriends"
                    checked={privacySettings.showEventsToFriends}
                    onCheckedChange={(value) => handlePrivacySettingsChange("showEventsToFriends", value)}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  className="bg-primary text-black hover:bg-primary/90"
                  onClick={() => handleSaveSettings("privacy")}
                >
                  Save Privacy Settings
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="appearance" className="space-y-6">
            <Card className="bg-white border border-gray-200">
              <CardHeader>
                <CardTitle>Appearance Settings</CardTitle>
                <CardDescription className="text-gray-600">Customize how disposabl looks for you</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="theme">Theme</Label>
                  <div className="flex gap-4 pt-2">
                    <div
                      className={`flex flex-col items-center gap-2 cursor-pointer ${
                        appearanceSettings.theme === "dark" ? "opacity-100" : "opacity-50"
                      }`}
                      onClick={() => handleAppearanceSettingsChange("theme", "dark")}
                    >
                      <div className="w-20 h-20 rounded-md bg-black border border-gray-300 flex items-center justify-center">
                        <Moon className="h-8 w-8 text-primary" />
                      </div>
                      <span className="text-sm">Dark</span>
                    </div>

                    <div
                      className={`flex flex-col items-center gap-2 cursor-pointer ${
                        appearanceSettings.theme === "light" ? "opacity-100" : "opacity-50"
                      }`}
                      onClick={() => handleAppearanceSettingsChange("theme", "light")}
                    >
                      <div className="w-20 h-20 rounded-md bg-white border border-gray-300 flex items-center justify-center">
                        <Sun className="h-8 w-8 text-black" />
                      </div>
                      <span className="text-sm">Light</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="highContrast">High Contrast</Label>
                    <p className="text-xs text-gray-600">Increase contrast for better visibility</p>
                  </div>
                  <Switch
                    id="highContrast"
                    checked={appearanceSettings.highContrast}
                    onCheckedChange={(value) => handleAppearanceSettingsChange("highContrast", value)}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  className="bg-primary text-black hover:bg-primary/90"
                  onClick={() => handleSaveSettings("appearance")}
                >
                  Save Appearance Settings
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
