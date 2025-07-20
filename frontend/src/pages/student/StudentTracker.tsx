import { SidebarProvider } from "@/components/ui/sidebar"
import { StudentSidebar } from "@/components/StudentSidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, X, Circle, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

export default function StudentTracker() {
  // Mock application data (would come from Supabase)
  const applications = [
    {
      id: 1,
      company: "Global Tech Inc",
      position: "Software Engineer",
      appliedDate: "2024-01-15",
      currentStage: "Interviewed",
      stages: [
        { name: "Applied", status: "completed", date: "2024-01-15" },
        { name: "Shortlisted", status: "completed", date: "2024-01-18" },
        { name: "Interviewed", status: "current", date: "2024-01-22" },
        { name: "Offered", status: "pending", date: null },
        { name: "Placed", status: "pending", date: null }
      ]
    },
    {
      id: 2,
      company: "InnovateLabs",
      position: "Frontend Developer",
      appliedDate: "2024-01-10",
      currentStage: "Offered",
      stages: [
        { name: "Applied", status: "completed", date: "2024-01-10" },
        { name: "Shortlisted", status: "completed", date: "2024-01-12" },
        { name: "Interviewed", status: "completed", date: "2024-01-16" },
        { name: "Offered", status: "current", date: "2024-01-20" },
        { name: "Placed", status: "pending", date: null }
      ]
    },
    {
      id: 3,
      company: "DataFlow Inc",
      position: "Data Analyst",
      appliedDate: "2024-01-08",
      currentStage: "Rejected",
      stages: [
        { name: "Applied", status: "completed", date: "2024-01-08" },
        { name: "Shortlisted", status: "completed", date: "2024-01-10" },
        { name: "Interviewed", status: "rejected", date: "2024-01-14" },
        { name: "Offered", status: "pending", date: null },
        { name: "Placed", status: "pending", date: null }
      ]
    },
    {
      id: 4,
      company: "CloudSystems",
      position: "Backend Developer",
      appliedDate: "2024-01-20",
      currentStage: "Applied",
      stages: [
        { name: "Applied", status: "current", date: "2024-01-20" },
        { name: "Shortlisted", status: "pending", date: null },
        { name: "Interviewed", status: "pending", date: null },
        { name: "Offered", status: "pending", date: null },
        { name: "Placed", status: "pending", date: null }
      ]
    }
  ]

  const getStageIcon = (status: string, isLast: boolean = false) => {
    switch (status) {
      case "completed":
        return <Check className="h-4 w-4 text-green-600" />
      case "current":
        return <Circle className="h-4 w-4 text-blue-600 fill-current" />
      case "rejected":
        return <X className="h-4 w-4 text-red-600" />
      case "pending":
        return <Circle className="h-4 w-4 text-gray-400" />
      default:
        return <Circle className="h-4 w-4 text-gray-400" />
    }
  }

  const getStageStatus = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-600"
      case "current":
        return "text-blue-600 font-semibold"
      case "rejected":
        return "text-red-600"
      case "pending":
        return "text-gray-500"
      default:
        return "text-gray-500"
    }
  }

  const getApplicationBadge = (currentStage: string) => {
    switch (currentStage) {
      case "Applied":
        return <Badge variant="outline">Applied</Badge>
      case "Shortlisted":
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">Shortlisted</Badge>
      case "Interviewed":
        return <Badge className="bg-blue-500 hover:bg-blue-600">Interviewed</Badge>
      case "Offered":
        return <Badge className="bg-green-500 hover:bg-green-600">Offered</Badge>
      case "Placed":
        return <Badge className="bg-purple-500 hover:bg-purple-600">Placed</Badge>
      case "Rejected":
        return <Badge variant="destructive">Rejected</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <StudentSidebar />
        <main className="flex-1 p-6 bg-background">
          <div className="max-w-6xl mx-auto space-y-6">
            <div>
              <h1 className="text-3xl font-bold">Application Tracker</h1>
              <p className="text-muted-foreground mt-2">
                Track the progress of your placement applications
              </p>
            </div>

            <div className="grid gap-6">
              {applications.map((application) => (
                <Card key={application.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl">{application.company}</CardTitle>
                        <CardDescription className="text-base mt-1">
                          {application.position}
                        </CardDescription>
                        <p className="text-sm text-muted-foreground mt-2">
                          Applied: {application.appliedDate}
                        </p>
                      </div>
                      <div className="text-right">
                        {getApplicationBadge(application.currentStage)}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Progress Timeline */}
                      <div className="flex items-center justify-between relative">
                        {application.stages.map((stage, index) => (
                          <div key={stage.name} className="flex flex-col items-center space-y-2 relative z-10">
                            {/* Stage Icon */}
                            <div className={cn(
                              "w-10 h-10 rounded-full border-2 flex items-center justify-center bg-background",
                              stage.status === "completed" && "border-green-600 bg-green-50",
                              stage.status === "current" && "border-blue-600 bg-blue-50",
                              stage.status === "rejected" && "border-red-600 bg-red-50",
                              stage.status === "pending" && "border-gray-300 bg-gray-50"
                            )}>
                              {getStageIcon(stage.status)}
                            </div>
                            
                            {/* Stage Name */}
                            <div className="text-center">
                              <p className={cn("text-sm font-medium", getStageStatus(stage.status))}>
                                {stage.name}
                              </p>
                              {stage.date && (
                                <p className="text-xs text-muted-foreground mt-1">
                                  {stage.date}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                        
                        {/* Connecting Line */}
                        <div className="absolute top-5 left-5 right-5 h-0.5 bg-gray-200 -z-10">
                          <div 
                            className="h-full bg-blue-500 transition-all duration-300"
                            style={{ 
                              width: `${(application.stages.findIndex(s => s.status === "current" || s.status === "rejected") / (application.stages.length - 1)) * 100}%`
                            }}
                          />
                        </div>
                      </div>

                      {/* Stage Details */}
                      {application.stages.some(stage => stage.status === "current") && (
                        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg border-l-4 border-blue-500">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-blue-600" />
                            <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                              Current Stage: {application.stages.find(s => s.status === "current")?.name}
                            </p>
                          </div>
                          <p className="text-xs text-blue-600 dark:text-blue-300 mt-1">
                            Your application is currently being processed at this stage.
                          </p>
                        </div>
                      )}

                      {application.stages.some(stage => stage.status === "rejected") && (
                        <div className="mt-4 p-3 bg-red-50 dark:bg-red-950 rounded-lg border-l-4 border-red-500">
                          <div className="flex items-center gap-2">
                            <X className="h-4 w-4 text-red-600" />
                            <p className="text-sm font-medium text-red-800 dark:text-red-200">
                              Application was not selected at the {application.stages.find(s => s.status === "rejected")?.name} stage
                            </p>
                          </div>
                          <p className="text-xs text-red-600 dark:text-red-300 mt-1">
                            Better luck next time! Keep applying to other opportunities.
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {applications.length === 0 && (
              <Card className="text-center py-12">
                <CardContent>
                  <Circle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Applications Yet</h3>
                  <p className="text-muted-foreground">
                    Start applying to placement drives to track your progress here.
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