import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  SignIn,
  SignUp,
  useUser,
  useAuth,
  SignedIn,
  SignedOut,
} from "@clerk/clerk-react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { apiService } from "@/services/api";

const Auth: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const { isSignedIn } = useAuth();
  const [shopInfo, setShopInfo] = useState(null);
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Fetch shop info to get redirect URLs
  useEffect(() => {
    const fetchShopInfo = async () => {
      try {
        const info = await apiService.getShopsInfo();
        console.log("Shop info fetched:", info);
        setShopInfo(info);
      } catch (error) {
        console.error("Failed to load shop info:", error);
      }
    };

    fetchShopInfo();
  }, []);

  // Handle redirect after successful authentication
  useEffect(() => {
    if (isSignedIn && user && shopInfo && !isRedirecting) {
      console.log("User authenticated, attempting redirect...");
      console.log("Shop info:", shopInfo);

      setIsRedirecting(true);

      // Get the redirect URL from shop info
      const redirectUrl = shopInfo.redirect_after_signin || "/";

      console.log("Redirect URL:", redirectUrl);

      // Immediate redirect to avoid popup blockers
      if (
        redirectUrl.startsWith("http://") ||
        redirectUrl.startsWith("https://")
      ) {
        console.log("External redirect to new tab:", redirectUrl);
        // For external URLs, open in new tab
        window.location.href = redirectUrl;
        // Redirect the original tab back to home/landing page
        navigate("/");
      } else {
        console.log("Internal redirect to:", redirectUrl);
        // For internal URLs, use React Router
        navigate(redirectUrl);
      }
    }
  }, [isSignedIn, user, shopInfo, navigate, isRedirecting]);

  // Reset redirecting flag when user signs out
  useEffect(() => {
    if (!isSignedIn) {
      setIsRedirecting(false);
    }
  }, [isSignedIn]);

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

        <SignedOut>
          {/* Auth Card */}
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
                Welcome to {shopInfo?._shops?.name || "EventHub"}
              </CardTitle>
              <CardDescription style={{ color: "#666", fontSize: "14px" }}>
                {shopInfo?.description ||
                  "Join thousands of event enthusiasts worldwide"}
              </CardDescription>
            </CardHeader>

            <CardContent>
              <Tabs defaultValue="login" className="w-full">
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
                      color: "#666",
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
                      color: "#666",
                      fontWeight: "500",
                    }}
                  >
                    Sign Up
                  </TabsTrigger>
                </TabsList>

                {/* Login Form */}
                <TabsContent value="login" className="space-y-4 mt-6">
                  <div className="flex justify-center">
                    <SignIn
                      routing="hash"
                      signUpUrl="#/auth?tab=signup"
                      forceRedirectUrl={window.location.origin + "/auth"}
                      appearance={{
                        elements: {
                          formButtonPrimary: {
                            backgroundColor: "#3b82f6",
                            "&:hover": {
                              backgroundColor: "#2563eb",
                            },
                          },
                          card: {
                            backgroundColor: "transparent",
                            boxShadow: "none",
                            border: "none",
                          },
                          headerTitle: {
                            display: "none",
                          },
                          headerSubtitle: {
                            display: "none",
                          },
                        },
                        layout: {
                          socialButtonsPlacement: "bottom",
                          socialButtonsVariant: "iconButton",
                        },
                      }}
                    />
                  </div>
                </TabsContent>

                {/* Signup Form */}
                <TabsContent value="signup" className="space-y-4 mt-6">
                  <div className="flex justify-center">
                    <SignUp
                      routing="hash"
                      signInUrl="#/auth?tab=login"
                      forceRedirectUrl={window.location.origin + "/auth"}
                      appearance={{
                        elements: {
                          formButtonPrimary: {
                            backgroundColor: "#3b82f6",
                            "&:hover": {
                              backgroundColor: "#2563eb",
                            },
                          },
                          card: {
                            backgroundColor: "transparent",
                            boxShadow: "none",
                            border: "none",
                          },
                          headerTitle: {
                            display: "none",
                          },
                          headerSubtitle: {
                            display: "none",
                          },
                        },
                        layout: {
                          socialButtonsPlacement: "bottom",
                          socialButtonsVariant: "iconButton",
                        },
                      }}
                    />
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </SignedOut>

        <SignedIn>
          {/* Show loading state while redirecting */}
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-lg mb-2">Authentication successful!</div>
              <div className="text-sm text-muted-foreground">
                {isRedirecting ? "Redirecting..." : "Please wait..."}
              </div>
              {shopInfo?.redirect_after_signin && (
                <div className="text-xs text-muted-foreground mt-2">
                  Taking you to: {shopInfo.redirect_after_signin}
                </div>
              )}
            </CardContent>
          </Card>
        </SignedIn>
      </div>
    </div>
  );
};

export default Auth;
