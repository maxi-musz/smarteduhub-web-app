import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { level = "info", message, data } = body;

    // Log to terminal (server-side)
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}`;
    
    if (data) {
      console.log(logMessage, data);
    } else {
      console.log(logMessage);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Log API] Error logging message:", error);
    return NextResponse.json(
      { success: false, error: "Failed to log message" },
      { status: 500 }
    );
  }
}

