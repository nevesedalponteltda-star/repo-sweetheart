
export enum InvoiceStatus {
  DRAFT = 'Rascunho',
  SENT = 'Enviada',
  PAID = 'Paga',
  OVERDUE = 'Atrasada'
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  total: number;
}

export interface CompanyInfo {
  name: string;
  email: string;
  address: string;
  phone: string;
  logoUrl?: string;
  taxId?: string;
  web?: string;
}

export interface ClientInfo {
  name: string;
  email: string;
  address: string;
  phone: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  date: string;
  dueDate: string;
  status: InvoiceStatus;
  company: CompanyInfo;
  client: ClientInfo;
  items: InvoiceItem[];
  subtotal: number;
  taxRate: number;
  taxTotal: number;
  discount: number;
  total: number;
  notes: string;
  terms: string;
  currency: string;
}
