import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';

export const BackupConfigForm = () => {
  const [backupType, setBackupType] = useState('complete');
  const [frequency, setFrequency] = useState('daily');
  const [executionTime, setExecutionTime] = useState('02:00');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Valores originales para resetear
  const [originalConfig] = useState({
    backupType: 'complete',
    frequency: 'daily',
    executionTime: '02:00',
  });

  const handleCancel = () => {
    setBackupType(originalConfig.backupType);
    setFrequency(originalConfig.frequency);
    setExecutionTime(originalConfig.executionTime);
  };

  const handleSave = () => {
    // Aquí se guardaría la configuración en el backend
    console.log('Configuración guardada:', {
      backupType,
      frequency,
      executionTime,
    });

    // Mostrar mensaje de éxito
    setShowSuccessMessage(true);
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 3000);
  };

  return (
    <div className="bg-gradient-to-br from-secondary-500/80 to-secondary-600/80 backdrop-blur-sm rounded-xl p-6 border border-gray-700/30 shadow-xl">
      <h3 className="text-lg font-heading font-bold text-white mb-4">
        Configuración de Backup Automático
      </h3>

      {showSuccessMessage && (
        <div className="mb-4 bg-gradient-to-br from-green-900/30 to-green-800/30 border-l-4 border-green-500 p-4 rounded-lg animate-fade-in">
          <div className="flex items-center">
            <FontAwesomeIcon icon={faCheckCircle} className="text-green-400 mr-2" />
            <p className="text-green-300 font-semibold">
              Configuración guardada exitosamente
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-secondary-600/50 rounded-lg p-4 border border-gray-700/30">
          <label className="block text-sm font-semibold text-gray-300 mb-2">
            Tipo de Backup
          </label>
          <select
            className="select w-full"
            value={backupType}
            onChange={(e) => setBackupType(e.target.value)}
          >
            <option value="complete">Completo</option>
            <option value="incremental">Incremental</option>
            <option value="differential">Diferencial</option>
          </select>
        </div>
        <div className="bg-secondary-600/50 rounded-lg p-4 border border-gray-700/30">
          <label className="block text-sm font-semibold text-gray-300 mb-2">
            Frecuencia
          </label>
          <select
            className="select w-full"
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
          >
            <option value="daily">Diario</option>
            <option value="weekly">Semanal</option>
            <option value="monthly">Mensual</option>
          </select>
        </div>
        <div className="bg-secondary-600/50 rounded-lg p-4 border border-gray-700/30">
          <label className="block text-sm font-semibold text-gray-300 mb-2">
            Hora de Ejecución
          </label>
          <input
            type="time"
            className="input w-full"
            value={executionTime}
            onChange={(e) => setExecutionTime(e.target.value)}
          />
        </div>
      </div>
      <div className="flex justify-end gap-3 mt-4">
        <button
          onClick={handleCancel}
          className="btn bg-secondary-200 hover:bg-secondary-300 text-white"
        >
          Cancelar
        </button>
        <button
          onClick={handleSave}
          className="btn bg-primary-600 hover:bg-primary-700 text-white"
        >
          Guardar Configuración
        </button>
      </div>
    </div>
  );
};
