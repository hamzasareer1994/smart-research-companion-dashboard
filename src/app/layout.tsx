import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Smart Research Companion | Research at the Speed of Thought",
  description: "The AI research assistant designed for elite researchers. From literature review to knowledge graphs, all in one seamless interface.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  // Sanitize main theme to prevent InvalidCharacterError
                  const theme = localStorage.getItem('theme');
                  if (theme && theme.includes(' ')) {
                    localStorage.setItem('theme', theme.split(' ')[0]);
                  }
                  
                  // Set sub-theme (Academic, Emerald, Midnight, Ametrine)
                  let subTheme = localStorage.getItem('sub-theme');
                  const mode = localStorage.getItem('theme') || 'light';
                  
                  // Fallback for deprecated themes
                  const validThemes = ['academic', 'emerald', 'midnight', 'ametrine'];
                  if (!subTheme || !validThemes.includes(subTheme)) {
                    subTheme = mode === 'dark' ? 'midnight' : 'academic';
                    localStorage.setItem('sub-theme', subTheme);
                  }
                  
                  document.documentElement.setAttribute('data-color-theme', subTheme);
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
