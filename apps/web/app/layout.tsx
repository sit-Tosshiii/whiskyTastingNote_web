import type { Metadata } from "next";
import Link from "next/link";
import "../styles/globals.css";
import { PwaProvider } from "@/components/PwaProvider";

export const metadata: Metadata = {
  title: "Whisky Tasting Note",
  description: "PWA for logging whisky tasting notes",
  manifest: "/manifest.json",
  themeColor: "#0f172a"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0f172a" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body>
        <PwaProvider />
        <div className="app-shell">
          <div className="app-content">{children}</div>
          <footer className="site-footer">
            <nav className="site-footer-links">
              <Link href="/contact">お問い合わせ</Link>
              <Link href="/privacy">プライバシーポリシー</Link>
            </nav>
            <a className="site-footer-mail" href="mailto:weba70440@gmail.com">
              weba70440@gmail.com
            </a>
          </footer>
        </div>
      </body>
    </html>
  );
}
