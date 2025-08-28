import { NextResponse } from "next/server";

export async function GET() {
  // Placeholder response
  return NextResponse.json({ items: [] });
}

export async function POST() {
  return NextResponse.json({ ok: true }, { status: 201 });
}

export async function DELETE() {
  return NextResponse.json({ ok: true }, { status: 204 });
}


