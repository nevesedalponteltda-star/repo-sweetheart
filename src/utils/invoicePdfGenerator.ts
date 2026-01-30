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
  const statusBgColor = isPaid ? '#dcfce7' : '#fef3c7';
  const statusTextColor = isPaid ? '#16a34a' : '#d97706';
  const statusBorderColor = isPaid ? '#bbf7d0' : '#fde68a';

  const itemsHtml = invoice.items.map((item, index) => `
    <div style="
      background-color: #f9fafb;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      padding: 12px 16px;
      margin-bottom: 8px;
    ">
      <div style="
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 8px;
      ">
        <span style="
          font-size: 9px;
          font-weight: 700;
          color: #9ca3af;
          text-transform: uppercase;
        ">
          ITEM ${index + 1}
        </span>
      </div>

      <div style="margin-bottom: 8px;">
        <div style="font-size: 9px; font-weight: 700; color: #9ca3af; text-transform: uppercase; margin-bottom: 2px;">
          DESCRIÇÃO
        </div>
        <div style="font-size: 11px; color: #374151; white-space: pre-wrap; line-height: 1.4;">
          ${item.description || '-'}
        </div>
      </div>

      <div style="
        display: flex;
        gap: 24px;
        margin-bottom: 8px;
      ">
        <div style="flex: 1;">
          <div style="font-size: 9px; font-weight: 700; color: #9ca3af; text-transform: uppercase; margin-bottom: 2px;">
            QUANTIDADE
          </div>
          <div style="font-size: 12px; font-weight: 600; color: #111827;">
            ${item.quantity}
          </div>
        </div>
        <div style="flex: 1;">
          <div style="font-size: 9px; font-weight: 700; color: #9ca3af; text-transform: uppercase; margin-bottom: 2px;">
            PREÇO UNIT.
          </div>
          <div style="font-size: 12px; font-weight: 600; color: #111827;">
            ${invoice.currency} ${formatCurrency(item.rate)}
          </div>
        </div>
      </div>

      <div style="
        text-align: right;
        padding-top: 8px;
        border-top: 1px solid #e5e7eb;
      ">
        <span style="font-size: 13px; font-weight: 800; color: #111827;">
          Total: ${invoice.currency} ${formatCurrency(item.total)}
        </span>
      </div>
    </div>
  `).join('');

  const taxHtml = invoice.taxRate > 0 ? `
    <div style="
      display: flex;
      justify-content: space-between;
      padding: 6px 0;
      border-bottom: 1px solid #e5e7eb;
    ">
      <span style="font-size: 10px; font-weight: 700; color: #9ca3af; text-transform: uppercase;">
        IMPOSTO (${invoice.taxRate}%):
      </span>
      <span style="font-size: 12px; font-weight: 600; color: #374151;">
        ${invoice.currency} ${formatCurrency(invoice.taxTotal)}
      </span>
    </div>
  ` : '';

  const discountHtml = invoice.discount > 0 ? `
    <div style="
      display: flex;
      justify-content: space-between;
      padding: 6px 0;
      border-bottom: 1px solid #e5e7eb;
    ">
      <span style="font-size: 10px; font-weight: 700; color: #9ca3af; text-transform: uppercase;">
        DESCONTO:
      </span>
      <span style="font-size: 12px; font-weight: 600; color: #dc2626;">
        -${invoice.currency} ${formatCurrency(invoice.discount)}
      </span>
    </div>
  ` : '';

  const notesHtml = invoice.notes?.trim() ? `
    <div style="
      padding-top: 12px;
      border-top: 1px solid #e5e7eb;
    ">
      <div style="
        font-size: 10px;
        font-weight: 800;
        color: #6b7280;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        margin-bottom: 4px;
      ">
        OBSERVAÇÕES:
      </div>
      <div style="
        font-size: 11px;
        color: #374151;
        white-space: pre-wrap;
        line-height: 1.5;
      ">
        ${invoice.notes}
      </div>
    </div>
  ` : '';

  const termsHtml = invoice.terms?.trim() ? `
    <div style="
      padding-top: 8px;
      margin-top: 8px;
    ">
      <div style="
        font-size: 10px;
        font-weight: 800;
        color: #6b7280;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        margin-bottom: 4px;
      ">
        TERMOS:
      </div>
      <div style="
        font-size: 10px;
        color: #9ca3af;
        font-style: italic;
        white-space: pre-wrap;
        line-height: 1.5;
      ">
        ${invoice.terms}
      </div>
    </div>
  ` : '';

  const logoHtml = invoice.company.logoUrl 
    ? `<img src="${invoice.company.logoUrl}" alt="Logo" style="width: 100%; height: 100%; object-fit: contain;" />`
    : `<div style="
        width: 100%;
        height: 100%;
        background-color: #f3f4f6;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 8px;
        color: #9ca3af;
        font-size: 12px;
      ">Logo</div>`;

  return `
    <div style="
      font-family: Inter, -apple-system, BlinkMacSystemFont, sans-serif;
      background-color: #ffffff;
      color: #111827;
      padding: 24px;
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
        margin-bottom: 16px;
        padding-bottom: 16px;
        border-bottom: 2px solid #111827;
      ">
        <!-- Logo -->
        <div style="width: 100px; height: 100px;">
          ${logoHtml}
        </div>

        <!-- Invoice Title + Number -->
        <div style="text-align: right;">
          <h1 style="
            font-size: 36px;
            font-weight: 900;
            color: #111827;
            letter-spacing: -0.02em;
            margin: 0;
            margin-bottom: 4px;
          ">
            INVOICE
          </h1>
          <div style="font-size: 12px; color: #6b7280;">
            <span>Nº </span>
            <span style="font-weight: 700; color: #111827;">${invoice.invoiceNumber}</span>
          </div>
        </div>
      </div>

      <!-- Datas & Status Card -->
      <div style="
        background-color: #f9fafb;
        border: 1px solid #e5e7eb;
        border-radius: 8px;
        padding: 12px 16px;
        margin-bottom: 16px;
      ">
        <div style="
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 8px;
          font-size: 10px;
          font-weight: 800;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        ">
          📅 DATAS & STATUS
        </div>
        <div style="
          display: flex;
          gap: 24px;
          align-items: center;
        ">
          <div>
            <div style="font-size: 9px; font-weight: 700; color: #9ca3af; text-transform: uppercase; margin-bottom: 2px;">
              EMISSÃO
            </div>
            <div style="font-size: 12px; font-weight: 600; color: #111827;">
              ${formatDate(invoice.date)}
            </div>
          </div>
          <div>
            <div style="font-size: 9px; font-weight: 700; color: #9ca3af; text-transform: uppercase; margin-bottom: 2px;">
              VENCIMENTO
            </div>
            <div style="font-size: 12px; font-weight: 600; color: #111827;">
              ${formatDate(invoice.dueDate)}
            </div>
          </div>
          <div>
            <div style="font-size: 9px; font-weight: 700; color: #9ca3af; text-transform: uppercase; margin-bottom: 2px;">
              STATUS
            </div>
            <span style="
              display: inline-block;
              padding: 2px 10px;
              border-radius: 9999px;
              font-size: 10px;
              font-weight: 700;
              background-color: ${statusBgColor};
              color: ${statusTextColor};
              border: 1px solid ${statusBorderColor};
            ">
              ${invoice.status}
            </span>
          </div>
        </div>
      </div>

      <!-- Two Column: DE + PARA -->
      <div style="
        display: flex;
        gap: 16px;
        margin-bottom: 20px;
      ">
        <!-- SUA EMPRESA (DE) -->
        <div style="
          flex: 1;
          background-color: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 12px 16px;
        ">
          <div style="
            display: flex;
            align-items: center;
            gap: 6px;
            margin-bottom: 10px;
            font-size: 10px;
            font-weight: 800;
            color: #6b7280;
            text-transform: uppercase;
            letter-spacing: 0.05em;
          ">
            🏢 SUA EMPRESA (DE)
          </div>
          
          <div style="margin-bottom: 8px;">
            <div style="font-size: 9px; font-weight: 700; color: #9ca3af; text-transform: uppercase; margin-bottom: 2px;">
              NOME DA EMPRESA
            </div>
            <div style="font-size: 13px; font-weight: 700; color: #111827;">
              ${invoice.company.name || '-'}
            </div>
          </div>
          
          <div style="margin-bottom: 8px;">
            <div style="font-size: 9px; font-weight: 700; color: #9ca3af; text-transform: uppercase; margin-bottom: 2px;">
              ENDEREÇO COMPLETO
            </div>
            <div style="font-size: 11px; color: #374151; white-space: pre-wrap; line-height: 1.4;">
              ${invoice.company.address || '-'}
            </div>
          </div>
          
          <div style="margin-bottom: 8px;">
            <div style="font-size: 9px; font-weight: 700; color: #9ca3af; text-transform: uppercase; margin-bottom: 2px;">
              EMAIL
            </div>
            <div style="font-size: 11px; color: #374151; text-decoration: underline;">
              ${invoice.company.email || '-'}
            </div>
          </div>
          
          <div>
            <div style="font-size: 9px; font-weight: 700; color: #9ca3af; text-transform: uppercase; margin-bottom: 2px;">
              TELEFONE
            </div>
            <div style="font-size: 11px; color: #374151;">
              ${invoice.company.phone || '-'}
            </div>
          </div>
        </div>

        <!-- CLIENTE (PARA) -->
        <div style="
          flex: 1;
          background-color: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 12px 16px;
        ">
          <div style="
            display: flex;
            align-items: center;
            gap: 6px;
            margin-bottom: 10px;
            font-size: 10px;
            font-weight: 800;
            color: #6b7280;
            text-transform: uppercase;
            letter-spacing: 0.05em;
          ">
            👤 CLIENTE (PARA)
          </div>
          
          <div style="margin-bottom: 8px;">
            <div style="font-size: 9px; font-weight: 700; color: #9ca3af; text-transform: uppercase; margin-bottom: 2px;">
              NOME DO CLIENTE
            </div>
            <div style="font-size: 13px; font-weight: 700; color: #111827;">
              ${invoice.client.name || '-'}
            </div>
          </div>
          
          <div style="margin-bottom: 8px;">
            <div style="font-size: 9px; font-weight: 700; color: #9ca3af; text-transform: uppercase; margin-bottom: 2px;">
              ENDEREÇO DO CLIENTE
            </div>
            <div style="font-size: 11px; color: #374151; white-space: pre-wrap; line-height: 1.4;">
              ${invoice.client.address || '-'}
            </div>
          </div>
          
          <div style="margin-bottom: 8px;">
            <div style="font-size: 9px; font-weight: 700; color: #9ca3af; text-transform: uppercase; margin-bottom: 2px;">
              EMAIL DO CLIENTE
            </div>
            <div style="font-size: 11px; color: #374151; text-decoration: underline;">
              ${invoice.client.email || '-'}
            </div>
          </div>
          
          <div>
            <div style="font-size: 9px; font-weight: 700; color: #9ca3af; text-transform: uppercase; margin-bottom: 2px;">
              TELEFONE DO CLIENTE
            </div>
            <div style="font-size: 11px; color: #374151;">
              ${invoice.client.phone || '-'}
            </div>
          </div>
        </div>
      </div>

      <!-- ITENS DA FATURA -->
      <div style="margin-bottom: 16px;">
        <div style="
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 10px;
          font-size: 10px;
          font-weight: 800;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        ">
          📦 ITENS DA FATURA
        </div>

        ${itemsHtml}
      </div>

      <!-- Totals Section -->
      <div style="
        display: flex;
        justify-content: flex-end;
        margin-bottom: 16px;
      ">
        <div style="width: 220px;">
          <div style="
            display: flex;
            justify-content: space-between;
            padding: 6px 0;
            border-bottom: 1px solid #e5e7eb;
          ">
            <span style="font-size: 10px; font-weight: 700; color: #9ca3af; text-transform: uppercase;">
              SUBTOTAL:
            </span>
            <span style="font-size: 12px; font-weight: 600; color: #374151;">
              ${invoice.currency} ${formatCurrency(invoice.subtotal)}
            </span>
          </div>

          ${taxHtml}
          ${discountHtml}

          <div style="
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            border-top: 3px double #111827;
            margin-top: 4px;
          ">
            <span style="font-size: 11px; font-weight: 800; color: #111827; text-transform: uppercase;">
              TOTAL:
            </span>
            <span style="font-size: 18px; font-weight: 900; color: #111827;">
              ${invoice.currency} ${formatCurrency(invoice.total)}
            </span>
          </div>
        </div>
      </div>

      ${notesHtml}
      ${termsHtml}
    </div>
  `;
};
