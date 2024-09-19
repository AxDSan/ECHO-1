import type { ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

interface ChatRequest {
  messages: Array<{
    role: "user" | "system" | "assistant";
    content: string;
  }>;
  args: Record<string, any>;
}

export const action: ActionFunction = async ({ request }) => {
  const { FASTAPI_BASE_URL } = process.env;

  if (!FASTAPI_BASE_URL) {
    return json({ error: "FASTAPI_BASE_URL is not set." }, { status: 500 });
  }

  const body: ChatRequest = await request.json();

  try {
    const response = await fetch(`${FASTAPI_BASE_URL}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return json({ error: errorText }, { status: response.status });
    }

    const data = await response.json();
    return json(data);
  } catch (error) {
    console.error("Error forwarding chat request:", error);
    return json({ error: "Internal Server Error" }, { status: 500 });
  }
};