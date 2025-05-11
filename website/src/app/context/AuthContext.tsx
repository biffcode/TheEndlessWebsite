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
  subscription?: {
    tier: string;
    billingCycle: 'monthly' | 'yearly';
    startDate: string;
    nextBillingDate: string;
  };  // Optional subscription info
}

// Define auth context type
interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, username: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateGems: (amount: number) => Promise<boolean>;
  updateUser: (updatedUser: User) => Promise<boolean>;
  allocateBattlePassGems: () => Promise<boolean>;
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

  // Add gems to user account
  const updateGems = async (amount: number): Promise<boolean> => {
    if (!user) {
      setError("User not authenticated");
      return false;
    }
    
    try {
      // Simulate a network request
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Update user gems
      const updatedUser = {
        ...user,
        gems: user.gems + amount
      };
      
      // Update state
      setUser(updatedUser);
      
      // Update in localStorage
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      // Also update in registeredUsers if exists
      const storedUsers = localStorage.getItem('registeredUsers');
      if (storedUsers) {
        const users = JSON.parse(storedUsers);
        const updatedUsers = users.map((u: any) => 
          u.id === user.id ? { ...u, gems: u.gems + amount } : u
        );
        localStorage.setItem('registeredUsers', JSON.stringify(updatedUsers));
      }
      
      return true;
    } catch (e) {
      setError("Failed to update gems");
      console.error("Error updating gems:", e);
      return false;
    }
  };

  // Update user
  const updateUser = async (updatedUser: User): Promise<boolean> => {
    if (!user) {
      setError("User not authenticated");
      return false;
    }
    
    try {
      // Update state
      setUser(updatedUser);
      
      // Update in localStorage
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      // Also update in registeredUsers if exists
      const storedUsers = localStorage.getItem('registeredUsers');
      if (storedUsers) {
        const users = JSON.parse(storedUsers);
        const updatedUsers = users.map((u: any) => 
          u.id === user.id ? updatedUser : u
        );
        localStorage.setItem('registeredUsers', JSON.stringify(updatedUsers));
      }
      
      return true;
    } catch (e) {
      setError("Failed to update user");
      console.error("Error updating user:", e);
      return false;
    }
  };

  // Add Battle Pass gems allocation function
  const allocateBattlePassGems = async (): Promise<boolean> => {
    if (!user || !user.subscription) {
      return false;
    }
    
    try {
      // Get gems amount based on tier
      const tierGemAmounts = {
        'adventurer': 300,
        'hero': 800,
        'legend': 1500
      };
      
      const gemsToAdd = tierGemAmounts[user.subscription.tier as keyof typeof tierGemAmounts] || 0;
      
      if (gemsToAdd === 0) {
        return false;
      }
      
      // Update the next billing date
      const currentBillingDate = new Date(user.subscription.nextBillingDate);
      const nextBillingDate = new Date(currentBillingDate);
      
      if (user.subscription.billingCycle === 'monthly') {
        nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);
      } else {
        nextBillingDate.setFullYear(nextBillingDate.getFullYear() + 1);
      }
      
      // Update user with new gems and next billing date
      const updatedUser = {
        ...user,
        gems: user.gems + gemsToAdd,
        subscription: {
          ...user.subscription,
          nextBillingDate: nextBillingDate.toISOString()
        }
      };
      
      // Update user
      return await updateUser(updatedUser);
    } catch (e) {
      setError("Failed to allocate Battle Pass gems");
      console.error("Error allocating Battle Pass gems:", e);
      return false;
    }
  };

  // Provide the context value
  const contextValue: AuthContextType = {
    user,
    login,
    signup,
    logout,
    updateGems,
    updateUser,
    allocateBattlePassGems,
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