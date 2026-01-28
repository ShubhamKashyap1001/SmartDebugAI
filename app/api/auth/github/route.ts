// import { NextResponse } from "next/server";

// export async function GET() {
//   const clientId = process.env.GITHUB_CLIENT_ID;

//   const baseUrl =
//     process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

//   const redirectUri = `${baseUrl}/api/auth/github/callback`;

//   if (!clientId) {
//     return NextResponse.json(
//       { error: "GITHUB_CLIENT_ID is missing" },
//       { status: 500 }
//     );
//   }

//   const githubAuthUrl =
//     `https://github.com/login/oauth/authorize?client_id=${clientId}` +
//     `&redirect_uri=${redirectUri}&scope=repo read:user`;

//   return NextResponse.redirect(githubAuthUrl);
// }


import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const clientId = process.env.GITHUB_CLIENT_ID
  const origin = new URL(req.url).origin;
  const redirectUri = `${origin}/api/auth/github/callback`;

  if (!clientId) {
    return NextResponse.json(
      { error: "GITHUB_CLIENT_ID is missing" },
      { status: 500 }
    );
  }

  const githubAuthUrl =
    `https://github.com/login/oauth/authorize?client_id=${clientId}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&scope=repo read:user`;

  return NextResponse.redirect(githubAuthUrl);
}
