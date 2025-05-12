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
    [theme in StyleType]: {
      desktop: string;
      mobile: string;
    };
  };
}

// For now, using fallback images from the theme backgrounds
// Later, you can add page-specific images to the /good_images/page_backgrounds/ directory
const backgroundConfig: BackgroundConfig = {
  home: {
    fantasy: {
      desktop: '/good_images/page_backgrounds/home_fantasy.jpg',
      mobile: '/good_images/page_backgrounds/fantasy_mobile.jpg'
    },
    scifi: {
      desktop: '/good_images/page_backgrounds/home_scifi.jpg',
      mobile: '/good_images/page_backgrounds/scifi_mobile.jpg'
    },
    real: {
      desktop: '/good_images/page_backgrounds/home_real.jpg',
      mobile: '/good_images/page_backgrounds/real_mobile.jpg'
    }
  },
  about: {
    fantasy: {
      desktop: '/good_images/page_backgrounds/about_fantasy.jpg',
      mobile: '/good_images/page_backgrounds/fantasy_about.jpg'
    },
    scifi: {
      desktop: '/good_images/page_backgrounds/about_scifi.jpg',
      mobile: '/good_images/page_backgrounds/scifi_about.jpg'
    },
    real: {
      desktop: '/good_images/page_backgrounds/about_real.jpg',
      mobile: '/good_images/page_backgrounds/real_about.jpg'
    }
  },
  features: {
    fantasy: {
      desktop: '/good_images/page_backgrounds/features_fantasy.jpg',
      mobile: '/good_images/page_backgrounds/fantasy_features.jpg'
    },
    scifi: {
      desktop: '/good_images/page_backgrounds/features_scifi.jpg',
      mobile: '/good_images/page_backgrounds/scifi_features.jpg'
    },
    real: {
      desktop: '/good_images/page_backgrounds/features_real.jpg',
      mobile: '/good_images/page_backgrounds/real_features.jpg'
    }
  },
  follow: {
    fantasy: {
      desktop: '/good_images/page_backgrounds/follow_fantasy.jpg',
      mobile: '/good_images/page_backgrounds/fantasy_follow.jpg'
    },
    scifi: {
      desktop: '/good_images/page_backgrounds/follow_scifi.jpg',
      mobile: '/good_images/page_backgrounds/scifi_follow.jpg'
    },
    real: {
      desktop: '/good_images/page_backgrounds/follow_real.jpg',
      mobile: '/good_images/page_backgrounds/real_follow.jpg'
    }
  },
  auth: {
    fantasy: {
      desktop: '/good_images/page_backgrounds/auth_fantasy.jpg',
      mobile: '/good_images/page_backgrounds/auth_fantasy.jpg'
    },
    scifi: {
      desktop: '/good_images/page_backgrounds/auth_scifi.jpg',
      mobile: '/good_images/page_backgrounds/auth_scifi.jpg'
    },
    real: {
      desktop: '/good_images/page_backgrounds/auth_real.jpg',
      mobile: '/good_images/page_backgrounds/auth_real.jpg'
    }
  },
  user: {
    fantasy: {
      desktop: '/good_images/page_backgrounds/user_fantasy.jpg',
      mobile: '/good_images/page_backgrounds/user_fantasy.jpg'
    },
    scifi: {
      desktop: '/good_images/page_backgrounds/user_scifi.jpg',
      mobile: '/good_images/page_backgrounds/user_scifi.jpg'
    },
    real: {
      desktop: '/good_images/page_backgrounds/user_real.jpg',
      mobile: '/good_images/page_backgrounds/user_real.jpg'
    }
  },
  community: {
    fantasy: {
      desktop: '/good_images/page_backgrounds/community_fantasy.jpg',
      mobile: '/good_images/page_backgrounds/community_fantasy.jpg'
    },
    scifi: {
      desktop: '/good_images/page_backgrounds/community_scifi.jpg',
      mobile: '/good_images/page_backgrounds/community_scifi.jpg'
    },
    real: {
      desktop: '/good_images/page_backgrounds/community_real.jpg',
      mobile: '/good_images/page_backgrounds/community_real.jpg'
    }
  },
  'community-stories': {
    fantasy: {
      desktop: '/good_images/page_backgrounds/community-stories_fantasy.jpg',
      mobile: '/good_images/page_backgrounds/community-stories_fantasy.jpg'
    },
    scifi: {
      desktop: '/good_images/page_backgrounds/community-stories_scifi.jpg',
      mobile: '/good_images/page_backgrounds/community-stories_scifi.jpg'
    },
    real: {
      desktop: '/good_images/page_backgrounds/community-stories_real.jpg',
      mobile: '/good_images/page_backgrounds/community-stories_real.jpg'
    }
  },
  contact: {
    fantasy: {
      desktop: '/good_images/page_backgrounds/contact_fantasy.jpg',
      mobile: '/good_images/page_backgrounds/contact_fantasy.jpg'
    },
    scifi: {
      desktop: '/good_images/page_backgrounds/contact_scifi.jpg',
      mobile: '/good_images/page_backgrounds/contact_scifi.jpg'
    },
    real: {
      desktop: '/good_images/page_backgrounds/contact_real.jpg',
      mobile: '/good_images/page_backgrounds/contact_real.jpg'
    }
  },
  story: {
    fantasy: {
      desktop: '/good_images/page_backgrounds/story_fantasy.jpg',
      mobile: '/good_images/page_backgrounds/story_fantasy.jpg'
    },
    scifi: {
      desktop: '/good_images/page_backgrounds/story_scifi.jpg',
      mobile: '/good_images/page_backgrounds/story_scifi.jpg'
    },
    real: {
      desktop: '/good_images/page_backgrounds/story_real.jpg',
      mobile: '/good_images/page_backgrounds/story_real.jpg'
    }
  },
  careers: {
    fantasy: {
      desktop: '/good_images/page_backgrounds/careers_fantasy.jpg',
      mobile: '/good_images/page_backgrounds/careers_fantasy.jpg'
    },
    scifi: {
      desktop: '/good_images/page_backgrounds/careers_scifi.jpg',
      mobile: '/good_images/page_backgrounds/careers_scifi.jpg'
    },
    real: {
      desktop: '/good_images/page_backgrounds/careers_real.jpg',
      mobile: '/good_images/page_backgrounds/careers_real.jpg'
    }
  },
  legal: {
    fantasy: {
      desktop: '/good_images/page_backgrounds/legal_fantasy.jpg',
      mobile: '/good_images/page_backgrounds/legal_fantasy.jpg'
    },
    scifi: {
      desktop: '/good_images/page_backgrounds/legal_scifi.jpg',
      mobile: '/good_images/page_backgrounds/legal_scifi.jpg'
    },
    real: {
      desktop: '/good_images/page_backgrounds/legal_real.jpg',
      mobile: '/good_images/page_backgrounds/legal_real.jpg'
    }
  },
  'privacy-policy': {
    fantasy: {
      desktop: '/good_images/page_backgrounds/privacy-policy_fantasy.jpg',
      mobile: '/good_images/page_backgrounds/privacy-policy_fantasy.jpg'
    },
    scifi: {
      desktop: '/good_images/page_backgrounds/privacy-policy_scifi.jpg',
      mobile: '/good_images/page_backgrounds/privacy-policy_scifi.jpg'
    },
    real: {
      desktop: '/good_images/page_backgrounds/privacy-policy_real.jpg',
      mobile: '/good_images/page_backgrounds/privacy-policy_real.jpg'
    }
  },
  'terms-of-service': {
    fantasy: {
      desktop: '/good_images/page_backgrounds/terms-of-service_fantasy.jpg',
      mobile: '/good_images/page_backgrounds/terms-of-service_fantasy.jpg'
    },
    scifi: {
      desktop: '/good_images/page_backgrounds/terms-of-service_scifi.jpg',
      mobile: '/good_images/page_backgrounds/terms-of-service_scifi.jpg'
    },
    real: {
      desktop: '/good_images/page_backgrounds/terms-of-service_real.jpg',
      mobile: '/good_images/page_backgrounds/terms-of-service_real.jpg'
    }
  },
};

// Create context
type BackgroundContextType = {
  getPageBackground: (page: PageType) => { desktop: string; mobile: string };
};

const BackgroundContext = createContext<BackgroundContextType | undefined>(undefined);

// Provider component
export function BackgroundProvider({ children }: { children: React.ReactNode }) {
  const { currentStyle } = useTheme();

  // Function to get background image path based on page and current theme
  const getPageBackground = (page: PageType): { desktop: string; mobile: string } => {
    try {
      // First try to use page-specific background
      if (backgroundConfig[page]?.[currentStyle]) {
        return backgroundConfig[page][currentStyle];
      }
      
      // Fallback to theme background if the specific page doesn't exist
      return {
        desktop: '/good_images/heroimages/' + currentStyle + '.jpg',
        mobile: '/good_images/heroimages/' + currentStyle + '.jpg'
      };
    } catch (error) {
      // Fallback to theme background if there's any error
      return {
        desktop: '/good_images/heroimages/' + currentStyle + '.jpg',
        mobile: '/good_images/heroimages/' + currentStyle + '.jpg'
      };
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