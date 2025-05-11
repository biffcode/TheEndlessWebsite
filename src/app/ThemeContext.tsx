"use client";

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

export type StyleType = "fantasy" | "scifi" | "real";

interface ThemeContextType {
  currentStyle: StyleType;
  setCurrentStyle: (style: StyleType) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Default to fantasy, but will check localStorage on client
  const [currentStyle, setCurrentStyle] = useState<StyleType>("fantasy");
  
  // Only runs on the client after hydration
  useEffect(() => {
    // Get theme from localStorage if available
    const storedTheme = localStorage.getItem("theme") as StyleType | null;
    if (storedTheme && ["fantasy", "scifi", "real"].includes(storedTheme)) {
      setCurrentStyle(storedTheme);
    }
  }, []);
  
  // Save to localStorage when theme changes
  useEffect(() => {
    localStorage.setItem("theme", currentStyle);
  }, [currentStyle]);

  return (
    <ThemeContext.Provider value={{ currentStyle, setCurrentStyle }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Custom hook to use the theme context
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// Style settings for each theme
export const getStyleSettings = (style: StyleType) => {
  const styleSettings = {
    fantasy: {
      title: "Endless Novel",
      titleImage: "/images/titlefantasy.png",
      subtitle: "Craft your own epic tale in a world of magic and mystery",
      subtitleFont: "font-serif italic",
      navigationFont: "font-serif tracking-wide",
      navigationBorder: "border-b border-amber-700/30",
      navigationHoverEffect: "hover:border-b hover:border-amber-400",
      menuActiveIndicator: "after:content-[''] after:block after:w-full after:h-0.5 after:bg-amber-400 after:mt-0.5",
      ctaText: "Begin Your Adventure",
      themeColor: "from-amber-600 to-amber-800",
      buttonColor: "bg-amber-600 hover:bg-amber-700",
      buttonStyle: "border-2 border-amber-300 shadow-lg shadow-amber-900/30",
      buttonHoverEffect: "hover:shadow-amber-500/50 hover:border-amber-200",
      switcherActiveColor: "bg-gradient-to-r from-amber-700 to-amber-600",
      switcherHoverColor: "hover:bg-amber-900/40",
      menuTextColor: "text-amber-200",
      menuHoverColor: "hover:text-amber-400",
      bgImage: "/good_images/heroimages/fantasy.jpg",
      featureHighlight: "text-amber-400",
      inputBorder: "border-amber-700/50 focus:border-amber-300",
      inputFocus: "focus:ring-amber-400/30",
      socialIcon: "bg-amber-800/50 hover:bg-amber-700",
      socialIconBorder: "border-amber-600/30",
      formBg: "bg-amber-900/20 border border-amber-700/50",
      // Features page specific
      featureCardBg: "bg-amber-900/20 border border-amber-700/50",
      featureIcon: "text-amber-300",
      technologyImage: "/images/technology/fantasy.jpg",
      featureImages: {
        memory: "/images/features/fantasy/memory.jpg",
        inventory: "/images/features/fantasy/inventory.jpg",
        companionInventory: "/images/features/fantasy/companion_inventory.jpg",
        companion: "/images/features/fantasy/companion.jpg",
        minimap: "/images/features/fantasy/minimap.jpg",
        environments: "/images/features/fantasy/environments.jpg",
        save: "/images/features/fantasy/save.jpg",
        genre: "/images/features/fantasy/genre.jpg",
        gamemaster: "/images/features/fantasy/gamemaster.jpg",
        voice: "/images/features/fantasy/voice.jpg",
        soundfx: "/images/features/fantasy/soundfx.jpg"
      },
      // About page specific
      visionImage: "/images/vision/fantasy_vision.jpg",
      quoteStyle: "border-l-4 border-amber-500/50 pl-4 italic",
      timelineConnector: "border-l-2 border-amber-500/30",
      timelineDot: "bg-amber-500 shadow-lg shadow-amber-900/50",
      cardBg: "bg-amber-900/20"
    },
    scifi: {
      title: "Endless Novel",
      titleImage: "/images/titlescifi.png",
      subtitle: "Explore the cosmos in a universe of limitless technological wonders",
      subtitleFont: "font-mono tracking-wider",
      navigationFont: "font-mono tracking-widest uppercase text-xs",
      navigationBorder: "border-b border-blue-700/30",
      navigationHoverEffect: "hover:border-b hover:border-cyan-400",
      menuActiveIndicator: "after:content-[''] after:block after:w-full after:h-0.5 after:bg-cyan-400 after:mt-0.5",
      ctaText: "Launch Experience",
      themeColor: "from-cyan-600 to-blue-900",
      buttonColor: "bg-cyan-600 hover:bg-cyan-700",
      buttonStyle: "border border-cyan-400 shadow-lg shadow-cyan-900/30",
      buttonHoverEffect: "hover:shadow-cyan-500/50 hover:border-cyan-300",
      switcherActiveColor: "bg-gradient-to-r from-blue-600 to-cyan-700",
      switcherHoverColor: "hover:bg-blue-900/40",
      menuTextColor: "text-cyan-200",
      menuHoverColor: "hover:text-cyan-400",
      bgImage: "/good_images/heroimages/scifi.jpg",
      featureHighlight: "text-cyan-400",
      inputBorder: "border-blue-700/50 focus:border-cyan-300",
      inputFocus: "focus:ring-cyan-400/30",
      socialIcon: "bg-blue-800/50 hover:bg-cyan-700",
      socialIconBorder: "border-cyan-600/30",
      formBg: "bg-blue-900/20 border border-cyan-700/50",
      // Features page specific
      featureCardBg: "bg-blue-900/20 border border-cyan-700/50",
      featureIcon: "text-cyan-300",
      technologyImage: "/images/technology/scifi.jpg",
      featureImages: {
        memory: "/images/features/scifi/memory.jpg",
        inventory: "/images/features/scifi/inventory.jpg",
        companionInventory: "/images/features/scifi/companion_inventory.jpg",
        companion: "/images/features/scifi/companion.jpg",
        minimap: "/images/features/scifi/minimap.jpg",
        environments: "/images/features/scifi/environments.jpg",
        save: "/images/features/scifi/save.jpg",
        genre: "/images/features/scifi/genre.jpg",
        gamemaster: "/images/features/scifi/gamemaster.jpg",
        voice: "/images/features/scifi/voice.jpg",
        soundfx: "/images/features/scifi/soundfx.jpg"
      },
      // About page specific
      visionImage: "/images/vision/scifi_vision.jpg",
      quoteStyle: "border-l-4 border-cyan-500/50 pl-4 font-mono",
      timelineConnector: "border-l-2 border-cyan-500/30",
      timelineDot: "bg-cyan-500 shadow-lg shadow-cyan-900/50",
      cardBg: "bg-blue-900/20"
    },
    real: {
      title: "Endless Novel",
      titleImage: "/images/titlereal.png",
      subtitle: "Live through extraordinary stories in worlds that feel real",
      subtitleFont: "font-sans tracking-tight",
      navigationFont: "font-sans tracking-normal",
      navigationBorder: "border-b border-emerald-700/30",
      navigationHoverEffect: "hover:border-b hover:border-emerald-400",
      menuActiveIndicator: "after:content-[''] after:block after:w-full after:h-0.5 after:bg-emerald-400 after:mt-0.5",
      ctaText: "Start Your Journey",
      themeColor: "from-emerald-600 to-emerald-800",
      buttonColor: "bg-emerald-600 hover:bg-emerald-700",
      buttonStyle: "border border-emerald-400 shadow-lg shadow-emerald-900/30",
      buttonHoverEffect: "hover:shadow-emerald-500/50 hover:border-emerald-300",
      switcherActiveColor: "bg-gradient-to-r from-emerald-700 to-emerald-600",
      switcherHoverColor: "hover:bg-emerald-800/40",
      menuTextColor: "text-emerald-200",
      menuHoverColor: "hover:text-emerald-400",
      bgImage: "/good_images/heroimages/real.jpg",
      featureHighlight: "text-emerald-400",
      inputBorder: "border-emerald-700/50 focus:border-emerald-300",
      inputFocus: "focus:ring-emerald-400/30",
      socialIcon: "bg-emerald-800/50 hover:bg-emerald-700",
      socialIconBorder: "border-emerald-600/30",
      formBg: "bg-emerald-900/20 border border-emerald-700/50",
      // Features page specific
      featureCardBg: "bg-emerald-900/20 border border-emerald-700/50",
      featureIcon: "text-emerald-300",
      technologyImage: "/images/technology/real.jpg", 
      featureImages: {
        memory: "/images/features/real/memory.jpg",
        inventory: "/images/features/real/inventory.jpg",
        companionInventory: "/images/features/real/companion_inventory.jpg",
        companion: "/images/features/real/companion.jpg",
        minimap: "/images/features/real/minimap.jpg",
        environments: "/images/features/real/environments.jpg",
        save: "/images/features/real/save.jpg",
        genre: "/images/features/real/genre.jpg",
        gamemaster: "/images/features/real/gamemaster.jpg",
        voice: "/images/features/real/voice.jpg",
        soundfx: "/images/features/real/soundfx.jpg"
      },
      // About page specific
      visionImage: "/images/vision/real_vision.jpg",
      quoteStyle: "border-l-4 border-emerald-500/50 pl-4",
      timelineConnector: "border-l-2 border-emerald-500/30",
      timelineDot: "bg-emerald-500 shadow-lg shadow-emerald-900/50",
      cardBg: "bg-emerald-900/20"
    }
  };

  return styleSettings[style];
}; 