import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "お問い合わせ | Whisky Tasting Note",
  description: "広告掲載やデータの取扱いに関するお問い合わせはこちらからご連絡ください。"
};

const containerStyle = {
  maxWidth: 620,
  width: "100%",
  margin: "0 auto",
  padding: "1.5rem",
  lineHeight: 1.8,
  display: "grid",
  gap: "1.25rem",
  backgroundColor: "rgba(15, 23, 42, 0.55)",
  border: "1px solid rgba(148, 163, 184, 0.35)",
  borderRadius: "0.75rem"
} as const;

export default function ContactPage() {
  return (
    <main style={{ width: "100%", maxWidth: 780, margin: "0 auto", padding: "1.5rem" }}>
      <div style={containerStyle}>
        <header>
          <p style={{ fontSize: "0.9rem", letterSpacing: "0.05em", opacity: 0.8 }}>CONTACT</p>
          <h1 style={{ fontSize: "1.75rem", margin: "0.2rem 0 0.75rem" }}>お問い合わせ</h1>
          <p style={{ margin: 0 }}>
            Whisky Tasting Note についてのご質問、Google AdSense を含む広告掲載に関するご相談、ならびに個人情報や
            プライバシーに関するご連絡は以下のメールアドレスにて承ります。
          </p>
        </header>
        <section>
          <h2 style={{ fontSize: "1.25rem", marginBottom: "0.4rem" }}>連絡先</h2>
          <p style={{ marginBottom: "0.6rem" }}>
            メール:{" "}
            <a href="mailto:weba70440@gmail.com" style={{ fontWeight: 600 }}>
              weba70440@gmail.com
            </a>
          </p>
          <ul style={{ margin: 0, paddingLeft: "1.25rem" }}>
            <li>対応時間: 平日 10:00-18:00 (日本時間)</li>
            <li>内容に応じて 2 営業日以内の返信を心掛けています</li>
            <li>広告配信やデータの利用に関する緊急のご相談は件名に「至急」と付記してください</li>
          </ul>
        </section>
        <section>
          <h2 style={{ fontSize: "1.25rem", marginBottom: "0.4rem" }}>ご記載いただきたい内容</h2>
          <ol style={{ margin: 0, paddingLeft: "1.25rem", display: "grid", gap: "0.35rem" }}>
            <li>お名前 (ニックネーム可) とご連絡先</li>
            <li>お問い合わせの対象画面や URL</li>
            <li>問題が発生した日時や端末 / ブラウザ</li>
            <li>スクリーンショット等がある場合は添付してください</li>
          </ol>
        </section>
        <section>
          <h2 style={{ fontSize: "1.25rem", marginBottom: "0.4rem" }}>プライバシー関連のお問い合わせ</h2>
          <p style={{ margin: 0 }}>
            個人情報の開示・訂正・削除のご希望や、広告配信の停止に関するご要望がございましたら上記メールまでご連絡ください。
            当アプリのデータの取り扱い方針は{" "}
            <Link href="/privacy" style={{ textDecoration: "underline" }}>
              プライバシーポリシー
            </Link>
            をご参照ください。
          </p>
        </section>
      </div>
    </main>
  );
}
