import { useState, useEffect, useCallback } from 'react';
import { securityService } from '../services/securityService';
import type {
  SecurityEvent,
  SecurityAlert,
  SecurityAnalysis,
  DashboardData,
  SecurityFilters
} from '../types/security';

export const useSecurity = (initialFilters?: SecurityFilters) => {
  const [events, setEvents] = useState<SecurityEvent[]>([]);
  const [alerts, setAlerts] = useState<SecurityAlert[]>([]);
  const [analysis, setAnalysis] = useState<SecurityAnalysis | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [eventsPagination, setEventsPagination] = useState({
    current_page: 1,
    total_pages: 1,
    total_records: 0,
    per_page: 20
  });
  const [alertsPagination, setAlertsPagination] = useState({
    current_page: 1,
    total_pages: 1,
    total_records: 0,
    per_page: 20
  });

  const fetchEvents = useCallback(async (filters?: SecurityFilters) => {
    try {
      setLoading(true);
      setError(null);
      
      const { events: eventsData, pagination } = await securityService.getEvents(filters);
      setEvents(eventsData);
      setEventsPagination(pagination);
    } catch (err) {
      setError('Error al cargar los eventos de seguridad');
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAlerts = useCallback(async (filters?: SecurityFilters) => {
    try {
      setLoading(true);
      setError(null);
      
      const { alerts: alertsData, pagination } = await securityService.getAlerts(filters);
      setAlerts(alertsData);
      setAlertsPagination(pagination);
    } catch (err) {
      setError('Error al cargar las alertas de seguridad');
      console.error('Error fetching alerts:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAnalysis = useCallback(async (filters?: SecurityFilters) => {
    try {
      const analysisData = await securityService.getAnalysis(filters);
      setAnalysis(analysisData);
    } catch (err) {
      console.error('Error fetching analysis:', err);
    }
  }, []);

  const fetchDashboardData = useCallback(async (filters?: SecurityFilters) => {
    try {
      const data = await securityService.getDashboardData(filters);
      setDashboardData(data);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    }
  }, []);

  const refreshData = useCallback(async (filters?: SecurityFilters) => {
    await Promise.all([
      fetchAnalysis(filters),
      fetchDashboardData(filters),
      fetchEvents(filters),
      fetchAlerts(filters)
    ]);
  }, [fetchAnalysis, fetchDashboardData, fetchEvents, fetchAlerts]);

  useEffect(() => {
    refreshData(initialFilters);
  }, []);

  return {
    events,
    alerts,
    analysis,
    dashboardData,
    loading,
    error,
    eventsPagination,
    alertsPagination,
    fetchEvents,
    fetchAlerts,
    refreshData
  };
};