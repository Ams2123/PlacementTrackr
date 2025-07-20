import { SidebarProvider } from "@/components/ui/sidebar"
import { AdminSidebar } from "@/components/AdminSidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Briefcase, TrendingUp, Calendar } from "lucide-react"

export default function AdminDashboard() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AdminSidebar />
        <main className="flex-1 p-6 bg-background">
          <div className="max-w-7xl mx-auto space-y-6">
            <div>
              <h1 className="text-3xl font-bold">TPO Dashboard</h1>
              <p className="text-muted-foreground mt-2">
                Manage placement drives, students, and track placement statistics.
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,248</div>
                  <p className="text-xs text-muted-foreground">+12% from last semester</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Drives</CardTitle>
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">15</div>
                  <p className="text-xs text-muted-foreground">5 closing this week</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Placement Rate</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">78%</div>
                  <p className="text-xs text-muted-foreground">+5% from last year</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Interviews Today</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">23</div>
                  <p className="text-xs text-muted-foreground">Across 8 companies</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Drives</CardTitle>
                  <CardDescription>Latest placement opportunities</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Global Tech Solutions</p>
                      <p className="text-sm text-muted-foreground">Software Engineer - 25 positions</p>
                      <p className="text-xs text-muted-foreground mt-1">Deadline: Jan 25, 2024</p>
                    </div>
                    <Badge>Active</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">InnovateLabs</p>
                      <p className="text-sm text-muted-foreground">Frontend Developer - 15 positions</p>
                      <p className="text-xs text-muted-foreground mt-1">Deadline: Jan 28, 2024</p>
                    </div>
                    <Badge>Active</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">DataFlow Inc</p>
                      <p className="text-sm text-muted-foreground">Data Analyst - 10 positions</p>
                      <p className="text-xs text-muted-foreground mt-1">Deadline: Jan 30, 2024</p>
                    </div>
                    <Badge variant="outline">Upcoming</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Today's Schedule</CardTitle>
                  <CardDescription>Interviews and events</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">Global Tech Solutions</p>
                      <Badge variant="outline">10:00 AM</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">Technical Round - 8 students</p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">InnovateLabs</p>
                      <Badge variant="outline">2:00 PM</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">HR Round - 12 students</p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">CloudSystems</p>
                      <Badge variant="outline">4:30 PM</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">Final Round - 3 students</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Frequently used admin functions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 border rounded-lg text-center hover:bg-muted/50 cursor-pointer transition-colors">
                    <Users className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <p className="font-medium">Add Students</p>
                    <p className="text-xs text-muted-foreground">Bulk upload</p>
                  </div>
                  <div className="p-4 border rounded-lg text-center hover:bg-muted/50 cursor-pointer transition-colors">
                    <Briefcase className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <p className="font-medium">New Drive</p>
                    <p className="text-xs text-muted-foreground">Create job opening</p>
                  </div>
                  <div className="p-4 border rounded-lg text-center hover:bg-muted/50 cursor-pointer transition-colors">
                    <TrendingUp className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <p className="font-medium">Reports</p>
                    <p className="text-xs text-muted-foreground">Generate analytics</p>
                  </div>
                  <div className="p-4 border rounded-lg text-center hover:bg-muted/50 cursor-pointer transition-colors">
                    <Calendar className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <p className="font-medium">Schedule</p>
                    <p className="text-xs text-muted-foreground">Manage interviews</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}