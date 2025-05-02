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
  coverImage?: string;
}

// Define types for saved stories
interface SavedStory {
  id: string;
  title: string;
  author: string;
  savedAt: string;
  progress: number;
  coverImage?: string;
  description?: string;
  rating?: 'PG' | 'PG-13' | 'R' | 'X' | 'XXX';
  genre?: string;
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
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverImagePreview, setCoverImagePreview] = useState<string>("");
  
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
  const [shareError, setShareError] = useState('');
  
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

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCoverImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

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
      likes: 0,
      coverImage: coverImagePreview || undefined
    };
    
    // Add the new story to the state
    const updatedStories = [...myStories, newStory];
    setMyStories(updatedStories);
    
    // Save to localStorage
    if (typeof window !== 'undefined' && user) {
      localStorage.setItem(`stories_${user.id}`, JSON.stringify(updatedStories));
    }
    
    // Reset the form and close the modal
    setStoryTitle("");
    setStoryDescription("");
    setStoryGenre("fantasy");
    setStoryRating('PG');
    setCoverImage(null);
    setCoverImagePreview("");
    
    // Make sure the modal is closed
    setShowCreateModal(false);
    
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

  // Helper function to clean up data before storing to avoid quota issues
  const cleanStoryForStorage = (story: any) => {
    // Create a clean copy without any potentially large properties
    const cleanStory = { ...story };
    
    // If there's a coverImage that's a data URL (likely large), compress it instead of removing
    if (cleanStory.coverImage && cleanStory.coverImage.startsWith('data:')) {
      try {
        // For synchronous operations, we need to use a different approach
        // since Image loading is async in nature
        
        // This approach creates a downscaled version without needing to load the image first
        // Reduce quality by encoding to JPEG with lower quality
        if (cleanStory.coverImage.length > 100000) { // If larger than ~100KB
          // Simple data URL truncation (rough approach)
          // For a truly good solution, we should use something like createImageBitmap
          // But let's keep it simple by just storing a placeholder
          
          // Keep the cover image reference but avoid storing the actual data
          delete cleanStory.coverImage;
          cleanStory.hadCoverImage = true;
          cleanStory.coverImageType = 'placeholder';
        }
      } catch (error) {
        console.error("Error handling image:", error);
        // Fallback to removing the image if processing fails
        delete cleanStory.coverImage;
        cleanStory.hadCoverImage = true;
      }
    }
    
    // Truncate description if too long (over 1000 chars)
    if (cleanStory.description && cleanStory.description.length > 1000) {
      cleanStory.description = cleanStory.description.substring(0, 1000) + '...';
    }
    
    return cleanStory;
  };

  // Share story function
  const shareStory = (story: Story) => {
    console.log("Share story called with:", story.title);
    setShareError(''); // Clear any previous errors
    
    try {
      // Create a copy of the story with shared status
      const sharedStory = {...story, isShared: true};
      
      // Update the story in myStories array
      const updatedStories = myStories.map(s => 
        s.id === story.id ? sharedStory : s
      );
      
      setMyStories(updatedStories);
      console.log("Updated stories in state");
      
      // Save to localStorage - wrapped in try/catch to handle quota errors
      if (typeof window !== 'undefined' && user) {
        try {
          localStorage.setItem(`stories_${user.id}`, JSON.stringify(updatedStories));
          console.log("Saved updated stories to localStorage");
          
          // Save in old format for backward compatibility
          try {
            // Get existing shared stories
            const sharedStoriesJson = localStorage.getItem('sharedStories');
            let sharedStories = [];
            
            if (sharedStoriesJson) {
              sharedStories = JSON.parse(sharedStoriesJson);
            }
            
            // Prepare full story with author info
            const fullSharedStory = {
              ...sharedStory,
              authorId: user.id,
              authorName: user.name,
              authorUsername: user.username,
              dateShared: new Date().toISOString()
            };
            
            // Process cover image if it exists
            if (fullSharedStory.coverImage && 
                typeof fullSharedStory.coverImage === 'string') {
              
              // If it's a data URL and very large, we need to optimize it
              if (fullSharedStory.coverImage.startsWith('data:') && 
                  fullSharedStory.coverImage.length > 50000) {
                
                console.log("Cover image is large, attempting to create a smaller version");
                
                try {
                  // Create a smaller version of the image (low quality but visible)
                  const canvas = document.createElement('canvas');
                  const img = new Image();
                  
                  // Setting up a promise to handle the async image loading
                  const smallerImagePromise = new Promise<string>((resolve, reject) => {
                    img.onload = () => {
                      // Downscale to a smaller size (thumbnail)
                      const maxWidth = 200;
                      const maxHeight = 200;
                      let width = img.width;
                      let height = img.height;
                      
                      if (width > height) {
                        if (width > maxWidth) {
                          height = Math.round(height * maxWidth / width);
                          width = maxWidth;
                        }
                      } else {
                        if (height > maxHeight) {
                          width = Math.round(width * maxHeight / height);
                          height = maxHeight;
                        }
                      }
                      
                      canvas.width = width;
                      canvas.height = height;
                      
                      const ctx = canvas.getContext('2d');
                      if (ctx) {
                        ctx.drawImage(img, 0, 0, width, height);
                        // Generate a low quality JPEG data URL
                        const smallerImageDataUrl = canvas.toDataURL('image/jpeg', 0.5);
                        resolve(smallerImageDataUrl);
                      } else {
                        // Fallback if canvas context fails
                        console.error("Could not get canvas context");
                        reject('');
                      }
                    };
                    
                    img.onerror = () => {
                      console.error("Failed to load image");
                      reject('');
                    };
                    
                    // Start loading the image
                    img.src = fullSharedStory.coverImage as string;
                  });
                  
                  // Wait for the image processing to complete
                  smallerImagePromise.then(smallerImage => {
                    if (smallerImage) {
                      fullSharedStory.coverImage = smallerImage;
                      console.log("Successfully created smaller cover image version");
                    } else {
                      // If the process failed, use a genre-based placeholder
                      const genreImages: {[key: string]: string} = {
                        fantasy: "/images/community/community1.jpg",
                        scifi: "/images/community/community3.jpg",
                        mystery: "/images/community/community5.jpg",
                        horror: "/images/community/community4.jpg",
                        default: "/images/community/community2.jpg"
                      };
                      fullSharedStory.coverImage = genreImages[fullSharedStory.genre?.toLowerCase()] || genreImages.default;
                    }
                    
                    // Now that we have processed the image, add to shared stories
                    addToSharedStories(sharedStories, fullSharedStory);
                  });
                  
                  // Continue execution without waiting - we'll add story reference first
                } catch (imgError) {
                  console.error("Error processing image:", imgError);
                  // If image processing fails, remove it and use genre-based placeholder
                  const genreImages: {[key: string]: string} = {
                    fantasy: "/images/community/community1.jpg",
                    scifi: "/images/community/community3.jpg",
                    mystery: "/images/community/community5.jpg",
                    horror: "/images/community/community4.jpg",
                    default: "/images/community/community2.jpg"
                  };
                  fullSharedStory.coverImage = genreImages[fullSharedStory.genre?.toLowerCase()] || genreImages.default;
                  
                  // Add to shared stories since we're not waiting for async
                  addToSharedStories(sharedStories, fullSharedStory);
                }
              } else {
                // Image is small enough to keep as is
                // Add story to shared stories collection
                addToSharedStories(sharedStories, fullSharedStory);
              }
            } else {
              // No cover image, add to shared stories
              addToSharedStories(sharedStories, fullSharedStory);
            }
          } catch (error) {
            console.error("Error saving in old format:", error);
          }
          
          // Also save in new reference format (this is always done regardless of image processing)
          try {
            saveStoryReference(story);
          } catch (error) {
            console.error("Error saving story reference:", error);
          }
        } catch (error) {
          console.error("LocalStorage error:", error);
          // Continue execution even if localStorage fails
          // The story will still be shared in the UI
        }
      }
      
      // Add activity - also wrapped in try/catch
      try {
        addActivity({
          type: 'story_shared',
          content: `You shared your story "${story.title}" to the community`,
          time: 'Just now'
        });
        console.log("Added share activity");
      } catch (error) {
        console.error("Activity logging error:", error);
      }
      
      // Set shared status to show success message - always do this regardless of storage errors
      setIsStoryShared(true);
      console.log("Set isStoryShared to true");
      
      // Close modal after a delay
      setTimeout(() => {
        console.log("Timeout callback executed - closing share modal");
        setShowShareModal(false);
        setIsStoryShared(false);
      }, 2000);
    } catch (error) {
      console.error("Error in shareStory function:", error);
      // Show some feedback even if there's an error
      setShareError('Failed to share story. The data might be too large for browser storage.');
      setIsStoryShared(false);
    }
  };
  
  // Helper function to add a story to the shared stories collection
  const addToSharedStories = (sharedStories: any[], fullSharedStory: any) => {
    // Add to shared stories
    sharedStories.push(fullSharedStory);
    
    // Limit to 50 stories
    if (sharedStories.length > 50) {
      sharedStories = sharedStories.slice(-50);
    }
    
    localStorage.setItem('sharedStories', JSON.stringify(sharedStories));
    console.log("Stored in old format successfully");
  };
  
  // Helper function to save a minimal story reference
  const saveStoryReference = (story: Story) => {
    // Get existing shared story references
    const sharedStoryRefsJson = localStorage.getItem('sharedStoryRefs');
    let sharedStoryRefs = [];
    
    if (sharedStoryRefsJson) {
      sharedStoryRefs = JSON.parse(sharedStoryRefsJson);
    }
    
    // Add just the minimal info needed but include genre and description 
    // to help with image placeholder selection and previews
    sharedStoryRefs.push({
      id: story.id,
      title: story.title,
      authorId: user?.id,
      authorName: user?.name,
      authorUsername: user?.username,
      dateShared: new Date().toISOString(),
      genre: story.genre,
      description: story.description ? 
        (story.description.length > 200 ? 
          story.description.substring(0, 200) + '...' : 
          story.description) : 
        undefined,
      rating: story.rating
    });
    
    // Limit collection size to prevent quota issues
    if (sharedStoryRefs.length > 100) {
      sharedStoryRefs = sharedStoryRefs.slice(-100);
    }
    
    localStorage.setItem('sharedStoryRefs', JSON.stringify(sharedStoryRefs));
    console.log("Added story reference to shared stories");
  };

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
                      <div className="flex gap-4">
                        {story.coverImage ? (
                          <div className="w-24 h-24 relative flex-shrink-0 rounded-md overflow-hidden">
                            <Image
                              src={story.coverImage}
                              alt={story.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-24 h-24 bg-black/30 rounded-md flex items-center justify-center flex-shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                        <div className="flex-grow">
                          <h3 className={`text-lg font-bold mb-2 text-${currentStyle === 'fantasy' ? 'amber' : currentStyle === 'scifi' ? 'cyan' : 'emerald'}-400`}>
                            {story.title}
                          </h3>
                          <p className="text-white/80 mb-3">{story.description}</p>
                          <div className="flex justify-between text-sm text-white/60">
                            <span>Created: {story.createdAt}</span>
                            <span>❤️ {story.likes} Likes</span>
                          </div>
                        </div>
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
                      <div className="flex gap-4">
                        {savedStory.coverImage ? (
                          <div className="w-24 h-24 relative flex-shrink-0 rounded-md overflow-hidden">
                            <Image
                              src={savedStory.coverImage}
                              alt={savedStory.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-24 h-24 bg-black/30 rounded-md flex items-center justify-center flex-shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                          </div>
                        )}
                        <div className="flex-grow">
                          <h3 className={`text-lg font-bold mb-2 text-${currentStyle === 'fantasy' ? 'amber' : currentStyle === 'scifi' ? 'cyan' : 'emerald'}-400`}>
                            {savedStory.title}
                          </h3>
                          <p className="text-white/80 mb-2">By {savedStory.author}</p>
                          {savedStory.description && (
                            <p className="text-white/70 text-sm mb-3 line-clamp-2">{savedStory.description}</p>
                          )}
                          <div className="flex flex-wrap items-center gap-2 mb-3">
                            {savedStory.genre && (
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                currentStyle === 'fantasy' 
                                  ? 'bg-amber-500/20 text-amber-300' 
                                  : currentStyle === 'scifi' 
                                    ? 'bg-cyan-500/20 text-cyan-300' 
                                    : 'bg-emerald-500/20 text-emerald-300'
                              }`}>
                                {savedStory.genre}
                              </span>
                            )}
                            {savedStory.rating && (
                              <span className={`px-2 py-1 rounded text-xs ${getRatingColor(savedStory.rating)}`}>
                                {savedStory.rating}
                              </span>
                            )}
                          </div>
                          <div className="flex justify-between text-sm text-white/60">
                            <span>Saved: {savedStory.savedAt}</span>
                            <span>{savedStory.progress}% Complete</span>
                          </div>
                        </div>
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
                
                {shareError && (
                  <div className="bg-red-500/20 text-red-300 p-3 rounded-md mb-4">
                    {shareError}
                  </div>
                )}
                
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
                    onClick={() => {
                      console.log("Share Story button clicked");
                      if (selectedStory) {
                        console.log("Selected story for sharing:", selectedStory.title);
                        try {
                          shareStory(selectedStory as Story);
                        } catch (error) {
                          console.error("Error in share button handler:", error);
                          // Close the modal anyway to prevent it from getting stuck
                          setTimeout(() => {
                            setShowShareModal(false);
                          }, 1000);
                        }
                      } else {
                        console.error("No story selected for sharing");
                        alert("No story selected for sharing.");
                        setShowShareModal(false);
                      }
                    }}
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
                <label htmlFor="coverImage" className="block text-white mb-2">Cover Image</label>
                <div className="relative">
                  <input
                    id="coverImage"
                    type="file"
                    accept="image/*"
                    onChange={handleCoverImageChange}
                    className="hidden"
                  />
                  <div 
                    onClick={() => document.getElementById('coverImage')?.click()}
                    className="w-full h-40 bg-black/30 border border-white/20 rounded-md flex flex-col items-center justify-center cursor-pointer hover:bg-black/40 transition-colors relative overflow-hidden"
                  >
                    {coverImagePreview ? (
                      <>
                        <Image
                          src={coverImagePreview}
                          alt="Cover preview"
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                          <span className="text-white">Change Image</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white/30 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-white/60">Click to upload cover image</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              
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
                  onClick={() => {
                    // The form will still submit via the onSubmit handler
                    // This is just an extra measure to ensure the modal closes
                    setTimeout(() => setShowCreateModal(false), 100);
                  }}
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