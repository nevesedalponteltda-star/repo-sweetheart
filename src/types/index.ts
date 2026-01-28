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
  id?: string;
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

export interface Profile {
  id: string;
  user_id: string;
  company_name: string | null;
  company_email: string | null;
  company_phone: string | null;
  company_address: string | null;
  company_website: string | null;
  company_logo_url: string | null;
  company_tax_id: string | null;
  default_currency: string;
  default_tax_rate: number;
  default_notes: string | null;
  default_terms: string | null;
}

export interface Client {
  id: string;
  user_id: string;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}
