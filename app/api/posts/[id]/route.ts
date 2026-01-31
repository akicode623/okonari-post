import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type ParamsPromise = Promise<{ id: string }>;

export async function GET(_: Request, ctx: { params: ParamsPromise }) {
  try {
    // ① params を await して取り出す
    const { id } = await ctx.params;

    // ② DBから1件取得する
    const post = await prisma.post.findUnique({ where: { id } });

    // ③ ない場合は404
    if (!post) {
      return NextResponse.json({ error: "not found" }, { status: 404 });
    }

    // ④ JSONで返す
    return NextResponse.json(post);
  } catch (e: any) {
    return NextResponse.json(
      { error: "GET /api/posts/[id] failed", detail: String(e?.message ?? e) },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request, ctx: { params: ParamsPromise }) {
  try {
    // ① params を await して取り出す
    const { id } = await ctx.params;

    // ② body を読む
    const body = await req.json();

    // ③ 型を整える（places/actions は配列にする）
    const age = Number(body.age);
    const gender = String(body.gender ?? "");
    const places = Array.isArray(body.places)
      ? body.places.map(String)
      : body.place
      ? [String(body.place)]
      : [];
    const actions = Array.isArray(body.actions)
      ? body.actions.map(String)
      : body.action
      ? [String(body.action)]
      : [];
    const solution = String(body.solution ?? "");

    // ④ 入力チェック
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

    // ⑤ 更新する
    const updated = await prisma.post.update({
      where: { id },
      data: { age, gender, places, actions, solution },
    });

    // ⑥ 返す
    return NextResponse.json(updated);
  } catch (e: any) {
    return NextResponse.json(
      { error: "PUT /api/posts/[id] failed", detail: String(e?.message ?? e) },
      { status: 500 }
    );
  }
}

export async function DELETE(_: Request, ctx: { params: ParamsPromise }) {
  try {
    // ① params を await して取り出す（ここが今回の本丸）
    const { id } = await ctx.params;

    // ② 削除する
    await prisma.post.delete({ where: { id } });

    // ③ OKを返す
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json(
      { error: "DELETE /api/posts/[id] failed", detail: String(e?.message ?? e) },
      { status: 500 }
    );
  }
}
