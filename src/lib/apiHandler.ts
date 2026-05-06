import { NextRequest, NextResponse } from "next/server";

type RouteHandler = (
  req: NextRequest,
  context?: { params: Promise<Record<string, string>> },
) => Promise<NextResponse>;

export function apiHandler(handler: RouteHandler): RouteHandler {
  return async (req, context) => {
    try {
      return await handler(req, context);
    } catch (error) {
      console.error("[apiHandler] Unhandled error:", error);
      return NextResponse.json(
        { data: null, error: { code: "INTERNAL_ERROR", message: "Sunucu hatasi" } },
        { status: 500 },
      );
    }
  };
}
