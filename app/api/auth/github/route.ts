import { NextResponse } from "next/server";

export async function GET() {
  const clientId = process.env.GITHUB_CLIENT_ID;
  const redirectUri = "http://localhost:3000/api/auth/github/callback";

  if (!clientId) {
    return NextResponse.json(
      { error: "GITHUB_CLIENT_ID is missing in .env" },
      { status: 500 }
    );
  }

  const githubAuthUrl =
    `https://github.com/login/oauth/authorize?client_id=${clientId}` +
    `&redirect_uri=${redirectUri}&scope=repo read:user`;

  return NextResponse.redirect(githubAuthUrl);
}
