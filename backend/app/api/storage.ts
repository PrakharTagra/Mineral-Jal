export interface Service {
  id: number;
  invoiceNumber: string;
  type: string;
  date: string;
  customerId: number;
  parts: any[];
  serviceCharge: number;
  discountPercent: number;
  discountAmount: number;
  totalAmount: number;
  startAmc?: string;
}

export interface Customer {
  id: number;
  name: string;
  phone: string;
  address: string;
  services: number[];
}

export interface ROInstall {
  id: number;
  invoiceNumber: string;
  customerId: number;
  model: string;
  installDate: string;
  note?: string;
  components: any[];
  installationCost: number;
  discountPercent: number;
  discountAmount: number;
  totalAmount: number;
  startAmc?: boolean;
  createdAt: string;
}

/* 👇 Extend globalThis type */
declare global {
  var CUSTOMERS: Customer[] | undefined;
  var SERVICES: Service[] | undefined;
  var RO_INSTALLS: ROInstall[] | undefined;   // ✅ ADD THIS
}

/* 👇 Initialize if not exists */
if (!globalThis.CUSTOMERS) {
  globalThis.CUSTOMERS = [];
}

if (!globalThis.SERVICES) {
  globalThis.SERVICES = [];
}

if (!globalThis.RO_INSTALLS) {
  globalThis.RO_INSTALLS = [];   // ✅ ADD THIS
}

/* 👇 Export typed values */
export const CUSTOMERS: Customer[] = globalThis.CUSTOMERS;
export const SERVICES: Service[] = globalThis.SERVICES;
export const RO_INSTALLS: ROInstall[] = globalThis.RO_INSTALLS;   // ✅ ADD THIS