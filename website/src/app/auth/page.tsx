"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import Header from "../components/Header";
import Footer from "../components/Footer";

type StyleType = "fantasy" | "scifi" | "real";
type AuthTab = "login" | "signup";

export default function Auth() {
  // Theme state management
  const [currentStyle, setCurrentStyle] = useState<StyleType>("fantasy");
  const [authTab, setAuthTab] = useState<AuthTab>("login");
  
  // Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // Auth context and router
  const { login, signup, isLoading, error: authError } = useAuth();
  const router = useRouter();
  
  // Form error state
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // First useEffect: Only runs once on mount to load theme from localStorage
  useEffect(() => {
    // This code only runs on the client, after hydration
    const storedTheme = localStorage.getItem("theme") as StyleType | null;
    if (storedTheme) {
      setCurrentStyle(storedTheme);
    }
  }, []); // Empty dependency array means this only runs once on mount
  
  // Second useEffect: Runs when theme changes to save to localStorage
  useEffect(() => {
    localStorage.setItem("theme", currentStyle);
  }, [currentStyle]); // Only runs when currentStyle changes

  // Reset error when tab changes
  useEffect(() => {
    setError(null);
  }, [authTab]);

  // Theme settings based on selected style
  const styleSettings = {
    fantasy: {
      title: "Join the Adventure",
      titleImage: "/images/titlefantasy.png",
      themeColor: "from-amber-600 to-amber-800",
      buttonColor: "bg-amber-600 hover:bg-amber-700",
      buttonStyle: "border-2 border-amber-300 shadow-lg shadow-amber-900/30",
      buttonHoverEffect: "hover:shadow-amber-500/50 hover:border-amber-200",
      switcherActiveColor: "bg-gradient-to-r from-amber-700 to-amber-600",
      switcherHoverColor: "hover:bg-amber-900/40",
      menuTextColor: "text-amber-200",
      menuHoverColor: "hover:text-amber-400",
      bgImage: "/images/fantasy.jpg",
      subtitleFont: "font-serif italic",
      navigationFont: "font-serif tracking-wide",
      navigationBorder: "border-b border-amber-700/30",
      navigationHoverEffect: "hover:border-b hover:border-amber-400",
      menuActiveIndicator: "after:content-[''] after:block after:w-full after:h-0.5 after:bg-amber-400 after:mt-0.5",
      inputBorder: "border-amber-700/50 focus:border-amber-300",
      inputFocus: "focus:ring-amber-400/30",
      tabActive: "border-amber-400 text-amber-400",
      cardBg: "bg-amber-900/30 border border-amber-700/50",
      socialButton: "bg-amber-700/50 hover:bg-amber-700/70",
      errorColor: "bg-red-800/50 border-red-700 text-red-200"
    },
    scifi: {
      title: "Access Portal",
      titleImage: "/images/titlescifi.png",
      themeColor: "from-cyan-600 to-blue-900",
      buttonColor: "bg-cyan-600 hover:bg-cyan-700",
      buttonStyle: "border border-cyan-400 shadow-lg shadow-cyan-900/30",
      buttonHoverEffect: "hover:shadow-cyan-500/50 hover:border-cyan-300",
      switcherActiveColor: "bg-gradient-to-r from-blue-600 to-cyan-700",
      switcherHoverColor: "hover:bg-blue-900/40",
      menuTextColor: "text-cyan-200",
      menuHoverColor: "hover:text-cyan-400",
      bgImage: "/images/scifi.jpg",
      subtitleFont: "font-mono tracking-wider",
      navigationFont: "font-mono tracking-widest uppercase text-xs",
      navigationBorder: "border-b border-blue-700/30",
      navigationHoverEffect: "hover:border-b hover:border-cyan-400",
      menuActiveIndicator: "after:content-[''] after:block after:w-full after:h-0.5 after:bg-cyan-400 after:mt-0.5",
      inputBorder: "border-blue-700/50 focus:border-cyan-300",
      inputFocus: "focus:ring-cyan-400/30",
      tabActive: "border-cyan-400 text-cyan-400",
      cardBg: "bg-blue-900/30 border border-blue-700/50",
      socialButton: "bg-blue-700/50 hover:bg-blue-700/70",
      errorColor: "bg-red-800/50 border-red-700 text-red-200"
    },
    real: {
      title: "Account Access",
      titleImage: "/images/titlereal.png",
      themeColor: "from-emerald-600 to-emerald-800",
      buttonColor: "bg-emerald-600 hover:bg-emerald-700",
      buttonStyle: "border border-emerald-400 shadow-lg shadow-emerald-900/30",
      buttonHoverEffect: "hover:shadow-emerald-500/50 hover:border-emerald-300",
      switcherActiveColor: "bg-gradient-to-r from-emerald-700 to-emerald-600",
      switcherHoverColor: "hover:bg-emerald-800/40",
      menuTextColor: "text-emerald-200",
      menuHoverColor: "hover:text-emerald-400",
      bgImage: "/images/real.jpg",
      subtitleFont: "font-sans tracking-tight",
      navigationFont: "font-sans tracking-normal",
      navigationBorder: "border-b border-emerald-700/30",
      navigationHoverEffect: "hover:border-b hover:border-emerald-400",
      menuActiveIndicator: "after:content-[''] after:block after:w-full after:h-0.5 after:bg-emerald-400 after:mt-0.5",
      inputBorder: "border-emerald-700/50 focus:border-emerald-300",
      inputFocus: "focus:ring-emerald-400/30",
      tabActive: "border-emerald-400 text-emerald-400",
      cardBg: "bg-emerald-900/30 border border-emerald-700/50",
      socialButton: "bg-emerald-700/50 hover:bg-emerald-700/70",
      errorColor: "bg-red-800/50 border-red-700 text-red-200"
    }
  };

  const currentSettings = styleSettings[currentStyle];
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    
    try {
      if (authTab === 'login') {
        // Validate login inputs
        if (!email || !password) {
          setError("Please fill in all fields");
          setIsSubmitting(false);
          return;
        }
        
        // Use the login function from AuthContext
        const success = await login(email, password);
        
        if (success) {
          // Redirect to user profile upon successful login
          router.push("/user/profile");
        } else {
          setError("Invalid email or password");
        }
      } else {
        // Validate signup inputs
        if (!name || !email || !username || !password || !confirmPassword) {
          setError("Please fill in all fields");
          setIsSubmitting(false);
          return;
        }
        
        if (password !== confirmPassword) {
          setError("Passwords do not match");
          setIsSubmitting(false);
          return;
        }
        
        if (password.length < 8) {
          setError("Password must be at least 8 characters");
          setIsSubmitting(false);
          return;
        }
        
        // Call the signup function from AuthContext
        const success = await signup(name, email, username, password);
        
        if (success) {
          alert("Account created successfully! Please log in.");
          setAuthTab('login');
          setEmail("");
          setPassword("");
          setName("");
          setUsername("");
          setConfirmPassword("");
        }
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleGoogleAuth = async () => {
    setError(null);
    setIsSubmitting(true);
    
    try {
      // In a real app, you would implement OAuth with Google
      // For now, we'll just simulate a successful login
      alert("Google authentication would happen here");
      setIsSubmitting(false);
    } catch (err) {
      setError("Google authentication failed. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <main className="relative min-h-screen flex flex-col overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out"
          style={{ backgroundImage: `url(${currentSettings.bgImage})` }}
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className={`absolute inset-0 bg-gradient-to-b ${currentSettings.themeColor} opacity-25`} />
      </div>

      {/* Header */}
      <Header />

      {/* Authentication Form */}
      <section className="relative z-10 flex-1 flex items-center justify-center py-12 px-4 pt-28 md:pt-32">
        <div className="max-w-md w-full">
          <h1 className={`text-3xl font-bold text-white text-center mb-6 ${currentSettings.subtitleFont}`}>
            {currentSettings.title}
          </h1>
          
          <div className={`${currentSettings.cardBg} backdrop-blur-sm rounded-lg overflow-hidden`}>
            {/* Tabs */}
            <div className="flex border-b border-white/20">
              <button 
                onClick={() => setAuthTab('login')}
                className={`flex-1 py-3 font-medium transition-colors border-b-2 ${
                  authTab === 'login' 
                    ? currentSettings.tabActive
                    : 'border-transparent text-white/70 hover:text-white'
                }`}
              >
                Login
              </button>
              <button 
                onClick={() => setAuthTab('signup')}
                className={`flex-1 py-3 font-medium transition-colors border-b-2 ${
                  authTab === 'signup' 
                    ? currentSettings.tabActive
                    : 'border-transparent text-white/70 hover:text-white'
                }`}
              >
                Sign Up
              </button>
            </div>
            
            {/* Form */}
            <div className="p-6">
              {/* Error Message */}
              {(error || authError) && (
                <div className={`p-3 mb-4 rounded-md ${currentSettings.errorColor}`}>
                  {error || authError}
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                {authTab === 'signup' && (
                  <div className="mb-4">
                    <label htmlFor="name" className="block text-white mb-2 text-sm font-medium">Full Name</label>
                    <input
                      type="text"
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={`w-full bg-black/40 text-white border ${currentSettings.inputBorder} rounded-md px-4 py-2 ${currentSettings.inputFocus} focus:ring focus:outline-none`}
                      placeholder="Your full name"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                )}
                
                <div className="mb-4">
                  <label htmlFor="email" className="block text-white mb-2 text-sm font-medium">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full bg-black/40 text-white border ${currentSettings.inputBorder} rounded-md px-4 py-2 ${currentSettings.inputFocus} focus:ring focus:outline-none`}
                    placeholder="you@example.com"
                    required
                    disabled={isSubmitting}
                  />
                </div>
                
                {authTab === 'signup' && (
                  <div className="mb-4">
                    <label htmlFor="username" className="block text-white mb-2 text-sm font-medium">Username</label>
                    <input
                      type="text"
                      id="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className={`w-full bg-black/40 text-white border ${currentSettings.inputBorder} rounded-md px-4 py-2 ${currentSettings.inputFocus} focus:ring focus:outline-none`}
                      placeholder="Choose a username"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                )}
                
                <div className="mb-4">
                  <label htmlFor="password" className="block text-white mb-2 text-sm font-medium">Password</label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full bg-black/40 text-white border ${currentSettings.inputBorder} rounded-md px-4 py-2 ${currentSettings.inputFocus} focus:ring focus:outline-none`}
                    placeholder={authTab === 'login' ? 'Your password' : 'Create a password'}
                    required
                    disabled={isSubmitting}
                  />
                </div>
                
                {authTab === 'signup' && (
                  <div className="mb-4">
                    <label htmlFor="confirmPassword" className="block text-white mb-2 text-sm font-medium">Confirm Password</label>
                    <input
                      type="password"
                      id="confirmPassword"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={`w-full bg-black/40 text-white border ${currentSettings.inputBorder} rounded-md px-4 py-2 ${currentSettings.inputFocus} focus:ring focus:outline-none`}
                      placeholder="Confirm your password"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                )}
                
                {authTab === 'login' && (
                  <div className="flex justify-end mb-4">
                    <a href="#" className={`text-sm ${currentSettings.menuHoverColor} ${currentSettings.menuTextColor}`}>
                      Forgot your password?
                    </a>
                  </div>
                )}
                
                <button
                  type="submit"
                  disabled={isSubmitting || isLoading}
                  className={`w-full ${currentSettings.buttonColor} ${currentSettings.buttonStyle} text-white font-medium py-2 px-4 rounded-md ${currentSettings.buttonHoverEffect} transition-all ${(isSubmitting || isLoading) ? 'opacity-75 cursor-not-allowed' : ''}`}
                >
                  {isSubmitting || isLoading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    authTab === 'login' ? 'Login' : 'Create Account'
                  )}
                </button>
              </form>
              
              <div className="mt-6 flex items-center">
                <div className="flex-1 border-t border-white/20"></div>
                <span className="px-4 text-white/70 text-sm">OR</span>
                <div className="flex-1 border-t border-white/20"></div>
              </div>
              
              <button
                onClick={handleGoogleAuth}
                className={`mt-4 w-full ${currentSettings.socialButton} border border-white/10 text-white font-medium py-2 px-4 rounded-md flex items-center justify-center gap-2 transition-all`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" className="mt-0.5" viewBox="0 0 48 48">
                  <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
                  <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
                  <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
                  <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
                </svg>
                <span>Continue with Google</span>
              </button>
              
              <p className="mt-6 text-center text-white/70 text-sm">
                {authTab === 'login' ? (
                  <>
                    Don't have an account?{' '}
                    <button onClick={() => setAuthTab('signup')} className={`${currentSettings.menuTextColor} font-medium`}>
                      Sign up now
                    </button>
                  </>
                ) : (
                  <>
                    Already have an account?{' '}
                    <button onClick={() => setAuthTab('login')} className={`${currentSettings.menuTextColor} font-medium`}>
                      Login instead
                    </button>
                  </>
                )}
              </p>
            </div>
          </div>
          
          <p className="mt-8 text-center text-white/50 text-xs">
            By signing up, you agree to our <a href="#" className="underline hover:text-white/80">Terms of Service</a> and <a href="#" className="underline hover:text-white/80">Privacy Policy</a>.
          </p>
        </div>
      </section>
      
      <Footer />
    </main>
  );
} 