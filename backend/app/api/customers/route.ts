import { connectDB } from "@/lib/mongodb";
import Customer from "@/models/Customer";

const allowedOrigins = [
  "http://localhost:5173",
  "https://mineral-jal.vercel.app",
];

function getCorsHeaders(origin: string | null) {
  return {
    "Access-Control-Allow-Origin":
      origin && allowedOrigins.includes(origin)
        ? origin
        : allowedOrigins[0],
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
   /api/customers
   /api/customers?id=...
   /api/customers?phone=...
=========================== */
export async function GET(req: Request) {
  await connectDB();

  const origin = req.headers.get("origin");
  const { searchParams } = new URL(req.url);

  const id = searchParams.get("id");
  const phone = searchParams.get("phone");

  // 🔥 Fetch by id
  if (id) {
    const customer = await Customer.findById(id);
    return new Response(JSON.stringify(customer), {
      status: 200,
      headers: getCorsHeaders(origin),
    });
  }

  // 🔥 Fetch by phone
  if (phone) {
    const customer = await Customer.findOne({ phone });
    return new Response(JSON.stringify(customer), {
      status: 200,
      headers: getCorsHeaders(origin),
    });
  }

  // 🔥 Fetch all customers
  const customers = await Customer.find()
    .sort({ createdAt: -1 });

  return new Response(JSON.stringify(customers), {
    status: 200,
    headers: getCorsHeaders(origin),
  });
}

/* ===========================
   POST Create Customer
=========================== */
export async function POST(req: Request) {
  await connectDB();

  const origin = req.headers.get("origin");
  const body = await req.json();

  const phone = String(body.phone || "").trim();

  if (!phone) {
    return new Response(
      JSON.stringify({
        success: false,
        message: "Phone is required",
      }),
      {
        status: 400,
        headers: getCorsHeaders(origin),
      }
    );
  }

  // 🔥 Prevent duplicate phone
  const existingCustomer = await Customer.findOne({ phone });

  if (existingCustomer) {
    return new Response(
      JSON.stringify({
        success: true,
        customer: existingCustomer,
        message: "Customer already exists",
      }),
      {
        status: 200,
        headers: getCorsHeaders(origin),
      }
    );
  }

  const newCustomer = await Customer.create({
    name: body.name || "",
    phone,
    address: body.address || "",
    reference: body.reference || "",
  });

  return new Response(
    JSON.stringify({
      success: true,
      customer: newCustomer,
    }),
    {
      status: 201,
      headers: getCorsHeaders(origin),
    }
  );
}