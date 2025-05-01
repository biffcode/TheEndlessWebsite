"use client";

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';

// Define the dummy user for testing
const DUMMY_USER = {
  id: "user123",
  name: "John Storyteller",
  email: "john@example.com",
  password: "password123",
  username: "johnstoryteller",
  premium: true,
  gems: 300,
  storiesCreated: 42,
  followers: 215,
  memberSince: "March 2025"
};

// Define user type
export interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  premium: boolean;
  gems: number;
  storiesCreated: number;
  followers: number;
  memberSince: string;
  profileImage?: string;  // Optional profile image URL
  bio?: string;  // Optional user biography
}

// Define auth context type
interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create context provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  // Check if user is already logged in on component mount
  useEffect(() => {
    const checkAuthState = () => {
      setIsLoading(true);
      try {
        // Check if we have a user in local storage
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          try {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
          } catch (e) {
            console.error("Failed to parse user from localStorage", e);
            localStorage.removeItem('user');
          }
        }
      } catch (e) {
        console.error("Error checking authentication state:", e);
      } finally {
        setIsLoading(false);
      }
    };

    // Check auth state immediately
    checkAuthState();

    // Also check when window gains focus (user returns to tab)
    window.addEventListener('focus', checkAuthState);
    
    // Clean up event listener
    return () => {
      window.removeEventListener('focus', checkAuthState);
    };
  }, []);

  // Re-validate authentication when navigating between pages
  useEffect(() => {
    // We only want to verify auth state when pathname changes
    const storedUser = localStorage.getItem('user');
    if (storedUser && !user) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (e) {
        console.error("Failed to parse user during navigation check", e);
      }
    }
  }, [pathname, user]);

  // Login function - in a real app, this would call an API
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate a network request
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Check if credentials match the dummy user
      if (email === DUMMY_USER.email && password === DUMMY_USER.password) {
        // Create a user object without the password
        const { password, ...userWithoutPassword } = DUMMY_USER;
        setUser(userWithoutPassword);
        
        // Store in localStorage
        localStorage.setItem('user', JSON.stringify(userWithoutPassword));
        
        setIsLoading(false);
        return true;
      } else {
        // Check if there's a user in localStorage with these credentials
        const storedUsers = localStorage.getItem('registeredUsers');
        if (storedUsers) {
          const parsedUsers = JSON.parse(storedUsers);
          const matchedUser = parsedUsers.find((u: any) => u.email === email && u.password === password);
          
          if (matchedUser) {
            // Create a user object without the password
            const { password, ...userWithoutPassword } = matchedUser;
            setUser(userWithoutPassword);
            
            // Store in localStorage
            localStorage.setItem('user', JSON.stringify(userWithoutPassword));
            
            setIsLoading(false);
            return true;
          }
        }
        
        setError("Invalid email or password");
        setIsLoading(false);
        return false;
      }
    } catch (e) {
      setError("An error occurred during login");
      setIsLoading(false);
      return false;
    }
  };

  // Signup function - in a real app, this would call an API
  const signup = async (name: string, email: string, username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate a network request
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Check if email or username is already taken
      const storedUsers = localStorage.getItem('registeredUsers');
      let users = [];
      
      if (storedUsers) {
        users = JSON.parse(storedUsers);
        const emailExists = users.some((user: any) => user.email === email);
        const usernameExists = users.some((user: any) => user.username === username);
        
        if (emailExists) {
          setError("Email is already registered");
          setIsLoading(false);
          return false;
        }
        
        if (usernameExists) {
          setError("Username is already taken");
          setIsLoading(false);
          return false;
        }
      }
      
      // Create new user
      const newUser = {
        id: `user${Date.now()}`, // Generate a unique ID
        name,
        email,
        username,
        password, // In a real app, this would be hashed
        premium: false,
        gems: 300, // New users get 300 gems free
        storiesCreated: 0,
        followers: 0,
        memberSince: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
      };
      
      // Add to registered users
      users.push(newUser);
      localStorage.setItem('registeredUsers', JSON.stringify(users));
      
      setIsLoading(false);
      return true;
    } catch (e) {
      setError("An error occurred during signup");
      setIsLoading(false);
      return false;
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    router.push('/');
  };

  // Provide the context value
  const contextValue: AuthContextType = {
    user,
    login,
    signup,
    logout,
    isLoading,
    error,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 