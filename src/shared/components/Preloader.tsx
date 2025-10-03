import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

export const Preloader = () => {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center z-50 animate-fade-in">
      <div className="text-center">
        <div className="mb-6 animate-scale-in">
          <FontAwesomeIcon
            icon={faSpinner}
            className="text-white text-6xl animate-spin"
          />
        </div>
        <h2 className="text-white text-2xl font-heading font-semibold animate-slide-up">
          TechProc
        </h2>
        <p className="text-primary-100 mt-2 animate-slide-up">
          Cargando sistema...
        </p>
      </div>
    </div>
  );
};
