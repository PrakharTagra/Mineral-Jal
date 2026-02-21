// import { CUSTOMERS } from "../storage";

// export async function GET() {
//   return Response.json(CUSTOMERS);
// }

// export async function POST(req: Request) {
//   const body = await req.json();

//   const newCustomer = {
//     id: Date.now(),
//     name: body.name,
//     phone: body.phone,
//     address: body.address,
//     reference: body.reference,
//     services: []  // important
//   };

//   CUSTOMERS.push(newCustomer);

//   return Response.json({
//     success: true,
//     customer: newCustomer
//   });
// }
import { CUSTOMERS } from "../storage";

/* ✅ Handle preflight */
export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: corsHeaders,
  });
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "https://mineral-jal.vercel.app",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function GET() {
  return new Response(JSON.stringify(CUSTOMERS), {
    headers: corsHeaders,
  });
}

export async function POST(req: Request) {
  const body = await req.json();

  const newCustomer = {
    id: Date.now(),
    name: body.name,
    phone: body.phone,
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
      headers: corsHeaders,
    }
  );
}