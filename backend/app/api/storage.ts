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

/* 👇 Extend globalThis type */
declare global {
  var CUSTOMERS: Customer[] | undefined;
  var SERVICES: Service[] | undefined;
}

/* 👇 Initialize if not exists */
if (!globalThis.CUSTOMERS) {
  globalThis.CUSTOMERS = [];
}

if (!globalThis.SERVICES) {
  globalThis.SERVICES = [];
}

/* 👇 Export typed values */
export const CUSTOMERS: Customer[] = globalThis.CUSTOMERS;
export const SERVICES: Service[] = globalThis.SERVICES;