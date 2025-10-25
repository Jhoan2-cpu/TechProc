import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface PortalProps {
  children: React.ReactNode;
}

/**
 * Componente Portal para renderizar contenido fuera del DOM actual
 * Útil para modales y overlays que necesitan estar en la capa superior
 * independientemente de su posición en el árbol de componentes
 */
export const Portal = ({ children }: PortalProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted) return null;

  // Renderizar en el body para evitar problemas de z-index y posicionamiento
  return createPortal(children, document.body);
};
