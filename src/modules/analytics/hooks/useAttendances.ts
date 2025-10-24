// src/modules/analytics/hooks/useAttendances.ts
import { useState, useEffect, useCallback } from 'react';
import { attendanceService } from '../services/attendanceService';
import type { 
  Attendance, 
  AttendanceStatistics, 
  AttendanceTrend,
  AttendanceFilterOptions,
  AttendanceFilters 
} from '../types/attendance';

export const useAttendances = (initialFilters?: AttendanceFilters) => {
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [statistics, setStatistics] = useState<AttendanceStatistics | null>(null);
  const [trend, setTrend] = useState<AttendanceTrend[]>([]);
  const [filterOptions, setFilterOptions] = useState<AttendanceFilterOptions | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 1,
    total_records: 0,
    per_page: 15
  });

  const fetchAttendances = useCallback(async (filters?: AttendanceFilters) => {
    try {
      setLoading(true);
      setError(null);
      
      const { attendances: attendancesData, pagination: paginationData } = 
        await attendanceService.getAttendances(filters);
      
      setAttendances(attendancesData);
      setPagination(paginationData);
    } catch (err) {
      setError('Error al cargar los registros de asistencia');
      console.error('Error fetching attendances:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStatistics = useCallback(async (filters?: AttendanceFilters) => {
    try {
      const stats = await attendanceService.getAttendanceStatistics(filters);
      setStatistics(stats);
    } catch (err) {
      console.error('Error fetching statistics:', err);
    }
  }, []);

  const fetchTrend = useCallback(async (filters?: AttendanceFilters) => {
    try {
      const trendData = await attendanceService.getAttendanceTrend(filters);
      setTrend(trendData);
    } catch (err) {
      console.error('Error fetching trend:', err);
    }
  }, []);

  const fetchFilterOptions = useCallback(async () => {
    try {
      const options = await attendanceService.getFilterOptions();
      setFilterOptions(options);
    } catch (err) {
      console.error('Error fetching filter options:', err);
    }
  }, []);

  const refreshData = useCallback(async (filters?: AttendanceFilters) => {
    await Promise.all([
      fetchAttendances(filters),
      fetchStatistics(filters),
      fetchTrend(filters),
      fetchFilterOptions()
    ]);
  }, [fetchAttendances, fetchStatistics, fetchTrend, fetchFilterOptions]);

  useEffect(() => {
    refreshData(initialFilters);
  }, []);

  return {
    attendances,
    statistics,
    trend,
    filterOptions,
    loading,
    error,
    pagination,
    refreshData
  };
};