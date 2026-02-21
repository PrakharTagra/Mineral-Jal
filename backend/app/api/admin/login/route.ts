// export async function POST(req: Request) {
//   const { email, password } = await req.json();

//   if (email === "admin@test.com" && password === "1234") {
//     return Response.json({
//       token: "admin-token"
//     });
//   }

//   return Response.json(
//     { error: "Invalid credentials" },
//     { status: 401 }
//   );
// }
// Allow preflight requests
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

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (email === "admin@test.com" && password === "1234") {
      return new Response(
        JSON.stringify({ token: "admin-token" }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
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
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Invalid request" }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  }
}