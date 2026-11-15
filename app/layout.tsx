import type { Metadata } from "next";
import { Anton, Geist, Geist_Mono } from "next/font/google";
import type { ReactNode } from "react";
import "./globals.css";

const anton = Anton({
  weight: "400",
  subsets: ["latin", "latin-ext"],
  variable: "--font-anton",
  display: "swap",
});

const geist = Geist({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin", "latin-ext"],
  variable: "--font-geist",
  display: "swap",
});

const geistMono = Geist_Mono({
  weight: ["400", "500"],
  subsets: ["latin", "latin-ext"],
  variable: "--font-geist-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Guillermo López · Fotografía",
  description: "Fotografío el movimiento · CDMX",
};

export default function RootLayout({
  children,
  modal,
}: LayoutProps<"/"> & { modal: ReactNode }) {
  return (
    <html
      lang="es"
      className={`${anton.variable} ${geist.variable} ${geistMono.variable}`}
    >
      <body>
        <div id="site-frame">
          <div id="site-shift">{children}</div>
        </div>
        {modal}
      </body>
    </html>
  );
}
