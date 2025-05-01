"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useTheme, getStyleSettings } from "../../ThemeContext";
import { FaGem, FaHistory, FaShoppingCart, FaUndo, FaPlus, FaCreditCard, FaDownload } from 'react-icons/fa';
import Link from "next/link";
import { useAuth } from "../../context/AuthContext";
import { User } from "../../context/AuthContext";

// Define types for our history records
interface PurchaseRecord {
  id: number;
  date: string;
  description: string;
  amount: number;
  price: number;
  status: string;
  receipt: boolean;
}

interface UsageRecord {
  id: number;
  date: string;
  description: string;
  amount: number;
  status: string;
}

export default function GemsDetailsPage() {
  const { currentStyle } = useTheme();
  const currentSettings = getStyleSettings(currentStyle);
  const { user } = useAuth();

  // Use current user's gems or fallback to 0 if user not loaded
  const currentGems = user?.gems || 0;
  
  const [purchaseHistory, setPurchaseHistory] = useState<PurchaseRecord[]>([]);
  const [usageHistory, setUsageHistory] = useState<UsageRecord[]>([]);

  // Generate user-specific purchase and usage history
  useEffect(() => {
    if (user) {
      // Generate purchase history based on user
      const generatedPurchaseHistory = generatePurchaseHistory(user);
      setPurchaseHistory(generatedPurchaseHistory);

      // Generate usage history based on user
      const generatedUsageHistory = generateUsageHistory(user);
      setUsageHistory(generatedUsageHistory);
    }
  }, [user]);

  // Generate relevant purchase history for user
  const generatePurchaseHistory = (user: User): PurchaseRecord[] => {
    // For new users (with 300 gems), show welcome package
    if (user.gems === 300 && !user.premium) {
      return [
        {
          id: 1,
          date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
          description: "Welcome Package",
          amount: 300,
          price: 0.00,
          status: "Completed",
          receipt: false
        }
      ];
    } 
    // For premium or existing users, show purchase history
    else {
      const currentDate = new Date();
      
      return [
        {
          id: 1,
          date: new Date(currentDate.getTime() - (2 * 24 * 60 * 60 * 1000)).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
          description: "Explorer Pack",
          amount: 500,
          price: 15.00,
          status: "Completed",
          receipt: true
        },
        {
          id: 2,
          date: new Date(currentDate.getTime() - (15 * 24 * 60 * 60 * 1000)).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
          description: "Starter Pack",
          amount: 100,
          price: 5.00,
          status: "Completed",
          receipt: true
        },
        {
          id: 3,
          date: new Date(currentDate.getTime() - (25 * 24 * 60 * 60 * 1000)).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
          description: "Adventurer Pack",
          amount: 250,
          price: 10.00,
          status: "Completed",
          receipt: true
        }
      ];
    }
  };

  // Generate relevant usage history for user
  const generateUsageHistory = (user: User): UsageRecord[] => {
    const currentDate = new Date();
    
    // For new users with no stories, show no usage
    if (!user.storiesCreated || user.storiesCreated === 0) {
      return [];
    }
    
    // For users with stories, show usage history
    return [
      {
        id: 1,
        date: new Date(currentDate.getTime() - (1 * 24 * 60 * 60 * 1000)).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
        description: `Story Generation - '${user.username}'s First Tale'`,
        amount: 25,
        status: "Completed"
      },
      {
        id: 2,
        date: new Date(currentDate.getTime() - (2 * 24 * 60 * 60 * 1000)).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
        description: `Character Image - 'Hero of ${user.username}'s Story'`,
        amount: 50,
        status: "Completed"
      },
      {
        id: 3,
        date: new Date(currentDate.getTime() - (5 * 24 * 60 * 60 * 1000)).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
        description: `Story Continuation - '${user.username}'s First Tale'`,
        amount: 15,
        status: "Completed"
      },
      {
        id: 4,
        date: new Date(currentDate.getTime() - (10 * 24 * 60 * 60 * 1000)).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
        description: "Environment Image - 'Story Setting'",
        amount: 50,
        status: "Completed"
      }
    ];
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className={`text-3xl font-bold mb-6 text-white ${currentSettings.subtitleFont}`}>Gems Details</h1>
      
      {/* Current Gems Balance */}
      <div className={`${currentSettings.cardBg || "bg-black/30"} backdrop-blur-sm rounded-lg p-6 border border-white/10 mb-8 relative`}>
        <h2 className="text-2xl font-bold text-white mb-4">Current Balance</h2>
        
        <div className="flex items-center justify-center gap-4 py-6">
          <FaGem className={`h-16 w-16 ${currentSettings.featureHighlight || 'text-amber-400'}`} />
          <span className="text-5xl font-bold text-white">{currentGems}</span>
          <span className="text-white/70 text-2xl">Gems</span>
        </div>
        
        <div className="flex flex-wrap gap-3 mt-6 justify-center">
          <Link
            href="/user/gems" 
            className={`${currentSettings.buttonColor} text-white px-4 py-2 rounded-md ${currentSettings.buttonStyle} transition-all flex items-center gap-2`}
          >
            <FaPlus />
            <span>Purchase Gems</span>
          </Link>
          <button className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-md transition-all flex items-center gap-2">
            <FaUndo />
            <span>Refund Gems</span>
          </button>
        </div>
      </div>
      
      {/* Purchase History */}
      <h2 className={`text-2xl font-bold mb-6 text-white ${currentSettings.subtitleFont} flex items-center gap-2`}>
        <FaShoppingCart className="inline" />
        <span>Purchase History</span>
      </h2>
      <div className={`${currentSettings.cardBg || "bg-black/30"} backdrop-blur-sm rounded-lg p-6 border border-white/10 mb-8`}>
        <div className="overflow-x-auto">
          {purchaseHistory.length > 0 ? (
            <table className="w-full text-white">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-4">Date</th>
                  <th className="text-left py-3 px-4">Package</th>
                  <th className="text-left py-3 px-4">Gems</th>
                  <th className="text-left py-3 px-4">Amount</th>
                  <th className="text-right py-3 px-4">Status</th>
                  <th className="text-right py-3 px-4">Receipt</th>
                </tr>
              </thead>
              <tbody>
                {purchaseHistory.map(purchase => (
                  <tr key={purchase.id} className="border-b border-white/10">
                    <td className="py-3 px-4">{purchase.date}</td>
                    <td className="py-3 px-4">{purchase.description}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1">
                        <FaGem className={`h-3 w-3 ${currentSettings.featureHighlight || 'text-amber-400'}`} />
                        <span>{purchase.amount}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">${purchase.price.toFixed(2)}</td>
                    <td className="py-3 px-4 text-right">
                      <span className="inline-block px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs">{purchase.status}</span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {purchase.receipt && (
                        <button className="text-white/70 hover:text-white transition-colors">
                          <FaDownload className="h-5 w-5" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-8 text-white/70">
              <p>No purchase history available.</p>
              <p className="mt-2 text-sm">Your initial 300 gems were provided as a welcome gift.</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Gems Usage History */}
      <h2 className={`text-2xl font-bold mb-6 text-white ${currentSettings.subtitleFont} flex items-center gap-2`}>
        <FaHistory className="inline" />
        <span>Usage History</span>
      </h2>
      <div className={`${currentSettings.cardBg || "bg-black/30"} backdrop-blur-sm rounded-lg p-6 border border-white/10 mb-8`}>
        <div className="overflow-x-auto">
          {usageHistory.length > 0 ? (
            <table className="w-full text-white">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-4">Date</th>
                  <th className="text-left py-3 px-4">Description</th>
                  <th className="text-left py-3 px-4">Gems Used</th>
                  <th className="text-right py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {usageHistory.map(usage => (
                  <tr key={usage.id} className="border-b border-white/10">
                    <td className="py-3 px-4">{usage.date}</td>
                    <td className="py-3 px-4">{usage.description}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1">
                        <FaGem className={`h-3 w-3 ${currentSettings.featureHighlight || 'text-amber-400'}`} />
                        <span>{usage.amount}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="inline-block px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs">{usage.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-8 text-white/70">
              <p>No usage history available.</p>
              <p className="mt-2 text-sm">Start creating stories to see your gems usage here.</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Payment Methods */}
      <h2 className={`text-2xl font-bold mb-6 text-white ${currentSettings.subtitleFont} flex items-center gap-2`}>
        <FaCreditCard className="inline" />
        <span>Payment Methods</span>
      </h2>
      <div className={`${currentSettings.cardBg || "bg-black/30"} backdrop-blur-sm rounded-lg p-6 border border-white/10 mb-8`}>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-white rounded w-14 h-10 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" className="w-10">
                  <path fill="#0052A4" d="M470.1 231.3s7.6 37.2 9.3 45H446c3.3-8.9 16-43 16-43-3.1 4-14 16.9-17.4 21.8l-4.1-23.4h-25.5l13.7 65.4h28.6c14.9-19.3 37.5-49 41.8-55.9zM576 80v352c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V80c0-26.5 21.5-48 48-48h480c26.5 0 48 21.5 48 48zM152.5 331.2L215.7 176h-42.5l-39.3 106-4.3-21.5-14-71.4c-2.3-9.9-9.4-12.7-18.2-13.1H32.7l-.7 3.1c15.8 4 29.9 9.8 42.2 17.1l35.8 135h42.5zm94.4.2L272.1 176h-40.2l-25.1 155.4h40.1zm139.9-50.8c.2-17.7-10.6-31.2-33.7-42.3-14.1-7.1-22.7-11.9-22.7-19.2.2-6.6 7.3-13.4 23.1-13.4 13.1-.3 22.7 2.8 29.9 5.9l3.6-23.6c-6.8-2.8-15.7-5.5-30-5.5-30.9 0-53 16.5-53.2 40.2-.2 17.5 15.5 27.3 27.3 33.1 12.2 5.9 16.2 9.8 16.2 14.9-.2 8-9.6 11.6-18.7 11.6-15.5 0-23.9-4.3-30.7-7.9l-3.9 25.1c6.9 3.2 19.6 6 32.8 6.1 31.1.1 51.8-15.6 52-44z"/>
                </svg>
              </div>
              <div>
                <p className="text-white font-medium">Visa ending in 4242</p>
                <p className="text-white/60 text-sm">Expires 09/26</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-white/70 text-sm bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">Default</span>
              <button className="text-white/70 hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-white rounded w-14 h-10 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" className="w-10">
                  <path fill="#003087" d="M111.4 295.9c-3.5 19.2-17.4 108.7-21.5 134-.3 1.8-1 2.5-3 2.5H12.3c-7.6 0-13.1-6.6-12.1-13.9L58.8 46.6c1.5-9.6 10.1-16.9 20-16.9 152.3 0 165.1-3.7 204 11.4 60.1 23.3 65.6 79.5 44 140.3-21.5 62.6-72.5 89.5-140.1 90.3-43.4.7-69.5-7-75.3 24.2zM357.1 152c-1.8-1.3-2.5-1.8-3 1.3-2 11.4-5.1 22.5-8.8 33.6-39.9 113.8-150.5 103.9-204.5 103.9-6.1 0-10.1 3.3-10.9 9.4-22.6 140.4-27.1 169.7-27.1 169.7-1 7.1 3.5 12.9 10.6 12.9h63.5c8.6 0 15.7-6.3 17.4-14.9.7-5.4-1.1 6.1 14.4-91.3 4.6-22 14.3-19.7 29.3-19.7 71 0 126.4-28.8 142.9-112.3 6.5-34.8 4.6-71.4-23.8-92.6z"/>
                </svg>
              </div>
              <div>
                <p className="text-white font-medium">PayPal - john@example.com</p>
                <p className="text-white/60 text-sm">Connected Account</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="text-white/70 hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
              <button className="text-white/70 hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        <button className={`mt-6 ${currentSettings.buttonColor} text-white px-4 py-2 rounded-md ${currentSettings.buttonStyle} transition-all flex items-center gap-2`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Payment Method
        </button>
      </div>
    </div>
  );
} 