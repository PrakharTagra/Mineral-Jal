let CUSTOMERS: any[] = [];

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("search") || "";

  const filtered = CUSTOMERS.filter((c) =>
    c.name.toLowerCase().includes(query.toLowerCase()) ||
    c.phone.includes(query)
  );

  return Response.json(filtered);
}

export async function POST(req: Request) {
  const body = await req.json();

  const newCustomer = {
    id: Date.now(),
    name: body.name,
    phone: body.phone,
    address: body.address,
    reference: body.reference,
  };

  CUSTOMERS.push(newCustomer);
  return Response.json(newCustomer);
}