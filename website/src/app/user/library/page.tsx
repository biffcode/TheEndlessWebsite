"use client";

import { useState, useEffect } from 'react';
import { useTheme, getStyleSettings } from '@/app/ThemeContext';
import { useAuth } from '@/app/context/AuthContext';
import Image from 'next/image';
import Link from 'next/link';

// Story interface
interface Story {
  id: string;
  title: string;
  excerpt: string;
  genre: string;
  coverImage?: string;
  dateCreated: string;
  lastEdited: string;
  likes: number;
  views: number;
  status: 'completed' | 'in-progress' | 'draft';
  description?: string;
  author?: string;
  authorId?: string;
  authorName?: string;
  authorUsername?: string;
  dateShared?: string;
  isShared?: boolean;
  rating?: 'PG' | 'PG-13' | 'R' | 'X' | 'XXX';
}

export default function CommunityPage() {
  const { currentStyle } = useTheme();
  const { user } = useAuth();
  const styleSettings = getStyleSettings(currentStyle);
  
  const [view, setView] = useState('grid');
  const [filter, setFilter] = useState('all');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [savedStories, setSavedStories] = useState<Set<string>>(new Set());
  
  // State for storing stories
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Determine theme color class based on currentStyle
  const themeColor = currentStyle === 'fantasy' 
    ? 'bg-amber-600' 
    : currentStyle === 'scifi' 
      ? 'bg-cyan-600' 
      : 'bg-emerald-600';
  
  const themeColorHover = currentStyle === 'fantasy' 
    ? 'hover:bg-amber-700' 
    : currentStyle === 'scifi' 
      ? 'hover:bg-cyan-700' 
      : 'hover:bg-emerald-700';

  // Helper function to get rating color based on rating
  const getRatingColor = (rating?: string) => {
    switch(rating) {
      case 'PG': return 'bg-green-500 bg-opacity-20 text-green-300';
      case 'PG-13': return 'bg-blue-500 bg-opacity-20 text-blue-300';
      case 'R': return 'bg-yellow-500 bg-opacity-20 text-yellow-300';
      case 'X': return 'bg-orange-500 bg-opacity-20 text-orange-300';
      case 'XXX': return 'bg-red-500 bg-opacity-20 text-red-300';
      default: return 'bg-gray-500 bg-opacity-20 text-gray-300';
    }
  };

  // Load saved stories on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && user) {
      const savedStoriesJson = localStorage.getItem(`savedStories_${user.id}`);
      if (savedStoriesJson) {
        const stories = JSON.parse(savedStoriesJson);
        setSavedStories(new Set(stories.map((story: any) => story.id)));
      }
    }
  }, [user]);

  // Function to save/unsave a story
  const toggleSaveStory = (story: Story) => {
    if (!user) return;

    const newSavedStories = new Set(savedStories);
    const savedStoriesJson = localStorage.getItem(`savedStories_${user.id}`);
    let savedStoriesArray = savedStoriesJson ? JSON.parse(savedStoriesJson) : [];

    if (newSavedStories.has(story.id)) {
      // Unsave the story
      newSavedStories.delete(story.id);
      savedStoriesArray = savedStoriesArray.filter((s: any) => s.id !== story.id);
    } else {
      // Save the story
      newSavedStories.add(story.id);
      savedStoriesArray.push({
        id: story.id,
        title: story.title,
        author: story.authorName || 'Unknown Author',
        savedAt: new Date().toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'short', 
          day: 'numeric' 
        }),
        progress: 0,
        coverImage: story.coverImage,
        description: story.description || story.excerpt,
        rating: story.rating,
        genre: story.genre
      });
    }

    setSavedStories(newSavedStories);
    localStorage.setItem(`savedStories_${user.id}`, JSON.stringify(savedStoriesArray));

    // Add activity
    const existingActivities = JSON.parse(localStorage.getItem(`activities_${user.id}`) || '[]');
    const newActivity = {
      type: newSavedStories.has(story.id) ? 'story_saved' : 'story_unsaved',
      content: newSavedStories.has(story.id) 
        ? `You saved "${story.title}" by ${story.authorName || 'Unknown Author'} to your library`
        : `You removed "${story.title}" from your saved stories`,
      time: 'Just now'
    };
    const updatedActivities = [newActivity, ...existingActivities].slice(0, 10);
    localStorage.setItem(`activities_${user.id}`, JSON.stringify(updatedActivities));
  };

  // Load stories from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setLoading(true);
      
      try {
        // Get shared stories from localStorage
        const sharedStoriesJson = localStorage.getItem('sharedStories');
        let sharedStories: Story[] = [];
        
        if (sharedStoriesJson) {
          sharedStories = JSON.parse(sharedStoriesJson);
          
          // Map to the community format if needed
          sharedStories = sharedStories.map((story: any) => ({
            id: story.id,
            title: story.title,
            excerpt: story.description || story.excerpt,
            description: story.description,
            genre: story.genre,
            coverImage: story.coverImage || null,
            dateCreated: story.createdAt || story.dateCreated,
            lastEdited: story.lastEdited || story.dateShared,
            likes: story.likes || 0,
            views: story.views || 0,
            status: story.status || 'completed',
            authorId: story.authorId,
            authorName: story.authorName,
            authorUsername: story.authorUsername,
            dateShared: story.dateShared,
            rating: story.rating
          }));
        }
        
        // Set the stories
        setStories(sharedStories);
      } catch (error) {
        console.error("Error loading shared stories:", error);
        setStories([]);
      } finally {
        setLoading(false);
      }
    }
  }, []);
  
  // Filter stories based on the selected filter and search term
  const filteredStories = stories.filter(story => {
    const matchesStatus = filter === 'all' || story.status === filter;
    const matchesRating = ratingFilter === 'all' || story.rating === ratingFilter;
    
    const matchesSearch = searchTerm === '' || 
      story.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (story.excerpt && story.excerpt.toLowerCase().includes(searchTerm.toLowerCase())) ||
      story.genre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (story.authorName && story.authorName.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesStatus && matchesRating && matchesSearch;
  });
  
  return (
    <div className={`min-h-screen p-6 md:p-8 lg:p-10 ${
      currentStyle === 'fantasy' 
        ? 'bg-gradient-to-b from-amber-900/30 to-black/70' 
        : currentStyle === 'scifi' 
          ? 'bg-gradient-to-b from-cyan-900/30 to-black/70' 
          : 'bg-gradient-to-b from-emerald-900/30 to-black/70'
    } text-white`}>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-6">
          Community Stories
        </h1>
        
        {/* Search and Filter Controls - More Compact Design */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-wrap gap-3 items-center">
            {/* Search Bar */}
            <div className="relative w-full md:w-64 lg:w-80">
              <input
                type="text"
                placeholder="Search stories, genres, authors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 pl-10 rounded-lg text-black"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}
              />
              <svg 
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>

            {/* Views Toggle - Compact */}
            <div className="flex border border-white/20 rounded-lg overflow-hidden">
              <button 
                onClick={() => setView('grid')} 
                className={`p-2 ${view === 'grid' ? themeColor : 'bg-black/40'}`}
                title="Grid View"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
                </svg>
              </button>
              <button 
                onClick={() => setView('list')} 
                className={`p-2 ${view === 'list' ? themeColor : 'bg-black/40'}`}
                title="List View"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"></path>
                </svg>
              </button>
            </div>
            
            {/* Clear Filters Button */}
            {(filter !== 'all' || ratingFilter !== 'all' || searchTerm !== '') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilter('all');
                  setRatingFilter('all');
                }}
                className="px-3 py-2 rounded-md text-sm bg-black/40 hover:bg-black/60 text-white flex items-center gap-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Clear Filters
              </button>
            )}
          </div>
          
          {/* Filter Tabs - Compact Horizontal Design */}
          <div className="flex flex-wrap gap-2">
            {/* Status Filter */}
            <div className={`px-3 py-1.5 rounded-md bg-black/40 flex items-center gap-2`}>
              <span className="text-xs text-white/70">Status:</span>
              <div className="flex border border-white/20 rounded-md overflow-hidden">
                <button 
                  onClick={() => setFilter('all')} 
                  className={`px-2 py-1 text-xs ${filter === 'all' ? themeColor : 'bg-transparent'}`}
                >
                  All
                </button>
                <button 
                  onClick={() => setFilter('completed')} 
                  className={`px-2 py-1 text-xs ${filter === 'completed' ? themeColor : 'bg-transparent'}`}
                >
                  Completed
                </button>
                <button 
                  onClick={() => setFilter('in-progress')} 
                  className={`px-2 py-1 text-xs ${filter === 'in-progress' ? themeColor : 'bg-transparent'}`}
                >
                  In Progress
                </button>
              </div>
            </div>
            
            {/* Ratings Filter */}
            <div className={`px-3 py-1.5 rounded-md bg-black/40 flex items-center gap-2`}>
              <span className="text-xs text-white/70">Rating:</span>
              <div className="flex border border-white/20 rounded-md overflow-hidden">
                <button 
                  onClick={() => setRatingFilter('all')} 
                  className={`px-2 py-1 text-xs ${ratingFilter === 'all' ? themeColor : 'bg-transparent'}`}
                >
                  All
                </button>
                <button 
                  onClick={() => setRatingFilter('PG')} 
                  className={`px-2 py-1 text-xs ${ratingFilter === 'PG' ? themeColor : 'bg-transparent'}`}
                >
                  PG
                </button>
                <button 
                  onClick={() => setRatingFilter('PG-13')} 
                  className={`px-2 py-1 text-xs ${ratingFilter === 'PG-13' ? themeColor : 'bg-transparent'}`}
                >
                  PG-13
                </button>
                <button 
                  onClick={() => setRatingFilter('R')} 
                  className={`px-2 py-1 text-xs ${ratingFilter === 'R' ? themeColor : 'bg-transparent'}`}
                >
                  R
                </button>
                <button 
                  onClick={() => setRatingFilter('X')} 
                  className={`px-2 py-1 text-xs ${ratingFilter === 'X' ? themeColor : 'bg-transparent'}`}
                >
                  X
                </button>
                <button 
                  onClick={() => setRatingFilter('XXX')} 
                  className={`px-2 py-1 text-xs ${ratingFilter === 'XXX' ? themeColor : 'bg-transparent'}`}
                >
                  XXX
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Loading state */}
        {loading && (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin h-12 w-12 border-4 border-white border-t-transparent rounded-full"></div>
          </div>
        )}
        
        {/* Story Grid/List View */}
        <div className={`grid ${
          view === 'grid' 
            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' 
            : 'grid-cols-1 gap-4'
        }`}>
          {filteredStories.map(story => (
            <div 
              key={story.id}
              className={`${currentStyle === 'fantasy' 
                ? 'bg-amber-950/60 border border-amber-800/40' 
                : currentStyle === 'scifi' 
                  ? 'bg-cyan-950/60 border border-cyan-800/40' 
                  : 'bg-emerald-950/60 border border-emerald-800/40'
              } rounded-lg overflow-hidden transition-transform hover:-translate-y-1`}
            >
              {/* Story Cover Image */}
              <div className="relative h-48 w-full">
                {story.coverImage ? (
                  <Image
                    src={story.coverImage}
                    alt={story.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                )}
                
                {/* Save Button */}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleSaveStory(story);
                  }}
                  className="absolute top-2 right-2 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
                  title={savedStories.has(story.id) ? "Unsave Story" : "Save Story"}
                >
                  {savedStories.has(story.id) ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                  )}
                </button>
              </div>

              {/* Story Content */}
              <div className="p-4">
                <h3 className="text-lg font-bold mb-2">{story.title}</h3>
                <p className="text-sm text-white/80 mb-3">
                  {story.excerpt?.length > 100 
                    ? story.excerpt.substring(0, 100) + '...' 
                    : story.excerpt}
                </p>
                
                {/* Author and Date */}
                <div className="flex items-center justify-between text-sm text-white/60 mb-3">
                  <span className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    {story.authorName || 'Unknown Author'}
                  </span>
                  <span>
                    <svg className="w-4 h-4 inline mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"></path>
                    </svg>
                    {story.dateShared ? new Date(story.dateShared).toLocaleDateString() : new Date(story.lastEdited).toLocaleDateString()}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex gap-2">
                    <span 
                      className={`px-2 py-1 rounded text-xs ${
                        story.status === 'completed' ? 'bg-green-500 bg-opacity-20 text-green-300' :
                        story.status === 'in-progress' ? 'bg-blue-500 bg-opacity-20 text-blue-300' :
                        'bg-yellow-500 bg-opacity-20 text-yellow-300'
                      }`}
                    >
                      {story.status === 'completed' ? 'Completed' : 
                      story.status === 'in-progress' ? 'In Progress' : 'Draft'}
                    </span>
                    
                    {story.rating && (
                      <span className={`px-2 py-1 rounded text-xs ${getRatingColor(story.rating)}`}>
                        {story.rating}
                      </span>
                    )}
                  </div>
                  
                  <Link
                    href={`/story/read/${story.id}`}
                    className={`px-3 py-1 rounded-md text-sm transition-colors ${themeColor} ${themeColorHover} text-white`}
                  >
                    Read Story
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Empty State */}
        {!loading && stories.length === 0 && (
          <div className={`text-center py-16 rounded-lg ${
            currentStyle === 'fantasy' 
              ? 'bg-amber-950/60 border border-amber-800/40' 
              : currentStyle === 'scifi' 
                ? 'bg-cyan-950/60 border border-cyan-800/40' 
                : 'bg-emerald-950/60 border border-emerald-800/40'
          }`}>
            <svg 
              className="mx-auto h-16 w-16 mb-4 text-gray-400" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
            </svg>
            <h3 className="text-2xl font-medium mb-4">No stories in the community yet</h3>
            <p className="text-lg mb-8 max-w-md mx-auto text-gray-400">
              Be the first to share a story with the community!
            </p>
            <Link
              href="/user/profile"
              className="px-6 py-3 rounded-md text-lg transition-colors inline-block bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              Create A Story
            </Link>
          </div>
        )}
        
        {/* No Results */}
        {!loading && stories.length > 0 && filteredStories.length === 0 && (
          <div className={`text-center py-12 rounded-lg ${
            currentStyle === 'fantasy' 
              ? 'bg-amber-950/60 border border-amber-800/40' 
              : currentStyle === 'scifi' 
                ? 'bg-cyan-950/60 border border-cyan-800/40' 
                : 'bg-emerald-950/60 border border-emerald-800/40'
          }`}>
            <svg 
              className="mx-auto h-12 w-12 mb-4 text-gray-400" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
            </svg>
            <h3 className="text-lg font-medium mb-2">No stories found</h3>
            <p className="text-sm mb-6 text-gray-400">Try adjusting your search or filter criteria</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setFilter('all');
                setRatingFilter('all');
              }}
              className={`px-4 py-2 rounded-md transition-colors ${themeColor} ${themeColorHover} text-white`}
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 