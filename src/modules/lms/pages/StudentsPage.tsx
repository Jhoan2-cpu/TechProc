import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSearch,
  faUserPlus,
  faEye,
  faEdit,
  faTrash,
  faEnvelope,
  faMapMarkerAlt,
  faCalendar,
  faCheckCircle,
  faTimesCircle,
} from '@fortawesome/free-solid-svg-icons';
import type { Student } from '../types';
import { studentsService } from '../services';

export const StudentsPage = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterState, setFilterState] = useState<string>('all');

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const data = await studentsService.getAll();
        setStudents(data);
      } catch (error) {
        console.error('Error fetching students:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-secondary-600">Cargando estudiantes...</p>
        </div>
      </div>
    );
  }

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterState === 'all' || student.state === filterState;
    return matchesSearch && matchesFilter;
  });

  return (
    <div>
      <h1 className="text-3xl font-heading font-bold text-secondary-900 mb-6">lms/students</h1>
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center mb-6">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <FontAwesomeIcon
              icon={faSearch}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400"
            />
            <input
              type="text"
              placeholder="Buscar estudiantes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10"
            />
          </div>
        </div>

        <div className="flex gap-2 flex-wrap">
          <select
            value={filterState}
            onChange={(e) => setFilterState(e.target.value)}
            className="select"
          >
            <option value="all">Todos los estados</option>
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
          </select>

          <button className="btn btn-primary flex items-center gap-2 whitespace-nowrap">
            <FontAwesomeIcon icon={faUserPlus} />
            Agregar Estudiante
          </button>
        </div>
      </div>

      {/* Tabla de estudiantes */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary-50 border-b border-secondary-200">
              <tr>
                <th className="text-left p-4 text-sm font-semibold text-secondary-700">Estudiante</th>
                <th className="text-left p-4 text-sm font-semibold text-secondary-700">Email</th>
                <th className="text-left p-4 text-sm font-semibold text-secondary-700">Ubicación</th>
                <th className="text-left p-4 text-sm font-semibold text-secondary-700">Último Acceso</th>
                <th className="text-left p-4 text-sm font-semibold text-secondary-700">Estado</th>
                <th className="text-center p-4 text-sm font-semibold text-secondary-700">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student, index) => (
                <tr
                  key={student.id}
                  className={`border-b border-secondary-100 hover:bg-secondary-50 transition-colors animate-slide-up`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold text-sm">
                          {student.first_name.charAt(0)}{student.last_name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-secondary-900">
                          {student.first_name} {student.last_name}
                        </p>
                        <p className="text-xs text-secondary-600">
                          ID: {student.id}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <FontAwesomeIcon icon={faEnvelope} className="text-secondary-400 text-sm" />
                      <span className="text-sm text-secondary-700">{student.email}</span>
                      {student.email_verified_at ? (
                        <FontAwesomeIcon icon={faCheckCircle} className="text-green-600 text-xs" title="Email verificado" />
                      ) : (
                        <FontAwesomeIcon icon={faTimesCircle} className="text-red-600 text-xs" title="Email no verificado" />
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <FontAwesomeIcon icon={faMapMarkerAlt} className="text-secondary-400 text-sm" />
                      <span className="text-sm text-secondary-700">{student.country_location}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <FontAwesomeIcon icon={faCalendar} className="text-secondary-400 text-sm" />
                      <span className="text-sm text-secondary-700">
                        {student.last_access
                          ? new Date(student.last_access).toLocaleDateString('es-ES')
                          : 'Nunca'}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        student.state === 'activo'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {student.state.charAt(0).toUpperCase() + student.state.slice(1)}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-center gap-2">
                      <button className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-colors" title="Ver">
                        <FontAwesomeIcon icon={faEye} />
                      </button>
                      <button className="text-orange-600 hover:bg-orange-50 p-2 rounded-lg transition-colors" title="Editar">
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      <button className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors" title="Eliminar">
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredStudents.length === 0 && (
          <div className="text-center py-12">
            <p className="text-secondary-600">No se encontraron estudiantes</p>
          </div>
        )}
      </div>

      {/* Resumen */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card p-4 bg-gradient-to-br from-purple-50 to-purple-100">
          <p className="text-sm text-purple-700 mb-1">Total de Estudiantes</p>
          <p className="text-3xl font-heading font-bold text-purple-900">{students.length}</p>
        </div>
        <div className="card p-4 bg-gradient-to-br from-green-50 to-green-100">
          <p className="text-sm text-green-700 mb-1">Estudiantes Activos</p>
          <p className="text-3xl font-heading font-bold text-green-900">
            {students.filter(s => s.state === 'activo').length}
          </p>
        </div>
        <div className="card p-4 bg-gradient-to-br from-blue-50 to-blue-100">
          <p className="text-sm text-blue-700 mb-1">Emails Verificados</p>
          <p className="text-3xl font-heading font-bold text-blue-900">
            {students.filter(s => s.email_verified_at).length}
          </p>
        </div>
      </div>
    </div>
  );
};
