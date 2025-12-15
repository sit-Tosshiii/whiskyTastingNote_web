import Link from "next/link";
import type { CSSProperties } from "react";

const features = [
  "香り・味わい・総合メモを手軽に記録",
  "キーワード検索で過去のノートをすばやく発見",
  "IndexedDB に保存するのでオフラインでも利用可能",
  "PWA としてホーム画面に追加してワンタップ起動"
];

export default function HomePage() {
  return (
    <main style={{ maxWidth: 860, margin: "0 auto", padding: "1.5rem", display: "grid", gap: "1.5rem" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
        <div>
          <h1 style={{ fontSize: "2.1rem", marginBottom: "0.5rem" }}>Whisky Tasting Note</h1>
          <p style={{ margin: 0, opacity: 0.8 }}>ウイスキーをゆっくり味わう人のためのテイスティングノートアプリ</p>
        </div>
        <nav style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          <Link href="/notes/new" style={linkButtonStyle}>
            ノートを登録
          </Link>
          <Link href="/notes" style={linkButtonStyle}>
            ノート一覧
          </Link>
          <Link href="/guides" style={linkButtonStyleSecondary}>
            読み物コンテンツ
          </Link>
        </nav>
      </header>

      <section
        style={{
          padding: "1.5rem",
          borderRadius: "0.75rem",
          border: "1px solid rgba(148, 163, 184, 0.2)",
          backgroundColor: "rgba(15, 23, 42, 0.4)",
          display: "grid",
          gap: "1.25rem"
        }}
      >
        <div>
          <h2 style={{ fontSize: "1.5rem", marginBottom: "0.75rem" }}>このアプリでできること</h2>
          <ul style={{ paddingLeft: "1.25rem", margin: 0 }}>
            {features.map((item) => (
              <li key={item} style={{ marginBottom: "0.5rem" }}>
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 style={{ fontSize: "1.125rem", marginBottom: "0.35rem" }}>想定している利用シーン</h3>
          <ul style={{ paddingLeft: "1.25rem", margin: 0, display: "grid", gap: "0.35rem" }}>
            <li>バーや自宅で飲んだウイスキーの印象を、あとから見返せるようにメモしておきたいとき</li>
            <li>テイスティング会で複数のボトルを飲み比べ、それぞれの違いを整理したいとき</li>
            <li>自分にとっての「定番ボトル」や「苦手な傾向」を把握したいとき</li>
          </ul>
        </div>
      </section>

      <section
        style={{
          padding: "1.5rem",
          borderRadius: "0.75rem",
          border: "1px solid rgba(148, 163, 184, 0.2)",
          backgroundColor: "rgba(15, 23, 42, 0.35)",
          display: "grid",
          gap: "0.9rem"
        }}
      >
        <h2 style={{ fontSize: "1.45rem", marginBottom: "0.3rem" }}>はじめ方</h2>
        <ol style={{ paddingLeft: "1.25rem", margin: 0, display: "grid", gap: "0.35rem" }}>
          <li>気になるウイスキーを用意し、落ち着いて香りを楽しめる環境を整えます。</li>
          <li>「ノートを登録」から銘柄名と簡単なメモを残します。詳しい語彙はあとから追加しても構いません。</li>
          <li>時間が経って印象が変わったら追記し、「総合」やスコアでそのボトルの評価をまとめておきます。</li>
          <li>後日「ノート一覧」や検索機能を使って、好みや苦手な傾向を振り返ります。</li>
        </ol>
        <p style={{ margin: 0, fontSize: "0.95rem", opacity: 0.85 }}>
          テイスティングの基本的な流れや言葉の選び方は{" "}
          <Link href="/guides/tasting-basics" style={{ textDecoration: "underline" }}>
            ウイスキーテイスティングの始め方
          </Link>{" "}
          や{" "}
          <Link href="/guides/flavor-notes" style={{ textDecoration: "underline" }}>
            香り・味わいの表現例
          </Link>{" "}
          もあわせてご覧ください。
        </p>
      </section>

      <section
        style={{
          padding: "1.25rem 1.5rem",
          borderRadius: "0.75rem",
          border: "1px solid rgba(248, 250, 252, 0.1)",
          backgroundColor: "rgba(15, 23, 42, 0.5)",
          display: "grid",
          gap: "0.6rem"
        }}
      >
        <h2 style={{ fontSize: "1.3rem", marginBottom: "0.2rem" }}>ご利用にあたっての注意</h2>
        <ul style={{ paddingLeft: "1.25rem", margin: 0, display: "grid", gap: "0.3rem", fontSize: "0.9rem" }}>
          <li>当アプリは 20 歳以上の成人の方を対象としています。</li>
          <li>20 歳未満の飲酒は法律で禁止されています。未成年の方はご利用いただけません。</li>
          <li>健康状態や体質に配慮し、無理のない範囲でウイスキーをお楽しみください。</li>
          <li>銘柄の評価やコメントは個人の主観であり、特定の商品の購入や飲酒を推奨するものではありません。</li>
        </ul>
      </section>
    </main>
  );
}

const linkButtonStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "0.6rem 1.1rem",
  borderRadius: "9999px",
  border: "1px solid rgba(148, 163, 184, 0.35)",
  backgroundColor: "rgba(15, 23, 42, 0.5)",
  color: "#f8fafc",
  fontSize: "0.85rem",
  fontWeight: 600,
  textDecoration: "none"
};

const linkButtonStyleSecondary: CSSProperties = {
  ...linkButtonStyle,
  borderColor: "rgba(148, 163, 184, 0.2)",
  backgroundColor: "transparent"
};

