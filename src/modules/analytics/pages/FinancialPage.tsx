import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faDollarSign,
  faChartLine,
  faWallet,
  faExclamationCircle,
  faChartBar,
  faFileInvoice,
  faPercentage
} from '@fortawesome/free-solid-svg-icons';
import type { FinancialFilters } from '../types/financial';
import { FinancialFilterSection } from '../components/FinancialFilterSection';
import { PendingPaymentCard } from '../components/PendingPaymentCard';
import { RevenueSourceChart } from '../components/RevenueSourceChart';
import { useFinancial } from '../hooks/useFinancial';

export const FinancialPage = () => {
  const [filters, setFilters] = useState<FinancialFilters>({});

  const {
    statistics,
    revenueTrend,
    revenueSources,
    pendingPayments,
    loading,
    error,
    refreshData
  } = useFinancial(filters);

  const handleFilterChange = (newFilters: FinancialFilters) => {
    setFilters(newFilters);
    refreshData(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({});
    refreshData({});
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN'
    }).format(amount);
  };

  if (loading && !statistics) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-white">Cargando datos financieros...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/20 border border-red-500 rounded-xl p-6 text-center">
        <p className="text-red-300">{error}</p>
        <button
          onClick={() => refreshData(filters)}
          className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-heading font-bold text-white flex items-center gap-3">
            <FontAwesomeIcon icon={faDollarSign} className="text-primary-400" />
            Análisis Financiero
          </h2>
          <p className="text-gray-400 mt-1">
            Reporte detallado de ingresos, gastos y flujo de caja
          </p>
        </div>
      </div>

      {/* Estadísticas principales */}
      {statistics && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="card p-4 bg-gradient-to-br from-green-500/20 to-green-600/20 border border-green-500/30">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <FontAwesomeIcon icon={faWallet} className="text-green-400 text-xl" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">
                    {formatCurrency(statistics.total_revenue)}
                  </p>
                  <p className="text-sm text-gray-300">Ingresos Totales</p>
                </div>
              </div>
            </div>

            <div className="card p-4 bg-gradient-to-br from-red-500/20 to-red-600/20 border border-red-500/30">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-500/20 rounded-lg">
                  <FontAwesomeIcon icon={faExclamationCircle} className="text-red-400 text-xl" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">
                    {formatCurrency(statistics.total_expenses)}
                  </p>
                  <p className="text-sm text-gray-300">Gastos Totales</p>
                </div>
              </div>
            </div>

            <div className={`card p-4 bg-gradient-to-br ${statistics.net_income >= 0
                ? 'from-blue-500/20 to-blue-600/20 border-blue-500/30'
                : 'from-orange-500/20 to-orange-600/20 border-orange-500/30'
              }`}>
              <div className="flex items-center gap-3">
                <div className={`p-2 ${statistics.net_income >= 0 ? 'bg-blue-500/20' : 'bg-orange-500/20'
                  } rounded-lg`}>
                  <FontAwesomeIcon
                    icon={faChartLine}
                    className={`${statistics.net_income >= 0 ? 'text-blue-400' : 'text-orange-400'
                      } text-xl`}
                  />
                </div>
                <div>
                  <p className={`text-2xl font-bold ${statistics.net_income >= 0 ? 'text-blue-400' : 'text-orange-400'
                    }`}>
                    {formatCurrency(statistics.net_income)}
                  </p>
                  <p className="text-sm text-gray-300">Ingreso Neto</p>
                </div>
              </div>
            </div>

            <div className="card p-4 bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 border border-yellow-500/30">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-500/20 rounded-lg">
                  <FontAwesomeIcon icon={faFileInvoice} className="text-yellow-400 text-xl" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">
                    {statistics.pending_payments.count}
                  </p>
                  <p className="text-sm text-gray-300">Pagos Pendientes</p>
                  <p className="text-xs text-yellow-400 font-medium">
                    {formatCurrency(statistics.pending_payments.total_amount)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Métricas adicionales */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="card p-4 border border-gray-700/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Facturas Pagadas</p>
                  <p className="text-xl font-bold text-white mt-1">
                    {statistics.additional_metrics.paid_invoices}
                  </p>
                </div>
                <FontAwesomeIcon icon={faFileInvoice} className="text-green-400 text-2xl" />
              </div>
            </div>

            <div className="card p-4 border border-gray-700/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total Facturas</p>
                  <p className="text-xl font-bold text-white mt-1">
                    {statistics.additional_metrics.total_invoices}
                  </p>
                </div>
                <FontAwesomeIcon icon={faChartBar} className="text-primary-400 text-2xl" />
              </div>
            </div>

            <div className="card p-4 border border-gray-700/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Tasa de Cobro</p>
                  <p className="text-xl font-bold text-white mt-1">
                    {statistics.additional_metrics.collection_rate}%
                  </p>
                </div>
                <FontAwesomeIcon icon={faPercentage} className="text-blue-400 text-2xl" />
              </div>
            </div>

            <div className="card p-4 border border-gray-700/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Promedio por Factura</p>
                  <p className="text-xl font-bold text-white mt-1">
                    {formatCurrency(statistics.additional_metrics.average_invoice_amount)}
                  </p>
                </div>
                <FontAwesomeIcon icon={faDollarSign} className="text-purple-400 text-2xl" />
              </div>
            </div>
          </div>

          {/* Ingresos por fuente */}
          {statistics.by_revenue_source.length > 0 && (
            <RevenueSourceChart data={statistics.by_revenue_source} />
          )}

          {/* Tendencia de ingresos */}
          {revenueTrend.length > 0 && (
            <div className="card p-6 border border-gray-700/30">
              <h3 className="font-heading font-bold text-white flex items-center gap-2 mb-4">
                <FontAwesomeIcon icon={faChartLine} className="text-primary-400" />
                Tendencia de Ingresos
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left py-3 px-4 text-gray-300 font-medium">Período</th>
                      <th className="text-right py-3 px-4 text-gray-300 font-medium">Ingresos</th>
                    </tr>
                  </thead>
                  <tbody>
                    {revenueTrend.map((item, index) => (
                      <tr key={index} className="border-b border-gray-800 hover:bg-gray-800/30">
                        <td className="py-3 px-4 text-white">{item.period_label}</td>
                        <td className="py-3 px-4 text-right">
                          <span className="text-green-400 font-medium">
                            {formatCurrency(parseFloat(item.revenue))}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}


      
      {/* Filtros */}
      {/*
      <FinancialFilterSection
        filters={filters}
        revenueSources={revenueSources}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
      />
      */}

      {/* Pagos pendientes */}
      {pendingPayments && pendingPayments.invoices.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading font-bold text-white flex items-center gap-2">
              <FontAwesomeIcon icon={faFileInvoice} className="text-yellow-400" />
              Facturas Pendientes de Pago
            </h3>
            <span className="text-sm text-gray-400">
              {pendingPayments.summary.count} facturas - {formatCurrency(pendingPayments.summary.total_amount)}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {pendingPayments.invoices.map((payment, index) => (
              <PendingPaymentCard
                key={payment.id}
                payment={payment}
                index={index}
              />
            ))}
          </div>

          {/* Paginación */}
          {pendingPayments.pagination.last_page > 1 && (
            <div className="flex justify-center items-center gap-2 mt-6">
              <button
                onClick={() => handleFilterChange({
                  ...filters,
                  page: (filters.page || 1) - 1
                })}
                disabled={pendingPayments.pagination.current_page === 1}
                className="px-4 py-2 bg-gray-700 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600"
              >
                Anterior
              </button>

              <span className="px-4 py-2 text-gray-300">
                Página {pendingPayments.pagination.current_page} de {pendingPayments.pagination.last_page}
              </span>

              <button
                onClick={() => handleFilterChange({
                  ...filters,
                  page: (filters.page || 1) + 1
                })}
                disabled={pendingPayments.pagination.current_page === pendingPayments.pagination.last_page}
                className="px-4 py-2 bg-gray-700 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600"
              >
                Siguiente
              </button>
            </div>
          )}
        </div>
      )}

      {/* Sin pagos pendientes */}
      {pendingPayments && pendingPayments.invoices.length === 0 && (
        <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 backdrop-blur-sm rounded-xl p-12 border border-green-700/30 text-center">
          <FontAwesomeIcon icon={faFileInvoice} className="text-green-400 text-5xl mb-4" />
          <p className="text-xl text-gray-300">
            ¡Excelente! No hay facturas pendientes de pago
          </p>
        </div>
      )}
    </div>
  );
};