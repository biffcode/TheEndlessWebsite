"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTheme, getStyleSettings } from "../../../ThemeContext";
import { FaCreditCard, FaCcVisa, FaCcMastercard, FaCcPaypal, FaCcApplePay, FaCcAmex } from 'react-icons/fa';
import { useAuth } from "../../../context/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";

export default function AddPaymentMethodPage() {
  const { currentStyle } = useTheme();
  const currentSettings = getStyleSettings(currentStyle);
  const { user, isAuthenticated, updateGems } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Get package information from URL parameters
  const packageId = searchParams.get('package');
  const gemsAmount = searchParams.get('amount') ? parseInt(searchParams.get('amount')!) : 0;
  const packagePrice = searchParams.get('price') ? parseFloat(searchParams.get('price')!) : 0;
  
  const [activeTab, setActiveTab] = useState<"card" | "paypal">("card");
  const [cardNumber, setCardNumber] = useState("");
  const [nameOnCard, setNameOnCard] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [paypalEmail, setPaypalEmail] = useState("");
  const [isDefault, setIsDefault] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Format card number with spaces
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  // Format expiry date (MM/YY)
  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.slice(0, 2) + (v.length > 2 ? '/' + v.slice(2, 4) : '');
    }
    return v;
  };

  // Handle card number input change
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    setCardNumber(formatted);
  };

  // Handle expiry date input change
  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiryDate(e.target.value);
    setExpiryDate(formatted);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    // Validate card information if on card tab
    if (activeTab === 'card') {
      if (cardNumber.replace(/\s/g, '').length < 16) {
        setError("Please enter a valid card number");
        setIsSubmitting(false);
        return;
      }
      
      if (nameOnCard.trim().length < 3) {
        setError("Please enter the name on your card");
        setIsSubmitting(false);
        return;
      }
      
      if (expiryDate.length < 5) {
        setError("Please enter a valid expiry date");
        setIsSubmitting(false);
        return;
      }
      
      if (cvv.length < 3) {
        setError("Please enter a valid CVV code");
        setIsSubmitting(false);
        return;
      }
    } else if (activeTab === 'paypal') {
      if (!paypalEmail.includes('@') || !paypalEmail.includes('.')) {
        setError("Please enter a valid email address");
        setIsSubmitting(false);
        return;
      }
    }

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // If this was from a gems purchase, add the gems to user account
      if (gemsAmount > 0 && updateGems) {
        await updateGems(gemsAmount);
      }
      
      setSuccess(true);
      
      // Redirect after successful submission
      setTimeout(() => {
        // If this was a gems purchase, redirect to gems page instead of subscription
        if (gemsAmount > 0) {
          router.push("/user/gems");
        } else {
          router.push("/user/subscription");
        }
      }, 2000);
    } catch (error) {
      console.error("Payment processing error:", error);
      setError("An error occurred while processing your payment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mb-20">
      <h1 className={`text-3xl font-bold mb-6 text-white ${currentSettings.subtitleFont}`}>Add Payment Method</h1>
      
      {success ? (
        <div className={`${currentSettings.cardBg || "bg-black/30"} backdrop-blur-sm rounded-lg p-8 border border-white/10 mb-8 text-center`}>
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-8 w-8 text-green-400" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Payment Method Added!</h2>
          {gemsAmount > 0 && (
            <p className="text-white/70 mb-2">{gemsAmount} gems have been added to your account.</p>
          )}
          <p className="text-white/70 mb-6">Your payment method has been successfully added.</p>
          <p className="text-white/70 text-sm">Redirecting to subscription page...</p>
        </div>
      ) : (
        <div className={`${currentSettings.cardBg || "bg-black/30"} backdrop-blur-sm rounded-lg p-6 border border-white/10 mb-8`}>
          {/* Payment info section */}
          {gemsAmount > 0 && packagePrice > 0 && (
            <div className="mb-6 p-4 bg-white/5 rounded-lg border border-white/10">
              <h2 className="text-xl font-semibold text-white mb-3">Payment Summary</h2>
              <div className="flex justify-between items-center py-2 border-b border-white/10">
                <span className="text-white/70">Purchase:</span>
                <span className="text-white font-medium">{gemsAmount} Gems</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-white/10">
                <span className="text-white/70">Price:</span>
                <span className="text-white font-medium">${packagePrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center py-2 mt-2">
                <span className="text-white/70 font-medium">Total:</span>
                <span className="text-white font-bold">${packagePrice.toFixed(2)}</span>
              </div>
            </div>
          )}
          
          {/* Payment method tabs */}
          <div className="flex mb-6 border-b border-white/10">
            <button 
              className={`px-4 py-2 flex items-center gap-2 ${
                activeTab === 'card' 
                  ? 'text-white border-b-2 border-white' 
                  : 'text-white/60 hover:text-white/80'
              }`}
              onClick={() => setActiveTab('card')}
            >
              <FaCreditCard />
              <span>Credit / Debit Card</span>
            </button>
            <button 
              className={`px-4 py-2 flex items-center gap-2 ${
                activeTab === 'paypal' 
                  ? 'text-white border-b-2 border-white' 
                  : 'text-white/60 hover:text-white/80'
              }`}
              onClick={() => setActiveTab('paypal')}
            >
              <FaCcPaypal />
              <span>PayPal</span>
            </button>
          </div>
          
          {error && (
            <div className="bg-red-500/20 text-red-400 p-3 rounded-md mb-4">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            {activeTab === 'card' ? (
              <div className="space-y-4">
                {/* Card logos */}
                <div className="flex gap-2 mb-4">
                  <FaCcVisa className="text-2xl text-white/80" />
                  <FaCcMastercard className="text-2xl text-white/80" />
                  <FaCcAmex className="text-2xl text-white/80" />
                </div>
                
                {/* Card number */}
                <div>
                  <label className="block text-white/70 mb-1 text-sm">Card Number</label>
                  <input 
                    type="text"
                    className="w-full bg-white/5 border border-white/10 rounded-md p-3 text-white"
                    placeholder="4242 4242 4242 4242"
                    value={cardNumber}
                    onChange={handleCardNumberChange}
                    maxLength={19}
                    required
                  />
                </div>
                
                {/* Name on card */}
                <div>
                  <label className="block text-white/70 mb-1 text-sm">Name on Card</label>
                  <input 
                    type="text"
                    className="w-full bg-white/5 border border-white/10 rounded-md p-3 text-white"
                    placeholder="John Smith"
                    value={nameOnCard}
                    onChange={(e) => setNameOnCard(e.target.value)}
                    required
                  />
                </div>
                
                {/* Expiry date and CVV */}
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-white/70 mb-1 text-sm">Expiry Date</label>
                    <input 
                      type="text"
                      className="w-full bg-white/5 border border-white/10 rounded-md p-3 text-white"
                      placeholder="MM/YY"
                      value={expiryDate}
                      onChange={handleExpiryDateChange}
                      maxLength={5}
                      required
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-white/70 mb-1 text-sm">CVV</label>
                    <input 
                      type="text"
                      className="w-full bg-white/5 border border-white/10 rounded-md p-3 text-white"
                      placeholder="123"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                      maxLength={4}
                      required
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-center mb-6">
                  <div className="p-3 bg-white rounded-lg">
                    <FaCcPaypal className="text-4xl text-[#003087]" />
                  </div>
                </div>
                
                <div>
                  <label className="block text-white/70 mb-1 text-sm">PayPal Email</label>
                  <input 
                    type="email"
                    className="w-full bg-white/5 border border-white/10 rounded-md p-3 text-white"
                    placeholder="example@email.com"
                    value={paypalEmail}
                    onChange={(e) => setPaypalEmail(e.target.value)}
                    required
                  />
                </div>
                
                <p className="text-white/60 text-sm italic">
                  You will be redirected to PayPal to complete the connection after submission.
                </p>
              </div>
            )}
            
            {/* Set as default payment method */}
            <div className="mt-4 flex items-center">
              <input 
                type="checkbox" 
                id="defaultPayment" 
                checked={isDefault}
                onChange={() => setIsDefault(!isDefault)}
                className="mr-2"
              />
              <label htmlFor="defaultPayment" className="text-white/70 text-sm">
                Set as default payment method
              </label>
            </div>
            
            {/* Submit button */}
            <div className="mt-6 flex gap-4">
              <button 
                type="submit"
                disabled={isSubmitting}
                className={`${currentSettings.buttonColor} text-white px-6 py-2 rounded-md ${currentSettings.buttonStyle} transition-all flex items-center gap-2 ${isSubmitting ? 'opacity-70' : ''}`}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    <FaCreditCard />
                    {gemsAmount > 0 ? `Complete Purchase` : `Add Payment Method`}
                  </>
                )}
              </button>
              
              <Link 
                href={gemsAmount > 0 ? "/user/gems" : "/user/subscription"} 
                className="bg-white/5 hover:bg-white/10 text-white px-6 py-2 rounded-md transition-all"
              >
                Cancel
              </Link>
            </div>
          </form>
          
          {/* Security notice */}
          <div className="mt-8 text-center text-white/60 text-sm flex flex-col items-center gap-2">
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>Your payment information is encrypted and secure</span>
            </div>
            <p>We use industry-standard encryption to protect your data</p>
          </div>
        </div>
      )}
    </div>
  );
} 