import React, { useState, useEffect } from 'react';
import { useCurrencyExchange } from '@/src/hooks/useCurrencyExchange';

interface CurrencyConverterProps {
  amount: number;
  baseCurrency: string;
  className?: string;
}

const CurrencyConverter: React.FC<CurrencyConverterProps> = ({ amount, baseCurrency, className }) => {
  const { rates, loading, convert, formatWithCurrency, getAvailableCurrencies, lastUpdated } = useCurrencyExchange();
  const [targetCurrency, setTargetCurrency] = useState('BRL');
  const [showConverter, setShowConverter] = useState(false);

  const currencies = getAvailableCurrencies();
  const convertedAmount = convert(amount, baseCurrency, targetCurrency);

  if (loading) {
    return (
      <div className={`text-xs text-gray-400 ${className}`}>
        Carregando cotações...
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      <button
        onClick={() => setShowConverter(!showConverter)}
        className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
        Converter moeda
      </button>

      {showConverter && (
        <div className="mt-3 p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-3">
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">
                Valor em {baseCurrency}
              </label>
              <div className="text-lg font-bold text-gray-900">
                {formatWithCurrency(amount, baseCurrency)}
              </div>
            </div>
            <div className="text-2xl text-gray-300">=</div>
            <div className="flex-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">
                Converter para
              </label>
              <select
                value={targetCurrency}
                onChange={(e) => setTargetCurrency(e.target.value)}
                className="w-full text-sm font-bold"
              >
                {currencies.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="pt-2 border-t border-gray-200">
            <div className="text-2xl font-black text-blue-600">
              {formatWithCurrency(convertedAmount, targetCurrency)}
            </div>
            <div className="text-xs text-gray-400 mt-1">
              Taxa: 1 {baseCurrency} = {(rates[targetCurrency] / rates[baseCurrency]).toFixed(4)} {targetCurrency}
            </div>
          </div>

          {lastUpdated && (
            <div className="text-[10px] text-gray-400">
              Última atualização: {new Date(lastUpdated).toLocaleString('pt-BR')}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CurrencyConverter;
