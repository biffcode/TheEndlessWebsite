"use client";

import React, { useState, useEffect } from 'react';
import Image from "next/image";
import Link from "next/link";
import { useTheme, getStyleSettings } from "../ThemeContext";
import { useAuth } from "../context/AuthContext";
import PageContainer from "../components/PageContainer";

export default function CommunityStoriesPage() {
  const { currentStyle } = useTheme();
  const currentSettings = getStyleSettings(currentStyle);
  const { isAuthenticated, user } = useAuth();
  const [sharedStories, setSharedStories] = useState<any[]>([]);
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterRating, setFilterRating] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid"); // "grid" or "list"

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
                dateShared: ref.dateShared || new Date().toISOString(),
                status: fullStory.status || "In Progress",
                rating: fullStory.rating || "PG"
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
            
            // If we couldn't find the full story, create a simplified version with placeholder data
            return {
              id: ref.id,
              title: ref.title || "Unknown Title",
              authorName: ref.authorName || "Unknown Author",
              authorUsername: ref.authorUsername || "unknown",
              dateShared: ref.dateShared || new Date().toISOString(),
              description: ref.description || "A shared story from the community.",
              genre: ref.genre || "fantasy",
              status: ref.status || "In Progress",
              rating: ref.rating || "PG",
              coverImage: genreImages[ref.genre?.toLowerCase()] || genreImages.default
            };
          });
          
          console.log("Loaded stories:", loadedStories.length);
          setSharedStories(loadedStories);
          return;
        }
        
        // If no shared stories, create demo stories
        console.log("No shared stories found, creating demo data");
        const demoStories = [
          {
            id: "demo1",
            title: "The Lost Kingdom",
            authorName: "Jane Writer",
            authorUsername: "janewriter",
            dateShared: new Date().toISOString(),
            description: "An epic tale of adventure in a forgotten realm, where magic and mystery await at every turn.",
            genre: "fantasy",
            coverImage: "/images/community/community1.jpg",
            rating: "PG",
            status: "Completed"
          },
          {
            id: "demo2",
            title: "Starship Odyssey",
            authorName: "Alex Scribe",
            authorUsername: "alexscribe",
            dateShared: new Date(Date.now() - 86400000).toISOString(), // Yesterday
            description: "A journey through the cosmos aboard the most advanced vessel ever created by humanity.",
            genre: "scifi",
            coverImage: "/images/community/community3.jpg",
            rating: "PG-13",
            status: "In Progress"
          },
          {
            id: "demo3",
            title: "Whispers in the Dark",
            authorName: "Sam Storyteller",
            authorUsername: "samstory",
            dateShared: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
            description: "A spine-tingling mystery set in a small town where nothing is as it seems.",
            genre: "mystery",
            coverImage: "/images/community/community5.jpg",
            rating: "R",
            status: "Completed"
          }
        ];
        
        setSharedStories(demoStories);
      } catch (error) {
        console.error("Error loading shared stories:", error);
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
  
  // Filter stories based on current filters
  const getFilteredStories = () => {
    return sharedStories.filter(story => {
      // Filter by status
      if (filterStatus !== "All" && story.status !== filterStatus) {
        return false;
      }
      
      // Filter by rating
      if (filterRating !== "All" && story.rating !== filterRating) {
        return false;
      }
      
      // Filter by search query
      if (searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase();
        return (
          story.title?.toLowerCase().includes(query) ||
          story.authorName?.toLowerCase().includes(query) ||
          story.description?.toLowerCase().includes(query) ||
          story.genre?.toLowerCase().includes(query)
        );
      }
      
      return true;
    });
  };
  
  const filteredStories = getFilteredStories();

  return (
    <PageContainer title="Community Stories" showThemeSwitcher={false}>
      <div className="max-w-6xl mx-auto px-4">
        <div className={`${currentSettings.cardBg || "bg-black/30"} backdrop-blur-sm rounded-lg p-6 border border-white/10 mb-8`}>
          {/* Search and Filter Bar */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              {/* Search Input */}
              <div className="flex-grow relative">
                <input
                  type="text"
                  placeholder="Search stories, genres, authors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 text-white rounded-md px-10 py-2 focus:outline-none focus:ring-2 focus:ring-white/30"
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
              
              {/* View Mode Toggle */}
              <div className="flex items-center gap-2 bg-black/50 rounded-md border border-white/10 p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded ${viewMode === "grid" ? "bg-white/20" : ""}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zm-10 10a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded ${viewMode === "list" ? "bg-white/20" : ""}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>
            
            {/* Filters */}
            <div className="flex flex-wrap gap-4">
              {/* Status Filter */}
              <div className="flex items-center">
                <span className="text-white/70 mr-2 text-sm">Status:</span>
                <div className="flex items-center space-x-1 bg-black/40 rounded-md overflow-hidden">
                  {["All", "Completed", "In Progress"].map(status => (
                    <button
                      key={status}
                      onClick={() => setFilterStatus(status)}
                      className={`px-3 py-1 text-xs ${
                        filterStatus === status 
                          ? `bg-${currentStyle === 'fantasy' ? 'amber' : currentStyle === 'scifi' ? 'cyan' : 'emerald'}-500/30 text-white` 
                          : 'text-white/70 hover:bg-white/10'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Rating Filter */}
              <div className="flex items-center">
                <span className="text-white/70 mr-2 text-sm">Rating:</span>
                <div className="flex items-center space-x-1 bg-black/40 rounded-md overflow-hidden">
                  {["All", "PG", "PG-13", "R", "X", "XXX"].map(rating => (
                    <button
                      key={rating}
                      onClick={() => setFilterRating(rating)}
                      className={`px-3 py-1 text-xs ${
                        filterRating === rating 
                          ? `bg-${currentStyle === 'fantasy' ? 'amber' : currentStyle === 'scifi' ? 'cyan' : 'emerald'}-500/30 text-white` 
                          : 'text-white/70 hover:bg-white/10'
                      }`}
                    >
                      {rating}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Stories Display */}
          {filteredStories.length > 0 ? (
            <>
              {viewMode === "grid" ? (
                // Grid View
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredStories.map(story => (
                    <div 
                      key={story.id} 
                      className="bg-black/40 rounded-lg overflow-hidden border border-white/5 transition-all hover:-translate-y-1 hover:shadow-lg"
                    >
                      {/* Cover Image */}
                      <div className="h-48 relative">
                        <Image 
                          src={story.coverImage || "/images/community/community2.jpg"} // Fallback image
                          alt={story.title}
                          fill
                          className="object-cover"
                          unoptimized={true} // Important for data URLs
                        />
                        {/* Save Button */}
                        <button className="absolute top-2 right-2 bg-black/50 p-2 rounded-full text-white hover:bg-black/70 transition-colors">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                          </svg>
                        </button>
                      </div>
                      
                      {/* Content */}
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            story.status === "Completed" 
                              ? "bg-green-500/20 text-green-300" 
                              : "bg-yellow-500/20 text-yellow-300"
                          }`}>
                            {story.status || "In Progress"}
                          </span>
                          
                          <span className="text-xs px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">
                            {story.rating || "PG"}
                          </span>
                        </div>
                        
                        <h3 className={`text-lg font-bold text-${currentStyle === 'fantasy' ? 'amber' : currentStyle === 'scifi' ? 'cyan' : 'emerald'}-400 mb-1 line-clamp-1`}>
                          {story.title}
                        </h3>
                        
                        <p className="text-white/80 text-xs mb-2">
                          By {story.authorName} • {formatDate(story.dateShared)}
                        </p>
                        
                        <p className="text-white/70 text-sm mb-4 line-clamp-2">
                          {story.description || "No description available"}
                        </p>
                        
                        <Link 
                          href={`/story/read/${story.id}`}
                          className={`w-full ${currentSettings.buttonColor} text-white px-4 py-2 rounded-md text-sm ${currentSettings.buttonStyle} transition-all inline-block text-center`}
                        >
                          Read Story
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                // List View
                <div className="space-y-4">
                  {filteredStories.map(story => (
                    <div 
                      key={story.id} 
                      className="bg-black/40 rounded-lg p-4 border border-white/5 transition-all hover:-translate-y-1 hover:shadow-lg"
                    >
                      <div className="flex gap-4">
                        {/* Cover Image */}
                        <div className="w-32 h-32 relative flex-shrink-0 rounded-md overflow-hidden">
                          <Image 
                            src={story.coverImage || "/images/community/community2.jpg"} // Fallback image
                            alt={story.title}
                            fill
                            className="object-cover"
                            unoptimized={true} // Important for data URLs
                          />
                        </div>
                        
                        <div className="flex-grow">
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                              story.status === "Completed" 
                                ? "bg-green-500/20 text-green-300" 
                                : "bg-yellow-500/20 text-yellow-300"
                            }`}>
                              {story.status || "In Progress"}
                            </span>
                            
                            <span className="text-xs px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">
                              {story.rating || "PG"}
                            </span>
                          </div>
                          
                          <h3 className={`text-xl font-bold text-${currentStyle === 'fantasy' ? 'amber' : currentStyle === 'scifi' ? 'cyan' : 'emerald'}-400 mb-1`}>
                            {story.title}
                          </h3>
                          
                          <p className="text-white/80 text-sm mb-2">
                            By {story.authorName} • {formatDate(story.dateShared)}
                          </p>
                          
                          <p className="text-white/70 mb-3">
                            {story.description || "No description available"}
                          </p>
                          
                          <div className="flex gap-2">
                            <Link 
                              href={`/story/read/${story.id}`}
                              className={`${currentSettings.buttonColor} text-white px-4 py-1.5 text-sm rounded-md transition-all ${currentSettings.buttonStyle} inline-block text-center`}
                            >
                              Read Story
                            </Link>
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
              )}
            </>
          ) : (
            <div className="text-center py-12 bg-black/20 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-white/30 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <p className="text-white/70 mb-3">No stories match your search criteria</p>
              <p className="text-white/70 mb-6">Try adjusting your filters or search query</p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setFilterStatus("All");
                  setFilterRating("All");
                }}
                className={`${currentSettings.buttonColor} text-white px-6 py-2 rounded-md ${currentSettings.buttonStyle} transition-all`}
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
        
        {/* Link back to main community page */}
        <div className="mt-6 text-center">
          <Link 
            href="/community" 
            className={`${currentSettings.buttonColor} text-white px-6 py-2 rounded-md ${currentSettings.buttonStyle} transition-all inline-block`}
          >
            Back to Community
          </Link>
        </div>
      </div>
    </PageContainer>
  );
} 