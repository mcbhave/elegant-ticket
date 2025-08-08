import { useState, useEffect, createContext, useContext } from 'react';
import { User, AuthCredentials, SignupData } from '@/types';
import { apiService } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: AuthCredentials) => Promise<boolean>;
  signup: (userData: SignupData) => Promise<boolean>;
  logout: () => void;
  refreshUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const useAuthProvider = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check for existing auth on mount
    const checkAuth = () => {
      try {
        const currentUser = apiService.getCurrentUser();
        if (currentUser && apiService.isAuthenticated()) {
          setUser(currentUser);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (credentials: AuthCredentials): Promise<boolean> => {
    setIsLoading(true);
    try {
      const user = await apiService.login(credentials);
      setUser(user);
      toast({
        title: "Welcome back!",
        description: `Hello ${user.name}, you're successfully logged in.`,
      });
      return true;
    } catch (error) {
      const message = apiService.handleApiError(error);
      toast({
        title: "Login Failed",
        description: message,
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (userData: SignupData): Promise<boolean> => {
    setIsLoading(true);
    try {
      const user = await apiService.signup(userData);
      setUser(user);
      toast({
        title: "Account Created!",
        description: `Welcome ${user.name}! Your account has been created successfully.`,
      });
      return true;
    } catch (error) {
      const message = apiService.handleApiError(error);
      toast({
        title: "Signup Failed",
        description: message,
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    apiService.logout();
    setUser(null);
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };

  const refreshUser = () => {
    const currentUser = apiService.getCurrentUser();
    setUser(currentUser);
  };

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    signup,
    logout,
    refreshUser,
  };
};

export { AuthContext };