export const UsersPage = () => {
  return (
    <div>
      <h1 className="text-3xl font-heading font-bold text-secondary-900 mb-6">users/management</h1>
      <h2>Administración de Usuarios del Sistema</h2>
      <ul>
        <li>Crear Usuarios</li>
        <li>Editar Permisos</li>
        <li>Asignar Roles</li>
        <li>Desactivar/Activar Usuarios</li>
      </ul>
      <h3>Tipos de Usuario:</h3>
      <ul>
        <li>Administrador (acceso total)</li>
        <li>Gestor LMS</li>
        <li>Soporte Técnico - Seguridad</li>
        <li>Soporte Técnico - Infraestructura</li>
        <li>Developer Web</li>
        <li>Analista de Datos</li>
      </ul>
    </div>
  );
};
