export const BackupConfigForm = () => {
  return (
    <div className="card p-6 bg-blue-50 border-blue-200">
      <h3 className="text-lg font-heading font-bold text-secondary-900 mb-4">
        Configuración de Backup Automático
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg p-4">
          <label className="block text-sm font-semibold text-secondary-700 mb-2">
            Tipo de Backup
          </label>
          <select className="select w-full">
            <option>Completo</option>
            <option>Incremental</option>
            <option>Diferencial</option>
          </select>
        </div>
        <div className="bg-white rounded-lg p-4">
          <label className="block text-sm font-semibold text-secondary-700 mb-2">
            Frecuencia
          </label>
          <select className="select w-full">
            <option>Diario</option>
            <option>Semanal</option>
            <option>Mensual</option>
          </select>
        </div>
        <div className="bg-white rounded-lg p-4">
          <label className="block text-sm font-semibold text-secondary-700 mb-2">
            Hora de Ejecución
          </label>
          <input type="time" className="input w-full" defaultValue="02:00" />
        </div>
      </div>
      <div className="flex justify-end gap-3 mt-4">
        <button className="btn bg-secondary-200 hover:bg-secondary-300 text-secondary-700">
          Cancelar
        </button>
        <button className="btn bg-primary-600 hover:bg-primary-700 text-white">
          Guardar Configuración
        </button>
      </div>
    </div>
  );
};
