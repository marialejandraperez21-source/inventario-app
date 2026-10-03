import { HttpErrorResponse } from '@angular/common/http';

export function getErrorMessage(err: HttpErrorResponse): string {
  if (err.status === 0) {
    return 'No se pudo conectar con el servidor. Verifica que el backend esté en ejecución.';
  }
  if (err.status === 404) {
    return 'El recurso solicitado no existe.';
  }
  if (err.status === 422 && err.error?.errors) {
    return Object.values(err.error.errors).flat().join(' ');
  }
  return err.error?.message ?? 'Ocurrió un error inesperado.';
}