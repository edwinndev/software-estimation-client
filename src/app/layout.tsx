import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const fontSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const fontMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

import { Providers } from "@/components/providers";

export const metadata: Metadata = {
  title: "Software Estimation",
  description: "Software estimation management platform",
};

const RootLayout = ({ children }: LayoutProps<"/">) => {
  return (
    <html
      lang="es"
      className={`${fontSans.variable} ${fontMono.variable} font-sans h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
};

export default RootLayout;
