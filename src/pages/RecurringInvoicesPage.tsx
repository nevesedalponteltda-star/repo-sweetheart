import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/src/integrations/supabase/client';

interface RecurringInvoice {
  id: string;
  client_id: string | null;
  invoice_template: {
    client_name?: string;
    total?: number;
    currency?: string;
    items?: { description: string; quantity: number; rate: number; total: number }[];
  };
  frequency: string;
  start_date: string;
  end_date: string | null;
  next_invoice_date: string;
  is_active: boolean;
  invoices_generated: number;
  last_generated_at: string | null;
  created_at: string;
}

interface Client {
  id: string;
  name: string;
  email: string | null;
}

const frequencyLabels: Record<string, string> = {
  weekly: 'Semanal',
  biweekly: 'Quinzenal',
  monthly: 'Mensal',
  bimonthly: 'Bimestral',
  quarterly: 'Trimestral',
  semiannual: 'Semestral',
  annual: 'Anual'
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1.5rem'
  },
  header: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '1rem'
  },
  title: {
    fontSize: '1.875rem',
    fontWeight: 800,
    color: '#111827',
    letterSpacing: '-0.025em',
    margin: 0
  },
  subtitle: {
    color: '#6b7280',
    margin: '0.25rem 0 0 0',
    fontSize: '0.875rem'
  },
  btnPrimary: {
    backgroundColor: '#2563eb',
    color: '#ffffff',
    padding: '0.75rem 1.5rem',
    borderRadius: '9999px',
    fontWeight: 700,
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    boxShadow: '0 4px 14px -4px rgba(37, 99, 235, 0.4)',
    border: 'none',
    cursor: 'pointer',
    fontSize: '0.875rem'
  },
  card: {
    backgroundColor: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: '1rem',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    overflow: 'hidden'
  },
  emptyState: {
    padding: '4rem',
    textAlign: 'center' as const
  },
  emptyIcon: {
    width: '80px',
    height: '80px',
    backgroundColor: '#f3e8ff',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 1.5rem'
  },
  emptyTitle: {
    fontSize: '1.25rem',
    fontWeight: 700,
    color: '#111827',
    margin: 0
  },
  emptyText: {
    color: '#6b7280',
    marginTop: '0.5rem',
    maxWidth: '320px',
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  table: {
    width: '100%',
    textAlign: 'left' as const,
    borderCollapse: 'collapse' as const
  },
  th: {
    backgroundColor: '#f9fafb',
    color: '#9ca3af',
    fontSize: '0.625rem',
    fontWeight: 700,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.1em',
    padding: '1.25rem 1.5rem',
    borderBottom: '1px solid #e5e7eb'
  },
  td: {
    padding: '1rem 1.5rem',
    borderBottom: '1px solid #f3f4f6'
  },
  statusBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '0.25rem 0.75rem',
    borderRadius: '9999px',
    fontSize: '0.75rem',
    fontWeight: 700
  },
  statusActive: {
    backgroundColor: '#dcfce7',
    color: '#166534'
  },
  statusInactive: {
    backgroundColor: '#f3f4f6',
    color: '#374151'
  },
  frequencyBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '0.25rem 0.75rem',
    borderRadius: '9999px',
    fontSize: '0.75rem',
    fontWeight: 600,
    backgroundColor: '#dbeafe',
    color: '#1e40af'
  },
  actionBtn: {
    background: 'none',
    border: 'none',
    fontWeight: 700,
    fontSize: '0.75rem',
    cursor: 'pointer',
    padding: '0.25rem 0.5rem',
    borderRadius: '4px'
  },
  modal: {
    position: 'fixed' as const,
    inset: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
    padding: '1rem'
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: '1rem',
    maxWidth: '600px',
    width: '100%',
    maxHeight: '90vh',
    overflowY: 'auto' as const,
    boxShadow: '0 25px 50px rgba(0,0,0,0.25)'
  },
  modalHeader: {
    padding: '1.5rem',
    borderBottom: '1px solid #e5e7eb',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  modalTitle: {
    fontSize: '1.25rem',
    fontWeight: 700,
    margin: 0
  },
  modalBody: {
    padding: '1.5rem'
  },
  formGroup: {
    marginBottom: '1.25rem'
  },
  label: {
    display: 'block',
    fontSize: '0.75rem',
    fontWeight: 600,
    color: '#374151',
    marginBottom: '0.5rem'
  },
  input: {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #e5e7eb',
    borderRadius: '0.5rem',
    fontSize: '0.875rem',
    boxSizing: 'border-box' as const
  },
  select: {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #e5e7eb',
    borderRadius: '0.5rem',
    fontSize: '0.875rem',
    backgroundColor: '#ffffff',
    boxSizing: 'border-box' as const
  },
  formRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem'
  },
  modalFooter: {
    padding: '1.5rem',
    borderTop: '1px solid #e5e7eb',
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '0.75rem'
  },
  btnCancel: {
    padding: '0.75rem 1.5rem',
    borderRadius: '9999px',
    fontWeight: 700,
    border: '1px solid #e5e7eb',
    backgroundColor: '#ffffff',
    cursor: 'pointer',
    fontSize: '0.875rem'
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
  }
};

const formatCurrency = (value: number, currency: string = 'USD') => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: currency,
  }).format(value);
};

const RecurringInvoicesPage: React.FC = () => {
  const navigate = useNavigate();
  const [recurringInvoices, setRecurringInvoices] = useState<RecurringInvoice[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    client_id: '',
    client_name: '',
    description: '',
    amount: '',
    currency: 'USD',
    frequency: 'monthly',
    start_date: new Date().toISOString().split('T')[0],
    end_date: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [recurringRes, clientsRes] = await Promise.all([
        supabase
          .from('recurring_invoices')
          .select('*')
          .order('created_at', { ascending: false }),
        supabase
          .from('clients')
          .select('id, name, email')
          .order('name', { ascending: true })
      ]);

      if (recurringRes.error) throw recurringRes.error;
      if (clientsRes.error) throw clientsRes.error;

      setRecurringInvoices((recurringRes.data || []) as RecurringInvoice[]);
      setClients(clientsRes.data || []);
    } catch (err) {
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  const calculateNextInvoiceDate = (startDate: string, frequency: string): string => {
    const start = new Date(startDate);
    const today = new Date();
    
    if (start > today) return startDate;
    
    const intervals: Record<string, number> = {
      weekly: 7,
      biweekly: 14,
      monthly: 30,
      bimonthly: 60,
      quarterly: 90,
      semiannual: 180,
      annual: 365
    };
    
    const daysToAdd = intervals[frequency] || 30;
    const nextDate = new Date(today.getTime() + daysToAdd * 24 * 60 * 60 * 1000);
    return nextDate.toISOString().split('T')[0];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Não autenticado');

      const selectedClient = clients.find(c => c.id === formData.client_id);
      
      const invoiceTemplate = {
        client_name: selectedClient?.name || formData.client_name,
        client_email: selectedClient?.email || '',
        total: parseFloat(formData.amount) || 0,
        currency: formData.currency,
        items: [{
          description: formData.description || 'Serviço recorrente',
          quantity: 1,
          rate: parseFloat(formData.amount) || 0,
          total: parseFloat(formData.amount) || 0
        }]
      };

      const nextInvoiceDate = calculateNextInvoiceDate(formData.start_date, formData.frequency);

      const { error } = await supabase
        .from('recurring_invoices')
        .insert({
          user_id: user.id,
          client_id: formData.client_id || null,
          invoice_template: invoiceTemplate,
          frequency: formData.frequency,
          start_date: formData.start_date,
          end_date: formData.end_date || null,
          next_invoice_date: nextInvoiceDate,
          is_active: true
        });

      if (error) throw error;

      setShowModal(false);
      setFormData({
        client_id: '',
        client_name: '',
        description: '',
        amount: '',
        currency: 'USD',
        frequency: 'monthly',
        start_date: new Date().toISOString().split('T')[0],
        end_date: ''
      });
      loadData();
    } catch (err) {
      console.error('Error creating recurring invoice:', err);
      alert('Erro ao criar fatura recorrente');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (id: string, currentActive: boolean) => {
    try {
      const { error } = await supabase
        .from('recurring_invoices')
        .update({ is_active: !currentActive })
        .eq('id', id);

      if (error) throw error;
      loadData();
    } catch (err) {
      console.error('Error toggling status:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir esta fatura recorrente?')) return;

    try {
      const { error } = await supabase
        .from('recurring_invoices')
        .delete()
        .eq('id', id);

      if (error) throw error;
      loadData();
    } catch (err) {
      console.error('Error deleting:', err);
    }
  };

  const handleGenerateNow = async (recurring: RecurringInvoice) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Não autenticado');

      const template = recurring.invoice_template;
      const invoiceNumber = `REC-${Date.now().toString().slice(-6)}`;
      const today = new Date().toISOString().split('T')[0];
      const dueDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

      // Create the invoice
      const { data: invoiceData, error: invoiceError } = await supabase
        .from('invoices')
        .insert({
          user_id: user.id,
          client_id: recurring.client_id,
          invoice_number: invoiceNumber,
          date: today,
          due_date: dueDate,
          client_name: template.client_name || '',
          subtotal: template.total || 0,
          total: template.total || 0,
          currency: template.currency || 'USD',
          status: 'Rascunho'
        })
        .select()
        .single();

      if (invoiceError) throw invoiceError;

      // Create invoice items
      if (template.items && template.items.length > 0) {
        const items = template.items.map((item, index) => ({
          invoice_id: invoiceData.id,
          description: item.description,
          quantity: item.quantity,
          rate: item.rate,
          total: item.total,
          sort_order: index
        }));

        const { error: itemsError } = await supabase
          .from('invoice_items')
          .insert(items);

        if (itemsError) throw itemsError;
      }

      // Update recurring invoice
      await supabase
        .from('recurring_invoices')
        .update({
          invoices_generated: recurring.invoices_generated + 1,
          last_generated_at: new Date().toISOString(),
          next_invoice_date: calculateNextInvoiceDate(today, recurring.frequency)
        })
        .eq('id', recurring.id);

      alert('Fatura gerada com sucesso!');
      navigate(`/invoice/${invoiceData.id}`);
    } catch (err) {
      console.error('Error generating invoice:', err);
      alert('Erro ao gerar fatura');
    }
  };

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
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Faturas Recorrentes</h1>
          <p style={styles.subtitle}>Automatize cobranças periódicas para seus clientes</p>
        </div>
        <button onClick={() => setShowModal(true)} style={styles.btnPrimary}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Nova Recorrência
        </button>
      </div>

      {/* List */}
      {recurringInvoices.length === 0 ? (
        <div style={styles.card}>
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#9333ea" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
              </svg>
            </div>
            <h3 style={styles.emptyTitle}>Nenhuma fatura recorrente</h3>
            <p style={styles.emptyText}>
              Crie faturas automáticas que serão geradas em intervalos regulares.
            </p>
          </div>
        </div>
      ) : (
        <div style={styles.card}>
          <div style={{ overflowX: 'auto' }}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Cliente</th>
                  <th style={styles.th}>Valor</th>
                  <th style={{ ...styles.th, textAlign: 'center' }}>Frequência</th>
                  <th style={{ ...styles.th, textAlign: 'center' }}>Próxima</th>
                  <th style={{ ...styles.th, textAlign: 'center' }}>Geradas</th>
                  <th style={{ ...styles.th, textAlign: 'center' }}>Status</th>
                  <th style={{ ...styles.th, textAlign: 'right' }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {recurringInvoices.map((recurring) => (
                  <tr key={recurring.id}>
                    <td style={styles.td}>
                      <div style={{ fontWeight: 600, color: '#111827' }}>
                        {recurring.invoice_template.client_name || 'Sem cliente'}
                      </div>
                    </td>
                    <td style={styles.td}>
                      <div style={{ fontWeight: 700, color: '#111827' }}>
                        {formatCurrency(
                          recurring.invoice_template.total || 0,
                          recurring.invoice_template.currency || 'USD'
                        )}
                      </div>
                    </td>
                    <td style={{ ...styles.td, textAlign: 'center' }}>
                      <span style={styles.frequencyBadge}>
                        {frequencyLabels[recurring.frequency] || recurring.frequency}
                      </span>
                    </td>
                    <td style={{ ...styles.td, textAlign: 'center', color: '#6b7280', fontSize: '0.875rem' }}>
                      {new Date(recurring.next_invoice_date).toLocaleDateString('pt-BR')}
                    </td>
                    <td style={{ ...styles.td, textAlign: 'center', fontWeight: 600 }}>
                      {recurring.invoices_generated}
                    </td>
                    <td style={{ ...styles.td, textAlign: 'center' }}>
                      <span style={{
                        ...styles.statusBadge,
                        ...(recurring.is_active ? styles.statusActive : styles.statusInactive)
                      }}>
                        {recurring.is_active ? 'Ativa' : 'Pausada'}
                      </span>
                    </td>
                    <td style={{ ...styles.td, textAlign: 'right' }}>
                      <button
                        onClick={() => handleGenerateNow(recurring)}
                        style={{ ...styles.actionBtn, color: '#16a34a' }}
                        title="Gerar fatura agora"
                      >
                        ▶ Gerar
                      </button>
                      <button
                        onClick={() => handleToggleActive(recurring.id, recurring.is_active)}
                        style={{ ...styles.actionBtn, color: '#f59e0b' }}
                        title={recurring.is_active ? 'Pausar' : 'Ativar'}
                      >
                        {recurring.is_active ? '⏸ Pausar' : '▶ Ativar'}
                      </button>
                      <button
                        onClick={() => handleDelete(recurring.id)}
                        style={{ ...styles.actionBtn, color: '#dc2626' }}
                        title="Excluir"
                      >
                        ✕ Excluir
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div style={styles.modal} onClick={() => setShowModal(false)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Nova Fatura Recorrente</h2>
              <button
                onClick={() => setShowModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.5rem', color: '#9ca3af' }}
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div style={styles.modalBody}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Cliente</label>
                  <select
                    style={styles.select}
                    value={formData.client_id}
                    onChange={(e) => setFormData({ ...formData, client_id: e.target.value })}
                  >
                    <option value="">Selecione um cliente...</option>
                    {clients.map((client) => (
                      <option key={client.id} value={client.id}>
                        {client.name} {client.email ? `(${client.email})` : ''}
                      </option>
                    ))}
                  </select>
                </div>

                {!formData.client_id && (
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Ou digite o nome do cliente</label>
                    <input
                      style={styles.input}
                      type="text"
                      value={formData.client_name}
                      onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                      placeholder="Nome do cliente"
                    />
                  </div>
                )}

                <div style={styles.formGroup}>
                  <label style={styles.label}>Descrição do serviço</label>
                  <input
                    style={styles.input}
                    type="text"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Ex: Mensalidade de suporte técnico"
                    required
                  />
                </div>

                <div style={styles.formRow}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Valor</label>
                    <input
                      style={styles.input}
                      type="number"
                      step="0.01"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      placeholder="0.00"
                      required
                    />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Moeda</label>
                    <select
                      style={styles.select}
                      value={formData.currency}
                      onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                    >
                      <option value="USD">USD - Dólar</option>
                      <option value="BRL">BRL - Real</option>
                      <option value="EUR">EUR - Euro</option>
                    </select>
                  </div>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Frequência</label>
                  <select
                    style={styles.select}
                    value={formData.frequency}
                    onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                    required
                  >
                    <option value="weekly">Semanal</option>
                    <option value="biweekly">Quinzenal</option>
                    <option value="monthly">Mensal</option>
                    <option value="bimonthly">Bimestral</option>
                    <option value="quarterly">Trimestral</option>
                    <option value="semiannual">Semestral</option>
                    <option value="annual">Anual</option>
                  </select>
                </div>

                <div style={styles.formRow}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Data de Início</label>
                    <input
                      style={styles.input}
                      type="date"
                      value={formData.start_date}
                      onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                      required
                    />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Data de Término (opcional)</label>
                    <input
                      style={styles.input}
                      type="date"
                      value={formData.end_date}
                      onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div style={styles.modalFooter}>
                <button type="button" onClick={() => setShowModal(false)} style={styles.btnCancel}>
                  Cancelar
                </button>
                <button type="submit" disabled={saving} style={styles.btnPrimary}>
                  {saving ? 'Salvando...' : 'Criar Recorrência'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecurringInvoicesPage;
