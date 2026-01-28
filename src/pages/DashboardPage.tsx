import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/src/integrations/supabase/client';
import { InvoiceStatus } from '@/src/types';

interface InvoiceRow {
  id: string;
  invoice_number: string;
  date: string;
  total: number;
  status: string;
  currency: string;
  client_name: string | null;
  client_email: string | null;
}

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
  statusBtn: {
    padding: '0.25rem 0.5rem',
    borderRadius: '9999px',
    fontSize: '0.625rem',
    fontWeight: 700,
    cursor: 'pointer',
    border: 'none',
    marginLeft: '0.5rem'
  },
  statusBtnSuccess: {
    backgroundColor: '#dcfce7',
    color: '#166534'
  },
  statusBtnWarning: {
    backgroundColor: '#fef3c7',
    color: '#92400e'
  },
  printBtn: {
    color: '#6b7280',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontWeight: 700,
    fontSize: '0.875rem'
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
    display: 'inline-block',
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
    backgroundColor: '#eff6ff',
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
  emptyLink: {
    marginTop: '2rem',
    display: 'inline-block',
    color: '#2563eb',
    fontWeight: 700,
    textDecoration: 'none'
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
  invoiceNumber: {
    fontWeight: 700,
    color: '#111827'
  },
  clientName: {
    fontWeight: 500,
    color: '#374151'
  },
  clientEmail: {
    fontSize: '0.75rem',
    color: '#9ca3af'
  },
  dateText: {
    color: '#6b7280',
    fontSize: '0.875rem'
  },
  amount: {
    fontWeight: 700,
    color: '#111827'
  },
  statusBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '0.25rem 0.75rem',
    borderRadius: '9999px',
    fontSize: '0.75rem',
    fontWeight: 700
  },
  statusPaid: {
    backgroundColor: '#dcfce7',
    color: '#166534'
  },
  statusSent: {
    backgroundColor: '#dbeafe',
    color: '#1e40af'
  },
  statusOverdue: {
    backgroundColor: '#fee2e2',
    color: '#991b1b'
  },
  statusDefault: {
    backgroundColor: '#f3f4f6',
    color: '#374151'
  },
  actionBtn: {
    background: 'none',
    border: 'none',
    fontWeight: 700,
    fontSize: '0.875rem',
    cursor: 'pointer',
    marginLeft: '1rem'
  },
  editBtn: {
    color: '#2563eb'
  },
  deleteBtn: {
    color: '#dc2626'
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

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState<InvoiceRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInvoices();
  }, []);

  const loadInvoices = async () => {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .select('id, invoice_number, date, total, status, currency, client_name, client_email')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setInvoices(data || []);
    } catch (err) {
      console.error('Error loading invoices:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm('Tem certeza que deseja excluir esta fatura?')) return;

    try {
      const { error } = await supabase.from('invoices').delete().eq('id', id);
      if (error) throw error;
      setInvoices(invoices.filter((inv) => inv.id !== id));
    } catch (err) {
      console.error('Error deleting invoice:', err);
    }
  };

  const handleStatusToggle = async (id: string, currentStatus: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newStatus = currentStatus === InvoiceStatus.PAID ? InvoiceStatus.DRAFT : InvoiceStatus.PAID;
    
    try {
      const { error } = await supabase
        .from('invoices')
        .update({ status: newStatus })
        .eq('id', id);
      
      if (error) throw error;
      setInvoices(invoices.map(inv => 
        inv.id === id ? { ...inv, status: newStatus } : inv
      ));
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case InvoiceStatus.PAID:
        return styles.statusPaid;
      case InvoiceStatus.SENT:
        return styles.statusSent;
      case InvoiceStatus.OVERDUE:
        return styles.statusOverdue;
      default:
        return styles.statusDefault;
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
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Suas Faturas</h1>
          <p style={styles.subtitle}>Acompanhe seus pagamentos e envie cobranças profissionais</p>
        </div>
        <Link to="/invoice/new" style={styles.btnPrimary}>
          Criar Nova Fatura
        </Link>
      </div>

      {invoices.length === 0 ? (
        <div style={styles.card}>
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2">
                <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 style={styles.emptyTitle}>Comece seu faturamento</h3>
            <p style={styles.emptyText}>
              Crie faturas personalizadas com sua logo e receba pagamentos com profissionalismo.
            </p>
            <Link to="/invoice/new" style={styles.emptyLink}>
              + Adicionar Minha Primeira Fatura
            </Link>
          </div>
        </div>
      ) : (
        <div style={styles.card}>
          <div style={{ overflowX: 'auto' }}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Número</th>
                  <th style={styles.th}>Cliente</th>
                  <th style={{ ...styles.th, textAlign: 'center' }}>Data</th>
                  <th style={{ ...styles.th, textAlign: 'right' }}>Valor</th>
                  <th style={{ ...styles.th, textAlign: 'center' }}>Status</th>
                  <th style={{ ...styles.th, textAlign: 'right' }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice) => (
                  <tr
                    key={invoice.id}
                    style={{ cursor: 'pointer' }}
                    onClick={() => navigate(`/invoice/${invoice.id}`)}
                  >
                    <td style={styles.td}>
                      <span style={styles.invoiceNumber}>#{invoice.invoice_number}</span>
                    </td>
                    <td style={styles.td}>
                      <div style={styles.clientName}>{invoice.client_name || 'Sem nome'}</div>
                      <div style={styles.clientEmail}>{invoice.client_email}</div>
                    </td>
                    <td style={{ ...styles.td, textAlign: 'center' }}>
                      <span style={styles.dateText}>
                        {new Date(invoice.date).toLocaleDateString('pt-BR')}
                      </span>
                    </td>
                    <td style={{ ...styles.td, textAlign: 'right' }}>
                      <span style={styles.amount}>
                        {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: invoice.currency || 'USD',
                        }).format(invoice.total)}
                      </span>
                    </td>
                    <td style={{ ...styles.td, textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
                      <span style={{ ...styles.statusBadge, ...getStatusStyle(invoice.status) }}>
                        {invoice.status}
                      </span>
                      {invoice.status === InvoiceStatus.DRAFT ? (
                        <button
                          onClick={(e) => handleStatusToggle(invoice.id, invoice.status, e)}
                          style={{ ...styles.statusBtn, ...styles.statusBtnSuccess }}
                          title="Marcar como Paga"
                        >
                          ✓ Paga
                        </button>
                      ) : invoice.status === InvoiceStatus.PAID ? (
                        <button
                          onClick={(e) => handleStatusToggle(invoice.id, invoice.status, e)}
                          style={{ ...styles.statusBtn, ...styles.statusBtnWarning }}
                          title="Voltar para Rascunho"
                        >
                          ↺ Rascunho
                        </button>
                      ) : null}
                    </td>
                    <td style={{ ...styles.td, textAlign: 'right' }} onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => navigate(`/invoice/${invoice.id}`)}
                        style={{ ...styles.actionBtn, ...styles.editBtn }}
                      >
                        Editar
                      </button>
                      <button
                        onClick={(e) => handleDelete(invoice.id, e)}
                        style={{ ...styles.actionBtn, ...styles.deleteBtn }}
                      >
                        Excluir
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
