"use client";

import React, { useEffect } from 'react';
import Image from "next/image";
import Link from "next/link";
import { useTheme, getStyleSettings } from "../ThemeContext";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import Footer from "../components/Footer";

export default function UserLayout({ children }: { children: React.ReactNode }) {
  const { currentStyle, setCurrentStyle } = useTheme();
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const currentSettings = getStyleSettings(currentStyle);
  const pathname = usePathname();
  const router = useRouter();

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin h-12 w-12 border-4 border-white border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect due to the useEffect
  }

  // Handle logout
  const handleLogout = () => {
    logout();
  };

  return (
    <main className="relative min-h-screen flex flex-col overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src={`/good_images/heroimages/${currentStyle}.jpg`}
            alt={`${currentStyle} theme background`}
            fill
            priority
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out"
          />
        </div>
        <div className="absolute inset-0 bg-black/30" />
        <div className={`absolute inset-0 bg-gradient-to-b ${currentSettings.themeColor} opacity-25`} />
      </div>

      {/* Transparent Header */}
      <header className={`fixed top-0 z-50 w-full py-3 ${currentSettings.navigationBorder} bg-black/20 backdrop-blur-sm transition-all duration-500`}>
        <div className="container mx-auto px-4 flex items-center justify-between h-16">
          {/* Left side: Theme switcher */}
          <div className="flex items-center">
            {/* Theme logos */}
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setCurrentStyle("fantasy")}
                className={`transition-all duration-300 rounded-md overflow-hidden ${
                  currentStyle === 'fantasy' 
                    ? 'ring-2 ring-amber-400 scale-110' 
                    : 'opacity-70 hover:opacity-100'
                }`}
              >
                <Image 
                  src="/images/titlefantasy.png" 
                  alt="Fantasy Theme" 
                  width={70} 
                  height={28} 
                  className="transition-all duration-300"
                />
              </button>
              <button 
                onClick={() => setCurrentStyle("scifi")}
                className={`transition-all duration-300 rounded-md overflow-hidden ${
                  currentStyle === 'scifi' 
                    ? 'ring-2 ring-cyan-400 scale-110' 
                    : 'opacity-70 hover:opacity-100'
                }`}
              >
                <Image 
                  src="/images/titlescifi.png" 
                  alt="Sci-Fi Theme" 
                  width={70} 
                  height={28} 
                  className="transition-all duration-300"
                />
              </button>
              <button 
                onClick={() => setCurrentStyle("real")}
                className={`transition-all duration-300 rounded-md overflow-hidden ${
                  currentStyle === 'real' 
                    ? 'ring-2 ring-emerald-400 scale-110' 
                    : 'opacity-70 hover:opacity-100'
                }`}
              >
                <Image 
                  src="/images/titlereal.png" 
                  alt="Realistic Theme" 
                  width={70} 
                  height={28} 
                  className="transition-all duration-300"
                />
              </button>
            </div>
          </div>
          
          {/* Navigation */}
          <nav className={`flex bg-black/30 px-4 py-2 rounded-lg ${currentSettings.navigationFont}`}>
            <Link 
              href="/" 
              className={`${currentSettings.menuTextColor} ${currentSettings.menuHoverColor} transition relative px-3 py-1 ${currentSettings.navigationHoverEffect}`}
            >
              Home
            </Link>
            <Link 
              href="/user/profile" 
              className={`${currentSettings.menuTextColor} ${currentSettings.menuHoverColor} transition relative px-3 py-1 ${currentSettings.navigationHoverEffect} ${pathname.includes('/user/profile') ? currentSettings.menuActiveIndicator : ''}`}
            >
              Profile
            </Link>
            <Link 
              href="/user/gems" 
              className={`${currentSettings.menuTextColor} ${currentSettings.menuHoverColor} transition relative px-3 py-1 ${currentSettings.navigationHoverEffect} ${pathname.includes('/user/gems') ? currentSettings.menuActiveIndicator : ''}`}
            >
              Buy Gems
            </Link>
            <Link 
              href="/user/subscription" 
              className={`${currentSettings.menuTextColor} ${currentSettings.menuHoverColor} transition relative px-3 py-1 ${currentSettings.navigationHoverEffect} ${pathname.includes('/user/subscription') ? currentSettings.menuActiveIndicator : ''}`}
            >
              Subscription
            </Link>
            <Link 
              href="/user/library" 
              className={`${currentSettings.menuTextColor} ${currentSettings.menuHoverColor} transition relative px-3 py-1 ${currentSettings.navigationHoverEffect} ${pathname.includes('/user/library') ? currentSettings.menuActiveIndicator : ''}`}
            >
              Community
            </Link>
            <div className="border-l border-white/20 mx-2"></div>
            <button 
              onClick={handleLogout}
              className={`${currentSettings.buttonColor} text-white px-4 py-1 rounded-md text-sm transition-all hover:scale-105 flex items-center gap-1`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Logout</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative pt-28 pb-10 px-4 flex-grow">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </div>
      
      <Footer />
    </main>
  );
} 