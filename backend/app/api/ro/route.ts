import { connectDB } from "@/lib/mongodb";
import RO from "@/models/RO";
import Customer from "@/models/Customer";
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
   GET
=========================== */
export async function GET(req: Request) {

  await connectDB();

  const origin = req.headers.get("origin");

  const { searchParams } = new URL(req.url);

  const id = searchParams.get("id");
  const invoiceNumber = searchParams.get("invoiceNumber");

  try {

    if (invoiceNumber) {

      const single = await RO.findOne({ invoiceNumber })
        .populate("customerId");

      return new Response(JSON.stringify(single), {
        status: 200,
        headers: getCorsHeaders(origin),
      });
    }

    if (id) {

      const single = await RO.findById(id)
        .populate("customerId");

      return new Response(JSON.stringify(single), {
        status: 200,
        headers: getCorsHeaders(origin),
      });
    }

    const ros = await RO.find()
      .populate("customerId")
      .sort({ createdAt: -1 });

    return new Response(JSON.stringify(ros), {
      status: 200,
      headers: getCorsHeaders(origin),
    });

  } catch (error) {

    return new Response(
      JSON.stringify({
        success: false,
        message: "Failed to fetch RO",
      }),
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

  try {

    const body = await req.json();

    const {
      invoiceNumber,
      customerId,
      model,
      installDate,
      note,
      components,
      installationCost,
      discountPercent,
      discountAmount,
      totalAmount,
      startAmc,
    } = body;

    if (!customerId) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Customer is required",
        }),
        {
          status: 400,
          headers: getCorsHeaders(origin),
        }
      );
    }

    const customer = await Customer.findById(customerId);

    if (!customer) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Customer not found",
        }),
        {
          status: 404,
          headers: getCorsHeaders(origin),
        }
      );
    }

    /* ---------- FORMAT COMPONENTS ---------- */

    const formattedComponents = (components || []).map((c: any) => ({
      id: c.id,
      name: c.name,
      price: Number(c.price || 0),
      quantity: Number(c.quantity || 1),
    }));

    /* ---------- CREATE RO ---------- */

    const newRO = await RO.create({
      invoiceNumber,
      customerId,
      model,
      installDate,
      note,
      components: formattedComponents,
      installationCost: Number(installationCost || 0),
      discountPercent: Number(discountPercent || 0),
      discountAmount: Number(discountAmount || 0),
      totalAmount: Number(totalAmount || 0),
      startAmc: Boolean(startAmc),
    });

    /* ---------- AUTO CREATE AMC ---------- */

    if (startAmc) {

      const existingAMC = await AMC.findOne({
        customerId,
        roId: newRO._id,
        status: "ACTIVE",
      });

      if (!existingAMC) {

        const start = new Date(installDate || new Date());

        const fourMonth = new Date(start);
        fourMonth.setMonth(start.getMonth() + 4);

        const eightMonth = new Date(start);
        eightMonth.setMonth(start.getMonth() + 8);

        const twelveMonth = new Date(start);
        twelveMonth.setMonth(start.getMonth() + 12);

        await AMC.create({
          customerId,
          roId: newRO._id,
          startDate: start,
          fourMonth: { date: fourMonth },
          eightMonth: { date: eightMonth },
          twelveMonth: { date: twelveMonth },
          status: "ACTIVE",
        });
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        ro: newRO,
      }),
      {
        status: 201,
        headers: getCorsHeaders(origin),
      }
    );

  } catch (error) {

    console.error("RO API Error:", error);

    return new Response(
      JSON.stringify({
        success: false,
        message: "Internal server error",
      }),
      {
        status: 500,
        headers: getCorsHeaders(origin),
      }
    );
  }
}