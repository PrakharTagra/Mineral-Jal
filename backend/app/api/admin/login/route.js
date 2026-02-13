import jwt from "jsonwebtoken";

// ✅ Handle CORS Preflight
export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

// ✅ Handle Login POST
export async function POST(req) {
  try {
    const { email, password } = await req.json();

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
          "Access-Control-Allow-Origin": "*",
        },
      });
    }

    return new Response(
      JSON.stringify({ error: "Invalid credentials" }),
      {
        status: 401,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
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
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  }
}