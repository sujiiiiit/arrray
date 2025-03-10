"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { User } from "@/types/database.types";
import { getUser } from "@/lib/auth";
import { signOutAction } from "@/actions/users";

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
  getUserEmail: () => string | undefined;
  getUserName: () => string | undefined;
  getFullName: () => string | undefined;
  getUserAvatar: () => string | undefined;
  isEmailVerified: () => boolean;
};

// Create a default context value to avoid undefined checks
const defaultContextValue: AuthContextType = {
  user: null,
  isLoading: true,
  error: null,
  signOut: async () => {},
  refreshUser: async () => {},
  getUserEmail: () => undefined,
  getUserName: () => undefined,
  getFullName: () => undefined,
  getUserAvatar: () => undefined,
  isEmailVerified: () => false,
};

// Create the context with default values
const AuthContext = createContext<AuthContextType>(defaultContextValue);

export function AuthProvider({ children }: { children: ReactNode }) {
  // Add isClient state to prevent hydration mismatches
  const [isClient, setIsClient] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [authVerified, setAuthVerified] = useState(false);

  // Helper functions to safely access user properties
  const getUserEmail = (): string | undefined => {
    if (!user) return undefined;
    return user?.email || user?.user_metadata?.email;
  };

  const getUserName = (): string | undefined => {
    if (!user) return undefined;
    // Use optional chaining for safer property access
    return (user.user_metadata?.user_name as string | undefined) || "User";
  };

  const getUserAvatar = (): string | undefined => {
    if (!user) return undefined;
    return user.user_metadata?.avatar_url;
  };

  const getFullName = (): string | undefined => {
    if (!user) return undefined;
    return (user.user_metadata?.full_name as string | undefined) || getUserName();
  }

  const isEmailVerified = (): boolean => {
    return Boolean(user?.user_metadata?.email_verified);
  };

  // Enhanced refreshUser with security token verification
  const refreshUser = async () => {
    if (!isClient) return; // Skip this on server-side rendering

    setIsLoading(true);
    setError(null);
    try {
      const userData = await getUser();
      
      // Create an immutable user object to prevent direct manipulation
      if (userData) {
        setUser(Object.freeze(userData as User));
        setAuthVerified(true);
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error("Failed to fetch user:", err);
      setError("Failed to fetch user data");
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Enhanced signOut with security measures
  const signOut = async () => {
    if (!isClient) return; // Skip this on server-side rendering

    setIsLoading(true);
    try {
      // Use signOutAction from server actions for secure logout
      const { errorMessage } = await signOutAction();
      if (errorMessage) {
        throw new Error(errorMessage);
      }
      
      // Clear authentication state
      setUser(null);
      setAuthVerified(false);
      
      // Use replace for non-interceptable navigation
      window.location.replace(`${process.env.NEXT_PUBLIC_BASE_URL}/`);
      
      // Prevent further code execution after redirect
      return new Promise<void>(() => {});
    } catch (err) {
      console.error("Failed to sign out:", err);
      setError("Failed to sign out");
      setIsLoading(false);
    }
  };

  // Set isClient to true after component mounts (client-side only)
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Only run user fetching on the client side after component mounts
  useEffect(() => {
    if (isClient) {
      refreshUser();
    }
  }, [isClient]);

  // Add protection against client-side tampering
  useEffect(() => {
    if (isClient && user) {
      // Add navigation listener to verify auth state on route changes
      const handleRouteChange = () => {
        // Verify auth state on navigation if we haven't already
        if (!isLoading && authVerified) {
          refreshUser();
        }
      };

      // Listen for client-side navigation events
      window.addEventListener('popstate', handleRouteChange);
      
      // Clean up
      return () => {
        window.removeEventListener('popstate', handleRouteChange);
      };
    }
  }, [isClient, user, isLoading, authVerified]);

  // Create immutable context value to prevent manipulation
  const contextValue: AuthContextType = Object.freeze({
    user,
    isLoading,
    error,
    signOut,
    refreshUser,
    getUserEmail,
    getUserName,
    getFullName,
    getUserAvatar,
    isEmailVerified,
  });

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}