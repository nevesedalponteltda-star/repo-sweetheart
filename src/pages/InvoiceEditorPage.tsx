import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/src/integrations/supabase/client';
import { InvoiceStatus, Invoice, InvoiceItem, Client } from '@/src/types';
import html2pdf from 'html2pdf.js';
import { generateInvoiceHtml } from '@/src/utils/invoicePdfGenerator';

const AutoResizeTextarea: React.FC<{
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  className?: string;
  rows?: number;
  style?: React.CSSProperties;
}> = ({ value, onChange, placeholder, className, rows = 2, style }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      const newHeight = Math.max(textarea.scrollHeight, 48);
      textarea.style.height = `${newHeight}px`;
    }
  };

  useEffect(() => {
    adjustHeight();
  }, [value]);

  return (
    <textarea
      ref={textareaRef}
      rows={rows}
      className={`textarea-print-full ${className}`}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onInput={adjustHeight}
      style={{
        ...style,
        whiteSpace: 'pre-wrap',
        wordWrap: 'break-word',
        overflowWrap: 'break-word',
        resize: 'none',
        lineHeight: '1.4',
      }}
    />
  );
};

const styles = {
  container: {
    maxWidth: '960px',
    margin: '0 auto',
    padding: '0 1rem',
    paddingBottom: '6rem'
  },
  actionBar: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '0.75rem',
    backgroundColor: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: '1rem',
    padding: '0.75rem 1rem',
    position: 'sticky' as const,
    top: '80px',
    zIndex: 40,
    marginBottom: '1.5rem',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
  },
  backBtn: {
    color: '#4b5563',
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '0.875rem'
  },
  actionBtns: {
    display: 'flex',
    gap: '0.75rem',
    flexWrap: 'wrap' as const
  },
  btnSecondary: {
    backgroundColor: 'transparent',
    color: '#2563eb',
    padding: '0.5rem 1rem',
    borderRadius: '9999px',
    fontWeight: 700,
    border: '2px solid #2563eb',
    cursor: 'pointer',
    fontSize: '0.75rem'
  },
  btnPrimary: {
    backgroundColor: '#2563eb',
    color: '#ffffff',
    padding: '0.5rem 1rem',
    borderRadius: '9999px',
    fontWeight: 700,
    border: 'none',
    cursor: 'pointer',
    fontSize: '0.75rem',
    boxShadow: '0 4px 14px -4px rgba(37, 99, 235, 0.4)'
  },
  btnSuccess: {
    backgroundColor: '#16a34a',
    color: '#ffffff',
    padding: '0.5rem 1rem',
    borderRadius: '9999px',
    fontWeight: 700,
    border: 'none',
    cursor: 'pointer',
    fontSize: '0.75rem'
  },
  btnWarning: {
    backgroundColor: '#f59e0b',
    color: '#ffffff',
    padding: '0.5rem 1rem',
    borderRadius: '9999px',
    fontWeight: 700,
    border: 'none',
    cursor: 'pointer',
    fontSize: '0.75rem'
  },
  invoiceCard: {
    backgroundColor: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: '1rem',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    padding: '1.5rem',
    marginBottom: '2rem',
    overflow: 'hidden'
  },
  header: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '1rem',
    marginBottom: '1.5rem'
  },
  logoBox: {
    width: '100px',
    height: '100px',
    backgroundColor: '#f9fafb',
    border: '2px dashed #e5e7eb',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    position: 'relative' as const,
    borderRadius: '8px'
  },
  logoImg: {
    width: '100%',
    height: '100%',
    objectFit: 'contain' as const
  },
  invoiceTitle: {
    fontSize: '2.5rem',
    fontWeight: 900,
    color: '#111827',
    letterSpacing: '-0.05em',
    textTransform: 'uppercase' as const,
    marginBottom: '0.5rem',
    textAlign: 'right' as const
  },
  labelSmall: {
    fontSize: '0.625rem',
    fontWeight: 800,
    color: '#9ca3af',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.15em'
  },
  inputGhost: {
    width: '100%',
    padding: '0.25rem 0',
    backgroundColor: 'transparent',
    border: 'none',
    borderBottom: '1px dashed transparent',
    fontSize: '0.875rem',
    color: '#111827',
    outline: 'none'
  },
  inputLarge: {
    fontSize: '1.25rem',
    fontWeight: 800,
    textTransform: 'uppercase' as const,
    letterSpacing: '-0.025em'
  },
  divider: {
    borderTop: '2px solid #111827',
    margin: '1.5rem 0'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1.5rem',
    marginBottom: '1.5rem'
  },
  gridMobile: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1rem',
    marginBottom: '1.5rem'
  },
  mobileSection: {
    backgroundColor: '#f9fafb',
    borderRadius: '0.75rem',
    padding: '1rem',
    marginBottom: '0.75rem'
  },
  mobileSectionTitle: {
    fontSize: '0.625rem',
    fontWeight: 800,
    color: '#6b7280',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.1em',
    marginBottom: '0.75rem',
    paddingBottom: '0.5rem',
    borderBottom: '1px solid #e5e7eb'
  },
  mobileFieldGroup: {
    marginBottom: '0.75rem'
  },
  mobileFieldLabel: {
    fontSize: '0.625rem',
    fontWeight: 700,
    color: '#9ca3af',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
    marginBottom: '0.25rem',
    display: 'block'
  },
  mobileInput: {
    width: '100%',
    padding: '0.625rem 0.75rem',
    backgroundColor: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: '0.5rem',
    fontSize: '0.875rem',
    color: '#111827',
    outline: 'none',
    boxSizing: 'border-box' as const
  },
  mobileInputLarge: {
    fontSize: '1rem',
    fontWeight: 700,
    padding: '0.75rem'
  },
  mobileDateRow: {
    display: 'flex',
    gap: '0.75rem',
    marginBottom: '0.5rem'
  },
  mobileDateField: {
    flex: 1
  },
  mobileStatusBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '0.375rem 0.75rem',
    borderRadius: '9999px',
    fontSize: '0.75rem',
    fontWeight: 700
  },
  mobileItemCard: {
    backgroundColor: '#f9fafb',
    borderRadius: '0.75rem',
    padding: '1rem',
    marginBottom: '0.75rem',
    border: '1px solid #e5e7eb'
  },
  mobileItemHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '0.75rem'
  },
  mobileItemRow: {
    display: 'flex',
    gap: '0.5rem',
    marginBottom: '0.5rem'
  },
  mobileItemField: {
    flex: 1
  },
  mobileItemTotal: {
    fontSize: '1rem',
    fontWeight: 800,
    color: '#111827',
    textAlign: 'right' as const,
    marginTop: '0.5rem',
    paddingTop: '0.5rem',
    borderTop: '1px solid #e5e7eb'
  },
  section: {
    marginBottom: '1rem'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse' as const,
    marginBottom: '1.5rem'
  },
  th: {
    backgroundColor: '#1e293b',
    color: '#ffffff',
    padding: '0.75rem',
    fontSize: '0.625rem',
    fontWeight: 800,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.1em',
    textAlign: 'left' as const
  },
  td: {
    padding: '0.75rem',
    borderBottom: '1px solid #f3f4f6',
    verticalAlign: 'top' as const
  },
  totalsContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginBottom: '1.5rem'
  },
  totalsBox: {
    width: '250px'
  },
  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0.5rem 0',
    borderBottom: '1px solid #f3f4f6'
  },
  totalFinal: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0.75rem 0',
    borderTop: '3px double #111827',
    marginTop: '0.5rem'
  },
  totalLabel: {
    fontSize: '0.625rem',
    fontWeight: 800,
    color: '#9ca3af',
    textTransform: 'uppercase' as const
  },
  totalValue: {
    fontWeight: 800,
    color: '#111827'
  },
  totalFinalValue: {
    fontSize: '1.5rem',
    fontWeight: 900,
    color: '#111827'
  },
  notesSection: {
    marginTop: '1.5rem',
    paddingTop: '1rem',
    borderTop: '1px solid #e5e7eb'
  },
  addItemBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    color: '#2563eb',
    fontWeight: 800,
    fontSize: '0.75rem',
    textTransform: 'uppercase' as const,
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    marginTop: '1rem'
  },
  removeBtn: {
    color: '#ef4444',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '0.25rem'
  },
  settingsCard: {
    backgroundColor: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: '1rem',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    padding: '2rem'
  },
  settingsTitle: {
    fontSize: '1.25rem',
    fontWeight: 800,
    color: '#111827',
    marginBottom: '1.5rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem'
  },
  settingsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '1.5rem'
  },
  settingsGridMobile: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '1rem'
  },
  input: {
    width: '100%',
    padding: '0.5rem 0.75rem',
    backgroundColor: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: '6px',
    fontSize: '0.875rem',
    color: '#111827',
    outline: 'none',
    boxSizing: 'border-box' as const
  },
  select: {
    width: '100%',
    padding: '0.5rem 0.75rem',
    backgroundColor: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: '6px',
    fontSize: '0.875rem',
    color: '#111827',
    outline: 'none',
    boxSizing: 'border-box' as const
  },
  textarea: {
    width: '100%',
    padding: '0.5rem 0.75rem',
    backgroundColor: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: '6px',
    fontSize: '0.875rem',
    color: '#111827',
    outline: 'none',
    resize: 'vertical' as const,
    boxSizing: 'border-box' as const,
    minHeight: '80px'
  },
  loadingContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '5rem 0'
  },
  spinner: {
    width: '32px',
    height: '32px',
    border: '4px solid #e5e7eb',
    borderTopColor: '#2563eb',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  },
  clientDropdown: {
    position: 'absolute' as const,
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
    zIndex: 50,
    maxHeight: '200px',
    overflowY: 'auto' as const
  },
  clientOption: {
    padding: '0.75rem 1rem',
    cursor: 'pointer',
    borderBottom: '1px solid #f3f4f6',
    fontSize: '0.875rem'
  }
};

const InvoiceEditorPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(!!id);
  const [saving, setSaving] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [catalogItems, setCatalogItems] = useState<any[]>([]);
  const [showClientDropdown, setShowClientDropdown] = useState(false);
  const [showCatalogDropdown, setShowCatalogDropdown] = useState(false);
  const [clientSearch, setClientSearch] = useState('');
  const [catalogSearch, setCatalogSearch] = useState('');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  const [invoice, setInvoice] = useState<Invoice>({
    id: crypto.randomUUID(),
    invoiceNumber: `${Math.floor(Math.random() * 1000000000).toString().padStart(10, '0')}`,
    date: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: InvoiceStatus.DRAFT,
    company: { name: '', email: '', address: '', phone: '', web: '', logoUrl: '' },
    client: { name: '', email: '', address: '', phone: '' },
    items: [{ id: crypto.randomUUID(), description: '', quantity: 1, rate: 0, total: 0 }],
    subtotal: 0,
    taxRate: 0,
    taxTotal: 0,
    discount: 0,
    total: 0,
    notes: '',
    terms: '',
    currency: 'USD',
  });

  useEffect(() => {
    loadClients();
    loadCatalogItems();
    if (id) {
      loadInvoice(id);
    } else {
      loadProfileDefaults();
    }
  }, [id]);

  useEffect(() => {
    calculateTotals();
  }, [invoice.items, invoice.taxRate, invoice.discount]);

  const loadClients = async () => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      setClients(data || []);
    } catch (err) {
      console.error('Error loading clients:', err);
    }
  };

  const loadCatalogItems = async () => {
    try {
      const { data, error } = await supabase
        .from('catalog_items')
        .select('*')
        .eq('is_active', true)
        .order('name', { ascending: true });

      if (error) throw error;
      setCatalogItems(data || []);
    } catch (err) {
      console.error('Error loading catalog:', err);
    }
  };

  const loadProfileDefaults = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (profile) {
        setInvoice((prev) => ({
          ...prev,
          company: {
            name: profile.company_name || '',
            email: profile.company_email || '',
            address: profile.company_address || '',
            phone: profile.company_phone || '',
            web: profile.company_website || '',
            logoUrl: profile.company_logo_url || '',
          },
          currency: profile.default_currency || 'USD',
          taxRate: Number(profile.default_tax_rate) || 0,
          notes: profile.default_notes || '',
          terms: profile.default_terms || '',
        }));
      }

      const { data: lastInvoice } = await supabase
        .from('invoices')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (lastInvoice) {
        setInvoice((prev) => ({
          ...prev,
          company: {
            name: lastInvoice.company_name || prev.company.name,
            email: lastInvoice.company_email || prev.company.email,
            address: lastInvoice.company_address || prev.company.address,
            phone: lastInvoice.company_phone || prev.company.phone,
            web: lastInvoice.company_website || prev.company.web,
            logoUrl: lastInvoice.company_logo_url || prev.company.logoUrl,
          },
        }));
      }
    } catch (err) {
      console.error('Error loading defaults:', err);
    }
  };

  const loadInvoice = async (invoiceId: string) => {
    try {
      const { data: inv, error } = await supabase
        .from('invoices')
        .select('*')
        .eq('id', invoiceId)
        .single();

      if (error) throw error;

      const { data: items } = await supabase
        .from('invoice_items')
        .select('*')
        .eq('invoice_id', invoiceId)
        .order('sort_order', { ascending: true });

      setInvoice({
        id: inv.id,
        invoiceNumber: inv.invoice_number,
        date: inv.date,
        dueDate: inv.due_date,
        status: inv.status as InvoiceStatus,
        company: {
          name: inv.company_name || '',
          email: inv.company_email || '',
          address: inv.company_address || '',
          phone: inv.company_phone || '',
          web: inv.company_website || '',
          logoUrl: inv.company_logo_url || '',
        },
        client: {
          name: inv.client_name || '',
          email: inv.client_email || '',
          address: inv.client_address || '',
          phone: inv.client_phone || '',
        },
        items: items?.map((item) => ({
          id: item.id,
          description: item.description,
          quantity: Number(item.quantity),
          rate: Number(item.rate),
          total: Number(item.total),
        })) || [{ id: crypto.randomUUID(), description: '', quantity: 1, rate: 0, total: 0 }],
        subtotal: Number(inv.subtotal),
        taxRate: Number(inv.tax_rate) || 0,
        taxTotal: Number(inv.tax_total) || 0,
        discount: Number(inv.discount) || 0,
        total: Number(inv.total),
        notes: inv.notes || '',
        terms: inv.terms || '',
        currency: inv.currency || 'USD',
      });
    } catch (err) {
      console.error('Error loading invoice:', err);
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const calculateTotals = () => {
    const subtotal = invoice.items.reduce((acc, item) => acc + item.quantity * item.rate, 0);
    const taxTotal = subtotal * (invoice.taxRate / 100);
    const total = subtotal + taxTotal - invoice.discount;
    setInvoice((prev) => ({ ...prev, subtotal, taxTotal, total }));
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const handleAddItem = () => {
    setInvoice({
      ...invoice,
      items: [...invoice.items, { id: crypto.randomUUID(), description: '', quantity: 1, rate: 0, total: 0 }],
    });
  };

  const handleRemoveItem = (itemId: string) => {
    if (invoice.items.length === 1) return;
    setInvoice({ ...invoice, items: invoice.items.filter((i) => i.id !== itemId) });
  };

  const handleItemChange = (itemId: string, field: keyof InvoiceItem, value: any) => {
    const updatedItems = invoice.items.map((item) => {
      if (item.id === itemId) {
        const updatedItem = { ...item, [field]: value };
        updatedItem.total = updatedItem.quantity * updatedItem.rate;
        return updatedItem;
      }
      return item;
    });
    setInvoice({ ...invoice, items: updatedItems });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setInvoice({
          ...invoice,
          company: { ...invoice.company, logoUrl: reader.result as string },
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectClient = (client: Client) => {
    setInvoice({
      ...invoice,
      client: {
        id: client.id,
        name: client.name,
        email: client.email || '',
        address: client.address || '',
        phone: client.phone || '',
      },
    });
    setShowClientDropdown(false);
    setClientSearch('');
  };

  const handleSelectCatalogItem = (catalogItem: any) => {
    const newItem = {
      id: crypto.randomUUID(),
      description: catalogItem.description 
        ? `${catalogItem.name}\n${catalogItem.description}` 
        : catalogItem.name,
      quantity: 1,
      rate: catalogItem.rate,
      total: catalogItem.rate,
    };
    setInvoice({
      ...invoice,
      items: [...invoice.items, newItem],
    });
    setShowCatalogDropdown(false);
    setCatalogSearch('');
  };

  const handleStatusChange = async (newStatus: InvoiceStatus) => {
    setInvoice({ ...invoice, status: newStatus });
    
    if (id) {
      try {
        await supabase
          .from('invoices')
          .update({ status: newStatus })
          .eq('id', id);
      } catch (err) {
        console.error('Error updating status:', err);
      }
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const invoiceData = {
        user_id: user.id,
        invoice_number: invoice.invoiceNumber,
        date: invoice.date,
        due_date: invoice.dueDate,
        status: invoice.status,
        company_name: invoice.company.name || null,
        company_email: invoice.company.email || null,
        company_phone: invoice.company.phone || null,
        company_address: invoice.company.address || null,
        company_website: invoice.company.web || null,
        company_logo_url: invoice.company.logoUrl || null,
        client_id: invoice.client.id || null,
        client_name: invoice.client.name || null,
        client_email: invoice.client.email || null,
        client_phone: invoice.client.phone || null,
        client_address: invoice.client.address || null,
        subtotal: invoice.subtotal,
        tax_rate: invoice.taxRate,
        tax_total: invoice.taxTotal,
        discount: invoice.discount,
        total: invoice.total,
        currency: invoice.currency,
        notes: invoice.notes || null,
        terms: invoice.terms || null,
      };

      let invoiceId = invoice.id;

      if (id) {
        const { error } = await supabase
          .from('invoices')
          .update(invoiceData)
          .eq('id', id);
        if (error) throw error;
        invoiceId = id;

        await supabase.from('invoice_items').delete().eq('invoice_id', id);
      } else {
        const { data, error } = await supabase
          .from('invoices')
          .insert({ ...invoiceData, id: invoice.id })
          .select()
          .single();
        if (error) throw error;
        invoiceId = data.id;
      }

      const itemsData = invoice.items.map((item, index) => ({
        invoice_id: invoiceId,
        description: item.description,
        quantity: item.quantity,
        rate: item.rate,
        total: item.total,
        sort_order: index,
      }));

      const { error: itemsError } = await supabase.from('invoice_items').insert(itemsData);
      if (itemsError) throw itemsError;

      navigate('/');
    } catch (err) {
      console.error('Error saving invoice:', err);
    } finally {
      setSaving(false);
    }
  };

  const [generatingPdf, setGeneratingPdf] = useState(false);

  const generatePdfBlob = async (): Promise<Blob | null> => {
    // Create a temporary container with the invoice HTML
    const tempContainer = document.createElement('div');
    tempContainer.id = 'pdf-render-container';
    // Make it visible for html2canvas to capture properly
    tempContainer.style.position = 'absolute';
    tempContainer.style.left = '0';
    tempContainer.style.top = '0';
    tempContainer.style.width = '794px'; // A4 width at 96dpi
    tempContainer.style.backgroundColor = 'white';
    tempContainer.style.zIndex = '9999';
    tempContainer.style.padding = '0';
    tempContainer.style.margin = '0';
    
    const htmlContent = generateInvoiceHtml(invoice);
    tempContainer.innerHTML = htmlContent;
    document.body.appendChild(tempContainer);
    
    // Wait for DOM to fully render
    await new Promise(resolve => setTimeout(resolve, 200));

    const opt = {
      margin: 0,
      filename: `Fatura_${invoice.invoiceNumber}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2, 
        useCORS: true,
        letterRendering: true,
        logging: false,
        backgroundColor: '#ffffff',
        width: 794,
        windowWidth: 794
      },
      jsPDF: { 
        unit: 'mm', 
        format: 'a4', 
        orientation: 'portrait' 
      },
      pagebreak: { mode: 'avoid-all' }
    };

    try {
      const pdfBlob = await html2pdf().set(opt).from(tempContainer).outputPdf('blob');
      document.body.removeChild(tempContainer);
      return pdfBlob;
    } catch (err) {
      console.error('Error generating PDF:', err);
      if (document.getElementById('pdf-render-container')) {
        document.body.removeChild(tempContainer);
      }
      return null;
    }
  };

  const handleDownloadPdf = async () => {
    setGeneratingPdf(true);
    try {
      const pdfBlob = await generatePdfBlob();
      if (pdfBlob) {
        const url = URL.createObjectURL(pdfBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Fatura_${invoice.invoiceNumber}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    } finally {
      setGeneratingPdf(false);
    }
  };

  const handleSharePdf = async () => {
    setGeneratingPdf(true);
    try {
      const pdfBlob = await generatePdfBlob();
      if (!pdfBlob) {
        setGeneratingPdf(false);
        return;
      }

      const file = new File([pdfBlob], `Fatura_${invoice.invoiceNumber}.pdf`, { 
        type: 'application/pdf' 
      });

      // Check if Web Share API is available and supports files
      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            title: `Fatura ${invoice.invoiceNumber}`,
            text: `Fatura nº ${invoice.invoiceNumber} - ${invoice.currency} ${formatCurrency(invoice.total)}`,
            files: [file]
          });
        } catch (shareErr) {
          // User cancelled or share failed - fallback to download
          if ((shareErr as Error).name !== 'AbortError') {
            handleDownloadPdf();
          }
        }
      } else {
        // Fallback: Download the PDF if sharing is not supported
        const url = URL.createObjectURL(pdfBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Fatura_${invoice.invoiceNumber}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    } finally {
      setGeneratingPdf(false);
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  };

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(clientSearch.toLowerCase()) ||
    (c.email && c.email.toLowerCase().includes(clientSearch.toLowerCase()))
  );

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media print {
          .no-print { display: none !important; }
          html, body { 
            background: white !important; 
            margin: 0 !important; 
            padding: 0 !important;
            width: 210mm !important;
            height: 297mm !important;
            overflow: hidden !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          #root {
            padding: 0 !important;
            margin: 0 !important;
            width: 100% !important;
            overflow: hidden !important;
          }
          .invoice-print { 
            box-shadow: none !important; 
            border: none !important; 
            border-radius: 0 !important;
            padding: 8mm !important;
            margin: 0 !important;
            width: 125% !important;
            max-width: none !important;
            transform: scale(0.80);
            transform-origin: top left;
            font-size: 11px !important;
            min-height: auto !important;
            max-height: 297mm !important;
            overflow: hidden !important;
            page-break-inside: avoid !important;
          }
          .invoice-print * {
            line-height: 1.35 !important;
          }
          .invoice-print table {
            font-size: 10px !important;
          }
          .invoice-print h1 {
            font-size: 2rem !important;
          }
          .invoice-notes {
            font-size: 10px !important;
            margin-top: 0.75rem !important;
            padding-top: 0.75rem !important;
          }
          @page { 
            margin: 5mm !important; 
            size: A4; 
          }
        }
      `}</style>

      {/* Action Bar */}
      <div style={styles.actionBar} className="no-print">
        <button onClick={() => navigate('/')} style={styles.backBtn}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Voltar
        </button>
        <div style={styles.actionBtns}>
          {invoice.status === InvoiceStatus.DRAFT && (
            <button 
              onClick={() => handleStatusChange(InvoiceStatus.PAID)} 
              style={styles.btnSuccess}
            >
              ✓ Marcar como Paga
            </button>
          )}
          {invoice.status === InvoiceStatus.PAID && (
            <button 
              onClick={() => handleStatusChange(InvoiceStatus.DRAFT)} 
              style={styles.btnWarning}
            >
              ↺ Voltar para Rascunho
            </button>
          )}
          <button 
            onClick={handleDownloadPdf} 
            disabled={generatingPdf}
            style={styles.btnSecondary}
          >
            {generatingPdf ? '⏳ Gerando...' : '📥 Baixar PDF'}
          </button>
          <button 
            onClick={handleSharePdf} 
            disabled={generatingPdf}
            style={{ ...styles.btnSecondary, backgroundColor: '#f0fdf4', color: '#16a34a', borderColor: '#16a34a' }}
          >
            📤 Compartilhar
          </button>
          <button onClick={handleSave} disabled={saving} style={styles.btnPrimary}>
            {saving ? 'Salvando...' : 'Salvar Fatura'}
          </button>
        </div>
      </div>

      {/* Invoice Document - Optimized for single page PDF */}
      <div style={styles.invoiceCard} className="invoice-print">
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.logoBox}>
            {invoice.company.logoUrl ? (
              <img src={invoice.company.logoUrl} alt="Logo" style={styles.logoImg} />
            ) : (
              <span style={{ color: '#9ca3af', fontSize: '0.75rem' }} className="no-print">Logo</span>
            )}
            <input
              type="file"
              style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }}
              onChange={handleLogoUpload}
              accept="image/*"
              className="no-print"
            />
          </div>
          <div style={{ textAlign: 'right' }}>
            <h1 style={styles.invoiceTitle}>INVOICE</h1>
            <div style={{ marginBottom: '0.25rem' }}>
              <span style={styles.labelSmall}>Nº </span>
              <input
                style={{ ...styles.inputGhost, width: '140px', textAlign: 'right', fontWeight: 700 }}
                value={invoice.invoiceNumber}
                onChange={(e) => setInvoice({ ...invoice, invoiceNumber: e.target.value })}
              />
            </div>
          </div>
        </div>

        <div style={styles.divider}></div>

        {/* Info Grid - Mobile Layout */}
        {isMobile ? (
          <div style={styles.gridMobile}>
            {/* Mobile: Datas e Status */}
            <div style={styles.mobileSection}>
              <div style={styles.mobileSectionTitle}>📅 Datas & Status</div>
              <div style={styles.mobileDateRow}>
                <div style={styles.mobileDateField}>
                  <label style={styles.mobileFieldLabel}>Emissão</label>
                  <input
                    type="date"
                    style={styles.mobileInput}
                    value={invoice.date}
                    onChange={(e) => setInvoice({ ...invoice, date: e.target.value })}
                  />
                </div>
                <div style={styles.mobileDateField}>
                  <label style={styles.mobileFieldLabel}>Vencimento</label>
                  <input
                    type="date"
                    style={styles.mobileInput}
                    value={invoice.dueDate}
                    onChange={(e) => setInvoice({ ...invoice, dueDate: e.target.value })}
                  />
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={styles.mobileFieldLabel}>Status:</span>
                <span style={{ 
                  ...styles.mobileStatusBadge,
                  backgroundColor: invoice.status === InvoiceStatus.PAID ? '#dcfce7' : '#dbeafe',
                  color: invoice.status === InvoiceStatus.PAID ? '#16a34a' : '#2563eb'
                }}>
                  {invoice.status}
                </span>
              </div>
            </div>

            {/* Mobile: Empresa (DE) */}
            <div style={styles.mobileSection}>
              <div style={styles.mobileSectionTitle}>🏢 Sua Empresa (DE)</div>
              <div style={styles.mobileFieldGroup}>
                <label style={styles.mobileFieldLabel}>Nome da Empresa</label>
                <input
                  style={{ ...styles.mobileInput, ...styles.mobileInputLarge }}
                  placeholder="Nome da sua empresa"
                  value={invoice.company.name}
                  onChange={(e) => setInvoice({ ...invoice, company: { ...invoice.company, name: e.target.value } })}
                />
              </div>
              <div style={styles.mobileFieldGroup}>
                <label style={styles.mobileFieldLabel}>Endereço Completo</label>
                <textarea
                  style={{ ...styles.mobileInput, minHeight: '60px', resize: 'none' }}
                  placeholder="Rua, número, bairro, cidade - estado"
                  value={invoice.company.address}
                  onChange={(e) => setInvoice({ ...invoice, company: { ...invoice.company, address: e.target.value } })}
                  rows={2}
                />
              </div>
              <div style={styles.mobileFieldGroup}>
                <label style={styles.mobileFieldLabel}>Email</label>
                <input
                  type="email"
                  style={styles.mobileInput}
                  placeholder="contato@empresa.com"
                  value={invoice.company.email}
                  onChange={(e) => setInvoice({ ...invoice, company: { ...invoice.company, email: e.target.value } })}
                />
              </div>
              <div style={styles.mobileFieldGroup}>
                <label style={styles.mobileFieldLabel}>Telefone</label>
                <input
                  type="tel"
                  style={styles.mobileInput}
                  placeholder="(00) 00000-0000"
                  value={invoice.company.phone}
                  onChange={(e) => setInvoice({ ...invoice, company: { ...invoice.company, phone: e.target.value } })}
                />
              </div>
            </div>

            {/* Mobile: Cliente (PARA) */}
            <div style={styles.mobileSection}>
              <div style={styles.mobileSectionTitle}>👤 Cliente (PARA)</div>
              <div style={{ ...styles.mobileFieldGroup, position: 'relative' }}>
                <label style={styles.mobileFieldLabel}>Nome do Cliente</label>
                <input
                  style={{ ...styles.mobileInput, ...styles.mobileInputLarge }}
                  placeholder="Selecione ou digite o nome"
                  value={invoice.client.name}
                  onChange={(e) => {
                    setInvoice({ ...invoice, client: { ...invoice.client, name: e.target.value } });
                    setClientSearch(e.target.value);
                    setShowClientDropdown(true);
                  }}
                  onFocus={() => setShowClientDropdown(true)}
                  onBlur={() => setTimeout(() => setShowClientDropdown(false), 200)}
                />
                {showClientDropdown && filteredClients.length > 0 && (
                  <div style={{ ...styles.clientDropdown, top: '100%', marginTop: '4px' }} className="no-print">
                    {filteredClients.map(client => (
                      <div
                        key={client.id}
                        style={styles.clientOption}
                        onClick={() => handleSelectClient(client)}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f3f4f6')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                      >
                        <div style={{ fontWeight: 600 }}>{client.name}</div>
                        {client.email && <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{client.email}</div>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div style={styles.mobileFieldGroup}>
                <label style={styles.mobileFieldLabel}>Endereço do Cliente</label>
                <textarea
                  style={{ ...styles.mobileInput, minHeight: '60px', resize: 'none' }}
                  placeholder="Endereço completo do cliente"
                  value={invoice.client.address}
                  onChange={(e) => setInvoice({ ...invoice, client: { ...invoice.client, address: e.target.value } })}
                  rows={2}
                />
              </div>
              <div style={styles.mobileFieldGroup}>
                <label style={styles.mobileFieldLabel}>Email do Cliente</label>
                <input
                  type="email"
                  style={styles.mobileInput}
                  placeholder="cliente@email.com"
                  value={invoice.client.email}
                  onChange={(e) => setInvoice({ ...invoice, client: { ...invoice.client, email: e.target.value } })}
                />
              </div>
              <div style={styles.mobileFieldGroup}>
                <label style={styles.mobileFieldLabel}>Telefone do Cliente</label>
                <input
                  type="tel"
                  style={styles.mobileInput}
                  placeholder="(00) 00000-0000"
                  value={invoice.client.phone}
                  onChange={(e) => setInvoice({ ...invoice, client: { ...invoice.client, phone: e.target.value } })}
                />
              </div>
            </div>
          </div>
        ) : (
          /* Desktop Layout */
          <div style={styles.grid}>
            <div>
              <p style={{ ...styles.labelSmall, marginBottom: '0.5rem' }}>DE:</p>
              <input
                style={{ ...styles.inputGhost, ...styles.inputLarge, marginBottom: '0.25rem' }}
                placeholder="SUA EMPRESA"
                value={invoice.company.name}
                onChange={(e) => setInvoice({ ...invoice, company: { ...invoice.company, name: e.target.value } })}
              />
              <div className="invoice-address-cell">
                <textarea
                  className="screen-only-textarea"
                  style={{ 
                    ...styles.inputGhost, 
                    color: '#6b7280', 
                    fontSize: '0.75rem',
                    resize: 'none',
                    minHeight: '20px',
                    overflow: 'hidden',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word'
                  }}
                  placeholder="Endereço"
                  value={invoice.company.address}
                  onChange={(e) => setInvoice({ ...invoice, company: { ...invoice.company, address: e.target.value } })}
                  rows={1}
                  onInput={(e) => {
                    const target = e.target as HTMLTextAreaElement;
                    target.style.height = 'auto';
                    target.style.height = target.scrollHeight + 'px';
                  }}
                />
                <div className="print-only-description" style={{ color: '#6b7280', fontSize: '0.75rem', lineHeight: 1.4 }}>
                  {invoice.company.address}
                </div>
              </div>
              <div className="invoice-address-cell">
                <input
                  className="screen-only-textarea"
                  style={{ ...styles.inputGhost, color: '#6b7280', fontSize: '0.75rem' }}
                  placeholder="email@empresa.com | Telefone"
                  value={`${invoice.company.email}${invoice.company.phone ? ' | ' + invoice.company.phone : ''}`}
                  onChange={(e) => {
                    const parts = e.target.value.split(' | ');
                    setInvoice({ 
                      ...invoice, 
                      company: { 
                        ...invoice.company, 
                        email: parts[0] || '',
                        phone: parts[1] || ''
                      } 
                    });
                  }}
                />
                <div className="print-only-description" style={{ color: '#6b7280', fontSize: '0.75rem', lineHeight: 1.4 }}>
                  {invoice.company.email}{invoice.company.phone ? ' | ' + invoice.company.phone : ''}
                </div>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'flex-end' }}>
                <span style={styles.labelSmall}>Emissão: </span>
                <span style={{ fontWeight: 600, fontSize: '0.875rem' }} className="print-only-description">{formatDate(invoice.date)}</span>
                <input
                  type="date"
                  style={{ ...styles.inputGhost, width: '130px', textAlign: 'right' }}
                  value={invoice.date}
                  onChange={(e) => setInvoice({ ...invoice, date: e.target.value })}
                  className="no-print"
                />
              </div>
              <div style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'flex-end' }}>
                <span style={styles.labelSmall}>Vencimento: </span>
                <span style={{ fontWeight: 600, fontSize: '0.875rem' }} className="print-only-description">{formatDate(invoice.dueDate)}</span>
                <input
                  type="date"
                  style={{ ...styles.inputGhost, width: '130px', textAlign: 'right' }}
                  value={invoice.dueDate}
                  onChange={(e) => setInvoice({ ...invoice, dueDate: e.target.value })}
                  className="no-print"
                />
              </div>
              <div>
                <span style={styles.labelSmall}>Status: </span>
                <span style={{ 
                  fontWeight: 700, 
                  fontSize: '0.75rem',
                  color: invoice.status === InvoiceStatus.PAID ? '#16a34a' : '#2563eb'
                }}>
                  {invoice.status}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Client Section - Desktop only (mobile is handled above) */}
        {!isMobile && (
          <div style={{ ...styles.section, position: 'relative', marginBottom: '1.5rem' }}>
            <p style={{ ...styles.labelSmall, marginBottom: '0.5rem' }}>FATURAR PARA:</p>
            <div style={{ position: 'relative' }}>
              <input
                style={{ ...styles.inputGhost, ...styles.inputLarge, marginBottom: '0.25rem' }}
                placeholder="SELECIONE OU DIGITE O CLIENTE"
                value={invoice.client.name}
                onChange={(e) => {
                  setInvoice({ ...invoice, client: { ...invoice.client, name: e.target.value } });
                  setClientSearch(e.target.value);
                  setShowClientDropdown(true);
                }}
                onFocus={() => setShowClientDropdown(true)}
                onBlur={() => setTimeout(() => setShowClientDropdown(false), 200)}
              />
              {showClientDropdown && filteredClients.length > 0 && (
                <div style={styles.clientDropdown} className="no-print">
                  {filteredClients.map(client => (
                    <div
                      key={client.id}
                      style={styles.clientOption}
                      onClick={() => handleSelectClient(client)}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f3f4f6')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <div style={{ fontWeight: 600 }}>{client.name}</div>
                      {client.email && <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{client.email}</div>}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <input
              style={{ ...styles.inputGhost, color: '#6b7280', fontSize: '0.75rem' }}
              placeholder="Endereço do cliente"
              value={invoice.client.address}
              onChange={(e) => setInvoice({ ...invoice, client: { ...invoice.client, address: e.target.value } })}
            />
            <input
              style={{ ...styles.inputGhost, color: '#9ca3af', fontSize: '0.75rem' }}
              placeholder="email@cliente.com"
              value={invoice.client.email}
              onChange={(e) => setInvoice({ ...invoice, client: { ...invoice.client, email: e.target.value } })}
            />
          </div>
        )}

        {/* Items - Mobile Cards or Desktop Table */}
        {isMobile ? (
          /* Mobile: Item Cards */
          <div style={{ marginBottom: '1rem' }}>
            <div style={styles.mobileSectionTitle}>📦 Itens da Fatura</div>
            {invoice.items.map((item, index) => (
              <div key={item.id} style={styles.mobileItemCard}>
                <div style={styles.mobileItemHeader}>
                  <span style={{ fontSize: '0.625rem', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase' }}>
                    Item {index + 1}
                  </span>
                  <button onClick={() => handleRemoveItem(item.id)} style={{ ...styles.removeBtn, padding: '0.25rem 0.5rem' }}>
                    ✕ Remover
                  </button>
                </div>
                <div style={styles.mobileFieldGroup}>
                  <label style={styles.mobileFieldLabel}>Descrição</label>
                  <textarea
                    style={{ ...styles.mobileInput, minHeight: '60px', resize: 'none' }}
                    placeholder="Descrição do serviço ou produto..."
                    value={item.description}
                    onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                    rows={2}
                  />
                </div>
                <div style={styles.mobileItemRow}>
                  <div style={styles.mobileItemField}>
                    <label style={styles.mobileFieldLabel}>Quantidade</label>
                    <input
                      type="number"
                      style={{ ...styles.mobileInput, textAlign: 'center' }}
                      value={item.quantity}
                      onChange={(e) => handleItemChange(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div style={styles.mobileItemField}>
                    <label style={styles.mobileFieldLabel}>Preço Unit.</label>
                    <input
                      type="number"
                      style={{ ...styles.mobileInput, textAlign: 'right' }}
                      value={item.rate}
                      onChange={(e) => handleItemChange(item.id, 'rate', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                </div>
                <div style={styles.mobileItemTotal}>
                  Total: {invoice.currency} {formatCurrency(item.total)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Desktop: Table */
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={{ ...styles.th, width: '55%' }}>Descrição</th>
                <th style={{ ...styles.th, textAlign: 'center', width: '10%' }}>Qtd</th>
                <th style={{ ...styles.th, textAlign: 'right', width: '15%' }}>Preço</th>
                <th style={{ ...styles.th, textAlign: 'right', width: '15%' }}>Total</th>
                <th style={{ ...styles.th, width: '5%' }} className="no-print"></th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item) => (
                <tr key={item.id}>
                  <td style={{ ...styles.td, verticalAlign: 'top' }} className="invoice-description-cell">
                    {/* Print-only text - visible only in print */}
                    <div 
                      className="print-only-description"
                      style={{ 
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'normal',
                        fontSize: '0.875rem',
                        lineHeight: '1.5'
                      }}
                    >
                      {item.description || ''}
                    </div>
                    {/* Textarea for editing - hidden in print */}
                    <AutoResizeTextarea
                      value={item.description}
                      onChange={(val) => handleItemChange(item.id, 'description', val)}
                      placeholder="Descrição do serviço ou produto detalhado..."
                      className="input-ghost invoice-description screen-only-textarea"
                      style={{ width: '100%', minHeight: '48px', fontSize: '0.875rem' }}
                    />
                  </td>
                  <td style={{ ...styles.td, textAlign: 'center' }}>
                    <input
                      type="number"
                      style={{ ...styles.inputGhost, width: '50px', textAlign: 'center', fontWeight: 600 }}
                      value={item.quantity}
                      onChange={(e) => handleItemChange(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                    />
                  </td>
                  <td style={{ ...styles.td, textAlign: 'right' }}>
                    <input
                      type="number"
                      style={{ ...styles.inputGhost, width: '80px', textAlign: 'right', fontWeight: 600 }}
                      value={item.rate}
                      onChange={(e) => handleItemChange(item.id, 'rate', parseFloat(e.target.value) || 0)}
                    />
                  </td>
                  <td style={{ ...styles.td, textAlign: 'right', fontWeight: 700 }}>
                    {invoice.currency} {formatCurrency(item.total)}
                  </td>
                  <td style={styles.td} className="no-print">
                    <button onClick={() => handleRemoveItem(item.id)} style={styles.removeBtn}>
                      ✕
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <div style={{ 
          display: 'flex', 
          gap: isMobile ? '0.5rem' : '1rem', 
          alignItems: 'center', 
          flexWrap: 'wrap', 
          position: 'relative',
          flexDirection: isMobile ? 'column' : 'row'
        }} className="no-print">
          <button 
            onClick={handleAddItem} 
            style={{ 
              ...styles.addItemBtn,
              ...(isMobile ? { 
                width: '100%', 
                justifyContent: 'center',
                backgroundColor: '#eff6ff',
                padding: '0.75rem',
                borderRadius: '0.5rem'
              } : {})
            }}
          >
            <span style={{ 
              width: '20px', 
              height: '20px', 
              borderRadius: '50%', 
              backgroundColor: '#2563eb', 
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.875rem'
            }}>+</span>
            Adicionar Item
          </button>

          {catalogItems.length > 0 && (
            <div style={{ position: 'relative', width: isMobile ? '100%' : 'auto' }}>
              <button 
                onClick={() => setShowCatalogDropdown(!showCatalogDropdown)} 
                style={{ 
                  ...styles.addItemBtn, 
                  color: '#16a34a',
                  ...(isMobile ? { 
                    width: '100%', 
                    justifyContent: 'center',
                    backgroundColor: '#f0fdf4',
                    padding: '0.75rem',
                    borderRadius: '0.5rem'
                  } : {})
                }}
              >
                <span style={{ 
                  width: '20px', 
                  height: '20px', 
                  borderRadius: '50%', 
                  backgroundColor: '#16a34a', 
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.875rem'
                }}>📦</span>
                Do Catálogo
              </button>

              {showCatalogDropdown && (
                <div style={{
                  position: isMobile ? 'fixed' : 'absolute',
                  top: isMobile ? '50%' : '100%',
                  left: isMobile ? '50%' : 0,
                  transform: isMobile ? 'translate(-50%, -50%)' : 'none',
                  backgroundColor: '#ffffff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                  zIndex: 100,
                  width: isMobile ? '90vw' : '300px',
                  maxHeight: isMobile ? '70vh' : '300px',
                  overflowY: 'auto',
                  marginTop: isMobile ? 0 : '0.5rem'
                }}>
                  <input
                    type="text"
                    placeholder="🔍 Buscar no catálogo..."
                    value={catalogSearch}
                    onChange={(e) => setCatalogSearch(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: 'none',
                      borderBottom: '1px solid #e5e7eb',
                      fontSize: '0.875rem',
                      boxSizing: 'border-box'
                    }}
                  />
                  {catalogItems
                    .filter(item => 
                      item.name.toLowerCase().includes(catalogSearch.toLowerCase()) ||
                      (item.description && item.description.toLowerCase().includes(catalogSearch.toLowerCase()))
                    )
                    .map(item => (
                      <div
                        key={item.id}
                        onClick={() => handleSelectCatalogItem(item)}
                        style={{
                          padding: '0.75rem 1rem',
                          cursor: 'pointer',
                          borderBottom: '1px solid #f3f4f6',
                          transition: 'background 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <div style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.125rem' }}>
                          {item.name}
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#6b7280' }}>
                          <span>{item.category || 'Sem categoria'}</span>
                          <span style={{ fontWeight: 700, color: '#16a34a' }}>R$ {item.rate.toFixed(2)}</span>
                        </div>
                      </div>
                    ))
                  }
                  {catalogItems.filter(item => 
                    item.name.toLowerCase().includes(catalogSearch.toLowerCase())
                  ).length === 0 && (
                    <div style={{ padding: '1rem', textAlign: 'center', color: '#9ca3af', fontSize: '0.875rem' }}>
                      Nenhum item encontrado
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Totals - Compact */}
        <div style={styles.totalsContainer}>
          <div style={styles.totalsBox}>
            <div style={styles.totalRow}>
              <span style={styles.totalLabel}>Subtotal:</span>
              <span style={styles.totalValue}>{invoice.currency} {formatCurrency(invoice.subtotal)}</span>
            </div>
            {invoice.taxRate > 0 && (
              <div style={styles.totalRow}>
                <span style={styles.totalLabel}>Imposto ({invoice.taxRate}%):</span>
                <span style={styles.totalValue}>{invoice.currency} {formatCurrency(invoice.taxTotal)}</span>
              </div>
            )}
            {invoice.discount > 0 && (
              <div style={styles.totalRow}>
                <span style={styles.totalLabel}>Desconto:</span>
                <span style={{ ...styles.totalValue, color: '#dc2626' }}>-{invoice.currency} {formatCurrency(invoice.discount)}</span>
              </div>
            )}
            <div style={styles.totalFinal}>
              <span style={{ ...styles.totalLabel, fontSize: '0.75rem' }}>TOTAL:</span>
              <span style={styles.totalFinalValue}>{invoice.currency} {formatCurrency(invoice.total)}</span>
            </div>
          </div>
        </div>

        {/* Notes - Compact - Only show in print if there's content */}
        {(invoice.notes?.trim() || invoice.terms?.trim()) && (
          <div style={styles.notesSection} className="invoice-notes">
            {invoice.notes?.trim() && (
              <div style={{ marginBottom: '0.75rem' }}>
                <p style={{ ...styles.labelSmall, marginBottom: '0.25rem' }}>Observações:</p>
                <p style={{ fontSize: '0.75rem', color: '#4b5563', whiteSpace: 'pre-wrap' }}>{invoice.notes}</p>
              </div>
            )}
            {invoice.terms?.trim() && (
              <div>
                <p style={{ ...styles.labelSmall, marginBottom: '0.25rem' }}>Termos:</p>
                <p style={{ fontSize: '0.625rem', color: '#9ca3af', fontStyle: 'italic', whiteSpace: 'pre-wrap' }}>{invoice.terms}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Settings Panel */}
      <div style={styles.settingsCard} className="no-print">
        <h3 style={styles.settingsTitle}>
          <span style={{ 
            width: '32px', 
            height: '32px', 
            backgroundColor: '#eff6ff', 
            color: '#2563eb',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>⚙</span>
          Configurações
        </h3>
        <div style={isMobile ? styles.settingsGridMobile : styles.settingsGrid}>
          <div>
            <label style={{ ...styles.labelSmall, display: 'block', marginBottom: '0.5rem' }}>Imposto (%)</label>
            <input
              type="number"
              style={styles.input}
              value={invoice.taxRate}
              onChange={(e) => setInvoice({ ...invoice, taxRate: parseFloat(e.target.value) || 0 })}
            />
          </div>
          <div>
            <label style={{ ...styles.labelSmall, display: 'block', marginBottom: '0.5rem' }}>Desconto</label>
            <input
              type="number"
              style={styles.input}
              value={invoice.discount}
              onChange={(e) => setInvoice({ ...invoice, discount: parseFloat(e.target.value) || 0 })}
            />
          </div>
          <div>
            <label style={{ ...styles.labelSmall, display: 'block', marginBottom: '0.5rem' }}>Moeda</label>
            <input
              type="text"
              style={{ ...styles.input, textTransform: 'uppercase' }}
              value={invoice.currency}
              onChange={(e) => setInvoice({ ...invoice, currency: e.target.value.toUpperCase() })}
            />
          </div>
        </div>
        <div style={{ marginTop: '1.5rem' }}>
          <label style={{ ...styles.labelSmall, display: 'block', marginBottom: '0.5rem' }}>Notas</label>
          <textarea
            style={styles.textarea}
            placeholder="Chave PIX, dados bancários, etc."
            value={invoice.notes}
            onChange={(e) => setInvoice({ ...invoice, notes: e.target.value })}
          />
        </div>
        <div style={{ marginTop: '1rem' }}>
          <label style={{ ...styles.labelSmall, display: 'block', marginBottom: '0.5rem' }}>Termos</label>
          <textarea
            style={{ ...styles.textarea, fontStyle: 'italic', color: '#6b7280' }}
            placeholder="Condições de pagamento, multas, etc."
            value={invoice.terms}
            onChange={(e) => setInvoice({ ...invoice, terms: e.target.value })}
          />
        </div>
        <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={handleSave} disabled={saving} style={{ ...styles.btnPrimary, padding: '0.75rem 2rem' }}>
            {saving ? 'SALVANDO...' : 'FINALIZAR E SALVAR'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvoiceEditorPage;
