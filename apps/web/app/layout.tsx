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
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3588448572921726"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        <PwaProvider />
        <div className="app-shell">
          <div className="app-content">{children}</div>
          <footer className="site-footer">
            <nav className="site-footer-links">
              <Link href="/guides">読み物コンテンツ</Link>
              <Link href="/contact">お問い合わせ</Link>
              <Link href="/privacy">プライバシーポリシー</Link>
              <Link href="/terms">利用規約</Link>
            </nav>
            <p className="site-footer-notice">
              Whisky Tasting Note は 20 歳以上の方を対象としたサービスです。20 歳未満の飲酒は法律で禁止されています。
            </p>
            <a className="site-footer-mail" href="mailto:weba70440@gmail.com">
              weba70440@gmail.com
            </a>
          </footer>
        </div>
      </body>
    </html>
  );
}
