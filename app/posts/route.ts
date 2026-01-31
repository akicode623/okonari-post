import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/posts?age=6&gender=男の子&place=学校&action=怒りっぽい&q=キーワード
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const ageStr = searchParams.get("age") ?? "";
    const gender = searchParams.get("gender") ?? "";
    const place = searchParams.get("place") ?? "";
    const action = searchParams.get("action") ?? "";
    const q = searchParams.get("q") ?? "";

    const age = ageStr.trim() ? Number(ageStr) : null;

    const where: any = {};

    // 年齢（完全一致）
    if (age !== null && !Number.isNaN(age)) where.age = age;

    // 性別（完全一致、"指定なし"は無視）
    if (gender && gender !== "（指定なし）") where.gender = gender;

    // 場所（部分一致）
    if (place.trim()) where.place = { contains: place.trim() };

    // 行動（部分一致）
    if (action.trim()) where.action = { contains: action.trim() };

    // 解決策キーワード（部分一致）
    if (q.trim()) where.solution = { contains: q.trim() };

    const posts = await prisma.post.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 500,
    });

    return NextResponse.json(posts);
  } catch (e: any) {
    return NextResponse.json(
      { error: "GET /api/posts failed", detail: String(e?.message ?? e) },
      { status: 500 }
    );
  }
}

// POST /api/posts
export async function POST(req: Request) {
  try {
    const body = await req.json();

    // 1) age を数値にする
    const age = Number(body.age);

    // 2) gender を文字列にする
    const gender = String(body.gender ?? "");

    // 3) place / places を「配列 places」に統一する
    //    - body.places が配列ならそれを使う
    //    - body.place が単体文字列なら [body.place] にする
    const places = Array.isArray(body.places)
      ? body.places.map(String)
      : body.place
      ? [String(body.place)]
      : [];

    // 4) action / actions を「配列 actions」に統一する
    const actions = Array.isArray(body.actions)
      ? body.actions.map(String)
      : body.action
      ? [String(body.action)]
      : [];

    // 5) solution を文字列にする
    const solution = String(body.solution ?? "");

    // 6) 入力チェック
    if (!Number.isFinite(age)) {
      return NextResponse.json({ error: "age が不正です" }, { status: 400 });
    }
    if (!gender) {
      return NextResponse.json({ error: "gender は必須です" }, { status: 400 });
    }
    if (places.length === 0) {
      return NextResponse.json({ error: "places は1つ以上必要です" }, { status: 400 });
    }
    if (actions.length === 0) {
      return NextResponse.json({ error: "actions は1つ以上必要です" }, { status: 400 });
    }
    if (!solution.trim()) {
      return NextResponse.json({ error: "solution は必須です" }, { status: 400 });
    }

    // 7) Prisma に保存（places/actions を渡す）
    const created = await prisma.post.create({
      data: { age, gender, places, actions, solution },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (e: any) {
    return NextResponse.json(
      { error: "POST failed", detail: String(e?.message ?? e) },
      { status: 500 }
    );
  }
}
