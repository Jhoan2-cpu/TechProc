import { useState, useEffect, useCallback } from 'react';
import { dashboardService } from '../services/dashboardService';
import type {
  DashboardSummary,
  StudentMetricsDetail,
  FinancialMetricsDetail,
  RecentActivity,
  DashboardFilters
} from '../types/dashboard';

export const useDashboard = (initialFilters?: DashboardFilters) => {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [studentMetrics, setStudentMetrics] = useState<StudentMetricsDetail | null>(null);
  const [financialMetrics, setFinancialMetrics] = useState<FinancialMetricsDetail | null>(null);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSummary = useCallback(async (filters?: DashboardFilters) => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await dashboardService.getSummary(filters);
      setSummary(data);
    } catch (err) {
      setError('Error al cargar el resumen del dashboard');
      console.error('Error fetching dashboard summary:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStudentMetrics = useCallback(async (filters?: DashboardFilters) => {
    try {
      const data = await dashboardService.getStudentMetrics(filters);
      setStudentMetrics(data);
    } catch (err) {
      console.error('Error fetching student metrics:', err);
    }
  }, []);

  const fetchFinancialMetrics = useCallback(async (filters?: DashboardFilters) => {
    try {
      const data = await dashboardService.getFinancialMetrics(filters);
      setFinancialMetrics(data);
    } catch (err) {
      console.error('Error fetching financial metrics:', err);
    }
  }, []);

  const fetchRecentActivities = useCallback(async (filters?: DashboardFilters) => {
    try {
      const data = await dashboardService.getRecentActivities(filters);
      setRecentActivities(data);
    } catch (err) {
      console.error('Error fetching recent activities:', err);
    }
  }, []);

  const refreshData = useCallback(async (filters?: DashboardFilters) => {
    await Promise.all([
      fetchSummary(filters),
      fetchStudentMetrics(filters),
      fetchFinancialMetrics(filters),
      fetchRecentActivities(filters)
    ]);
  }, [fetchSummary, fetchStudentMetrics, fetchFinancialMetrics, fetchRecentActivities]);

  useEffect(() => {
    refreshData(initialFilters);
  }, []);

  return {
    summary,
    studentMetrics,
    financialMetrics,
    recentActivities,
    loading,
    error,
    refreshData
  };
};