import { useState, useEffect, useCallback } from 'react';
import { courseService } from '../services/courseService';
import type { Course, CourseStatistics, CourseFilters } from '../types/course';

export const useCourses = (initialFilters?: CourseFilters) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [statistics, setStatistics] = useState<CourseStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 1,
    total_records: 0,
    per_page: 15
  });

  const fetchCourses = useCallback(async (filters?: CourseFilters) => {
    try {
      setLoading(true);
      setError(null);
      
      const { courses: coursesData, pagination: paginationData } = await courseService.getCourses(filters);
      setCourses(coursesData);
      setPagination(paginationData);
    } catch (err) {
      setError('Error al cargar los cursos');
      console.error('Error fetching courses:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStatistics = useCallback(async (filters?: CourseFilters) => {
    try {
      const stats = await courseService.getCourseStatistics(filters);
      setStatistics(stats);
    } catch (err) {
      console.error('Error fetching statistics:', err);
    }
  }, []);

  const refreshData = useCallback(async (filters?: CourseFilters) => {
    await Promise.all([
      fetchCourses(filters),
      fetchStatistics(filters)
    ]);
  }, [fetchCourses, fetchStatistics]);

  useEffect(() => {
    refreshData(initialFilters);
  }, []);

  return {
    courses,
    statistics,
    loading,
    error,
    pagination,
    refreshData
  };
};