import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Whisky Tasting Note の活用アイデア | Whisky Tasting Note",
  description: "テイスティングノートアプリ Whisky Tasting Note の具体的な活用パターンや使い方のヒントを紹介します。"
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

export default function AppUsagePage() {
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
          <h1 style={{ fontSize: "2rem", margin: "0.2rem 0 0.6rem" }}>Whisky Tasting Note の活用アイデア</h1>
          <p style={{ margin: 0 }}>
            Whisky Tasting Note は、ウイスキーのテイスティングメモをシンプルに残すための PWA です。
            ここでは、実際のシーンでどのように使うと便利か、いくつかの活用パターンを紹介します。
          </p>
        </header>

        <section>
          <h2 style={sectionTitleStyle}>1. テイスティング会の記録帳として使う</h2>
          <p>
            友人とのテイスティング会やバーでの飲み比べでは、1 回に複数のボトルを試すことも少なくありません。
            その場で一言メモだけ残しておくだけでも、後から写真と一緒に見返したときに記憶がよみがえります。
          </p>
          <p>
            イベント名や一緒に飲んだ人の名前を「総合」欄に書き添えておくと、思い出のログとしても活用できます。
          </p>
        </section>

        <section>
          <h2 style={sectionTitleStyle}>2. 自分の「定番ボトル」を見つけるための比較</h2>
          <p>
            家飲み用の定番ボトルを探したいときは、スコアと飲み方の組み合わせを意識して記録すると役立ちます。
            たとえば、ストレートでは 80 点だけれど水割りにすると 90 点、といった違いが見えてくるかもしれません。
          </p>
          <p>
            一覧画面から検索や並び替えを使うことで、「特定の産地だけ」「特定の飲み方だけ」に絞り込んで振り返ることもできます。
          </p>
        </section>

        <section>
          <h2 style={sectionTitleStyle}>3. 苦手な傾向を把握する</h2>
          <p>
            好きなウイスキーを見つけるだけでなく、「あまり好みではなかった」ボトルの特徴をメモしておくことも重要です。
            香り・味わいの欄に、苦手に感じたポイント（薬品っぽさが強い、スモーキーすぎる など）を書き残しておくと、
            次にボトルを選ぶときのヒントになります。
          </p>
          <p>
            こうした情報は他人と共有する必要はなく、自分の嗜好を知るためのメモと割り切ると気楽に続けられます。
          </p>
        </section>

        <section>
          <h2 style={sectionTitleStyle}>4. バックアップと機種変更への備え</h2>
          <p>
            当アプリのノートは端末の IndexedDB に保存されるため、ブラウザの設定や端末の変更でデータが消えてしまう可能性があります。
            定期的に <strong>データ入出力ツール</strong> から JSON をエクスポートしておき、別の場所にバックアップしておくと安心です。
          </p>
          <p>
            新しい端末に乗り換えたときは、同じ画面から JSON をインポートすることで、これまでの記録を引き継ぐことができます。
          </p>
        </section>

        <section>
          <h2 style={sectionTitleStyle}>5. SNS との連携</h2>
          <p>
            Whisky Tasting Note には X（旧 Twitter）へのシェアを補助する機能も用意されています。
            ノートを保存したあと、そのまま投稿文のたたき台を作成し、写真と一緒に SNS に投稿する、という使い方も可能です。
          </p>
          <p>
            公開範囲や投稿内容には十分注意しつつ、自分のペースでテイスティングの記録を共有してみてください。
          </p>
        </section>

        <footer style={{ fontSize: "0.9rem", opacity: 0.8 }}>
          <p style={{ margin: 0 }}>
            このアプリは個人の記録をサポートするツールであり、特定の銘柄や飲み方を推奨・保証するものではありません。
            体調や環境に配慮しながら、無理のない範囲でウイスキーをお楽しみください。
          </p>
          <p style={{ margin: "0.4rem 0 0" }}>
            アプリの基本的なテイスティングの流れについては{" "}
            <Link href="/guides/tasting-basics" style={{ textDecoration: "underline" }}>
              ウイスキーテイスティングの始め方
            </Link>
            もご覧ください。
          </p>
        </footer>
      </article>
    </main>
  );
}

