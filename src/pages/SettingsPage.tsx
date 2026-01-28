import React, { useState, useEffect } from 'react';
import { supabase } from '@/src/integrations/supabase/client';
import { useCurrencyExchange } from '@/src/hooks/useCurrencyExchange';

interface ProfileData {
  company_name: string;
  company_email: string;
  company_phone: string;
  company_address: string;
  company_website: string;
  company_tax_id: string;
  company_logo_url: string;
  default_currency: string;
  default_tax_rate: number;
  default_notes: string;
  default_terms: string;
}

const styles = {
  container: {
    maxWidth: '768px',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1.5rem'
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
  successBox: {
    backgroundColor: '#f0fdf4',
    border: '1px solid #bbf7d0',
    color: '#15803d',
    padding: '0.75rem 1rem',
    borderRadius: '8px',
    fontSize: '0.875rem'
  },
  card: {
    backgroundColor: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: '1rem',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    padding: '1.5rem'
  },
  cardTitle: {
    fontSize: '1.25rem',
    fontWeight: 700,
    color: '#111827',
    marginBottom: '1rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  },
  logoSection: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '1.5rem'
  },
  logoBox: {
    width: '128px',
    height: '128px',
    backgroundColor: '#f3f4f6',
    border: '2px dashed #d1d5db',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    cursor: 'pointer',
    position: 'relative' as const
  },
  logoImg: {
    width: '100%',
    height: '100%',
    objectFit: 'contain' as const
  },
  logoPlaceholder: {
    textAlign: 'center' as const
  },
  logoPlaceholderText: {
    fontSize: '0.75rem',
    color: '#9ca3af',
    marginTop: '0.25rem'
  },
  logoInfo: {
    flex: 1
  },
  logoInfoText: {
    fontSize: '0.875rem',
    color: '#4b5563',
    marginBottom: '0.5rem'
  },
  logoInfoList: {
    fontSize: '0.75rem',
    color: '#9ca3af',
    listStyle: 'none',
    padding: 0,
    margin: 0
  },
  removeLogoBtn: {
    color: '#dc2626',
    fontSize: '0.875rem',
    fontWeight: 500,
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    marginTop: '0.5rem'
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
    boxSizing: 'border-box' as const
  },
  ratesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
    gap: '0.75rem',
    marginTop: '1rem'
  },
  rateBox: {
    backgroundColor: '#f9fafb',
    borderRadius: '8px',
    padding: '0.75rem',
    textAlign: 'center' as const
  },
  rateLabel: {
    fontSize: '0.625rem',
    color: '#9ca3af',
    fontWeight: 700
  },
  rateValue: {
    fontSize: '1.125rem',
    fontWeight: 900,
    color: '#111827'
  },
  rateCurrency: {
    fontSize: '0.875rem',
    fontWeight: 700,
    color: '#2563eb'
  },
  rateUpdated: {
    fontSize: '0.75rem',
    color: '#9ca3af',
    marginTop: '1rem'
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
  formActions: {
    display: 'flex',
    justifyContent: 'flex-end'
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
  hiddenInput: {
    position: 'absolute' as const,
    inset: 0,
    opacity: 0,
    cursor: 'pointer'
  }
};

const SettingsPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const { rates, loading: ratesLoading, lastUpdated, getAvailableCurrencies } = useCurrencyExchange();
  
  const [profile, setProfile] = useState<ProfileData>({
    company_name: '',
    company_email: '',
    company_phone: '',
    company_address: '',
    company_website: '',
    company_tax_id: '',
    company_logo_url: '',
    default_currency: 'USD',
    default_tax_rate: 0,
    default_notes: '',
    default_terms: '',
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setProfile({
          company_name: data.company_name || '',
          company_email: data.company_email || '',
          company_phone: data.company_phone || '',
          company_address: data.company_address || '',
          company_website: data.company_website || '',
          company_tax_id: data.company_tax_id || '',
          company_logo_url: data.company_logo_url || '',
          default_currency: data.default_currency || 'USD',
          default_tax_rate: Number(data.default_tax_rate) || 0,
          default_notes: data.default_notes || '',
          default_terms: data.default_terms || '',
        });
      }
    } catch (err) {
      console.error('Error loading profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('A imagem deve ter no máximo 2MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile({ ...profile, company_logo_url: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess('');

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('profiles')
        .update({
          company_name: profile.company_name || null,
          company_email: profile.company_email || null,
          company_phone: profile.company_phone || null,
          company_address: profile.company_address || null,
          company_website: profile.company_website || null,
          company_tax_id: profile.company_tax_id || null,
          company_logo_url: profile.company_logo_url || null,
          default_currency: profile.default_currency,
          default_tax_rate: profile.default_tax_rate,
          default_notes: profile.default_notes || null,
          default_terms: profile.default_terms || null,
        })
        .eq('user_id', user.id);

      if (error) throw error;
      setSuccess('Configurações salvas com sucesso!');
    } catch (err) {
      console.error('Error saving profile:', err);
    } finally {
      setSaving(false);
    }
  };

  const currencies = getAvailableCurrencies();

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
      
      <div>
        <h1 style={styles.title}>Configurações</h1>
        <p style={styles.subtitle}>Gerencie as informações da sua empresa e preferências de faturamento</p>
      </div>

      {success && <div style={styles.successBox}>{success}</div>}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Logo Section */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Logo da Empresa</h2>
          <div style={styles.logoSection}>
            <div style={styles.logoBox}>
              {profile.company_logo_url ? (
                <img src={profile.company_logo_url} alt="Logo" style={styles.logoImg} />
              ) : (
                <div style={styles.logoPlaceholder}>
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2">
                    <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span style={styles.logoPlaceholderText}>Clique para enviar</span>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                style={styles.hiddenInput}
              />
            </div>
            <div style={styles.logoInfo}>
              <p style={styles.logoInfoText}>
                Faça upload do logo da sua empresa para aparecer nas faturas.
              </p>
              <ul style={styles.logoInfoList}>
                <li>• Formatos aceitos: PNG, JPG, SVG</li>
                <li>• Tamanho máximo: 2MB</li>
                <li>• Recomendado: 200x200 pixels</li>
              </ul>
              {profile.company_logo_url && (
                <button
                  type="button"
                  onClick={() => setProfile({ ...profile, company_logo_url: '' })}
                  style={styles.removeLogoBtn}
                >
                  Remover logo
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Company Info */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Dados da Empresa</h2>
          <div style={styles.formGrid}>
            <div>
              <label style={styles.label}>Nome da Empresa</label>
              <input
                type="text"
                value={profile.company_name}
                onChange={(e) => setProfile({ ...profile, company_name: e.target.value })}
                placeholder="Sua Empresa Ltda"
                style={styles.input}
              />
            </div>
            <div>
              <label style={styles.label}>Email Comercial</label>
              <input
                type="email"
                value={profile.company_email}
                onChange={(e) => setProfile({ ...profile, company_email: e.target.value })}
                placeholder="contato@empresa.com"
                style={styles.input}
              />
            </div>
            <div>
              <label style={styles.label}>Telefone</label>
              <input
                type="text"
                value={profile.company_phone}
                onChange={(e) => setProfile({ ...profile, company_phone: e.target.value })}
                placeholder="(00) 0000-0000"
                style={styles.input}
              />
            </div>
            <div>
              <label style={styles.label}>Website</label>
              <input
                type="text"
                value={profile.company_website}
                onChange={(e) => setProfile({ ...profile, company_website: e.target.value })}
                placeholder="www.empresa.com.br"
                style={styles.input}
              />
            </div>
            <div>
              <label style={styles.label}>CNPJ / CPF</label>
              <input
                type="text"
                value={profile.company_tax_id}
                onChange={(e) => setProfile({ ...profile, company_tax_id: e.target.value })}
                placeholder="00.000.000/0000-00"
                style={styles.input}
              />
            </div>
            <div style={styles.formFullWidth}>
              <label style={styles.label}>Endereço Completo</label>
              <textarea
                value={profile.company_address}
                onChange={(e) => setProfile({ ...profile, company_address: e.target.value })}
                placeholder="Rua, Número, Bairro, Cidade - UF, CEP"
                rows={2}
                style={styles.textarea}
              />
            </div>
          </div>
        </div>

        {/* Invoice Defaults */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Padrões para Faturas</h2>
          <div style={styles.formGrid}>
            <div>
              <label style={styles.label}>Moeda Padrão</label>
              <select
                value={profile.default_currency}
                onChange={(e) => setProfile({ ...profile, default_currency: e.target.value })}
                style={styles.select}
              >
                {currencies.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={styles.label}>Taxa de Imposto (%)</label>
              <input
                type="number"
                value={profile.default_tax_rate}
                onChange={(e) => setProfile({ ...profile, default_tax_rate: parseFloat(e.target.value) || 0 })}
                placeholder="0"
                min="0"
                max="100"
                step="0.01"
                style={styles.input}
              />
            </div>
            <div style={styles.formFullWidth}>
              <label style={styles.label}>Notas Padrão</label>
              <textarea
                value={profile.default_notes}
                onChange={(e) => setProfile({ ...profile, default_notes: e.target.value })}
                placeholder="Ex: Chave PIX: seu@email.com"
                rows={3}
                style={styles.textarea}
              />
            </div>
            <div style={styles.formFullWidth}>
              <label style={styles.label}>Termos Legais Padrão</label>
              <textarea
                value={profile.default_terms}
                onChange={(e) => setProfile({ ...profile, default_terms: e.target.value })}
                placeholder="Condições de pagamento, multas, etc."
                rows={3}
                style={styles.textarea}
              />
            </div>
          </div>
        </div>

        {/* Exchange Rates Info */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2">
              <path d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
            Cotações de Moedas
          </h2>
          {ratesLoading ? (
            <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Carregando cotações...</p>
          ) : (
            <div>
              <p style={{ fontSize: '0.875rem', color: '#4b5563' }}>
                As cotações são atualizadas automaticamente e usadas para converter valores nas faturas.
              </p>
              <div style={styles.ratesGrid}>
                {currencies.map(currency => (
                  <div key={currency} style={styles.rateBox}>
                    <div style={styles.rateLabel}>1 USD =</div>
                    <div style={styles.rateValue}>{rates[currency]?.toFixed(2)}</div>
                    <div style={styles.rateCurrency}>{currency}</div>
                  </div>
                ))}
              </div>
              {lastUpdated && (
                <p style={styles.rateUpdated}>
                  Última atualização: {new Date(lastUpdated).toLocaleString('pt-BR')}
                </p>
              )}
            </div>
          )}
        </div>

        <div style={styles.formActions}>
          <button type="submit" disabled={saving} style={styles.btnPrimary}>
            {saving ? 'Salvando...' : 'Salvar Configurações'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SettingsPage;
