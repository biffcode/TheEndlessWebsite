"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTheme, getStyleSettings } from "../ThemeContext";

export default function About() {
  const { currentStyle, setCurrentStyle } = useTheme();
  const currentSettings = getStyleSettings(currentStyle);

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
              className={`${currentSettings.menuTextColor} ${currentSettings.menuHoverColor} transition relative px-3 py-1 ${currentSettings.navigationHoverEffect} ${currentSettings.menuActiveIndicator}`}
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
              className={`${currentSettings.menuTextColor} ${currentSettings.menuHoverColor} transition relative px-3 py-1 ${currentSettings.navigationHoverEffect}`}
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
        <h1 className={`text-4xl font-bold mb-2 text-white drop-shadow-lg ${currentSettings.subtitleFont}`}>{currentSettings.title}</h1>
        
        <div className="max-w-4xl mx-auto">
          {/* Vision Section */}
          <div className={`bg-black/30 backdrop-blur-sm rounded-lg p-6 mb-8`}>
            <h2 className={`text-2xl font-bold text-white mb-4 ${currentSettings.subtitleFont}`}>Our Vision</h2>
            <div className="relative w-full h-0 pb-[56.25%] mb-6 overflow-hidden rounded-lg">
              <Image
                src={currentSettings.visionImage}
                alt="Our Vision"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            </div>
            <p className="text-white/90 mb-4">
              At Endless Novel, we're building the next evolution in interactive storytelling. Our vision is to create living, breathing narratives where the boundary between reader and creator dissolves, opening up limitless possibilities for imagination and discovery.
            </p>
            <div className={`${currentSettings.quoteStyle} text-white/80 my-6`}>
              "Stories are the most powerful technology humans have ever created. Our mission is to evolve them into living worlds that respond to you, grow with you, and surprise you."
            </div>
            <p className="text-white/90">
              Through cutting-edge AI and a deep respect for the craft of storytelling, we're creating a platform where every choice matters, every character remembers, and every world evolves based on your unique journey.
            </p>
          </div>

          {/* Team Section */}
          <div className={`bg-black/30 backdrop-blur-sm rounded-lg p-6 mb-8`}>
            <h2 className={`text-2xl font-bold text-white mb-6 ${currentSettings.subtitleFont}`}>Our Team</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {/* Team Member 1 */}
              <div className="flex flex-col bg-white/5 rounded-lg overflow-hidden">
                <div className="relative w-full" style={{ height: 'auto' }}>
                  <Image 
                    src={
                      currentStyle === "fantasy" ? "/images/profiles/Andrea_fantasy.png" : 
                      currentStyle === "scifi" ? "/images/profiles/Andrea_scifi.png" : 
                      "/images/profiles/Andrea_real.png"
                    }
                    alt="Andrea Edelman" 
                    width={400}
                    height={500}
                    className="w-full h-auto object-contain"
                  />
                </div>
                <div className="p-4 text-left">
                  <h3 className="text-white font-bold">Andrea Edelman</h3>
                  <p className="text-white/70 text-sm">
                    {currentStyle === "fantasy" ? "ARCANE ARCHITECT" : 
                     currentStyle === "scifi" ? "NEURAL ENGINEER" : 
                     "LEAD DEV"}
                  </p>
                  <p className="text-white/70 text-sm mt-2">
                    {currentStyle === "fantasy" ? 
                      "Master of magical systems design and enchanted narrative flows that bring fantastical worlds to life." : 
                     currentStyle === "scifi" ? 
                      "Quantum code architect specializing in adaptive AI narrative matrices and procedural simulation engines." : 
                      "Innovative game developer with expertise in narrative systems and procedural content generation."}
                  </p>
                </div>
              </div>

              {/* Team Member 2 */}
              <div className="flex flex-col bg-white/5 rounded-lg overflow-hidden">
                <div className="relative w-full" style={{ height: 'auto' }}>
                  <Image 
                    src={
                      currentStyle === "fantasy" ? "/images/profiles/Luke_fantasy.png" : 
                      currentStyle === "scifi" ? "/images/profiles/Luke_scifi.png" : 
                      "/images/profiles/Luke_real.png"
                    }
                    alt="Luke Kramer" 
                    width={400}
                    height={500}
                    className="w-full h-auto object-contain"
                  />
                </div>
                <div className="p-4 text-left">
                  <h3 className="text-white font-bold">Luke Kramer</h3>
                  <p className="text-white/70 text-sm">
                    {currentStyle === "fantasy" ? "REALM WEAVER" : 
                     currentStyle === "scifi" ? "SYSTEM ARCHITECT" : 
                     "GAME DEV"}
                  </p>
                  <p className="text-white/70 text-sm mt-2">
                    {currentStyle === "fantasy" ? 
                      "Craftsman of interactive spell systems and enchanted mechanics that respond intuitively to player choices." : 
                     currentStyle === "scifi" ? 
                      "Designer of holographic interfaces and neural feedback systems that create seamless immersive experiences." : 
                      "Versatile developer with a passion for creating immersive game mechanics and interactive experiences."}
                  </p>
                </div>
              </div>

              {/* Team Member 3 */}
              <div className="flex flex-col bg-white/5 rounded-lg overflow-hidden">
                <div className="relative w-full" style={{ height: 'auto' }}>
                  <Image 
                    src={
                      currentStyle === "fantasy" ? "/images/profiles/Bojan_fantasy.png" : 
                      currentStyle === "scifi" ? "/images/profiles/Bojan_scifi.png" : 
                      "/images/profiles/Bojan_real.png"
                    }
                    alt="Bojan Andrejek" 
                    width={400}
                    height={500}
                    className="w-full h-auto object-contain"
                  />
                </div>
                <div className="p-4 text-left">
                  <h3 className="text-white font-bold">Bojan Andrejek</h3>
                  <p className="text-white/70 text-sm">
                    {currentStyle === "fantasy" ? "RUNEKEEPER" : 
                     currentStyle === "scifi" ? "QUANTUM ENGINEER" : 
                     "TECH LEAD"}
                  </p>
                  <p className="text-white/70 text-sm mt-2">
                    {currentStyle === "fantasy" ? 
                      "Guardian of the ancient server runes and master of mystical cloud enchantments that power our realm." : 
                     currentStyle === "scifi" ? 
                      "Architect of quantum data structures and neural network integration for emergent synthetic storytelling." : 
                      "Backend architect with expertise in scalable systems and AI integration for dynamic content."}
                  </p>
                </div>
              </div>

              {/* Team Member 4 */}
              <div className="flex flex-col bg-white/5 rounded-lg overflow-hidden">
                <div className="relative w-full" style={{ height: 'auto' }}>
                  <Image 
                    src={
                      currentStyle === "fantasy" ? "/images/profiles/Bifari_fantasy.png" : 
                      currentStyle === "scifi" ? "/images/profiles/Bifari_scifi.png" : 
                      "/images/profiles/Bifari_real.png"
                    }
                    alt="Bifari Achmad" 
                    width={400}
                    height={500}
                    className="w-full h-auto object-contain"
                  />
                </div>
                <div className="p-4 text-left">
                  <h3 className="text-white font-bold">Bifari Achmad</h3>
                  <p className="text-white/70 text-sm">
                    {currentStyle === "fantasy" ? "VISION MAGE" : 
                     currentStyle === "scifi" ? "HOLOGRAPHIC ARTIST" : 
                     "ART LEAD"}
                  </p>
                  <p className="text-white/70 text-sm mt-2">
                    {currentStyle === "fantasy" ? 
                      "Conjurer of enchanted visuals and magical realms that bring the unseen worlds of imagination into reality." : 
                     currentStyle === "scifi" ? 
                      "Creator of advanced volumetric projections and neural-linked visual experiences that transcend dimension." : 
                      "Creative artist specializing in procedural art generation and visual storytelling techniques."}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Journey Section */}
          <div className={`bg-black/30 backdrop-blur-sm rounded-lg p-6 mb-8`}>
            <h2 className={`text-2xl font-bold text-white mb-6 ${currentSettings.subtitleFont}`}>Our Journey</h2>
            <div className="relative pl-20">
              <div className={`absolute left-8 top-0 bottom-0 ${currentSettings.timelineConnector}`}></div>
              
              <div className="mb-10 relative">
                <div className={`absolute left-[-28px] top-2 w-4 h-4 ${currentSettings.timelineDot}`}></div>
                <div className="pl-8">
                  <h3 className="text-white font-bold text-xl">February 2025 - Development Begins</h3>
                  <p className="text-white/90 mt-2">
                    We began development of Endless Novel with a focus on creating an AI-powered adventure engine. Our small team established the core architecture and started building the fundamental narrative systems.
                  </p>
                </div>
              </div>
              
              <div className="mb-10 relative">
                <div className={`absolute left-[-28px] top-2 w-4 h-4 ${currentSettings.timelineDot}`}></div>
                <div className="pl-8">
                  <h3 className="text-white font-bold text-xl">March 2025 - Team Expansion</h3>
                  <p className="text-white/90 mt-2">
                    Luke Kramer joined our development team, bringing valuable expertise in interactive storytelling and game mechanics. This addition accelerated our progress and expanded our creative capabilities.
                  </p>
                </div>
              </div>
              
              <div className="mb-10 relative">
                <div className={`absolute left-[-28px] top-2 w-4 h-4 ${currentSettings.timelineDot}`}></div>
                <div className="pl-8">
                  <h3 className="text-white font-bold text-xl">April 2025 - Website Launch</h3>
                  <p className="text-white/90 mt-2">
                    Launch of our official website (you're looking at it!) to showcase our vision, introduce our team, and begin building our community. This milestone marks our first public-facing presence.
                  </p>
                </div>
              </div>
              
              <div className="relative">
                <div className={`absolute left-[-28px] top-2 w-4 h-4 ${currentSettings.timelineDot}`}></div>
                <div className="pl-8">
                  <h3 className="text-white font-bold text-xl">May 2025 - Early Access on Steam</h3>
                  <p className="text-white/90 mt-2">
                    Planned release of our Early Access version on Steam, allowing players to experience the first generation of our AI-powered storytelling engine while helping us refine and expand the experience.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center mb-8">
            <Link 
              href="/follow" 
              className={`${currentSettings.buttonColor} text-white px-8 py-3 rounded-md ${currentSettings.buttonStyle} ${currentSettings.buttonHoverEffect} inline-flex items-center space-x-2 transition-all`}
            >
              <span>Join Our Journey</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
} 