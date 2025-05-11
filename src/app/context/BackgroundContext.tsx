"use client";

import React, { createContext, useContext } from 'react';
import { useTheme, StyleType } from '../ThemeContext';

// Define types for our background context
type PageType = 
  | 'home'
  | 'about'
  | 'features'
  | 'follow'
  | 'auth'
  | 'user'
  | 'community'
  | 'contact'
  | 'story'
  | 'careers'
  | 'community-stories'
  | 'legal'
  | 'privacy-policy'
  | 'terms-of-service';

// Background configuration for each page and theme
interface BackgroundConfig {
  [key: string]: {
    [theme in StyleType]: string;
  };
}

// For now, using fallback images from the theme backgrounds
// Later, you can add page-specific images to the /good_images/page_backgrounds/ directory
const backgroundConfig: BackgroundConfig = {
  home: {
    fantasy: '/good_images/page_backgrounds/home_fantasy.jpg',
    scifi: '/good_images/page_backgrounds/home_scifi.jpg',
    real: '/good_images/page_backgrounds/home_real.jpg',
  },
  about: {
    fantasy: '/good_images/page_backgrounds/about_fantasy.jpg',
    scifi: '/good_images/page_backgrounds/about_scifi.jpg',
    real: '/good_images/page_backgrounds/about_real.jpg',
  },
  features: {
    fantasy: '/good_images/page_backgrounds/features_fantasy.jpg',
    scifi: '/good_images/page_backgrounds/features_scifi.jpg',
    real: '/good_images/page_backgrounds/features_real.jpg',
  },
  follow: {
    fantasy: '/good_images/page_backgrounds/follow_fantasy.jpg',
    scifi: '/good_images/page_backgrounds/follow_scifi.jpg',
    real: '/good_images/page_backgrounds/follow_real.jpg',
  },
  auth: {
    fantasy: '/good_images/page_backgrounds/auth_fantasy.jpg',
    scifi: '/good_images/page_backgrounds/auth_scifi.jpg',
    real: '/good_images/page_backgrounds/auth_real.jpg',
  },
  user: {
    fantasy: '/good_images/page_backgrounds/user_fantasy.jpg',
    scifi: '/good_images/page_backgrounds/user_scifi.jpg',
    real: '/good_images/page_backgrounds/user_real.jpg',
  },
  community: {
    fantasy: '/good_images/page_backgrounds/community_fantasy.jpg',
    scifi: '/good_images/page_backgrounds/community_scifi.jpg',
    real: '/good_images/page_backgrounds/community_real.jpg',
  },
  'community-stories': {
    fantasy: '/good_images/page_backgrounds/community-stories_fantasy.jpg',
    scifi: '/good_images/page_backgrounds/community-stories_scifi.jpg',
    real: '/good_images/page_backgrounds/community-stories_real.jpg',
  },
  contact: {
    fantasy: '/good_images/page_backgrounds/contact_fantasy.jpg',
    scifi: '/good_images/page_backgrounds/contact_scifi.jpg',
    real: '/good_images/page_backgrounds/contact_real.jpg',
  },
  story: {
    fantasy: '/good_images/page_backgrounds/story_fantasy.jpg',
    scifi: '/good_images/page_backgrounds/story_scifi.jpg',
    real: '/good_images/page_backgrounds/story_real.jpg',
  },
  careers: {
    fantasy: '/good_images/page_backgrounds/careers_fantasy.jpg',
    scifi: '/good_images/page_backgrounds/careers_scifi.jpg',
    real: '/good_images/page_backgrounds/careers_real.jpg',
  },
  legal: {
    fantasy: '/good_images/page_backgrounds/legal_fantasy.jpg',
    scifi: '/good_images/page_backgrounds/legal_scifi.jpg',
    real: '/good_images/page_backgrounds/legal_real.jpg',
  },
  'privacy-policy': {
    fantasy: '/good_images/page_backgrounds/privacy-policy_fantasy.jpg',
    scifi: '/good_images/page_backgrounds/privacy-policy_scifi.jpg',
    real: '/good_images/page_backgrounds/privacy-policy_real.jpg',
  },
  'terms-of-service': {
    fantasy: '/good_images/page_backgrounds/terms-of-service_fantasy.jpg',
    scifi: '/good_images/page_backgrounds/terms-of-service_scifi.jpg',
    real: '/good_images/page_backgrounds/terms-of-service_real.jpg',
  },
};

// Create context
type BackgroundContextType = {
  getPageBackground: (page: PageType) => string;
};

const BackgroundContext = createContext<BackgroundContextType | undefined>(undefined);

// Provider component
export function BackgroundProvider({ children }: { children: React.ReactNode }) {
  const { currentStyle } = useTheme();

  // Function to get background image path based on page and current theme
  const getPageBackground = (page: PageType): string => {
    try {
      // First try to use page-specific background
      return backgroundConfig[page]?.[currentStyle] || '/good_images/heroimages/' + currentStyle + '.jpg';
    } catch (error) {
      // Fallback to theme background if there's any error
      return '/good_images/heroimages/' + currentStyle + '.jpg';
    }
  };

  return (
    <BackgroundContext.Provider value={{ getPageBackground }}>
      {children}
    </BackgroundContext.Provider>
  );
}

// Custom hook
export function useBackground() {
  const context = useContext(BackgroundContext);
  if (context === undefined) {
    throw new Error('useBackground must be used within a BackgroundProvider');
  }
  return context;
} 