import type { Metadata } from "next";
import { Instrument_Serif, DM_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";

const serif = Instrument_Serif({ 
  subsets: ['latin'], 
  weight: ['400'],
  style: ['normal', 'italic'],
  variable: '--font-serif' 
});

const sans = DM_Sans({ 
  subsets: ['latin'], 
  variable: '--font-sans' 
});

const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono'
});

export const metadata: Metadata = {
  title: "Smart Research AI",
  description: "Your AI Powered Research Assistant",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable} ${mono.variable}`} suppressHydrationWarning>
      <body
        className="antialiased"
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster richColors position="top-right" closeButton />
        </ThemeProvider>
      </body>
    </html>
  );
}
