import { Invoice, InvoiceStatus } from '@/src/types';

const formatDate = (dateStr: string): string => {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-');
  return `${day}/${month}/${year}`;
};

const formatCurrency = (amount: number): string => {
  return amount.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

export const generateInvoiceHtml = (invoice: Invoice): string => {
  const isPaid = invoice.status === InvoiceStatus.PAID;
  const statusColor = isPaid ? '#16a34a' : '#d97706';

  // Build items HTML with table format
  const itemsHtml = invoice.items.map((item, index) => `
    <tr style="border-bottom: 1px solid #e5e7eb;">
      <td style="padding: 12px 0; vertical-align: top; font-size: 11px; color: #111827; line-height: 1.5;">
        ${item.description?.split('\n')[0] || '-'}
      </td>
      <td style="padding: 12px 16px; text-align: center; font-size: 11px; color: #111827;">
        ${item.quantity}
      </td>
      <td style="padding: 12px 16px; text-align: center; font-size: 11px; color: #111827;">
        ${item.rate}
      </td>
      <td style="padding: 12px 0; text-align: right; font-size: 11px; font-weight: 600; color: #111827;">
        ${invoice.currency} ${formatCurrency(item.total)}
      </td>
    </tr>
    ${item.description && item.description.includes('\n') ? `
    <tr>
      <td colspan="4" style="padding: 0 0 16px 0; font-size: 10px; color: #4b5563; line-height: 1.6;">
        ${item.description.split('\n').slice(1).join('<br/>')}
      </td>
    </tr>
    ` : ''}
  `).join('');

  const taxHtml = invoice.taxRate > 0 ? `
    <div style="display: flex; justify-content: flex-end; margin-bottom: 8px;">
      <span style="font-size: 10px; color: #6b7280; margin-right: 24px;">IMPOSTO (${invoice.taxRate}%):</span>
      <span style="font-size: 11px; font-weight: 500; color: #111827; min-width: 80px; text-align: right;">
        ${invoice.currency} ${formatCurrency(invoice.taxTotal)}
      </span>
    </div>
  ` : '';

  const discountHtml = invoice.discount > 0 ? `
    <div style="display: flex; justify-content: flex-end; margin-bottom: 8px;">
      <span style="font-size: 10px; color: #6b7280; margin-right: 24px;">DESCONTO:</span>
      <span style="font-size: 11px; font-weight: 500; color: #dc2626; min-width: 80px; text-align: right;">
        -${invoice.currency} ${formatCurrency(invoice.discount)}
      </span>
    </div>
  ` : '';

  const notesHtml = invoice.notes?.trim() ? `
    <div style="margin-top: 40px; padding-top: 16px; border-top: 1px solid #e5e7eb;">
      <div style="font-size: 10px; font-weight: 700; color: #111827; letter-spacing: 0.1em; margin-bottom: 8px;">
        OBSERVAÇÕES:
      </div>
      <div style="font-size: 10px; color: #4b5563; line-height: 1.6;">
        ${invoice.notes}
      </div>
    </div>
  ` : '';

  const termsHtml = invoice.terms?.trim() && !invoice.notes?.trim() ? `
    <div style="margin-top: 40px; padding-top: 16px; border-top: 1px solid #e5e7eb;">
      <div style="font-size: 10px; font-weight: 700; color: #111827; letter-spacing: 0.1em; margin-bottom: 8px;">
        TERMOS:
      </div>
      <div style="font-size: 10px; color: #4b5563; line-height: 1.6; font-style: italic;">
        ${invoice.terms}
      </div>
    </div>
  ` : '';

  const logoHtml = invoice.company.logoUrl 
    ? `<img src="${invoice.company.logoUrl}" alt="Logo" style="max-width: 120px; max-height: 60px; object-fit: contain;" />`
    : `<div style="
        width: 80px;
        height: 40px;
        background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 8px;
        color: white;
        font-size: 14px;
        font-weight: 700;
      ">Logo</div>`;

  return `
    <div style="
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background-color: #ffffff;
      color: #111827;
      padding: 32px 40px;
      max-width: 210mm;
      margin: 0 auto;
      font-size: 11px;
      line-height: 1.5;
    ">
      <!-- Header: Logo + INVOICE -->
      <div style="
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 24px;
        padding-bottom: 24px;
        border-bottom: 2px solid #111827;
      ">
        <!-- Logo -->
        <div>
          ${logoHtml}
        </div>

        <!-- Invoice Title + Number -->
        <div style="text-align: right;">
          <div style="
            font-size: 32px;
            font-weight: 900;
            color: #111827;
            letter-spacing: -0.02em;
            margin-bottom: 4px;
          ">
            INVOICE
          </div>
          <div style="font-size: 11px; color: #6b7280;">
            Nº <span style="font-weight: 600; color: #111827; margin-left: 8px;">${invoice.invoiceNumber}</span>
          </div>
        </div>
      </div>

      <!-- Two Column: DE + Dates/Status -->
      <div style="
        display: flex;
        justify-content: space-between;
        margin-bottom: 20px;
      ">
        <!-- DE (Company Info) -->
        <div style="max-width: 55%;">
          <div style="font-size: 10px; font-weight: 700; color: #111827; letter-spacing: 0.1em; margin-bottom: 6px;">
            DE:
          </div>
          <div style="font-size: 12px; font-weight: 700; color: #111827; margin-bottom: 4px;">
            ${invoice.company.name?.toUpperCase() || '-'}
          </div>
          <div style="font-size: 10px; color: #4b5563; margin-bottom: 4px; line-height: 1.4;">
            ${invoice.company.address || '-'}
          </div>
          <div style="font-size: 10px; color: #4b5563;">
            ${invoice.company.email || '-'} | ${invoice.company.phone || '-'}
          </div>
        </div>

        <!-- Dates & Status -->
        <div style="text-align: right;">
          <div style="font-size: 10px; color: #6b7280; margin-bottom: 4px;">
            <span style="font-weight: 600; letter-spacing: 0.05em;">EMISSÃO:</span> 
            <span style="color: #111827; margin-left: 8px;">${formatDate(invoice.date)}</span>
          </div>
          <div style="font-size: 10px; color: #6b7280; margin-bottom: 4px;">
            <span style="font-weight: 600; letter-spacing: 0.05em;">VENCIMENTO:</span> 
            <span style="color: #111827; margin-left: 8px;">${formatDate(invoice.dueDate)}</span>
          </div>
          <div style="font-size: 10px; color: #6b7280;">
            <span style="font-weight: 600; letter-spacing: 0.05em;">STATUS:</span> 
            <span style="color: ${statusColor}; font-weight: 600; margin-left: 8px;">${invoice.status}</span>
          </div>
        </div>
      </div>

      <!-- FATURAR PARA (Client Info) -->
      <div style="margin-bottom: 24px;">
        <div style="font-size: 10px; font-weight: 700; color: #111827; letter-spacing: 0.1em; margin-bottom: 6px;">
          FATURAR PARA:
        </div>
        <div style="font-size: 12px; font-weight: 700; color: #111827; margin-bottom: 4px;">
          ${invoice.client.name?.toUpperCase() || '-'}
        </div>
        <div style="font-size: 10px; color: #4b5563; margin-bottom: 2px; line-height: 1.4;">
          ${invoice.client.address || '-'}
        </div>
        <div style="font-size: 10px; color: #4b5563;">
          ${invoice.client.email || '-'}
        </div>
      </div>

      <!-- Items Table -->
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
        <thead>
          <tr style="border-bottom: 2px solid #111827;">
            <th style="
              text-align: left;
              padding: 8px 0;
              font-size: 10px;
              font-weight: 700;
              color: #6b7280;
              letter-spacing: 0.1em;
            ">
              DESCRIÇÃO
            </th>
            <th style="
              text-align: center;
              padding: 8px 16px;
              font-size: 10px;
              font-weight: 700;
              color: #6b7280;
              letter-spacing: 0.1em;
            ">
              QTD
            </th>
            <th style="
              text-align: center;
              padding: 8px 16px;
              font-size: 10px;
              font-weight: 700;
              color: #6b7280;
              letter-spacing: 0.1em;
            ">
              PREÇO
            </th>
            <th style="
              text-align: right;
              padding: 8px 0;
              font-size: 10px;
              font-weight: 700;
              color: #6b7280;
              letter-spacing: 0.1em;
            ">
              TOTAL
            </th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
      </table>

      <!-- Totals Section -->
      <div style="margin-bottom: 16px;">
        <div style="display: flex; justify-content: flex-end; margin-bottom: 8px;">
          <span style="font-size: 10px; font-weight: 600; color: #6b7280; letter-spacing: 0.05em; margin-right: 24px;">SUBTOTAL:</span>
          <span style="font-size: 11px; font-weight: 500; color: #111827; min-width: 80px; text-align: right;">
            ${invoice.currency} ${formatCurrency(invoice.subtotal)}
          </span>
        </div>

        ${taxHtml}
        ${discountHtml}

        <div style="
          display: flex;
          justify-content: flex-end;
          align-items: center;
          padding-top: 12px;
          border-top: 2px solid #111827;
          margin-top: 8px;
        ">
          <span style="font-size: 11px; font-weight: 700; color: #111827; letter-spacing: 0.05em; margin-right: 24px;">
            TOTAL:
          </span>
          <span style="font-size: 20px; font-weight: 900; color: #111827;">
            ${invoice.currency} ${formatCurrency(invoice.total)}
          </span>
        </div>
      </div>

      ${notesHtml}
      ${termsHtml}
    </div>
  `;
};
