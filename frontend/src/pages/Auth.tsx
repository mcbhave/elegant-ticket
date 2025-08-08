import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, User, Chrome, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { AuthCredentials, SignupData } from "@/types";

const Auth: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login, signup, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState(
    searchParams.get("tab") || "login"
  );
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Form states
  const [loginForm, setLoginForm] = useState<AuthCredentials>({
    email: "",
    password: "",
  });

  const [signupForm, setSignupForm] = useState<SignupData>({
    name: "",
    email: "",
    password: "",
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 8;
  };

  const validateLoginForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!loginForm.email) {
      errors.email = "Email is required";
    } else if (!validateEmail(loginForm.email)) {
      errors.email = "Please enter a valid email address";
    }

    if (!loginForm.password) {
      errors.password = "Password is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateSignupForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!signupForm.name) {
      errors.name = "Name is required";
    } else if (signupForm.name.length < 2) {
      errors.name = "Name must be at least 2 characters";
    }

    if (!signupForm.email) {
      errors.email = "Email is required";
    } else if (!validateEmail(signupForm.email)) {
      errors.email = "Please enter a valid email address";
    }

    if (!signupForm.password) {
      errors.password = "Password is required";
    } else if (!validatePassword(signupForm.password)) {
      errors.password = "Password must be at least 8 characters";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateLoginForm()) return;

    const success = await login(loginForm);
    if (success) {
      navigate("/");
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateSignupForm()) return;

    const success = await signup(signupForm);
    if (success) {
      navigate("/");
    }
  };

  const handleSocialLogin = (provider: string) => {
    toast({
      title: "Coming Soon",
      description: `${provider} login will be available soon!`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="text-white hover:bg-white/10 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        {/* Auth Card - Fixed styling */}
        <Card
          style={{
            backgroundColor: "white",
            borderRadius: "12px",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
          }}
        >
          <CardHeader className="text-center">
            <CardTitle
              style={{ color: "black", fontSize: "24px", fontWeight: "bold" }}
            >
              Welcome to EventHub
            </CardTitle>
            <CardDescription style={{ color: "#666", fontSize: "14px" }}>
              Join thousands of event enthusiasts worldwide
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  backgroundColor: "#f3f4f6",
                  borderRadius: "6px",
                  padding: "4px",
                }}
              >
                <TabsTrigger
                  value="login"
                  style={{
                    padding: "8px 16px",
                    borderRadius: "4px",
                    color: activeTab === "login" ? "black" : "#666",
                    backgroundColor:
                      activeTab === "login" ? "white" : "transparent",
                    fontWeight: "500",
                  }}
                >
                  Sign In
                </TabsTrigger>
                <TabsTrigger
                  value="signup"
                  style={{
                    padding: "8px 16px",
                    borderRadius: "4px",
                    color: activeTab === "signup" ? "black" : "#666",
                    backgroundColor:
                      activeTab === "signup" ? "white" : "transparent",
                    fontWeight: "500",
                  }}
                >
                  Sign Up
                </TabsTrigger>
              </TabsList>

              {/* Login Form */}
              <TabsContent value="login" className="space-y-4 mt-6">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="login-email"
                      style={{ color: "black", fontWeight: "500" }}
                    >
                      Email
                    </Label>
                    <div className="relative">
                      <Mail
                        style={{
                          position: "absolute",
                          left: "12px",
                          top: "12px",
                          width: "16px",
                          height: "16px",
                          color: "#666",
                        }}
                      />
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="Enter your email"
                        value={loginForm.email}
                        onChange={(e) =>
                          setLoginForm({ ...loginForm, email: e.target.value })
                        }
                        style={{
                          paddingLeft: "40px",
                          backgroundColor: "white",
                          border: "1px solid #d1d5db",
                          borderRadius: "6px",
                          color: "black",
                          fontSize: "14px",
                          padding: "12px 12px 12px 40px",
                        }}
                        disabled={isLoading}
                      />
                    </div>
                    {formErrors.email && (
                      <p style={{ color: "#ef4444", fontSize: "12px" }}>
                        {formErrors.email}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="login-password"
                      style={{ color: "black", fontWeight: "500" }}
                    >
                      Password
                    </Label>
                    <div className="relative">
                      <Lock
                        style={{
                          position: "absolute",
                          left: "12px",
                          top: "12px",
                          width: "16px",
                          height: "16px",
                          color: "#666",
                        }}
                      />
                      <Input
                        id="login-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={loginForm.password}
                        onChange={(e) =>
                          setLoginForm({
                            ...loginForm,
                            password: e.target.value,
                          })
                        }
                        style={{
                          paddingLeft: "40px",
                          paddingRight: "40px",
                          backgroundColor: "white",
                          border: "1px solid #d1d5db",
                          borderRadius: "6px",
                          color: "black",
                          fontSize: "14px",
                          padding: "12px 40px 12px 40px",
                        }}
                        disabled={isLoading}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{
                          position: "absolute",
                          right: "0",
                          top: "0",
                          height: "100%",
                          padding: "0 12px",
                          color: "#666",
                          backgroundColor: "transparent",
                        }}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    {formErrors.password && (
                      <p style={{ color: "#ef4444", fontSize: "12px" }}>
                        {formErrors.password}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="remember"
                      checked={rememberMe}
                      onCheckedChange={(checked) =>
                        setRememberMe(checked === true)
                      }
                      style={{ border: "1px solid #d1d5db" }}
                    />
                    <Label
                      htmlFor="remember"
                      style={{ fontSize: "14px", color: "black" }}
                    >
                      Remember me
                    </Label>
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    style={{
                      width: "100%",
                      backgroundColor: "#3b82f6",
                      color: "white",
                      padding: "12px",
                      borderRadius: "6px",
                      fontWeight: "500",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    {isLoading ? "Signing In..." : "Sign In"}
                  </Button>
                </form>
              </TabsContent>

              {/* Signup Form */}
              <TabsContent value="signup" className="space-y-4 mt-6">
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="signup-name"
                      style={{ color: "black", fontWeight: "500" }}
                    >
                      Full Name
                    </Label>
                    <div className="relative">
                      <User
                        style={{
                          position: "absolute",
                          left: "12px",
                          top: "12px",
                          width: "16px",
                          height: "16px",
                          color: "#666",
                        }}
                      />
                      <Input
                        id="signup-name"
                        type="text"
                        placeholder="Enter your full name"
                        value={signupForm.name}
                        onChange={(e) =>
                          setSignupForm({ ...signupForm, name: e.target.value })
                        }
                        style={{
                          paddingLeft: "40px",
                          backgroundColor: "white",
                          border: "1px solid #d1d5db",
                          borderRadius: "6px",
                          color: "black",
                          fontSize: "14px",
                          padding: "12px 12px 12px 40px",
                        }}
                        disabled={isLoading}
                      />
                    </div>
                    {formErrors.name && (
                      <p style={{ color: "#ef4444", fontSize: "12px" }}>
                        {formErrors.name}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="signup-email"
                      style={{ color: "black", fontWeight: "500" }}
                    >
                      Email
                    </Label>
                    <div className="relative">
                      <Mail
                        style={{
                          position: "absolute",
                          left: "12px",
                          top: "12px",
                          width: "16px",
                          height: "16px",
                          color: "#666",
                        }}
                      />
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="Enter your email"
                        value={signupForm.email}
                        onChange={(e) =>
                          setSignupForm({
                            ...signupForm,
                            email: e.target.value,
                          })
                        }
                        style={{
                          paddingLeft: "40px",
                          backgroundColor: "white",
                          border: "1px solid #d1d5db",
                          borderRadius: "6px",
                          color: "black",
                          fontSize: "14px",
                          padding: "12px 12px 12px 40px",
                        }}
                        disabled={isLoading}
                      />
                    </div>
                    {formErrors.email && (
                      <p style={{ color: "#ef4444", fontSize: "12px" }}>
                        {formErrors.email}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="signup-password"
                      style={{ color: "black", fontWeight: "500" }}
                    >
                      Password
                    </Label>
                    <div className="relative">
                      <Lock
                        style={{
                          position: "absolute",
                          left: "12px",
                          top: "12px",
                          width: "16px",
                          height: "16px",
                          color: "#666",
                        }}
                      />
                      <Input
                        id="signup-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a strong password"
                        value={signupForm.password}
                        onChange={(e) =>
                          setSignupForm({
                            ...signupForm,
                            password: e.target.value,
                          })
                        }
                        style={{
                          paddingLeft: "40px",
                          paddingRight: "40px",
                          backgroundColor: "white",
                          border: "1px solid #d1d5db",
                          borderRadius: "6px",
                          color: "black",
                          fontSize: "14px",
                          padding: "12px 40px 12px 40px",
                        }}
                        disabled={isLoading}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{
                          position: "absolute",
                          right: "0",
                          top: "0",
                          height: "100%",
                          padding: "0 12px",
                          color: "#666",
                          backgroundColor: "transparent",
                        }}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    {formErrors.password && (
                      <p style={{ color: "#ef4444", fontSize: "12px" }}>
                        {formErrors.password}
                      </p>
                    )}
                    <p style={{ fontSize: "12px", color: "#666" }}>
                      Password must be at least 8 characters long
                    </p>
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    style={{
                      width: "100%",
                      backgroundColor: "#3b82f6",
                      color: "white",
                      padding: "12px",
                      borderRadius: "6px",
                      fontWeight: "500",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    {isLoading ? "Creating Account..." : "Create Account"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            {/* Social Login */}
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span
                    style={{ width: "100%", borderTop: "1px solid #e5e7eb" }}
                  />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span
                    style={{
                      backgroundColor: "white",
                      padding: "0 8px",
                      color: "#666",
                      fontSize: "12px",
                    }}
                  >
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-6">
                <Button
                  variant="outline"
                  onClick={() => handleSocialLogin("Google")}
                  disabled={isLoading}
                  style={{
                    backgroundColor: "white",
                    border: "1px solid #d1d5db",
                    color: "black",
                    padding: "10px",
                    borderRadius: "6px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                  }}
                >
                  <Chrome className="h-4 w-4" />
                  Google
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleSocialLogin("Apple")}
                  disabled={isLoading}
                  style={{
                    backgroundColor: "white",
                    border: "1px solid #d1d5db",
                    color: "black",
                    padding: "10px",
                    borderRadius: "6px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                  }}
                >
                  <svg
                    className="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                  </svg>
                  Apple
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
