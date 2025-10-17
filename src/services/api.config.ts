// Configuración global de la API según especificación BACKEND_API_SPECIFICATION.md
export const API_CONFIG = {
  // Base URL según especificación
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1',
  TIMEOUT: 30000,
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
};

// Tipos de error según especificación
export interface ApiError {
  error: {
    code: string;
    message: string;
    details?: Array<{
      field: string;
      message: string;
    }>;
    timestamp?: string;
    request_id?: string;
  };
}

// Helper para construir URLs
export const buildUrl = (endpoint: string): string => {
  // Asegurar que el endpoint empiece con /
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${API_CONFIG.BASE_URL}${cleanEndpoint}`;
};

// Helper para manejar respuestas según especificación
export const handleResponse = async <T>(response: Response): Promise<T> => {
  // Para respuestas 204 No Content
  if (response.status === 204) {
    return undefined as T;
  }

  const contentType = response.headers.get('content-type');
  const isJson = contentType?.includes('application/json');

  if (!response.ok) {
    if (isJson) {
      const errorData: ApiError = await response.json();

      // Crear mensaje de error detallado
      let errorMessage = errorData.error.message || 'Error en la solicitud';

      // Agregar detalles de validación si existen
      if (errorData.error.details && errorData.error.details.length > 0) {
        const fieldErrors = errorData.error.details
          .map(d => `${d.field}: ${d.message}`)
          .join(', ');
        errorMessage += ` (${fieldErrors})`;
      }

      const error = new Error(errorMessage) as Error & { code?: string; status?: number; details?: Array<{ field: string; message: string }> | undefined };
      error.code = errorData.error.code;
      error.status = response.status;
      error.details = errorData.error.details;
      throw error;
    } else {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  }

  return isJson ? response.json() : (await response.text() as unknown as T);
};

// Helper para hacer peticiones con auto-refresh de token
export const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const url = buildUrl(endpoint);

  const config: RequestInit = {
    ...options,
    headers: {
      ...API_CONFIG.HEADERS,
      ...options.headers,
    },
  };

  // Agregar token de autenticación si existe
  const token = sessionStorage.getItem('auth_token');
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }

  try {
    const response = await fetch(url, config);
    return handleResponse<T>(response);
  } catch (error: unknown) {
    // Si el token expiró, intentar refrescar
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      (error as { code: string }).code === 'TOKEN_EXPIRED' &&
      !endpoint.includes('/auth/')
    ) {
      const refreshToken = sessionStorage.getItem('refresh_token');
      if (refreshToken) {
        try {
          // Intentar refrescar el token
          const refreshResponse = await fetch(buildUrl('/auth/refresh'), {
            method: 'POST',
            headers: API_CONFIG.HEADERS,
            body: JSON.stringify({ refreshToken }),
          });

          if (refreshResponse.ok) {
            const { token: newToken } = await refreshResponse.json();
            sessionStorage.setItem('auth_token', newToken);

            // Reintentar la petición original con el nuevo token
            config.headers = {
              ...config.headers,
              Authorization: `Bearer ${newToken}`,
            };
            const retryResponse = await fetch(url, config);
            return handleResponse<T>(retryResponse);
          }
        } catch {
          // Si falla el refresh, limpiar sesión
          sessionStorage.removeItem('auth_token');
          sessionStorage.removeItem('refresh_token');
          window.location.href = '/login';
        }
      }
    }

    console.error('API Request Error:', error);
    throw error;
  }
};
