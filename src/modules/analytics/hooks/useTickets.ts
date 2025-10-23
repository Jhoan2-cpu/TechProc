import { useState, useEffect, useCallback } from 'react';
import { ticketService } from '../services/ticketService';
import type { 
  Ticket, 
  TicketStatistics, 
  CategoryStatistic, 
  TechnicianRanking, 
  TicketFilters 
} from '../types/ticket';

export const useTickets = (initialFilters?: TicketFilters) => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [statistics, setStatistics] = useState<TicketStatistics | null>(null);
  const [categoryStats, setCategoryStats] = useState<CategoryStatistic[]>([]);
  const [technicianRanking, setTechnicianRanking] = useState<TechnicianRanking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 1,
    total_records: 0,
    per_page: 15
  });

  const fetchTickets = useCallback(async (filters?: TicketFilters) => {
    try {
      setLoading(true);
      setError(null);
      
      const { tickets: ticketsData, pagination: paginationData } = await ticketService.getTickets(filters);
      setTickets(ticketsData);
      setPagination(paginationData);
    } catch (err) {
      setError('Error al cargar los tickets');
      console.error('Error fetching tickets:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStatistics = useCallback(async (filters?: TicketFilters) => {
    try {
      const stats = await ticketService.getTicketStatistics(filters);
      setStatistics(stats);
    } catch (err) {
      console.error('Error fetching statistics:', err);
    }
  }, []);

  const fetchCategoryStats = useCallback(async (filters?: TicketFilters) => {
    try {
      const stats = await ticketService.getCategoryStatistics(filters);
      setCategoryStats(stats);
    } catch (err) {
      console.error('Error fetching category statistics:', err);
    }
  }, []);

  const fetchTechnicianRanking = useCallback(async (filters?: TicketFilters) => {
    try {
      const ranking = await ticketService.getTechnicianRanking(filters);
      setTechnicianRanking(ranking);
    } catch (err) {
      console.error('Error fetching technician ranking:', err);
    }
  }, []);

  const refreshData = useCallback(async (filters?: TicketFilters) => {
    await Promise.all([
      fetchTickets(filters),
      fetchStatistics(filters),
      fetchCategoryStats(filters),
      fetchTechnicianRanking(filters)
    ]);
  }, [fetchTickets, fetchStatistics, fetchCategoryStats, fetchTechnicianRanking]);

  const exportToCSV = useCallback(async (filters?: TicketFilters) => {
    try {
      const blob = await ticketService.exportToCSV(filters);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `tickets_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Error exporting to CSV:', err);
      setError('Error al exportar datos');
    }
  }, []);

  useEffect(() => {
    refreshData(initialFilters);
  }, []);

  return {
    tickets,
    statistics,
    categoryStats,
    technicianRanking,
    loading,
    error,
    pagination,
    refreshData,
    exportToCSV
  };
};