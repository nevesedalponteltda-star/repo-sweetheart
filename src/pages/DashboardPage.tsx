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

  const getStatusColor = (status: string) => {
    switch (status) {
      case InvoiceStatus.PAID:
        return 'bg-green-100 text-green-800';
      case InvoiceStatus.SENT:
        return 'bg-blue-100 text-blue-800';
      case InvoiceStatus.OVERDUE:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Suas Faturas</h1>
          <p className="text-gray-500">Acompanhe seus pagamentos e envie cobranças profissionais</p>
        </div>
        <Link to="/invoice/new" className="btn-primary">
          Criar Nova Fatura
        </Link>
      </div>

      {invoices.length === 0 ? (
        <div className="card p-16 text-center">
          <div className="mx-auto w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6">
            <svg
              className="w-10 h-10 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900">Comece seu faturamento</h3>
          <p className="text-gray-500 mt-2 max-w-sm mx-auto">
            Crie faturas personalizadas com sua logo e receba pagamentos com profissionalismo.
          </p>
          <Link to="/invoice/new" className="mt-8 inline-block text-blue-600 font-bold hover:text-blue-800">
            + Adicionar Minha Primeira Fatura
          </Link>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-400 text-xs uppercase tracking-widest border-b border-gray-100">
                <tr>
                  <th className="px-6 py-5 font-bold">Número</th>
                  <th className="px-6 py-5 font-bold">Cliente</th>
                  <th className="px-6 py-5 font-bold text-center">Data</th>
                  <th className="px-6 py-5 font-bold text-right">Valor</th>
                  <th className="px-6 py-5 font-bold text-center">Status</th>
                  <th className="px-6 py-5 font-bold text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {invoices.map((invoice) => (
                  <tr
                    key={invoice.id}
                    className="hover:bg-gray-50 transition-colors cursor-pointer group"
                    onClick={() => navigate(`/invoice/${invoice.id}`)}
                  >
                    <td className="px-6 py-4">
                      <span className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                        #{invoice.invoice_number}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-800">{invoice.client_name || 'Sem nome'}</div>
                      <div className="text-xs text-gray-400">{invoice.client_email}</div>
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-sm text-center">
                      {new Date(invoice.date).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-900 text-right">
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: invoice.currency || 'USD',
                      }).format(invoice.total)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(
                          invoice.status
                        )}`}
                      >
                        {invoice.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-4" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => navigate(`/invoice/${invoice.id}`)}
                        className="text-blue-600 hover:text-blue-800 font-bold text-sm"
                      >
                        Editar
                      </button>
                      <button
                        onClick={(e) => handleDelete(invoice.id, e)}
                        className="text-red-600 hover:text-red-800 font-bold text-sm"
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
