"use client";

import React, { useState } from 'react';
import Link from "next/link";
import { useTheme, getStyleSettings } from "../ThemeContext";
import PageContainer from "../components/PageContainer";
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaCheck } from 'react-icons/fa';

export default function ContactUsPage() {
  const { currentStyle } = useTheme();
  const currentSettings = getStyleSettings(currentStyle);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    // Basic validation
    if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) {
      setError('Please fill in all fields');
      setIsSubmitting(false);
      return;
    }
    
    // Email validation
    if (!email.includes('@') || !email.includes('.')) {
      setError('Please enter a valid email address');
      setIsSubmitting(false);
      return;
    }
    
    try {
      // In a real app, this would send data to endlessnovel@blackcode.ch
      console.log("Contact form submitted to endlessnovel@blackcode.ch:", { name, email, subject, message });
      
      // This email submission would typically be handled by a server-side API
      // Example email content:
      const emailContent = `
        New Contact Form Submission
        
        Name: ${name}
        Email: ${email}
        Subject: ${subject}
        
        Message:
        ${message}
      `;
      
      console.log("Email content:", emailContent);
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Success case
      setSubmitted(true);
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    } catch (error) {
      setError('An error occurred while sending your message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageContainer title="Contact Us" showThemeSwitcher={false}>
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Contact Information */}
          <div className="md:col-span-1">
            <div className={`${currentSettings.cardBg || "bg-black/30"} backdrop-blur-sm rounded-lg p-6 border border-white/10 h-full`}>
              <h2 className="text-xl font-semibold text-white mb-6">Get in Touch</h2>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className={`${currentSettings.featureHighlight || 'text-amber-400'} mt-1`}>
                    <FaEnvelope className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium">Email</h3>
                    <p className="text-white/70 mt-1">endlessnovel@blackcode.ch</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className={`${currentSettings.featureHighlight || 'text-amber-400'} mt-1`}>
                    <FaPhone className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium">Phone</h3>
                    <p className="text-white/70 mt-1">+1 (555) 123-4567</p>
                    <p className="text-white/70">Mon-Fri, 9am-5pm EST</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className={`${currentSettings.featureHighlight || 'text-amber-400'} mt-1`}>
                    <FaMapMarkerAlt className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium">Address</h3>
                    <p className="text-white/70 mt-1">123 Story Lane</p>
                    <p className="text-white/70">Imagination City, IN 45678</p>
                    <p className="text-white/70">United States</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 pt-6 border-t border-white/10">
                <h3 className="text-white font-medium mb-3">Connect With Us</h3>
                <div className="flex gap-4">
                  <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className={`${currentSettings.featureHighlight || 'text-amber-400'} hover:text-white transition-colors`}>
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                    </svg>
                  </a>
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className={`${currentSettings.featureHighlight || 'text-amber-400'} hover:text-white transition-colors`}>
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                    </svg>
                  </a>
                  <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className={`${currentSettings.featureHighlight || 'text-amber-400'} hover:text-white transition-colors`}>
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
          
          {/* Contact Form */}
          <div className="md:col-span-2">
            <div className={`${currentSettings.cardBg || "bg-black/30"} backdrop-blur-sm rounded-lg p-6 border border-white/10`}>
              {submitted ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-full bg-green-500/20 mx-auto flex items-center justify-center mb-4">
                    <FaCheck className="h-8 w-8 text-green-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">Message Sent!</h2>
                  <p className="text-white/70 mb-2">
                    Thank you for contacting us. Your message has been sent to endlessnovel@blackcode.ch.
                  </p>
                  <p className="text-white/60 mb-6">
                    We'll get back to you as soon as possible.
                  </p>
                  <button 
                    onClick={() => setSubmitted(false)}
                    className={`${currentSettings.buttonColor} text-white px-6 py-2 rounded-md ${currentSettings.buttonStyle} transition-all`}
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="text-xl font-semibold text-white mb-6">Send Us a Message</h2>
                  
                  {error && (
                    <div className="bg-red-500/20 text-red-400 p-3 rounded-md mb-4">
                      {error}
                    </div>
                  )}
                  
                  <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label htmlFor="name" className="block text-white/70 mb-1 text-sm">Your Name</label>
                        <input 
                          type="text"
                          id="name"
                          className="w-full bg-white/5 border border-white/10 rounded-md p-3 text-white"
                          placeholder="John Smith"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-white/70 mb-1 text-sm">Your Email</label>
                        <input 
                          type="email"
                          id="email"
                          className="w-full bg-white/5 border border-white/10 rounded-md p-3 text-white"
                          placeholder="john@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <label htmlFor="subject" className="block text-white/70 mb-1 text-sm">Subject</label>
                      <input 
                        type="text"
                        id="subject"
                        className="w-full bg-white/5 border border-white/10 rounded-md p-3 text-white"
                        placeholder="How can we help you?"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="mb-6">
                      <label htmlFor="message" className="block text-white/70 mb-1 text-sm">Message</label>
                      <textarea 
                        id="message"
                        className="w-full bg-white/5 border border-white/10 rounded-md p-3 text-white min-h-[150px]"
                        placeholder="Tell us more about your inquiry..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        required
                      />
                    </div>
                    
                    <button 
                      type="submit"
                      disabled={isSubmitting}
                      className={`${currentSettings.buttonColor} text-white px-6 py-2 rounded-md ${currentSettings.buttonStyle} transition-all ${isSubmitting ? 'opacity-70' : ''}`}
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Sending...
                        </>
                      ) : (
                        'Send Message'
                      )}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
        
        {/* FAQ Section */}
        <div className={`${currentSettings.cardBg || "bg-black/30"} backdrop-blur-sm rounded-lg p-6 border border-white/10 mt-12`}>
          <h2 className="text-xl font-semibold text-white mb-6">Frequently Asked Questions</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-white mb-2">How quickly will you respond to my inquiry?</h3>
              <p className="text-white/70">
                We aim to respond to all inquiries within 24-48 hours during business days. For urgent matters, 
                please indicate this in your subject line.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-white mb-2">I'm having technical issues with the app. What should I do?</h3>
              <p className="text-white/70">
                For technical support, please provide details about your device, operating system, and the issue you're experiencing.
                Screenshots or screen recordings are extremely helpful for diagnosing problems.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-white mb-2">Do you offer partnerships or collaborations?</h3>
              <p className="text-white/70">
                Yes, we're open to partnerships and collaborations! Please send us details about your proposal and how it aligns with our platform's values and goals.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-white mb-2">I have a suggestion for improvement. Where can I share it?</h3>
              <p className="text-white/70">
                We love hearing suggestions from our community! Please use this contact form and select "Feature Suggestion" as the subject. 
                We review all suggestions as part of our development planning.
              </p>
            </div>
          </div>
        </div>
        
        <div className="mt-6 text-center">
          <Link 
            href="/" 
            className={`${currentSettings.buttonColor} text-white px-6 py-2 rounded-md ${currentSettings.buttonStyle} transition-all inline-block`}
          >
            Return to Home
          </Link>
        </div>
      </div>
    </PageContainer>
  );
} 