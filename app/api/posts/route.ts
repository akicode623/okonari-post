import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function asString(v: unknown): string {
  return typeof v === "string" ? v : "";
}

function asStringArray(v: unknown): string[] {
  if (Array.isArray(v)) {
    return v.map((x) => String(x)).filter((s) => s.trim() !== "");
  }
  // もし "学校,公共の場" のような文字で来た場合の保険
  if (typeof v === "string") {
    return v
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s !== "");
  }
  return [];
}

export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      orderBy: { createdAt: "desc" },
      take: 500,
    });
    return NextResponse.json(posts);
  } catch (e: any) {
    console.error("GET /api/posts failed:", e);
    return NextResponse.json(
      { error: "GET /api/posts failed", detail: String(e?.message ?? e) },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // ① 年齢を数値として取り出す
    const age = Number(body.age);

    // ② 文字列を取り出す
    const gender = asString(body.gender).trim();
    const solution = asString(body.solution).trim();

    // ③ places/actions は「配列」として取り出す（schema.prisma に合わせる）
    const places = asStringArray(body.places);
    const actions = asStringArray(body.actions);

    // ④ バリデーション
    if (!Number.isFinite(age)) {
      return NextResponse.json({ error: "age が不正です" }, { status: 400 });
    }
    if (!gender || !solution) {
      return NextResponse.json(
        { error: "gender/solution は必須です" },
        { status: 400 }
      );
    }

    // places/actions は必須にしたいならここも必須チェック
    // （必須にしないなら削除してOK）
    if (places.length === 0 || actions.length === 0) {
      return NextResponse.json(
        { error: "places/actions は必須です" },
        { status: 400 }
      );
    }

    // ⑤ DB登録（重要：places/actions）
    const created = await prisma.post.create({
      data: { age, gender, places, actions, solution },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (e: any) {
    console.error("POST /api/posts failed:", e);
    return NextResponse.json(
      { error: "POST /api/posts failed", detail: String(e?.message ?? e) },
      { status: 500 }
    );
  }
}
