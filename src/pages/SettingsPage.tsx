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
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Configurações</h1>
        <p className="text-gray-500">Gerencie as informações da sua empresa e preferências de faturamento</p>
      </div>

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Logo Section */}
        <div className="card p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Logo da Empresa</h2>
          <div className="flex items-start gap-6">
            <div className="relative group">
              <div className="w-32 h-32 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center overflow-hidden hover:border-blue-400 transition-colors cursor-pointer">
                {profile.company_logo_url ? (
                  <img 
                    src={profile.company_logo_url} 
                    alt="Logo" 
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="text-center">
                    <svg className="w-10 h-10 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-xs text-gray-400 mt-1 block">Clique para enviar</span>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>
            </div>
            <div className="flex-1 space-y-2">
              <p className="text-sm text-gray-600">
                Faça upload do logo da sua empresa para aparecer nas faturas.
              </p>
              <ul className="text-xs text-gray-400 space-y-1">
                <li>• Formatos aceitos: PNG, JPG, SVG</li>
                <li>• Tamanho máximo: 2MB</li>
                <li>• Recomendado: 200x200 pixels</li>
              </ul>
              {profile.company_logo_url && (
                <button
                  type="button"
                  onClick={() => setProfile({ ...profile, company_logo_url: '' })}
                  className="text-red-600 hover:text-red-800 text-sm font-medium"
                >
                  Remover logo
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Company Info */}
        <div className="card p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Dados da Empresa</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Nome da Empresa</label>
              <input
                type="text"
                value={profile.company_name}
                onChange={(e) => setProfile({ ...profile, company_name: e.target.value })}
                placeholder="Sua Empresa Ltda"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Email Comercial</label>
              <input
                type="email"
                value={profile.company_email}
                onChange={(e) => setProfile({ ...profile, company_email: e.target.value })}
                placeholder="contato@empresa.com"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Telefone</label>
              <input
                type="text"
                value={profile.company_phone}
                onChange={(e) => setProfile({ ...profile, company_phone: e.target.value })}
                placeholder="(00) 0000-0000"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Website</label>
              <input
                type="text"
                value={profile.company_website}
                onChange={(e) => setProfile({ ...profile, company_website: e.target.value })}
                placeholder="www.empresa.com.br"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">CNPJ / CPF</label>
              <input
                type="text"
                value={profile.company_tax_id}
                onChange={(e) => setProfile({ ...profile, company_tax_id: e.target.value })}
                placeholder="00.000.000/0000-00"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-2">Endereço Completo</label>
              <textarea
                value={profile.company_address}
                onChange={(e) => setProfile({ ...profile, company_address: e.target.value })}
                placeholder="Rua, Número, Bairro, Cidade - UF, CEP"
                rows={2}
              />
            </div>
          </div>
        </div>

        {/* Invoice Defaults */}
        <div className="card p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Padrões para Faturas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Moeda Padrão</label>
              <select
                value={profile.default_currency}
                onChange={(e) => setProfile({ ...profile, default_currency: e.target.value })}
              >
                {currencies.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Taxa de Imposto (%)</label>
              <input
                type="number"
                value={profile.default_tax_rate}
                onChange={(e) => setProfile({ ...profile, default_tax_rate: parseFloat(e.target.value) || 0 })}
                placeholder="0"
                min="0"
                max="100"
                step="0.01"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-2">Notas Padrão</label>
              <textarea
                value={profile.default_notes}
                onChange={(e) => setProfile({ ...profile, default_notes: e.target.value })}
                placeholder="Ex: Chave PIX: seu@email.com"
                rows={3}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-2">Termos Legais Padrão</label>
              <textarea
                value={profile.default_terms}
                onChange={(e) => setProfile({ ...profile, default_terms: e.target.value })}
                placeholder="Condições de pagamento, multas, etc."
                rows={3}
              />
            </div>
          </div>
        </div>

        {/* Exchange Rates Info */}
        <div className="card p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
            Cotações de Moedas
          </h2>
          {ratesLoading ? (
            <p className="text-sm text-gray-500">Carregando cotações...</p>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                As cotações são atualizadas automaticamente e usadas para converter valores nas faturas.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {currencies.map(currency => (
                  <div key={currency} className="bg-gray-50 rounded-lg p-3 text-center">
                    <div className="text-xs text-gray-400 font-bold">1 USD =</div>
                    <div className="text-lg font-black text-gray-900">{rates[currency]?.toFixed(2)}</div>
                    <div className="text-sm font-bold text-blue-600">{currency}</div>
                  </div>
                ))}
              </div>
              {lastUpdated && (
                <p className="text-xs text-gray-400">
                  Última atualização: {new Date(lastUpdated).toLocaleString('pt-BR')}
                </p>
              )}
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? 'Salvando...' : 'Salvar Configurações'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SettingsPage;
