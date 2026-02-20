let SERVICES: any[] = [];

export async function GET() {
  return Response.json(SERVICES);
}

export async function POST(req: Request) {
  const body = await req.json();

  const newService = {
    id: Date.now(),

    invoiceNumber: body.invoiceNumber,
    date: body.date,

    customer: body.customer,
    parts: body.parts,

    serviceCharge: body.serviceCharge,
    discountPercent: body.discountPercent,
    discountAmount: body.discountAmount,
    totalAmount: body.totalAmount,

    startAmc: body.startAmc,
  };

  SERVICES.push(newService);

  return Response.json({
    success: true,
    service: newService
  });
}