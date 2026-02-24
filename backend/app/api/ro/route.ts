// ─── Helpers ────────────────────────────────────────────────────────────────

function getFromStorage<T>(key: string, fallback: T): T {
  if (typeof localStorage === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage(key: string, value: unknown): void {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

const KEYS = {
  RO_INSTALLS: "ro_installs",
  CUSTOMERS: "customers",
};

// ─── Handlers ───────────────────────────────────────────────────────────────

export async function GET() {
  const roInstalls = getFromStorage<any[]>(KEYS.RO_INSTALLS, []);
  return Response.json(roInstalls);
}

export async function POST(req: Request) {
  const body = await req.json();

  const roInstalls = getFromStorage<any[]>(KEYS.RO_INSTALLS, []);
  const customers = getFromStorage<any[]>(KEYS.CUSTOMERS, []);

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

    customers.push(newCustomer);
    saveToStorage(KEYS.CUSTOMERS, customers);
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

  roInstalls.push(newRO);
  saveToStorage(KEYS.RO_INSTALLS, roInstalls);

  return Response.json({
    success: true,
    ro: newRO,
  });
}