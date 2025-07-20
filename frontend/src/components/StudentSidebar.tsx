import { Home, User, Bell, TrendingUp, LogOut } from "lucide-react"
import { Link, useLocation } from "react-router-dom"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/ThemeToggle"
import { useNavigate} from "react-router-dom"
import { useStudent } from "@/context/StudentContext"; // ✅ call hooks at top level

const menuItems = [
  { title: "Dashboard", url: "/student/", icon: Home },
  { title: "My Profile", url: "/student/profile/", icon: User },
  { title: "Notifications", url: "/student/notifications/", icon: Bell },
  { title: "Application Tracker", url: "/student/tracker/", icon: TrendingUp },
]

export function StudentSidebar() {
  const location = useLocation()
   const { setStudentId } = useStudent();  // ✅ call hooks at top level
  const navigate = useNavigate();
  const handleLogout = () => {
    setStudentId(null); // Clear student ID from context
    navigate("/");
  }

  return (
    <Sidebar className="border-r">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="font-semibold text-sm">Student Portal</p>
            <p className="text-xs text-muted-foreground">Placement Trackr</p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={location.pathname === item.url}>
                    <Link to={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 space-y-2">
        <ThemeToggle />
        <Button variant="outline" size="sm" onClick={handleLogout} className="w-full">
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </SidebarFooter>
    </Sidebar>
  )
}