export default {
  async fetch(request, env) {

    // Handle CORS preflight
    if (request.method === "OPTIONS") {
      return corsResponse(null, 204);
    }

    const url = new URL(request.url);

    if (url.pathname === "/contact" && request.method === "POST") {
      return handleContact(request, env);
    }

    return new Response("Not found", { status: 404 });
  },
};

async function handleContact(request, env) {
  let body;

  try {
    body = await request.json();
  } catch {
    return corsResponse({ error: "Invalid JSON" }, 400);
  }

  const { name, email, message } = body;

  // Basic validation
  if (!name || !email || !message) {
    return corsResponse({ error: "name, email, and message are required" }, 400);
  }

  if (!isValidEmail(email)) {
    return corsResponse({ error: "Invalid email address" }, 400);
  }

  if (message.length > 5000) {
    return corsResponse({ error: "Message too long (5000 character limit)" }, 400);
  }

  try {
    await env.DB.prepare(
      `INSERT INTO contacts (name, email, message, created_at)
       VALUES (?, ?, ?, datetime('now'))`
    )
      .bind(name.trim(), email.trim().toLowerCase(), message.trim())
      .run();

    return corsResponse({ success: true }, 200);

  } catch (err) {
    console.error("DB insert failed:", err);
    return corsResponse({ error: "Failed to save message" }, 500);
  }
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function corsResponse(body, status) {
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "https://sovereign-miner.com",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  return new Response(
    body !== null ? JSON.stringify(body) : null,
    { status, headers }
  );
}
