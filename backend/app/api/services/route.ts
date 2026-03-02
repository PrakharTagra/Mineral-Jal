// import { SERVICES, CUSTOMERS } from "../storage";

// const allowedOrigins = [
//   "http://localhost:5173",
//   "https://mineral-jal.vercel.app",
// ];

// function getCorsHeaders(origin: string | null) {
//   const allowedOrigin =
//     origin && allowedOrigins.includes(origin)
//       ? origin
//       : allowedOrigins[1];

//   return {
//     "Access-Control-Allow-Origin": allowedOrigin,
//     "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
//     "Access-Control-Allow-Headers": "Content-Type",
//   };
// }

// /* ✅ Handle preflight */
// export async function OPTIONS(req: Request) {
//   const origin = req.headers.get("origin");

//   return new Response(null, {
//     status: 200,
//     headers: getCorsHeaders(origin),
//   });
// }

// export async function GET(req: Request) {
//   const origin = req.headers.get("origin");
//   const { searchParams } = new URL(req.url);
//   const invoiceNumber = searchParams.get("invoiceNumber");

//   const servicesWithCustomer = SERVICES.map((service) => {
//     const customer = CUSTOMERS.find(
//       (c) => c.id === service.customerId
//     );

//     return {
//       ...service,
//       customer: customer || null,
//     };
//   });

//   if (!invoiceNumber) {
//     return new Response(JSON.stringify(servicesWithCustomer), {
//       headers: getCorsHeaders(origin),
//     });
//   }

//   const single = servicesWithCustomer.find(
//     (s) => s.invoiceNumber === invoiceNumber
//   );

//   return new Response(JSON.stringify(single || null), {
//     headers: getCorsHeaders(origin),
//   });
// }

// export async function POST(req: Request) {
//   const origin = req.headers.get("origin");
//   const body = await req.json();

//   const newServiceId = Date.now();

//   const newService = {
//     id: newServiceId,
//     ...body,
//   };

//   SERVICES.push(newService);

//   const customer = CUSTOMERS.find(
//     (c) => c.id === body.customerId
//   );

//   if (customer) {
//     customer.services.push(newServiceId);
//   }

//   return new Response(
//     JSON.stringify({
//       success: true,
//       service: newService,
//     }),
//     {
//       headers: getCorsHeaders(origin),
//     }
//   );
// }
import { connectDB } from "@/lib/mongodb";
import Service from "@/models/Service";
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
   /api/services
   /api/services?invoiceNumber=...
=========================== */
export async function GET(req: Request) {
  await connectDB();

  const origin = req.headers.get("origin");
  const { searchParams } = new URL(req.url);
  const invoiceNumber = searchParams.get("invoiceNumber");

  // 🔥 Fetch by invoiceNumber
  if (invoiceNumber) {
    const single = await Service.findOne({ invoiceNumber })
      .populate("customerId");

    return new Response(JSON.stringify(single), {
      status: 200,
      headers: getCorsHeaders(origin),
    });
  }

  // 🔥 Fetch all services
  const services = await Service.find()
    .populate("customerId")
    .sort({ createdAt: -1 });

  return new Response(JSON.stringify(services), {
    status: 200,
    headers: getCorsHeaders(origin),
  });
}

/* ===========================
   POST
=========================== */
export async function POST(req: Request) {
  await connectDB();

  const origin = req.headers.get("origin");
  const body = await req.json();

  const { customerId } = body;

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

  const newService = await Service.create(body);

  return new Response(
    JSON.stringify({
      success: true,
      service: newService,
    }),
    {
      status: 201,
      headers: getCorsHeaders(origin),
    }
  );
}