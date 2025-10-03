import type { ReactNode } from 'react';

interface MainLayoutProps {
  children: ReactNode;
  module?: string;
}

export const MainLayout = ({ children, module }: MainLayoutProps) => {
  return (
    <div className="app-layout">
      <aside className="sidebar">
        <h2>TechProc</h2>
        <nav>
          <a href="/lms">LMS</a>
          <a href="/tickets">Tickets</a>
          <a href="/security">Seguridad</a>
          <a href="/infrastructure">Infraestructura</a>
          <a href="/web">Web</a>
          <a href="/analytics">Analítica</a>
        </nav>
      </aside>
      <main className={`main-content ${module ? `module-${module}` : ''}`}>
        {children}
      </main>
    </div>
  );
};
