import type { Metadata } from "next";
import localFont from "next/font/local";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-space-grotesk",
});

const atypDisplay = localFont({
  src: [
    { path: "../public/fonts/AtypDisplay-Regular.otf", weight: "400", style: "normal" },
    { path: "../public/fonts/AtypDisplay-Medium.otf", weight: "500", style: "normal" },
    { path: "../public/fonts/AtypDisplay-Semibold.otf", weight: "600", style: "normal" },
    { path: "../public/fonts/AtypDisplay-Bold.otf", weight: "700", style: "normal" },
  ],
  variable: "--font-atyp-display",
});

const atypText = localFont({
  src: [
    { path: "../public/fonts/AtypText-Regular.otf", weight: "400", style: "normal" },
    { path: "../public/fonts/AtypText-Medium.otf", weight: "500", style: "normal" },
    { path: "../public/fonts/AtypText-Semibold.otf", weight: "600", style: "normal" },
    { path: "../public/fonts/AtypText-Bold.otf", weight: "700", style: "normal" },
  ],
  variable: "--font-atyp-text",
});

export const metadata: Metadata = {
  title: "Angel Mechanic Expert | Auto Repair in Orlando, FL",
  description:
    "Professional auto repair and maintenance services in Orlando, FL. Honest diagnostics, quality parts, and skilled mechanics — all at fair prices.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${atypText.variable} ${atypDisplay.variable} ${inter.variable} ${spaceGrotesk.variable}`}
        style={{
          fontFamily:
            "var(--font-atyp-text), var(--font-inter), sans-serif",
        }}
      >
        {children}
      </body>
    </html>
  );
}
