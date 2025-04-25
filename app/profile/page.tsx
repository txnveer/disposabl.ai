"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, UserPlus, X, Check, Search, Camera, Plus, Album, Users, Calendar, ImagePlus } from "lucide-react"
import DashboardHeader from "@/components/dashboard-header"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

export default function ProfilePage() {
  const { toast } = useToast()
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Mock user data - in a real app, this would come from your database
  const [user, setUser] = useState({
    id: "1",
    name: "User",
    username: "photouser",
    email: "dsa1@gmail.com",
    bio: "I love taking photos at events!",
    profileImage: "",
  })

  const [friends, setFriends] = useState([
    { id: "2", name: "Alex Johnson", username: "alexj", profileImage: "" },
    { id: "3", name: "Sam Taylor", username: "samtaylor", profileImage: "" },
  ])

  const [friendRequests, setFriendRequests] = useState([
    { id: "4", name: "Jamie Smith", username: "jamiesmith", profileImage: "" },
  ])

  // Mock albums data
  const [myAlbums, setMyAlbums] = useState([
    {
      id: "1",
      name: "Summer Wedding 2023",
      date: "2023-07-15",
      photoCount: 87,
      coverImage: "/romantic-garden-vows.png",
    },
    {
      id: "2",
      name: "Birthday Party",
      date: "2023-08-20",
      photoCount: 42,
      coverImage: "/retro-party-vibes.png",
    },
  ])

  const [sharedAlbums, setSharedAlbums] = useState([
    {
      id: "3",
      name: "Beach Trip",
      date: "2023-06-10",
      owner: "Alex Johnson",
      photoCount: 63,
      coverImage: "/vintage-friends.png",
    },
    {
      id: "4",
      name: "Graduation",
      date: "2023-05-25",
      owner: "Sam Taylor",
      photoCount: 29,
      coverImage: "/city-cafe-moment.png",
    },
  ])

  const [searchUsername, setSearchUsername] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    name: user.name,
    username: user.username,
    bio: user.bio,
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault()

    // In a real app, you would send this data to your API
    setUser((prev) => ({
      ...prev,
      name: formData.name,
      username: formData.username,
      bio: formData.bio,
    }))

    toast({
      title: "Profile updated",
      description: "Your profile information has been updated successfully.",
    })
  }

  const handleProfileImageClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // In a real app, you would upload this file to your storage service
    // For now, we'll just create a local URL
    const imageUrl = URL.createObjectURL(file)
    setUser((prev) => ({ ...prev, profileImage: imageUrl }))

    toast({
      title: "Profile photo updated",
      description: "Your profile photo has been updated successfully.",
    })
  }

  const handleFriendSearch = (e: React.FormEvent) => {
    e.preventDefault()

    if (!searchUsername.trim()) return

    setIsSearching(true)

    // In a real app, you would search your database
    // For now, we'll simulate a search with a timeout
    setTimeout(() => {
      // Mock search results
      const results = [
        { id: "5", name: "Chris Wilson", username: searchUsername, profileImage: "" },
        { id: "6", name: "Jordan Lee", username: `${searchUsername}2`, profileImage: "" },
      ]

      setSearchResults(results)
      setIsSearching(false)
    }, 1000)
  }

  const handleSendFriendRequest = (userId: string) => {
    // In a real app, you would send a friend request to your API
    toast({
      title: "Friend request sent",
      description: "Your friend request has been sent successfully.",
    })

    // Remove from search results
    setSearchResults((prev) => prev.filter((user) => user.id !== userId))
  }

  const handleAcceptFriendRequest = (userId: string) => {
    // Find the friend request
    const request = friendRequests.find((req) => req.id === userId)
    if (!request) return

    // Add to friends
    setFriends((prev) => [...prev, request])

    // Remove from friend requests
    setFriendRequests((prev) => prev.filter((req) => req.id !== userId))

    toast({
      title: "Friend request accepted",
      description: `You are now friends with ${request.name}.`,
    })
  }

  const handleRejectFriendRequest = (userId: string) => {
    // Remove from friend requests
    setFriendRequests((prev) => prev.filter((req) => req.id !== userId))

    toast({
      title: "Friend request rejected",
      description: "The friend request has been rejected.",
    })
  }

  const handleRemoveFriend = (userId: string) => {
    // Remove from friends
    setFriends((prev) => prev.filter((friend) => friend.id !== userId))

    toast({
      title: "Friend removed",
      description: "The friend has been removed from your friends list.",
    })
  }

  return (
    <div className="flex flex-col min-h-screen bg-white text-black">
      <DashboardHeader user={user} />
      <main className="flex-1 container max-w-4xl py-6 px-4">
        <h1 className="text-2xl font-bold mb-6">Your Profile</h1>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6 bg-gray-100 border border-gray-200">
            <TabsTrigger value="profile" className="data-[state=active]:bg-primary data-[state=active]:text-black">
              <User className="h-4 w-4 mr-2" />
              Profile Information
            </TabsTrigger>
            <TabsTrigger value="friends" className="data-[state=active]:bg-primary data-[state=active]:text-black">
              <UserPlus className="h-4 w-4 mr-2" />
              Friends
            </TabsTrigger>
            <TabsTrigger value="albums" className="data-[state=active]:bg-primary data-[state=active]:text-black">
              <Album className="h-4 w-4 mr-2" />
              Albums
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <Card className="bg-white border border-gray-200">
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription className="text-gray-600">
                  Update your personal information and profile photo
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col sm:flex-row gap-6 items-center">
                  <div className="relative">
                    <Avatar
                      className="h-24 w-24 cursor-pointer border-2 border-primary"
                      onClick={handleProfileImageClick}
                    >
                      {user.profileImage ? (
                        <AvatarImage src={user.profileImage || "/placeholder.svg"} alt={user.name} />
                      ) : (
                        <AvatarFallback className="bg-primary/20 text-primary text-xl">
                          {user.name.charAt(0)}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div
                      className="absolute bottom-0 right-0 bg-primary text-black rounded-full p-1 cursor-pointer"
                      onClick={handleProfileImageClick}
                    >
                      <Camera className="h-4 w-4" />
                    </div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 mb-1">Click on the photo to update your profile picture</p>
                    <p className="text-sm text-gray-600">Upload a square image for best results</p>
                  </div>
                </div>

                <form onSubmit={handleProfileUpdate} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="bg-white border-gray-200"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      className="bg-white border-gray-200"
                    />
                    <p className="text-xs text-gray-600">
                      This is how friends will find you. Usernames must be unique.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      value={user.email}
                      disabled
                      className="bg-gray-50 border-gray-200 text-gray-500"
                    />
                    <p className="text-xs text-gray-600">Your email cannot be changed</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Input
                      id="bio"
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      className="bg-white border-gray-200"
                    />
                  </div>

                  <Button type="submit" className="bg-primary text-black hover:bg-primary/90">
                    Save Changes
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="friends" className="space-y-6">
            <Card className="bg-white border border-gray-200">
              <CardHeader>
                <CardTitle>Find Friends</CardTitle>
                <CardDescription className="text-gray-600">Search for friends by username</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleFriendSearch} className="space-y-4">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                      <Input
                        placeholder="Search by username..."
                        value={searchUsername}
                        onChange={(e) => setSearchUsername(e.target.value)}
                        className="pl-8 bg-white border-gray-200"
                      />
                    </div>
                    <Button
                      type="submit"
                      className="bg-primary text-black hover:bg-primary/90"
                      disabled={isSearching || !searchUsername.trim()}
                    >
                      {isSearching ? "Searching..." : "Search"}
                    </Button>
                  </div>

                  {searchResults.length > 0 && (
                    <div className="space-y-2 mt-4">
                      <h3 className="text-sm font-medium">Search Results</h3>
                      <div className="space-y-2">
                        {searchResults.map((result) => (
                          <div
                            key={result.id}
                            className="flex items-center justify-between p-2 rounded-md border border-gray-200"
                          >
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                {result.profileImage ? (
                                  <AvatarImage src={result.profileImage || "/placeholder.svg"} alt={result.name} />
                                ) : (
                                  <AvatarFallback className="bg-primary/20 text-primary">
                                    {result.name.charAt(0)}
                                  </AvatarFallback>
                                )}
                              </Avatar>
                              <div>
                                <p className="text-sm font-medium">{result.name}</p>
                                <p className="text-xs text-gray-600">@{result.username}</p>
                              </div>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-gray-200 hover:bg-gray-100"
                              onClick={() => handleSendFriendRequest(result.id)}
                            >
                              <UserPlus className="h-4 w-4 mr-1" />
                              Add
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </form>
              </CardContent>
            </Card>

            {friendRequests.length > 0 && (
              <Card className="bg-white border border-gray-200">
                <CardHeader>
                  <CardTitle>Friend Requests</CardTitle>
                  <CardDescription className="text-gray-600">People who want to connect with you</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {friendRequests.map((request) => (
                      <div
                        key={request.id}
                        className="flex items-center justify-between p-2 rounded-md border border-gray-200"
                      >
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            {request.profileImage ? (
                              <AvatarImage src={request.profileImage || "/placeholder.svg"} alt={request.name} />
                            ) : (
                              <AvatarFallback className="bg-primary/20 text-primary">
                                {request.name.charAt(0)}
                              </AvatarFallback>
                            )}
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">{request.name}</p>
                            <p className="text-xs text-gray-600">@{request.username}</p>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-gray-200 hover:bg-gray-100 h-8 w-8 p-0"
                            onClick={() => handleAcceptFriendRequest(request.id)}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-gray-200 hover:bg-gray-100 h-8 w-8 p-0"
                            onClick={() => handleRejectFriendRequest(request.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="bg-white border border-gray-200">
              <CardHeader>
                <CardTitle>Your Friends</CardTitle>
                <CardDescription className="text-gray-600">People you've connected with</CardDescription>
              </CardHeader>
              <CardContent>
                {friends.length === 0 ? (
                  <div className="text-center py-6">
                    <p className="text-gray-600">You don't have any friends yet.</p>
                    <p className="text-gray-600 text-sm mt-1">Search for friends to get started.</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {friends.map((friend) => (
                      <div
                        key={friend.id}
                        className="flex items-center justify-between p-2 rounded-md border border-gray-200"
                      >
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            {friend.profileImage ? (
                              <AvatarImage src={friend.profileImage || "/placeholder.svg"} alt={friend.name} />
                            ) : (
                              <AvatarFallback className="bg-primary/20 text-primary">
                                {friend.name.charAt(0)}
                              </AvatarFallback>
                            )}
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">{friend.name}</p>
                            <p className="text-xs text-gray-600">@{friend.username}</p>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-gray-200 hover:bg-gray-100"
                          onClick={() => handleRemoveFriend(friend.id)}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="albums" className="space-y-6">
            <Card className="bg-white border border-gray-200">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Your Albums</CardTitle>
                  <CardDescription className="text-gray-600">Albums you've created for your events</CardDescription>
                </div>
                <Button className="bg-primary text-black hover:bg-primary/90">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Album
                </Button>
              </CardHeader>
              <CardContent>
                {myAlbums.length === 0 ? (
                  <div className="text-center py-6">
                    <p className="text-gray-600">You haven't created any albums yet.</p>
                    <p className="text-gray-600 text-sm mt-1">Create your first album to get started.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {myAlbums.map((album) => (
                      <div key={album.id} className="group relative overflow-hidden rounded-lg border border-gray-200">
                        <div className="aspect-[4/3] bg-gray-100 relative">
                          <img
                            src={album.coverImage || "/placeholder.svg?height=300&width=400&query=event"}
                            alt={album.name}
                            className="h-full w-full object-cover transition-transform group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <h3 className="text-lg font-semibold text-white">{album.name}</h3>
                          <div className="flex items-center gap-4 mt-1">
                            <div className="flex items-center text-xs text-white/80">
                              <Calendar className="h-3 w-3 mr-1" />
                              {new Date(album.date).toLocaleDateString()}
                            </div>
                            <div className="flex items-center text-xs text-white/80">
                              <ImagePlus className="h-3 w-3 mr-1" />
                              {album.photoCount} photos
                            </div>
                          </div>
                        </div>
                        <Link href={`/event/${album.id}`} className="absolute inset-0">
                          <span className="sr-only">View album</span>
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-white border border-gray-200">
              <CardHeader>
                <CardTitle>Albums You're Part Of</CardTitle>
                <CardDescription className="text-gray-600">Albums shared with you by friends</CardDescription>
              </CardHeader>
              <CardContent>
                {sharedAlbums.length === 0 ? (
                  <div className="text-center py-6">
                    <p className="text-gray-600">You're not part of any shared albums yet.</p>
                    <p className="text-gray-600 text-sm mt-1">
                      When friends share albums with you, they'll appear here.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {sharedAlbums.map((album) => (
                      <div key={album.id} className="group relative overflow-hidden rounded-lg border border-gray-200">
                        <div className="aspect-[4/3] bg-gray-100 relative">
                          <img
                            src={album.coverImage || "/placeholder.svg?height=300&width=400&query=event"}
                            alt={album.name}
                            className="h-full w-full object-cover transition-transform group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <h3 className="text-lg font-semibold text-white">{album.name}</h3>
                          <div className="flex items-center gap-4 mt-1">
                            <div className="flex items-center text-xs text-white/80">
                              <Users className="h-3 w-3 mr-1" />
                              By {album.owner}
                            </div>
                            <div className="flex items-center text-xs text-white/80">
                              <ImagePlus className="h-3 w-3 mr-1" />
                              {album.photoCount} photos
                            </div>
                          </div>
                        </div>
                        <Link href={`/shared-album/${album.id}`} className="absolute inset-0">
                          <span className="sr-only">View album</span>
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
              <CardFooter className="border-t border-gray-100 pt-4">
                <p className="text-xs text-gray-500">
                  Albums shared with you are view-only unless the owner gives you edit permissions.
                </p>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
