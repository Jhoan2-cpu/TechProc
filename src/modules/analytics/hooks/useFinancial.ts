import { useState, useEffect, useCallback } from 'react';
import { financialService } from '../services/financialService';
import type {
  FinancialStatistics,
  RevenueSource,
  PendingPaymentsData,
  RevenueTrendItem,
  FinancialFilters
} from '../types/financial';

export const useFinancial = (initialFilters?: FinancialFilters) => {
  const [statistics, setStatistics] = useState<FinancialStatistics | null>(null);
  const [revenueTrend, setRevenueTrend] = useState<RevenueTrendItem[]>([]);
  const [revenueSources, setRevenueSources] = useState<RevenueSource[]>([]);
  const [pendingPayments, setPendingPayments] = useState<PendingPaymentsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStatistics = useCallback(async (filters?: FinancialFilters) => {
    try {
      setLoading(true);
      setError(null);
      
      const stats = await financialService.getStatistics(filters);
      setStatistics(stats);
    } catch (err) {
      setError('Error al cargar las estadísticas financieras');
      console.error('Error fetching statistics:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchRevenueTrend = useCallback(async (filters?: FinancialFilters) => {
    try {
      const trend = await financialService.getRevenueTrend(filters);
      setRevenueTrend(trend);
    } catch (err) {
      console.error('Error fetching revenue trend:', err);
    }
  }, []);

  const fetchRevenueSources = useCallback(async () => {
    try {
      const sources = await financialService.getRevenueSources();
      setRevenueSources(sources);
    } catch (err) {
      console.error('Error fetching revenue sources:', err);
    }
  }, []);

  const fetchPendingPayments = useCallback(async (filters?: FinancialFilters) => {
    try {
      const payments = await financialService.getPendingPayments(filters);
      setPendingPayments(payments);
    } catch (err) {
      console.error('Error fetching pending payments:', err);
    }
  }, []);

  const refreshData = useCallback(async (filters?: FinancialFilters) => {
    await Promise.all([
      fetchStatistics(filters),
      fetchRevenueTrend(filters),
      fetchRevenueSources(),
      fetchPendingPayments(filters)
    ]);
  }, [fetchStatistics, fetchRevenueTrend, fetchRevenueSources, fetchPendingPayments]);

  useEffect(() => {
    refreshData(initialFilters);
  }, []);

  return {
    statistics,
    revenueTrend,
    revenueSources,
    pendingPayments,
    loading,
    error,
    refreshData
  };
};