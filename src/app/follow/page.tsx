"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTheme, getStyleSettings } from "../ThemeContext";
import { useBackground } from "../context/BackgroundContext";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Follow() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { currentStyle, setCurrentStyle } = useTheme();
  const { getPageBackground } = useBackground();
  const currentSettings = getStyleSettings(currentStyle);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (email) {
      // In a real app, this would send the subscription to endlessnovel@blackcode.ch
      console.log("Subscribing email to endlessnovel@blackcode.ch:", email);
      
      // This email submission would typically be handled by a server-side API
      // Example email content:
      const emailContent = `
        New Newsletter Subscription
        
        Email: ${email}
      `;
      
      console.log("Email content:", emailContent);
      
      setIsSubmitting(true);
      
      // Simulate API call
      setTimeout(() => {
        setSubscribed(true);
        setIsSubmitting(false);
      }, 1500);
    }
  };

  // Get the background image for this page
  const pageBackground = getPageBackground('follow');

  return (
    <main className="relative min-h-screen flex flex-col overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out"
          style={{ backgroundImage: `url(${pageBackground.desktop})` }}
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className={`absolute inset-0 bg-gradient-to-b ${currentSettings.themeColor} opacity-25`} />
      </div>

      {/* Header */}
      <Header />

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
                  <p className="text-white/90 mb-6">
                    Join our growing community and be the first to experience the next generation of interactive storytelling. Subscribe to receive development updates, beta test invitations, and exclusive content.
                  </p>
                  
                  <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                      <label htmlFor="email" className="block text-white mb-2">Email Address</label>
                      <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        required
                        className="w-full px-4 py-2 rounded-md bg-black/20 text-white border border-white/20 placeholder-white/50 focus:outline-none focus:border-white/40 transition-all"
                      />
                    </div>
                    
                    <div className="mb-4">
                      <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="bg-orange-500 hover:bg-orange-600 text-white font-medium px-6 py-2 rounded-md transition-all"
                      >
                        {isSubmitting ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Subscribing...
                          </>
                        ) : (
                          "Subscribe"
                        )}
                      </button>
                    </div>
                    
                    <p className="text-white/70 text-sm">
                      We respect your privacy and will never share your information. You can unsubscribe at any time.
                    </p>
                  </form>
                </>
              ) : (
                <div className="text-center space-y-4">
                  <div className="inline-block p-3 bg-green-500/20 rounded-full mb-2">
                    <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-white">Subscribed!</h3>
                  <p className="text-white/70">
                    You've been subscribed to updates from endlessnovel@blackcode.ch.
                    Please check your email for a confirmation message.
                  </p>
                  <button
                    onClick={() => setSubscribed(false)}
                    className="bg-orange-500 hover:bg-orange-600 text-white font-medium px-6 py-2 rounded-md transition-all mt-2 inline-flex items-center space-x-2"
                  >
                    <span>Unsubscribe</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                    </svg>
                  </button>
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
                <a href="https://x.com/3ndlessnovel" target="_blank" rel="noopener noreferrer" className={`${currentSettings.socialIcon} rounded-lg p-4 flex flex-col items-center border ${currentSettings.socialIconBorder} transition-all hover:transform hover:scale-105`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-2 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.901 1.153h3.68l-8.04 9.19L24 21.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 19.644h2.039L6.486 3.24H4.298Z" />
                  </svg>
                  <span className="text-white text-sm">Twitter</span>
                </a>
                
                <a href="https://www.instagram.com/3ndlessnovel/" target="_blank" rel="noopener noreferrer" className={`${currentSettings.socialIcon} rounded-lg p-4 flex flex-col items-center border ${currentSettings.socialIconBorder} transition-all hover:transform hover:scale-105`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-2 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                  </svg>
                  <span className="text-white text-sm">Instagram</span>
                </a>
                
                <a href="https://discord.gg/WHhJSvWwYW" target="_blank" rel="noopener noreferrer" className={`${currentSettings.socialIcon} rounded-lg p-4 flex flex-col items-center border ${currentSettings.socialIconBorder} transition-all hover:transform hover:scale-105`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-2 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.317 4.3698a19.7913 19.7913 0 0 0-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />
                  </svg>
                  <span className="text-white text-sm">Discord</span>
                </a>
                
                <a href="https://www.youtube.com/@3ndlessNovel" target="_blank" rel="noopener noreferrer" className={`${currentSettings.socialIcon} rounded-lg p-4 flex flex-col items-center border ${currentSettings.socialIconBorder} transition-all hover:transform hover:scale-105`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-2 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                  <span className="text-white text-sm">YouTube</span>
                </a>
              </div>
            </div>
            
            {/* Right Column - Our Community */}
            <div className="bg-black/30 backdrop-blur-sm rounded-lg p-6">
              <h2 className={`text-2xl font-bold text-white mb-4 ${currentSettings.subtitleFont}`}>Our Community</h2>
              
              <p className="text-white/90 mb-6">
                Join thousands of storytelling enthusiasts, writers, and gamers who are helping shape the future of interactive fiction. Share ideas, give feedback, and be part of our creative process.
              </p>
              
              <div className="grid grid-cols-1 gap-4 mb-6">
              <a 
                href="https://discord.gg/WHhJSvWwYW" 
                target="_blank" 
                rel="noopener noreferrer"
                className={`
                  bg-[#5865F2] hover:bg-[#4752C4]
                  text-white font-bold py-3 px-8 rounded-lg
                  transition-all duration-300 transform hover:scale-105
                  inline-flex items-center justify-center w-full
                `}
              >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.317 4.3698a19.7913 19.7913 0 0 0-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />
                  </svg>
                Join Our Discord
              </a>
                
                <a 
                  href="#" 
                  onClick={(e) => e.preventDefault()}
                  className={`
                    bg-[#FF4500] hover:bg-[#E03D00]
                    text-white font-bold py-3 px-8 rounded-lg
                    transition-all duration-300 transform hover:scale-105
                    inline-flex items-center justify-center w-full
                    relative
                  `}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249z" />
                  </svg>
                  Join Our Reddit
                  <div className="absolute -top-2 -right-2 bg-yellow-500 text-black text-xs px-2 py-1 rounded-full font-bold">
                    Coming Soon
                  </div>
                </a>
              </div>
            </div>
          </div>
          
          {/* Call to Action */}
          <div className="mt-8 text-center">
            <Link 
              href="/auth" 
              className={`${currentSettings.buttonColor} text-white px-8 py-3 rounded-md ${currentSettings.buttonStyle} ${currentSettings.buttonHoverEffect} inline-flex items-center space-x-2 transition-all`}
            >
              <span>Join Us Today</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
              </svg>
            </Link>
          </div>
        </div>
      </section>
      
      <Footer />
    </main>
  );
} 