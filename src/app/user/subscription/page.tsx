"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTheme, getStyleSettings } from "../../ThemeContext";
import { FaGem, FaHistory, FaShoppingCart, FaUndo, FaPlus, FaCreditCard, FaDownload } from 'react-icons/fa';
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
          {/* Empty state for new accounts */}
          <div className="text-center py-8 text-white/70">
            <p>No payment methods added yet.</p>
            <p className="mt-2 text-sm">Add a payment method to purchase gems and unlock premium features.</p>
          </div>
        </div>
        
        <Link href="/user/payment/add"
          className={`mt-6 ${currentSettings.buttonColor} text-white px-4 py-2 rounded-md ${currentSettings.buttonStyle} transition-all flex items-center gap-2 w-fit mx-auto`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Payment Method
        </Link>
      </div>
    </div>
  );
} 