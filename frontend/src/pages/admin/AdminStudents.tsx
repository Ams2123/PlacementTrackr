import { useState,useEffect } from "react"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AdminSidebar } from "@/components/AdminSidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Upload, Search, User, Mail, Phone, GraduationCap, Award, Code } from "lucide-react"
import { createClient } from '@supabase/supabase-js';
import { useNavigate } from "react-router-dom";
import { get } from "http"



const supabaseUrl = import.meta.env.VITE_DB_URL;
const supabaseAnonKey = import.meta.env.VITE_DB_KEY;
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
export type Student = {
      id: number;
      name: string;
      email: string;
      phone: string;
      branch: string;
      cgpa: number;
      skills: string[];
      experience: string[];
      achievements: string[];
      placementStatus: string;
    };




export default function AdminStudents() {
  const [emailFile, setEmailFile] = useState<File | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const { toast } = useToast()
  // Mock student data (would come from Supabase)
  
  const [students] = useState([
    {
      id: 1,
      name: "John Doe",
      email: "john.doe@university.edu",
      phone: "+1234567890",
      branch: "CSE",
      cgpa: 8.5,
      skills: ["Python", "React", "Node.js", "MongoDB"],
      experience: ["TechStart Inc - Intern"],
      achievements: ["Hackathon Winner", "Dean's List"],
      placementStatus: "Active"
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane.smith@university.edu",
      phone: "+1234567891",
      branch: "IT",
      cgpa: 9.2,
      skills: ["Java", "Spring Boot", "Angular", "MySQL"],
      experience: ["InnovateLabs - Intern"],
      achievements: ["Scholarship Recipient", "Research Publication"],
      placementStatus: "Placed"
    },
    {
      id: 3,
      name: "Mike Johnson",
      email: "mike.johnson@university.edu",
      phone: "+1234567892",
      branch: "CSE",
      cgpa: 7.8,
      skills: ["JavaScript", "Vue.js", "Express.js", "PostgreSQL"],
      experience: ["FreelanceProjects"],
      achievements: ["Open Source Contributor"],
      placementStatus: "Active"
    },
    {
      id: 4,
      name: "Sarah Wilson",
      email: "sarah.wilson@university.edu", 
      phone: "+1234567893",
      branch: "IT",
      cgpa: 8.9,
      skills: ["C++", "Data Structures", "Algorithms", "System Design"],
      experience: ["Google Summer of Code"],
      achievements: ["Competitive Programming", "Technical Lead"],
      placementStatus: "Interviewing"
    }
  ])


  const handleBulkUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
        setEmailFile(file)
        toast({
          title: "File uploaded",
          description: "Click 'Process Upload' to add students to the database.",
        })
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload a CSV file with student emails.",
          variant: "destructive"
        })
      }
    }
  }

  const handleProcessUpload = () => {
    if (!emailFile) return

    // TODO: Process CSV file and add students to Supabase
    toast({
      title: "Students added successfully!",
      description: `Processed ${emailFile.name} and added students to the database.`,
    })
    setEmailFile(null)
  }

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.branch.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Active":
        return <Badge>Active</Badge>
      case "Placed":
        return <Badge className="bg-green-500 hover:bg-green-600">Placed</Badge>
      case "Interviewing":
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">Interviewing</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AdminSidebar />
        <main className="flex-1 p-6 bg-background">
          <div className="max-w-7xl mx-auto space-y-6">
            <div>
              <h1 className="text-3xl font-bold">Student Management</h1>
              <p className="text-muted-foreground mt-2">
                Manage student profiles and bulk upload operations.
              </p>
            </div>

            {/* Bulk Upload Section */}
            <Card>
              <CardHeader>
                <CardTitle>Bulk Student Upload</CardTitle>
                <CardDescription>
                  Upload a CSV file with student email addresses to initiate a new placement season.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <Input
                      type="file"
                      accept=".csv"
                      onChange={handleBulkUpload}
                      className="cursor-pointer"
                    />
                  </div>
                  <Button 
                    onClick={handleProcessUpload} 
                    disabled={!emailFile}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Process Upload
                  </Button>
                </div>
                {emailFile && (
                  <p className="text-sm text-muted-foreground">
                    Selected: {emailFile.name}
                  </p>
                )}
                <div className="text-xs text-muted-foreground">
                  <p>CSV format: email,name (optional)</p>
                  <p>Example: john.doe@university.edu,John Doe</p>
                </div>
              </CardContent>
            </Card>

            {/* Search and Filter */}
            <Card>
              <CardHeader>
                <CardTitle>Student Directory</CardTitle>
                <CardDescription>
                  Browse and search student profiles. Each profile card can be shared publicly.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search students by name, email, or branch..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Button variant="outline">
                    Export All
                  </Button>
                </div>

                {/* Student Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                  {filteredStudents.map((student) => (
                    <Card key={student.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                              <User className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                              <CardTitle className="text-lg">{student.name}</CardTitle>
                              <p className="text-sm text-muted-foreground">{student.branch}</p>
                            </div>
                          </div>
                          {getStatusBadge(student.placementStatus)}
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <span>{student.email}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <span>{student.phone}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <GraduationCap className="h-4 w-4 text-muted-foreground" />
                            <span>CGPA: {student.cgpa}</span>
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center gap-2 text-sm font-medium mb-2">
                            <Code className="h-4 w-4" />
                            Skills
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {student.skills.slice(0, 3).map((skill, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                            {student.skills.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{student.skills.length - 3}
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center gap-2 text-sm font-medium mb-2">
                            <Award className="h-4 w-4" />
                            Achievements
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {student.achievements.slice(0, 2).map((achievement, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {achievement}
                              </Badge>
                            ))}
                            {student.achievements.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{student.achievements.length - 2}
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div className="flex gap-2 pt-2">
                          <Button size="sm" variant="outline" className="flex-1">
                            View Profile
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1">
                            Share Link
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {filteredStudents.length === 0 && (
                  <div className="text-center py-12">
                    <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No students found</h3>
                    <p className="text-muted-foreground">
                      Try adjusting your search criteria or upload student data.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}