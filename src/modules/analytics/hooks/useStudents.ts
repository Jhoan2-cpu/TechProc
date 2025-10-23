import { useState, useEffect } from 'react';
import { studentService } from '../services/studentService';
import type { Student, StudentStatistics, StudentFilters } from '../types/student';

export const useStudents = (initialFilters?: StudentFilters) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [statistics, setStatistics] = useState<StudentStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 1,
    total_records: 0,
    per_page: 10
  });

  const loadStudents = async (filters?: StudentFilters) => {
    try {
      setLoading(true);
      setError(null);
      
      const { students: studentData, pagination: paginationData } = 
        await studentService.getStudents(filters);
      
      setStudents(studentData);
      setPagination(paginationData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar estudiantes');
    } finally {
      setLoading(false);
    }
  };

  const loadStatistics = async () => {
    try {
      const stats = await studentService.getStudentStatistics();
      setStatistics(stats);
    } catch (err) {
      console.error('Error al cargar estadísticas:', err);
    }
  };

  const refreshData = async (filters?: StudentFilters) => {
    await Promise.all([
      loadStudents(filters),
      loadStatistics()
    ]);
  };

  const exportToCSV = async (filters?: StudentFilters) => {
    try {
      const blob = await studentService.exportToCSV(filters);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `estudiantes_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error al exportar CSV:', err);
      throw err;
    }
  };

  useEffect(() => {
    refreshData(initialFilters);
  }, []);

  return {
    students,
    statistics,
    loading,
    error,
    pagination,
    refreshData,
    exportToCSV,
    loadStudents
  };
};