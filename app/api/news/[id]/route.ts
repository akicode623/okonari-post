import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type ParamsPromise = Promise<{ id: string }>;

export async function DELETE(_: Request, ctx: { params: ParamsPromise }) {
  try {
    const { id } = await ctx.params;
    await prisma.newsPost.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    return NextResponse.json(
      { error: "DELETE /api/news/[id] failed", detail: e instanceof Error ? e.message : String(e) },
      { status: 500 }
    );
  }
}
