"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTheme, getStyleSettings } from "../ThemeContext";

export default function Follow() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  
  const { currentStyle, setCurrentStyle } = useTheme();
  const currentSettings = getStyleSettings(currentStyle);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      // In a real app, this would send the email to your API
      console.log("Subscribing email:", email);
      setSubscribed(true);
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

      {/* Transparent Header */}
      <header className={`fixed top-0 z-50 w-full py-3 ${currentSettings.navigationBorder} bg-black/20 backdrop-blur-sm transition-all duration-500`}>
        <div className="container mx-auto px-4 flex items-center justify-between h-16">
          {/* Left side: Combined theme switcher with instruction */}
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
            
            {/* Arrow and instruction */}
            <div className="flex items-center ml-3">
              <div className="animate-pulse">
                <svg width="24" height="20" viewBox="0 0 24 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 1L3 10M3 10L12 19M3 10H23" stroke="#FF3333" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="ml-2 text-white text-sm">Change style here (try it!)</span>
            </div>
          </div>
          
          {/* Right side: Navigation */}
          <nav className={`flex bg-black/30 px-4 py-2 rounded-lg ${currentSettings.navigationFont}`}>
            <Link 
              href="/" 
              className={`${currentSettings.menuTextColor} ${currentSettings.menuHoverColor} transition relative px-3 py-1 ${currentSettings.navigationHoverEffect}`}
            >
              Home
            </Link>
            <Link 
              href="/about" 
              className={`${currentSettings.menuTextColor} ${currentSettings.menuHoverColor} transition relative px-3 py-1 ${currentSettings.navigationHoverEffect}`}
            >
              About
            </Link>
            <Link 
              href="/features" 
              className={`${currentSettings.menuTextColor} ${currentSettings.menuHoverColor} transition relative px-3 py-1 ${currentSettings.navigationHoverEffect}`}
            >
              Features
            </Link>
            <Link 
              href="/follow" 
              className={`${currentSettings.menuTextColor} ${currentSettings.menuHoverColor} transition relative px-3 py-1 ${currentSettings.navigationHoverEffect} ${currentSettings.menuActiveIndicator}`}
            >
              Follow
            </Link>
            <div className="border-l border-white/20 mx-2"></div>
            <Link 
              href="/auth" 
              className={`${currentSettings.buttonColor} text-white px-4 py-1 rounded-md text-sm transition-all hover:scale-105 flex items-center gap-1`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Login / Sign Up</span>
            </Link>
          </nav>
        </div>
      </header>

      {/* Content */}
      <section className="relative z-10 flex flex-col items-center justify-center flex-1 px-4 py-8 pt-28 md:pt-32">
        <h1 className={`text-4xl font-bold mb-4 text-white drop-shadow-lg ${currentSettings.subtitleFont}`}>{currentSettings.title}</h1>
        
        <div className="max-w-6xl mx-auto">
          {/* Top Section - Newsletter */}
          <div className="mb-8">
            <div className={`${currentSettings.formBg} rounded-lg p-6 backdrop-blur-sm`}>
              <h2 className={`text-2xl font-bold text-white mb-4 ${currentSettings.subtitleFont}`}>Get Early Access</h2>
              
              {!subscribed ? (
                <>
                  <p className="text-white/90 mb-4">
                    Join our growing community and be the first to experience the next generation of interactive storytelling.
                    Subscribe to receive development updates, beta test invitations, and exclusive content.
                  </p>
                  
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="email" className="block text-white mb-2">Email Address</label>
                      <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        required
                        className={`w-full px-4 py-2 rounded-md bg-black/20 text-white border ${currentSettings.inputBorder} placeholder-white/50 ${currentSettings.inputFocus} focus:ring focus:outline-none transition-all`}
                      />
                    </div>
                    
                    <div className="pt-2">
                      <button 
                        type="submit" 
                        className={`${currentSettings.buttonColor} text-white px-8 py-3 rounded-md ${currentSettings.buttonStyle} ${currentSettings.buttonHoverEffect} w-full transition-all`}
                      >
                        Subscribe Now
                      </button>
                    </div>
                    
                    <p className="text-white/70 text-sm">
                      We respect your privacy and will never share your information.
                      You can unsubscribe at any time.
                    </p>
                  </form>
                </>
              ) : (
                <div className="text-center py-8">
                  <div className="inline-block rounded-full bg-white/10 p-4 mb-4">
                    <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Thank You for Subscribing!</h3>
                  <p className="text-white/90">
                    We've sent a confirmation email to your inbox. 
                    Please check your email to complete the subscription process.
                  </p>
                </div>
              )}
            </div>
          </div>
          
          {/* Bottom Section - Split into two columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column - Connect With Us */}
            <div className="bg-black/30 backdrop-blur-sm rounded-lg p-6">
              <h2 className={`text-2xl font-bold text-white mb-4 ${currentSettings.subtitleFont}`}>Connect With Us</h2>
              
              <p className="text-white/90 mb-6">
                Follow our journey across social media for the latest updates, behind-the-scenes content, 
                and opportunities to shape the future of our platform.
              </p>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {/* Social Media Icons */}
                <a href="#" className={`${currentSettings.socialIcon} rounded-lg p-4 flex flex-col items-center border ${currentSettings.socialIconBorder} transition-all hover:transform hover:scale-105`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-2 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.901 1.153h3.68l-8.04 9.19L24 21.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 19.644h2.039L6.486 3.24H4.298Z" />
                  </svg>
                  <span className="text-white text-sm">Twitter</span>
                </a>
                
                <a href="#" className={`${currentSettings.socialIcon} rounded-lg p-4 flex flex-col items-center border ${currentSettings.socialIconBorder} transition-all hover:transform hover:scale-105`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-2 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                  </svg>
                  <span className="text-white text-sm">Instagram</span>
                </a>
                
                <a href="#" className={`${currentSettings.socialIcon} rounded-lg p-4 flex flex-col items-center border ${currentSettings.socialIconBorder} transition-all hover:transform hover:scale-105`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-2 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.317 4.3698a19.7913 19.7913 0 0 0-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />
                  </svg>
                  <span className="text-white text-sm">Discord</span>
                </a>
                
                <a href="#" className={`${currentSettings.socialIcon} rounded-lg p-4 flex flex-col items-center border ${currentSettings.socialIconBorder} transition-all hover:transform hover:scale-105`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-2 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                  <span className="text-white text-sm">YouTube</span>
                </a>
              </div>
            </div>
            
            {/* Right Column - Our Community */}
            <div className="bg-black/30 backdrop-blur-sm rounded-lg p-6">
              <h2 className={`text-2xl font-bold text-white mb-3 ${currentSettings.subtitleFont}`}>Our Community</h2>
              <p className="text-white/90 mb-4">
                Join thousands of storytelling enthusiasts, writers, and gamers who are helping shape
                the future of interactive fiction. Share ideas, give feedback, and be part of our creative process.
              </p>
              <div className="flex space-x-2 mb-4">
                <div className="w-10 h-10 rounded-full bg-white/20 overflow-hidden flex items-center justify-center">
                  <Image 
                    src="/images/community/community1.jpg"
                    alt="Community Member" 
                    width={40} 
                    height={40}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="w-10 h-10 rounded-full bg-white/20 overflow-hidden flex items-center justify-center">
                  <Image 
                    src="/images/community/community2.jpg"
                    alt="Community Member" 
                    width={40} 
                    height={40}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="w-10 h-10 rounded-full bg-white/20 overflow-hidden flex items-center justify-center">
                  <Image 
                    src="/images/community/community3.jpg"
                    alt="Community Member" 
                    width={40} 
                    height={40}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="w-10 h-10 rounded-full bg-white/20 overflow-hidden flex items-center justify-center">
                  <Image 
                    src="/images/community/community4.jpg"
                    alt="Community Member" 
                    width={40} 
                    height={40}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white text-xs">
                  +2.5k
                </div>
              </div>
              <div className="text-left">
                <a href="#" className={`inline-block ${currentSettings.buttonColor} text-white px-6 py-2 rounded-md ${currentSettings.buttonStyle} ${currentSettings.buttonHoverEffect} transition-all text-sm`}>
                  Join Our Discord
                </a>
              </div>
            </div>
          </div>
          
          {/* FAQ Section */}
          <div className="bg-black/30 backdrop-blur-sm rounded-lg p-6 mt-8">
            <h2 className={`text-2xl font-bold text-white mb-6 ${currentSettings.subtitleFont}`}>Frequently Asked Questions</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-bold text-white mb-2">When will the platform launch?</h3>
                <p className="text-white/80">
                  We're targeting a beta launch in Q3 2023, with full release planned for early 2024.
                  Subscribers will receive priority access to our closed beta program.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-white mb-2">What platforms will be supported?</h3>
                <p className="text-white/80">
                  At launch, we'll support web browsers, iOS, and Android devices.
                  Desktop applications for Windows and Mac are on our roadmap for release post-launch.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Will there be a free version?</h3>
                <p className="text-white/80">
                  Yes! We'll offer a free tier with access to select stories and features.
                  Premium subscriptions will unlock unlimited access to all content and advanced features.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-white mb-2">How can I become a creator?</h3>
                <p className="text-white/80">
                  We'll be launching a creator program shortly after our initial release.
                  Sign up for our newsletter to be notified when creator applications open.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
} 