/* ===========================
   INTERFACES
=========================== */

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
  startAmc?: boolean;
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

export interface Customer {
  id: number;
  name: string;
  phone: string;
  address: string;
  reference?: string;
  services: number[];     // store service IDs
  roInstalls: number[];   // store RO install IDs
  createdAt: string;
}

/* ===========================
   GLOBAL DECLARATION
=========================== */

declare global {
  // eslint-disable-next-line no-var
  var CUSTOMERS: Customer[] | undefined;

  // eslint-disable-next-line no-var
  var SERVICES: Service[] | undefined;

  // eslint-disable-next-line no-var
  var RO_INSTALLS: ROInstall[] | undefined;
}

/* ===========================
   INITIALIZATION
=========================== */

if (!globalThis.CUSTOMERS) {
  globalThis.CUSTOMERS = [];
}

if (!globalThis.SERVICES) {
  globalThis.SERVICES = [];
}

if (!globalThis.RO_INSTALLS) {
  globalThis.RO_INSTALLS = [];
}

/* ===========================
   EXPORTS
=========================== */

export const CUSTOMERS: Customer[] = globalThis.CUSTOMERS;
export const SERVICES: Service[] = globalThis.SERVICES;
export const RO_INSTALLS: ROInstall[] = globalThis.RO_INSTALLS;