import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import Index from "./pages/Index";
import StudentLogin from "./pages/StudentLogin";
import AdminLogin from "./pages/AdminLogin";
import StudentDashboard from "./pages/student/StudentDashboard";
import StudentProfile from "./pages/student/StudentProfile";
import StudentNotifications from "./pages/student/StudentNotifications";
import StudentTracker from "./pages/student/StudentTracker";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminStudents from "./pages/admin/AdminStudents";
import NotFound from "./pages/NotFound";
import { StudentProvider } from "./context/StudentContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <StudentProvider>
      <ThemeProvider defaultTheme="light" storageKey="placement-trackr-theme">
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/student-login" element={<StudentLogin />} />
              <Route path="/admin-login" element={<AdminLogin />} />
              <Route path="/student" element={<StudentDashboard />} />
              <Route path="/student/profile" element={<StudentProfile />} />
              <Route path="/student/notifications" element={<StudentNotifications />} />
              <Route path="/student/tracker" element={<StudentTracker />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/students" element={<AdminStudents />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </StudentProvider>
  </QueryClientProvider>
);

export default App;
