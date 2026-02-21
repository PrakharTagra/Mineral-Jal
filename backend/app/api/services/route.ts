// // import { CUSTOMERS, SERVICES } from "../storage";

// // export async function GET(req: Request) {
// //   const { searchParams } = new URL(req.url);
// //   const invoiceNumber = searchParams.get("invoiceNumber");

// //   const servicesWithCustomer = SERVICES.map((service) => {
// //     const customer = CUSTOMERS.find(
// //       (c) => c.id === service.customerId
// //     );

// //     return {
// //       ...service,
// //       customer: customer || null,
// //     };
// //   });

// //   if (!invoiceNumber) {
// //     return Response.json(servicesWithCustomer);
// //   }

// //   const single = servicesWithCustomer.find(
// //     (s) => s.invoiceNumber === invoiceNumber
// //   );

// //   return Response.json(single || null);
// // }

// // export async function POST(req: Request) {
// //   const body = await req.json();

// //   const newServiceId = Date.now();

// //   const newService = {
// //     id: newServiceId,
// //     invoiceNumber: body.invoiceNumber,
// //     type: body.type || "SERVICE",
// //     date: body.date,
// //     customerId: body.customerId,
// //     parts: body.parts,
// //     serviceCharge: body.serviceCharge,
// //     discountPercent: body.discountPercent,
// //     discountAmount: body.discountAmount,
// //     totalAmount: body.totalAmount,
// //     startAmc: body.startAmc,
// //   };

// //   SERVICES.push(newService);

// //   const customer = CUSTOMERS.find(
// //     (c) => c.id === body.customerId
// //   );

// //   if (customer) {
// //     customer.services.push(newServiceId);
// //   }

// //   return Response.json({
// //     success: true,
// //     service: newService,
// //   });
// // }
// import { SERVICES, CUSTOMERS } from "../storage";

// // const corsHeaders = {
// //   "Access-Control-Allow-Origin": "https://mineral-jal.vercel.app",
// //   "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
// //   "Access-Control-Allow-Headers": "Content-Type",
// // };
// const allowedOrigins = [
//   "http://localhost:5173",
//   "https://mineral-jal.vercel.app",
// ];

// function getCorsHeaders(origin: string | null) {
//   if (origin && allowedOrigins.includes(origin)) {
//     return {
//       "Access-Control-Allow-Origin": origin,
//       "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
//       "Access-Control-Allow-Headers": "Content-Type",
//     };
//   }

//   return {
//     "Access-Control-Allow-Origin": allowedOrigins[1], // fallback
//   };
// }

// /* ✅ Handle preflight */
// export async function OPTIONS() {
//   return new Response(null, {
//     status: 200,
//     headers: corsHeaders,
//   });
// }

// export async function GET(req: Request) {
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
//       headers: corsHeaders,
//     });
//   }

//   const single = servicesWithCustomer.find(
//     (s) => s.invoiceNumber === invoiceNumber
//   );

//   return new Response(JSON.stringify(single || null), {
//     headers: corsHeaders,
//   });
// }

// export async function POST(req: Request) {
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
//     { headers: corsHeaders }
//   );
// }
import { SERVICES, CUSTOMERS } from "../storage";

const allowedOrigins = [
  "http://localhost:5173",
  "https://mineral-jal.vercel.app",
];

function getCorsHeaders(origin: string | null) {
  if (origin && allowedOrigins.includes(origin)) {
    return {
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };
  }

  return {
    "Access-Control-Allow-Origin": allowedOrigins[1],
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