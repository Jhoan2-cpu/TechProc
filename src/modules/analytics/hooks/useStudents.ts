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
      
      // Asegurarnos de que los datos tengan la estructura correcta
      const safeStudentData = studentData.map(student => ({
        ...student,
        company: student.company || null,
        enrollments: student.enrollments || [],
        enrollments_count: student.enrollments_count || 0
      }));
      
      setStudents(safeStudentData);
      setPagination(paginationData);
    } catch (err: any) {
      console.error('Error loading students:', err);
      setError(err?.message || 'Error al cargar estudiantes');
      setStudents([]);
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
      // No seteamos error aquí para no bloquear la UI principal
    }
  };

  const refreshData = async (filters?: StudentFilters) => {
    try {
      setLoading(true);
      await Promise.all([
        loadStudents(filters),
        loadStatistics()
      ]);
    } catch (err) {
      console.error('Error refreshing data:', err);
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
    loadStudents
  };
};