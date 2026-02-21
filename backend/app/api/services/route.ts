import { CUSTOMERS, SERVICES } from "../storage";

export async function GET(req: Request) {
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
    return Response.json(servicesWithCustomer);
  }

  const single = servicesWithCustomer.find(
    (s) => s.invoiceNumber === invoiceNumber
  );

  return Response.json(single || null);
}

export async function POST(req: Request) {
  const body = await req.json();

  const newServiceId = Date.now();

  const newService = {
    id: newServiceId,
    invoiceNumber: body.invoiceNumber,
    type: body.type || "SERVICE",
    date: body.date,
    customerId: body.customerId,
    parts: body.parts,
    serviceCharge: body.serviceCharge,
    discountPercent: body.discountPercent,
    discountAmount: body.discountAmount,
    totalAmount: body.totalAmount,
    startAmc: body.startAmc,
  };

  SERVICES.push(newService);

  const customer = CUSTOMERS.find(
    (c) => c.id === body.customerId
  );

  if (customer) {
    customer.services.push(newServiceId);
  }

  return Response.json({
    success: true,
    service: newService,
  });
}