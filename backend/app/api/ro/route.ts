let RO_INSTALLS: any[] = [];
let CUSTOMERS: any[] = [];

export async function GET() {
  return Response.json(RO_INSTALLS);
}

export async function POST(req: Request) {
  const body = await req.json();

  let customerData = body.customer;

  // NEW CUSTOMER SAVE
  if (body.isNewCustomer) {
    const newCustomer = {
      id: Date.now(),
      name: body.customer.name,
      phone: body.customer.phone,
      address: body.customer.address,
      reference: body.customer.reference,
    };

    CUSTOMERS.push(newCustomer);
    customerData = newCustomer;
  }

  const newRO = {
    id: Date.now(),
    customer: customerData,

    model: body.model,
    installDate: body.installDate,
    note: body.note,

    components: body.components,

    installationCost: body.installationCost,
    discountPercent: body.discountPercent,
    discountAmount: body.discountAmount,
    totalAmount: body.totalAmount,

    startAmc: body.startAmc,
    createdAt: new Date().toISOString(),
  };

  RO_INSTALLS.push(newRO);

  return Response.json({
    success: true,
    ro: newRO
  });
}