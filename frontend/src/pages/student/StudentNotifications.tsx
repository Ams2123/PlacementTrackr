import { useState } from "react"
import { SidebarProvider } from "@/components/ui/sidebar"
import { StudentSidebar } from "@/components/StudentSidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Bell, Clock, CheckCircle, XCircle } from "lucide-react"

export default function StudentNotifications() {
  const { toast } = useToast()
  
  // Mock notifications data (would come from Supabase)
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      driveId: 101,
      message: "New placement drive for Software Engineer role at Global Tech Inc. Eligibility: CSE/IT, CGPA >= 8.0, Skills: Python, AWS",
      timestamp: "2 hours ago",
      status: "pending",
      companyName: "Global Tech Inc",
      position: "Software Engineer",
      deadline: "2024-01-25"
    },
    {
      id: 2,
      driveId: 102,
      message: "Exciting opportunity for Frontend Developer position at InnovateLabs. Required skills: React, TypeScript, Node.js",
      timestamp: "1 day ago",
      status: "pending",
      companyName: "InnovateLabs",
      position: "Frontend Developer",
      deadline: "2024-01-28"
    },
    {
      id: 3,
      driveId: 103,
      message: "Data Analyst position available at DataFlow Inc. Looking for candidates with Python, SQL, and Analytics experience",
      timestamp: "3 days ago",
      status: "accepted",
      companyName: "DataFlow Inc",
      position: "Data Analyst",
      deadline: "2024-01-30"
    },
    {
      id: 4,
      driveId: 104,
      message: "Backend Developer role at CloudSystems. Requirements: Java, Spring Boot, Microservices",
      timestamp: "5 days ago",
      status: "rejected",
      companyName: "CloudSystems",
      position: "Backend Developer",
      deadline: "2024-01-22"
    }
  ])

  const handleAccept = (notificationId: number) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId 
          ? { ...notif, status: "accepted" }
          : notif
      )
    )
    
    toast({
      title: "Application Accepted",
      description: "You have successfully applied for this position.",
    })
  }

  const handleReject = (notificationId: number) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId 
          ? { ...notif, status: "rejected" }
          : notif
      )
    )
    
    toast({
      title: "Application Rejected",
      description: "You have declined this opportunity.",
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline">Pending</Badge>
      case "accepted":
        return <Badge className="bg-green-500 hover:bg-green-600">Accepted</Badge>
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>
      default:
        return null
    }
  }

  const pendingNotifications = notifications.filter(n => n.status === "pending")
  const processedNotifications = notifications.filter(n => n.status !== "pending")

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <StudentSidebar />
        <main className="flex-1 p-6 bg-background">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center gap-3">
              <Bell className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-3xl font-bold">Notifications</h1>
                <p className="text-muted-foreground mt-1">
                  Stay updated with placement drives and opportunities
                </p>
              </div>
            </div>

            {/* Pending Notifications */}
            {pendingNotifications.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Pending Actions ({pendingNotifications.length})
                </h2>
                
                {pendingNotifications.map((notification) => (
                  <Card key={notification.id} className="border-l-4 border-l-primary">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <CardTitle className="text-lg">{notification.companyName}</CardTitle>
                          <CardDescription className="text-base">
                            {notification.position}
                          </CardDescription>
                        </div>
                        <div className="text-right">
                          {getStatusBadge(notification.status)}
                          <p className="text-xs text-muted-foreground mt-1">
                            {notification.timestamp}
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm">{notification.message}</p>
                      
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">
                          <strong>Application Deadline:</strong> {notification.deadline}
                        </div>
                        
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleReject(notification.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleAccept(notification.id)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Accept & Apply
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Processed Notifications */}
            {processedNotifications.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Previous Notifications</h2>
                
                {processedNotifications.map((notification) => (
                  <Card key={notification.id} className="opacity-75">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <CardTitle className="text-lg">{notification.companyName}</CardTitle>
                          <CardDescription className="text-base">
                            {notification.position}
                          </CardDescription>
                        </div>
                        <div className="text-right">
                          {getStatusBadge(notification.status)}
                          <p className="text-xs text-muted-foreground mt-1">
                            {notification.timestamp}
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{notification.message}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {notifications.length === 0 && (
              <Card className="text-center py-12">
                <CardContent>
                  <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Notifications</h3>
                  <p className="text-muted-foreground">
                    You're all caught up! New placement opportunities will appear here.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}