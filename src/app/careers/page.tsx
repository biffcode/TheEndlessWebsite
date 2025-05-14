"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTheme, getStyleSettings } from "../ThemeContext";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { initEmailJS, sendCareerEmail } from '../utils/emailService';

export default function Careers() {
  const { currentStyle, setCurrentStyle } = useTheme();
  const currentSettings = getStyleSettings(currentStyle);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    resume: null as File | null,
    position: "developer",
    message: ""
  });
  
  const [submitted, setSubmitted] = useState(false);
  const [expandedPosition, setExpandedPosition] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  // Initialize EmailJS
  useEffect(() => {
    initEmailJS();
  }, []);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      resume: e.target.files ? e.target.files[0] : null
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      // Send career application using EmailJS
      console.log("Sending job application to endlessnovel@blackcode.ch:", formData);
      
      const result = await sendCareerEmail(formData);
      
      if (!result.success) {
        throw new Error('Failed to send application');
      }
      
      setSubmitted(true);
    } catch (error) {
      setError('An error occurred while sending your application. Please try again.');
      console.error('Error sending application:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const togglePosition = (positionId: string) => {
    if (expandedPosition === positionId) {
      setExpandedPosition(null);
    } else {
      setExpandedPosition(positionId);
      setFormData(prev => ({
        ...prev,
        position: positionId
      }));
    }
  };
  
  const positions = [
    {
      id: "developer",
      title: "Game Developer",
      description: "Join our team building the future of interactive storytelling with AI game engines.",
      requirements: ["Passionate about gaming and AI", "Experience with Python is a plus", "Willing to vibe code", "Self-motivated"]
    },
    {
      id: "promptEngineer",
      title: "Prompt Engineer",
      description: "Design and optimize prompts to get the best results from our AI storytelling systems.",
      requirements: ["Interest in AI models and how they work", "Creative problem-solving skills", "Willing to experiment and iterate", "Self-driven"]
    },
    {
      id: "writer",
      title: "Narrative Designer",
      description: "Create compelling stories and characters that bring our interactive fiction to life.",
      requirements: ["Passion for storytelling and gaming", "Understanding of narrative structures", "Creative writing abilities", "Interest in AI-driven storytelling"]
    },
    {
      id: "artist",
      title: "UI/UX Designer",
      description: "Design beautiful and intuitive interfaces for our next-generation storytelling platform.",
      requirements: ["Eye for design and user experience", "Interest in gaming interfaces", "Creative vision", "Ability to work independently"]
    }
  ];
  
  const selectedPosition = positions.find(pos => pos.id === formData.position);
  
  return (
    <main className="relative min-h-screen flex flex-col overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out"
          style={{ backgroundImage: `url(${currentSettings.bgImage})` }}
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className={`absolute inset-0 bg-gradient-to-b ${currentSettings.themeColor} opacity-25`} />
      </div>

      {/* Header */}
      <Header />

      {/* Content */}
      <section className="relative z-10 flex flex-col items-center justify-center flex-1 px-4 py-8 pt-28 md:pt-32">
        <h1 className={`text-4xl font-bold mb-4 text-white drop-shadow-lg ${currentSettings.subtitleFont}`}>Join Our Team</h1>
        
        <div className="max-w-6xl mx-auto w-full">
          {/* Career Introduction */}
          <div className="mb-8">
            <div className={`${currentSettings.formBg} rounded-lg p-6 backdrop-blur-sm`}>
              <h2 className={`text-2xl font-bold text-white mb-4 ${currentSettings.subtitleFont}`}>Careers at Endless Novel</h2>
              
              <p className="text-white/90 mb-4">
                We're building the future of interactive storytelling, and we need passionate, creative minds to join us on this journey.
                At Endless Novel, you'll work with cutting-edge AI technology to create immersive narratives that adapt to each player's choices.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                <div className="bg-black/20 p-4 rounded-lg">
                  <h3 className="text-xl font-bold text-white mb-2">Innovation</h3>
                  <p className="text-white/80">Work with cutting-edge AI technology to push the boundaries of interactive storytelling.</p>
                </div>
                
                <div className="bg-black/20 p-4 rounded-lg">
                  <h3 className="text-xl font-bold text-white mb-2">Creativity</h3>
                  <p className="text-white/80">Express your creativity in a collaborative environment that values bold ideas.</p>
                </div>
                
                <div className="bg-black/20 p-4 rounded-lg">
                  <h3 className="text-xl font-bold text-white mb-2">Growth</h3>
                  <p className="text-white/80">Develop your skills and grow with a company that's redefining digital entertainment.</p>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-black/20 rounded-lg border border-purple-500/30">
                <h3 className="text-xl font-bold text-white mb-2">Who We're Looking For</h3>
                <p className="text-white/80 mb-4">
                  We're a young team looking for passionate people. No experience required, juniors welcome!
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <div className={`flex items-center justify-center rounded-full w-8 h-8 mr-3 ${currentSettings.buttonColor} bg-opacity-20`}>
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
                        </svg>
                      </div>
                      <span className="text-white/80">Experience with Python is a plus</span>
                    </div>
                    <div className="flex items-center">
                      <div className={`flex items-center justify-center rounded-full w-8 h-8 mr-3 ${currentSettings.buttonColor} bg-opacity-20`}>
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                        </svg>
                      </div>
                      <span className="text-white/80">Willing to vibe code</span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <div className={`flex items-center justify-center rounded-full w-8 h-8 mr-3 ${currentSettings.buttonColor} bg-opacity-20`}>
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                        </svg>
                      </div>
                      <span className="text-white/80">Passionate about AI</span>
                    </div>
                    <div className="flex items-center">
                      <div className={`flex items-center justify-center rounded-full w-8 h-8 mr-3 ${currentSettings.buttonColor} bg-opacity-20`}>
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"></path>
                        </svg>
                      </div>
                      <span className="text-white/80">Passionate about gaming</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Open Positions Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="bg-black/30 backdrop-blur-sm rounded-lg p-6">
              <h2 className={`text-2xl font-bold text-white mb-4 ${currentSettings.subtitleFont}`}>Open Positions</h2>
              
              <div className="space-y-4">
                {positions.map(position => (
                  <div 
                    key={position.id}
                    className={`p-4 rounded-lg transition-all duration-300 ${
                      expandedPosition === position.id 
                        ? `${currentSettings.themeColor.replace('from-', 'bg-').replace('to-', '')}/50 border ${currentSettings.inputBorder}` 
                        : 'bg-black/20 hover:bg-black/40'
                    }`}
                  >
                    <div 
                      className="flex justify-between items-center cursor-pointer"
                      onClick={() => togglePosition(position.id)}
                    >
                      <h3 className="text-xl font-bold text-white">{position.title}</h3>
                      <svg 
                        className={`w-5 h-5 text-white transition-transform duration-300 ${expandedPosition === position.id ? 'transform rotate-180' : ''}`} 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24" 
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                      </svg>
                    </div>
                    
                    <p className="text-white/80 text-sm mt-2">{position.description}</p>
                    
                    <div className={`mt-4 overflow-hidden transition-all duration-300 ${
                      expandedPosition === position.id ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0'
                    }`}>
                      <div className="pt-2 border-t border-white/10">
                        <span className="text-white/70 text-sm">Requirements:</span>
                        <ul className="list-disc list-inside text-white/70 text-sm mt-2 space-y-1">
                          {position.requirements.map((req, index) => (
                            <li key={index}>{req}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Application Form */}
            <div id="application-form" className="bg-black/30 backdrop-blur-sm rounded-lg p-6">
              <h2 className={`text-2xl font-bold text-white mb-4 ${currentSettings.subtitleFont}`}>Apply Now</h2>
              
              {!submitted ? (
                <>
                  <p className="text-white/90 mb-4">
                    Selected position: <span className="font-bold">{selectedPosition?.title}</span>
                  </p>
                  
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                      <div className="bg-red-500/20 text-red-400 p-3 rounded-md mb-4">
                        {error}
                      </div>
                    )}
                    
                    <div>
                      <label htmlFor="name" className="block text-white mb-2">Full Name</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="John Doe"
                        required
                        className={`w-full px-4 py-2 rounded-md bg-black/20 text-white border ${currentSettings.inputBorder} placeholder-white/50 ${currentSettings.inputFocus} focus:ring focus:outline-none transition-all`}
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-white mb-2">Email Address</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="your@email.com"
                        required
                        className={`w-full px-4 py-2 rounded-md bg-black/20 text-white border ${currentSettings.inputBorder} placeholder-white/50 ${currentSettings.inputFocus} focus:ring focus:outline-none transition-all`}
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="resume" className="block text-white mb-2">Resume/CV</label>
                      <div className="flex flex-row">
                        <input
                          type="file"
                          id="resume"
                          name="resume"
                          onChange={handleFileChange}
                          accept=".pdf,.doc,.docx"
                          required
                          className="sr-only"
                        />
                        <div className="flex-shrink-0">
                          <label 
                            htmlFor="resume" 
                            className={`inline-flex items-center justify-center cursor-pointer px-4 py-2 rounded-md ${currentSettings.buttonColor} text-white ${currentSettings.buttonStyle} ${currentSettings.buttonHoverEffect} transition-all text-sm`}
                          >
                            Choose File
                          </label>
                        </div>
                        
                        <div className="ml-3 flex flex-col">
                          {formData.resume ? (
                            <span className="text-white/80 text-sm truncate">
                              {formData.resume.name}
                            </span>
                          ) : (
                            <>
                              <span className="text-yellow-300/90 text-sm italic">
                                * Please upload your resume (required)
                              </span>
                              <p className="text-white/50 text-xs">Accepted formats: PDF, DOC, DOCX</p>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="message" className="block text-white mb-2">Cover Letter / Additional Information</label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="Tell us why you're a great fit for this position..."
                        rows={4}
                        className={`w-full px-4 py-2 rounded-md bg-black/20 text-white border ${currentSettings.inputBorder} placeholder-white/50 ${currentSettings.inputFocus} focus:ring focus:outline-none transition-all`}
                      />
                    </div>
                    
                    <div className="pt-2">
                      <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className={`${currentSettings.buttonColor} text-white px-8 py-3 rounded-md ${currentSettings.buttonStyle} ${currentSettings.buttonHoverEffect} w-full transition-all`}
                      >
                        {isSubmitting ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Submitting...
                          </>
                        ) : (
                          "Submit Application"
                        )}
                      </button>
                    </div>
                  </form>
                </>
              ) : (
                <div className="text-center py-8">
                  <div className={`inline-block rounded-full ${currentSettings.buttonColor} bg-opacity-20 p-4 mb-4`}>
                    <svg className={`w-12 h-12 ${currentSettings.menuTextColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Application Submitted!</h3>
                  <p className="text-white/90 mb-2">
                    Thank you for your interest in joining our team. Your application has been sent to endlessnovel@blackcode.ch.
                  </p>
                  <p className="text-white/70">
                    We'll review your application and contact you soon.
                  </p>
                </div>
              )}
            </div>
          </div>
          
          {/* Company Culture Section */}
          <div className="bg-black/30 backdrop-blur-sm rounded-lg p-6 mb-8">
            <h2 className={`text-2xl font-bold text-white mb-4 ${currentSettings.subtitleFont}`}>Our Culture</h2>
            
            <p className="text-white/90 mb-6">
              At our core, we thrive on creativity, innovation, and passion. Here's what makes us unique:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <svg className={`w-5 h-5 ${currentSettings.menuTextColor} mr-2 mt-1 flex-shrink-0`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span className="text-white/90"><span className="font-bold">No HR Department:</span> We believe in self-management and autonomy.</span>
                  </li>
                  <li className="flex items-start">
                    <svg className={`w-5 h-5 ${currentSettings.menuTextColor} mr-2 mt-1 flex-shrink-0`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span className="text-white/90"><span className="font-bold">Work From Home, At Your Own Pace:</span> Flexibility is key.</span>
                  </li>
                  <li className="flex items-start">
                    <svg className={`w-5 h-5 ${currentSettings.menuTextColor} mr-2 mt-1 flex-shrink-0`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span className="text-white/90"><span className="font-bold">Passionate About Gaming and Storytelling:</span> We live and breathe creativity.</span>
                  </li>
                  <li className="flex items-start">
                    <svg className={`w-5 h-5 ${currentSettings.menuTextColor} mr-2 mt-1 flex-shrink-0`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span className="text-white/90"><span className="font-bold">AI Enthusiasts:</span> We're on a mission to turn AI into the ultimate game engine.</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <svg className={`w-5 h-5 ${currentSettings.menuTextColor} mr-2 mt-1 flex-shrink-0`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span className="text-white/90"><span className="font-bold">Pure Meritocracy:</span> Results are what matter; no bureaucracy, no nonsense.</span>
                  </li>
                  <li className="flex items-start">
                    <svg className={`w-5 h-5 ${currentSettings.menuTextColor} mr-2 mt-1 flex-shrink-0`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span className="text-white/90"><span className="font-bold">Empowerment Through Action:</span> Power belongs to those who build and do.</span>
                  </li>
                  <li className="flex items-start">
                    <svg className={`w-5 h-5 ${currentSettings.menuTextColor} mr-2 mt-1 flex-shrink-0`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span className="text-white/90"><span className="font-bold">AI Tools:</span> We provide the resources you need to succeed.</span>
                  </li>
                  <li className="flex items-start">
                    <svg className={`w-5 h-5 ${currentSettings.menuTextColor} mr-2 mt-1 flex-shrink-0`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span className="text-white/90"><span className="font-bold">Professional Development:</span> Continuous growth opportunities for passionate learners.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          {/* Call to Action */}
          <div className="text-center">
            <p className="text-white/90 mb-4">
              Don't see a position that matches your skills? We're always looking for talented individuals.
            </p>
            <Link 
              href="/contact-us" 
              className={`${currentSettings.buttonColor} text-white px-8 py-3 rounded-md ${currentSettings.buttonStyle} ${currentSettings.buttonHoverEffect} inline-flex items-center space-x-2 transition-all`}
            >
              <span>Contact Us</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
              </svg>
            </Link>
          </div>
        </div>
      </section>
      
      <Footer />
    </main>
  );
} 