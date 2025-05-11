"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTheme, getStyleSettings } from "../../ThemeContext";
import { FaGem, FaCrown, FaShieldAlt, FaDragon, FaCheckCircle, FaCreditCard, FaInfoCircle } from 'react-icons/fa';
import { useAuth } from "../../context/AuthContext";
import { User } from "../../context/AuthContext";
import { useRouter } from "next/navigation";

// Define subscription tier types
interface SubscriptionTier {
  id: string;
  name: string;
  icon: React.ReactNode;
  monthlyPrice: number;
  yearlyPrice: number;
  monthlyGems: number;
  description: string;
  features: string[];
  recommended: boolean;
  color: string;
  gradient: string;
}

export default function BattlePassPage() {
  const { currentStyle } = useTheme();
  const currentSettings = getStyleSettings(currentStyle);
  const { user, updateUser } = useAuth();
  const router = useRouter();

  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [purchaseDetails, setPurchaseDetails] = useState<{tier: string, price: number, gems: number} | null>(null);

  // Determine theme-based accent colors
  const getThemeColor = () => {
    switch (currentStyle) {
      case 'fantasy':
        return 'amber';
      case 'scifi':
        return 'cyan';
      case 'real':
      default:
        return 'emerald';
    }
  };

  const themeColor = getThemeColor();
  
  // Subscription tiers with gamer-friendly names
  const subscriptionTiers: SubscriptionTier[] = [
    {
      id: 'adventurer',
      name: 'Adventurer',
      icon: <FaShieldAlt className="h-8 w-8" />,
      monthlyPrice: 9.99,
      yearlyPrice: 99.99,
      monthlyGems: 300,
      description: 'Perfect for casual players who want to embark on a few epic journeys each month.',
      features: [
        '300 gems monthly',
        'Up to 3 active stories',
        'Basic character customization',
        'Standard image generation',
        'Community access'
      ],
      recommended: false,
      color: `text-${themeColor}-400`,
      gradient: `from-${themeColor}-900/50 to-${themeColor}-700/30`
    },
    {
      id: 'hero',
      name: 'Hero',
      icon: <FaCrown className="h-8 w-8" />,
      monthlyPrice: 19.99,
      yearlyPrice: 199.99,
      monthlyGems: 800,
      description: 'For dedicated adventurers ready to dive deep into multiple storylines with enhanced features.',
      features: [
        '800 gems monthly',
        'Unlimited active stories',
        'Advanced character customization',
        'High-quality image generation',
        'Priority AI response times',
        'Early access to new features'
      ],
      recommended: true,
      color: `text-${themeColor}-400`,
      gradient: `from-${themeColor}-900/60 to-${themeColor}-700/40`
    },
    {
      id: 'legend',
      name: 'Legend',
      icon: <FaDragon className="h-8 w-8" />,
      monthlyPrice: 29.99,
      yearlyPrice: 299.99,
      monthlyGems: 1500,
      description: 'For the most dedicated storytellers who want the ultimate experience with exclusive perks.',
      features: [
        '1500 gems monthly',
        'Unlimited active stories',
        'Premium character customization',
        'Exclusive legendary items',
        'Advanced voice generation',
        'Custom storyline events',
        'Developer direct access',
        'Vote on future features'
      ],
      recommended: false,
      color: `text-${themeColor}-400`,
      gradient: `from-${themeColor}-900/50 to-${themeColor}-700/30`
    }
  ];

  // Calculate savings for yearly billing
  const calculateSavings = (monthlyPrice: number, yearlyPrice: number) => {
    const monthlyCostForYear = monthlyPrice * 12;
    return Math.round((1 - yearlyPrice / monthlyCostForYear) * 100);
  };

  // Handle subscription purchase
  const handlePurchase = async (tierId: string) => {
    setSelectedTier(tierId);
    
    // Find the selected tier
    const tier = subscriptionTiers.find(t => t.id === tierId);
    if (!tier) return;
    
    // Set purchase details for confirmation
    setPurchaseDetails({
      tier: tier.name,
      price: billingCycle === 'monthly' ? tier.monthlyPrice : tier.yearlyPrice,
      gems: billingCycle === 'monthly' ? tier.monthlyGems : tier.monthlyGems * 12
    });
    
    setShowConfirmation(true);
  };
  
  // Confirm purchase
  const confirmPurchase = async () => {
    if (!purchaseDetails || !selectedTier || !user) return;
    
    setIsProcessing(true);
    
    try {
      // Simulate API call to process payment
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const tier = subscriptionTiers.find(t => t.id === selectedTier);
      if (!tier) throw new Error("Selected tier not found");
      
      // Update user with the new subscription and add initial gems
      const updatedUser: User = {
        ...user,
        subscription: {
          tier: selectedTier,
          billingCycle: billingCycle,
          startDate: new Date().toISOString(),
          nextBillingDate: new Date(Date.now() + (billingCycle === 'monthly' ? 30 : 365) * 24 * 60 * 60 * 1000).toISOString()
        },
        gems: (user?.gems || 0) + (billingCycle === 'monthly' ? tier.monthlyGems : tier.monthlyGems * 12)
      };
      
      // Update user in context
      updateUser(updatedUser);
      
      // Show success message and redirect to gems details
      setTimeout(() => {
        router.push('/user/my-balance');
      }, 2000);
      
    } catch (error) {
      console.error("Error processing subscription:", error);
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Cancel confirmation
  const cancelPurchase = () => {
    setShowConfirmation(false);
    setSelectedTier(null);
    setPurchaseDetails(null);
  };

  // Check if user is already subscribed
  const isSubscribed = user?.subscription?.tier ? true : false;
  
  return (
    <div className="max-w-6xl mx-auto">
      <h1 className={`text-3xl font-bold mb-4 text-white ${currentSettings.subtitleFont}`}>Battle Pass</h1>
      
      {/* Introduction */}
      <div className={`${currentSettings.cardBg || "bg-black/30"} backdrop-blur-sm rounded-lg p-6 border border-white/10 mb-8 text-center`}>
        <h2 className="text-2xl font-bold text-white mb-2">Enhance Your Story Experience</h2>
        <p className="text-white/80 max-w-3xl mx-auto mb-4">
          Unlock the full potential of Endless Novel with our Battle Pass tiers. Each tier includes a monthly gems allowance plus exclusive features to elevate your adventures.
        </p>
        
        <div className="bg-white/10 p-4 rounded-lg inline-block mb-4">
          <p className="text-white/90 flex items-center gap-2 text-sm">
            <FaInfoCircle className={`text-${themeColor}-400`} />
            <span>With Battle Pass, you'll receive your gem allocation immediately upon purchase, and then again on each renewal date.</span>
          </p>
        </div>
        
        {/* Current subscription status */}
        {user?.subscription && (
          <div className="mt-4 p-4 rounded-lg bg-white/10 inline-block">
            <p className="text-white/90 flex items-center gap-2">
              <FaCheckCircle className="text-green-400" />
              <span>You currently have the <span className="font-bold">{user.subscription.tier.charAt(0).toUpperCase() + user.subscription.tier.slice(1)}</span> Battle Pass</span>
            </p>
          </div>
        )}
      </div>
      
      {/* Billing cycle toggle */}
      <div className="flex justify-center mb-8">
        <div className={`bg-black/40 backdrop-blur-sm rounded-full p-1 flex items-center`}>
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-6 py-2 rounded-full transition-all ${
              billingCycle === 'monthly' 
                ? `${currentSettings.buttonColor} text-white` 
                : 'text-white/60 hover:text-white'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingCycle('yearly')}
            className={`px-6 py-2 rounded-full transition-all ${
              billingCycle === 'yearly' 
                ? `${currentSettings.buttonColor} text-white` 
                : 'text-white/60 hover:text-white'
            }`}
          >
            Yearly <span className="text-xs ml-1 px-2 py-0.5 bg-green-500/20 text-green-400 rounded-full">Save up to 20%</span>
          </button>
        </div>
      </div>
      
      {/* Subscription Tiers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {subscriptionTiers.map((tier) => (
          <div
            key={tier.id}
            className={`${currentSettings.cardBg || "bg-black/30"} backdrop-blur-sm rounded-lg border ${
              tier.recommended 
                ? `border-${themeColor}-500/50` 
                : 'border-white/10'
            } overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg relative group`}
          >
            {tier.recommended && (
              <div className={`absolute top-0 right-0 ${currentSettings.buttonColor} text-white text-xs font-bold px-4 py-1 rounded-bl-lg z-10`}>
                MOST POPULAR
              </div>
            )}
            
            <div className={`h-20 bg-gradient-to-r ${tier.gradient} flex items-center justify-center`}>
              <div className="flex items-center gap-3">
                {tier.icon}
                <h3 className="text-2xl font-bold text-white">{tier.name}</h3>
              </div>
            </div>
            
            <div className="p-6">
              <div className="mb-6 text-center">
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-3xl font-bold text-white">${billingCycle === 'monthly' ? tier.monthlyPrice : tier.yearlyPrice}</span>
                  <span className="text-white/70">/{billingCycle === 'monthly' ? 'month' : 'year'}</span>
                </div>
                
                {billingCycle === 'yearly' && (
                  <div className="mt-1 text-green-400 text-sm font-medium">
                    Save {calculateSavings(tier.monthlyPrice, tier.yearlyPrice)}%
                  </div>
                )}
              </div>
              
              <div className="flex items-center justify-center gap-2 mb-6">
                <FaGem className={`h-5 w-5 ${currentSettings.featureHighlight || 'text-amber-400'}`} />
                <span className="text-xl font-bold text-white">
                  {billingCycle === 'monthly' ? tier.monthlyGems : tier.monthlyGems * 12} 
                  <span className="text-white/70 text-sm ml-1">gems {billingCycle === 'monthly' ? 'per month' : 'per year'}</span>
                </span>
              </div>
              
              {billingCycle === 'yearly' && (
                <div className="mb-4 p-2 rounded-md bg-white/10 text-sm text-white/80">
                  <p>That's {tier.monthlyGems} gems every month for 12 months</p>
                </div>
              )}
              
              <p className="text-white/70 text-sm mb-6 text-center">{tier.description}</p>
              
              <button
                onClick={() => handlePurchase(tier.id)}
                disabled={isProcessing || (isSubscribed && user?.subscription?.tier === tier.id)}
                className={`w-full py-3 px-4 rounded-md transition-all ${
                  isSubscribed && user?.subscription?.tier === tier.id
                    ? 'bg-white/10 text-white/50 cursor-not-allowed'
                    : `${currentSettings.buttonColor} text-white hover:brightness-110`
                } flex items-center justify-center gap-2`}
              >
                {isSubscribed && user?.subscription?.tier === tier.id ? (
                  'Current Plan'
                ) : (
                  <>Get {tier.name} Pass</>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {/* FAQ Section */}
      <div className={`${currentSettings.cardBg || "bg-black/30"} backdrop-blur-sm rounded-lg p-6 border border-white/10 mb-8`}>
        <h2 className={`text-2xl font-bold mb-6 text-white ${currentSettings.subtitleFont}`}>Frequently Asked Questions</h2>
        
        <div className="space-y-4">
          <div className="border border-white/10 rounded-lg p-4">
            <h3 className="text-white font-bold flex items-center gap-2 mb-2">
              <FaInfoCircle className={`text-${themeColor}-400`} />
              How does the Battle Pass work with my existing gems?
            </h3>
            <p className="text-white/80 text-sm">
              Your Battle Pass gives you a monthly allocation of gems that are automatically added to your account. These combine with any gems you've purchased separately, giving you more resources for story generation and features.
            </p>
          </div>
          
          <div className="border border-white/10 rounded-lg p-4">
            <h3 className="text-white font-bold flex items-center gap-2 mb-2">
              <FaInfoCircle className={`text-${themeColor}-400`} />
              Can I change my Battle Pass tier?
            </h3>
            <p className="text-white/80 text-sm">
              Yes! You can upgrade or downgrade your Battle Pass at any time. When upgrading, you'll be charged the prorated difference. When downgrading, your current tier benefits will continue until the end of your billing cycle.
            </p>
          </div>
          
          <div className="border border-white/10 rounded-lg p-4">
            <h3 className="text-white font-bold flex items-center gap-2 mb-2">
              <FaInfoCircle className={`text-${themeColor}-400`} />
              What happens if I cancel my Battle Pass?
            </h3>
            <p className="text-white/80 text-sm">
              If you cancel your Battle Pass, you'll retain access to all features until the end of your current billing period. You'll keep any unused gems in your account, but won't receive new monthly allocations after cancellation.
            </p>
          </div>
          
          <div className="border border-white/10 rounded-lg p-4">
            <h3 className="text-white font-bold flex items-center gap-2 mb-2">
              <FaInfoCircle className={`text-${themeColor}-400`} />
              Is there a free trial available?
            </h3>
            <p className="text-white/80 text-sm">
              New users receive 300 free gems to experience our basic features. While we don't offer a free trial of the Battle Pass, you can purchase it monthly and cancel anytime if it doesn't meet your expectations.
            </p>
          </div>
        </div>
      </div>
      
      {/* Purchase confirmation modal */}
      {showConfirmation && purchaseDetails && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`${currentSettings.cardBg || "bg-black/90"} rounded-lg p-6 border border-white/20 max-w-md w-full`}>
            <h3 className="text-xl font-bold text-white mb-4">Confirm Your Battle Pass</h3>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-white/90">
                <span>Plan:</span>
                <span className="font-semibold">{purchaseDetails.tier} ({billingCycle})</span>
              </div>
              
              <div className="flex justify-between text-white/90">
                <span>Price:</span>
                <span className="font-semibold">${purchaseDetails.price.toFixed(2)}/{billingCycle === 'monthly' ? 'month' : 'year'}</span>
              </div>
              
              <div className="flex justify-between text-white/90">
                <span>Gems included:</span>
                <span className="font-semibold">{purchaseDetails.gems} gems</span>
              </div>
              
              <div className="bg-white/10 p-3 rounded-md text-sm mb-2">
                <p className="text-white/80 flex items-start gap-2">
                  <FaInfoCircle className="text-white/60 mt-1 flex-shrink-0" />
                  <span>You'll receive {billingCycle === 'monthly' ? 'these gems now' : 'your first month\'s gems now'} and the same amount on each {billingCycle} renewal date.</span>
                </p>
              </div>
              
              <div className="border-t border-white/10 pt-2 mt-2">
                <div className="flex justify-between text-white font-bold">
                  <span>Total today:</span>
                  <span>${purchaseDetails.price.toFixed(2)}</span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={cancelPurchase}
                className="flex-1 py-2 px-4 border border-white/20 text-white/80 rounded-md hover:bg-white/10"
                disabled={isProcessing}
              >
                Cancel
              </button>
              
              <button
                onClick={confirmPurchase}
                className={`flex-1 py-2 px-4 ${currentSettings.buttonColor} text-white rounded-md flex items-center justify-center gap-2`}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>Confirm Purchase</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 