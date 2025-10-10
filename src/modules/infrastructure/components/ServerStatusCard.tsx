import type { Server } from '../types';

interface ServerStatusCardProps {
  server: Server;
}

export const ServerStatusCard = ({ server }: ServerStatusCardProps) => {
  const getServerStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-success/20 text-green-700';
      case 'offline':
        return 'bg-gray-500/20 text-gray-400';
      case 'maintenance':
        return 'bg-warning/20 text-yellow-700';
      case 'error':
        return 'bg-danger/20 text-red-700';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getUsageColor = (percent: number) => {
    if (percent >= 90) return 'bg-red-500';
    if (percent >= 75) return 'bg-orange-500';
    if (percent >= 50) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="bg-gradient-to-br from-secondary-500/60 to-secondary-600/60 backdrop-blur-sm rounded-xl p-4 border border-gray-700/30 hover:border-primary-500/30 hover:shadow-lg transition-all duration-300">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-heading font-bold text-white">{server.server_name}</h3>
          <p className="text-sm text-gray-400">{server.ip_address}</p>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${getServerStatusColor(
            server.status
          )}`}
        >
          {server.status}
        </span>
      </div>
      <div className="space-y-2">
        <div>
          <div className="flex justify-between text-xs mb-1 text-gray-300">
            <span>CPU</span>
            <span className="font-semibold">{server.cpu_usage_percent}%</span>
          </div>
          <div className="w-full bg-secondary-700/50 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${getUsageColor(
                server.cpu_usage_percent
              )}`}
              style={{ width: `${server.cpu_usage_percent}%` }}
            ></div>
          </div>
        </div>
        <div>
          <div className="flex justify-between text-xs mb-1 text-gray-300">
            <span>RAM</span>
            <span className="font-semibold">{server.ram_usage_percent}%</span>
          </div>
          <div className="w-full bg-secondary-700/50 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${getUsageColor(
                server.ram_usage_percent
              )}`}
              style={{ width: `${server.ram_usage_percent}%` }}
            ></div>
          </div>
        </div>
        <div>
          <div className="flex justify-between text-xs mb-1 text-gray-300">
            <span>Disco</span>
            <span className="font-semibold">{server.disk_usage_percent}%</span>
          </div>
          <div className="w-full bg-secondary-700/50 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${getUsageColor(
                server.disk_usage_percent
              )}`}
              style={{ width: `${server.disk_usage_percent}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};
