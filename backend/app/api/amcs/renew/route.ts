import { connectDB } from "@/lib/mongodb";
import AMC from "@/models/AMC";

const allowedOrigins = [
  "http://localhost:5173",
  "https://mineral-jal.vercel.app",
];

function getCorsHeaders(origin: string | null) {
  return {
    "Access-Control-Allow-Origin":
      origin && allowedOrigins.includes(origin)
        ? origin
        : allowedOrigins[1],
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
  };
}

/* ===========================
   OPTIONS (Preflight)
=========================== */
export async function OPTIONS(req: Request) {
  return new Response(null, {
    status: 200,
    headers: getCorsHeaders(req.headers.get("origin")),
  });
}

/* ===========================
   RENEW AMC
=========================== */
export async function POST(req: Request) {
  const origin = req.headers.get("origin");

  try {
    await connectDB();

    const { amcId } = await req.json();

    const start = new Date();

    const four = new Date(start);
    four.setMonth(start.getMonth() + 4);

    const eight = new Date(start);
    eight.setMonth(start.getMonth() + 8);

    const twelve = new Date(start);
    twelve.setMonth(start.getMonth() + 12);

    const renewed = await AMC.findByIdAndUpdate(
      amcId,
      {
        startDate: start,
        fourMonth: { date: four },
        eightMonth: { date: eight },
        twelveMonth: { date: twelve },
        renewed: true,
        status: "ACTIVE",
      },
      { new: true }
    );

    return new Response(
      JSON.stringify({
        success: true,
        amc: renewed,
      }),
      {
        status: 200,
        headers: getCorsHeaders(origin),
      }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        message: "AMC renewal failed",
      }),
      {
        status: 500,
        headers: getCorsHeaders(origin),
      }
    );
  }
}