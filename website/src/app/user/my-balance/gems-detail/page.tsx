"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTheme, getStyleSettings } from "../../ThemeContext";
import { FaGem, FaHistory, FaShoppingCart, FaUndo, FaPlus, FaCreditCard, FaDownload, FaCrown, FaRedo } from 'react-icons/fa';
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

export default function GemsDetailPage() {
  const { currentStyle } = useTheme();
  const currentSettings = getStyleSettings(currentStyle);
  const { user, allocateBattlePassGems } = useAuth();

  // Use current user's gems or fallback to 0 if user not loaded
  const currentGems = user?.gems || 0;
  
  const [purchaseHistory, setPurchaseHistory] = useState<PurchaseRecord[]>([]);
  const [usageHistory, setUsageHistory] = useState<UsageRecord[]>([]);
  const [isRenewing, setIsRenewing] = useState(false);
  const [renewalSuccess, setRenewalSuccess] = useState(false);
  const [balanceSummary, setBalanceSummary] = useState({ purchased: 0, used: 0, balance: 0 });

  // Generate user-specific purchase and usage history
  useEffect(() => {
    if (user) {
      // Generate purchase history based on user
      const generatedPurchaseHistory = generatePurchaseHistory(user);
      setPurchaseHistory(generatedPurchaseHistory);

      // Generate usage history based on user
      const generatedUsageHistory = generateUsageHistory(user);
      setUsageHistory(generatedUsageHistory);

      // Calculate balance summary
      const totalPurchased = generatedPurchaseHistory.reduce((sum, record) => sum + record.amount, 0);
      const totalUsed = generatedUsageHistory.reduce((sum, record) => sum + record.amount, 0);
      setBalanceSummary({
        purchased: totalPurchased,
        used: totalUsed,
        balance: totalPurchased - totalUsed
      });
    }
  }, [user]);

  // Generate relevant purchase history for user
  const generatePurchaseHistory = (user: User): PurchaseRecord[] => {
    const currentDate = new Date();
    let history: PurchaseRecord[] = [];
    
    // Add Battle Pass allocation if user has a subscription
    if (user.subscription) {
      const tierNames = {
        'adventurer': 'Adventurer Battle Pass',
        'hero': 'Hero Battle Pass',
        'legend': 'Legend Battle Pass'
      };
      
      const gemAmounts = {
        'adventurer': 300,
        'hero': 800,
        'legend': 1500
      };
      
      // Get tier name and gem amount
      const tierName = tierNames[user.subscription.tier as keyof typeof tierNames] || `${user.subscription.tier.charAt(0).toUpperCase() + user.subscription.tier.slice(1)} Battle Pass`;
      const gemAmount = gemAmounts[user.subscription.tier as keyof typeof gemAmounts] || 0;
      
      // Add Battle Pass entry to history
      history.push({
        id: Date.now(),
        date: new Date(user.subscription.startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
        description: `${tierName} (${user.subscription.billingCycle})`,
        amount: user.subscription.billingCycle === 'monthly' ? gemAmount : gemAmount * 12,
        price: 0.00, // Already paid through subscription
        status: "Completed",
        receipt: true
      });
    }
    
    // For new users (with 300 gems), show welcome package
    if (user.gems === 300 && !user.premium && !user.subscription) {
      history.push({
        id: 1,
        date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
        description: "Welcome Package",
        amount: 300,
        price: 0.00,
        status: "Completed",
        receipt: false
      });
      
      return history;
    } 
    
    // Add standard purchase history for other users
    history = [
      ...history,
      {
        id: 2,
        date: new Date(currentDate.getTime() - (2 * 24 * 60 * 60 * 1000)).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
        description: "Explorer Pack",
        amount: 500,
        price: 15.00,
        status: "Completed",
        receipt: true
      },
      {
        id: 3,
        date: new Date(currentDate.getTime() - (15 * 24 * 60 * 60 * 1000)).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
        description: "Starter Pack",
        amount: 100,
        price: 5.00,
        status: "Completed",
        receipt: true
      },
      {
        id: 4,
        date: new Date(currentDate.getTime() - (25 * 24 * 60 * 60 * 1000)).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
        description: "Adventurer Pack",
        amount: 250,
        price: 10.00,
        status: "Completed",
        receipt: true
      }
    ];
    
    return history;
  };

  // Generate relevant usage history for user
  const generateUsageHistory = (user: User): UsageRecord[] => {
    const currentDate = new Date();
    
    // For new users with no stories, show no usage
    if (!user.storiesCreated || user.storiesCreated === 0) {
      return [];
    }
    
    // Calculate total purchases by scanning the purchase history
    const purchases = generatePurchaseHistory(user);
    const totalPurchased = purchases.reduce((sum, purchase) => sum + purchase.amount, 0);
    
    // The actual balance should match what's in the user object
    const currentBalance = user.gems;
    
    // Calculate what should have been used
    const shouldHaveUsed = totalPurchased - currentBalance;
    
    // If no gems have been used, return empty array
    if (shouldHaveUsed <= 0) {
      return [];
    }
    
    // Create a realistic usage history that matches the expected usage amount
    const usageItems = [
      {
        description: `Story Generation - '${user.username}'s First Tale'`,
        amount: 25
      },
      {
        description: `Character Image - 'Hero of ${user.username}'s Story'`,
        amount: 50
      },
      {
        description: `Story Continuation - '${user.username}'s First Tale'`,
        amount: 15
      },
      {
        description: "Environment Image - 'Story Setting'",
        amount: 50
      },
      {
        description: "Voice Narration - 'Story Introduction'",
        amount: 75
      },
      {
        description: "Advanced Character Customization",
        amount: 100
      }
    ];
    
    let usageHistory: UsageRecord[] = [];
    let remainingToUse = shouldHaveUsed;
    let idCounter = 1;
    
    // First, add usage items that don't exceed the total used amount
    for (const item of usageItems) {
      if (remainingToUse <= 0) break;
      
      // Don't exceed the remaining amount
      const amountToUse = Math.min(item.amount, remainingToUse);
      
      // Add usage record with date spreading back from current date
      usageHistory.push({
        id: idCounter++,
        date: new Date(currentDate.getTime() - (idCounter * 2 * 24 * 60 * 60 * 1000)).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
        description: item.description,
        amount: amountToUse,
        status: "Completed"
      });
      
      remainingToUse -= amountToUse;
    }
    
    // If we still have remaining usage to account for, add additional generic entries
    if (remainingToUse > 0) {
      // Split the remaining amount into 1-3 entries
      const chunks = remainingToUse > 150 ? 3 : remainingToUse > 50 ? 2 : 1;
      const chunkSize = Math.ceil(remainingToUse / chunks);
      
      for (let i = 0; i < chunks; i++) {
        const amountForChunk = i === chunks - 1 ? remainingToUse : chunkSize;
        
        usageHistory.push({
          id: idCounter++,
          date: new Date(currentDate.getTime() - (idCounter * 2 * 24 * 60 * 60 * 1000)).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
          description: `Story Development - Scene ${i + 1}`,
          amount: amountForChunk,
          status: "Completed"
        });
        
        remainingToUse -= amountForChunk;
      }
    }
    
    return usageHistory;
  };

  // Handle Battle Pass renewal simulation
  const handleRenewalSimulation = async () => {
    if (!user || !user.subscription) return;
    
    setIsRenewing(true);
    
    try {
      const success = await allocateBattlePassGems();
      
      if (success) {
        setRenewalSuccess(true);
        
        // Refresh purchase history
        const updatedHistory = generatePurchaseHistory(user);
        setPurchaseHistory(updatedHistory);
        
        // Hide success message after 5 seconds
        setTimeout(() => {
          setRenewalSuccess(false);
        }, 5000);
      }
    } catch (error) {
      console.error("Error simulating renewal:", error);
    } finally {
      setIsRenewing(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Show renewal success message */}
      {renewalSuccess && (
        <div className="mb-6 p-4 rounded-lg bg-green-500/20 border border-green-500/30 text-white flex items-center justify-between">
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-green-500/30 flex items-center justify-center mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="font-medium">Battle Pass Renewal Successful!</p>
              <p className="text-sm text-white/70">Your monthly gem allocation has been added to your account.</p>
            </div>
          </div>
          <button 
            onClick={() => setRenewalSuccess(false)}
            className="text-white/70 hover:text-white"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      )}

      <h1 className={`text-3xl font-bold mb-6 text-white ${currentSettings.subtitleFont}`}>My Balance</h1>
      
      {/* Current Gems Balance */}
      <div className={`${currentSettings.cardBg || "bg-black/30"} backdrop-blur-sm rounded-lg p-6 border border-white/10 mb-8 relative`}>
        <h2 className="text-2xl font-bold text-white mb-4">Current Balance</h2>
        
        <div className="flex items-center justify-center gap-4 py-6">
          <FaGem className={`h-16 w-16 ${currentSettings.featureHighlight || 'text-amber-400'}`} />
          <span className="text-6xl font-bold text-white">{balanceSummary.balance}</span>
          <span className="text-white/70 text-2xl">Gems</span>
        </div>

        <div className="flex justify-center gap-8 mb-4 text-sm">
          <div className="text-center">
            <p className="text-white/60">Total Purchased</p>
            <p className="text-white font-semibold flex items-center justify-center gap-1">
              <FaGem className={`h-3 w-3 ${currentSettings.featureHighlight || 'text-amber-400'}`} />
              {balanceSummary.purchased}
            </p>
          </div>
          <div className="text-center">
            <p className="text-white/60">Total Used</p>
            <p className="text-white font-semibold flex items-center justify-center gap-1">
              <FaGem className={`h-3 w-3 ${currentSettings.featureHighlight || 'text-amber-400'}`} />
              {balanceSummary.used}
            </p>
          </div>
        </div>
        
        {/* Show subscription info if user has one */}
        {user?.subscription && (
          <div className="mt-4 mb-6 p-4 rounded-lg bg-white/5 text-center">
            <p className="text-white/80 mb-2">Active Battle Pass</p>
            <div className="flex items-center justify-center gap-2">
              <div className="px-3 py-1 rounded-full bg-white/10 text-white font-semibold capitalize">
                {user.subscription.tier} Tier
              </div>
              <div className="px-3 py-1 rounded-full bg-white/10 text-white font-semibold capitalize">
                {user.subscription.billingCycle} Billing
              </div>
            </div>
            <p className="text-white/60 text-sm mt-2">
              Next renewal: {new Date(user.subscription.nextBillingDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
            </p>
            <div className="flex items-center justify-center gap-3 mt-3">
              <Link
                href="/user/battle-pass"
                className="text-sm text-white/70 hover:text-white underline"
              >
                Manage subscription
              </Link>
              
              {/* Simulate renewal button - for testing */}
              <button
                onClick={handleRenewalSimulation}
                disabled={isRenewing}
                className="text-sm px-3 py-1 bg-white/10 hover:bg-white/20 rounded-full text-white/70 hover:text-white flex items-center gap-1"
              >
                {isRenewing ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-1 h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    <FaRedo className="h-3 w-3 mr-1" />
                    Simulate Renewal
                  </>
                )}
              </button>
            </div>
          </div>
        )}
        
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
          {!user?.subscription && (
            <Link
              href="/user/battle-pass"
              className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-md transition-all flex items-center gap-2"
            >
              <FaCrown className="h-4 w-4" />
              <span>Get Battle Pass</span>
            </Link>
          )}
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
                    <td className="py-3 px-4">
                      {purchase.description.includes('Battle Pass') ? (
                        <div className="flex items-center gap-2">
                          <span>{purchase.description}</span>
                          <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded-full text-xs">Subscription</span>
                        </div>
                      ) : (
                        purchase.description
                      )}
                    </td>
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