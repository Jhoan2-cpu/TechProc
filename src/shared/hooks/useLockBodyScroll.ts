import { useEffect } from 'react';

/**
 * Hook para bloquear el scroll del body y del contenedor main cuando un modal está abierto
 * Esto previene que el contenido debajo del modal se pueda scrollear
 */
export const useLockBodyScroll = () => {
  useEffect(() => {
    // Guardar el overflow actual del body
    const originalBodyOverflow = window.getComputedStyle(document.body).overflow;

    // Encontrar el elemento main y guardar su overflow
    const mainElement = document.querySelector('main');
    const originalMainOverflow = mainElement ? window.getComputedStyle(mainElement).overflow : null;

    // Bloquear el scroll del body
    document.body.style.overflow = 'hidden';

    // Bloquear el scroll del main si existe
    if (mainElement) {
      mainElement.style.overflow = 'hidden';
    }

    // Cleanup: restaurar el overflow original cuando el componente se desmonte
    return () => {
      document.body.style.overflow = originalBodyOverflow;
      if (mainElement && originalMainOverflow) {
        mainElement.style.overflow = originalMainOverflow;
      }
    };
  }, []);
};
