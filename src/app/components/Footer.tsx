"use client";

import React, { useState } from 'react';
import Link from "next/link";
import Image from "next/image";
import { useTheme, getStyleSettings } from "../ThemeContext";
import { useAuth } from "../context/AuthContext";

export default function Footer() {
  const { currentStyle } = useTheme();
  const currentSettings = getStyleSettings(currentStyle);
  const { isAuthenticated } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  return (
    <footer className={`w-full py-8 mt-20 ${currentSettings.navigationBorder} bg-black/40 backdrop-blur-sm transition-all duration-500`}>
      <div className="container mx-auto px-4">
        {/* Top section with logo and links */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          {/* Left side with logo */}
          <div className="mb-6 md:mb-0">
            <div className="flex items-center gap-2 justify-center md:justify-start">
              <Image 
                src={`/images/title${currentStyle}.png`}
                alt="Endless Novel Logo" 
                width={100} 
                height={40} 
                className="transition-all duration-300"
              />
            </div>
            <p className="text-gray-400 text-sm mt-2 text-center md:text-left">
              Where your stories come alive
            </p>
          </div>
          
          {/* Right side with links */}
          <div className={`grid grid-cols-2 md:grid-cols-3 gap-x-12 gap-y-4 ${currentSettings.navigationFont}`}>
            <div>
              <h3 className={`${currentSettings.menuTextColor} font-semibold mb-3 text-sm`}>Navigation</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/" className={`text-gray-400 hover:${currentSettings.menuTextColor.replace('text-', 'text-')} text-xs transition`}>
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/about" className={`text-gray-400 hover:${currentSettings.menuTextColor.replace('text-', 'text-')} text-xs transition`}>
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/features" className={`text-gray-400 hover:${currentSettings.menuTextColor.replace('text-', 'text-')} text-xs transition`}>
                    Features
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/community" 
                    className={`text-gray-400 hover:${currentSettings.menuTextColor.replace('text-', 'text-')} text-xs transition`}
                  >
                    Community
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/careers" 
                    className={`text-gray-400 hover:${currentSettings.menuTextColor.replace('text-', 'text-')} text-xs transition`}
                  >
                    Careers
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className={`${currentSettings.menuTextColor} font-semibold mb-3 text-sm`}>Account</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/auth" className={`text-gray-400 hover:${currentSettings.menuTextColor.replace('text-', 'text-')} text-xs transition`}>
                    Login
                  </Link>
                </li>
                <li>
                  <Link href="/auth?signup=true" className={`text-gray-400 hover:${currentSettings.menuTextColor.replace('text-', 'text-')} text-xs transition`}>
                    Sign Up
                  </Link>
                </li>
                <li>
                  <Link href="/user/profile" className={`text-gray-400 hover:${currentSettings.menuTextColor.replace('text-', 'text-')} text-xs transition`}>
                    My Profile
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className={`${currentSettings.menuTextColor} font-semibold mb-3 text-sm`}>Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/privacy-policy" className={`text-gray-400 hover:${currentSettings.menuTextColor.replace('text-', 'text-')} text-xs transition`}>
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms-of-service" className={`text-gray-400 hover:${currentSettings.menuTextColor.replace('text-', 'text-')} text-xs transition`}>
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/contact-us" className={`text-gray-400 hover:${currentSettings.menuTextColor.replace('text-', 'text-')} text-xs transition`}>
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* Bottom section with copyright */}
        <div className="pt-6 border-t border-gray-800 text-center">
          <p className="text-gray-500 text-xs">
            © {new Date().getFullYear()} Endless Novel. All rights reserved.
          </p>
          <div className="flex justify-center space-x-4 mt-4">
            <a href="https://x.com/3ndlessnovel" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-300 transition">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
              </svg>
            </a>
            <a href="https://www.instagram.com/3ndlessnovel/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-300 transition">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
              </svg>
            </a>
            <a href="https://www.youtube.com/@EndlessNovel" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-300 transition">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
              </svg>
            </a>
            <a href="https://discord.gg/WHhJSvWwYW" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-300 transition">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.317 4.492c-1.53-.69-3.17-1.2-4.885-1.49a.075.075 0 0 0-.079.036c-.21.385-.39.78-.53 1.18a16.975 16.975 0 0 0-5.058 0 10.58 10.58 0 0 0-.535-1.18.077.077 0 0 0-.079-.036 19.054 19.054 0 0 0-4.885 1.491.069.069 0 0 0-.032.027C.533 9.093-.32 13.555.099 17.961a.08.08 0 0 0 .031.055 19.18 19.18 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 12.625 12.625 0 0 1-1.84-.878.077.077 0 0 1-.008-.128 13.897 13.897 0 0 0 .501-.409.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.164.14.33.274.501.409a.077.077 0 0 1-.006.127 12.08 12.08 0 0 1-1.841.879.077.077 0 0 0-.041.106c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.13 19.13 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.278c-1.182 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
} 