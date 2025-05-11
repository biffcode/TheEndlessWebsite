"use client";

import React, { ReactNode } from 'react';
import { useTheme, getStyleSettings, StyleType } from "../ThemeContext";
import Header from "./Header";
import Footer from "./Footer";
import ThemeSwitcher from "./ThemeSwitcher";

interface PageContainerProps {
  children: ReactNode;
  title: string;
  showThemeSwitcher?: boolean;
}

export default function PageContainer({ children, title, showThemeSwitcher = true }: PageContainerProps) {
  const { currentStyle } = useTheme();
  const currentSettings = getStyleSettings(currentStyle);

  // Get background based on current theme
  const getBackground = (style: StyleType) => {
    let bgImg = '';
    switch (style) {
      case 'fantasy':
        bgImg = "bg-[url('/good_images/heroimages/fantasy.jpg')]";
        break;
      case 'scifi':
        bgImg = "bg-[url('/good_images/heroimages/scifi.jpg')]";
        break;
      case 'real':
        bgImg = "bg-[url('/good_images/heroimages/real.jpg')]";
        break;
      default:
        bgImg = "bg-[url('/good_images/heroimages/fantasy.jpg')]";
    }
    return bgImg;
  };

  return (
    <div className={`min-h-screen ${getBackground(currentStyle)} bg-fixed bg-cover bg-center`}>
      <div className="bg-black/60 min-h-screen">
        <Header />
        
        <main className="pt-28 pb-16">
          <div className="container mx-auto">
            <h1 className={`text-3xl font-bold mb-8 text-white ${currentSettings.subtitleFont} text-center`}>
              {title}
            </h1>
            
            {showThemeSwitcher && (
              <ThemeSwitcher />
            )}
            
            {children}
          </div>
        </main>
        
        <Footer />
      </div>
    </div>
  );
} 