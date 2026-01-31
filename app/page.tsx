import Link from "next/link";

export default function HomePage() {
  return (
    <main style={{ padding: "40px", textAlign: "center" }}>
      <h1>OKONARI POST</h1>
      <p>困り行動と解決策の投稿アプリ</p>

      <div style={{ marginTop: "30px" }}>
        <Link href="/posts/new">
          <button
            style={{
              padding: "12px 24px",
              fontSize: "16px",
              cursor: "pointer",
            }}
          >
            投稿ページへ
          </button>
        </Link>
      </div>
    </main>
  );
}
