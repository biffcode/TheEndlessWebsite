"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTheme, getStyleSettings } from "./ThemeContext";
import { useAuth } from "./context/AuthContext";
import Header from "./components/Header";
import Footer from "./components/Footer";

export default function Home() {
  const { currentStyle, setCurrentStyle } = useTheme();
  const { isAuthenticated, user } = useAuth();
  const currentSettings = getStyleSettings(currentStyle);

  const keyFeatures = [
    {
      title: "AI-Powered Storytelling",
      description: "Experience endless adventure with our cutting-edge AI narrative engine that adapts to your choices and creates personalized stories.",
      imagePath: `/images/features/compressed/${currentStyle}-memory.jpg`,
      imageAlt: "AI Storytelling"
    },
    {
      title: "Pick Your World",
      description: "Choose from fantasy, sci-fi, anime, or realistic themes, watching your story transform visually and narratively to match your imagination.",
      imagePath: `/images/features/${currentStyle}/genre.jpg`,
      imageAlt: "World Selection"
    },
    {
      title: "Character Progression",
      description: "Develop your protagonist and companions with unique abilities, stats, and storylines that evolve based on your decisions.",
      imagePath: `/images/features/${currentStyle}/companion.jpg`,
      imageAlt: "Character Development"
    },
    {
      title: "Dynamic Environments",
      description: "Explore AI-powered worlds that react to your presence, with AI-crafted visuals that bring your adventure to life.",
      imagePath: `/images/features/${currentStyle}/environments.jpg`,
      imageAlt: "Environment Generation"
    }
  ];

  return (
    <main className="relative min-h-screen flex flex-col overflow-hidden">
      {/* Hero Background Image */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 overflow-hidden">
          <video
            src={`/videos/${currentStyle}-hero.webm`}
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out"
          />
        </div>
        <div className="absolute inset-0 bg-black/30" />
        <div className={`absolute inset-0 bg-gradient-to-b ${currentSettings.themeColor} opacity-25`} />
      </div>

      {/* Header */}
      <Header />

      <div className="relative">
        {/* Hero Content */}
        <section className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 text-center pt-28 md:pt-32">
          <div className="mb-4 flex justify-center">
            <Image 
              src={currentSettings.titleImage} 
              alt="Endless Novel" 
              width={400} 
              height={150} 
              className="transition-opacity duration-500"
            />
          </div>
          <p className={`text-xl md:text-2xl mb-8 text-center max-w-2xl text-white/90 drop-shadow-md transition-all duration-700 ${currentSettings.subtitleFont}`}>
            {currentSettings.subtitle}
          </p>
          <div className="mb-20">
            {isAuthenticated ? (
              <Link 
                href="/user/library" 
                className={`
                  ${currentSettings.buttonColor} 
                  ${currentSettings.buttonStyle}
                  ${currentSettings.buttonHoverEffect}
                  text-white font-bold py-3 px-10 rounded-full text-lg 
                  transition-all duration-300 transform hover:scale-105
                  inline-block
                `}
              >
                Go to My Stories
              </Link>
            ) : (
              <a 
                href="#features" 
                className={`
                  ${currentSettings.buttonColor} 
                  ${currentSettings.buttonStyle}
                  ${currentSettings.buttonHoverEffect}
                  text-white font-bold py-3 px-10 rounded-full text-lg 
                  transition-all duration-300 transform hover:scale-105
                  inline-block
                `}
              >
                {currentSettings.ctaText}
              </a>
            )}
          </div>
          
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <a href="#features" className="text-white opacity-80 hover:opacity-100 transition-opacity">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </a>
          </div>
        </section>

        {/* Key Features Section */}
        <section id="features" className="relative z-10 py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className={`text-3xl font-bold text-center mb-12 text-white ${currentSettings.subtitleFont}`}>Key Features</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {keyFeatures.map((feature, index) => (
                <div 
                  key={index} 
                  className={`${currentSettings.featureCardBg || "bg-black/30"} backdrop-blur-sm rounded-lg p-6 border border-white/10 transition-all duration-300 hover:transform hover:scale-[1.02]`}
                >
                  <div className="flex flex-col">
                    <div className="relative w-full pb-[56.25%] rounded-lg overflow-hidden mb-4">
                      <Image 
                        src={feature.imagePath}
                        alt={feature.imageAlt}
                        fill
                        className="absolute inset-0 object-cover"
                        priority={index === 0}
                        quality={90}
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    </div>
                    <h3 className={`text-xl font-bold mb-2 ${currentSettings.featureHighlight || "text-white"}`}>{feature.title}</h3>
                    <p className="text-white/80">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-10 text-center">
              <Link 
                href="/features"
                className={`${currentSettings.buttonColor} text-white px-6 py-2 rounded-md inline-flex items-center space-x-2 ${currentSettings.buttonStyle} transition-all`}
              >
                <span>Explore All Features</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                </svg>
              </Link>
            </div>
          </div>
        </section>

        {/* What Makes Us Different */}
        <section className="relative z-10 py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className={`text-3xl font-bold text-center mb-12 text-white ${currentSettings.subtitleFont}`}>What Makes Us Different</h2>
            
            <div className={`bg-black/30 backdrop-blur-sm rounded-lg p-8 mb-12`}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                <div>
                  <h3 className={`text-2xl font-bold mb-4 ${currentSettings.featureHighlight || "text-white"}`}>True Narrative Freedom</h3>
                  <p className="text-white/90 mb-4">
                    Unlike conventional games with limited paths, our AI narrative engine creates truly unique stories that adapt to your decisions. Every choice matters, creating an experience that's uniquely yours.
                  </p>
                  <p className="text-white/90">
                    The characters remember your actions, the world evolves based on your choices, and the story unfolds in ways even we can't predict.
                  </p>
                </div>
                <div className="rounded-lg overflow-hidden shadow-lg">
                  <Image 
                    src={`/images/sections/narrative/${currentStyle}.jpg`}
                    alt="Narrative Freedom" 
                    width={500} 
                    height={300}
                    className="w-full h-auto object-cover" 
                  />
                </div>
              </div>
            </div>
            
            <div className={`bg-black/30 backdrop-blur-sm rounded-lg p-8`}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                <div className="order-2 md:order-1 rounded-lg overflow-hidden shadow-lg">
                  <Image 
                    src={`/images/sections/companion/${currentStyle}.jpg`}
                    alt="Companion System" 
                    width={500} 
                    height={300}
                    className="w-full h-auto object-cover" 
                  />
                </div>
                <div className="order-1 md:order-2">
                  <h3 className={`text-2xl font-bold mb-4 ${currentSettings.featureHighlight || "text-white"}`}>Rich Companion System</h3>
                  <p className="text-white/90 mb-4">
                    Your journey is enriched by companions with unique personalities, abilities, and backstories. Build relationships, unlock their personal quests, and watch as they evolve alongside you.
                  </p>
                  <p className="text-white/90">
                    From tactical combat to heartfelt conversations, your companions make each adventure feel alive with genuine emotional depth.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="relative z-10 py-16 px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className={`text-3xl font-bold mb-6 text-white ${currentSettings.subtitleFont}`}>Ready to Begin Your Journey?</h2>
            <p className="text-white/90 text-xl mb-8 max-w-2xl mx-auto">
              {isAuthenticated 
                ? `Welcome back, ${user?.name || 'Storyteller'}! Continue your adventure or start a new one.`
                : 'Sign up today and be among the first to experience the next evolution in interactive storytelling.'
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isAuthenticated ? (
                <>
                  <Link 
                    href="/user/profile" 
                    className={`
                      ${currentSettings.buttonColor} 
                      ${currentSettings.buttonStyle}
                      ${currentSettings.buttonHoverEffect}
                      text-white font-bold py-3 px-8 rounded-full text-lg 
                      transition-all duration-300 transform hover:scale-105
                      inline-block
                    `}
                  >
                    Go to Dashboard
                  </Link>
                  <Link 
                    href="/user/library" 
                    className={`
                      bg-black/40
                      border border-white/30
                      hover:bg-black/60
                      text-white font-bold py-3 px-8 rounded-full text-lg 
                      transition-all duration-300 transform hover:scale-105
                      inline-block
                    `}
                  >
                    My Stories
                  </Link>
                </>
              ) : (
                <>
                  <Link 
                    href="/auth" 
                    className={`
                      ${currentSettings.buttonColor} 
                      ${currentSettings.buttonStyle}
                      ${currentSettings.buttonHoverEffect}
                      text-white font-bold py-3 px-8 rounded-full text-lg 
                      transition-all duration-300 transform hover:scale-105
                      inline-block
                    `}
                  >
                    Sign Up Now
                  </Link>
                  <Link 
                    href="/follow" 
                    className={`
                      bg-black/40
                      border border-white/30
                      hover:bg-black/60
                      text-white font-bold py-3 px-8 rounded-full text-lg 
                      transition-all duration-300 transform hover:scale-105
                      inline-block
                    `}
                  >
                    Join Our Community
                  </Link>
                </>
              )}
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </main>
  );
}
