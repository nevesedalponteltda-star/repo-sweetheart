import React, { useState, useEffect } from 'react';
import { supabase } from '@/src/integrations/supabase/client';

interface ProfileData {
  company_name: string;
  company_email: string;
  company_phone: string;
  company_address: string;
  company_website: string;
  company_tax_id: string;
  default_currency: string;
  default_tax_rate: number;
  default_notes: string;
  default_terms: string;
}

const SettingsPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [profile, setProfile] = useState<ProfileData>({
    company_name: '',
    company_email: '',
    company_phone: '',
    company_address: '',
    company_website: '',
    company_tax_id: '',
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

        <div className="card p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Padrões para Faturas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Moeda Padrão</label>
              <select
                value={profile.default_currency}
                onChange={(e) => setProfile({ ...profile, default_currency: e.target.value })}
              >
                <option value="USD">USD - Dólar</option>
                <option value="BRL">BRL - Real</option>
                <option value="EUR">EUR - Euro</option>
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
              <label className="block text-sm font-bold text-gray-700 mb-2">Termos Padrão</label>
              <textarea
                value={profile.default_terms}
                onChange={(e) => setProfile({ ...profile, default_terms: e.target.value })}
                placeholder="Condições de pagamento, multas, etc."
                rows={3}
              />
            </div>
          </div>
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
