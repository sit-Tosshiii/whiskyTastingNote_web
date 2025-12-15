import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "プライバシーポリシー | Whisky Tasting Note",
  description: "Google AdSense を含む広告配信時のデータ取扱方針について掲載しています。"
};

const containerStyle = {
  maxWidth: 720,
  width: "100%",
  margin: "0 auto",
  padding: "1.5rem",
  lineHeight: 1.8,
  display: "grid",
  gap: "1.5rem",
  backgroundColor: "rgba(15, 23, 42, 0.55)",
  border: "1px solid rgba(148, 163, 184, 0.35)",
  borderRadius: "0.75rem"
} as const;

const sectionTitleStyle = { fontSize: "1.3rem", marginBottom: "0.5rem" };

export default function PrivacyPage() {
  return (
    <main style={{ width: "100%", maxWidth: 860, margin: "0 auto", padding: "1.5rem" }}>
      <article style={containerStyle}>
        <header>
          <p style={{ fontSize: "0.9rem", letterSpacing: "0.05em", opacity: 0.8 }}>PRIVACY POLICY</p>
          <h1 style={{ fontSize: "1.9rem", margin: "0.2rem 0 0.85rem" }}>プライバシーポリシー</h1>
          <p style={{ margin: 0 }}>
            Whisky Tasting Note (以下「当アプリ」といいます) は、Google AdSense を利用した広告配信を予定しており、
            利用者のみなさまの情報を保護するために以下の方針を定めています。
          </p>
        </header>

        <section>
          <h2 style={sectionTitleStyle}>対象となる利用者とアルコールに関する前提</h2>
          <p>
            当アプリはウイスキーのテイスティングノートを記録するツールであり、20 歳以上の成人の方を対象としています。
            20 歳未満の飲酒は法律で禁止されており、未成年者の利用や飲酒を助長する目的では提供しておりません。
          </p>
        </section>

        <section>
          <h2 style={sectionTitleStyle}>収集する情報</h2>
          <p>
            当アプリはテイスティングノートを端末内の IndexedDB に保存しており、運営者が個別の記録データへアクセスすることはありません。
            お問い合わせフォーム (メール) を通じて任意で提供いただいたお名前・メールアドレス・端末情報のみ、サポート対応のために利用します。
          </p>
        </section>

        <section>
          <h2 style={sectionTitleStyle}>Google AdSense と Cookie</h2>
          <p>
            広告配信の最適化のため、Google などの第三者配信事業者は Cookie や広告識別子を利用して利用者の興味に応じた広告を表示します。
            広告のパーソナライズを無効にしたい場合は{" "}
            <a href="https://adssettings.google.com/authenticated" target="_blank" rel="noreferrer">
              Google 広告設定
            </a>{" "}
            からオプトアウトしてください。Cookie により収集される情報は匿名であり、個人を特定するものではありません。
          </p>
        </section>

        <section>
          <h2 style={sectionTitleStyle}>アクセス解析とログ</h2>
          <p>
            サービス改善のためにアクセス状況やエラーログを解析する場合があります。その際は IP アドレスやブラウザ情報などを一定期間保管し、
            統計的な分析と障害復旧以外の目的では利用しません。
          </p>
        </section>

        <section>
          <h2 style={sectionTitleStyle}>情報の共有・第三者提供</h2>
          <p>
            法令に基づく開示請求がある場合や、生命・財産の保護が必要と判断される場合を除き、利用者の情報を第三者へ提供することはありません。
            広告枠の改善にあたっても、個人を識別できない統計情報のみを取り扱います。
          </p>
        </section>

        <section>
          <h2 style={sectionTitleStyle}>利用者の権利</h2>
          <p>
            ご自身の情報の開示、訂正、削除、利用停止をご希望の場合は{" "}
            <Link href="/contact" style={{ textDecoration: "underline" }}>
              お問い合わせ
            </Link>{" "}
            からご連絡ください。本人確認のうえ、速やかに対応いたします。
          </p>
        </section>

        <section>
          <h2 style={sectionTitleStyle}>ポリシーの変更</h2>
          <p>
            本ポリシーの内容は必要に応じて告知なく改定することがあります。重要な変更がある場合はアプリ上でお知らせします。
            改定後も当アプリを利用される場合は、最新のポリシーに同意いただいたものとみなします。
          </p>
        </section>

        <section>
          <h2 style={sectionTitleStyle}>お問い合わせ先</h2>
          <p style={{ marginBottom: "0.35rem" }}>Whisky Tasting Note 運営窓口</p>
          <p style={{ margin: 0 }}>
            メール:{" "}
            <a href="mailto:weba70440@gmail.com" style={{ fontWeight: 600 }}>
              weba70440@gmail.com
            </a>
          </p>
        </section>
      </article>
    </main>
  );
}
