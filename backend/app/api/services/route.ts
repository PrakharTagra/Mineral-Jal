import { connectDB } from "@/lib/mongodb";
import Service from "@/models/Service";
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

/* OPTIONS */
export async function OPTIONS(req: Request) {
  return new Response(null, {
    status: 200,
    headers: getCorsHeaders(req.headers.get("origin")),
  });
}

/* ===========================
   GET SERVICES
=========================== */

export async function GET(req: Request) {

  await connectDB();

  const origin = req.headers.get("origin");
  const { searchParams } = new URL(req.url);
  const invoiceNumber = searchParams.get("invoiceNumber");

  try {

    if (invoiceNumber) {

      const service = await Service.findOne({
        invoiceNumber,
      }).populate("customerId");

      return new Response(JSON.stringify(service), {
        status: 200,
        headers: getCorsHeaders(origin),
      });

    }

    const services = await Service.find()
      .populate("customerId")
      .sort({ createdAt: -1 });

    return new Response(JSON.stringify(services), {
      status: 200,
      headers: getCorsHeaders(origin),
    });

  } catch (error) {

    console.error("SERVICE FETCH ERROR:", error);

    return new Response(
      JSON.stringify({
        success: false,
        message: "Failed to fetch services",
      }),
      {
        status: 500,
        headers: getCorsHeaders(origin),
      }
    );
  }
}

/* ===========================
   CREATE SERVICE
=========================== */

export async function POST(req: Request) {

  await connectDB();

  const origin = req.headers.get("origin");

  try {

    const body = await req.json();

    const {
      invoiceNumber,
      customerId,
      roId,
      date,
      parts,
      serviceCharge,
      discountPercent,
      discountAmount,
      totalAmount,
      startAmc,
    } = body;

    /* CUSTOMER CHECK */

    if (!customerId) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Customer is required",
        }),
        { status: 400, headers: getCorsHeaders(origin) }
      );
    }

    const customer = await Customer.findById(customerId);

    if (!customer) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Customer not found",
        }),
        { status: 404, headers: getCorsHeaders(origin) }
      );
    }

    /* NORMALIZE PARTS */

    const safeParts = (parts || []).map((p: any) => ({
      id: Number(p.id || 0),
      name: p.name || "",
      price: Number(p.price || 0),
      quantity: Number(p.quantity || 1),
    }));

    /* CREATE SERVICE */

    const newService = await Service.create({
      invoiceNumber,
      customerId,
      roId: roId || null,
      date: new Date(date || new Date()),
      parts: safeParts,
      serviceCharge: Number(serviceCharge || 0),
      discountPercent: Number(discountPercent || 0),
      discountAmount: Number(discountAmount || 0),
      totalAmount: Number(totalAmount || 0),
      startAmc: Boolean(startAmc),
    });

    /* START AMC FROM SERVICE */

    if (startAmc) {

      if (!roId) {
        return new Response(
          JSON.stringify({
            success: false,
            message: "RO is required to start AMC",
          }),
          { status: 400, headers: getCorsHeaders(origin) }
        );
      }

      /* Prevent duplicate AMC */

      const existingAMC = await AMC.findOne({
        roId,
        status: "ACTIVE",
      });

      if (existingAMC) {
        return new Response(
          JSON.stringify({
            success: false,
            message: "AMC already active for this RO",
          }),
          { status: 400, headers: getCorsHeaders(origin) }
        );
      }

      const start = new Date(date || new Date());

      const addMonths = (d: Date, m: number) => {
        const x = new Date(d);
        x.setMonth(x.getMonth() + m);
        return x;
      };

      await AMC.create({
        customerId,
        roId,
        startDate: start,

        fourMonth: {
          date: addMonths(start, 4),
          completed: false,
        },

        eightMonth: {
          date: addMonths(start, 8),
          completed: false,
        },

        twelveMonth: {
          date: addMonths(start, 12),
          completed: false,
        },

        status: "ACTIVE",
      });

    }

    return new Response(
      JSON.stringify({
        success: true,
        service: newService,
      }),
      { status: 201, headers: getCorsHeaders(origin) }
    );

  } catch (error) {

    console.error("SERVICE CREATE ERROR:", error);

    return new Response(
      JSON.stringify({
        success: false,
        message: "Service creation failed",
        error: error instanceof Error ? error.message : String(error),
      }),
      {
        status: 500,
        headers: getCorsHeaders(origin),
      }
    );

  }
}