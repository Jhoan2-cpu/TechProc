// Mock Service Base - Simula llamadas a API con datos mock
// Este servicio será reemplazado por llamadas reales cuando la API esté lista

const MOCK_DELAY = 500; // Simula latencia de red (en ms)

export const mockApiCall = <T>(data: T, delay: number = MOCK_DELAY): Promise<T> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data);
    }, delay);
  });
};

export const mockApiError = (message: string, delay: number = MOCK_DELAY): Promise<never> => {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error(message));
    }, delay);
  });
};
