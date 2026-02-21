if (!(globalThis as any).CUSTOMERS) {
  (globalThis as any).CUSTOMERS = [];
}

if (!(globalThis as any).SERVICES) {
  (globalThis as any).SERVICES = [];
}

export const CUSTOMERS = (globalThis as any).CUSTOMERS;
export const SERVICES = (globalThis as any).SERVICES;