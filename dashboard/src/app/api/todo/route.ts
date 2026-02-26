import { NextRequest, NextResponse } from "next/server";
import { updateTodoStatus } from "@/lib/writer";
import { parseTodo } from "@/lib/parser";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { lineNumber, checked } = body;

  if (typeof lineNumber !== "number" || typeof checked !== "boolean") {
    return NextResponse.json(
      { error: "Invalid request: lineNumber (number) and checked (boolean) required" },
      { status: 400 }
    );
  }

  const success = updateTodoStatus(lineNumber, checked);

  if (!success) {
    return NextResponse.json(
      { error: "Failed to update todo" },
      { status: 500 }
    );
  }

  const updatedTodos = parseTodo();
  return NextResponse.json({ todos: updatedTodos });
}
