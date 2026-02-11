import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const DEFAULT_TAKE = 80;
const MAX_TAKE = 100;
const MAX_NAME_LENGTH = 30;
const MAX_MESSAGE_LENGTH = 500;

function asString(v: unknown): string {
  return typeof v === "string" ? v : "";
}

function errorMessage(e: unknown): string {
  return e instanceof Error ? e.message : String(e);
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const takeParam = Number(searchParams.get("take") ?? DEFAULT_TAKE);

    const take = Number.isFinite(takeParam)
      ? Math.min(Math.max(Math.floor(takeParam), 1), MAX_TAKE)
      : DEFAULT_TAKE;

    const messages = await prisma.chatMessage.findMany({
      orderBy: { createdAt: "desc" },
      take,
    });

    return NextResponse.json(messages.reverse());
  } catch (e: unknown) {
    console.error("GET /api/chat/messages failed:", e);
    return NextResponse.json(
      { error: "GET /api/chat/messages failed", detail: errorMessage(e) },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const displayName = asString(body.displayName).trim();
    const message = asString(body.message).trim();

    if (!displayName) {
      return NextResponse.json({ error: "表示名は必須です" }, { status: 400 });
    }
    if (displayName.length > MAX_NAME_LENGTH) {
      return NextResponse.json(
        { error: `表示名は${MAX_NAME_LENGTH}文字以内で入力してください` },
        { status: 400 }
      );
    }
    if (!message) {
      return NextResponse.json({ error: "メッセージは必須です" }, { status: 400 });
    }
    if (message.length > MAX_MESSAGE_LENGTH) {
      return NextResponse.json(
        { error: `メッセージは${MAX_MESSAGE_LENGTH}文字以内で入力してください` },
        { status: 400 }
      );
    }

    const created = await prisma.chatMessage.create({
      data: { displayName, message },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (e: unknown) {
    console.error("POST /api/chat/messages failed:", e);
    return NextResponse.json(
      { error: "POST /api/chat/messages failed", detail: errorMessage(e) },
      { status: 500 }
    );
  }
}
