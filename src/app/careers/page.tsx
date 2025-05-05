"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTheme, getStyleSettings } from "../ThemeContext";
import Header from "../components/Header";
import Footer from "../components/Footer";

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
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Application submitted:", formData);
    setSubmitted(true);
  };
  
  const positions = [
    {
      id: "developer",
      title: "Game Developer",
      description: "Join our team building the future of interactive storytelling. Expertise in Unity or Unreal Engine is preferred.",
      requirements: ["3+ years of game development experience", "Proficiency in C# or C++", "Experience with Unity or Unreal Engine", "Strong problem-solving skills"]
    },
    {
      id: "writer",
      title: "Narrative Designer",
      description: "Create compelling stories and characters that bring our interactive fiction to life.",
      requirements: ["Experience in narrative design for games", "Strong storytelling abilities", "Understanding of interactive fiction mechanics", "Excellent writing and editing skills"]
    },
    {
      id: "artist",
      title: "UI/UX Designer",
      description: "Design beautiful and intuitive interfaces for our next-generation storytelling platform.",
      requirements: ["3+ years of UI/UX design experience", "Proficiency with design tools like Figma", "Understanding of game UI best practices", "Portfolio demonstrating strong design skills"]
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
                    className={`p-4 rounded-lg cursor-pointer transition-all ${
                      formData.position === position.id 
                        ? `${currentSettings.themeColor.replace('from-', 'bg-').replace('to-', '')}/50 border ${currentSettings.inputBorder}` 
                        : 'bg-black/20 hover:bg-black/40'
                    }`}
                    onClick={() => setFormData(prev => ({ ...prev, position: position.id }))}
                  >
                    <h3 className="text-xl font-bold text-white">{position.title}</h3>
                    <p className="text-white/80 text-sm mb-2">{position.description}</p>
                    
                    <div className="mt-2">
                      <span className="text-white/70 text-xs">Requirements:</span>
                      <ul className="list-disc list-inside text-white/70 text-xs">
                        {position.requirements.map((req, index) => (
                          <li key={index}>{req}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Application Form */}
            <div className="bg-black/30 backdrop-blur-sm rounded-lg p-6">
              <h2 className={`text-2xl font-bold text-white mb-4 ${currentSettings.subtitleFont}`}>Apply Now</h2>
              
              {!submitted ? (
                <>
                  <p className="text-white/90 mb-4">
                    Selected position: <span className="font-bold">{selectedPosition?.title}</span>
                  </p>
                  
                  <form onSubmit={handleSubmit} className="space-y-4">
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
                      <div className="relative flex items-center">
                        <input
                          type="file"
                          id="resume"
                          name="resume"
                          onChange={handleFileChange}
                          accept=".pdf,.doc,.docx"
                          required
                          className="sr-only"
                        />
                        <label 
                          htmlFor="resume" 
                          className={`inline-block cursor-pointer px-4 py-2 rounded-md ${currentSettings.buttonColor} text-white ${currentSettings.buttonStyle} ${currentSettings.buttonHoverEffect} transition-all text-sm`}
                        >
                          Choose File
                        </label>
                        {formData.resume ? (
                          <span className="ml-3 text-white/80">
                            {formData.resume.name}
                          </span>
                        ) : (
                          <span className="ml-3 text-yellow-300/90 text-sm italic">
                            * Please upload your resume (required)
                          </span>
                        )}
                      </div>
                      <p className="text-white/50 text-xs mt-1">Accepted formats: PDF, DOC, DOCX</p>
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
                        className={`${currentSettings.buttonColor} text-white px-8 py-3 rounded-md ${currentSettings.buttonStyle} ${currentSettings.buttonHoverEffect} w-full transition-all`}
                      >
                        Submit Application
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
                  <p className="text-white/90">
                    Thank you for your interest in joining our team. We'll review your application and contact you soon.
                  </p>
                </div>
              )}
            </div>
          </div>
          
          {/* Company Culture Section */}
          <div className="bg-black/30 backdrop-blur-sm rounded-lg p-6 mb-8">
            <h2 className={`text-2xl font-bold text-white mb-4 ${currentSettings.subtitleFont}`}>Our Culture</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-white/90 mb-4">
                  At Endless Novel, we believe in:
                </p>
                
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <svg className={`w-5 h-5 ${currentSettings.menuTextColor} mr-2 mt-1`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span className="text-white/90">Creating an inclusive environment where diverse perspectives thrive</span>
                  </li>
                  <li className="flex items-start">
                    <svg className={`w-5 h-5 ${currentSettings.menuTextColor} mr-2 mt-1`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span className="text-white/90">Balancing innovation with sustainability and work-life harmony</span>
                  </li>
                  <li className="flex items-start">
                    <svg className={`w-5 h-5 ${currentSettings.menuTextColor} mr-2 mt-1`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span className="text-white/90">Continuous learning and professional development</span>
                  </li>
                  <li className="flex items-start">
                    <svg className={`w-5 h-5 ${currentSettings.menuTextColor} mr-2 mt-1`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span className="text-white/90">Empowering team members to take ownership and make an impact</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <p className="text-white/90 mb-4">
                  Benefits include:
                </p>
                
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <svg className={`w-5 h-5 ${currentSettings.menuTextColor} mr-2 mt-1`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span className="text-white/90">Competitive salary and equity packages</span>
                  </li>
                  <li className="flex items-start">
                    <svg className={`w-5 h-5 ${currentSettings.menuTextColor} mr-2 mt-1`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span className="text-white/90">Flexible remote work options</span>
                  </li>
                  <li className="flex items-start">
                    <svg className={`w-5 h-5 ${currentSettings.menuTextColor} mr-2 mt-1`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span className="text-white/90">Health, dental, and vision insurance</span>
                  </li>
                  <li className="flex items-start">
                    <svg className={`w-5 h-5 ${currentSettings.menuTextColor} mr-2 mt-1`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span className="text-white/90">Professional development budget</span>
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