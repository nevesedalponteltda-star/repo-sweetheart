import React, { useState, useEffect } from 'react';
import { supabase } from '@/src/integrations/supabase/client';
import { Client } from '@/src/types';

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
    border: 'none',
    cursor: 'pointer',
    fontSize: '0.875rem',
    boxShadow: '0 4px 14px -4px rgba(37, 99, 235, 0.4)'
  },
  btnSecondary: {
    backgroundColor: 'transparent',
    color: '#2563eb',
    padding: '0.625rem 1.5rem',
    borderRadius: '9999px',
    fontWeight: 700,
    border: '2px solid #2563eb',
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
  cardPadded: {
    backgroundColor: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: '1rem',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    padding: '1.5rem'
  },
  formTitle: {
    fontSize: '1.25rem',
    fontWeight: 700,
    color: '#111827',
    marginBottom: '1rem'
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1rem'
  },
  formFullWidth: {
    gridColumn: '1 / -1'
  },
  label: {
    display: 'block',
    fontSize: '0.875rem',
    fontWeight: 700,
    color: '#374151',
    marginBottom: '0.5rem'
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
    boxSizing: 'border-box' as const
  },
  formActions: {
    gridColumn: '1 / -1',
    display: 'flex',
    gap: '1rem',
    justifyContent: 'flex-end',
    marginTop: '0.5rem'
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
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '0.875rem'
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
  clientName: {
    fontWeight: 700,
    color: '#111827'
  },
  textMuted: {
    color: '#6b7280'
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

const ClientsPage: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    notes: '',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadClients();
  }, []);

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
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      if (editingClient) {
        const { error } = await supabase
          .from('clients')
          .update({
            name: formData.name,
            email: formData.email || null,
            phone: formData.phone || null,
            address: formData.address || null,
            notes: formData.notes || null,
          })
          .eq('id', editingClient.id);

        if (error) throw error;
      } else {
        const { error } = await supabase.from('clients').insert({
          user_id: user.id,
          name: formData.name,
          email: formData.email || null,
          phone: formData.phone || null,
          address: formData.address || null,
          notes: formData.notes || null,
        });

        if (error) throw error;
      }

      await loadClients();
      resetForm();
    } catch (err) {
      console.error('Error saving client:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (client: Client) => {
    setEditingClient(client);
    setFormData({
      name: client.name,
      email: client.email || '',
      phone: client.phone || '',
      address: client.address || '',
      notes: client.notes || '',
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este cliente?')) return;

    try {
      const { error } = await supabase.from('clients').delete().eq('id', id);
      if (error) throw error;
      setClients(clients.filter((c) => c.id !== id));
    } catch (err) {
      console.error('Error deleting client:', err);
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingClient(null);
    setFormData({ name: '', email: '', phone: '', address: '', notes: '' });
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
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Seus Clientes</h1>
          <p style={styles.subtitle}>Gerencie sua base de clientes para faturamento rápido</p>
        </div>
        <button onClick={() => setShowForm(true)} style={styles.btnPrimary}>
          Adicionar Cliente
        </button>
      </div>

      {showForm && (
        <div style={styles.cardPadded}>
          <h2 style={styles.formTitle}>
            {editingClient ? 'Editar Cliente' : 'Novo Cliente'}
          </h2>
          <form onSubmit={handleSubmit} style={styles.formGrid}>
            <div>
              <label style={styles.label}>Nome *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                placeholder="Nome do cliente"
                style={styles.input}
              />
            </div>
            <div>
              <label style={styles.label}>Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="email@cliente.com"
                style={styles.input}
              />
            </div>
            <div>
              <label style={styles.label}>Telefone</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="(00) 00000-0000"
                style={styles.input}
              />
            </div>
            <div>
              <label style={styles.label}>Endereço</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Endereço completo"
                style={styles.input}
              />
            </div>
            <div style={styles.formFullWidth}>
              <label style={styles.label}>Observações</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Notas internas sobre o cliente"
                rows={3}
                style={styles.textarea}
              />
            </div>
            <div style={styles.formActions}>
              <button type="button" onClick={resetForm} style={styles.btnSecondary}>
                Cancelar
              </button>
              <button type="submit" disabled={saving} style={styles.btnPrimary}>
                {saving ? 'Salvando...' : editingClient ? 'Atualizar' : 'Salvar'}
              </button>
            </div>
          </form>
        </div>
      )}

      {clients.length === 0 && !showForm ? (
        <div style={styles.card}>
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2">
                <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 style={styles.emptyTitle}>Nenhum cliente cadastrado</h3>
            <p style={styles.emptyText}>
              Adicione clientes para facilitar a criação de faturas.
            </p>
            <button onClick={() => setShowForm(true)} style={styles.emptyLink}>
              + Adicionar Primeiro Cliente
            </button>
          </div>
        </div>
      ) : (
        clients.length > 0 && (
          <div style={styles.card}>
            <div style={{ overflowX: 'auto' }}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Nome</th>
                    <th style={styles.th}>Email</th>
                    <th style={styles.th}>Telefone</th>
                    <th style={{ ...styles.th, textAlign: 'right' }}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {clients.map((client) => (
                    <tr key={client.id}>
                      <td style={{ ...styles.td, ...styles.clientName }}>{client.name}</td>
                      <td style={{ ...styles.td, ...styles.textMuted }}>{client.email || '-'}</td>
                      <td style={{ ...styles.td, ...styles.textMuted }}>{client.phone || '-'}</td>
                      <td style={{ ...styles.td, textAlign: 'right' }}>
                        <button
                          onClick={() => handleEdit(client)}
                          style={{ ...styles.actionBtn, ...styles.editBtn }}
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(client.id)}
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
        )
      )}
    </div>
  );
};

export default ClientsPage;
