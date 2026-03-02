import { RO_INSTALLS, CUSTOMERS } from "../storage";

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
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  const roWithCustomer = RO_INSTALLS.map((ro) => {
    const customer = CUSTOMERS.find(
      (c) => c.id === ro.customerId
    );

    return {
      ...ro,
      customer: customer
      ? {
          id: customer.id,
          name: customer.name,
          phone: customer.phone,
          address: customer.address,
        }
      : null
    };
  });

  if (!id) {
    return new Response(JSON.stringify(roWithCustomer), {
      headers: getCorsHeaders(origin),
    });
  }

  const single = roWithCustomer.find(
    (r) => r.id === Number(id)
  );

  return new Response(JSON.stringify(single ?? null), {
    headers: getCorsHeaders(origin),
  });
}

export async function POST(req: Request) {
  const origin = req.headers.get("origin");
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

  const customer = CUSTOMERS.find(
    (c) => c.id === Number(customerId)
  );

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

  const newROId = Date.now();

  const newRO = {
    id: newROId,
    invoiceNumber,
    customerId: Number(customerId),
    model,
    installDate,
    note,
    components,
    installationCost,
    discountPercent,
    discountAmount,
    totalAmount,
    startAmc,
    createdAt: new Date().toISOString(),
  };

  RO_INSTALLS.push(newRO);

  // ✅ Correct linking
  if (!customer.roInstalls) {
    customer.roInstalls = [];
  }

  customer.roInstalls.push(newROId);

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
}