import { NextResponse } from "next/server";
import { createWatcher } from "@/lib/watcher";

export const dynamic = "force-dynamic";

export async function GET() {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      const watcher = createWatcher((event, filePath, section) => {
        const data = JSON.stringify({
          event,
          section,
          file: filePath,
          timestamp: Date.now(),
        });
        controller.enqueue(encoder.encode(`data: ${data}\n\n`));
      });

      // Clean up on close
      const cleanup = () => {
        watcher.close();
      };

      // Send heartbeat every 30s
      const heartbeat = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(": heartbeat\n\n"));
        } catch {
          clearInterval(heartbeat);
          cleanup();
        }
      }, 30000);
    },
  });

  return new NextResponse(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
