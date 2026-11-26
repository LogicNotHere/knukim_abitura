import type { Metadata } from "next";
import type { ReactNode } from "react";
import localFont from "next/font/local";
import { DemoProvider } from "../components/DemoProvider";
import { SiteShell } from "../components/SiteShell";
import "./globals.css";

const manrope = localFont({
  src: "../public/fonts/Manrope.ttf",
  weight: "200 800",
  display: "swap",
  variable: "--font-manrope",
});

export const metadata: Metadata = {
  title: { default: "КНУКіМ — твій творчий старт", template: "%s — КНУКіМ" },
  description:
    "Твій творчий старт: демонстраційний сайт для вступників КНУКіМ.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="uk" data-theme="a" className={manrope.variable} suppressHydrationWarning>
      <body>
        <DemoProvider>
          <SiteShell>{children}</SiteShell>
        </DemoProvider>
      </body>
    </html>
  );
}
