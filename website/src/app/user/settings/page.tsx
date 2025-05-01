"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTheme, getStyleSettings } from "../../ThemeContext";
import { ChangeEvent, FormEvent } from "react";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";

export default function AccountSettingsPage() {
  const { currentStyle, setCurrentStyle } = useTheme();
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const router = useRouter();
  const currentSettings = getStyleSettings(currentStyle);
  
  // State for settings
  const [accountSettings, setAccountSettings] = useState({
    password: "",
    confirmPassword: "",
    twoFactorEnabled: false,
    language: "english",
    theme: currentStyle,
    deleteAccount: false
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth');
    }
  }, [isLoading, isAuthenticated, router]);

  // Update theme setting when currentStyle changes
  useEffect(() => {
    setAccountSettings(prev => ({
      ...prev,
      theme: currentStyle
    }));
  }, [currentStyle]);
  
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

  // Handle settings changes
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setAccountSettings({
      ...accountSettings,
      [name]: type === 'checkbox' ? checked : value
    });
    
    // For theme changes, update the app theme as well
    if (name === 'theme') {
      setCurrentStyle(value as 'fantasy' | 'scifi' | 'real');
    }
  };

  // Handle form submission
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Password validation
    if (accountSettings.password && accountSettings.password !== accountSettings.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    
    // In a real app, you would save the settings to your backend here
    alert("Settings updated successfully!");
  };

  // Handle account deletion
  const handleDeleteAccount = () => {
    if (confirm("Are you absolutely sure you want to delete your account? This action cannot be undone.")) {
      // In a real app, you would call an API to delete the account
      alert("Account deleted successfully.");
      logout(); // Log the user out after deletion
    }
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
        <h1 className={`text-3xl font-bold text-white ${currentSettings.subtitleFont}`}>Account Settings</h1>
      </div>
      
      <div className={`${currentSettings.cardBg || "bg-black/30"} backdrop-blur-sm rounded-lg p-6 border border-white/10 mb-8`}>
        <form onSubmit={handleSubmit}>
          {/* Password Section */}
          <div className="mb-8 pb-8 border-b border-white/10">
            <h2 className="text-xl font-bold text-white mb-4">Password</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white/70 mb-2">New Password</label>
                <input 
                  type="password"
                  name="password"
                  value={accountSettings.password}
                  onChange={handleChange}
                  className="w-full bg-black/30 border border-white/10 rounded-lg py-2 px-4 text-white placeholder-white/50 focus:outline-none focus:ring focus:ring-white/20"
                  placeholder="Leave blank to keep current password"
                />
              </div>
              
              <div>
                <label className="block text-white/70 mb-2">Confirm New Password</label>
                <input 
                  type="password"
                  name="confirmPassword"
                  value={accountSettings.confirmPassword}
                  onChange={handleChange}
                  className="w-full bg-black/30 border border-white/10 rounded-lg py-2 px-4 text-white placeholder-white/50 focus:outline-none focus:ring focus:ring-white/20"
                  placeholder="Leave blank to keep current password"
                />
              </div>
            </div>
            
            <p className="text-white/50 text-sm mt-3">
              For security, your password should be at least 8 characters long and include a combination of letters, numbers, and special characters.
            </p>
          </div>
          
          {/* Security Section */}
          <div className="mb-8 pb-8 border-b border-white/10">
            <h2 className="text-xl font-bold text-white mb-4">Security</h2>
            
            <div className="flex items-start gap-3 mb-6">
              <input 
                type="checkbox"
                id="twoFactorEnabled"
                name="twoFactorEnabled"
                checked={accountSettings.twoFactorEnabled}
                onChange={handleChange}
                className="mt-1"
              />
              <div>
                <label htmlFor="twoFactorEnabled" className="text-white cursor-pointer">Enable Two-Factor Authentication</label>
                <p className="text-white/50 text-sm">Add an extra layer of security to your account by requiring a verification code when you log in.</p>
              </div>
            </div>
            
            <button 
              type="button"
              className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-md transition-all"
            >
              View Login History
            </button>
          </div>
          
          {/* Preferences Section */}
          <div className="mb-8 pb-8 border-b border-white/10">
            <h2 className="text-xl font-bold text-white mb-4">Preferences</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white/70 mb-2">Language</label>
                <select 
                  name="language"
                  value={accountSettings.language}
                  onChange={handleChange}
                  className="w-full bg-black/30 border border-white/10 rounded-lg py-2 px-4 text-white focus:outline-none focus:ring focus:ring-white/20"
                >
                  <option value="english">English</option>
                  <option value="spanish">Spanish</option>
                  <option value="french">French</option>
                  <option value="german">German</option>
                  <option value="japanese">Japanese</option>
                  <option value="korean">Korean</option>
                  <option value="chinese">Chinese (Simplified)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-white/70 mb-2">Default Theme</label>
                <select 
                  name="theme"
                  value={accountSettings.theme}
                  onChange={handleChange}
                  className="w-full bg-black/30 border border-white/10 rounded-lg py-2 px-4 text-white focus:outline-none focus:ring focus:ring-white/20"
                >
                  <option value="fantasy">Fantasy</option>
                  <option value="scifi">Sci-Fi</option>
                  <option value="real">Realistic</option>
                </select>
                <p className="text-white/50 text-sm mt-1">This will be your default theme when you log in.</p>
              </div>
            </div>
          </div>
          
          {/* Danger Zone */}
          <div className="mb-8 pb-8 border-b border-white/10">
            <h2 className="text-xl font-bold text-red-500 mb-4">Danger Zone</h2>
            
            <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
              <h3 className="text-lg font-bold text-white mb-2">Delete Account</h3>
              <p className="text-white/70 mb-4">
                Permanently delete your account and all your data. This action cannot be undone.
              </p>
              
              <div className="flex items-start gap-3 mb-4">
                <input 
                  type="checkbox"
                  id="deleteAccount"
                  name="deleteAccount"
                  checked={accountSettings.deleteAccount}
                  onChange={handleChange}
                  className="mt-1"
                />
                <label htmlFor="deleteAccount" className="text-white cursor-pointer">
                  I understand that this action is permanent and cannot be undone.
                </label>
              </div>
              
              <button 
                type="button"
                disabled={!accountSettings.deleteAccount}
                onClick={handleDeleteAccount}
                className={`bg-red-600 text-white px-4 py-2 rounded-md transition-all ${
                  !accountSettings.deleteAccount ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-700'
                }`}
              >
                Delete My Account
              </button>
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