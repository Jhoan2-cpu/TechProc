import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

export const Preloader = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 animate-fade-in bg-gradient-to-br from-dark-700 via-secondary-600 to-dark-500">
      <div className="absolute inset-0 bg-gradient-to-tr from-primary-500/10 via-transparent to-primary-600/10 animate-pulse"></div>

      <div className="text-center relative z-10">
        <div className="mb-6 animate-scale-in">
          <div className="relative">
            <FontAwesomeIcon
              icon={faSpinner}
              className="text-primary-500 text-6xl animate-spin drop-shadow-[0_0_15px_rgba(38,187,255,0.5)]"
            />
          </div>
        </div>
        <h2 className="text-white text-2xl font-heading font-semibold animate-slide-up drop-shadow-lg">
          TechProc
        </h2>
        <p className="text-primary-300 mt-2 animate-slide-up">
          Cargando sistema...
        </p>
      </div>
    </div>
  );
};
