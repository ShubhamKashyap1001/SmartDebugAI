import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = cookies();
  const token = (await cookieStore).get("github_token")?.value;

  if (!token) {
    return NextResponse.json(
      { error: "Not authenticated" },
      { status: 401 }
    );
  }

  const res = await fetch("https://api.github.com/user/repos", {
    headers: {
      Authorization: `Bearer ${token}`,
      "User-Agent": "smartDebugAI",
      Accept: "application/vnd.github+json",
    },
  });

  if (!res.ok) {
    return NextResponse.json(
      { error: "Failed to fetch repositories from GitHub" },
      { status: res.status }
    );
  }

  const repos = await res.json();

  return NextResponse.json({ repos });
}
