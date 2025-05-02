"use client";

import { useState, useEffect } from "react";
import { useTheme, getStyleSettings } from "../../../ThemeContext";
import { FaGem, FaArrowLeft } from "react-icons/fa";
import Link from "next/link";
import { useAuth } from "../../../context/AuthContext";
import Image from "next/image";

export default function CustomGemsPage() {
  const { currentStyle } = useTheme();
  const currentSettings = getStyleSettings(currentStyle);
  const { user, updateGems } = useAuth();
  const [gemAmount, setGemAmount] = useState<number>(100);
  const [price, setPrice] = useState<number>(5.00);
  const [purchaseInProgress, setPurchaseInProgress] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [purchasedAmount, setPurchasedAmount] = useState(0);

  // Calculate price based on gem amount
  const calculatePrice = (amount: number): number => {
    if (amount <= 100) {
      return amount * 0.05; // $0.05 per gem
    } else if (amount <= 500) {
      return amount * 0.04; // $0.04 per gem
    } else {
      return amount * 0.03; // $0.03 per gem
    }
  };

  // Update price when gem amount changes
  useEffect(() => {
    const calculatedPrice = calculatePrice(gemAmount);
    setPrice(Number(calculatedPrice.toFixed(2)));
  }, [gemAmount]);

  // Handle gem amount change
  const handleGemAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value) || 0;
    setGemAmount(Math.max(0, value)); // Ensure non-negative values
  };

  // Get price per gem based on amount
  const getPricePerGem = (amount: number): string => {
    if (amount <= 100) {
      return "$0.05";
    } else if (amount <= 500) {
      return "$0.04";
    } else {
      return "$0.03";
    }
  };

  // Handle custom gem purchase
  const handlePurchase = async () => {
    if (gemAmount <= 0) return;

    // Set purchase in progress
    setPurchaseInProgress(true);

    try {
      // In a real app, this would process payment first
      // For now, we'll simulate a successful purchase
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update the user's gems
      const success = await updateGems(gemAmount);
      
      if (success) {
        // Show success message
        setPurchasedAmount(gemAmount);
        setShowSuccessMessage(true);
        
        // Hide success message after 5 seconds
        setTimeout(() => {
          setShowSuccessMessage(false);
        }, 5000);
      }
    } catch (error) {
      console.error("Error purchasing gems:", error);
    } finally {
      setPurchaseInProgress(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Link 
          href="/user/gems"
          className={`text-white/70 hover:text-white transition-colors flex items-center gap-2`}
        >
          <FaArrowLeft />
          <span>Back to Gems</span>
        </Link>
      </div>

      <h1 className={`text-3xl font-bold mb-4 text-white ${currentSettings.subtitleFont}`}>Custom Gems Purchase</h1>
      
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
      
      <div className={`${currentSettings.cardBg || "bg-black/30"} backdrop-blur-sm rounded-lg p-6 border border-white/10 mb-8`}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column - Input and Price */}
          <div>
            <div className="mb-6">
              <label htmlFor="gemAmount" className="block text-white mb-2">Enter Gem Amount</label>
              <input
                type="number"
                id="gemAmount"
                value={gemAmount}
                onChange={handleGemAmountChange}
                min="0"
                className="w-full bg-black/30 border border-white/20 rounded-md px-4 py-2 text-white focus:outline-none focus:border-white/40"
              />
            </div>

            <div className="text-white/70 space-y-2 mb-6">
              <p>Current rate: {getPricePerGem(gemAmount)} per gem</p>
              <p>Total price: ${price.toFixed(2)}</p>
            </div>

            <button 
              onClick={handlePurchase}
              disabled={purchaseInProgress || gemAmount <= 0}
              className={`w-full ${currentSettings.buttonColor} text-white px-4 py-3 rounded-md ${currentSettings.buttonStyle} transition-all flex items-center justify-center gap-2`}
            >
              {purchaseInProgress ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                <>
                  <FaGem />
                  <span>Buy Now</span>
                </>
              )}
            </button>
          </div>

          {/* Right Column - Pricing Tiers Info */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white mb-4">Dynamic Pricing Tiers</h2>
            
            <div className={`${currentSettings.cardBg || "bg-black/40"} p-4 rounded-md border border-white/10`}>
              <div className="flex items-center gap-2 mb-2">
                <FaGem className="text-amber-400" />
                <span className="text-white font-medium">1-100 Gems</span>
              </div>
              <p className="text-white/70">$0.05 per gem</p>
            </div>

            <div className={`${currentSettings.cardBg || "bg-black/40"} p-4 rounded-md border border-white/10`}>
              <div className="flex items-center gap-2 mb-2">
                <FaGem className="text-amber-400" />
                <span className="text-white font-medium">101-500 Gems</span>
              </div>
              <p className="text-white/70">$0.04 per gem</p>
            </div>

            <div className={`${currentSettings.cardBg || "bg-black/40"} p-4 rounded-md border border-white/10`}>
              <div className="flex items-center gap-2 mb-2">
                <FaGem className="text-amber-400" />
                <span className="text-white font-medium">501+ Gems</span>
              </div>
              <p className="text-white/70">$0.03 per gem</p>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="text-center">
        <p className="text-white/70 mb-4">Secure Payment Methods</p>
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
    </div>
  );
} 