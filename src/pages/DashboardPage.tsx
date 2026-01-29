import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/src/integrations/supabase/client';
import { InvoiceStatus } from '@/src/types';

interface InvoiceRow {
  id: string;
  invoice_number: string;
  date: string;
  due_date: string;
  total: number;
  status: string;
  currency: string;
  client_name: string | null;
  client_email: string | null;
}

type PeriodFilter = '30' | '60' | '90' | 'all';

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
    display: 'inline-block',
    boxShadow: '0 4px 14px -4px rgba(37, 99, 235, 0.4)',
    border: 'none',
    cursor: 'pointer',
    fontSize: '0.875rem'
  },
  // Metrics Cards
  metricsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem'
  },
  metricCard: {
    backgroundColor: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: '1rem',
    padding: '1.25rem',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
  },
  metricHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '0.75rem'
  },
  metricLabel: {
    fontSize: '0.75rem',
    fontWeight: 600,
    color: '#6b7280',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em'
  },
  metricIcon: {
    width: '36px',
    height: '36px',
    borderRadius: '0.5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  metricValue: {
    fontSize: '1.5rem',
    fontWeight: 800,
    color: '#111827',
    marginBottom: '0.25rem'
  },
  metricCount: {
    fontSize: '0.75rem',
    color: '#9ca3af'
  },
  // Period Filter
  filterBar: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.75rem 1rem',
    backgroundColor: '#f9fafb',
    borderRadius: '0.75rem',
    border: '1px solid #e5e7eb'
  },
  filterLabel: {
    fontSize: '0.75rem',
    fontWeight: 600,
    color: '#6b7280',
    marginRight: '0.5rem'
  },
  filterBtn: {
    padding: '0.5rem 1rem',
    borderRadius: '9999px',
    fontSize: '0.75rem',
    fontWeight: 600,
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  filterBtnActive: {
    backgroundColor: '#2563eb',
    color: '#ffffff'
  },
  filterBtnInactive: {
    backgroundColor: '#ffffff',
    color: '#374151',
    border: '1px solid #e5e7eb'
  },
  // Table styles
  card: {
    backgroundColor: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: '1rem',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    overflow: 'hidden'
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

const formatCurrency = (value: number, currency: string = 'USD') => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: currency,
  }).format(value);
};

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState<InvoiceRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [periodFilter, setPeriodFilter] = useState<PeriodFilter>('30');

  useEffect(() => {
    loadInvoices();
  }, []);

  const loadInvoices = async () => {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .select('id, invoice_number, date, due_date, total, status, currency, client_name, client_email')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setInvoices(data || []);
    } catch (err) {
      console.error('Error loading invoices:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filter invoices by period
  const filteredInvoices = useMemo(() => {
    if (periodFilter === 'all') return invoices;
    
    const now = new Date();
    const daysAgo = parseInt(periodFilter);
    const cutoffDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
    
    return invoices.filter(inv => new Date(inv.date) >= cutoffDate);
  }, [invoices, periodFilter]);

  // Calculate metrics
  const metrics = useMemo(() => {
    const pending = filteredInvoices.filter(inv => inv.status === InvoiceStatus.DRAFT);
    const paid = filteredInvoices.filter(inv => inv.status === InvoiceStatus.PAID);
    const overdue = filteredInvoices.filter(inv => {
      const dueDate = new Date(inv.due_date);
      return inv.status !== InvoiceStatus.PAID && dueDate < new Date();
    });
    
    // Future receivables: pending invoices with due date in the future
    const futureReceivables = filteredInvoices.filter(inv => {
      const dueDate = new Date(inv.due_date);
      return inv.status !== InvoiceStatus.PAID && dueDate >= new Date();
    });

    const pendingTotal = pending.reduce((sum, inv) => sum + inv.total, 0);
    const paidTotal = paid.reduce((sum, inv) => sum + inv.total, 0);
    const overdueTotal = overdue.reduce((sum, inv) => sum + inv.total, 0);
    const futureTotal = futureReceivables.reduce((sum, inv) => sum + inv.total, 0);
    
    // Cash flow = paid - pending (simplified)
    const cashFlow = paidTotal;

    return {
      pending: { count: pending.length, total: pendingTotal },
      paid: { count: paid.length, total: paidTotal },
      overdue: { count: overdue.length, total: overdueTotal },
      future: { count: futureReceivables.length, total: futureTotal },
      cashFlow
    };
  }, [filteredInvoices]);

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
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Dashboard</h1>
          <p style={styles.subtitle}>Acompanhe seu desempenho financeiro</p>
        </div>
        <Link to="/invoice/new" style={styles.btnPrimary}>
          + Nova Fatura
        </Link>
      </div>

      {/* Period Filter */}
      <div style={styles.filterBar}>
        <span style={styles.filterLabel}>Período:</span>
        {(['30', '60', '90', 'all'] as PeriodFilter[]).map((period) => (
          <button
            key={period}
            onClick={() => setPeriodFilter(period)}
            style={{
              ...styles.filterBtn,
              ...(periodFilter === period ? styles.filterBtnActive : styles.filterBtnInactive)
            }}
          >
            {period === 'all' ? 'Todos' : `${period} dias`}
          </button>
        ))}
      </div>

      {/* Metrics Cards */}
      <div style={styles.metricsGrid}>
        {/* Pending */}
        <div style={styles.metricCard}>
          <div style={styles.metricHeader}>
            <span style={styles.metricLabel}>Pendentes</span>
            <div style={{ ...styles.metricIcon, backgroundColor: '#fef3c7' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
            </div>
          </div>
          <div style={styles.metricValue}>{formatCurrency(metrics.pending.total)}</div>
          <div style={styles.metricCount}>{metrics.pending.count} fatura{metrics.pending.count !== 1 ? 's' : ''}</div>
        </div>

        {/* Paid */}
        <div style={styles.metricCard}>
          <div style={styles.metricHeader}>
            <span style={styles.metricLabel}>Pagas</span>
            <div style={{ ...styles.metricIcon, backgroundColor: '#dcfce7' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                <path d="M22 4L12 14.01l-3-3" />
              </svg>
            </div>
          </div>
          <div style={{ ...styles.metricValue, color: '#16a34a' }}>{formatCurrency(metrics.paid.total)}</div>
          <div style={styles.metricCount}>{metrics.paid.count} fatura{metrics.paid.count !== 1 ? 's' : ''}</div>
        </div>

        {/* Future Receivables */}
        <div style={styles.metricCard}>
          <div style={styles.metricHeader}>
            <span style={styles.metricLabel}>Recebíveis Futuros</span>
            <div style={{ ...styles.metricIcon, backgroundColor: '#dbeafe' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <path d="M16 2v4M8 2v4M3 10h18" />
              </svg>
            </div>
          </div>
          <div style={{ ...styles.metricValue, color: '#2563eb' }}>{formatCurrency(metrics.future.total)}</div>
          <div style={styles.metricCount}>{metrics.future.count} fatura{metrics.future.count !== 1 ? 's' : ''} a vencer</div>
        </div>

        {/* Cash Flow */}
        <div style={styles.metricCard}>
          <div style={styles.metricHeader}>
            <span style={styles.metricLabel}>Fluxo de Caixa</span>
            <div style={{ ...styles.metricIcon, backgroundColor: '#f3e8ff' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9333ea" strokeWidth="2">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
              </svg>
            </div>
          </div>
          <div style={{ ...styles.metricValue, color: '#9333ea' }}>{formatCurrency(metrics.cashFlow)}</div>
          <div style={styles.metricCount}>Total recebido no período</div>
        </div>
      </div>

      {/* Overdue Alert */}
      {metrics.overdue.count > 0 && (
        <div style={{
          backgroundColor: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: '0.75rem',
          padding: '1rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem'
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2">
            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            <path d="M12 9v4M12 17h.01" />
          </svg>
          <div>
            <span style={{ fontWeight: 700, color: '#991b1b' }}>
              {metrics.overdue.count} fatura{metrics.overdue.count !== 1 ? 's' : ''} vencida{metrics.overdue.count !== 1 ? 's' : ''}
            </span>
            <span style={{ color: '#b91c1c', marginLeft: '0.5rem' }}>
              Total: {formatCurrency(metrics.overdue.total)}
            </span>
          </div>
        </div>
      )}

      {/* Invoices Table */}
      <div style={{ marginTop: '0.5rem' }}>
        <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#111827', marginBottom: '1rem' }}>
          Faturas Recentes
        </h2>
        
        {filteredInvoices.length === 0 ? (
          <div style={styles.card}>
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2">
                  <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 style={styles.emptyTitle}>Nenhuma fatura no período</h3>
              <p style={styles.emptyText}>
                Crie sua primeira fatura para começar a acompanhar seu faturamento.
              </p>
              <Link to="/invoice/new" style={styles.emptyLink}>
                + Criar Nova Fatura
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
                  {filteredInvoices.map((invoice) => (
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
                          {formatCurrency(invoice.total, invoice.currency || 'USD')}
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
    </div>
  );
};

export default DashboardPage;
