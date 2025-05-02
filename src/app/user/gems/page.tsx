"use client";

import { useState } from "react";
import Image from "next/image";
import { useTheme, getStyleSettings } from "../../ThemeContext";
import { FaGem, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { useAuth } from "../../context/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Theme-specific SVG components
type ThemeType = 'fantasy' | 'scifi' | 'real';

const BookIcon = ({ theme }: { theme: ThemeType }) => {
  const colors = {
    fantasy: "#f59e0b", // amber-500
    scifi: "#06b6d4",   // cyan-500
    real: "#10b981"     // emerald-500
  };
  
  const color = colors[theme] || colors.fantasy;
  
  return (
    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" 
        stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

const ImageIcon = ({ theme }: { theme: ThemeType }) => {
  const colors = {
    fantasy: "#f59e0b", // amber-500
    scifi: "#06b6d4",   // cyan-500
    real: "#10b981"     // emerald-500
  };
  
  const color = colors[theme] || colors.fantasy;
  
  return (
    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
        stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

const MediaIcon = ({ theme }: { theme: ThemeType }) => {
  const colors = {
    fantasy: "#f59e0b", // amber-500
    scifi: "#06b6d4",   // cyan-500
    real: "#10b981"     // emerald-500
  };
  
  const color = colors[theme] || colors.fantasy;
  
  return (
    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" 
        stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
        stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export default function GemsPage() {
  const { currentStyle } = useTheme();
  const currentSettings = getStyleSettings(currentStyle);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const { user, updateGems } = useAuth();
  const [purchaseInProgress, setPurchaseInProgress] = useState<number | null>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [purchasedAmount, setPurchasedAmount] = useState(0);
  const router = useRouter();

  // Get gems from current user
  const currentBalance = user?.gems || 0;

  const gemPackages = [
    {
      id: 1,
      title: "Starter Pack",
      amount: 100,
      price: 5.00,
      description: "perfect for quick adventures."
    },
    {
      id: 2,
      title: "Adventurer Pack",
      amount: 250,
      price: 10.00,
      description: "ideal for extended storytelling."
    },
    {
      id: 3,
      title: "Explorer Pack",
      amount: 500,
      price: 15.00,
      description: "great for dedicated creators."
    },
  ];

  const benefits = [
    {
      title: "Create Stories",
      icon: BookIcon,
      description: "Fuel your imagination with AI-powered adventures, whether starting a new journey or continuing an epic saga."
    },
    {
      title: "Generate Images",
      icon: ImageIcon,
      description: "Visualize your characters and worlds with AI-generated illustrations that bring your creations to life."
    },
    {
      title: "Audio & Video",
      icon: MediaIcon,
      description: "Bring your stories to the next level with immersive audio or video content for your characters and settings."
    }
  ];

  const whyGems = [
    { 
      title: "No Premium Features",
      description: "All users share the same tools and features. Gems are simply for powering content generation."
    },
    {
      title: "Refunds Guaranteed",
      description: "Not satisfied? We'll ensure your unused gems are refunded."
    },
    {
      title: "Unlimited Adventures",
      description: "With gems, you can dive into as many stories as you like, without limits."
    }
  ];

  const faqs = [
    {
      question: "Are gems the same as premium memberships?",
      answer: "No, there are no premium memberships. Gems are used for content generation, such as AI-powered stories, images, and media."
    },
    {
      question: "Do gems expire?",
      answer: "No, your gems never expire. Once purchased, they remain in your account until used."
    },
    {
      question: "Can I gift gems to others?",
      answer: "Yes! Share gems with friends as a way to support their creativity or help them unlock new adventures."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept major credit cards, PayPal, Apple Pay, and Google Pay. All transactions are secure and encrypted."
    }
  ];

  // Handle gem purchase
  const handlePurchase = async (packageId: number) => {
    // Find the package
    const pkg = gemPackages.find(p => p.id === packageId);
    if (!pkg) return;

    // Set purchase in progress
    setPurchaseInProgress(packageId);

    try {
      // Redirect to payment page with package information
      router.push(`/user/payment/add?package=${packageId}&amount=${pkg.amount}&price=${pkg.price}`);
    } catch (error) {
      console.error("Error navigating to payment page:", error);
      setPurchaseInProgress(null);
    }
  };

  const toggleFaq = (index: number) => {
    if (expandedFaq === index) {
      setExpandedFaq(null);
    } else {
      setExpandedFaq(index);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Success message */}
      {showSuccessMessage && (
        <div className={`mb-6 p-4 rounded-lg bg-green-500/20 border border-green-500/30 text-white flex items-center justify-between`}>
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-green-500/30 flex items-center justify-center mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="font-medium">Purchase Successful!</p>
              <p className="text-sm text-white/70">{purchasedAmount} gems have been added to your account.</p>
            </div>
          </div>
          <button 
            onClick={() => setShowSuccessMessage(false)}
            className="text-white/70 hover:text-white"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      )}

      {/* Header Section */}
      <h1 className={`text-3xl font-bold mb-4 text-white ${currentSettings.subtitleFont}`}>Buy Gems</h1>
      
      <div className={`${currentSettings.cardBg || "bg-black/30"} backdrop-blur-sm rounded-lg p-6 border border-white/10 mb-8 text-center`}>
        <p className="text-white/70 mb-2">Your Current Balance</p>
        <div className="flex items-center justify-center gap-2">
          <FaGem className={`h-10 w-10 ${currentSettings.featureHighlight || 'text-amber-400'}`} />
          <span className="text-4xl font-bold text-white">{currentBalance}</span>
          <span className="text-white/70">Gems</span>
        </div>
        <p className="text-white/50 text-sm mt-2">Use gems to generate new stories, unlock personalized content, and more.</p>
      </div>
      
      {/* Gems Pricing Tiers */}
      <h2 className={`text-2xl font-bold mb-6 text-white ${currentSettings.subtitleFont}`}>Gems Pricing Tiers</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-10">
        {gemPackages.map((pkg) => (
          <div 
            key={pkg.id} 
            className={`${currentSettings.cardBg || "bg-black/30"} backdrop-blur-sm rounded-lg p-6 border border-white/10 text-center transition-transform hover:-translate-y-1`}
          >
            <h3 className="text-xl font-bold text-white mb-2">{pkg.title}</h3>
            <div className="flex items-baseline justify-center gap-1 my-4">
              <FaGem className={`h-5 w-5 ${currentSettings.featureHighlight || 'text-amber-400'}`} />
              <span className="text-3xl font-bold text-white">{pkg.amount}</span>
              <span className="text-white/70">Gems</span>
            </div>
            <p className="text-white/70 text-sm mb-1">for just ${pkg.price.toFixed(2)}</p>
            <p className="text-white/70 text-sm mb-4">{pkg.description}</p>
            <button 
              onClick={() => handlePurchase(pkg.id)}
              disabled={purchaseInProgress !== null}
              className={`w-full ${currentSettings.buttonColor} text-white px-4 py-2 rounded-md ${currentSettings.buttonStyle} transition-all flex items-center justify-center gap-2`}
            >
              {purchaseInProgress === pkg.id ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                "Buy Now"
              )}
            </button>
          </div>
        ))}
        {/* More Gems Option */}
        <div className={`${currentSettings.cardBg || "bg-black/30"} backdrop-blur-sm rounded-lg p-6 border border-dashed border-white/20 text-center flex flex-col justify-center items-center transition-colors hover:border-white/40`}>
          <h3 className="text-xl font-bold text-white mb-2">Custom Amount</h3>
          <p className="text-white/70 text-sm mb-1">Need a specific number of gems?</p>
          <p className="text-white/70 text-sm mb-4">Choose your own amount with our dynamic pricing.</p>
          <Link 
            href="/user/gems/custom"
            className={`w-full ${currentSettings.buttonColor} text-white px-4 py-2 rounded-md ${currentSettings.buttonStyle} transition-all flex items-center justify-center gap-2`}
          >
            <FaGem className="h-4 w-4" />
            <span>Custom Gems</span>
          </Link>
        </div>
      </div>
      
      {/* What Can You Do With Gems? */}
      <h2 className={`text-2xl font-bold mb-6 text-white ${currentSettings.subtitleFont}`}>What Can You Do With Gems?</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {benefits.map((benefit, index) => (
          <div key={index} className={`${currentSettings.cardBg || "bg-black/30"} backdrop-blur-sm rounded-lg p-6 border border-white/10 text-center`}>
            <div className="flex justify-center items-center h-16 mb-4">
              {benefit.icon && <benefit.icon theme={currentStyle} />}
            </div>
            <h3 className="text-lg font-bold text-white mb-2">{benefit.title}</h3>
            <p className="text-white/70 text-sm">{benefit.description}</p>
          </div>
        ))}
      </div>

      {/* Why Gems? */}
      <h2 className={`text-2xl font-bold mb-6 text-white ${currentSettings.subtitleFont}`}>Why Gems?</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {whyGems.map((reason, index) => (
          <div key={index} className={`${currentSettings.cardBg || "bg-black/30"} backdrop-blur-sm rounded-lg p-6 border border-white/10`}>
            <h3 className="text-lg font-bold text-white mb-2">{reason.title}</h3>
            <p className="text-white/70 text-sm">{reason.description}</p>
          </div>
        ))}
      </div>
      
      {/* Community-Driven Creativity */}
      <div className={`${currentSettings.cardBg || "bg-black/30"} backdrop-blur-sm rounded-lg p-6 border border-white/10 mb-10`}>
        <h2 className={`text-2xl font-bold mb-4 text-white ${currentSettings.subtitleFont}`}>Community-Driven Creativity</h2>
        <p className="text-white/80 mb-6">We're building a platform where creators thrive:</p>
        <ul className="space-y-3 text-white/80 list-disc list-inside">
          <li>Share Your Stories: Publish your adventures in the Endless Novel Community and inspire others.</li>
          <li>Collaborate with Players: Join multiplayer modes or play as a Game Master for your friends.</li>
          <li>Earn Through Creation: Have an idea for a feature, mode, or storyline? Reach out to us—let's make it happen, and we'll even reward you for your contributions.</li>
        </ul>
      </div>

      {/* FAQ */}
      <div className={`${currentSettings.cardBg || "bg-black/30"} backdrop-blur-sm rounded-lg p-6 border border-white/10 mb-8`}>
        <h2 className={`text-2xl font-bold mb-6 text-white ${currentSettings.subtitleFont}`}>Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className={`border border-white/10 rounded-lg overflow-hidden transition-all duration-200 ${expandedFaq === index ? 'bg-white/5' : ''}`}
            >
              <button 
                onClick={() => toggleFaq(index)} 
                className="w-full text-left py-4 px-5 flex justify-between items-center"
              >
                <h3 className="text-lg font-bold text-white">Q: {faq.question}</h3>
                <span className={`transition-transform duration-200 ${expandedFaq === index ? 'rotate-180' : ''}`}>
                  <FaChevronDown className="text-white/70" />
                </span>
              </button>
              <div 
                className={`px-5 pb-4 text-white/70 text-sm overflow-hidden transition-all duration-300 ${
                  expandedFaq === index ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <p>A: {faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Methods - Optional visual flair */}
      <div className="flex flex-wrap justify-center gap-6 mb-10 opacity-60 grayscale hover:opacity-80 hover:grayscale-0 transition-all duration-300">
        <div className="p-2 bg-white rounded w-14 h-10 flex items-center justify-center" title="Visa">
          <Image src="/images/payment/visa.png" alt="Visa" width={40} height={25} className="object-contain" />
        </div>
        <div className="p-2 bg-white rounded w-14 h-10 flex items-center justify-center" title="Mastercard">
          <Image src="/images/payment/marstercard.png" alt="Mastercard" width={40} height={25} className="object-contain" />
        </div>
        <div className="p-2 bg-white rounded w-14 h-10 flex items-center justify-center" title="PayPal">
          <Image src="/images/payment/paypal.png" alt="PayPal" width={40} height={25} className="object-contain" />
        </div>
        <div className="p-2 bg-white rounded w-14 h-10 flex items-center justify-center" title="Apple Pay">
          <Image src="/images/payment/applePay.png" alt="Apple Pay" width={40} height={25} className="object-contain" />
        </div>
        <div className="p-2 bg-white rounded w-14 h-10 flex items-center justify-center" title="Google Pay">
          <Image src="/images/payment/googlePay.png" alt="Google Pay" width={40} height={25} className="object-contain" />
        </div>
      </div>
    </div>
  );
} 