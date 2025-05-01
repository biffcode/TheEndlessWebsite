"use client";

import { useState } from "react";
import Image from "next/image";
import { useTheme, getStyleSettings } from "../../ThemeContext";
import { FaGem, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { useAuth } from "../../context/AuthContext";

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
  const { user } = useAuth();

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

  const toggleFaq = (index: number) => {
    if (expandedFaq === index) {
      setExpandedFaq(null);
    } else {
      setExpandedFaq(index);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
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
            <button className={`w-full ${currentSettings.buttonColor} text-white px-4 py-2 rounded-md ${currentSettings.buttonStyle} transition-all`}>
              Buy Now
            </button>
          </div>
        ))}
        {/* More Gems Option */}
        <div className={`${currentSettings.cardBg || "bg-black/30"} backdrop-blur-sm rounded-lg p-6 border border-dashed border-white/20 text-center flex flex-col justify-center items-center transition-colors hover:border-white/40`}>
          <h3 className="text-xl font-bold text-white mb-2">More Gems</h3>
          <p className="text-white/70 text-sm mb-1">Need a custom amount?</p>
          <p className="text-white/70 text-sm mb-4">Click below to set your package.</p>
          <button className={`w-full bg-black/30 border border-white/30 text-white px-4 py-2 rounded-md hover:bg-black/50 transition-all`}>
            Click here
          </button>
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
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" className="w-10">
            <path fill="#0052A4" d="M470.1 231.3s7.6 37.2 9.3 45H446c3.3-8.9 16-43 16-43-3.1 4-14 16.9-17.4 21.8l-4.1-23.4h-25.5l13.7 65.4h28.6c14.9-19.3 37.5-49 41.8-55.9zM576 80v352c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V80c0-26.5 21.5-48 48-48h480c26.5 0 48 21.5 48 48zM152.5 331.2L215.7 176h-42.5l-39.3 106-4.3-21.5-14-71.4c-2.3-9.9-9.4-12.7-18.2-13.1H32.7l-.7 3.1c15.8 4 29.9 9.8 42.2 17.1l35.8 135h42.5zm94.4.2L272.1 176h-40.2l-25.1 155.4h40.1zm139.9-50.8c.2-17.7-10.6-31.2-33.7-42.3-14.1-7.1-22.7-11.9-22.7-19.2.2-6.6 7.3-13.4 23.1-13.4 13.1-.3 22.7 2.8 29.9 5.9l3.6-23.6c-6.8-2.8-15.7-5.5-30-5.5-30.9 0-53 16.5-53.2 40.2-.2 17.5 15.5 27.3 27.3 33.1 12.2 5.9 16.2 9.8 16.2 14.9-.2 8-9.6 11.6-18.7 11.6-15.5 0-23.9-4.3-30.7-7.9l-3.9 25.1c6.9 3.2 19.6 6 32.8 6.1 31.1.1 51.8-15.6 52-44z"/>
          </svg>
        </div>
        <div className="p-2 bg-white rounded w-14 h-10 flex items-center justify-center" title="Mastercard">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" className="w-10">
            <path fill="#EB001B" d="M302.2 250c0 4.7-1.6 9.1-4.4 12.6-2.7 3.4-6.4 6-10.6 7.1-4.2 1-8.5.6-12.3-1.2-3.8-1.7-6.9-4.7-8.9-8.3-2-3.7-2.6-7.8-1.9-11.9.7-4 2.7-7.7 5.6-10.6 2.9-2.9 6.6-4.9 10.6-5.6 4-.7 8.2-.1 11.9 1.8 3.7 2 6.6 5.1 8.3 8.9 1.7 3.8 2.1 8.2 1.1 12.2zm-23.3 0c0 3.5 1.9 6.7 5.1 8.4 3.1 1.7 7 1.3 9.7-1 2.7-2.2 3.5-5.8 2.2-9-.7-1.7-2-3.1-3.7-4-1.7-.8-3.6-1-5.5-.6-1.9.4-3.5 1.5-4.6 3-1.2 1.6-1.8 3.5-1.8 5.5-.3-.1-.4-1.2-.4-2.3zM372 278.1c-3.8-1.8-8.1-2.2-12.2-1.2-4 1.1-7.7 3.7-10.4 7.2-2.7 3.5-4.3 7.9-4.4 12.4-.1 4.6 1.3 9.1 3.9 12.7 2.6 3.7 6.2 6.3 10.2 7.5 4 1.3 8.4 1 12.3-.6 3.9-1.6 7.2-4.6 9.4-8.3 2.1-3.7 2.8-8.1 2.1-12.3-.7-4.2-2.7-8.1-5.6-11.1-2.9-3.1-6.9-5.4-11.1-6.3h5.8zm-19.8-28.1h11.4v59.2h-11.4v-59.2zm-22.4 59.2H319c-2.7.1-5.4-.5-7.9-1.8-2.4-1.2-4.5-3.1-6-5.4-1.5-2.3-2.4-5-2.5-7.7-.2-2.8.3-5.5 1.4-8.1.5-1.1 1.1-2.2 1.8-3.2l-19.2-33h-11.9l29.1 49.4c-2.8 1.6-5.1 3.9-6.7 6.7-.1.1-.1.3-.2.4h-14.8l-16.2-28.5-3.9 3.5v25h-11.3v-59.2h11.3v19.2l20.2-19.2h13.7L266 242.8c.3.1.5.1.8.1 3.2.4 6.2 1.6 8.8 3.5l-12.5 10.8 17.8 30.7h8.4c.7 1.2 1.8 2.1 3 2.6 1.3.5 2.7.7 4.1.6h13.2c.7 1.2 1.8 2.1 3 2.6 1.3.5 2.7.7 4.1.6h11.8v11h.3zm365-88.9H593V370c-.5 4.2-2.2 8.1-4.9 11.5-2.7 3.4-6.3 6-10.4 7.5-4.1 1.5-8.5 1.7-12.8.7-4.2-1-8.1-3.2-11.1-6.3-3-3.1-5.2-7-6.2-11.3-1-4.3-.8-8.8.8-12.9 1.5-4.1 4.1-7.7 7.5-10.4 3.4-2.6 7.5-4.3 11.7-4.7 4.3-.4 8.5.5 12.3 2.5v-15.9h31.3V167.4h-25.4v62.4c-9.9-11.4-27.1-11.4-37 0-10.2 12.3-10.2 30.3 0 42.6 9.9 12.1 27.6 12.1 37.5 0v13.9h-7v-12.5c-2.1 3.5-5 6.4-8.4 8.3-3.4 2-7.3 2.9-11.2 2.9-4 0-7.8-1-11.3-2.9-3.4-1.9-6.4-4.8-8.5-8.3-2.1-3.5-3.2-7.5-3.2-11.6 0-4 1.1-8 3.2-11.6 2.1-3.5 5-6.4 8.5-8.3 3.4-1.9 7.3-2.9 11.3-2.9 3.9 0 7.7 1 11.2 2.9 3.5 1.9 6.3 4.8 8.4 8.3v-31.2c-3.7-1.9-7.7-2.9-11.8-2.9-3.9 0-7.8.8-11.4 2.4-3.6 1.6-6.8 4-9.5 6.9-2.7 3-4.7 6.5-6 10.3-1.3 3.9-1.8 8-1.5 12-.3 4 1.3 7.9 3 11.5 1.7 3.6 4.1 6.8 7.1 9.5 3 2.7 6.5 4.7 10.3 6 3.8 1.3 7.9 1.8 11.8 1.5 5.3-.4 10.4-2.2 14.8-5.2 4.4-3 7.9-7.1 10.3-11.8 0 0 .1 0 0 0v17.5h-22V196c0-15-23.8-15-23.8 0v138.4h48.9c33.1 0 33.1-50.9 0-50.9zM19.3 203.3C8.1 203.3 0 211.4 0 222.7s8.1 19.3 19.3 19.3h101.5v-.1h12.9v-38.5H19.3zm523.4 '0v38.5h58.4l-12.9 31.7h19.2l51.2-127.8h-23.1l-5.5 13.4h-21.7l-5.5-13.4h-59.1v57.6zm-322.5-31.7v-26h-14.7v126h14.7v-51.3h28.9v-16.3h-28.9v-32.4zm116.7 38.5v-.1h24v-38.5h-52.7v127.8h66.2v-38.5h-37.5v-17.6h33.8v-33.1h-33.8zM444 261.9h21.7l5.5 13.4h23.1L443.1 147.5H420l-51.2 127.8h23.1l5.5-13.4zm-2.4-61l7.2-17.4c.4-1 1.3-1.6 2.4-1.6s2 .6 2.4 1.6l7.2 17.4 2.5 6.1h-24.1l2.4-6.1zM210.3 41.3h-82c-11.2-.1-20.3 8.8-20.7 20-.4 11.3 8.5 20.7 19.8 21.1h83c11.2.1 20.3-8.8 20.7-20 .3-11.4-8.6-20.8-20-21.1h-.8zm62.2 0h-24.7v127.8h24.7V41.3zm38.4 0h-24.7v127.8h59.8v-38.5h-35.1V41.3zm-248.9 0h-62c-11.3 0-20.4 9.1-20.4 20.4 0 11.3 9.1 20.4 20.4 20.4h62c33.1 0 33.1-40.8 0-40.8zm28.9 0H65.2v38.5h25.7c11.2.1 20.3-8.8 20.7-20 .3-11.4-8.6-20.8-20-21.1h-.7zm189.3 44.8v38.5h-28.9v-32.4h-24.7v77h24.7v-26h28.9v38.2h24.7V86.1h-24.7zM19.3 175.3h95.1v-38.5H19.3C8.1 136.8 0 145 0 156.2s8.1 19.1 19.3 19.1zm248.6-38.5h-59.8v127.8h24.7v-46.2h35.1c33.2 0 33.2-81.6 0-81.6zm-35.1 67.9v-53.5h35.1c19.7 0 19.7 53.5 0 53.5h-35.1zm70.3-128.1h24.7v16.3c9.9-20.1 47.5-20.7 57.8 0 12.7-20.8 48.5-20.8 59.7 0 .7-5.5 5.4-9.7 11-9.7h13.7V127c-.5 4.2-2.2 8.2-4.9 11.5-2.7 3.4-6.2 6-10.4 7.5-4.1 1.5-8.5 1.7-12.8.7-4.2-1-8-3.2-11.1-6.3-3-3.1-5.1-7-6.1-11.3-1-4.3-.8-8.8.7-12.9 1.5-4.1 4.1-7.7 7.5-10.4 3.4-2.6 7.4-4.3 11.7-4.7 4.2-.4 8.5.5 12.3 2.5V43.1c-4.4 1.4-9.1 1.7-13.6.8-4.5-.9-8.7-2.9-12.1-5.9-3.6-3-6.4-7-8-11.4h-15.7c-1.6 4.4-4.3 8.3-8 11.3-3.5 3-7.6 5-12.1 5.9-4.5.9-9.1.5-13.5-.9v61.2c3.7-2.1 7.9-3.1 12.1-3.1 4 0 7.8.8 11.5 2.4 3.6 1.6 6.8 4 9.5 6.9 2.7 3 4.7 6.5 6 10.3 1.3 3.9 1.8 8 1.5 12-.3 4-1.3 7.9-3 11.5-1.7 3.6-4.1 6.8-7.1 9.5-3 2.7-6.5 4.7-10.3 6-3.8 1.3-7.9 1.8-11.8 1.5-5.3-.4-10.4-2.2-14.8-5.2-4.4-3-7.9-7.1-10.3-11.8 0 0-.1 0 0 0v25z"/>
          </svg>
        </div>
        <div className="p-2 bg-white rounded w-14 h-10 flex items-center justify-center" title="PayPal">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" className="w-10">
            <path fill="#003087" d="M111.4 295.9c-3.5 19.2-17.4 108.7-21.5 134-.3 1.8-1 2.5-3 2.5H12.3c-7.6 0-13.1-6.6-12.1-13.9L58.8 46.6c1.5-9.6 10.1-16.9 20-16.9 152.3 0 165.1-3.7 204 11.4 60.1 23.3 65.6 79.5 44 140.3-21.5 62.6-72.5 89.5-140.1 90.3-43.4.7-69.5-7-75.3 24.2zM357.1 152c-1.8-1.3-2.5-1.8-3 1.3-2 11.4-5.1 22.5-8.8 33.6-39.9 113.8-150.5 103.9-204.5 103.9-6.1 0-10.1 3.3-10.9 9.4-22.6 140.4-27.1 169.7-27.1 169.7-1 7.1 3.5 12.9 10.6 12.9h63.5c8.6 0 15.7-6.3 17.4-14.9.7-5.4-1.1 6.1 14.4-91.3 4.6-22 14.3-19.7 29.3-19.7 71 0 126.4-28.8 142.9-112.3 6.5-34.8 4.6-71.4-23.8-92.6z"/>
          </svg>
        </div>
        <div className="p-2 bg-white rounded w-14 h-10 flex items-center justify-center" title="Apple Pay">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" className="w-10">
            <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/>
          </svg>
        </div>
        <div className="p-2 bg-white rounded w-14 h-10 flex items-center justify-center" title="Google Pay">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512" className="w-10">
            <path fill="#4285F4" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"/>
          </svg>
        </div>
      </div>
    </div>
  );
} 