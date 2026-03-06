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
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
  };
}

export async function OPTIONS(req: Request) {
  return new Response(null, {
    status: 200,
    headers: getCorsHeaders(req.headers.get("origin")),
  });
}

export async function GET(req: Request) {
  const origin = req.headers.get("origin");

  try {
    await connectDB();

    const amcs = await AMC.find()
      .populate("customerId")
      .populate("roId")
      .sort({ createdAt: -1 });

    const now = new Date();

    const formatted = amcs.map((amc) => {
      const four = amc.fourMonth?.date
        ? new Date(amc.fourMonth.date)
        : null;

      const eight = amc.eightMonth?.date
        ? new Date(amc.eightMonth.date)
        : null;

      const twelve = amc.twelveMonth?.date
        ? new Date(amc.twelveMonth.date)
        : null;

      let status = "ACTIVE";

      if (twelve && now > twelve) status = "EXPIRED";
      else if (eight && now > eight) status = "DUE";
      else if (four && now > four) status = "DUE";

      return {
        ...amc.toObject(),
        status,
      };
    });

    return new Response(JSON.stringify(formatted), {
      status: 200,
      headers: getCorsHeaders(origin),
    });
  } catch (error) {
    console.error("AMC API ERROR:", error);

    return new Response(
      JSON.stringify({ error: "AMC fetch failed" }),
      {
        status: 500,
        headers: getCorsHeaders(origin),
      }
    );
  }
}

/* ===========================
   POST
=========================== */
export async function POST(req: Request) {
  await connectDB();

  const origin = req.headers.get("origin");
  const body = await req.json();

  const start = new Date(body.startDate);

  const fourMonth = new Date(start);
  fourMonth.setMonth(start.getMonth() + 4);

  const eightMonth = new Date(start);
  eightMonth.setMonth(start.getMonth() + 8);

  const twelveMonth = new Date(start);
  twelveMonth.setMonth(start.getMonth() + 12);

  const amc = await AMC.create({
    customerId: body.customerId,
    roId: body.roId,
    startDate: start,
    fourMonth: { date: fourMonth },
    eightMonth: { date: eightMonth },
    twelveMonth: { date: twelveMonth },
  });

  return new Response(
    JSON.stringify({
      success: true,
      amc,
    }),
    {
      status: 201,
      headers: getCorsHeaders(origin),
    }
  );
}