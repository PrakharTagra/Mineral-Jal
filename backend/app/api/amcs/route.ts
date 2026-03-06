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

/* ===========================
   OPTIONS
=========================== */
export async function OPTIONS(req: Request) {
  return new Response(null, {
    status: 200,
    headers: getCorsHeaders(req.headers.get("origin")),
  });
}

/* ===========================
   GET AMCs
=========================== */
export async function GET(req: Request) {
  const origin = req.headers.get("origin");

  try {
    await connectDB();

    const amcs = await AMC.find()
      .populate({
        path: "customerId",
        select: "name phone address",
      })
      .populate({
        path: "roId",
        select: "model",
      })
      .sort({ createdAt: -1 })
      .lean();

    const now = new Date();

    const formatted = amcs.map((amc: any) => {
      const four = amc?.fourMonth?.date
        ? new Date(amc.fourMonth.date)
        : null;

      const eight = amc?.eightMonth?.date
        ? new Date(amc.eightMonth.date)
        : null;

      const twelve = amc?.twelveMonth?.date
        ? new Date(amc.twelveMonth.date)
        : null;

      let status = "ACTIVE";

      if (twelve && now > twelve) status = "EXPIRED";
      else if (eight && now > eight) status = "DUE";
      else if (four && now > four) status = "DUE";

      return {
        ...amc,
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
        JSON.stringify({
          success: false,
          message: "AMC fetch failed",
          error: String(error)   // 👈 add this
        }),
        {
          status: 500,
          headers: getCorsHeaders(origin),
        }
      );

    return new Response(
      JSON.stringify({
        success: false,
        message: "AMC fetch failed",
      }),
      {
        status: 500,
        headers: getCorsHeaders(origin),
      }
    );
  }
}

/* ===========================
   CREATE AMC
=========================== */
export async function POST(req: Request) {
  const origin = req.headers.get("origin");

  try {
    await connectDB();

    const body = await req.json();

    const start = new Date(body.startDate || new Date());

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
      status: "ACTIVE",
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
  } catch (error) {
    console.error("AMC CREATE ERROR:", error);

    return new Response(
      JSON.stringify({
        success: false,
        message: "AMC creation failed",
      }),
      {
        status: 500,
        headers: getCorsHeaders(origin),
      }
    );
  }
}