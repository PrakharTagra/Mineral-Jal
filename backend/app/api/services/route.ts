import { SERVICES, CUSTOMERS } from "../storage";

const allowedOrigins = [
  "http://localhost:5173",
  "https://mineral-jal.vercel.app",
];

function getCorsHeaders(origin: string | null) {
  const allowedOrigin =
    origin && allowedOrigins.includes(origin)
      ? origin
      : allowedOrigins[1];

  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

/* ✅ Handle preflight */
export async function OPTIONS(req: Request) {
  const origin = req.headers.get("origin");

  return new Response(null, {
    status: 200,
    headers: getCorsHeaders(origin),
  });
}

export async function GET(req: Request) {
  const origin = req.headers.get("origin");
  const { searchParams } = new URL(req.url);
  const invoiceNumber = searchParams.get("invoiceNumber");

  const servicesWithCustomer = SERVICES.map((service) => {
    const customer = CUSTOMERS.find(
      (c) => c.id === service.customerId
    );

    return {
      ...service,
      customer: customer || null,
    };
  });

  if (!invoiceNumber) {
    return new Response(JSON.stringify(servicesWithCustomer), {
      headers: getCorsHeaders(origin),
    });
  }

  const single = servicesWithCustomer.find(
    (s) => s.invoiceNumber === invoiceNumber
  );

  return new Response(JSON.stringify(single || null), {
    headers: getCorsHeaders(origin),
  });
}

export async function POST(req: Request) {
  const origin = req.headers.get("origin");
  const body = await req.json();

  const newServiceId = Date.now();

  const newService = {
    id: newServiceId,
    ...body,
  };

  SERVICES.push(newService);

  const customer = CUSTOMERS.find(
    (c) => c.id === body.customerId
  );

  if (customer) {
    customer.services.push(newServiceId);
  }

  return new Response(
    JSON.stringify({
      success: true,
      service: newService,
    }),
    {
      headers: getCorsHeaders(origin),
    }
  );
}