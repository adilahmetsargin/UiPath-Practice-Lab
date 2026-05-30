import { NextResponse } from "next/server";
import { getAiFeedback } from "@/lib/feedback";

export async function POST(request: Request) {
  const body = await request.json();
  const input = String(body.input || "").trim();
  const expectedChecks = Array.isArray(body.expectedChecks) ? body.expectedChecks.map(String) : [];

  if (!input) {
    return NextResponse.json({ error: "Feedback input is required." }, { status: 400 });
  }

  const feedback = await getAiFeedback(input, expectedChecks);
  return NextResponse.json(feedback);
}
