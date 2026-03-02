// // import { RO_INSTALLS, CUSTOMERS } from "../storage";

// // const allowedOrigins = [
// //   "http://localhost:5173",
// //   "https://mineral-jal.vercel.app",
// // ];

// // function getCorsHeaders(origin: string | null) {
// //   return {
// //     "Access-Control-Allow-Origin":
// //       origin && allowedOrigins.includes(origin)
// //         ? origin
// //         : allowedOrigins[1],
// //     "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
// //     "Access-Control-Allow-Headers": "Content-Type",
// //   };
// // }

// // export async function OPTIONS(req: Request) {
// //   return new Response(null, {
// //     status: 200,
// //     headers: getCorsHeaders(req.headers.get("origin")),
// //   });
// // }

// // export async function GET(req: Request) {
// //   const origin = req.headers.get("origin");
// //   const { searchParams } = new URL(req.url);
// //   const id = searchParams.get("id");

// //   const roWithCustomer = RO_INSTALLS.map((ro) => {
// //     const customer = CUSTOMERS.find(
// //       (c) => c.id === ro.customerId
// //     );

// //     return {
// //       ...ro,
// //       customer: customer
// //       ? {
// //           id: customer.id,
// //           name: customer.name,
// //           phone: customer.phone,
// //           address: customer.address,
// //         }
// //       : null
// //     };
// //   });

// //   if (!id) {
// //     return new Response(JSON.stringify(roWithCustomer), {
// //       headers: getCorsHeaders(origin),
// //     });
// //   }

// //   const single = roWithCustomer.find(
// //     (r) => r.id === Number(id)
// //   );

// //   return new Response(JSON.stringify(single ?? null), {
// //     headers: getCorsHeaders(origin),
// //   });
// // }

// // export async function POST(req: Request) {
// //   const origin = req.headers.get("origin");
// //   const body = await req.json();

// //   const {
// //     invoiceNumber,
// //     customerId,
// //     model,
// //     installDate,
// //     note,
// //     components,
// //     installationCost,
// //     discountPercent,
// //     discountAmount,
// //     totalAmount,
// //     startAmc,
// //   } = body;

// //   if (!customerId) {
// //     return new Response(
// //       JSON.stringify({
// //         success: false,
// //         message: "Customer is required",
// //       }),
// //       {
// //         status: 400,
// //         headers: getCorsHeaders(origin),
// //       }
// //     );
// //   }

// //   const customer = CUSTOMERS.find(
// //     (c) => c.id === Number(customerId)
// //   );

// //   if (!customer) {
// //     return new Response(
// //       JSON.stringify({
// //         success: false,
// //         message: "Customer not found",
// //       }),
// //       {
// //         status: 404,
// //         headers: getCorsHeaders(origin),
// //       }
// //     );
// //   }

// //   const newROId = Date.now();

// //   const newRO = {
// //     id: newROId,
// //     invoiceNumber,
// //     customerId: Number(customerId),
// //     model,
// //     installDate,
// //     note,
// //     components,
// //     installationCost,
// //     discountPercent,
// //     discountAmount,
// //     totalAmount,
// //     startAmc,
// //     createdAt: new Date().toISOString(),
// //   };

// //   RO_INSTALLS.push(newRO);

// //   // ✅ Correct linking
// //   if (!customer.roInstalls) {
// //     customer.roInstalls = [];
// //   }

// //   customer.roInstalls.push(newROId);

// //   return new Response(
// //     JSON.stringify({
// //       success: true,
// //       ro: newRO,
// //     }),
// //     {
// //       status: 201,
// //       headers: getCorsHeaders(origin),
// //     }
// //   );
// // }
// import { RO_INSTALLS, CUSTOMERS } from "../storage";

// const allowedOrigins = [
//   "http://localhost:5173",
//   "https://mineral-jal.vercel.app",
// ];

// function getCorsHeaders(origin: string | null) {
//   return {
//     "Access-Control-Allow-Origin":
//       origin && allowedOrigins.includes(origin)
//         ? origin
//         : allowedOrigins[1],
//     "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
//     "Access-Control-Allow-Headers": "Content-Type",
//     "Content-Type": "application/json",
//   };
// }

// /* ===========================
//    OPTIONS
// =========================== */
// export async function OPTIONS(req: Request) {
//   return new Response(null, {
//     status: 200,
//     headers: getCorsHeaders(req.headers.get("origin")),
//   });
// }

// /* ===========================
//    GET
//    /api/ro
//    /api/ro?id=123
//    /api/ro?invoiceNumber=MJ-R-...
// =========================== */
// export async function GET(req: Request) {
//   const origin = req.headers.get("origin");
//   const { searchParams } = new URL(req.url);

//   const id = searchParams.get("id");
//   const invoiceNumber = searchParams.get("invoiceNumber");

//   const roWithCustomer = RO_INSTALLS.map((ro) => {
//     const customer = CUSTOMERS.find(
//       (c) => c.id === ro.customerId
//     );

//     return {
//       ...ro,
//       customer: customer
//         ? {
//             id: customer.id,
//             name: customer.name,
//             phone: customer.phone,
//             address: customer.address,
//           }
//         : null,
//     };
//   });

//   // 🔥 Fetch by invoiceNumber
//   if (invoiceNumber) {
//     const single = roWithCustomer.find(
//       (r) => r.invoiceNumber === invoiceNumber
//     );

//     return new Response(JSON.stringify(single ?? null), {
//       status: 200,
//       headers: getCorsHeaders(origin),
//     });
//   }

//   // 🔥 Fetch by id
//   if (id) {
//     const single = roWithCustomer.find(
//       (r) => r.id === Number(id)
//     );

//     return new Response(JSON.stringify(single ?? null), {
//       status: 200,
//       headers: getCorsHeaders(origin),
//     });
//   }

//   // 🔥 Return all
//   return new Response(JSON.stringify(roWithCustomer), {
//     status: 200,
//     headers: getCorsHeaders(origin),
//   });
// }

// /* ===========================
//    POST
// =========================== */
// export async function POST(req: Request) {
//   const origin = req.headers.get("origin");
//   const body = await req.json();

//   const {
//     invoiceNumber,
//     customerId,
//     model,
//     installDate,
//     note,
//     components,
//     installationCost,
//     discountPercent,
//     discountAmount,
//     totalAmount,
//     startAmc,
//   } = body;

//   if (!customerId) {
//     return new Response(
//       JSON.stringify({
//         success: false,
//         message: "Customer is required",
//       }),
//       {
//         status: 400,
//         headers: getCorsHeaders(origin),
//       }
//     );
//   }

//   const customer = CUSTOMERS.find(
//     (c) => c.id === Number(customerId)
//   );

//   if (!customer) {
//     return new Response(
//       JSON.stringify({
//         success: false,
//         message: "Customer not found",
//       }),
//       {
//         status: 404,
//         headers: getCorsHeaders(origin),
//       }
//     );
//   }

//   const newROId = Date.now();

//   const newRO = {
//     id: newROId,
//     invoiceNumber,
//     customerId: Number(customerId),
//     model,
//     installDate,
//     note,
//     components: components || [],
//     installationCost: Number(installationCost || 0),
//     discountPercent: Number(discountPercent || 0),
//     discountAmount: Number(discountAmount || 0),
//     totalAmount: Number(totalAmount || 0),
//     startAmc: Boolean(startAmc),
//     createdAt: new Date().toISOString(),
//   };

//   RO_INSTALLS.push(newRO);

//   // Link to customer
//   if (!customer.roInstalls) {
//     customer.roInstalls = [];
//   }

//   customer.roInstalls.push(newROId);

//   return new Response(
//     JSON.stringify({
//       success: true,
//       ro: newRO,
//     }),
//     {
//       status: 201,
//       headers: getCorsHeaders(origin),
//     }
//   );
// }
import { connectDB } from "@/lib/mongodb";
import RO from "@/models/RO";
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
   /api/ro
   /api/ro?id=...
   /api/ro?invoiceNumber=...
=========================== */
export async function GET(req: Request) {
  await connectDB();

  const origin = req.headers.get("origin");
  const { searchParams } = new URL(req.url);

  const id = searchParams.get("id");
  const invoiceNumber = searchParams.get("invoiceNumber");

  // 🔥 Fetch by invoiceNumber
  if (invoiceNumber) {
    const single = await RO.findOne({ invoiceNumber })
      .populate("customerId");

    return new Response(JSON.stringify(single), {
      status: 200,
      headers: getCorsHeaders(origin),
    });
  }

  // 🔥 Fetch by id
  if (id) {
    const single = await RO.findById(id)
      .populate("customerId");

    return new Response(JSON.stringify(single), {
      status: 200,
      headers: getCorsHeaders(origin),
    });
  }

  // 🔥 Fetch all
  const ros = await RO.find()
    .populate("customerId")
    .sort({ createdAt: -1 });

  return new Response(JSON.stringify(ros), {
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

  const newRO = await RO.create({
    invoiceNumber,
    customerId,
    model,
    installDate,
    note,
    components: components || [],
    installationCost: Number(installationCost || 0),
    discountPercent: Number(discountPercent || 0),
    discountAmount: Number(discountAmount || 0),
    totalAmount: Number(totalAmount || 0),
    startAmc: Boolean(startAmc),
  });

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