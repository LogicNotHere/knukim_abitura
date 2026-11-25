import type { Metadata } from "next";
import type { ReactNode } from "react";
import { DemoProvider } from "../components/DemoProvider";
import { SiteShell } from "../components/SiteShell";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "КНУКіМ — твій творчий старт", template: "%s — КНУКіМ" },
  description:
    "Твій творчий старт: демонстраційний сайт для вступників КНУКіМ.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="uk" data-theme="auto">
      <body>
        <DemoProvider>
          <SiteShell>{children}</SiteShell>
        </DemoProvider>
      </body>
    </html>
  );
}
