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
    <div className="card p-6 bg-blue-50 border-blue-200">
      <h3 className="text-lg font-heading font-bold text-secondary-900 mb-4">
        Configuración de Backup Automático
      </h3>

      {showSuccessMessage && (
        <div className="mb-4 bg-green-100 border-l-4 border-green-500 p-4 animate-fade-in">
          <div className="flex items-center">
            <FontAwesomeIcon icon={faCheckCircle} className="text-green-600 mr-2" />
            <p className="text-green-800 font-semibold">
              Configuración guardada exitosamente
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg p-4">
          <label className="block text-sm font-semibold text-secondary-700 mb-2">
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
        <div className="bg-white rounded-lg p-4">
          <label className="block text-sm font-semibold text-secondary-700 mb-2">
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
        <div className="bg-white rounded-lg p-4">
          <label className="block text-sm font-semibold text-secondary-700 mb-2">
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
          className="btn bg-secondary-200 hover:bg-secondary-300 text-secondary-700"
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
