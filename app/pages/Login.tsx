import { useState } from "react";
import { useNavigate } from "react-router";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Shield } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F3F6FA]">
      <Card className="w-full max-w-md p-8">
        <div className="flex justify-center mb-6">
          <div className="h-12 w-12 bg-[#4263EB] rounded-lg flex items-center justify-center">
            <Shield className="h-6 w-6 text-white" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-center text-[#1B3569] mb-2">Sign In</h1>
        <p className="text-sm text-center text-[#888] mb-6">NurseForce Workforce Management</p>
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="coordinator@cabrini.com.au" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter password" required />
          </div>
          <Button type="submit" className="w-full bg-[#4263EB] hover:bg-[#3B5BD9]">Sign In</Button>
        </form>
      </Card>
    </div>
  );
}
