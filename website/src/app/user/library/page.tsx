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
        
        {/* Grid View */}
        {!loading && stories.length > 0 && view === 'grid' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStories.map(story => (
              <div 
                key={story.id} 
                className={`rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105 ${
                  currentStyle === 'fantasy' 
                    ? 'bg-amber-950/60 border border-amber-800/40' 
                    : currentStyle === 'scifi' 
                      ? 'bg-cyan-950/60 border border-cyan-800/40' 
                      : 'bg-emerald-950/60 border border-emerald-800/40'
                }`}
              >
                <div className="relative h-48 w-full overflow-hidden">
                  <div 
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-gray-700" 
                    style={{ 
                      backgroundImage: story.coverImage ? `url(${story.coverImage})` : 'none',
                      filter: 'blur(2px)',
                      transform: 'scale(1.1)'
                    }}
                  ></div>
                  <div className="absolute inset-0 bg-black bg-opacity-40"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    {story.coverImage ? (
                      <Image 
                        src={story.coverImage} 
                        alt={story.title} 
                        width={180} 
                        height={240}
                        className="object-cover h-40 shadow-md"
                        style={{ objectFit: 'cover' }}
                      />
                    ) : (
                      <div 
                        className="h-40 w-32 flex items-center justify-center bg-gray-700 shadow-md"
                      >
                        <span className="text-gray-300">No Cover</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold truncate text-white">{story.title}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full ${themeColor} text-white`}>
                      {story.genre}
                    </span>
                  </div>
                  
                  <p className="text-gray-300 text-sm mb-2">
                    By {story.authorName || "Unknown Author"}
                  </p>
                  
                  <p className="text-sm mb-4 line-clamp-2 text-gray-400">{story.excerpt || 'No description available'}</p>
                  
                  <div className="flex justify-between text-sm mb-4 text-gray-400">
                    <span>
                      <svg className="w-4 h-4 inline mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                      </svg>
                      {story.likes}
                    </span>
                    <span>
                      <svg className="w-4 h-4 inline mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path>
                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"></path>
                      </svg>
                      {story.views}
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
        )}
        
        {/* List View (simplified) */}
        {!loading && stories.length > 0 && view === 'list' && (
          <div className={`overflow-hidden rounded-lg shadow ${
            currentStyle === 'fantasy' 
              ? 'bg-amber-950/60' 
              : currentStyle === 'scifi' 
                ? 'bg-cyan-950/60' 
                : 'bg-emerald-950/60'
          }`}>
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-900">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Story
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Author
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Genre
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Stats
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Shared On
                  </th>
                  <th scope="col" className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredStories.map((story, idx) => (
                  <tr key={story.id} className={idx % 2 === 0 ? 'bg-gray-800' : 'bg-gray-900'}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 mr-4">
                          {story.coverImage ? (
                            <Image
                              src={story.coverImage}
                              alt=""
                              width={40}
                              height={40}
                              className="rounded-md object-cover"
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-md bg-gray-700"></div>
                          )}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-white">{story.title}</div>
                          <div className="text-xs truncate max-w-xs text-gray-400">{story.excerpt}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {story.authorName || "Unknown Author"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-xs px-2 py-1 rounded-full ${themeColor} text-white`}>
                        {story.genre}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      <div className="flex space-x-4">
                        <span>
                          <svg className="w-4 h-4 inline mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                          </svg>
                          {story.likes}
                        </span>
                        <span>
                          <svg className="w-4 h-4 inline mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path>
                            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"></path>
                          </svg>
                          {story.views}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      {story.dateShared ? new Date(story.dateShared).toLocaleDateString() : 'Unknown date'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <div className="flex items-center gap-2 justify-end">
                        {story.rating && (
                          <span className={`px-2 py-1 rounded text-xs ${getRatingColor(story.rating)}`}>
                            {story.rating}
                          </span>
                        )}
                        <Link
                          href={`/story/read/${story.id}`}
                          className={`px-3 py-1 rounded-md text-sm transition-colors ${themeColor} ${themeColorHover} text-white`}
                        >
                          Read Story
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
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