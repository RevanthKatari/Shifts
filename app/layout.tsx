import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from 'react-hot-toast';
import Script from 'next/script';

export const metadata: Metadata = {
  title: "Shift Tracker",
  description: "Track your work shifts and calculate your pay",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script id="theme-init" strategy="beforeInteractive">
          {`
            (function() {
              const theme = localStorage.getItem('theme');
              const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
              if (theme === 'dark' || (!theme && prefersDark)) {
                document.documentElement.classList.add('dark');
              }
            })();
          `}
        </Script>
      </head>
      <body className="antialiased">
        {children}
        <Toaster 
          position="top-right"
          toastOptions={{
            style: {
              background: 'var(--toast-bg)',
              color: 'var(--toast-color)',
              border: '1px solid var(--toast-border)',
            },
            className: 'notion-card',
          }}
        />
      </body>
    </html>
  );
}

