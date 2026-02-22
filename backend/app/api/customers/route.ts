// // import { CUSTOMERS } from "../storage";

// // export async function GET() {
// //   return Response.json(CUSTOMERS);
// // }

// // export async function POST(req: Request) {
// //   const body = await req.json();

// //   const newCustomer = {
// //     id: Date.now(),
// //     name: body.name,
// //     phone: body.phone,
// //     address: body.address,
// //     reference: body.reference,
// //     services: []  // important
// //   };

// //   CUSTOMERS.push(newCustomer);

// //   return Response.json({
// //     success: true,
// //     customer: newCustomer
// //   });
// // }
// import { CUSTOMERS } from "../storage";

// /* ✅ Handle preflight */
// export async function OPTIONS() {
//   return new Response(null, {
//     status: 200,
//     headers: corsHeaders,
//   });
// }

// const corsHeaders = {
//   "Access-Control-Allow-Origin": "https://mineral-jal.vercel.app",
//   "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
//   "Access-Control-Allow-Headers": "Content-Type",
// };

// export async function GET() {
//   return new Response(JSON.stringify(CUSTOMERS), {
//     headers: corsHeaders,
//   });
// }

// export async function POST(req: Request) {
//   const body = await req.json();

//   const newCustomer = {
//     id: Date.now(),
//     name: body.name,
//     phone: body.phone,
//     address: body.address,
//     reference: body.reference,
//     services: [],
//   };

//   CUSTOMERS.push(newCustomer);

//   return new Response(
//     JSON.stringify({
//       success: true,
//       customer: newCustomer,
//     }),
//     {
//       headers: corsHeaders,
//     }
//   );
// }
import { CUSTOMERS } from "../storage";

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

  return new Response(JSON.stringify(CUSTOMERS), {
    headers: getCorsHeaders(origin),
  });
}

export async function POST(req: Request) {
  const origin = req.headers.get("origin");
  const body = await req.json();

  const phone = String(body.phone).trim();

  const existingCustomer = CUSTOMERS.find(
    (c) => c.phone === phone
  );

  if (existingCustomer) {
    return new Response(
      JSON.stringify({
        success: true,
        customer: existingCustomer,
        message: "Customer already exists",
      }),
      {
        headers: getCorsHeaders(origin),
      }
    );
  }

  const newCustomer = {
    id: Date.now(),
    name: body.name,
    phone,
    address: body.address,
    reference: body.reference,
    services: [],
  };

  CUSTOMERS.push(newCustomer);

  return new Response(
    JSON.stringify({
      success: true,
      customer: newCustomer,
    }),
    {
      headers: getCorsHeaders(origin),
    }
  );
}