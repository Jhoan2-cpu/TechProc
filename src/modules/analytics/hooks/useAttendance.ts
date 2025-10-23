import { useState, useEffect } from 'react';
import { attendanceService } from '../services';
import type { 
  StudentAttendance, 
  CourseAnalytics, 
  AttendanceFilters,
  AttendanceStatistics,
  AttendanceTrend,
  FilterOptions 
} from '../types';

interface UseAttendanceReturn {
  // Datos
  attendance: StudentAttendance[];
  courses: CourseAnalytics[];
  statistics: AttendanceStatistics | null;
  trend: AttendanceTrend[];
  filterOptions: FilterOptions | null;
  
  // Estados
  loading: boolean;
  error: string | null;
  
  // Funciones
  refreshData: (filters?: AttendanceFilters) => Promise<void>;
  exportToCSV: (filters?: AttendanceFilters) => Promise<void>;
}

export const useAttendance = (initialFilters?: AttendanceFilters): UseAttendanceReturn => {
  const [attendance, setAttendance] = useState<StudentAttendance[]>([]);
  const [courses, setCourses] = useState<CourseAnalytics[]>([]);
  const [statistics, setStatistics] = useState<AttendanceStatistics | null>(null);
  const [trend, setTrend] = useState<AttendanceTrend[]>([]);
  const [filterOptions, setFilterOptions] = useState<FilterOptions | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async (filters?: AttendanceFilters) => {
    try {
      setLoading(true);
      setError(null);

      // Cargar datos en paralelo
      const [recordsResponse, statsResponse, trendResponse, optionsResponse] = await Promise.all([
        attendanceService.getAttendanceRecords(filters),
        attendanceService.getAttendanceStatistics(filters),
        attendanceService.getAttendanceTrend(filters),
        attendanceService.getFilterOptions()
      ]);

      // Transformar datos para el frontend
      const transformedAttendance = attendanceService.transformToStudentAttendance(recordsResponse.records);
      const transformedCourses = attendanceService.transformToCourseAnalytics(statsResponse);

      setAttendance(transformedAttendance);
      setCourses(transformedCourses);
      setStatistics(statsResponse);
      setTrend(trendResponse);
      setFilterOptions(optionsResponse);

    } catch (err: any) {
      console.error('Error loading attendance data:', err);
      setError(err.message || 'Error al cargar los datos de asistencia');
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = async (filters?: AttendanceFilters): Promise<void> => {
    try {
      const blob = await attendanceService.exportToCSV(filters);
      
      // Crear enlace de descarga
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `asistencia-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
    } catch (err: any) {
      console.error('Error exporting to CSV:', err);
      throw new Error(err.message || 'Error al exportar los datos');
    }
  };

  useEffect(() => {
    loadData(initialFilters);
  }, []);

  return {
    attendance,
    courses,
    statistics,
    trend,
    filterOptions,
    loading,
    error,
    refreshData: loadData,
    exportToCSV
  };
};