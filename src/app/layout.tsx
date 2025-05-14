import './globals.css';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { ThemeProvider } from './ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { BackgroundProvider } from './context/BackgroundContext';
import Script from 'next/script';

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans"
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono"
});

export const metadata: Metadata = {
  title: 'EndlessNovel',
  description: 'Create and continue stories with AI',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.png', type: 'image/png' }
    ],
    shortcut: '/favicon.ico',
    apple: '/favicon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/favicon.png" />
        <Script id="emailjs-sdk" strategy="afterInteractive">
          {`
            (function(){
              // Load EmailJS SDK for using with forms
              if (typeof window !== "undefined") {
                window.onload = function() {
                  // This is where EmailJS will be initialized
                  // The actual initialization happens in the respective components
                }
              }
            })();
          `}
        </Script>
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans`}>
        <ThemeProvider>
          <BackgroundProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
          </BackgroundProvider>
        </ThemeProvider>
        
        {/* Script to hide Next.js popups */}
        <Script id="hide-nextjs-popups" strategy="afterInteractive">
          {`
            (function() {
              // Function to hide popups
              function hideNextJSPopups() {
                const selectors = [
                  '#__next-build-watcher',
                  '[data-nextjs-dialog]',
                  '[data-nextjs-codeframe]',
                  '[data-nextjs-terminal]',
                  '[data-nextjs-toast]',
                  '[data-nextjs-route-announcer]',
                  '#__next-route-announcer__',
                  '#turbopack-dev-server',
                  '#nextjs-portal',
                  '.nextjs-toast-errors-parent',
                  '.nextjs-portal',
                  'div[role="presentation"][tabindex="-1"]',
                  '#N',
                  'div[role="dialog"]'
                ];
                
                selectors.forEach(selector => {
                  const elements = document.querySelectorAll(selector);
                  elements.forEach(el => {
                    if (el) {
                      el.style.display = 'none';
                      el.style.visibility = 'hidden';
                      el.style.opacity = '0';
                      el.style.pointerEvents = 'none';
                      el.style.width = '0';
                      el.style.height = '0';
                      el.style.position = 'absolute';
                      el.style.left = '-9999px';
                      el.style.top = '-9999px';
                      el.remove();
                    }
                  });
                });

                // Remove development tools node
                const toolsNode = document.getElementById('__next-build-watcher');
                if (toolsNode && toolsNode.parentNode) {
                  toolsNode.parentNode.removeChild(toolsNode);
                }
              }
              
              // Run immediately
              hideNextJSPopups();
              
              // Keep checking for popups
              setInterval(hideNextJSPopups, 1000);
              
              // Observe DOM changes
              const observer = new MutationObserver(hideNextJSPopups);
              observer.observe(document.body, { childList: true, subtree: true });
            })();
          `}
        </Script>
      </body>
    </html>
  );
}
