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
   OPTIONS (preflight)
=========================== */
export async function OPTIONS(req: Request) {
  return new Response(null, {
    status: 200,
    headers: getCorsHeaders(req.headers.get("origin")),
  });
}

/* ===========================
   COMPLETE SERVICE CHECKPOINT
=========================== */
export async function POST(req: Request) {
  const origin = req.headers.get("origin");

  try {
    await connectDB();

    const body = await req.json();

    const { amcId, checkpoint, partsUsed, notes, billAmount } = body;

    // prevent invalid checkpoints
    const allowedCheckpoints = ["fourMonth", "eightMonth", "twelveMonth"];

    if (!allowedCheckpoints.includes(checkpoint)) {
      return new Response(
        JSON.stringify({ success: false, message: "Invalid checkpoint" }),
        { status: 400, headers: getCorsHeaders(origin) }
      );
    }

    const update = {
      [`${checkpoint}.completed`]: true,
      [`${checkpoint}.completedOn`]: new Date(),
      [`${checkpoint}.partsUsed`]: partsUsed || [],
      [`${checkpoint}.notes`]: notes || "",
      [`${checkpoint}.billAmount`]: billAmount || 0,
    };

    const updated = await AMC.findByIdAndUpdate(
      amcId,
      { $set: update },
      { new: true }
    );

    return new Response(
      JSON.stringify({
        success: true,
        amc: updated,
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
        message: "Checkpoint update failed",
      }),
      {
        status: 500,
        headers: getCorsHeaders(origin),
      }
    );
  }
}