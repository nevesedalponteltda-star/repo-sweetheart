
import React, { useState, useEffect, useRef } from 'react';
import { Invoice, InvoiceItem, InvoiceStatus, CompanyInfo, ClientInfo } from '../types';
import { GoogleGenAI } from "@google/genai";

interface InvoiceEditorProps {
  initialInvoice: Invoice | null;
  onSave: (invoice: Invoice) => void;
  onCancel: () => void;
}

// Helper component for auto-expanding textarea
const AutoResizeTextarea: React.FC<{
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  className?: string;
  rows?: number;
}> = ({ value, onChange, placeholder, className, rows = 1 }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  useEffect(() => {
    adjustHeight();
  }, [value]);

  return (
    <textarea
      ref={textareaRef}
      rows={rows}
      className={`textarea-print-full ${className}`}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onInput={adjustHeight}
    />
  );
};

const InvoiceEditor: React.FC<InvoiceEditorProps> = ({ initialInvoice, onSave, onCancel }) => {
  const [invoice, setInvoice] = useState<Invoice>(initialInvoice || {
    id: crypto.randomUUID(),
    invoiceNumber: `${Math.floor(Math.random() * 1000000000).toString().padStart(10, '0')}`,
    date: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: InvoiceStatus.PAID,
    company: {
      name: '',
      email: '',
      address: '',
      phone: '',
      web: '',
      logoUrl: ''
    },
    client: {
      name: '',
      email: '',
      address: '',
      phone: ''
    },
    items: [{ id: crypto.randomUUID(), description: '', quantity: 1, rate: 0, total: 0 }],
    subtotal: 0,
    taxRate: 0,
    taxTotal: 0,
    discount: 0,
    total: 0,
    notes: '',
    terms: '',
    currency: 'USD'
  });

  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    calculateTotals();
  }, [invoice.items, invoice.taxRate, invoice.discount]);

  const calculateTotals = () => {
    const subtotal = invoice.items.reduce((acc, item) => acc + (item.quantity * item.rate), 0);
    const taxTotal = subtotal * (invoice.taxRate / 100);
    const total = subtotal + taxTotal - invoice.discount;
    setInvoice(prev => ({ ...prev, subtotal, taxTotal, total }));
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    }).format(value);
  };

  const handleAddItem = () => {
    const newItem: InvoiceItem = {
      id: crypto.randomUUID(),
      description: '',
      quantity: 1,
      rate: 0,
      total: 0
    };
    setInvoice({ ...invoice, items: [...invoice.items, newItem] });
  };

  const handleRemoveItem = (id: string) => {
    if (invoice.items.length === 1) return;
    setInvoice({ ...invoice, items: invoice.items.filter(i => i.id !== id) });
  };

  const handleItemChange = (id: string, field: keyof InvoiceItem, value: any) => {
    const updatedItems = invoice.items.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        updatedItem.total = updatedItem.quantity * updatedItem.rate;
        return updatedItem;
      }
      return item;
    });
    setInvoice({ ...invoice, items: updatedItems });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setInvoice({ ...invoice, company: { ...invoice.company, logoUrl: reader.result as string } });
      };
      reader.readAsDataURL(file);
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-24">
      {/* Navbar de Ações */}
      <div className="no-print flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-2xl border border-gray-200 shadow-sm sticky top-20 z-40">
        <button onClick={onCancel} className="text-gray-600 hover:text-gray-900 font-bold flex items-center gap-2 transition-colors">
           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
           Voltar ao Painel
        </button>
        <div className="flex gap-4">
          <button 
            onClick={() => window.print()}
            className="px-6 py-2.5 border-2 border-blue-600 text-blue-600 rounded-full hover:bg-blue-50 transition-all font-bold flex items-center gap-2"
          >
            Imprimir / PDF
          </button>
          <button 
            onClick={() => onSave(invoice)}
            className="px-8 py-2.5 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all font-bold shadow-lg shadow-blue-200 active:scale-95"
          >
            Salvar Fatura
          </button>
        </div>
      </div>

      {/* Documento Invoice - Design Minimalista Profissional */}
      <div className="invoice-card bg-white shadow-2xl border border-gray-100 min-h-[1100px] overflow-visible p-16 print:p-0 print:border-none print:shadow-none print:m-0">
        
        {/* Topo: Logo e Título */}
        <div className="flex justify-between items-start mb-16">
          <div className="relative group w-36 h-36 bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center cursor-pointer hover:border-blue-400 transition-all print:border-none print:bg-transparent">
            {invoice.company.logoUrl ? (
              <img src={invoice.company.logoUrl} alt="Logo" className="w-full h-full object-contain" />
            ) : (
              <div className="text-center no-print">
                <span className="text-gray-400 text-xs font-bold">Logo Empresa</span>
              </div>
            )}
            <input type="file" className="absolute inset-0 opacity-0 cursor-pointer no-print" onChange={handleLogoUpload} accept="image/*" />
          </div>
          
          <div className="text-right">
            <h1 className="text-6xl font-black text-gray-900 tracking-tighter uppercase mb-2">INVOICE</h1>
            <div className="flex flex-col items-end">
               <span className="text-gray-400 text-sm font-black tracking-widest uppercase">Número</span>
               <input 
                  className="input-ghost text-2xl font-bold text-gray-800 text-right w-48"
                  value={invoice.invoiceNumber}
                  onChange={e => setInvoice({...invoice, invoiceNumber: e.target.value})}
                  placeholder="00000000"
               />
            </div>
          </div>
        </div>

        <div className="border-t-2 border-gray-900 mb-12"></div>

        {/* Informações: DE / PARA / Metadados */}
        <div className="grid grid-cols-12 gap-12 mb-16">
          <div className="col-span-7 space-y-10">
            {/* Seção DE */}
            <div className="space-y-2">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-4">DE:</p>
              <input 
                className="input-ghost text-2xl font-black text-gray-900 uppercase tracking-tight placeholder-gray-200"
                placeholder="NOME DA SUA EMPRESA"
                value={invoice.company.name}
                onChange={e => setInvoice({...invoice, company: {...invoice.company, name: e.target.value}})}
              />
              <AutoResizeTextarea 
                className="input-ghost text-sm text-gray-500 leading-relaxed placeholder-gray-200"
                placeholder="Endereço Completo da Empresa"
                value={invoice.company.address}
                onChange={val => setInvoice({...invoice, company: {...invoice.company, address: val}})}
              />
              <div className="grid grid-cols-2 gap-x-4 pt-2 text-sm text-gray-500 font-medium">
                <div className="flex gap-2">
                   <span className="text-gray-400 font-bold uppercase text-[10px] self-center">Tel:</span>
                   <input className="input-ghost p-0" placeholder="Seu Telefone" value={invoice.company.phone} onChange={e => setInvoice({...invoice, company: {...invoice.company, phone: e.target.value}})} />
                </div>
                <div className="flex gap-2">
                   <span className="text-gray-400 font-bold uppercase text-[10px] self-center">Email:</span>
                   <input className="input-ghost p-0" placeholder="Seu E-mail" value={invoice.company.email} onChange={e => setInvoice({...invoice, company: {...invoice.company, email: e.target.value}})} />
                </div>
                <div className="flex gap-2 col-span-2 mt-1">
                   <span className="text-gray-400 font-bold uppercase text-[10px] self-center">Web:</span>
                   <input className="input-ghost p-0" placeholder="www.suaempresa.com.br" value={invoice.company.web} onChange={e => setInvoice({...invoice, company: {...invoice.company, web: e.target.value}})} />
                </div>
              </div>
            </div>

            {/* Seção FATURAR PARA */}
            <div className="space-y-2 pt-4">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-4">FATURAR PARA:</p>
              <input 
                className="input-ghost text-2xl font-black text-gray-900 uppercase tracking-tight placeholder-gray-200"
                placeholder="NOME DO CLIENTE"
                value={invoice.client.name}
                onChange={e => setInvoice({...invoice, client: {...invoice.client, name: e.target.value}})}
              />
              <AutoResizeTextarea 
                className="input-ghost text-lg text-gray-500 leading-tight placeholder-gray-200"
                placeholder="Empresa do Cliente"
                value={invoice.client.address}
                onChange={val => setInvoice({...invoice, client: {...invoice.client, address: val}})}
              />
              <input 
                className="input-ghost text-sm text-gray-400 mt-1 placeholder-gray-200"
                placeholder="email@cliente.com"
                value={invoice.client.email}
                onChange={e => setInvoice({...invoice, client: {...invoice.client, email: e.target.value}})}
              />
            </div>
          </div>

          {/* Coluna Direita: Datas e Status */}
          <div className="col-span-5 flex flex-col items-end space-y-6">
            <div className="w-full space-y-4 pt-10">
               <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Emissão:</span>
                  <div className="flex items-center gap-2 group relative">
                     <span className="font-bold text-gray-700 print:block hidden">{formatDate(invoice.date)}</span>
                     <input type="date" className="no-print font-bold text-gray-700 text-right w-40 p-0 border-none bg-transparent" value={invoice.date} onChange={e => setInvoice({...invoice, date: e.target.value})} />
                     <span className="no-print print:hidden absolute right-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">✏️</span>
                  </div>
               </div>
               <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Vencimento:</span>
                  <div className="flex items-center gap-2 group relative">
                     <span className="font-bold text-gray-700 print:block hidden">{formatDate(invoice.dueDate)}</span>
                     <input type="date" className="no-print font-bold text-gray-700 text-right w-40 p-0 border-none bg-transparent" value={invoice.dueDate} onChange={e => setInvoice({...invoice, dueDate: e.target.value})} />
                     <span className="no-print print:hidden absolute right-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity text-red-500 font-black">📅</span>
                  </div>
               </div>
               <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Status:</span>
                  <select 
                    className="input-ghost p-0 text-right appearance-none font-bold text-blue-600 w-32"
                    value={invoice.status}
                    onChange={e => setInvoice({...invoice, status: e.target.value as InvoiceStatus})}
                  >
                    {Object.values(InvoiceStatus).map(s => (
                      <option key={s} value={s}>{s.toUpperCase()}</option>
                    ))}
                  </select>
               </div>
               <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Moeda:</span>
                  <input 
                    className="input-ghost p-0 text-right w-24 font-bold text-gray-700" 
                    value={invoice.currency} 
                    onChange={e => setInvoice({...invoice, currency: e.target.value})} 
                  />
               </div>
            </div>
          </div>
        </div>

        {/* Tabela de Itens - Alta Visibilidade no Print */}
        <div className="mb-12">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#1f2937] text-white print-table-header">
                <th className="py-5 px-6 text-left text-[10px] font-black uppercase tracking-[0.2em] w-[65%]">DESCRIÇÃO</th>
                <th className="py-5 px-2 text-center text-[10px] font-black uppercase tracking-[0.2em]">QTD</th>
                <th className="py-5 px-4 text-right text-[10px] font-black uppercase tracking-[0.2em]">PREÇO UNIT.</th>
                <th className="py-5 px-6 text-right text-[10px] font-black uppercase tracking-[0.2em]">TOTAL</th>
                <th className="no-print w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 border-b-2 border-gray-900">
              {invoice.items.map((item) => (
                <tr key={item.id} className="group align-top">
                  <td className="py-8 px-6">
                    <AutoResizeTextarea 
                      className="input-ghost w-full font-medium text-gray-600 leading-relaxed placeholder-gray-200"
                      placeholder="Descrição detalhada do serviço realizado..."
                      value={item.description}
                      onChange={val => handleItemChange(item.id, 'description', val)}
                      rows={3}
                    />
                  </td>
                  <td className="py-8 px-2 text-center">
                    <input 
                      type="number"
                      className="input-ghost w-12 text-center font-bold text-gray-700"
                      value={item.quantity}
                      onChange={e => handleItemChange(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                    />
                  </td>
                  <td className="py-8 px-4 text-right">
                    <div className="inline-flex items-center gap-1 text-gray-500 font-bold">
                      <span className="text-[10px] uppercase">{invoice.currency}</span>
                      <input 
                        type="number"
                        className="input-ghost w-28 text-right font-black"
                        value={item.rate}
                        onChange={e => handleItemChange(item.id, 'rate', parseFloat(e.target.value) || 0)}
                      />
                    </div>
                  </td>
                  <td className="py-8 px-6 text-right font-black text-gray-900 text-lg">
                    {invoice.currency} {formatCurrency(item.total)}
                  </td>
                  <td className="py-8 no-print text-right">
                    <button 
                      onClick={() => handleRemoveItem(item.id)}
                      className="text-red-300 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-all p-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          <button 
            onClick={handleAddItem}
            className="no-print mt-6 flex items-center gap-2 text-blue-600 font-black text-xs uppercase tracking-[0.2em] hover:text-blue-800 transition-colors"
          >
            <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white">
               <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4"></path></svg>
            </div>
            Adicionar Item
          </button>
        </div>

        {/* Resumo Financeiro */}
        <div className="flex flex-col items-end pt-12 space-y-4">
          <div className="w-full max-w-md space-y-4">
            <div className="flex justify-between items-center text-sm font-bold text-gray-500 border-b border-gray-50 pb-4">
              <span className="uppercase tracking-widest text-[10px]">Subtotal:</span>
              <span className="font-black text-gray-800">{invoice.currency} {formatCurrency(invoice.subtotal)}</span>
            </div>
            
            <div className="flex justify-between items-center pt-4">
              <span className="text-xl font-black text-gray-900 tracking-tighter uppercase">TOTAL:</span>
              <div className="text-right border-b-8 border-double border-gray-900 pb-2">
                <span className="text-4xl font-black text-gray-900 tracking-tighter">
                   {invoice.currency} {formatCurrency(invoice.total)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Rodapé Dinâmico */}
        {(invoice.notes || invoice.terms) && (
          <div className="mt-32 pt-10 border-t border-gray-100 space-y-8">
             {invoice.notes && (
               <div className="space-y-2">
                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Observações:</p>
                 <p className="text-sm text-gray-600 whitespace-pre-wrap leading-relaxed">{invoice.notes}</p>
               </div>
             )}
             {invoice.terms && (
               <div className="space-y-2">
                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Termos e Condições:</p>
                 <p className="text-[11px] text-gray-400 italic whitespace-pre-wrap leading-tight">{invoice.terms}</p>
               </div>
             )}
          </div>
        )}
      </div>

      {/* Painel de Controle Adicional (Somente Tela) */}
      <div className="no-print max-w-5xl mx-auto bg-white rounded-2xl border border-gray-200 p-10 shadow-lg">
        <h3 className="text-xl font-black text-gray-900 mb-8 flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
          </div>
          Configurações da Fatura
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
           <div className="space-y-3">
             <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Imposto (%)</label>
             <input type="number" className="font-bold" value={invoice.taxRate} onChange={e => setInvoice({...invoice, taxRate: parseFloat(e.target.value) || 0})} />
           </div>
           <div className="space-y-3">
             <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Desconto Fixo</label>
             <input type="number" className="font-bold" value={invoice.discount} onChange={e => setInvoice({...invoice, discount: parseFloat(e.target.value) || 0})} />
           </div>
           <div className="space-y-3">
             <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Moeda Local</label>
             <input type="text" className="font-bold uppercase" value={invoice.currency} onChange={e => setInvoice({...invoice, currency: e.target.value.toUpperCase()})} />
           </div>
        </div>
        <div className="mt-10 space-y-6">
           <div className="space-y-3">
             <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Notas para o Cliente</label>
             <textarea className="h-24 font-medium" placeholder="Ex: Chave PIX: seu@email.com" value={invoice.notes} onChange={e => setInvoice({...invoice, notes: e.target.value})} />
           </div>
           <div className="space-y-3">
             <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Termos Legais</label>
             <textarea className="h-24 text-gray-400 font-medium italic" placeholder="Contrato, multas por atraso, etc..." value={invoice.terms} onChange={e => setInvoice({...invoice, terms: e.target.value})} />
           </div>
        </div>
        
        <div className="mt-12 flex justify-end">
           <button 
              onClick={() => onSave(invoice)}
              className="px-12 py-4 bg-gray-900 text-white rounded-2xl font-black text-lg hover:bg-black transition-all shadow-xl active:scale-95"
            >
              FINALIZAR E GUARDAR
            </button>
        </div>
      </div>
    </div>
  );
};

export default InvoiceEditor;
