import { Home, Users, Briefcase, BarChart3, LogOut, Shield } from "lucide-react"
import { Link, useLocation,useNavigate } from "react-router-dom"
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

const menuItems = [
  { title: "Dashboard", url: "/admin", icon: Home },
  { title: "Student Management", url: "/admin/students", icon: Users },
  { title: "Drive Management", url: "/admin/drives", icon: Briefcase },
  { title: "Reports", url: "/admin/reports", icon: BarChart3 },
]

export function AdminSidebar() {
  const location = useLocation()
  const navigate = useNavigate();
  const handleLogout = () => {
      navigate("/");
    }

  return (
    <Sidebar className="border-r">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
            <Shield className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="font-semibold text-sm">Admin Portal</p>
            <p className="text-xs text-muted-foreground">TPO Dashboard</p>
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