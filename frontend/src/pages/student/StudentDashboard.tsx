import { SidebarProvider } from "@/components/ui/sidebar"
import { StudentSidebar } from "@/components/StudentSidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bell, FileText, TrendingUp, User } from "lucide-react"
import { useLocation } from 'react-router-dom';
import { useState,useEffect } from "react"

import { createClient } from '@supabase/supabase-js';
const supabaseUrl = import.meta.env.VITE_DB_URL;
const supabaseAnonKey = import.meta.env.VITE_DB_KEY;
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function StudentDashboard() {
  const location = useLocation();
  console.log(location.state?.userEmail);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); 
  
  useEffect(() => {
    const updateProfileCompletion = async () => {
      setError(null);
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('student')
          .select("*");
        if (data.length === 0) {
          throw new Error("Your profile is not complete. Please upload your resume.");
        }
      } catch (error) {
        alert(error.message);
      } finally {
        setLoading(false);
      }
    };

    updateProfileCompletion();
  }, [])

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <StudentSidebar />
        <main className="flex-1 p-6 bg-background">
          <div className="max-w-7xl mx-auto space-y-6">
            <div>
              <h1 className="text-3xl font-bold">Welcome Back, Student!</h1>
              <p className="text-muted-foreground mt-2">
                Track your placement journey and stay updated with the latest opportunities.
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Profile Completion</CardTitle>
                  <User className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">85%</div>
                  <p className="text-xs text-muted-foreground">Complete your profile</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Applications</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">3</div>
                  <p className="text-xs text-muted-foreground">Applications in progress</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Unread Notifications</CardTitle>
                  <Bell className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">5</div>
                  <p className="text-xs text-muted-foreground">New notifications</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Placement Status</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    <Badge variant="secondary">Active</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">Seeking placement</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Applications</CardTitle>
                  <CardDescription>Your latest job applications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Software Engineer - TechCorp</p>
                      <p className="text-sm text-muted-foreground">Applied 2 days ago</p>
                    </div>
                    <Badge variant="outline">Under Review</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Frontend Developer - InnovateLabs</p>
                      <p className="text-sm text-muted-foreground">Applied 5 days ago</p>
                    </div>
                    <Badge>Shortlisted</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Data Analyst - DataFlow Inc</p>
                      <p className="text-sm text-muted-foreground">Applied 1 week ago</p>
                    </div>
                    <Badge variant="outline">Applied</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Latest Notifications</CardTitle>
                  <CardDescription>Recent updates and announcements</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-3 border rounded-lg">
                    <p className="font-medium">New Drive: Global Tech Solutions</p>
                    <p className="text-sm text-muted-foreground">Eligibility: CSE/IT, CGPA &gt;= 8.0</p>
                    <p className="text-xs text-muted-foreground mt-1">2 hours ago</p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <p className="font-medium">Interview Scheduled</p>
                    <p className="text-sm text-muted-foreground">InnovateLabs - Tomorrow 2:00 PM</p>
                    <p className="text-xs text-muted-foreground mt-1">1 day ago</p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <p className="font-medium">Profile Update Required</p>
                    <p className="text-sm text-muted-foreground">Please upload your latest resume</p>
                    <p className="text-xs text-muted-foreground mt-1">3 days ago</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}