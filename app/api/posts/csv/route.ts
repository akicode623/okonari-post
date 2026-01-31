import { prisma } from "@/lib/prisma";

function csvEscape(v: any) {
  const s = String(v ?? "");
  if (s.includes('"') || s.includes(",") || s.includes("\n")) {
    return `"${s.replaceAll('"', '""')}"`;
  }
  return s;
}

export async function GET() {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    take: 2000,
  });

  const header = ["日時", "年齢", "性別", "場所", "行動", "解決策"];
  const rows = posts.map((p) => [
    p.createdAt.toISOString(),
    p.age,
    p.gender,
    (p.places ?? []).join(" / "),
    (p.actions ?? []).join(" / "),
    p.solution,
  ]);

  const csv = [header, ...rows].map((r) => r.map(csvEscape).join(",")).join("\r\n");

  // ✅ Excel 文字化け対策：UTF-8 BOM
  const bom = "\uFEFF";
  const body = bom + csv;

  return new Response(body, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="posts.csv"',
    },
  });
}
