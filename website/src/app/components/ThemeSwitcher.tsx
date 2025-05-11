"use client";

import React from 'react';
import Image from "next/image";
import { useTheme, getStyleSettings } from "../ThemeContext";

export default function ThemeSwitcher() {
  const { currentStyle, setCurrentStyle } = useTheme();
  const currentSettings = getStyleSettings(currentStyle);

  return (
    <div className="flex items-center justify-center mb-6">
      <div className="flex items-center gap-2 bg-black/30 p-2 rounded-lg">
        <p className="text-white text-sm mr-2">Theme:</p>
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
  );
} 