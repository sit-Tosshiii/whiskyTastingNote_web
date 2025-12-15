import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "利用規約 | Whisky Tasting Note",
  description: "Whisky Tasting Note の利用規約と注意事項を記載しています。"
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

export default function TermsPage() {
  return (
    <main style={{ width: "100%", maxWidth: 860, margin: "0 auto", padding: "1.5rem" }}>
      <article style={containerStyle}>
        <header>
          <p style={{ fontSize: "0.9rem", letterSpacing: "0.05em", opacity: 0.8 }}>TERMS OF USE</p>
          <h1 style={{ fontSize: "1.9rem", margin: "0.2rem 0 0.85rem" }}>利用規約</h1>
          <p style={{ margin: 0 }}>
            Whisky Tasting Note（以下「当アプリ」といいます）は、ウイスキーのテイスティングノートを個人で記録・振り返るための
            ツールです。本規約は、利用者の皆さまと当アプリ運営者との間に適用される条件を定めるものです。
          </p>
        </header>

        <section>
          <h2 style={sectionTitleStyle}>第1条（適用範囲）</h2>
          <p>
            本規約は、当アプリにアクセスし、または利用するすべての方に適用されます。利用者は、本規約に同意したうえで当アプリを利用するものとします。
          </p>
        </section>

        <section>
          <h2 style={sectionTitleStyle}>第2条（対象年齢と飲酒に関する注意）</h2>
          <p>
            当アプリは、20 歳以上の方を対象としています。20 歳未満の飲酒は法律で禁止されており、未成年者による利用は想定していません。
            また、当アプリは適量かつ節度ある飲酒を前提としており、過度な飲酒や一気飲み等を推奨するものではありません。
          </p>
        </section>

        <section>
          <h2 style={sectionTitleStyle}>第3条（提供内容）</h2>
          <p>
            当アプリは、利用者が入力したテイスティングノートを端末内の IndexedDB に保存し、検索・閲覧するための機能を提供します。
            将来的にクラウド同期や分析機能が追加される場合がありますが、その際は別途ポリシーや説明を提示します。
          </p>
        </section>

        <section>
          <h2 style={sectionTitleStyle}>第4条（禁止事項）</h2>
          <ul style={{ margin: 0, paddingLeft: "1.25rem" }}>
            <li>法令に違反する行為およびそのおそれのある行為</li>
            <li>第三者の権利・利益を侵害する行為</li>
            <li>当アプリの不正アクセス、リバースエンジニアリング等の行為</li>
            <li>本サービスの運営を妨げる行為</li>
            <li>その他、運営者が不適切と判断する行為</li>
          </ul>
        </section>

        <section>
          <h2 style={sectionTitleStyle}>第5条（免責事項）</h2>
          <p>
            当アプリの内容や提供状況について、その正確性・完全性・有用性を保証するものではありません。利用者が当アプリを利用したこと、
            または利用できなかったことにより生じた損害について、運営者は一切の責任を負いません。
          </p>
          <p>
            また、当アプリで扱うウイスキーに関する情報や評価は、あくまで個人的なメモや主観であり、銘柄の購入や飲酒行為を直接推奨するものではありません。
          </p>
        </section>

        <section>
          <h2 style={sectionTitleStyle}>第6条（広告および外部サービス）</h2>
          <p>
            当アプリでは、Google AdSense を含む第三者配信事業者の広告を掲載する場合があります。広告の内容や表示位置については、広告事業者の裁量により決定されることがあり、
            広告先サイトの内容について当アプリ運営者は一切の責任を負いません。
          </p>
          <p>
            広告配信時のデータ取扱いについては{" "}
            <Link href="/privacy" style={{ textDecoration: "underline" }}>
              プライバシーポリシー
            </Link>
            もあわせてご確認ください。
          </p>
        </section>

        <section>
          <h2 style={sectionTitleStyle}>第7条（規約の変更）</h2>
          <p>
            運営者は、必要と判断した場合には、利用者への通知なく本規約を変更することができます。重要な変更がある場合は、当アプリ上での告知等によりお知らせします。
            変更後も当アプリを利用された場合、変更後の規約に同意いただいたものとみなします。
          </p>
        </section>

        <section>
          <h2 style={sectionTitleStyle}>第8条（準拠法・管轄）</h2>
          <p>
            本規約の解釈には日本法を適用します。当アプリに関して紛争が生じた場合、運営者の所在地を管轄する裁判所を第一審の専属的合意管轄裁判所とします。
          </p>
        </section>

        <section>
          <h2 style={sectionTitleStyle}>お問い合わせ</h2>
          <p>
            本規約に関するお問い合わせは{" "}
            <Link href="/contact" style={{ textDecoration: "underline" }}>
              お問い合わせページ
            </Link>
            よりご連絡ください。
          </p>
        </section>
      </article>
    </main>
  );
}

