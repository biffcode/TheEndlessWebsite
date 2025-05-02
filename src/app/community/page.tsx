"use client";

import React, { useState, useEffect } from 'react';
import Link from "next/link";
import Image from "next/image";
import { useTheme, getStyleSettings } from "../ThemeContext";
import { useAuth } from "../context/AuthContext";
import PageContainer from "../components/PageContainer";

export default function CommunityPage() {
  const { currentStyle } = useTheme();
  const currentSettings = getStyleSettings(currentStyle);
  const { isAuthenticated, user } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [sharedStories, setSharedStories] = useState<any[]>([]);
  
  // Show the auth modal if the user is not authenticated when the page loads
  useEffect(() => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
    }
  }, [isAuthenticated]);

  // Load shared stories
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        console.log("Attempting to load shared stories...");
        
        // First check if there are any stories in the old format
        const oldSharedStoriesJson = localStorage.getItem('sharedStories');
        if (oldSharedStoriesJson) {
          try {
            console.log("Found stories in old format");
            const oldSharedStories = JSON.parse(oldSharedStoriesJson);
            
            // Ensure all stories have default placeholder images if no cover image exists
            const storiesWithImages = oldSharedStories.map((story: any) => {
              if (!story.coverImage) {
                // Assign a default placeholder image based on genre
                const genreImages: {[key: string]: string} = {
                  fantasy: "/images/community/community1.jpg",
                  scifi: "/images/community/community3.jpg",
                  mystery: "/images/community/community5.jpg",
                  horror: "/images/community/community4.jpg",
                  default: "/images/community/community2.jpg"
                };
                
                return {
                  ...story,
                  coverImage: genreImages[story.genre?.toLowerCase()] || genreImages.default
                };
              }
              return story;
            });
            
            setSharedStories(storiesWithImages);
            return;
          } catch (error) {
            console.error("Error parsing old shared stories:", error);
          }
        }
        
        // If no old format, try the new reference-based approach
        const sharedStoryRefsJson = localStorage.getItem('sharedStoryRefs');
        console.log("Shared story refs JSON:", sharedStoryRefsJson);
        
        if (sharedStoryRefsJson) {
          const storyRefs = JSON.parse(sharedStoryRefsJson);
          console.log("Found story references:", storyRefs.length);
          
          // Attempt to load full stories from user storage where possible
          const loadedStories = storyRefs.map((ref: any) => {
            console.log("Processing ref:", ref);
            
            // Try to find the full story data from user's storage
            let fullStory = null;
            try {
              if (ref.authorId) {
                const userStoriesJson = localStorage.getItem(`stories_${ref.authorId}`);
                if (userStoriesJson) {
                  const userStories = JSON.parse(userStoriesJson);
                  fullStory = userStories.find((s: any) => s.id === ref.id);
                }
              }
            } catch (e) {
              console.error("Error retrieving full story:", e);
            }
            
            // If we found the full story data, use it
            if (fullStory) {
              return {
                ...fullStory,
                authorName: ref.authorName || "Unknown Author",
                authorUsername: ref.authorUsername || "unknown",
                dateShared: ref.dateShared || new Date().toISOString()
              };
            }
            
            // Assign a default placeholder image based on genre (if we know it)
            const genreImages: {[key: string]: string} = {
              fantasy: "/images/community/community1.jpg",
              scifi: "/images/community/community3.jpg",
              mystery: "/images/community/community5.jpg",
              horror: "/images/community/community4.jpg",
              default: "/images/community/community2.jpg"
            };
            
            // If we couldn't find the full story, create a simplified version
            return {
              id: ref.id,
              title: ref.title || "Unknown Title",
              authorName: ref.authorName || "Unknown Author",
              authorUsername: ref.authorUsername || "unknown",
              dateShared: ref.dateShared || new Date().toISOString(),
              description: ref.description || "A shared story from the community.",
              genre: ref.genre || "fantasy",
              coverImage: genreImages[ref.genre?.toLowerCase()] || genreImages.default
            };
          });
          
          console.log("Loaded stories:", loadedStories.length);
          setSharedStories(loadedStories);
        } else {
          console.log("No shared story references found, creating demo data");
          
          // For testing: If no stories are found, create some demo stories
          const demoStories = [
            {
              id: "demo1",
              title: "The Lost Kingdom",
              authorName: "Jane Writer",
              authorUsername: "janewriter",
              dateShared: new Date().toISOString(),
              description: "An epic tale of adventure in a forgotten realm, where magic and mystery await at every turn.",
              genre: "fantasy",
              coverImage: "/images/community/community1.jpg"
            },
            {
              id: "demo2",
              title: "Starship Odyssey",
              authorName: "Alex Scribe",
              authorUsername: "alexscribe",
              dateShared: new Date(Date.now() - 86400000).toISOString(), // Yesterday
              description: "A journey through the cosmos aboard the most advanced vessel ever created by humanity.",
              genre: "scifi",
              coverImage: "/images/community/community3.jpg"
            },
            {
              id: "demo3",
              title: "Whispers in the Dark",
              authorName: "Sam Storyteller",
              authorUsername: "samstory",
              dateShared: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
              description: "A spine-tingling mystery set in a small town where nothing is as it seems.",
              genre: "mystery",
              coverImage: "/images/community/community5.jpg"
            }
          ];
          
          setSharedStories(demoStories);
        }
      } catch (error) {
        console.error("Error loading shared stories:", error);
        // If all else fails, show some demo content
        setSharedStories([
          {
            id: "error-demo",
            title: "Sample Story",
            authorName: "Demo Author",
            authorUsername: "demo",
            dateShared: new Date().toISOString(),
            description: "This is a demonstration story. Real shared stories will appear here.",
            genre: "fantasy",
            coverImage: "/images/community/community4.jpg"
          }
        ]);
      }
    }
  }, []);

  // Format date function
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    } catch (e) {
      return 'Unknown date';
    }
  };
  
  // Community features data
  const communityFeatures = [
    {
      title: "Discussion Forums",
      description: "Engage with fellow writers and readers in topic-based discussions about storytelling, genres, and more.",
      image: "/images/community/community1.jpg"
    },
    {
      title: "Story Sharing",
      description: "Share your creations and get feedback from a supportive community of creative minds.",
      image: "/images/community/community2.jpg"
    },
    {
      title: "Writing Challenges",
      description: "Participate in weekly and monthly writing challenges to spark your creativity.",
      image: "/images/community/community3.jpg"
    },
    {
      title: "Collaborative Writing",
      description: "Find partners for collaborative storytelling projects and create something amazing together.",
      image: "/images/community/community4.jpg"
    },
    {
      title: "Writer Resources",
      description: "Access a curated collection of writing resources, guides, and tools shared by the community.",
      image: "/images/community/community5.jpg"
    }
  ];

  return (
    <PageContainer title="Community" showThemeSwitcher={false}>
      <div className="max-w-6xl mx-auto px-4">
        <div className={`${currentSettings.cardBg || "bg-black/30"} backdrop-blur-sm rounded-lg p-6 border border-white/10 mb-8`}>
          <h2 className={`text-2xl font-bold ${currentSettings.subtitleFont} text-white mb-4`}>
            Welcome to the Endless Novel Community
          </h2>
          <p className="text-white/80 mb-6">
            Connect with fellow storytellers, share your creations, get feedback, and collaborate on 
            writing projects. Our community is a space for writers of all levels to grow, learn, and inspire each other.
          </p>
          
          {isAuthenticated ? (
            <>
              {/* Community Features */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                {communityFeatures.map((feature, index) => (
                  <div 
                    key={index} 
                    className={`${currentSettings.cardBg ? currentSettings.cardBg.replace('bg-', 'bg-') : 'bg-black/50'} 
                      rounded-lg overflow-hidden border border-white/10 transition-all hover:shadow-lg hover:transform hover:scale-[1.02]`}
                  >
                    <div className="h-40 relative overflow-hidden">
                      <Image 
                        src={feature.image} 
                        alt={feature.title}
                        fill
                        style={{ objectFit: 'cover' }}
                        className="transition-transform duration-500 hover:scale-110"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className={`${currentSettings.subtitleFont} text-xl font-semibold text-white mb-2`}>
                        {feature.title}
                      </h3>
                      <p className="text-white/80 text-sm">
                        {feature.description}
                      </p>
                      <button 
                        className={`mt-4 ${currentSettings.buttonColor} text-white px-4 py-2 rounded-md ${currentSettings.buttonStyle} text-sm w-full transition-all`}
                      >
                        Explore
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Shared Stories Section */}
              <div className="mt-16">
                <h2 className={`text-2xl font-bold ${currentSettings.subtitleFont} text-white mb-6`}>
                  Community Stories
                </h2>
                
                {sharedStories.length > 0 ? (
                  <div className="grid grid-cols-1 gap-6">
                    {sharedStories.map((story, index) => (
                      <div 
                        key={story.id} 
                        className="bg-black/30 rounded-lg p-4 border border-white/10 transition-all hover:-translate-y-1"
                      >
                        <div className="flex gap-4">
                          {story.coverImage ? (
                            <div className="w-32 h-32 relative flex-shrink-0 rounded-md overflow-hidden">
                              <Image
                                src={story.coverImage}
                                alt={story.title}
                                fill
                                style={{ objectFit: 'cover' }}
                              />
                            </div>
                          ) : (
                            <div className="w-32 h-32 bg-black/50 rounded-md flex items-center justify-center flex-shrink-0">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                              </svg>
                            </div>
                          )}
                          <div>
                            <h3 className={`text-xl font-bold text-${currentStyle === 'fantasy' ? 'amber' : currentStyle === 'scifi' ? 'cyan' : 'emerald'}-400 mb-1`}>
                              {story.title}
                            </h3>
                            <p className="text-white/80 text-sm mb-2">
                              By {story.authorName} (@{story.authorUsername}) • Shared on {formatDate(story.dateShared)}
                            </p>
                            <p className="text-white/70 mb-3">
                              {story.description || "No description available"}
                            </p>
                            <div className="flex gap-2">
                              <button 
                                className={`${currentSettings.buttonColor} text-white px-4 py-1.5 text-sm rounded-md transition-all ${currentSettings.buttonStyle}`}
                              >
                                Read Story
                              </button>
                              <button 
                                className="bg-white/10 hover:bg-white/20 text-white px-4 py-1.5 text-sm rounded-md transition-all"
                              >
                                Save
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-black/20 rounded-lg">
                    <p className="text-white/70 mb-3">No stories have been shared yet.</p>
                    <p className="text-white/70">Be the first to share your story with the community!</p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <p className="text-white/80 mb-6">
                Please log in or sign up to access the full community features.
              </p>
              <div className="flex justify-center space-x-4">
                <Link 
                  href="/auth" 
                  className={`${currentSettings.buttonColor} text-white px-6 py-2 rounded-md ${currentSettings.buttonStyle} transition-all`}
                >
                  Login
                </Link>
                <Link 
                  href="/auth?signup=true" 
                  className="bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-md transition-all"
                >
                  Sign Up
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`${currentSettings.cardBg || "bg-black/90"} rounded-lg p-6 max-w-md w-full border border-white/10`}>
            <h3 className="text-xl font-bold text-white mb-4">Authentication Required</h3>
            <p className="text-white/70 mb-6">
              You need to be logged in to access all community features. You can still browse the page 
              but full functionality requires an account.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                href="/auth" 
                className={`${currentSettings.buttonColor} text-white px-4 py-2 rounded-md ${currentSettings.buttonStyle} text-center transition-all flex-1`}
                onClick={() => setShowAuthModal(false)}
              >
                Login
              </Link>
              <Link 
                href="/auth?signup=true" 
                className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-md text-center transition-all flex-1"
                onClick={() => setShowAuthModal(false)}
              >
                Sign Up
              </Link>
            </div>
            <button 
              onClick={() => setShowAuthModal(false)}
              className="mt-4 text-white/50 text-sm hover:text-white/80 transition-all w-full"
            >
              Continue Browsing
            </button>
          </div>
        </div>
      )}
    </PageContainer>
  );
} 