import { NextResponse } from "next/server";

export function validateApiKey(req) {
  const apiKey = req.headers.get("x-api-key");

  if (!apiKey) {
    return {
      success: false,
      response: NextResponse.json(
        {
          success: false,
          error: "Missing API Key",
        },
        { status: 401 }
      ),
    };
  }

  if (apiKey !== process.env.INTEGRATION_API_KEY) {
    return {
      success: false,
      response: NextResponse.json(
        {
          success: false,
          error: "Invalid API Key",
        },
        { status: 403 }
      ),
    };
  }

  return {
    success: true,
  };
}