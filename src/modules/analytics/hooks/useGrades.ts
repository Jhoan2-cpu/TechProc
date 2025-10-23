// src/modules/analytics/hooks/useGrades.ts

import { useState, useEffect, useCallback } from 'react';
import { gradeService } from '../services/gradeService';
import type {
  GradeStatistics,
  TopPerformer,
  GradeReportData,
  FilterOptions,
  GradeFilters
} from '../types/grades';

export const useGrades = (initialFilters?: GradeFilters) => {
  const [statistics, setStatistics] = useState<GradeStatistics | null>(null);
  const [gradeReport, setGradeReport] = useState<GradeReportData | null>(null);
  const [topPerformers, setTopPerformers] = useState<TopPerformer[]>([]);
  const [filterOptions, setFilterOptions] = useState<FilterOptions | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStatistics = useCallback(async (filters?: GradeFilters) => {
    try {
      setLoading(true);
      setError(null);
      
      const stats = await gradeService.getStatistics(filters);
      setStatistics(stats);
    } catch (err) {
      setError('Error al cargar las estadísticas de calificaciones');
      console.error('Error fetching statistics:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchGradeReport = useCallback(async (filters?: GradeFilters) => {
    try {
      const report = await gradeService.getGradeReport(filters);
      setGradeReport(report);
    } catch (err) {
      console.error('Error fetching grade report:', err);
    }
  }, []);

  const fetchTopPerformers = useCallback(async (filters?: GradeFilters) => {
    try {
      const performers = await gradeService.getTopPerformers(filters);
      setTopPerformers(performers);
    } catch (err) {
      console.error('Error fetching top performers:', err);
    }
  }, []);

  const fetchFilterOptions = useCallback(async () => {
    try {
      const options = await gradeService.getFilterOptions();
      setFilterOptions(options);
    } catch (err) {
      console.error('Error fetching filter options:', err);
    }
  }, []);

  const refreshData = useCallback(async (filters?: GradeFilters) => {
    await Promise.all([
      fetchStatistics(filters),
      fetchGradeReport(filters),
      fetchTopPerformers(filters),
      fetchFilterOptions()
    ]);
  }, [fetchStatistics, fetchGradeReport, fetchTopPerformers, fetchFilterOptions]);

  useEffect(() => {
    refreshData(initialFilters);
  }, []);

  return {
    statistics,
    gradeReport,
    topPerformers,
    filterOptions,
    loading,
    error,
    refreshData,
    fetchGradeReport
  };
};