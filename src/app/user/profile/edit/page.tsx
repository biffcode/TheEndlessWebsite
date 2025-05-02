"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTheme, getStyleSettings } from "../../../ThemeContext";
import { ChangeEvent, FormEvent } from "react";
import { useAuth } from "../../../context/AuthContext";
import { useRouter } from "next/navigation";

export default function EditProfilePage() {
  const { currentStyle, setCurrentStyle } = useTheme();
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const currentSettings = getStyleSettings(currentStyle);
  
  // Form state
  const [formData, setFormData] = useState({
    displayName: "",
    username: "",
    bio: "",
    email: "",
    notificationEmails: true,
    marketingEmails: false,
    profileVisibility: "public"
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth');
    }
  }, [isLoading, isAuthenticated, router]);

  // Initialize form with user data when available
  useEffect(() => {
    if (user) {
      setFormData({
        displayName: user.name,
        username: user.username,
        bio: user.bio || "Passionate storyteller with a love for fantasy and sci-fi worlds.",
        email: user.email,
        notificationEmails: true,
        marketingEmails: false,
        profileVisibility: "public"
      });
    }
  }, [user]);
  
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

  // Handle form changes
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Handle form submission
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // In a real app, you would save the data to your backend here
    // For this demo, we'll just show a success message
    alert("Profile updated successfully!");
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center mb-6">
        <Link 
          href="/user/profile" 
          className="text-white/70 hover:text-white mr-3 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <h1 className={`text-3xl font-bold text-white ${currentSettings.subtitleFont}`}>Edit Profile</h1>
      </div>
      
      <div className={`${currentSettings.cardBg || "bg-black/30"} backdrop-blur-sm rounded-lg p-6 border border-white/10 mb-8`}>
        <form onSubmit={handleSubmit}>
          {/* Profile Picture Section */}
          <div className="flex flex-col md:flex-row gap-8 items-center mb-8 pb-8 border-b border-white/10">
            <div className="relative w-40 h-40">
              <div className="rounded-full border-4 border-white/10 bg-gray-700 w-full h-full flex items-center justify-center text-white/50 text-3xl font-bold overflow-hidden">
                {user.profileImage ? (
                  <Image 
                    src={user.profileImage} 
                    alt={`${user.name}'s Profile`}
                    className="object-cover"
                    fill
                    sizes="(max-width: 768px) 100vw, 160px"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center">
                    {user.name.charAt(0)}
                  </div>
                )}
              </div>
              <button 
                type="button"
                className={`absolute bottom-0 right-0 ${currentSettings.buttonColor} text-white p-2 rounded-full`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </div>
            <div className="flex-grow">
              <h2 className="text-xl font-bold text-white mb-3">Profile Photo</h2>
              <p className="text-white/70 mb-4">Upload a new photo to personalize your profile. JPG, PNG or GIF, max 5MB.</p>
              <div className="flex flex-wrap gap-3">
                <button 
                  type="button"
                  className={`${currentSettings.buttonColor} text-white px-4 py-2 rounded-md ${currentSettings.buttonStyle} transition-all`}
                >
                  Upload New Photo
                </button>
                <button 
                  type="button"
                  className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-md transition-all"
                >
                  Remove Photo
                </button>
              </div>
            </div>
          </div>
          
          {/* Basic Info Section */}
          <div className="mb-8 pb-8 border-b border-white/10">
            <h2 className="text-xl font-bold text-white mb-4">Basic Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white/70 mb-2">Display Name</label>
                <input 
                  type="text"
                  name="displayName"
                  value={formData.displayName}
                  onChange={handleChange}
                  className="w-full bg-black/30 border border-white/10 rounded-lg py-2 px-4 text-white placeholder-white/50 focus:outline-none focus:ring focus:ring-white/20"
                />
              </div>
              
              <div>
                <label className="block text-white/70 mb-2">Username</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-white/50">@</span>
                  <input 
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full bg-black/30 border border-white/10 rounded-lg py-2 pl-8 pr-4 text-white placeholder-white/50 focus:outline-none focus:ring focus:ring-white/20"
                  />
                </div>
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-white/70 mb-2">Bio</label>
                <textarea 
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows={4}
                  className="w-full bg-black/30 border border-white/10 rounded-lg py-2 px-4 text-white placeholder-white/50 focus:outline-none focus:ring focus:ring-white/20"
                ></textarea>
                <p className="text-white/50 text-sm mt-1">Tell others about yourself and your storytelling style.</p>
              </div>
            </div>
          </div>
          
          {/* Account Settings Section */}
          <div className="mb-8 pb-8 border-b border-white/10">
            <h2 className="text-xl font-bold text-white mb-4">Contact Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white/70 mb-2">Email Address</label>
                <input 
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-black/30 border border-white/10 rounded-lg py-2 px-4 text-white placeholder-white/50 focus:outline-none focus:ring focus:ring-white/20"
                />
                <p className="text-white/50 text-sm mt-1">This email is used for account notifications and recovery.</p>
              </div>
            </div>
          </div>
          
          {/* Privacy Settings */}
          <div className="mb-8 pb-8 border-b border-white/10">
            <h2 className="text-xl font-bold text-white mb-4">Preferences & Privacy</h2>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <input 
                  type="checkbox"
                  id="notificationEmails"
                  name="notificationEmails"
                  checked={formData.notificationEmails}
                  onChange={handleChange}
                  className="mt-1"
                />
                <div>
                  <label htmlFor="notificationEmails" className="text-white cursor-pointer">Notification Emails</label>
                  <p className="text-white/50 text-sm">Receive emails about story interactions, follows, and comments.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <input 
                  type="checkbox"
                  id="marketingEmails"
                  name="marketingEmails"
                  checked={formData.marketingEmails}
                  onChange={handleChange}
                  className="mt-1"
                />
                <div>
                  <label htmlFor="marketingEmails" className="text-white cursor-pointer">Marketing Emails</label>
                  <p className="text-white/50 text-sm">Receive updates about new features, special offers, and events.</p>
                </div>
              </div>
              
              <div className="mt-6">
                <label className="block text-white/70 mb-2">Profile Visibility</label>
                <select 
                  name="profileVisibility"
                  value={formData.profileVisibility}
                  onChange={handleChange}
                  className="w-full md:w-1/2 bg-black/30 border border-white/10 rounded-lg py-2 px-4 text-white focus:outline-none focus:ring focus:ring-white/20"
                >
                  <option value="public">Public - Visible to everyone</option>
                  <option value="followers">Followers Only - Visible to followers</option>
                  <option value="private">Private - Visible only to you</option>
                </select>
              </div>
            </div>
          </div>
          
          {/* Form Actions */}
          <div className="flex flex-wrap justify-end gap-3">
            <Link 
              href="/user/profile"
              className="bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-md transition-all"
            >
              Cancel
            </Link>
            <button 
              type="submit"
              className={`${currentSettings.buttonColor} text-white px-6 py-2 rounded-md ${currentSettings.buttonStyle} transition-all`}
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 