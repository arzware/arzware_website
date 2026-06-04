import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Arzware — Software Modernization Studio",
  description:
    "Arzware transforms outdated operations into intelligent systems. Software modernization, automation, business systems, and AI-native solutions.",
  keywords: [
    "software modernization",
    "business automation",
    "custom software",
    "AI workflows",
    "digital transformation",
  ],
  authors: [{ name: "Arzware" }],
  openGraph: {
    title: "Arzware — Software Modernization Studio",
    description:
      "Transforming outdated operations into intelligent systems.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Arzware — Software Modernization Studio",
    description:
      "Transforming outdated operations into intelligent systems.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#050505",
  width: "device-width",
  initialScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Arzware",
  description:
    "Software Modernization Studio — transforming outdated operations into intelligent systems.",
  url: "https://arzware.com",
  email: "arzware.lb@gmail.com",
  sameAs: [],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geist.variable} ${geistMono.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-sans antialiased">
        <a
          href="#hero"
          className="sr-only-focusable fixed left-4 top-4 z-[100] bg-accent px-4 py-2 text-background"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
