import { useState, useEffect, useCallback } from 'react';

interface ExchangeRates {
  [key: string]: number;
}

interface ExchangeData {
  rates: ExchangeRates;
  base: string;
  lastUpdated: string;
}

const CACHE_KEY = 'exchange_rates_cache';
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour

export const useCurrencyExchange = () => {
  const [rates, setRates] = useState<ExchangeRates>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  const fetchRates = useCallback(async () => {
    try {
      // Check cache first
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_DURATION) {
          setRates(data.rates);
          setLastUpdated(data.lastUpdated);
          setLoading(false);
          return;
        }
      }

      // Fetch fresh rates from free API
      const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
      if (!response.ok) throw new Error('Failed to fetch rates');
      
      const data = await response.json();
      
      const exchangeData: ExchangeData = {
        rates: data.rates,
        base: 'USD',
        lastUpdated: new Date().toISOString()
      };

      // Cache the result
      localStorage.setItem(CACHE_KEY, JSON.stringify({
        data: exchangeData,
        timestamp: Date.now()
      }));

      setRates(exchangeData.rates);
      setLastUpdated(exchangeData.lastUpdated);
      setError(null);
    } catch (err) {
      console.error('Error fetching exchange rates:', err);
      setError('Erro ao buscar cotações');
      // Use fallback rates if fetch fails
      setRates({
        USD: 1,
        BRL: 5.0,
        EUR: 0.92,
        GBP: 0.79,
        JPY: 149.5,
        ARS: 850,
        CLP: 900,
        MXN: 17.2,
        CAD: 1.36,
        AUD: 1.53
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRates();
  }, [fetchRates]);

  const convert = useCallback((amount: number, from: string, to: string): number => {
    if (!rates[from] || !rates[to]) return amount;
    // Convert to USD first, then to target currency
    const inUSD = amount / rates[from];
    return inUSD * rates[to];
  }, [rates]);

  const formatWithCurrency = useCallback((amount: number, currency: string): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  }, []);

  const getAvailableCurrencies = useCallback(() => {
    const common = ['USD', 'BRL', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'MXN', 'ARS', 'CLP'];
    return common.filter(c => rates[c] !== undefined);
  }, [rates]);

  return {
    rates,
    loading,
    error,
    lastUpdated,
    convert,
    formatWithCurrency,
    getAvailableCurrencies,
    refresh: fetchRates
  };
};
