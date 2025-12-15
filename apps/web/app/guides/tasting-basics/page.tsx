import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "ウイスキーテイスティングの始め方 | Whisky Tasting Note",
  description: "これからウイスキーのテイスティングを始める方向けに、準備や基本の流れ、注意点をまとめました。"
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

export default function TastingBasicsPage() {
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
          <h1 style={{ fontSize: "2rem", margin: "0.2rem 0 0.6rem" }}>ウイスキーテイスティングの始め方</h1>
          <p style={{ margin: 0 }}>
            ここでは、これからウイスキーのテイスティングを始める方向けに、最低限知っておきたい準備と流れをまとめました。
            難しく考える必要はありませんが、簡単なルールを決めておくと、自分の好みを見つけやすくなります。
          </p>
        </header>

        <section>
          <h2 style={sectionTitleStyle}>1. 前提としての飲酒マナー</h2>
          <p>
            ウイスキーのテイスティングは、あくまで香りや味わいをじっくり楽しむための行為です。
            20 歳未満の飲酒は法律で禁止されており、また一気飲みや過度な飲酒は健康を損なうおそれがあります。
            自分のペースを守り、体調が悪いときは飲まない、といった基本的なルールを大切にしましょう。
          </p>
        </section>

        <section>
          <h2 style={sectionTitleStyle}>2. テイスティングの準備</h2>
          <p>
            まずは、落ち着いて香りを感じられる環境を整えます。強い香りのする食べ物や香水は控えめにし、テーブルの上をシンプルにしておくと、
            グラスから立ち上る香りに集中しやすくなります。グラスは香りを集めやすい形状のもの（いわゆるテイスティンググラス）があると便利ですが、
            家にあるお気に入りのグラスから始めても構いません。
          </p>
        </section>

        <section>
          <h2 style={sectionTitleStyle}>3. 観察 → 香り → 味わいの順に</h2>
          <p>
            テイスティングをするときは、「見た目」「香り」「味わい」の順にゆっくりと感じていくと整理しやすくなります。
          </p>
          <ul style={{ margin: 0, paddingLeft: "1.25rem" }}>
            <li>色や粘性を軽く観察する（琥珀色、麦茶のような色合いなど）</li>
            <li>グラスを少し回し、鼻に近づけて香りを確認する</li>
            <li>少量を口に含み、舌の上で広げながら味わいを確かめる</li>
          </ul>
          <p style={{ marginTop: "0.6rem" }}>
            最初は難しく考えず、「甘い」「スモーキー」「フルーティー」など、シンプルな言葉からメモしていくと良いでしょう。
          </p>
        </section>

        <section>
          <h2 style={sectionTitleStyle}>4. メモを取るときのコツ</h2>
          <p>
            メモの取り方に正解はありませんが、毎回同じ項目を残しておくと比較がしやすくなります。
            Whisky Tasting Note では、銘柄名や蒸留所、産地、香り、味わい、総合コメント、スコアなどを登録できます。
          </p>
          <p>
            たとえば「最初に感じた印象」「時間が経ってから変化した香り」「飲み方（ストレート・ロックなど）」をひとこと添えるだけでも、
            後から読み返したときにその日のシーンを思い出しやすくなります。
          </p>
        </section>

        <section>
          <h2 style={sectionTitleStyle}>5. アプリとの組み合わせ方</h2>
          <p>
            テイスティングの最中にスマートフォンを取り出してメモするのが難しい場合は、紙のメモにキーワードだけ書いておき、
            後で落ち着いたタイミングでアプリにまとめて入力する方法もあります。
          </p>
          <p>
            Whisky Tasting Note には香り・味わいの語彙サジェスト機能があり、「あのときどんな表現を使ったか」を見直すのにも便利です。
            少しずつ語彙を増やしながら、自分なりのテイスティングスタイルを育てていきましょう。
          </p>
        </section>

        <footer style={{ fontSize: "0.9rem", opacity: 0.8 }}>
          <p style={{ margin: 0 }}>
            当アプリは 20 歳以上の成人の方を対象としています。節度ある飲酒を心掛け、体調に不安がある場合は飲酒を控えてください。
          </p>
          <p style={{ margin: "0.4rem 0 0" }}>
            アプリの具体的な使い方については{" "}
            <Link href="/guides/app-usage" style={{ textDecoration: "underline" }}>
              Whisky Tasting Note の活用アイデア
            </Link>
            もあわせてご覧ください。
          </p>
        </footer>
      </article>
    </main>
  );
}

