"use client";

import React from 'react';
import Link from "next/link";
import { useTheme, getStyleSettings } from "../ThemeContext";
import PageContainer from "../components/PageContainer";

export default function TermsOfServicePage() {
  const { currentStyle } = useTheme();
  const currentSettings = getStyleSettings(currentStyle);

  return (
    <PageContainer title="Terms of Service" showThemeSwitcher={false}>
      <div className="max-w-4xl mx-auto px-4">
        <div className={`${currentSettings.cardBg || "bg-black/30"} backdrop-blur-sm rounded-lg p-6 border border-white/10 mb-8`}>
          <p className="text-white/80 mb-6">
            Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
          
          <div className="space-y-6 text-white/80">
            <section>
              <h2 className="text-xl font-semibold text-white mb-3">Introduction</h2>
              <p>
                Welcome to Endless Novel. These Terms of Service ("Terms") govern your use of the Endless Novel website, 
                application, and services (collectively, the "Services") operated by Endless Novel ("we," "us," or "our"). 
                By accessing or using our Services, you agree to be bound by these Terms. If you do not agree to these Terms, 
                please do not use our Services.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-white mb-3">Account Registration</h2>
              <p className="mb-3">
                To access certain features of our Services, you may be required to register for an account. When you register, 
                you agree to provide accurate, current, and complete information about yourself as prompted by our registration form.
              </p>
              <p>
                You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. 
                You agree to notify us immediately of any unauthorized use of your account or any other breach of security.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-white mb-3">User Content</h2>
              <p className="mb-3">
                Our Services allow you to create, publish, store, and share content, including stories, characters, images, and other materials ("User Content").
                You retain ownership of any intellectual property rights that you hold in your User Content. By posting User Content on or through our Services,
                you grant us a worldwide, non-exclusive, royalty-free license to use, copy, modify, distribute, publish, and process your User Content for the 
                purpose of providing and improving our Services.
              </p>
              <p>
                You are solely responsible for your User Content and the consequences of posting or publishing it. By uploading User Content, you represent and warrant that:
              </p>
              <ul className="list-disc list-inside space-y-2 pl-4 mt-3">
                <li>You own or have obtained all necessary rights and permissions to use and share the User Content.</li>
                <li>Your User Content does not violate any third-party rights, including intellectual property rights and privacy rights.</li>
                <li>Your User Content complies with these Terms and all applicable laws and regulations.</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-white mb-3">Acceptable Use</h2>
              <p className="mb-3">
                You agree not to use our Services to:
              </p>
              <ul className="list-disc list-inside space-y-2 pl-4">
                <li>Violate any applicable laws or regulations.</li>
                <li>Infringe upon the rights of others, including intellectual property rights.</li>
                <li>Post or transmit any content that is unlawful, harmful, threatening, abusive, harassing, defamatory, vulgar, obscene, or otherwise objectionable.</li>
                <li>Impersonate any person or entity or falsely state or otherwise misrepresent your affiliation with a person or entity.</li>
                <li>Engage in any activity that could disable, overburden, damage, or impair our Services.</li>
                <li>Attempt to gain unauthorized access to any part of our Services or any systems or networks connected to our Services.</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-white mb-3">Payments and Subscriptions</h2>
              <p className="mb-3">
                We offer various payment options, including one-time purchases and subscriptions. By making a purchase or subscribing to our Services,
                you agree to pay all charges associated with your account.
              </p>
              <p className="mb-3">
                For subscriptions, you authorize us to charge your payment method on a recurring basis until you cancel. You can cancel your subscription
                at any time, but no refunds will be provided for the current billing period.
              </p>
              <p>
                All purchases of virtual goods, such as Gems or other in-app currency, are final and non-refundable except as required by applicable law.
                Virtual goods have no monetary value and cannot be exchanged for cash or any other form of currency.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-white mb-3">Intellectual Property</h2>
              <p>
                The Services and all content and materials included on the Services, including without limitation the Endless Novel name, logo, and all designs,
                text, graphics, pictures, information, data, software, sound files, and other files (collectively, "Content"), are the property of Endless Novel
                or our licensors and are protected by copyright, trademark, and other intellectual property laws. You may not use, reproduce, distribute, modify,
                create derivative works of, publicly display, or publicly perform any Content except as expressly permitted in these Terms.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-white mb-3">Termination</h2>
              <p>
                We may suspend or terminate your access to our Services at any time, without notice or liability, for any reason, including if you violate these Terms.
                Upon termination, your right to use our Services will immediately cease, and you must cease all use of our Services and delete all copies of any Content
                in your possession.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-white mb-3">Disclaimer of Warranties</h2>
              <p>
                THE SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT ANY WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED.
                TO THE FULLEST EXTENT PERMITTED BY LAW, WE DISCLAIM ALL WARRANTIES, INCLUDING, BUT NOT LIMITED TO, IMPLIED WARRANTIES OF MERCHANTABILITY,
                FITNESS FOR A PARTICULAR PURPOSE, TITLE, AND NON-INFRINGEMENT.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-white mb-3">Limitation of Liability</h2>
              <p>
                TO THE FULLEST EXTENT PERMITTED BY LAW, IN NO EVENT WILL WE BE LIABLE FOR ANY INDIRECT, SPECIAL, INCIDENTAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES
                ARISING OUT OF OR RELATING TO YOUR USE OF OR INABILITY TO USE OUR SERVICES.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-white mb-3">Changes to These Terms</h2>
              <p>
                We may update these Terms from time to time. We will notify you of any changes by posting the new Terms on this page
                and updating the "Last Updated" date at the top of these Terms. You are advised to review these Terms periodically for any changes.
                Continued use of our Services after any changes constitutes your acceptance of the new Terms.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-white mb-3">Contact Us</h2>
              <p>
                If you have any questions about these Terms, please contact us at <Link href="/contact-us" className="text-blue-400 hover:text-blue-300 underline">our contact page</Link>.
              </p>
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