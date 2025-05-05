"use client";

import React, { useState, useEffect } from 'react';
import Image from "next/image";
import Link from "next/link";
import { useParams } from 'next/navigation';
import { useTheme, getStyleSettings } from "../../../../ThemeContext";
import { useAuth } from "../../../../context/AuthContext";
import PageContainer from "../../../../components/PageContainer";

export default function StoryDetailPage() {
  const { id } = useParams();
  const { currentStyle } = useTheme();
  const currentSettings = getStyleSettings(currentStyle);
  const { isAuthenticated, user } = useAuth();
  const [story, setStory] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined' && id) {
      try {
        setLoading(true);
        const storyId = Array.isArray(id) ? id[0] : id;
        
        // First check if there are any shared stories in the old format
        const sharedStoriesJson = localStorage.getItem('sharedStories');
        if (sharedStoriesJson) {
          try {
            const sharedStories = JSON.parse(sharedStoriesJson);
            const foundStory = sharedStories.find((s: any) => s.id === storyId);
            
            if (foundStory) {
              setStory(foundStory);
              setLoading(false);
              return;
            }
          } catch (error) {
            console.error("Error parsing shared stories:", error);
          }
        }
        
        // If not found, try the new reference-based approach
        const sharedStoryRefsJson = localStorage.getItem('sharedStoryRefs');
        if (sharedStoryRefsJson) {
          const storyRefs = JSON.parse(sharedStoryRefsJson);
          const storyRef = storyRefs.find((ref: any) => ref.id === storyId);
          
          if (storyRef) {
            // Try to find the full story data from user's storage
            let fullStory = null;
            try {
              if (storyRef.authorId) {
                const userStoriesJson = localStorage.getItem(`stories_${storyRef.authorId}`);
                if (userStoriesJson) {
                  const userStories = JSON.parse(userStoriesJson);
                  fullStory = userStories.find((s: any) => s.id === storyId);
                }
              }
            } catch (e) {
              console.error("Error retrieving full story:", e);
            }
            
            if (fullStory) {
              setStory({
                ...fullStory,
                authorName: storyRef.authorName || "Unknown Author",
                authorUsername: storyRef.authorUsername || "unknown",
                dateShared: storyRef.dateShared || new Date().toISOString()
              });
            } else {
              // If we couldn't find the full story, create a simplified version
              const genreImages: {[key: string]: string} = {
                fantasy: "/images/community/community1.jpg",
                scifi: "/images/community/community3.jpg",
                mystery: "/images/community/community5.jpg",
                horror: "/images/community/community4.jpg",
                default: "/images/community/community2.jpg"
              };
              
              setStory({
                id: storyRef.id,
                title: storyRef.title || "Unknown Title",
                authorName: storyRef.authorName || "Unknown Author",
                authorUsername: storyRef.authorUsername || "unknown",
                dateShared: storyRef.dateShared || new Date().toISOString(),
                description: storyRef.description || "A shared story from the community.",
                content: storyRef.content || "The full content of this story is not available.",
                genre: storyRef.genre || "fantasy",
                status: storyRef.status || "In Progress",
                rating: storyRef.rating || "PG",
                coverImage: genreImages[storyRef.genre?.toLowerCase()] || genreImages.default
              });
            }
            
            setLoading(false);
            return;
          }
        }
        
        // If no shared stories found, check for demo stories
        const demoStories = [
          {
            id: "demo1",
            title: "The Lost Kingdom",
            authorName: "Jane Writer",
            authorUsername: "janewriter",
            dateShared: new Date().toISOString(),
            description: "An epic tale of adventure in a forgotten realm, where magic and mystery await at every turn.",
            content: "The ancient kingdom of Eldoria was once a thriving realm of magic and wonder. Nestled between towering mountains and vast forests, it was home to diverse peoples and creatures living in harmony under the wise rule of the Lumina dynasty.\n\nBut one fateful night, as stars fell from the sky like tears, the kingdom vanished. Not destroyed by war or calamity—simply gone, as if it had never existed.\n\nCenturies passed, and Eldoria became legend, a bedtime story for children, a myth scholars debated in dusty libraries.\n\nUntil now.\n\nLyra Nightshade, a young historian with a mysterious past, discovered an ancient map hidden in the binding of a forgotten tome. Unlike other supposed \"maps to Eldoria\" that had surfaced over the years, this one changed under moonlight, revealing pathways and landmarks previously invisible.\n\nArmed with the map and her extensive knowledge of Eldorian lore, Lyra embarked on a perilous journey to find the lost kingdom, facing ancient guardians, solving impossible riddles, and uncovering secrets about herself and her connection to the vanished realm.\n\nWhat she would discover would change not only her destiny but the fate of worlds both seen and unseen.",
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
            dateShared: new Date(Date.now() - 86400000).toISOString(),
            description: "A journey through the cosmos aboard the most advanced vessel ever created by humanity.",
            content: "The Stellaris, humanity's most advanced interstellar vessel, glided silently through the void between solar systems. Its quantum engines barely whispered as they bent spacetime, propelling the massive ship toward uncharted regions of the galaxy.\n\nCaptain Elena Reyes stood on the observation deck, the holographic display of their trajectory floating before her. After twenty years of preparation and three years in deep space, they were approaching their destination: the mysterious radio source designated Anomaly-7.\n\nFor decades, Earth's most powerful telescopes and signal arrays had detected unusual patterns emanating from this region—patterns too regular to be natural, yet unlike anything in human experience. Some believed it was evidence of advanced alien intelligence. Others warned it could be a trap.\n\nElena wasn't sure what awaited them, but as the ship's sensors began detecting strange gravitational fluctuations ahead, she knew that humanity was about to cross a threshold from which there might be no return.\n\n\"Captain,\" came the voice of Dr. Marcus Chen, the ship's chief scientist. \"You're going to want to see this. We're receiving... something. It appears to be responding to our presence.\"\n\nElena felt a chill run down her spine as she headed toward the bridge. Whatever waited ahead, the Stellaris and its crew of three hundred would face it together—the culmination of humanity's greatest journey among the stars.",
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
            dateShared: new Date(Date.now() - 172800000).toISOString(),
            description: "A spine-tingling mystery set in a small town where nothing is as it seems.",
            content: "Detective Morgan Chase had seen her share of strange cases, but nothing prepared her for Ravenwood.\n\nThe small town appeared picturesque from the highway—Victorian houses with neat gardens, a quaint main street with family-owned shops, and friendly waves from locals. But beneath this perfect facade, something was terribly wrong.\n\nSix people had vanished in the past year, all under impossible circumstances. Security cameras showed them walking into rooms but never coming out. Some reported seeing the missing individuals in two places simultaneously before they disappeared. And strangest of all, the townspeople seemed oddly resigned to these events, as if they were simply an unavoidable part of life in Ravenwood.\n\nMorgan's investigation led her to the old library, where ancient town records hinted at similar disappearances dating back to the town's founding in 1842. The pattern was always the same: the disappearances would accelerate until reaching a crescendo, then stop completely for exactly fifty years before beginning again.\n\nWhen Morgan found a daguerreotype photograph from 1893 showing a woman identical to herself standing in front of the town hall, she realized she wasn't in Ravenwood by chance. The town had been waiting for her, and the whispers she heard at night in her rented room weren't just dreams—they were trying to tell her something.\n\nSomething that had been buried beneath Ravenwood for centuries.",
            genre: "mystery",
            coverImage: "/images/community/community5.jpg",
            rating: "R",
            status: "Completed"
          }
        ];
        
        const demoStory = demoStories.find(s => s.id === storyId);
        if (demoStory) {
          setStory(demoStory);
          setLoading(false);
          return;
        }
        
        // If we get here, the story wasn't found
        setError('Story not found');
        setLoading(false);
      } catch (error) {
        console.error("Error loading story:", error);
        setError('An error occurred while loading the story');
        setLoading(false);
      }
    }
  }, [id]);

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

  if (loading) {
    return (
      <PageContainer title="Loading Story..." showThemeSwitcher={false}>
        <div className="max-w-4xl mx-auto px-4 py-12 flex justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white"></div>
        </div>
      </PageContainer>
    );
  }

  if (error || !story) {
    return (
      <PageContainer title="Story Not Found" showThemeSwitcher={false}>
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className={`${currentSettings.cardBg || "bg-black/30"} backdrop-blur-sm rounded-lg p-6 border border-white/10 mb-8 text-center`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-white/30 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <h2 className="text-xl text-white mb-4">{error || 'Story not found'}</h2>
            <p className="text-white/70 mb-6">The story you are looking for could not be found or has been removed.</p>
            <Link 
              href="/community-stories" 
              className={`${currentSettings.buttonColor} text-white px-6 py-2 rounded-md ${currentSettings.buttonStyle} transition-all inline-block`}
            >
              Back to Community Stories
            </Link>
          </div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer title={story.title} showThemeSwitcher={false}>
      <div className="max-w-4xl mx-auto px-4">
        <div className={`${currentSettings.cardBg || "bg-black/30"} backdrop-blur-sm rounded-lg p-6 border border-white/10 mb-8`}>
          {/* Story Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <Link 
                href="/community-stories" 
                className="flex items-center text-white/70 hover:text-white transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Community Stories
              </Link>
              
              <div className="flex gap-2">
                <button className="bg-white/10 p-2 rounded text-white hover:bg-white/20 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                </button>
                <button className="bg-white/10 p-2 rounded text-white hover:bg-white/20 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                </button>
              </div>
            </div>
            
            {/* Cover Image */}
            <div className="w-full h-64 md:h-80 relative rounded-lg overflow-hidden mb-6">
              <Image 
                src={story.coverImage || "/images/community/community2.jpg"}
                alt={story.title}
                fill
                className="object-cover"
                unoptimized={true}
              />
            </div>
            
            {/* Story Info */}
            <div className="mb-6">
              <div className="flex flex-wrap gap-2 mb-4">
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
                
                <span className="text-xs px-2 py-0.5 rounded bg-blue-500/20 text-blue-300">
                  {story.genre || "Fantasy"}
                </span>
              </div>
              
              <h1 className={`text-3xl font-bold text-${currentStyle === 'fantasy' ? 'amber' : currentStyle === 'scifi' ? 'cyan' : 'emerald'}-400 mb-2`}>
                {story.title}
              </h1>
              
              <p className="text-white/80 text-sm mb-4">
                By <span className="text-white hover:underline cursor-pointer">{story.authorName}</span> • {formatDate(story.dateShared)}
              </p>
              
              <p className="text-white/90 text-lg italic border-l-4 border-white/20 pl-4 py-2">
                {story.description || "No description available"}
              </p>
            </div>
          </div>
          
          {/* Story Content */}
          <div className="prose prose-invert max-w-none">
            {story.content ? (
              story.content.split('\n\n').map((paragraph: string, index: number) => (
                <p key={index} className="text-white/90 mb-4">
                  {paragraph}
                </p>
              ))
            ) : (
              <p className="text-white/70 italic">No content available for this story.</p>
            )}
          </div>
          
          {/* Actions */}
          <div className="mt-12 pt-6 border-t border-white/10">
            <div className="flex flex-wrap gap-4 justify-between items-center">
              <div className="flex gap-2">
                <button 
                  className={`${currentSettings.buttonColor} text-white px-6 py-2 rounded-md ${currentSettings.buttonStyle} transition-all`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                  </svg>
                  Like Story
                </button>
                <button 
                  className="bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-md transition-all"
                >
                  Follow Author
                </button>
              </div>
              
              <Link 
                href="/community-stories" 
                className="text-white/70 hover:text-white transition-colors"
              >
                Back to Stories
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
} 