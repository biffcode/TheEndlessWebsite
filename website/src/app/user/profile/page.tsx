"use client";

import { useState, useEffect, FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTheme, getStyleSettings } from "../../ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";

// Define types for stories
interface Story {
  id: string;
  title: string;
  description: string;
  genre: string;
  createdAt: string;
  likes: number;
  isShared?: boolean;
  rating?: 'PG' | 'PG-13' | 'R' | 'X' | 'XXX';
}

// Define types for saved stories
interface SavedStory {
  id: string;
  title: string;
  author: string;
  savedAt: string;
  progress: number;
}

export default function ProfilePage() {
  const { currentStyle, setCurrentStyle } = useTheme();
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const currentSettings = getStyleSettings(currentStyle);
  const [activeTab, setActiveTab] = useState("my-stories");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [storyTitle, setStoryTitle] = useState("");
  const [storyDescription, setStoryDescription] = useState("");
  const [storyGenre, setStoryGenre] = useState("fantasy");
  const [storyRating, setStoryRating] = useState<'PG' | 'PG-13' | 'R' | 'X' | 'XXX'>('PG');
  
  // State for storing user's stories and saved stories
  const [myStories, setMyStories] = useState<Story[]>([]);
  const [savedStories, setSavedStories] = useState<SavedStory[]>([]);
  
  // Add state for story details modal
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedStory, setSelectedStory] = useState<Story | SavedStory | null>(null);
  const [isMyStory, setIsMyStory] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [isStoryShared, setIsStoryShared] = useState(false);
  
  // Load stories from localStorage on component mount
  useEffect(() => {
    // Only run this if we're in the browser and user is authenticated
    if (typeof window !== 'undefined' && user) {
      try {
        // Load user's created stories
        const storedStories = localStorage.getItem(`stories_${user.id}`);
        if (storedStories) {
          setMyStories(JSON.parse(storedStories));
        }
        
        // Load user's saved stories
        const storedSavedStories = localStorage.getItem(`savedStories_${user.id}`);
        if (storedSavedStories) {
          setSavedStories(JSON.parse(storedSavedStories));
        }
      } catch (error) {
        console.error("Error loading stories from localStorage:", error);
      }
    }
  }, [user]);
  
  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth');
    }
  }, [isLoading, isAuthenticated, router]);
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin h-12 w-12 border-4 border-white border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect due to the useEffect
  }

  const handleCreateStory = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Create a new story object
    const newStory: Story = {
      id: `story_${Date.now()}`,
      title: storyTitle,
      description: storyDescription,
      genre: storyGenre,
      rating: storyRating,
      createdAt: new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      }),
      likes: 0
    };
    
    // Add the new story to the state
    const updatedStories = [...myStories, newStory];
    setMyStories(updatedStories);
    
    // Save to localStorage
    if (typeof window !== 'undefined' && user) {
      localStorage.setItem(`stories_${user.id}`, JSON.stringify(updatedStories));
    }
    
    // Reset the form and close the modal
    setShowCreateModal(false);
    setStoryTitle("");
    setStoryDescription("");
    setStoryGenre("fantasy");
    setStoryRating('PG');
    
    // Add a "story created" activity to localStorage
    addActivity({
      type: 'story_created',
      content: `You created a new story: "${newStory.title}"`,
      time: 'Just now'
    });
  };
  
  const addActivity = (activity: { type: string, content: string, time: string }) => {
    try {
      // Get existing activities or initialize empty array
      const existingActivities = JSON.parse(localStorage.getItem(`activities_${user.id}`) || '[]');
      
      // Add new activity at the beginning
      const updatedActivities = [activity, ...existingActivities].slice(0, 10); // Keep only the 10 most recent
      
      // Save back to localStorage
      localStorage.setItem(`activities_${user.id}`, JSON.stringify(updatedActivities));
    } catch (error) {
      console.error("Error updating activities:", error);
    }
  };
  
  // Demo function to save a story (in a real app this would connect to an API)
  const saveStory = (storyId: string, title: string, author: string) => {
    const newSavedStory: SavedStory = {
      id: storyId,
      title: title,
      author: author,
      savedAt: new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      }),
      progress: 0
    };
    
    // Add to saved stories
    const updatedSavedStories = [...savedStories, newSavedStory];
    setSavedStories(updatedSavedStories);
    
    // Save to localStorage
    if (typeof window !== 'undefined' && user) {
      localStorage.setItem(`savedStories_${user.id}`, JSON.stringify(updatedSavedStories));
    }
    
    // Add activity
    addActivity({
      type: 'story_saved',
      content: `You saved "${title}" by ${author} to your community`,
      time: 'Just now'
    });
  };

  // View story details function
  const viewStoryDetails = (story: Story | SavedStory, isUserStory: boolean) => {
    setSelectedStory(story);
    setIsMyStory(isUserStory);
    setShowDetailsModal(true);
  };
  
  // Delete story function
  const deleteStory = (storyId: string) => {
    if (isMyStory) {
      // Delete from my stories
      const updatedStories = myStories.filter(story => story.id !== storyId);
      setMyStories(updatedStories);
      
      // Save to localStorage
      if (typeof window !== 'undefined' && user) {
        localStorage.setItem(`stories_${user.id}`, JSON.stringify(updatedStories));
      }
      
      // Add delete activity
      addActivity({
        type: 'story_deleted',
        content: `You deleted your story "${selectedStory?.title}"`,
        time: 'Just now'
      });
    } else {
      // Delete from saved stories
      const updatedSavedStories = savedStories.filter(story => story.id !== storyId);
      setSavedStories(updatedSavedStories);
      
      // Save to localStorage
      if (typeof window !== 'undefined' && user) {
        localStorage.setItem(`savedStories_${user.id}`, JSON.stringify(updatedSavedStories));
      }
      
      // Add unsave activity
      addActivity({
        type: 'story_unsaved',
        content: `You removed "${selectedStory?.title}" from your saved stories`,
        time: 'Just now'
      });
    }
    
    // Close modals
    setShowDeleteConfirm(false);
    setShowDetailsModal(false);
    setSelectedStory(null);
  };

  // Edit story function - navigate to edit page
  const editStory = (storyId: string) => {
    router.push(`/user/story/edit/${storyId}`);
  };

  // Share story function
  const shareStory = (story: Story) => {
    // Create a copy of the story with shared status
    const sharedStory = {...story, isShared: true};
    
    // Update the story in myStories array
    const updatedStories = myStories.map(s => 
      s.id === story.id ? sharedStory : s
    );
    
    setMyStories(updatedStories);
    
    // Save to localStorage
    if (typeof window !== 'undefined' && user) {
      localStorage.setItem(`stories_${user.id}`, JSON.stringify(updatedStories));
      
      // Also add to shared stories collection
      const sharedStoriesJson = localStorage.getItem('sharedStories');
      let sharedStories = [];
      
      if (sharedStoriesJson) {
        sharedStories = JSON.parse(sharedStoriesJson);
      }
      
      // Add story with user info to shared stories
      sharedStories.push({
        ...sharedStory,
        authorId: user.id,
        authorName: user.name,
        authorUsername: user.username,
        dateShared: new Date().toISOString()
      });
      
      localStorage.setItem('sharedStories', JSON.stringify(sharedStories));
    }
    
    // Add activity
    addActivity({
      type: 'story_shared',
      content: `You shared your story "${story.title}" to the community`,
      time: 'Just now'
    });
    
    setIsStoryShared(true);
    setTimeout(() => {
      setShowShareModal(false);
      setIsStoryShared(false);
    }, 2000);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className={`text-3xl font-bold mb-6 text-white ${currentSettings.subtitleFont}`}>My Profile</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column - Profile Info */}
        <div className={`${currentSettings.cardBg || "bg-black/30"} backdrop-blur-sm rounded-lg p-6 border border-white/10 self-start`}>
          <div className="flex flex-col items-center">
            <div className="relative w-32 h-32 mb-4">
              <div className="rounded-full border-4 border-white/10 bg-gray-700 w-full h-full flex items-center justify-center text-white/50 text-2xl font-bold overflow-hidden">
                {user.profileImage ? (
                  <Image 
                    src={user.profileImage} 
                    alt={`${user.name}'s Profile`}
                    className="object-cover"
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center">
                    {user.name.charAt(0)}
                  </div>
                )}
              </div>
            </div>
            <h2 className="text-xl font-bold text-white mb-1">{user.name}</h2>
            <p className="text-white/70 mb-3">@{user.username}</p>
            <div className={`px-3 py-1 rounded-full ${user.premium ? currentSettings.buttonColor : 'bg-gray-600'} text-xs text-white font-bold mb-4 flex items-center gap-1`}>
              {user.premium ? (
                <>
                  <span className="text-yellow-300">★</span> Premium Member
                </>
              ) : (
                'Free Member'
              )}
            </div>
          </div>
          
          <div className="mt-6 space-y-3">
            <div className="flex justify-between py-2 border-b border-white/10">
              <span className="text-white/70">Stories Created</span>
              <span className="text-white font-medium">{myStories.length}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-white/10">
              <span className="text-white/70">Gems</span>
              <span className="text-white font-medium">{user.gems}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-white/10">
              <span className="text-white/70">Followers</span>
              <span className="text-white font-medium">0</span>
            </div>
            <div className="flex justify-between py-2 border-b border-white/10">
              <span className="text-white/70">Member Since</span>
              <span className="text-white font-medium">{user.memberSince}</span>
            </div>
          </div>
          
          <div className="mt-6 space-y-3">
            <Link 
              href="/user/profile/edit" 
              className={`w-full ${currentSettings.buttonColor} text-white px-4 py-2 rounded-md ${currentSettings.buttonStyle} transition-all flex justify-center items-center`}
            >
              Edit Profile
            </Link>
            <Link 
              href="/user/settings"
              className="w-full bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-md transition-all flex justify-center items-center"
            >
              Account Settings
            </Link>
          </div>
        </div>
        
        {/* Right Column - Content Tabs */}
        <div className={`${currentSettings.cardBg || "bg-black/30"} backdrop-blur-sm rounded-lg p-6 border border-white/10 md:col-span-2`}>
          {/* Tabs Navigation */}
          <div className="flex border-b border-white/10 mb-6">
            <button 
              onClick={() => setActiveTab('my-stories')}
              className={`px-4 py-2 text-sm font-medium transition-colors relative ${
                activeTab === 'my-stories' 
                  ? `text-${currentStyle === 'fantasy' ? 'amber' : currentStyle === 'scifi' ? 'cyan' : 'emerald'}-400` 
                  : 'text-white/70 hover:text-white'
              }`}
            >
              My Stories
              {activeTab === 'my-stories' && (
                <span className={`absolute bottom-0 left-0 w-full h-0.5 ${currentSettings.buttonColor}`}></span>
              )}
            </button>
            <button 
              onClick={() => setActiveTab('saved-stories')}
              className={`px-4 py-2 text-sm font-medium transition-colors relative ${
                activeTab === 'saved-stories' 
                  ? `text-${currentStyle === 'fantasy' ? 'amber' : currentStyle === 'scifi' ? 'cyan' : 'emerald'}-400` 
                  : 'text-white/70 hover:text-white'
              }`}
            >
              Saved Stories
              {activeTab === 'saved-stories' && (
                <span className={`absolute bottom-0 left-0 w-full h-0.5 ${currentSettings.buttonColor}`}></span>
              )}
            </button>
            <button 
              onClick={() => setActiveTab('activity')}
              className={`px-4 py-2 text-sm font-medium transition-colors relative ${
                activeTab === 'activity' 
                  ? `text-${currentStyle === 'fantasy' ? 'amber' : currentStyle === 'scifi' ? 'cyan' : 'emerald'}-400` 
                  : 'text-white/70 hover:text-white'
              }`}
            >
              Recent Activity
              {activeTab === 'activity' && (
                <span className={`absolute bottom-0 left-0 w-full h-0.5 ${currentSettings.buttonColor}`}></span>
              )}
            </button>
          </div>
          
          {/* My Stories Tab */}
          {activeTab === 'my-stories' && (
            <div className="space-y-4">
              {/* Create Story Button */}
              <button
                onClick={() => setShowCreateModal(true)}
                className={`w-full ${currentSettings.buttonColor} text-white px-4 py-3 rounded-lg transition-all hover:scale-[1.02] flex items-center justify-center gap-2`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span className="font-medium">Create New Story</span>
              </button>
              
              {/* Display user's stories or empty state */}
              {myStories.length > 0 ? (
                <div className="space-y-4">
                  {myStories.map(story => (
                    <div 
                      key={story.id} 
                      className={`bg-black/20 rounded-lg p-4 border border-white/5 transition-transform hover:-translate-y-1 cursor-pointer`}
                      onClick={() => viewStoryDetails(story, true)}
                    >
                <h3 className={`text-lg font-bold mb-2 text-${currentStyle === 'fantasy' ? 'amber' : currentStyle === 'scifi' ? 'cyan' : 'emerald'}-400`}>
                        {story.title}
                </h3>
                      <p className="text-white/80 mb-3">{story.description}</p>
                <div className="flex justify-between text-sm text-white/60">
                        <span>Created: {story.createdAt}</span>
                        <span>❤️ {story.likes} Likes</span>
                </div>
              </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 bg-black/20 rounded-lg border border-white/5 text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-white/30 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <h3 className="text-xl font-bold text-white mb-2">You haven't created any stories yet</h3>
                  <p className="text-white/70 max-w-md mb-6">Start your creative journey by crafting your first story. Click the "Create New Story" button to begin.</p>
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className={`${currentSettings.buttonColor} text-white px-6 py-2 rounded-md transition-all hover:scale-105`}
                  >
                    Create Your First Story
                  </button>
                </div>
              )}
            </div>
          )}
          
          {/* Saved Stories Tab */}
          {activeTab === 'saved-stories' && (
            <div className="space-y-4">
              {/* Display saved stories or empty state */}
              {savedStories.length > 0 ? (
                <div className="space-y-4">
                  {savedStories.map(savedStory => (
                    <div 
                      key={savedStory.id} 
                      className={`bg-black/20 rounded-lg p-4 border border-white/5 transition-transform hover:-translate-y-1 cursor-pointer`}
                      onClick={() => viewStoryDetails(savedStory, false)}
                    >
                <h3 className={`text-lg font-bold mb-2 text-${currentStyle === 'fantasy' ? 'amber' : currentStyle === 'scifi' ? 'cyan' : 'emerald'}-400`}>
                        {savedStory.title}
                </h3>
                      <p className="text-white/80 mb-3">By {savedStory.author}</p>
                <div className="flex justify-between text-sm text-white/60">
                        <span>Saved: {savedStory.savedAt}</span>
                        <span>{savedStory.progress}% Complete</span>
                </div>
              </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 bg-black/20 rounded-lg border border-white/5 text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-white/30 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                  <h3 className="text-xl font-bold text-white mb-2">No saved stories</h3>
                  <p className="text-white/70 max-w-md mb-6">You haven't saved any stories yet. Explore stories from other creators and save them to continue your reading journey later.</p>
                  <Link
                    href="/user/library"
                    className={`${currentSettings.buttonColor} text-white px-6 py-2 rounded-md transition-all hover:scale-105`}
                  >
                    Explore Stories
                  </Link>
                </div>
              )}
            </div>
          )}
          
          {/* Activity Tab */}
          {activeTab === 'activity' && (
            <div className="space-y-4">
              {/* Account creation activity */}
              <div className={`bg-black/20 rounded-lg p-4 border border-white/5`}>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white">You created your account</p>
                    <p className="text-white/60 text-sm mt-1">Just now</p>
                  </div>
                </div>
              </div>
              
              {/* Demo button to save a story (for testing purposes) */}
              {savedStories.length === 0 && (
                <button
                  onClick={() => saveStory('demo_story_1', 'The Enchanted Forest', 'Maria Lightweaver')}
                  className="w-full mt-4 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-md transition-all"
                >
                  Demo: Save a story to your community
                </button>
              )}
              
              {/* Empty state - additional information */}
              <div className="mt-6 text-center px-4 py-6 bg-black/10 rounded-lg border border-white/5">
                <p className="text-white/70">Your recent activities will appear here as you interact with the platform</p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Story Details Modal */}
      {showDetailsModal && selectedStory && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
          <div 
            className={`${currentSettings.cardBg || "bg-black/80"} backdrop-blur-md rounded-lg p-6 border border-white/20 max-w-2xl w-full animate-scale-in`}
            style={{ animation: 'scale-in 0.2s ease-out' }}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className={`text-2xl font-bold text-white ${currentSettings.subtitleFont}`}>Story Details</h2>
              <button 
                onClick={() => setShowDetailsModal(false)}
                className="text-white/60 hover:text-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
              </button>
            </div>
            
            <div className="mb-6">
              <h3 className={`text-xl font-bold mb-2 text-${currentStyle === 'fantasy' ? 'amber' : currentStyle === 'scifi' ? 'cyan' : 'emerald'}-400`}>
                {selectedStory.title}
              </h3>
              
              {'author' in selectedStory ? (
                <p className="text-white/80 mb-2">By {selectedStory.author}</p>
              ) : (
                <div className={`inline-block px-2 py-1 rounded text-xs mb-2 ${
                  currentStyle === 'fantasy' ? 'bg-amber-500/20 text-amber-300' :
                  currentStyle === 'scifi' ? 'bg-cyan-500/20 text-cyan-300' :
                  'bg-emerald-500/20 text-emerald-300'
                }`}>
                  {selectedStory.genre}
                  </div>
              )}
              
              <p className="text-white/90 mt-4">
                {'description' in selectedStory ? selectedStory.description : 'No description available'}
              </p>
              
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="bg-black/30 p-3 rounded-lg">
                  <span className="text-white/60 text-sm block mb-1">
                    {isMyStory ? 'Created on:' : 'Saved on:'}
                  </span>
                  <span className="text-white font-medium">
                    {isMyStory ? 
                      (selectedStory as Story).createdAt : 
                      (selectedStory as SavedStory).savedAt
                    }
                  </span>
                  </div>
                
                <div className="bg-black/30 p-3 rounded-lg">
                  <span className="text-white/60 text-sm block mb-1">
                    {isMyStory ? 'Likes:' : 'Progress:'}
                  </span>
                  <span className="text-white font-medium">
                    {isMyStory ? 
                      `${(selectedStory as Story).likes} ❤️` : 
                      `${(selectedStory as SavedStory).progress}%`
                    }
                  </span>
                </div>
              </div>
              
              {isMyStory && (
                <div className="mt-4 bg-black/30 p-3 rounded-lg">
                  <span className="text-white/60 text-sm block mb-1">
                    Status:
                  </span>
                  <span className="text-white font-medium flex items-center">
                    {(selectedStory as Story).isShared ? (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Shared to Community
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                        Not Shared Yet
                      </>
                    )}
                  </span>
                </div>
              )}
              </div>
              
            <div className="flex justify-end gap-3 mt-8">
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-md transition"
              >
                {isMyStory ? 'Delete Story' : 'Remove from Saved'}
              </button>
              
              {isMyStory && !(selectedStory as Story).isShared && (
                <button
                  onClick={() => {
                    setShowDetailsModal(false);
                    setShowShareModal(true);
                  }}
                  className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-md transition"
                >
                  Share to Community
                </button>
              )}
              
              <button
                onClick={() => {
                  if (isMyStory) {
                    editStory(selectedStory.id);
                  } else {
                    // Continue reading
                  }
                }}
                className={`px-5 py-2 ${currentSettings.buttonColor} text-white rounded-md transition hover:scale-105`}
              >
                {isMyStory ? 'Edit Story' : 'Continue Reading'}
              </button>
            </div>
                  </div>
                  </div>
      )}
      
      {/* Share Story Modal */}
      {showShareModal && selectedStory && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
          <div className={`${currentSettings.cardBg || "bg-black/80"} backdrop-blur-md rounded-lg p-6 border border-white/20 max-w-md w-full animate-scale-in`}>
            {!isStoryShared ? (
              <>
                <h2 className={`text-2xl font-bold text-white mb-6 ${currentSettings.subtitleFont}`}>Share Story to Community</h2>
                <p className="text-white/90 mb-6">
                  Sharing your story "{selectedStory.title}" will make it available in the public community for other users to read. Are you sure you want to share it?
                </p>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setShowShareModal(false)}
                    className="px-5 py-2 bg-white/10 hover:bg-white/20 text-white rounded-md transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => shareStory(selectedStory as Story)}
                    className={`px-5 py-2 ${currentSettings.buttonColor} text-white rounded-md transition hover:scale-105`}
                  >
                    Share Story
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-16 w-16 text-green-400 mb-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <h3 className="text-xl font-bold text-white mb-2">Story Shared!</h3>
                <p className="text-white/80">
                  Your story is now available in the public community for others to read
                </p>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && selectedStory && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 px-4">
          <div className="bg-black/90 backdrop-blur-md rounded-lg p-6 border border-white/20 max-w-md w-full animate-scale-in">
            <h2 className="text-xl font-bold text-white mb-4">Confirm {isMyStory ? 'Deletion' : 'Remove'}</h2>
            <p className="text-white/90 mb-6">
              {isMyStory ? 
                `Are you sure you want to delete "${selectedStory.title}"? This action cannot be undone.` : 
                `Are you sure you want to remove "${selectedStory.title}" from your saved stories?`
              }
            </p>
            
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-5 py-2 bg-white/10 hover:bg-white/20 text-white rounded-md transition"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteStory(selectedStory.id)}
                className="px-5 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition"
              >
                {isMyStory ? 'Delete' : 'Remove'}
              </button>
            </div>
              </div>
            </div>
          )}
      
      {/* Create Story Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
          <div className={`${currentSettings.cardBg || "bg-black/80"} backdrop-blur-md rounded-lg p-6 border border-white/20 max-w-lg w-full animate-scale-in`}
            style={{ animation: 'scale-in 0.2s ease-out' }}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className={`text-2xl font-bold text-white ${currentSettings.subtitleFont}`}>Create New Story</h2>
              <button 
                onClick={() => setShowCreateModal(false)}
                className="text-white/60 hover:text-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleCreateStory} className="space-y-4">
              <div>
                <label htmlFor="storyTitle" className="block text-white mb-2">Story Title</label>
                <input
                  id="storyTitle"
                  type="text"
                  value={storyTitle}
                  onChange={(e) => setStoryTitle(e.target.value)}
                  placeholder="Enter a captivating title..."
                  className="w-full bg-black/30 border border-white/20 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-white/30"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="storyDescription" className="block text-white mb-2">Brief Description</label>
                <textarea
                  id="storyDescription"
                  value={storyDescription}
                  onChange={(e) => setStoryDescription(e.target.value)}
                  placeholder="Describe your story in a few sentences..."
                  className="w-full bg-black/30 border border-white/20 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-white/30 min-h-[100px]"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="storyGenre" className="block text-white mb-2">Genre</label>
                <select
                  id="storyGenre"
                  value={storyGenre}
                  onChange={(e) => setStoryGenre(e.target.value)}
                  className="w-full bg-black/30 border border-white/20 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-white/30"
                >
                  <option value="fantasy">Fantasy</option>
                  <option value="scifi">Science Fiction</option>
                  <option value="mystery">Mystery</option>
                  <option value="romance">Romance</option>
                  <option value="horror">Horror</option>
                  <option value="adventure">Adventure</option>
                  <option value="historical">Historical</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="storyRating" className="block text-white mb-2">Content Rating</label>
                <select
                  id="storyRating"
                  value={storyRating}
                  onChange={(e) => setStoryRating(e.target.value as 'PG' | 'PG-13' | 'R' | 'X' | 'XXX')}
                  className="w-full bg-black/30 border border-white/20 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-white/30"
                >
                  <option value="PG">PG - Suitable for all ages</option>
                  <option value="PG-13">PG-13 - Some mature themes</option>
                  <option value="R">R - Mature themes and content</option>
                  <option value="X">X - Explicit content</option>
                  <option value="XXX">XXX - Extremely explicit content</option>
                </select>
              </div>
              
              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-5 py-2 bg-white/10 hover:bg-white/20 text-white rounded-md transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-5 py-2 ${currentSettings.buttonColor} text-white rounded-md transition hover:scale-105`}
                >
                  Create Story
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 