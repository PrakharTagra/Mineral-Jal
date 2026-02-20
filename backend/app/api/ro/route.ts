
let ros: any[] = [];

export async function GET() {
  return Response.json(ros);
}

export async function POST(req: Request) {
  const body = await req.json();

  const newRO = {
    id: Date.now(),
    name: body.name,
    location: body.location,
    price: body.price,
  };

  ros.push(newRO);

  return Response.json(newRO);
}