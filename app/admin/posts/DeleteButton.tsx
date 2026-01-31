"use client";

export default function DeleteButton({ id }: { id: string }) {
  async function onDelete() {
    if (!confirm("削除しますか？")) return;

    const res = await fetch(`/api/posts/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const t = await res.text();
      alert("削除に失敗しました: " + t);
      return;
    }

    // 一番シンプル：画面リロードで再取得
    location.reload();
  }

  return (
    <button onClick={onDelete} className="rounded bg-red-600 px-3 py-1 font-semibold text-white">
      削除
    </button>
  );
}
