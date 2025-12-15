import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "香り・味わいの表現例と語彙集 | Whisky Tasting Note",
  description: "香りや味わいをメモするときに参考になるカテゴリと表現例をまとめました。"
};

const containerStyle = {
  maxWidth: 860,
  width: "100%",
  margin: "0 auto",
  padding: "1.5rem",
  lineHeight: 1.8,
  display: "grid",
  gap: "1.5rem"
} as const;

const sectionTitleStyle = { fontSize: "1.4rem", marginBottom: "0.5rem" };

export default function FlavorNotesPage() {
  return (
    <main style={containerStyle}>
      <article
        style={{
          display: "grid",
          gap: "1.5rem",
          padding: "1.5rem",
          borderRadius: "0.75rem",
          border: "1px solid rgba(148, 163, 184, 0.35)",
          backgroundColor: "rgba(15, 23, 42, 0.55)"
        }}
      >
        <header>
          <p style={{ fontSize: "0.9rem", letterSpacing: "0.05em", opacity: 0.8 }}>GUIDE</p>
          <h1 style={{ fontSize: "2rem", margin: "0.2rem 0 0.6rem" }}>香り・味わいの表現例と語彙集</h1>
          <p style={{ margin: 0 }}>
            テイスティングノートを書こうとすると、「なんとなくおいしいけれど、どんな言葉で表現すればいいのか分からない」と感じることがあります。
            ここでは、香りと味わいの代表的なカテゴリと、そこに含まれる表現例を簡単に紹介します。
          </p>
        </header>

        <section>
          <h2 style={sectionTitleStyle}>1. フルーティー（果実のニュアンス）</h2>
          <p>
            フルーティーな香りは、多くのウイスキーで感じられる分かりやすい特徴です。具体的な果物のイメージと紐づけると記憶にも残りやすくなります。
          </p>
          <ul style={{ margin: 0, paddingLeft: "1.25rem" }}>
            <li>リンゴ、洋ナシ、白ブドウのようなみずみずしさ</li>
            <li>オレンジピールやレモンのような柑橘の爽やかさ</li>
            <li>ドライフルーツ、レーズン、プルーンのような甘さ</li>
          </ul>
        </section>

        <section>
          <h2 style={sectionTitleStyle}>2. スイート（甘さのニュアンス）</h2>
          <p>
            樽や原料由来の甘さも、テイスティングノートではよく使われる表現です。甘さの種類に着目してみましょう。
          </p>
          <ul style={{ margin: 0, paddingLeft: "1.25rem" }}>
            <li>バニラ、カスタードクリームのようなまろやかな甘さ</li>
            <li>はちみつ、メープルシロップ、黒糖のようなコクのある甘さ</li>
            <li>キャラメル、トフィー、ミルクチョコレートのような香ばしさを含む甘さ</li>
          </ul>
        </section>

        <section>
          <h2 style={sectionTitleStyle}>3. スパイシー（刺激のある香り）</h2>
          <p>
            アルコールの刺激とは別に、スパイスを連想させる香りが感じられることがあります。少しずつイメージを増やしてみてください。
          </p>
          <ul style={{ margin: 0, paddingLeft: "1.25rem" }}>
            <li>ブラックペッパー、ホワイトペッパー</li>
            <li>シナモン、ナツメグ、クローブ</li>
            <li>ジンジャー、ハーブ、ミント</li>
          </ul>
        </section>

        <section>
          <h2 style={sectionTitleStyle}>4. スモーキー／ピーティー</h2>
          <p>
            アイラモルトなどで有名なスモーキーさやピート香も、感じ方は人それぞれです。苦手意識がある場合でも、自分なりの言葉で残しておくと傾向を把握しやすくなります。
          </p>
          <ul style={{ margin: 0, paddingLeft: "1.25rem" }}>
            <li>たき火、焚き火の煙のような香り</li>
            <li>ヨード、薬品、消毒液のような印象</li>
            <li>海藻、磯、潮風のようなニュアンス</li>
          </ul>
        </section>

        <section>
          <h2 style={sectionTitleStyle}>5. そのほかのヒント</h2>
          <p>
            一度に正確な表現を探そうとすると疲れてしまうので、最初は「なんとなく近い」と感じる言葉をいくつか候補として残しておく程度で十分です。
            後から別のボトルと飲み比べたときに、「前の方が甘かった」「こっちはスパイシー寄りだった」など、相対的な違いが見えてきます。
          </p>
          <p>
            Whisky Tasting Note の香り・味わい入力欄には語彙サジェスト機能があり、この記事で挙げたようなキーワードの多くが収録されています。
            気になった言葉があれば、実際のテイスティング時にアプリを開いて試してみてください。
          </p>
        </section>

        <footer style={{ fontSize: "0.9rem", opacity: 0.8 }}>
          <p style={{ margin: 0 }}>
            表現に正解はありません。自分が思い浮かんだ比喩や印象を大切にしながら、少しずつ語彙を増やしていきましょう。
          </p>
          <p style={{ margin: "0.4rem 0 0" }}>
            テイスティングの全体の流れについては{" "}
            <Link href="/guides/tasting-basics" style={{ textDecoration: "underline" }}>
              ウイスキーテイスティングの始め方
            </Link>
            も参考にしてみてください。
          </p>
        </footer>
      </article>
    </main>
  );
}

