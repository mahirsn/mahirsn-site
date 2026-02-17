import type React from "react";
import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://mahirsn.net"),
  title: {
    default: "Mahirsn",
    template: "%s | Mahirsn",
  },
  description: "Mahirsn",
  keywords: ["Mahirsn", "Portfolio", "Developer", "Web Development"],
  authors: [{ name: "Mahirsn" }],
  creator: "Mahirsn",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://mahirsn.net",
    title: "Mahirsn",
    description: "Personal website of Mahirsn.",
    siteName: "Mahirsn",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mahirsn",
    description: "Personal website of Mahirsn.",
    creator: "@mahirsn",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${manrope.variable} font-sans antialiased`}>
        <div className="noise-overlay" aria-hidden="true" />
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
