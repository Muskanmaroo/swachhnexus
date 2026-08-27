import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const base = `${protocol}://${host}`;

  return {
    metadataBase: new URL(base),
    title: "SwachhNexus — Signal to Action to Proof",
    description:
      "An independent civic cleanliness prototype for reporting, tracking and verifying municipal response.",
    applicationName: "SwachhNexus",
    openGraph: {
      title: "SwachhNexus",
      description: "A cleanliness complaint should not disappear after you submit it.",
      url: base,
      siteName: "SwachhNexus",
      type: "website",
      images: [{ url: `${base}/og.png`, width: 1536, height: 1024, alt: "SwachhNexus — signal to action to proof" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "SwachhNexus",
      description: "A cleanliness complaint should not disappear after you submit it.",
      images: [`${base}/og.png`],
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
