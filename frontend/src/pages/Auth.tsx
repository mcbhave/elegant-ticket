import React from "react";
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
  const [shopInfo, setShopInfo] = React.useState(null);

  // Fetch shop info to get redirect URLs
  React.useEffect(() => {
    const fetchShopInfo = async () => {
      try {
        const info = await apiService.getShopsInfo();
        setShopInfo(info);
      } catch (error) {
        console.error("Failed to load shop info:", error);
      }
    };

    fetchShopInfo();
  }, []);

  // Helper function to determine redirect URL
  const getRedirectUrl = (type: "signin" | "signup") => {
    if (!shopInfo) return "/";

    const redirectUrl =
      type === "signin"
        ? shopInfo.redirect_after_signin
        : shopInfo.redirect_after_signup;

    // Check if it's an external URL
    if (
      redirectUrl &&
      (redirectUrl.startsWith("http://") || redirectUrl.startsWith("https://"))
    ) {
      // For external URLs, you might want to open in same window or redirect
      return redirectUrl;
    }

    // For internal URLs or empty/null values, use default dashboard or home
    if (redirectUrl && !redirectUrl.startsWith("http")) {
      return redirectUrl;
    }

    // Fallback to dashboard URL or home
    return shopInfo.user_dashboard_url &&
      !shopInfo.user_dashboard_url.startsWith("http")
      ? shopInfo.user_dashboard_url
      : "/";
  };

  // Handle redirect after successful authentication
  React.useEffect(() => {
    if (isSignedIn && user && shopInfo) {
      const redirectUrl = getRedirectUrl("signin");

      // If it's an external URL, redirect to it
      if (
        redirectUrl.startsWith("http://") ||
        redirectUrl.startsWith("https://")
      ) {
        window.location.href = redirectUrl;
      } else {
        // Internal navigation
        navigate(redirectUrl);
      }
    }
  }, [isSignedIn, user, shopInfo, navigate]);

  // Get the URLs for Clerk configuration
  const getClerkRedirectUrls = () => {
    if (!shopInfo) return { signInUrl: "/", signUpUrl: "/" };

    const signInRedirect = getRedirectUrl("signin");
    const signUpRedirect = getRedirectUrl("signup");

    return {
      signInUrl: signInRedirect.startsWith("http")
        ? signInRedirect
        : `${window.location.origin}${signInRedirect}`,
      signUpUrl: signUpRedirect.startsWith("http")
        ? signUpRedirect
        : `${window.location.origin}${signUpRedirect}`,
    };
  };

  const redirectUrls = getClerkRedirectUrls();

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
                      redirectUrl={redirectUrls.signInUrl}
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
                      redirectUrl={redirectUrls.signUpUrl}
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
      </div>
    </div>
  );
};

export default Auth;
