import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "読み物コンテンツ | Whisky Tasting Note",
  description: "ウイスキーのテイスティングやアプリの使い方に関する読み物コンテンツです。"
};

const containerStyle = {
  maxWidth: 860,
  width: "100%",
  margin: "0 auto",
  padding: "1.5rem",
  display: "grid",
  gap: "1.5rem"
} as const;

const cardStyle = {
  padding: "1.25rem 1.5rem",
  borderRadius: "0.75rem",
  border: "1px solid rgba(148, 163, 184, 0.3)",
  backgroundColor: "rgba(15, 23, 42, 0.55)",
  display: "grid",
  gap: "0.4rem"
} as const;

export default function GuidesIndexPage() {
  return (
    <main style={containerStyle}>
      <header>
        <p style={{ fontSize: "0.9rem", letterSpacing: "0.05em", opacity: 0.8 }}>ARTICLES</p>
        <h1 style={{ fontSize: "2rem", margin: "0.2rem 0 0.6rem" }}>読み物コンテンツ</h1>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          Whisky Tasting Note は、ウイスキーをより深く楽しむための個人向けテイスティングノートアプリです。
          このページでは、ウイスキーの基本的な楽しみ方や香り・味わいの表現、アプリの活用アイデアなど、
          テイスティングのヒントになる読み物コンテンツをまとめています。
        </p>
      </header>

      <section style={{ display: "grid", gap: "1rem" }}>
        <article style={cardStyle}>
          <h2 style={{ fontSize: "1.3rem", margin: 0 }}>
            <Link href="/guides/tasting-basics" style={{ textDecoration: "none" }}>
              ウイスキーテイスティングの始め方
            </Link>
          </h2>
          <p style={{ margin: 0 }}>
            これからウイスキーのテイスティングを始めたい方向けに、準備するものや基本的な手順、注意したいポイントをまとめました。
            自分なりのメモの取り方を決めると、後から見返したときの発見も増えていきます。
          </p>
          <Link href="/guides/tasting-basics" style={{ fontSize: "0.9rem", textDecoration: "underline" }}>
            記事を読む
          </Link>
        </article>

        <article style={cardStyle}>
          <h2 style={{ fontSize: "1.3rem", margin: 0 }}>
            <Link href="/guides/flavor-notes" style={{ textDecoration: "none" }}>
              香り・味わいの表現例と語彙集
            </Link>
          </h2>
          <p style={{ margin: 0 }}>
            「どんな言葉でメモを書けばいいかわからない」という方向けに、香り・味わいのカテゴリと表現例を紹介します。
            アプリの語彙サジェスト機能とあわせて使うことで、自分の好みの傾向も掴みやすくなります。
          </p>
          <Link href="/guides/flavor-notes" style={{ fontSize: "0.9rem", textDecoration: "underline" }}>
            記事を読む
          </Link>
        </article>

        <article style={cardStyle}>
          <h2 style={{ fontSize: "1.3rem", margin: 0 }}>
            <Link href="/guides/app-usage" style={{ textDecoration: "none" }}>
              Whisky Tasting Note の活用アイデア
            </Link>
          </h2>
          <p style={{ margin: 0 }}>
            実際のテイスティングシーンでアプリをどう使うか、記録をどのように振り返ると便利か、といった活用の具体例を紹介します。
            日記的なメモやイベントごとの記録など、使い方次第で楽しみ方が広がります。
          </p>
          <Link href="/guides/app-usage" style={{ fontSize: "0.9rem", textDecoration: "underline" }}>
            記事を読む
          </Link>
        </article>
      </section>
    </main>
  );
}

