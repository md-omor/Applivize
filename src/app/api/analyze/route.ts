import { performAnalysisFlow } from "@/lib/analysis-flow";
import { getOrCreateUser } from "@/lib/credits";
import { AnalysisRequest } from "@/types/analysis";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let email: string | undefined;
    try {
      const client = await clerkClient();
      const user = await client.users.getUser(userId);
      const primary = user.emailAddresses?.find((e: { id: string }) => e.id === user.primaryEmailAddressId);
      email = primary?.emailAddress ?? user.emailAddresses?.[0]?.emailAddress;
    } catch {
      // ignore
    }

    await getOrCreateUser(userId, email);

    const body: AnalysisRequest = await request.json();
    const { jobDescriptionText, resumeText } = body;

    // 1. Validate Input
    if (!jobDescriptionText || !resumeText) {
      return NextResponse.json(
        { 
          error: "INVALID_INPUT", 
          details: "Missing jobDescriptionText or resumeText" 
        },
        { status: 400 }
      );
    }

    // 2. Perform Analysis Flow
    const result = await performAnalysisFlow(userId, resumeText, jobDescriptionText);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: result.status }
      );
    }

    return NextResponse.json(result.data);

  } catch (error) {
    console.error("Endpoint Error:", error);
    return NextResponse.json(
      { error: "ANALYSIS_FAILED" },
      { status: 500 }
    );
  }
}
