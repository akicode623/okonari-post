import { NextResponse } from "next/server";
import { NewsCategory } from "@prisma/client";
import { prisma } from "@/lib/prisma";

const MAX_TITLE_LENGTH = 120;
const MAX_CONTENT_LENGTH = 3000;

function asString(v: unknown): string {
  return typeof v === "string" ? v : "";
}

function parseCategory(v: unknown): NewsCategory | null {
  const raw = asString(v).toUpperCase();
  if (raw === NewsCategory.NOTICE) return NewsCategory.NOTICE;
  if (raw === NewsCategory.EVENT) return NewsCategory.EVENT;
  return null;
}

function parseEventDate(v: unknown): Date | null {
  const raw = asString(v).trim();
  if (!raw) return null;
  const d = new Date(raw);
  return Number.isNaN(d.getTime()) ? null : d;
}

function normalizeItem<T extends { createdAt: Date; updatedAt: Date; eventDate: Date | null }>(
  item: T
) {
  return {
    ...item,
    createdAt: item.createdAt.toISOString(),
    updatedAt: item.updatedAt.toISOString(),
    eventDate: item.eventDate ? item.eventDate.toISOString() : null,
  };
}

export async function GET() {
  try {
    const news = await prisma.newsPost.findMany({
      orderBy: [{ createdAt: "desc" }],
      take: 200,
    });

    return NextResponse.json(news.map(normalizeItem));
  } catch (e: unknown) {
    return NextResponse.json(
      { error: "GET /api/news failed", detail: e instanceof Error ? e.message : String(e) },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const category = parseCategory(body.category);
    const title = asString(body.title).trim();
    const content = asString(body.content).trim();
    const eventDate = parseEventDate(body.eventDate);

    if (!category) {
      return NextResponse.json({ error: "category is invalid" }, { status: 400 });
    }
    if (!title) {
      return NextResponse.json({ error: "title is required" }, { status: 400 });
    }
    if (title.length > MAX_TITLE_LENGTH) {
      return NextResponse.json(
        { error: `title must be <= ${MAX_TITLE_LENGTH} chars` },
        { status: 400 }
      );
    }
    if (!content) {
      return NextResponse.json({ error: "content is required" }, { status: 400 });
    }
    if (content.length > MAX_CONTENT_LENGTH) {
      return NextResponse.json(
        { error: `content must be <= ${MAX_CONTENT_LENGTH} chars` },
        { status: 400 }
      );
    }
    if (asString(body.eventDate).trim() !== "" && !eventDate) {
      return NextResponse.json({ error: "eventDate is invalid" }, { status: 400 });
    }

    const created = await prisma.newsPost.create({
      data: {
        category,
        title,
        content,
        eventDate: category === NewsCategory.EVENT ? eventDate : null,
      },
    });

    return NextResponse.json(normalizeItem(created), { status: 201 });
  } catch (e: unknown) {
    return NextResponse.json(
      { error: "POST /api/news failed", detail: e instanceof Error ? e.message : String(e) },
      { status: 500 }
    );
  }
}
