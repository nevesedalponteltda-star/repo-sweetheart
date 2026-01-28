
import React from 'react';
import { Invoice, InvoiceStatus } from '../types';

interface DashboardProps {
  invoices: Invoice[];
  onCreateNew: () => void;
  onEdit: (invoice: Invoice) => void;
  onDelete: (id: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ invoices, onCreateNew, onEdit, onDelete }) => {
  const getStatusColor = (status: InvoiceStatus) => {
    switch (status) {
      case InvoiceStatus.PAID: return 'bg-green-100 text-green-800';
      case InvoiceStatus.SENT: return 'bg-blue-100 text-blue-800';
      case InvoiceStatus.OVERDUE: return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Suas Faturas</h1>
          <p className="text-gray-500">Acompanhe seus pagamentos e envie cobranças profissionais</p>
        </div>
        <button 
          onClick={onCreateNew}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-bold transition-all shadow-lg shadow-blue-200 active:scale-95"
        >
          Criar Nova Fatura
        </button>
      </div>

      {invoices.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-2xl p-16 text-center shadow-sm">
          <div className="mx-auto w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6">
             <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900">Comece seu faturamento</h3>
          <p className="text-gray-500 mt-2 max-w-sm mx-auto">Crie faturas personalizadas com sua logo e receba pagamentos com profissionalismo.</p>
          <button 
            onClick={onCreateNew}
            className="mt-8 text-blue-600 font-bold hover:text-blue-800 transition-colors"
          >
            + Adicionar Minha Primeira Fatura
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
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
                  <tr key={invoice.id} className="hover:bg-gray-50 transition-colors cursor-pointer group" onClick={() => onEdit(invoice)}>
                    <td className="px-6 py-4">
                      <span className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">#{invoice.invoiceNumber}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-800">{invoice.client.name || 'Sem nome'}</div>
                      <div className="text-xs text-gray-400">{invoice.client.email}</div>
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-sm text-center">
                      {new Date(invoice.date).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-900 text-right">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: invoice.currency }).format(invoice.total)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(invoice.status)}`}>
                        {invoice.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-4" onClick={e => e.stopPropagation()}>
                      <button onClick={() => onEdit(invoice)} className="text-blue-600 hover:text-blue-800 font-bold text-sm">Editar</button>
                      <button onClick={() => onDelete(invoice.id)} className="text-red-600 hover:text-red-800 font-bold text-sm">Excluir</button>
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

export default Dashboard;
