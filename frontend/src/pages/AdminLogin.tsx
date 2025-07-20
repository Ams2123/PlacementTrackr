import { useState } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ThemeToggle } from "@/components/ThemeToggle"
import { Shield, ArrowLeft } from "lucide-react"
import { createClient } from '@supabase/supabase-js';
import { useNavigate } from "react-router-dom";



const supabaseUrl = import.meta.env.VITE_DB_URL;
const supabaseAnonKey = import.meta.env.VITE_DB_KEY;
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function AdminLogin() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
        setError(null);
        setLoading(true);
        try {
          const {data,error} = await supabase
                              .from('admin_login')
                              .select('password')
                              .eq('email', email);
          if (data.length === 0) {
            throw new Error('Invalid usermail');}
          else if (data[0].password !== password) {
            throw new Error('Incorrect password');
          }
          else{
            alert('Login successful! Redirecting to dashboard...');
            navigate('/admin', { state: { userEmail: email } });
          }
          if (error) throw error;
        } catch (error) {
          setError(error.message);
        } finally {
          setLoading(false);
        }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b px-6 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 text-primary hover:opacity-80">
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>
        <ThemeToggle />
      </header>

      <div className="flex-1 flex items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-2xl">Admin Login</CardTitle>
            <CardDescription>
              TPO portal access - Enter your administrative credentials
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@university.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Sign In
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}