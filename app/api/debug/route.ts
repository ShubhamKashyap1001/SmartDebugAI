import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { code, language, fileName } = body;

    // Validation
    if (!code || typeof code !== "string" || !code.trim()) {
      return NextResponse.json({ error: "code is required" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY missing in .env" },
        { status: 500 }
      );
    }

    const prompt = `
You are SmartDebugAI, an expert static code debugger.

IMPORTANT RULES:
1) User may NOT provide stack trace. Still debug based on static analysis.
2) NEVER say "insufficient information" or ask for stacktrace.
3) Keep the answer simple + point-wise.
4) Always provide corrected code.

Return ONLY VALID JSON (NO markdown, NO backticks):

{
  "errors": [
    {
      "title": "short error title",
      "whatHappened": ["point 1", "point 2"],
      "rootCause": ["point 1", "point 2"],
      "where": "file + line if possible",
      "howToFix": ["step 1", "step 2"]
    }
  ],
  "suggestions": ["point 1", "point 2", "point 3"],
  "fixedCode": "full corrected code"
}

File: ${fileName || "unknown"}
Language: ${language || "javascript"}

CODE:
${code}
`;

    const response = await axios.post(
      "https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent",
      {
        contents: [{ role: "user", parts: [{ text: prompt }] }],
      },
      {
        params: { key: apiKey },
        headers: { "Content-Type": "application/json" },
      }
    );

    const aiText =
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    const cleaned = aiText
      .trim()
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/```$/i, "")
      .trim();
    let parsed: any;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      parsed = {
        errors: [
          {
            title: "AI Output Not Structured",
            whatHappened: [
              "Gemini returned output in unexpected format.",
              "Could not parse response into JSON.",
            ],
            rootCause: ["AI response parsing failed."],
            where: fileName || "unknown",
            howToFix: [
              "Try again",
              "Ensure code is valid",
              "Provide error message/stack trace (optional)",
            ],
          },
        ],
        suggestions: [],
        fixedCode: code,
      };
    }

    return NextResponse.json({
      message: "Debug successful",
      data: { result: parsed },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Debug API failed" },
      { status: 500 }
    );
  }
}
