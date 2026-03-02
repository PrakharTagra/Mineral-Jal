// import { CUSTOMERS } from "../storage";

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

//   return new Response(JSON.stringify(CUSTOMERS), {
//     headers: getCorsHeaders(origin),
//   });
// }

// export async function POST(req: Request) {
//   const origin = req.headers.get("origin");
//   const body = await req.json();

//   const phone = String(body.phone).trim();

//   const existingCustomer = CUSTOMERS.find(
//     (c) => c.phone === phone
//   );

//   if (existingCustomer) {
//     return new Response(
//       JSON.stringify({
//         success: true,
//         customer: existingCustomer,
//         message: "Customer already exists",
//       }),
//       {
//         headers: getCorsHeaders(origin),
//       }
//     );
//   }

//   const newCustomer = {
//     id: Date.now(),
//     name: body.name,
//     phone,
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
//       headers: getCorsHeaders(origin),
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

/* ✅ GET All OR By id OR By phone */
export async function GET(req: Request) {
  const origin = req.headers.get("origin");
  const { searchParams } = new URL(req.url);

  const id = searchParams.get("id");
  const phone = searchParams.get("phone");

  if (!id && !phone) {
    return new Response(JSON.stringify(CUSTOMERS), {
      headers: getCorsHeaders(origin),
    });
  }

  const customer = CUSTOMERS.find((c) => {
    if (id) return c.id === Number(id);
    if (phone) return c.phone === phone;
  });

  return new Response(JSON.stringify(customer || null), {
    headers: getCorsHeaders(origin),
  });
}

/* ✅ POST - Create Customer (No Duplicate Phone Allowed) */
export async function POST(req: Request) {
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
    createdAt: new Date().toISOString(),
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