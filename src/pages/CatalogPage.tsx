import React, { useState, useEffect } from 'react';
import { supabase } from '@/src/integrations/supabase/client';

interface CatalogItem {
  id: string;
  name: string;
  description: string;
  rate: number;
  unit: string;
  category: string;
  is_active: boolean;
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
    flexWrap: 'wrap',
    gap: '1rem',
  },
  title: {
    fontSize: '1.75rem',
    fontWeight: 900,
    color: '#111827',
    letterSpacing: '-0.02em',
  },
  subtitle: {
    color: '#6b7280',
    fontSize: '0.875rem',
    marginTop: '0.25rem',
  },
  btn: {
    backgroundColor: '#2563eb',
    color: '#ffffff',
    padding: '0.75rem 1.5rem',
    borderRadius: '9999px',
    fontWeight: 700,
    border: 'none',
    cursor: 'pointer',
    fontSize: '0.875rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  card: {
    backgroundColor: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: '1rem',
    padding: '1.5rem',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '1rem',
  },
  itemCard: {
    backgroundColor: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: '0.75rem',
    padding: '1rem',
    transition: 'all 0.2s',
  },
  itemName: {
    fontWeight: 700,
    fontSize: '1rem',
    color: '#111827',
    marginBottom: '0.25rem',
  },
  itemDescription: {
    color: '#6b7280',
    fontSize: '0.75rem',
    marginBottom: '0.5rem',
    lineHeight: 1.4,
  },
  itemMeta: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '0.75rem',
    paddingTop: '0.75rem',
    borderTop: '1px solid #f3f4f6',
  },
  itemPrice: {
    fontWeight: 800,
    fontSize: '1.125rem',
    color: '#2563eb',
  },
  itemUnit: {
    fontSize: '0.75rem',
    color: '#9ca3af',
  },
  category: {
    fontSize: '0.625rem',
    fontWeight: 700,
    color: '#6b7280',
    backgroundColor: '#f3f4f6',
    padding: '0.25rem 0.5rem',
    borderRadius: '9999px',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  actions: {
    display: 'flex',
    gap: '0.5rem',
  },
  actionBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '0.25rem',
    color: '#6b7280',
    fontSize: '0.875rem',
  },
  modal: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
    padding: '1rem',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: '1rem',
    padding: '2rem',
    maxWidth: '500px',
    width: '100%',
    maxHeight: '90vh',
    overflowY: 'auto',
  },
  modalTitle: {
    fontSize: '1.25rem',
    fontWeight: 800,
    color: '#111827',
    marginBottom: '1.5rem',
  },
  formGroup: {
    marginBottom: '1rem',
  },
  label: {
    display: 'block',
    fontSize: '0.75rem',
    fontWeight: 700,
    color: '#374151',
    marginBottom: '0.25rem',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  input: {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #e5e7eb',
    borderRadius: '0.5rem',
    fontSize: '0.875rem',
    boxSizing: 'border-box',
  },
  textarea: {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #e5e7eb',
    borderRadius: '0.5rem',
    fontSize: '0.875rem',
    minHeight: '80px',
    resize: 'vertical',
    boxSizing: 'border-box',
  },
  modalActions: {
    display: 'flex',
    gap: '0.75rem',
    marginTop: '1.5rem',
  },
  btnSecondary: {
    backgroundColor: 'transparent',
    color: '#374151',
    padding: '0.75rem 1.5rem',
    borderRadius: '9999px',
    fontWeight: 700,
    border: '1px solid #e5e7eb',
    cursor: 'pointer',
    fontSize: '0.875rem',
    flex: 1,
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
    flex: 1,
  },
  btnDanger: {
    backgroundColor: '#ef4444',
    color: '#ffffff',
    padding: '0.5rem 1rem',
    borderRadius: '9999px',
    fontWeight: 700,
    border: 'none',
    cursor: 'pointer',
    fontSize: '0.75rem',
  },
  empty: {
    textAlign: 'center',
    padding: '3rem',
    color: '#6b7280',
  },
  emptyIcon: {
    fontSize: '3rem',
    marginBottom: '1rem',
  },
  searchBar: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '1.5rem',
    flexWrap: 'wrap',
  },
  searchInput: {
    flex: 1,
    minWidth: '200px',
    padding: '0.75rem 1rem',
    border: '1px solid #e5e7eb',
    borderRadius: '9999px',
    fontSize: '0.875rem',
  },
  filterSelect: {
    padding: '0.75rem 1rem',
    border: '1px solid #e5e7eb',
    borderRadius: '9999px',
    fontSize: '0.875rem',
    backgroundColor: '#ffffff',
    minWidth: '150px',
  },
};

const CatalogPage: React.FC = () => {
  const [items, setItems] = useState<CatalogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<CatalogItem | null>(null);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    rate: 0,
    unit: 'un',
    category: '',
  });

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      const { data, error } = await supabase
        .from('catalog_items')
        .select('*')
        .eq('is_active', true)
        .order('name', { ascending: true });

      if (error) throw error;
      setItems(data || []);
    } catch (err) {
      console.error('Error loading catalog:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      if (editingItem) {
        const { error } = await supabase
          .from('catalog_items')
          .update({
            name: formData.name,
            description: formData.description,
            rate: formData.rate,
            unit: formData.unit,
            category: formData.category,
          })
          .eq('id', editingItem.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('catalog_items')
          .insert({
            user_id: user.id,
            name: formData.name,
            description: formData.description,
            rate: formData.rate,
            unit: formData.unit,
            category: formData.category,
          });

        if (error) throw error;
      }

      setShowModal(false);
      setEditingItem(null);
      setFormData({ name: '', description: '', rate: 0, unit: 'un', category: '' });
      loadItems();
    } catch (err) {
      console.error('Error saving item:', err);
    }
  };

  const handleEdit = (item: CatalogItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description || '',
      rate: item.rate,
      unit: item.unit || 'un',
      category: item.category || '',
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja realmente excluir este item?')) return;

    try {
      const { error } = await supabase
        .from('catalog_items')
        .update({ is_active: false })
        .eq('id', id);

      if (error) throw error;
      loadItems();
    } catch (err) {
      console.error('Error deleting item:', err);
    }
  };

  const openNewItem = () => {
    setEditingItem(null);
    setFormData({ name: '', description: '', rate: 0, unit: 'un', category: '' });
    setShowModal(true);
  };

  const categories = [...new Set(items.map(i => i.category).filter(Boolean))];

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(search.toLowerCase()));
    const matchesCategory = !categoryFilter || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
        <div style={{ width: '32px', height: '32px', border: '4px solid #e5e7eb', borderTopColor: '#2563eb', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>📦 Catálogo</h1>
          <p style={styles.subtitle}>Gerencie seus produtos e serviços</p>
        </div>
        <button onClick={openNewItem} style={styles.btn}>
          <span style={{ fontSize: '1.25rem' }}>+</span>
          Novo Item
        </button>
      </div>

      <div style={styles.searchBar}>
        <input
          type="text"
          placeholder="🔍 Buscar produtos ou serviços..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={styles.searchInput}
        />
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          style={styles.filterSelect}
        >
          <option value="">Todas categorias</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {filteredItems.length === 0 ? (
        <div style={{ ...styles.card, ...styles.empty }}>
          <div style={styles.emptyIcon}>📦</div>
          <h3 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Nenhum item cadastrado</h3>
          <p style={{ fontSize: '0.875rem' }}>Adicione produtos ou serviços para agilizar a criação de faturas.</p>
        </div>
      ) : (
        <div style={styles.grid}>
          {filteredItems.map(item => (
            <div key={item.id} style={styles.itemCard}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <h3 style={styles.itemName}>{item.name}</h3>
                  {item.category && <span style={styles.category}>{item.category}</span>}
                </div>
                <div style={styles.actions}>
                  <button onClick={() => handleEdit(item)} style={styles.actionBtn} title="Editar">✏️</button>
                  <button onClick={() => handleDelete(item.id)} style={styles.actionBtn} title="Excluir">🗑️</button>
                </div>
              </div>
              {item.description && (
                <p style={styles.itemDescription}>{item.description}</p>
              )}
              <div style={styles.itemMeta}>
                <div>
                  <span style={styles.itemPrice}>R$ {item.rate.toFixed(2)}</span>
                  <span style={styles.itemUnit}> / {item.unit}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div style={styles.modal} onClick={() => setShowModal(false)}>
          <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
            <h2 style={styles.modalTitle}>
              {editingItem ? '✏️ Editar Item' : '➕ Novo Item'}
            </h2>

            <div style={styles.formGroup}>
              <label style={styles.label}>Nome *</label>
              <input
                type="text"
                style={styles.input}
                placeholder="Ex: Consultoria de Marketing"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Descrição</label>
              <textarea
                style={styles.textarea}
                placeholder="Descrição detalhada do produto ou serviço..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Preço (R$)</label>
                <input
                  type="number"
                  style={styles.input}
                  placeholder="0.00"
                  value={formData.rate}
                  onChange={(e) => setFormData({ ...formData, rate: parseFloat(e.target.value) || 0 })}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Unidade</label>
                <select
                  style={styles.input}
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                >
                  <option value="un">Unidade</option>
                  <option value="hr">Hora</option>
                  <option value="dia">Dia</option>
                  <option value="mês">Mês</option>
                  <option value="kg">Kg</option>
                  <option value="m²">m²</option>
                </select>
              </div>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Categoria</label>
              <input
                type="text"
                style={styles.input}
                placeholder="Ex: Serviços, Produtos, Consultoria..."
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                list="categories"
              />
              <datalist id="categories">
                {categories.map(cat => (
                  <option key={cat} value={cat} />
                ))}
              </datalist>
            </div>

            <div style={styles.modalActions}>
              <button onClick={() => setShowModal(false)} style={styles.btnSecondary}>
                Cancelar
              </button>
              <button onClick={handleSubmit} style={styles.btnPrimary} disabled={!formData.name}>
                {editingItem ? 'Salvar' : 'Criar Item'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CatalogPage;
