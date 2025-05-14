"use client";

import React from 'react';
import Link from "next/link";
import { useTheme, getStyleSettings } from "../ThemeContext";
import PageContainer from "../components/PageContainer";

export default function PrivacyPolicyPage() {
  const { currentStyle } = useTheme();
  const currentSettings = getStyleSettings(currentStyle);

  return (
    <PageContainer title="Privacy Policy" showThemeSwitcher={false}>
      <div className="max-w-4xl mx-auto px-4">
        <div className={`${currentSettings.cardBg || "bg-black/30"} backdrop-blur-sm rounded-lg p-6 border border-white/10 mb-8`}>
          <p className="text-white/80 mb-6">
            Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
          
          <div className="space-y-6 text-white/80">
            <section>
              <h2 className="text-xl font-semibold text-white mb-3">Introduction</h2>
              <p>
                At Endless Novel, we respect your privacy and are committed to protecting your personal data. 
                This Privacy Policy will inform you about how we look after your personal data when you visit our website 
                and tell you about your privacy rights and how the law protects you.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-white mb-3">Information We Collect</h2>
              <p className="mb-3">
                We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:
              </p>
              <ul className="list-disc list-inside space-y-2 pl-4">
                <li><strong>Identity Data</strong> includes first name, last name, username or similar identifier.</li>
                <li><strong>Contact Data</strong> includes email address and optional phone number.</li>
                <li><strong>Technical Data</strong> includes internet protocol (IP) address, browser type and version, time zone setting and location, operating system and platform, and other technology on the devices you use to access this website.</li>
                <li><strong>Usage Data</strong> includes information about how you use our website, products and services.</li>
                <li><strong>Content Data</strong> includes stories, characters, and other creative content you generate using our platform.</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-white mb-3">How We Use Your Information</h2>
              <p className="mb-3">
                We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
              </p>
              <ul className="list-disc list-inside space-y-2 pl-4">
                <li>To register you as a new customer.</li>
                <li>To process and deliver your requests, including managing payments.</li>
                <li>To manage our relationship with you.</li>
                <li>To personalize your experience and deliver content relevant to your interests.</li>
                <li>To improve our website, products/services, and customer relationships.</li>
                <li>To protect our rights or property, and to protect the safety of our users.</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-white mb-3">Data Security</h2>
              <p>
                We have implemented appropriate security measures to prevent your personal data from being accidentally lost, used, 
                accessed in an unauthorized way, altered, or disclosed. We limit access to your personal data to those employees, agents, 
                contractors and other third parties who have a business need to know. They will only process your personal data on our 
                instructions and they are subject to a duty of confidentiality.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-white mb-3">Your Legal Rights</h2>
              <p className="mb-3">
                Under certain circumstances, you have rights under data protection laws in relation to your personal data, including the right to:
              </p>
              <ul className="list-disc list-inside space-y-2 pl-4">
                <li>Request access to your personal data.</li>
                <li>Request correction of your personal data.</li>
                <li>Request erasure of your personal data.</li>
                <li>Object to processing of your personal data.</li>
                <li>Request restriction of processing your personal data.</li>
                <li>Request transfer of your personal data.</li>
                <li>Right to withdraw consent.</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-white mb-3">Cookie Policy</h2>
              <p>
                Cookies are small text files that are placed on your computer or mobile device when you browse websites.
                We use cookies to enhance your browsing experience, understand how our website is used, and to personalize content for you.
                You can set your browser to refuse all or some browser cookies, or to alert you when websites set or access cookies.
                If you disable or refuse cookies, please note that some parts of this website may become inaccessible or not function properly.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-white mb-3">Changes to the Privacy Policy</h2>
              <p>
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page
                and updating the "Last Updated" date at the top of this Privacy Policy. You are advised to review this Privacy Policy periodically for any changes.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-white mb-3">Contact Us</h2>
              <p className="mb-3">
                If you have any questions about this Privacy Policy, please contact us:
              </p>
              <ul className="list-disc list-inside space-y-2 pl-4">
                <li>By email: endlessnovel@blackcode.ch</li>
                <li>By visiting our <Link href="/contact-us" className="text-blue-400 hover:text-blue-300 underline">contact page</Link></li>
              </ul>
            </section>
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