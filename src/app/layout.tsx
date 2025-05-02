import './globals.css';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { ThemeProvider } from './ThemeContext';
import { AuthProvider } from './context/AuthContext';

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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans`}>
        <ThemeProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
