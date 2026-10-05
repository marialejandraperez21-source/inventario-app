import { HttpErrorResponse } from '@angular/common/http';

// Convierte un error de la API en un mensaje claro para mostrar en pantalla.
// Lo uso en varios componentes para no repetir este código.
export function getErrorMessage(err: HttpErrorResponse): string {
  // status 0 significa que la petición ni siquiera llegó al servidor (backend apagado o sin conexión)
  if (err.status === 0) {
    return 'No se pudo conectar con el servidor. Verifica que el backend esté en ejecución.';
  }
  // 404: el recurso no existe
  if (err.status === 404) {
    return 'El recurso solicitado no existe.';
  }
  // 422: la API rechazó los datos. Los errores vienen en err.error.errors,
  // y los junto todos en un solo texto.
  if (err.status === 422 && err.error?.errors) {
    return Object.values(err.error.errors).flat().join(' ');
  }
  // Cualquier otro caso: uso el mensaje que envió la API (por ejemplo, el del 409)
  return err.error?.message ?? 'Ocurrió un error inesperado.';
}
