import type { Metadata } from "next";
import "../styles/globals.css";

export const metadata: Metadata = {
  title: "Whisky Tasting Note",
  description: "PWA for logging whisky tasting notes"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
