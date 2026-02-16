import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";
import { useToast } from "./ToastNotification";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ShieldCheck, Check, UserPlus, Eye, EyeOff } from "lucide-react";

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    banker_name: "",
    email: "",
    password: "",
    branch_code: "",
    phone: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const { register, loading } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(
        formData.banker_name,
        formData.email,
        formData.password,
        formData.branch_code,
        formData.phone,
      );
      addToast("Account created successfully!", "success");
      navigate("/dashboard");
    } catch (err) {
      addToast(err.response?.data?.detail || "Registration failed", "error");
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-background lg:grid lg:grid-cols-2">
      {/* Left Panel: Branding */}
      <div className="hidden bg-zinc-900 lg:flex flex-col justify-between p-12 text-white relative overflow-hidden dark:bg-zinc-950">
        <div className="z-10 relative">
          <div className="flex items-center gap-2 mb-8">
            <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
              <ShieldCheck className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Banker Verify
            </h1>
          </div>
          <p className="text-zinc-400 text-lg max-w-md">
            Join the enterprise-grade identity assurance platform.
          </p>
        </div>

        <div className="z-10 relative space-y-4">
          <div className="flex items-center gap-3 text-zinc-300">
            <div className="bg-white/10 p-1 rounded-full">
              <Check className="h-4 w-4 text-white" />
            </div>
            <span>Secure account setup</span>
          </div>
          <div className="flex items-center gap-3 text-zinc-300">
            <div className="bg-white/10 p-1 rounded-full">
              <Check className="h-4 w-4 text-white" />
            </div>
            <span>Access to facial biometrics</span>
          </div>
        </div>

        {/* Abstract Background Decoration */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-zinc-800/50 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-zinc-800/50 rounded-full blur-3xl opacity-50"></div>
      </div>

      {/* Right Panel: Form */}
      <div className="flex items-center justify-center p-8">
        <Card className="w-full max-w-md border-0 shadow-none sm:border sm:shadow-sm">
          <CardHeader className="space-y-1">
            <div className="flex items-center gap-2 lg:hidden mb-6 text-foreground">
              <ShieldCheck className="h-6 w-6" />
              <span className="font-bold text-xl">Banker Verify</span>
            </div>
            <CardTitle className="text-2xl font-bold text-center sm:text-left">
              Create an account
            </CardTitle>
            <CardDescription className="text-center sm:text-left">
              Register as a banker to start using the platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="banker_name">Full Name</Label>
                <Input
                  id="banker_name"
                  placeholder="John Doe"
                  value={formData.banker_name}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="banker@bank.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="branch_code">Branch Code</Label>
                  <Input
                    id="branch_code"
                    placeholder="BR001"
                    value={formData.branch_code}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    placeholder="+91..."
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
                    Creating Account...
                  </>
                ) : (
                  "Register"
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex-col gap-4 border-t px-6 py-4 mt-2 bg-muted/50">
            <div className="flex items-center justify-center gap-2 text-sm w-full">
              <span className="text-muted-foreground">
                Already have an account?
              </span>
              <Link
                to="/login"
                className="font-medium text-primary hover:underline"
              >
                Sign In
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default RegisterForm;
