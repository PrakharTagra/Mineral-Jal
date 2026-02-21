import { CUSTOMERS } from "../storage";

export async function GET() {
  return Response.json(CUSTOMERS);
}

export async function POST(req: Request) {
  const body = await req.json();

  const newCustomer = {
    id: Date.now(),
    name: body.name,
    phone: body.phone,
    address: body.address,
    reference: body.reference,
    services: []  // important
  };

  CUSTOMERS.push(newCustomer);

  return Response.json({
    success: true,
    customer: newCustomer
  });
}