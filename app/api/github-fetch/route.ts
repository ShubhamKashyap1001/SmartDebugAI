import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const { owner, repo, path, branch } = await req.json();

    if (!owner || !repo || !path) {
      return NextResponse.json(
        { error: "owner, repo, path are required" },
        { status: 400 }
      );
    }

    const token = (await cookies()).get("github_token")?.value;

    const usedBranch = branch || "main";

    const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${usedBranch}`;

    const ghRes = await fetch(apiUrl, {
      headers: {
        Accept: "application/vnd.github+json",
        "User-Agent": "NextJS-GitHub-Fetch",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      cache: "no-store",
    });

    if (!ghRes.ok) {
      const details = await ghRes.text();
      return NextResponse.json(
        {
          error: "GitHub fetch failed",
          status: ghRes.status,
          details,
          apiUrl,
        },
        { status: ghRes.status }
      );
    }

    const fileData: any = await ghRes.json();

    if (!fileData?.content) {
      return NextResponse.json(
        { error: "This path is not a file (maybe folder).", fileData },
        { status: 400 }
      );
    }

    const code = Buffer.from(fileData.content, "base64").toString("utf-8");

    return NextResponse.json({
      message: "GitHub file fetched successfully",
      fileName: fileData.name,
      code,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
