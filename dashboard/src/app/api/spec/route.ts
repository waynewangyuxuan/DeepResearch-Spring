import { NextResponse } from "next/server";
import { parseSpec } from "@/lib/parser";

export async function GET() {
  const spec = parseSpec();
  return NextResponse.json(spec);
}
