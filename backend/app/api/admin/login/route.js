import jwt from "jsonwebtoken";

// ✅ Handle CORS Preflight (VERY IMPORTANT)
export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "http://localhost:5173",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

// ✅ Handle Login POST
export async function POST(req) {
  try {
    const { email, password } = await req.json();

    // 🔐 Hardcoded admin credentials (for now)
    if (email === "admin@mineraljal.com" && password === "123456") {
      const token = jwt.sign(
        { role: "admin" },
        "super_secret_key",
        { expiresIn: "1d" }
      );

      return new Response(JSON.stringify({ token }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "http://localhost:5173",
        },
      });
    }

    return new Response(
      JSON.stringify({ error: "Invalid credentials" }),
      {
        status: 401,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "http://localhost:5173",
        },
      }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Server error" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "http://localhost:5173",
        },
      }
    );
  }
}