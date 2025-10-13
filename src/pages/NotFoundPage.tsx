import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle, faHome, faArrowLeft } from '@fortawesome/free-solid-svg-icons';

export const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-dark-600 to-smoky-600">
      <div className="text-center animate-fade-in">
        {/* Icon */}
        <div className="mb-8">
          <div className="inline-block p-8 bg-gradient-to-br from-danger/20 to-danger/30 rounded-full border-4 border-danger/50 shadow-2xl shadow-danger/20">
            <FontAwesomeIcon
              icon={faExclamationTriangle}
              className="text-8xl text-danger animate-pulse"
            />
          </div>
        </div>

        {/* Error Code */}
        <h1 className="text-9xl font-heading font-bold text-gradient mb-4">
          404
        </h1>

        {/* Message */}
        <h2 className="text-3xl font-heading font-semibold text-white mb-4">
          Página no encontrada
        </h2>
        <p className="text-gray-300 text-lg mb-8 max-w-md mx-auto">
          Lo sentimos, la página que estás buscando no existe o ha sido movida.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={() => navigate(-1)}
            className="btn bg-gradient-to-r from-gray-700 to-gray-800 text-gray-300 hover:from-gray-600 hover:to-gray-700 hover:text-white px-6 py-3 rounded-xl inline-flex items-center gap-3 border border-gray-700/50 hover:border-primary-500/50 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
            <span>Volver atrás</span>
          </button>

          <button
            onClick={() => navigate('/profile')}
            className="btn btn-primary px-6 py-3 rounded-xl inline-flex items-center gap-3 shadow-lg shadow-primary-500/20 hover:shadow-xl hover:shadow-primary-500/15 hover:scale-105 transition-all duration-300"
          >
            <FontAwesomeIcon icon={faHome} />
            <span>Ir al inicio</span>
          </button>
        </div>

        {/* Additional Info */}
        <div className="mt-12 text-gray-400 text-sm">
          <p>Si crees que esto es un error, por favor contacta al administrador</p>
        </div>
      </div>
    </div>
  );
};
