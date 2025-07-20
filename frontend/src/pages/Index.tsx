import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ThemeToggle } from "@/components/ThemeToggle"
import { GraduationCap, Shield, TrendingUp, Users, FileText, Bell } from "lucide-react"

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">Placement Trackr</h1>
        </div>
        <ThemeToggle />
      </header>

      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-5xl font-bold text-foreground">
            Track Your Placement Journey
          </h2>
          <p className="text-xl text-muted-foreground">
            A comprehensive platform for students and administrators to manage campus placements efficiently
          </p>
          
          {/* Login Cards */}
          <div className="grid md:grid-cols-2 gap-6 mt-12 max-w-2xl mx-auto">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <GraduationCap className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-center">Student Portal</CardTitle>
                <CardDescription className="text-center">
                  Access your profile, notifications, and track applications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link to="/student-login">
                  <Button className="w-full" size="lg">
                    Student Login
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-center">Admin Portal</CardTitle>
                <CardDescription className="text-center">
                  Manage students, drives, and generate placement reports
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link to="/admin-login">
                  <Button className="w-full" size="lg" variant="outline">
                    Admin Login
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-muted/50 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12 text-foreground">
            Platform Features
          </h3>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h4 className="text-xl font-semibold">Student Management</h4>
              <p className="text-muted-foreground">
                Comprehensive student profiles with resume upload and OCR processing
              </p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Bell className="h-6 w-6 text-primary" />
              </div>
              <h4 className="text-xl font-semibold">Real-time Notifications</h4>
              <p className="text-muted-foreground">
                Instant updates on placement drives and application status
              </p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <h4 className="text-xl font-semibold">Application Tracking</h4>
              <p className="text-muted-foreground">
                Complete visibility into the placement process from application to offer
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t py-8 px-6 text-center">
        <p className="text-muted-foreground">
          © 2024 Placement Trackr. Built for efficient campus placement management.
        </p>
      </footer>
    </div>
  );
};

export default Index;
