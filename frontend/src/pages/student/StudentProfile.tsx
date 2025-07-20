import { useState } from "react"
import { SidebarProvider } from "@/components/ui/sidebar"
import { StudentSidebar } from "@/components/StudentSidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { Upload, FileText, Trophy, Download } from "lucide-react"

import { createClient } from '@supabase/supabase-js';
import { useNavigate } from "react-router-dom";
import { Schema } from "inspector/promises"
import { useStudent } from "@/context/StudentContext";
import { add } from "date-fns"


const supabaseUrl = import.meta.env.VITE_DB_URL;
const supabaseAnonKey = import.meta.env.VITE_DB_KEY;
export const supabase = createClient(supabaseUrl, supabaseAnonKey);



// --- Helper function to convert a file to a base64 string ---
function getBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            // The result includes the data URL prefix (e.g., "data:image/png;base64,"), 
            // so we split it off to get only the base64 data.
            const base64 = (reader.result as string).split(',')[1];
            resolve(base64);
        };
        reader.onerror = error => reject(error);
    });
}


export default function StudentProfile() {
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [certificateFile, setCertificateFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const { toast } = useToast()

  // Student data state, will be populated by the OCR
  const [studentData, setStudentData] = useState({
    name: "",
    academicHistory: [] as any[],
    skills: [] as string[],
    experience: [] as any[],
    projects: [] as any[],
    achievements: [] as any[],
    certificates: [] as any[]
  })

  const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png']
      if (allowedTypes.includes(file.type)) {
        setResumeFile(file)
        toast({
          title: "Resume selected",
          description: `Ready to process ${file.name}.`,
        })
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF or Image file.",
          variant: "destructive"
        })
      }
    }
  }
  
  const sid = useStudent().studentId;
  
  /**
   * UPDATED: This function now includes a more robust prompt and few-shot examples
   * to guide the AI for better, more consistent JSON output.
   */

  type scheme = {
    name: string;
    academicHistory: { degree: string; institution: string; cgpa: number | null; year: string }[];
    skills: string[];
    experience: { role: string; company: string; duration: string; description: string }[];
    projects: { title: string; tech: string; description: string }[];
    achievements: { title: string; description: string }[];
    certificates: { id: number; name: string; uploadDate: string; url: string }[];
  }

  async function addStudent(data: scheme){
    try {
      const { error } = await supabase
        .from('student')
        .insert([
          { 
            id : sid, 
            name: data.name, 
            academics: data.academicHistory,
            skills: data.skills,
            experience: data.experience,
            projects: data.projects,
            achievements: data.achievements}
        ])
      if (error) throw error;
      alert('Student added successfully!');
    } catch (error) {
      console.error("Error adding student:", error);
      alert('Failed to add student. Please try again.');
    }
  }
  const handleResumeProcess = async () => {
    if (!resumeFile) return;

    setIsProcessing(true);
    toast({
        title: "Processing resume...",
        description: "This may take a moment. Please wait.",
    });

    try {
        // 1. Convert the uploaded file to a base64 string
        const base64ImageData = await getBase64(resumeFile);

        // 2. Define the JSON structure we want the AI to return.
        //    Adding detailed descriptions helps the model understand the fields better.
        const schema = {
            type: "OBJECT",
            properties: {
                name: { type: "STRING", description: "The full name of the person." },
                academicHistory: {
                    type: "ARRAY",
                    description: "List of all academic qualifications.",
                    items: {
                        type: "OBJECT",
                        properties: {
                            degree: { type: "STRING", description: "e.g., Bachelor of Technology in Computer Science" },
                            institution: { type: "STRING", description: "e.g., University of Example" },
                            cgpa: { type: "STRING", description: "e.g., 8.5/10 or 3.8/4.0" },
                            year: { type: "STRING", description: "e.g., 2020-2024" }
                        },
                        required: ["degree", "institution"]
                    }
                },
                skills: { type: "ARRAY", description: "List of all technical and soft skills.", items: { type: "STRING" } },
                experience: {
                    type: "ARRAY",
                    description: "List of all work or internship experiences.",
                    items: {
                        type: "OBJECT",
                        properties: {
                            company: { type: "STRING" },
                            role: { type: "STRING" },
                            duration: { type: "STRING", description: "e.g., June 2023 - August 2023" },
                            description: { type: "STRING", description: "A brief summary of responsibilities and accomplishments." }
                        },
                        required: ["company", "role", "duration"]
                    }
                },
                projects: {
                    type: "ARRAY",
                    description: "List of personal or academic projects.",
                    items: {
                        type: "OBJECT",
                        properties: {
                            title: { type: "STRING" },
                            tech: { type: "STRING", description: "Comma-separated list of technologies used." },
                            description: { type: "STRING" }
                        },
                         required: ["title", "description"]
                    }
                },
                achievements: {
                    type: "ARRAY",
                    description: "List of awards, hackathon wins, or other achievements.",
                    items: {
                        type: "OBJECT",
                        properties: {
                            title: { type: "STRING" },
                            description: { type: "STRING" }
                        },
                        required: ["title"]
                    }
                }
            },
            required: ["name", "academicHistory", "skills", "experience", "projects", "achievements"]
        };

        // 3. Prepare the payload for the Gemini API
        const payload = {
            // UPDATED: Added few-shot examples to guide the model.
            contents: [
                {
                    role: "user",
                    parts: [
                        { text: "Analyze the provided resume. Extract the user's profile information and structure it according to the provided JSON schema. It is critical that you return all fields defined in the schema. If a section like 'achievements' or 'projects' is not present in the resume, you MUST return an empty array [] for that field. Do not omit any fields." },
                        { text: "Example Input Resume Text: Jane Doe - Software Engineer. Education: B.S. in CS at Tech University (2022). Skills: JavaScript, React." },
                    ]
                },
                {
                    role: "model",
                    parts: [
                        { text: JSON.stringify({
                            name: "Jane Doe",
                            academicHistory: [{ degree: "B.S. in CS", institution: "Tech University", cgpa: null, year: "2022" }],
                            skills: ["JavaScript", "React"],
                            experience: [],
                            projects: [],
                            achievements: [],
                        }, null, 2)}
                    ]
                },
                {
                    role: "user",
                    parts: [
                        {
                            inlineData: {
                                mimeType: resumeFile.type,
                                data: base64ImageData
                            }
                        }
                    ]
                }
            ],
            generationConfig: {
                responseMimeType: "application/json",
                responseSchema: schema
            }
        };

        const apiKey = "AIzaSyC3O_dKIPGEo8Szx2F-aahoLAS2CryV9To"; // API key is handled by the environment
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

        // 4. Make the API call
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`API request failed: ${errorText}`);
        }

        const result = await response.json();
        
        // 5. Parse the JSON response and update the state
        if (result.candidates && result.candidates.length > 0) {
            const jsonText = result.candidates[0].content.parts[0].text;
            const parsedData = JSON.parse(jsonText);
            addStudent(parsedData);
            // Merge OCR data with existing certificate data
            


            setStudentData(prevData => ({
                ...parsedData,
                certificates: prevData.certificates 
            }));

            toast({
                title: "Resume processed successfully!",
                description: "Your profile has been updated with the extracted information.",
            });
        } else {
            throw new Error("Could not parse the extracted data from the API response.");
        }

    } catch (error: any) {
        console.error("Processing failed:", error);
        toast({
            title: "Processing failed",
            description: error.message || "An unknown error occurred. Please try again.",
            variant: "destructive",
        });
    } finally {
        setIsProcessing(false);
    }
  };


  const handleCertificateUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // In a real app, you would upload this to cloud storage (e.g., Supabase Storage)
      // and get a permanent URL back.
      const newCertificate = {
        id: Date.now(),
        name: file.name,
        uploadDate: new Date().toLocaleDateString(),
        url: URL.createObjectURL(file) // Using a temporary local URL for preview
      }
      
      setStudentData(prev => ({
        ...prev,
        certificates: [...prev.certificates, newCertificate]
      }))
      
      toast({
        title: "Certificate added",
        description: `${file.name} has been added to your profile.`,
      })
    }
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <StudentSidebar />
        <main className="flex-1 p-6 bg-background">
          <div className="max-w-6xl mx-auto space-y-6">
            <div>
              <h1 className="text-3xl font-bold">My Profile</h1>
              <p className="text-muted-foreground mt-2">
                Manage your profile information and upload documents.
              </p>
            </div>

            {/* Resume Upload Section */}
            <Card>
              <CardHeader>
                <CardTitle>Resume Upload & OCR Processing</CardTitle>
                <CardDescription>
                  Upload your resume (PDF or Image) to automatically extract and populate your profile information.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <Label htmlFor="resume">Choose Resume File</Label>
                    <Input
                      id="resume"
                      type="file"
                      accept=".pdf,.jpeg,.jpg,.png"
                      onChange={handleResumeUpload}
                      className="mt-1"
                    />
                  </div>
                  <Button 
                    onClick={handleResumeProcess} 
                    disabled={!resumeFile || isProcessing}
                    className="mt-6"
                  >
                    {isProcessing ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                        Processing...
                      </div>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        Process Resume
                      </>
                    )}
                  </Button>
                </div>
                {resumeFile && (
                  <p className="text-sm text-muted-foreground">
                    Selected: {resumeFile.name}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Profile Information (Dynamically rendered after OCR) */}
            {studentData.name && (
              <>
                <Card>
                  <CardHeader><CardTitle>Personal Information</CardTitle></CardHeader>
                  <CardContent><p className="text-lg font-semibold">{studentData.name}</p></CardContent>
                </Card>

                <Card>
                  <CardHeader><CardTitle>Academic History</CardTitle></CardHeader>
                  <CardContent>
                    {studentData.academicHistory.map((edu, index) => (
                      <div key={index} className="p-3 border rounded-lg">
                        <p className="font-medium">{edu.degree}</p>
                        <p className="text-sm text-muted-foreground">{edu.institution}</p>
                        <p className="text-sm">CGPA: {edu.cgpa} | {edu.year}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader><CardTitle>Skills</CardTitle></CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {studentData.skills.map((skill, index) => (
                        <Badge key={index} variant="secondary">{skill}</Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader><CardTitle>Experience</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    {studentData.experience.map((exp, index) => (
                      <div key={index} className="p-3 border rounded-lg">
                        <p className="font-medium">{exp.role} at {exp.company}</p>
                        <p className="text-sm text-muted-foreground">{exp.duration}</p>
                        <p className="text-sm mt-1">{exp.description}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader><CardTitle>Projects</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    {studentData.projects.map((project, index) => (
                      <div key={index} className="p-3 border rounded-lg">
                        <p className="font-medium">{project.title}</p>
                        <p className="text-sm text-muted-foreground">Tech Stack: {project.tech}</p>
                        <p className="text-sm mt-1">{project.description}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Trophy className="h-5 w-5 text-yellow-500" />
                      Achievements
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {studentData.achievements.map((achievement, index) => (
                      <div key={index} className="p-3 border rounded-lg flex items-start gap-3">
                        <Trophy className="h-5 w-5 text-yellow-500 mt-0.5" />
                        <div>
                          <p className="font-medium">{achievement.title}</p>
                          <p className="text-sm text-muted-foreground">{achievement.description}</p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </>
            )}

            {/* Certificates Section */}
            <Card>
              <CardHeader>
                <CardTitle>Certificates</CardTitle>
                <CardDescription>Upload your certificates and achievements</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="certificate">Upload Certificate</Label>
                  <Input
                    id="certificate"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleCertificateUpload}
                    className="mt-1"
                  />
                </div>
                
                {studentData.certificates.length > 0 && (
                  <div className="space-y-2">
                    <Separator />
                    <h4 className="font-medium">Uploaded Certificates</h4>
                    {studentData.certificates.map((cert) => (
                      <div key={cert.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          <div>
                            <p className="font-medium">{cert.name}</p>
                            <p className="text-sm text-muted-foreground">Uploaded: {cert.uploadDate}</p>
                          </div>
                        </div>
                        <a href={cert.url} target="_blank" rel="noopener noreferrer">
                            <Button size="sm" variant="outline">
                                <Download className="h-4 w-4 mr-2" />
                                View
                            </Button>
                        </a>
                      </div>
                    ))}
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