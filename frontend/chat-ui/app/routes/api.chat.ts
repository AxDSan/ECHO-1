import type { ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";

export const action: ActionFunction = async ({ request }) => {
  const { FASTAPI_BASE_URL } = process.env;

  if (!FASTAPI_BASE_URL) {
    return json({ error: "FASTAPI_BASE_URL is not set." }, { status: 500 });
  }

  const body = await request.json();

  try {
    console.log("Sending request to FastAPI");
    const response = await fetch(`${FASTAPI_BASE_URL}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    console.log("Response from FastAPI:", response);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error response from FastAPI:", errorText);
      return json({ error: errorText }, { status: response.status });
    }

    // Return the response as a stream
    return new Response(response.body, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error forwarding chat request:", error);
    return json({ error: "Internal Server Error" }, { status: 500 });
  }
};