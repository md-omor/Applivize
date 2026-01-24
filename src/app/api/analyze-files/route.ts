import { performAnalysisFlow } from "@/lib/analysis-flow";
import { getOrCreateUser } from "@/lib/credits";
import { parseFileFromFormData } from "@/lib/file-parser";
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

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const jobDescription = formData.get("jobDescription") as string;

    // 1. Validate Input
    if (!file || !jobDescription) {
      return NextResponse.json(
        { error: "INVALID_INPUT", details: "Missing file or jobDescription" },
        { status: 400 }
      );
    }

    // 2. Extract Text from File
    let resumeText: string;
    try {
      const parseResult = await parseFileFromFormData(file);
      resumeText = parseResult.text;
    } catch (error) {
      console.error("File Parsing Error:", error);
      return NextResponse.json(
        { error: "INVALID_INPUT", details: (error as Error).message || "Failed to parse file" },
        { status: 400 }
      );
    }

    if (!resumeText) {
      return NextResponse.json(
        { error: "INVALID_INPUT", details: "File contains no extractable text" },
        { status: 400 }
      );
    }

    // 3. Perform Analysis Flow
    const result = await performAnalysisFlow(userId, resumeText, jobDescription);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: result.status }
      );
    }

    return NextResponse.json(result.data);

  } catch (error) {
    console.error("File Analysis Endpoint Error:", error);
    return NextResponse.json(
      { error: "ANALYSIS_FAILED" },
      { status: 500 }
    );
  }
}
