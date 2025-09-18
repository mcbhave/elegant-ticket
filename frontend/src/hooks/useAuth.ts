import { useState, useEffect, createContext, useContext } from "react";
import { useAuth as useClerkAuth, useUser } from "@clerk/clerk-react";
import { User, AuthCredentials, SignupData } from "@/services/api";
import { apiService } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: AuthCredentials) => Promise<boolean>;
  signup: (userData: SignupData) => Promise<boolean>;
  logout: () => void;
  refreshUser: () => void;
  // Additional Clerk-specific properties
  clerkUser: any;
  isSignedIn: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const useAuthProvider = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Clerk hooks
  const { isSignedIn, isLoaded, signOut } = useClerkAuth();
  const { user: clerkUser, isLoaded: userLoaded } = useUser();

  // Convert Clerk user to your User interface format
  const convertClerkUser = (clerkUser: any): User | null => {
    if (!clerkUser) return null;

    return {
      id: clerkUser.id,
      email: clerkUser.emailAddresses[0]?.emailAddress || "",
      name: clerkUser.fullName || clerkUser.firstName || "",
      avatar: clerkUser.imageUrl,
      created_at: clerkUser.createdAt?.toISOString() || "",
      auth_token: undefined, // Clerk handles tokens internally
    };
  };

  useEffect(() => {
    // Check auth state when Clerk is loaded
    if (isLoaded && userLoaded) {
      if (isSignedIn && clerkUser) {
        // User is signed in with Clerk
        const convertedUser = convertClerkUser(clerkUser);
        setUser(convertedUser);
      } else {
        // Check for legacy auth (fallback)
        try {
          const currentUser = apiService.getCurrentUser();
          if (currentUser && apiService.isAuthenticated()) {
            setUser(currentUser);
          } else {
            setUser(null);
          }
        } catch (error) {
          console.error("Auth check failed:", error);
          setUser(null);
        }
      }
      setIsLoading(false);
    }
  }, [isLoaded, userLoaded, isSignedIn, clerkUser]);

  const login = async (credentials: AuthCredentials): Promise<boolean> => {
    // Since Clerk handles authentication through components,
    // this method is kept for backward compatibility but will show a message
    toast({
      title: "Please use the login form",
      description:
        "Authentication is now handled by Clerk. Please use the sign-in form.",
      variant: "default",
    });
    return false;
  };

  const signup = async (userData: SignupData): Promise<boolean> => {
    // Since Clerk handles authentication through components,
    // this method is kept for backward compatibility but will show a message
    toast({
      title: "Please use the signup form",
      description:
        "Account creation is now handled by Clerk. Please use the sign-up form.",
      variant: "default",
    });
    return false;
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      if (isSignedIn) {
        // Sign out from Clerk
        await signOut();
      } else {
        // Legacy logout
        apiService.logout();
      }

      setUser(null);
      toast({
        title: "Signed out successfully",
        description: "You have been signed out of your account.",
      });
    } catch (error) {
      toast({
        title: "Error signing out",
        description: "There was a problem signing out. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const refreshUser = () => {
    if (isSignedIn && clerkUser) {
      // Refresh from Clerk
      const convertedUser = convertClerkUser(clerkUser);
      setUser(convertedUser);
    } else {
      // Legacy refresh
      const currentUser = apiService.getCurrentUser();
      setUser(currentUser);
    }
  };

  return {
    user,
    isAuthenticated: isSignedIn || !!user,
    isLoading: !isLoaded || !userLoaded || isLoading,
    login,
    signup,
    logout,
    refreshUser,
    // Additional Clerk-specific properties
    clerkUser,
    isSignedIn: isSignedIn || false,
  };
};

export { AuthContext };
