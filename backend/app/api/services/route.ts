// import { connectDB } from "@/lib/mongodb";
// import Service from "@/models/Service";
// import Customer from "@/models/Customer";
// import AMC from "@/models/AMC";

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

// export async function OPTIONS(req: Request) {
//   return new Response(null, {
//     status: 200,
//     headers: getCorsHeaders(req.headers.get("origin")),
//   });
// }

// export async function GET(req: Request) {
//   await connectDB();

//   const origin = req.headers.get("origin");
//   const { searchParams } = new URL(req.url);
//   const invoiceNumber = searchParams.get("invoiceNumber");

//   // 🔥 Fetch by invoiceNumber
//   if (invoiceNumber) {
//     const single = await Service.findOne({ invoiceNumber })
//       .populate("customerId");

//     return new Response(JSON.stringify(single), {
//       status: 200,
//       headers: getCorsHeaders(origin),
//     });
//   }

//   // 🔥 Fetch all services
//   const services = await Service.find()
//     .populate("customerId")
//     .sort({ createdAt: -1 });

//   return new Response(JSON.stringify(services), {
//     status: 200,
//     headers: getCorsHeaders(origin),
//   });
// }

// export async function POST(req: Request) {
//   await connectDB();

//   const origin = req.headers.get("origin");
//   const body = await req.json();

//   const { customerId } = body;

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

//   const customer = await Customer.findById(customerId);

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

//   const newService = await Service.create(body);

//   return new Response(
//     JSON.stringify({
//       success: true,
//       service: newService,
//     }),
//     {
//       status: 201,
//       headers: getCorsHeaders(origin),
//     }
//   );
// }
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
  const invoiceNumber = searchParams.get("invoiceNumber");

  if (invoiceNumber) {
    const single = await Service.findOne({ invoiceNumber })
      .populate("customerId");

    return new Response(JSON.stringify(single), {
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
    date,
    parts,
    serviceCharge,
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

  /* 🔹 Create Service */
  const newService = await Service.create({
    invoiceNumber,
    customerId,
    date,
    parts,
    serviceCharge,
    discountPercent,
    discountAmount,
    totalAmount,
    startAmc,
  });

  /* 🔥 Create AMC if selected */
  /* 🔥 Create AMC if selected */
if (startAmc) {
  const existingAMC = await AMC.findOne({
    customerId,
    status: "ACTIVE",
  });

  if (!existingAMC) {
    const start = new Date(date || new Date());

    const fourMonth = new Date(start);
    fourMonth.setMonth(start.getMonth() + 4);

    const eightMonth = new Date(start);
    eightMonth.setMonth(start.getMonth() + 8);

    const twelveMonth = new Date(start);
    twelveMonth.setMonth(start.getMonth() + 12);

    await AMC.create({
      customerId,
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
      service: newService,
    }),
    {
      status: 201,
      headers: getCorsHeaders(origin),
    }
  );
}