import React from 'react';
import { Invoice } from '@/src/types';

interface InvoicePrintLayoutProps {
  invoice: Invoice;
  formatCurrency: (amount: number) => string;
}

const InvoicePrintLayout: React.FC<InvoicePrintLayoutProps> = ({ invoice, formatCurrency }) => {
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  };

  const getStatusBadge = (status: string) => {
    const isPaid = status === 'Paga' || status === 'paid';
    return {
      backgroundColor: isPaid ? '#dcfce7' : '#fef3c7',
      color: isPaid ? '#16a34a' : '#d97706',
      borderColor: isPaid ? '#bbf7d0' : '#fde68a',
    };
  };

  const statusBadge = getStatusBadge(invoice.status);

  return (
    <div style={{
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
      backgroundColor: '#ffffff',
      color: '#111827',
      padding: '24px',
      maxWidth: '210mm',
      margin: '0 auto',
      fontSize: '11px',
      lineHeight: 1.5,
    }}>
      {/* Header: Logo + INVOICE */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '16px',
        paddingBottom: '16px',
        borderBottom: '2px solid #111827',
      }}>
        {/* Logo */}
        <div style={{ width: '100px', height: '100px' }}>
          {invoice.company.logoUrl ? (
            <img 
              src={invoice.company.logoUrl} 
              alt="Logo" 
              style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'contain' 
              }} 
            />
          ) : (
            <div style={{
              width: '100%',
              height: '100%',
              backgroundColor: '#f3f4f6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '8px',
              color: '#9ca3af',
              fontSize: '12px',
            }}>
              Logo
            </div>
          )}
        </div>

        {/* Invoice Title + Number */}
        <div style={{ textAlign: 'right' }}>
          <h1 style={{
            fontSize: '36px',
            fontWeight: 900,
            color: '#111827',
            letterSpacing: '-0.02em',
            margin: 0,
            marginBottom: '4px',
          }}>
            INVOICE
          </h1>
          <div style={{ fontSize: '12px', color: '#6b7280' }}>
            <span>Nº </span>
            <span style={{ fontWeight: 700, color: '#111827' }}>{invoice.invoiceNumber}</span>
          </div>
        </div>
      </div>

      {/* Datas & Status Card */}
      <div style={{
        backgroundColor: '#f9fafb',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        padding: '12px 16px',
        marginBottom: '16px',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          marginBottom: '8px',
          fontSize: '10px',
          fontWeight: 800,
          color: '#6b7280',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }}>
          📅 DATAS & STATUS
        </div>
        <div style={{
          display: 'flex',
          gap: '24px',
          alignItems: 'center',
        }}>
          <div>
            <div style={{ fontSize: '9px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', marginBottom: '2px' }}>
              EMISSÃO
            </div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: '#111827' }}>
              {formatDate(invoice.date)}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '9px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', marginBottom: '2px' }}>
              VENCIMENTO
            </div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: '#111827' }}>
              {formatDate(invoice.dueDate)}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '9px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', marginBottom: '2px' }}>
              STATUS
            </div>
            <span style={{
              display: 'inline-block',
              padding: '2px 10px',
              borderRadius: '9999px',
              fontSize: '10px',
              fontWeight: 700,
              backgroundColor: statusBadge.backgroundColor,
              color: statusBadge.color,
              border: `1px solid ${statusBadge.borderColor}`,
            }}>
              {invoice.status}
            </span>
          </div>
        </div>
      </div>

      {/* Two Column: DE + PARA */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '16px',
        marginBottom: '20px',
      }}>
        {/* SUA EMPRESA (DE) */}
        <div style={{
          backgroundColor: '#f9fafb',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          padding: '12px 16px',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            marginBottom: '10px',
            fontSize: '10px',
            fontWeight: 800,
            color: '#6b7280',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}>
            🏢 SUA EMPRESA (DE)
          </div>
          
          <div style={{ marginBottom: '8px' }}>
            <div style={{ fontSize: '9px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', marginBottom: '2px' }}>
              NOME DA EMPRESA
            </div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#111827' }}>
              {invoice.company.name || '-'}
            </div>
          </div>
          
          <div style={{ marginBottom: '8px' }}>
            <div style={{ fontSize: '9px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', marginBottom: '2px' }}>
              ENDEREÇO COMPLETO
            </div>
            <div style={{ fontSize: '11px', color: '#374151', whiteSpace: 'pre-wrap', lineHeight: 1.4 }}>
              {invoice.company.address || '-'}
            </div>
          </div>
          
          <div style={{ marginBottom: '8px' }}>
            <div style={{ fontSize: '9px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', marginBottom: '2px' }}>
              EMAIL
            </div>
            <div style={{ fontSize: '11px', color: '#374151', textDecoration: 'underline' }}>
              {invoice.company.email || '-'}
            </div>
          </div>
          
          <div>
            <div style={{ fontSize: '9px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', marginBottom: '2px' }}>
              TELEFONE
            </div>
            <div style={{ fontSize: '11px', color: '#374151' }}>
              {invoice.company.phone || '-'}
            </div>
          </div>
        </div>

        {/* CLIENTE (PARA) */}
        <div style={{
          backgroundColor: '#f9fafb',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          padding: '12px 16px',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            marginBottom: '10px',
            fontSize: '10px',
            fontWeight: 800,
            color: '#6b7280',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}>
            👤 CLIENTE (PARA)
          </div>
          
          <div style={{ marginBottom: '8px' }}>
            <div style={{ fontSize: '9px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', marginBottom: '2px' }}>
              NOME DO CLIENTE
            </div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#111827' }}>
              {invoice.client.name || '-'}
            </div>
          </div>
          
          <div style={{ marginBottom: '8px' }}>
            <div style={{ fontSize: '9px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', marginBottom: '2px' }}>
              ENDEREÇO DO CLIENTE
            </div>
            <div style={{ fontSize: '11px', color: '#374151', whiteSpace: 'pre-wrap', lineHeight: 1.4 }}>
              {invoice.client.address || '-'}
            </div>
          </div>
          
          <div style={{ marginBottom: '8px' }}>
            <div style={{ fontSize: '9px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', marginBottom: '2px' }}>
              EMAIL DO CLIENTE
            </div>
            <div style={{ fontSize: '11px', color: '#374151', textDecoration: 'underline' }}>
              {invoice.client.email || '-'}
            </div>
          </div>
          
          <div>
            <div style={{ fontSize: '9px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', marginBottom: '2px' }}>
              TELEFONE DO CLIENTE
            </div>
            <div style={{ fontSize: '11px', color: '#374151' }}>
              {invoice.client.phone || '-'}
            </div>
          </div>
        </div>
      </div>

      {/* ITENS DA FATURA */}
      <div style={{
        marginBottom: '16px',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          marginBottom: '10px',
          fontSize: '10px',
          fontWeight: 800,
          color: '#6b7280',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }}>
          📦 ITENS DA FATURA
        </div>

        {invoice.items.map((item, index) => (
          <div
            key={item.id}
            style={{
              backgroundColor: '#f9fafb',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              padding: '12px 16px',
              marginBottom: '8px',
            }}
          >
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '8px',
            }}>
              <span style={{
                fontSize: '9px',
                fontWeight: 700,
                color: '#9ca3af',
                textTransform: 'uppercase',
              }}>
                ITEM {index + 1}
              </span>
            </div>

            <div style={{ marginBottom: '8px' }}>
              <div style={{ fontSize: '9px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', marginBottom: '2px' }}>
                DESCRIÇÃO
              </div>
              <div style={{ fontSize: '11px', color: '#374151', whiteSpace: 'pre-wrap', lineHeight: 1.4 }}>
                {item.description || '-'}
              </div>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px',
              marginBottom: '8px',
            }}>
              <div>
                <div style={{ fontSize: '9px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', marginBottom: '2px' }}>
                  QUANTIDADE
                </div>
                <div style={{ fontSize: '12px', fontWeight: 600, color: '#111827' }}>
                  {item.quantity}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '9px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', marginBottom: '2px' }}>
                  PREÇO UNIT.
                </div>
                <div style={{ fontSize: '12px', fontWeight: 600, color: '#111827' }}>
                  {invoice.currency} {formatCurrency(item.rate)}
                </div>
              </div>
            </div>

            <div style={{
              textAlign: 'right',
              paddingTop: '8px',
              borderTop: '1px solid #e5e7eb',
            }}>
              <span style={{ fontSize: '13px', fontWeight: 800, color: '#111827' }}>
                Total: {invoice.currency} {formatCurrency(item.total)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Totals Section */}
      <div style={{
        display: 'flex',
        justifyContent: 'flex-end',
        marginBottom: '16px',
      }}>
        <div style={{ width: '220px' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '6px 0',
            borderBottom: '1px solid #e5e7eb',
          }}>
            <span style={{ fontSize: '10px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase' }}>
              SUBTOTAL:
            </span>
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#374151' }}>
              {invoice.currency} {formatCurrency(invoice.subtotal)}
            </span>
          </div>

          {invoice.taxRate > 0 && (
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '6px 0',
              borderBottom: '1px solid #e5e7eb',
            }}>
              <span style={{ fontSize: '10px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase' }}>
                IMPOSTO ({invoice.taxRate}%):
              </span>
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#374151' }}>
                {invoice.currency} {formatCurrency(invoice.taxTotal)}
              </span>
            </div>
          )}

          {invoice.discount > 0 && (
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '6px 0',
              borderBottom: '1px solid #e5e7eb',
            }}>
              <span style={{ fontSize: '10px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase' }}>
                DESCONTO:
              </span>
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#dc2626' }}>
                -{invoice.currency} {formatCurrency(invoice.discount)}
              </span>
            </div>
          )}

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '10px 0',
            borderTop: '3px double #111827',
            marginTop: '4px',
          }}>
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#111827', textTransform: 'uppercase' }}>
              TOTAL:
            </span>
            <span style={{ fontSize: '18px', fontWeight: 900, color: '#111827' }}>
              {invoice.currency} {formatCurrency(invoice.total)}
            </span>
          </div>
        </div>
      </div>

      {/* Observações */}
      {invoice.notes?.trim() && (
        <div style={{
          paddingTop: '12px',
          borderTop: '1px solid #e5e7eb',
        }}>
          <div style={{
            fontSize: '10px',
            fontWeight: 800,
            color: '#6b7280',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: '4px',
          }}>
            OBSERVAÇÕES:
          </div>
          <div style={{
            fontSize: '11px',
            color: '#374151',
            whiteSpace: 'pre-wrap',
            lineHeight: 1.5,
          }}>
            {invoice.notes}
          </div>
        </div>
      )}

      {/* Termos */}
      {invoice.terms?.trim() && (
        <div style={{
          paddingTop: '8px',
          marginTop: '8px',
        }}>
          <div style={{
            fontSize: '10px',
            fontWeight: 800,
            color: '#6b7280',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: '4px',
          }}>
            TERMOS:
          </div>
          <div style={{
            fontSize: '10px',
            color: '#9ca3af',
            fontStyle: 'italic',
            whiteSpace: 'pre-wrap',
            lineHeight: 1.5,
          }}>
            {invoice.terms}
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoicePrintLayout;
