import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Franklin Dickinson - AI Product Engineer",
  description:
    "Interactive resume powered by AI. Ask me anything about my background, experience, and projects.",
  openGraph: {
    title: "Franklin Dickinson - AI Product Engineer",
    description:
      "Interactive resume powered by AI. Ask me anything about my background, experience, and projects.",
    images: ["/og-image.png"],
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
