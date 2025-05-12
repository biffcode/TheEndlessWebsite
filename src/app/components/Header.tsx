"use client";

import React, { useState } from 'react';
import Image from "next/image";
import Link from "next/link";
import { useTheme, getStyleSettings } from "../ThemeContext";
import { useAuth } from "../context/AuthContext";
import { usePathname } from 'next/navigation';

export default function Header() {
  const { currentStyle, setCurrentStyle } = useTheme();
  const { isAuthenticated, user } = useAuth();
  const currentSettings = getStyleSettings(currentStyle);
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
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
              <div className="w-[70px] h-auto">
                <Image 
                  src="/images/titlefantasy.png" 
                  alt="Fantasy Theme" 
                  width={140} 
                  height={56} 
                  className="w-full h-auto transition-all duration-300"
                />
              </div>
            </button>
            <button 
              onClick={() => setCurrentStyle("scifi")}
              className={`transition-all duration-300 rounded-md overflow-hidden ${
                currentStyle === 'scifi' 
                  ? 'ring-2 ring-cyan-400 scale-110' 
                  : 'opacity-70 hover:opacity-100'
              }`}
            >
              <div className="w-[70px] h-auto">
                <Image 
                  src="/images/titlescifi.png" 
                  alt="Sci-Fi Theme" 
                  width={140} 
                  height={56}
                  className="w-full h-auto transition-all duration-300"
                />
              </div>
            </button>
            <button 
              onClick={() => setCurrentStyle("real")}
              className={`transition-all duration-300 rounded-md overflow-hidden ${
                currentStyle === 'real' 
                  ? 'ring-2 ring-emerald-400 scale-110' 
                  : 'opacity-70 hover:opacity-100'
              }`}
            >
              <div className="w-[70px] h-auto">
                <Image 
                  src="/images/titlereal.png" 
                  alt="Realistic Theme" 
                  width={140} 
                  height={56}
                  className="w-full h-auto transition-all duration-300"
                />
              </div>
            </button>
          </div>
          
          {/* Arrow and instruction - only on homepage and only on medium screens and up */}
          {pathname === '/' && (
            <div className="hidden md:flex items-center ml-3">
              <div className="animate-pulse">
                <svg width="24" height="20" viewBox="0 0 24 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 1L3 10M3 10L12 19M3 10H23" stroke="#FF3333" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="ml-2 text-white text-sm">Change style here (try it!)</span>
            </div>
          )}
        </div>
        
        {/* Mobile menu button */}
        <button 
          onClick={toggleMobileMenu}
          className="md:hidden flex items-center text-white p-2 focus:outline-none"
          aria-label="Toggle mobile menu"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-6 w-6" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            {mobileMenuOpen ? (
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M6 18L18 6M6 6l12 12" 
              />
            ) : (
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M4 6h16M4 12h16M4 18h16" 
              />
            )}
          </svg>
        </button>
        
        {/* Desktop Navigation */}
        <nav className={`hidden md:flex bg-black/30 px-4 py-2 rounded-lg ${currentSettings.navigationFont}`}>
          <Link 
            href="/" 
            className={`${currentSettings.menuTextColor} ${currentSettings.menuHoverColor} transition relative px-3 py-1 ${currentSettings.navigationHoverEffect} ${pathname === '/' ? currentSettings.menuActiveIndicator : ''}`}
          >
            Home
          </Link>
          <Link 
            href="/about" 
            className={`${currentSettings.menuTextColor} ${currentSettings.menuHoverColor} transition relative px-3 py-1 ${currentSettings.navigationHoverEffect} ${pathname === '/about' ? currentSettings.menuActiveIndicator : ''}`}
          >
            About
          </Link>
          <Link 
            href="/features" 
            className={`${currentSettings.menuTextColor} ${currentSettings.menuHoverColor} transition relative px-3 py-1 ${currentSettings.navigationHoverEffect} ${pathname === '/features' ? currentSettings.menuActiveIndicator : ''}`}
          >
            Features
          </Link>
          <Link 
            href="/follow" 
            className={`${currentSettings.menuTextColor} ${currentSettings.menuHoverColor} transition relative px-3 py-1 ${currentSettings.navigationHoverEffect} ${pathname === '/follow' ? currentSettings.menuActiveIndicator : ''}`}
          >
            Follow
          </Link>
          <Link 
            href="/careers" 
            className={`${currentSettings.menuTextColor} ${currentSettings.menuHoverColor} transition relative px-3 py-1 ${currentSettings.navigationHoverEffect} ${pathname === '/careers' ? currentSettings.menuActiveIndicator : ''}`}
          >
            Careers
          </Link>
          
          <div className="border-l border-white/20 mx-2"></div>
          
          {isAuthenticated ? (
            <Link 
              href="/user/profile" 
              className={`${currentSettings.buttonColor} text-white px-4 py-1 rounded-md text-sm transition-all hover:scale-105 flex items-center gap-2`}
            >
              {/* Profile picture */}
              <div className="h-8 w-8 rounded-full overflow-hidden border-2 border-white/30 flex-shrink-0">
                {user?.profileImage ? (
                  <Image 
                    src={user.profileImage} 
                    alt={user?.username || "User"} 
                    width={32} 
                    height={32}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="bg-gray-600 w-full h-full flex items-center justify-center text-white text-xs">
                    {user?.username?.charAt(0).toUpperCase() || "U"}
                  </div>
                )}
              </div>
              {/* Username */}
              <span>{user?.username || "User"}</span>
            </Link>
          ) : (
            <Link 
              href="/auth" 
              className={`${currentSettings.buttonColor} text-white px-4 py-1 rounded-md text-sm transition-all hover:scale-105 flex items-center gap-1`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Login / Sign Up</span>
            </Link>
          )}
        </nav>
      </div>

      {/* Mobile menu dropdown */}
      <div className={`md:hidden ${mobileMenuOpen ? 'block' : 'hidden'} bg-black/80 backdrop-blur-md transition-all duration-300 absolute w-full`}>
        <nav className={`flex flex-col px-4 py-2 ${currentSettings.navigationFont}`}>
          <Link 
            href="/" 
            className={`${currentSettings.menuTextColor} ${currentSettings.menuHoverColor} transition py-3 border-b border-white/10 ${pathname === '/' ? currentSettings.menuActiveIndicator : ''}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            Home
          </Link>
          <Link 
            href="/about" 
            className={`${currentSettings.menuTextColor} ${currentSettings.menuHoverColor} transition py-3 border-b border-white/10 ${pathname === '/about' ? currentSettings.menuActiveIndicator : ''}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            About
          </Link>
          <Link 
            href="/features" 
            className={`${currentSettings.menuTextColor} ${currentSettings.menuHoverColor} transition py-3 border-b border-white/10 ${pathname === '/features' ? currentSettings.menuActiveIndicator : ''}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            Features
          </Link>
          <Link 
            href="/follow" 
            className={`${currentSettings.menuTextColor} ${currentSettings.menuHoverColor} transition py-3 border-b border-white/10 ${pathname === '/follow' ? currentSettings.menuActiveIndicator : ''}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            Follow
          </Link>
          <Link 
            href="/careers" 
            className={`${currentSettings.menuTextColor} ${currentSettings.menuHoverColor} transition py-3 border-b border-white/10 ${pathname === '/careers' ? currentSettings.menuActiveIndicator : ''}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            Careers
          </Link>
          
          <div className="py-4">
            {isAuthenticated ? (
              <Link 
                href="/user/profile" 
                className={`${currentSettings.buttonColor} text-white px-4 py-2 rounded-md text-sm w-full flex items-center justify-center gap-2`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {/* Profile picture */}
                <div className="h-8 w-8 rounded-full overflow-hidden border-2 border-white/30 flex-shrink-0">
                  {user?.profileImage ? (
                    <Image 
                      src={user.profileImage} 
                      alt={user?.username || "User"} 
                      width={32} 
                      height={32}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="bg-gray-600 w-full h-full flex items-center justify-center text-white text-xs">
                      {user?.username?.charAt(0).toUpperCase() || "U"}
                    </div>
                  )}
                </div>
                {/* Username */}
                <span>{user?.username || "User"}</span>
              </Link>
            ) : (
              <Link 
                href="/auth" 
                className={`${currentSettings.buttonColor} text-white px-4 py-2 rounded-md text-sm w-full flex items-center justify-center gap-1`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Login / Sign Up</span>
              </Link>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
} 