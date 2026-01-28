
import React, { useState, useEffect } from 'react';
import { Invoice, InvoiceStatus, InvoiceItem } from './types';
import Dashboard from './components/Dashboard';
import InvoiceEditor from './components/InvoiceEditor';
import Header from './components/Header';

const STORAGE_KEY = 'proinvoice_data_v2'; // Bump version for potential type changes

const App: React.FC = () => {
  const [view, setView] = useState<'list' | 'create' | 'edit'>('list');
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setInvoices(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load invoices", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(invoices));
  }, [invoices]);

  const handleCreateNew = () => {
    setSelectedInvoice(null);
    setView('create');
  };

  const handleEdit = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setView('edit');
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta fatura permanentemente?')) {
      setInvoices(invoices.filter(inv => inv.id !== id));
    }
  };

  const handleSave = (invoice: Invoice) => {
    if (selectedInvoice || invoices.some(inv => inv.id === invoice.id)) {
      setInvoices(invoices.map(inv => inv.id === invoice.id ? invoice : inv));
    } else {
      setInvoices([invoice, ...invoices]);
    }
    setView('list');
  };

  return (
    <div className="min-h-screen flex flex-col antialiased">
      <Header onLogoClick={() => setView('list')} />
      <main className="flex-grow container mx-auto px-6 py-12">
        {view === 'list' ? (
          <Dashboard 
            invoices={invoices} 
            onCreateNew={handleCreateNew} 
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ) : (
          <InvoiceEditor 
            initialInvoice={selectedInvoice} 
            onSave={handleSave} 
            onCancel={() => setView('list')} 
          />
        )}
      </main>
      <footer className="no-print bg-white border-t border-gray-100 py-10 text-center">
        <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.3em]">
          &copy; {new Date().getFullYear()} ProInvoice System &bull; Sistema de Cobrança Profissional
        </p>
      </footer>
    </div>
  );
};

export default App;
