# Inventario App

Prueba técnica: sistema para gestionar productos y movimientos de inventario (entradas y salidas).

## Tecnologías

- **Backend:** Laravel (PHP), API REST
- **Frontend:** Angular y Bootstrap
- **Base de datos:** MySQL

## Qué hace

- CRUD de productos (crear, listar, editar y eliminar).
- Registro de entradas y salidas de inventario. El stock se actualiza solo.
- No permite una salida mayor al stock disponible.
- Historial de movimientos, con fecha, producto, tipo, cantidad y descripción.

## Cómo ejecutarlo

Necesitas PHP, Composer, MySQL, Node.js y Angular CLI (`npm install -g @angular/cli`).

**1. Clonar el proyecto**

```bash
git clone https://github.com/marialejandraperez21-source/inventario-app.git
cd inventario-app
```

**2. Crear la base de datos**

```sql
CREATE DATABASE inventario_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

**3. Backend**

```bash
cd backend
composer install
copy .env.example .env
php artisan key:generate
```

En el archivo `.env` configura la base de datos:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=inventario_db
DB_USERNAME=root
DB_PASSWORD=
```

Después:

```bash
php artisan migrate
php artisan serve
```

La API queda en `http://127.0.0.1:8000/api`.

**4. Frontend** (en otra terminal)

```bash
cd frontend
npm install
ng serve
```

La aplicación queda en `http://localhost:4200`.

## Endpoints

| Método | Ruta | Qué hace |
|---|---|---|
| GET | `/api/products` | Lista los productos |
| POST | `/api/products` | Crea un producto |
| GET | `/api/products/{id}` | Consulta un producto |
| PUT | `/api/products/{id}` | Edita un producto (no cambia el stock) |
| DELETE | `/api/products/{id}` | Elimina un producto |
| GET | `/api/inventory-movements` | Lista los movimientos |
| POST | `/api/inventory-movements` | Registra una entrada o salida |

Ejemplo para registrar una salida:

```json
{ "product_id": 1, "type": "OUT", "quantity": 3, "description": "Venta" }
```

Si no hay stock suficiente, la API responde con un error 422 y el mensaje "Stock insuficiente".

## Cómo funciona el inventario

- Cada movimiento es una **entrada** (`IN`) que suma al stock o una **salida** (`OUT`) que resta.
- Al registrar un movimiento se usa una **transacción**: el movimiento y el cambio de stock se guardan juntos, y si algo falla no se guarda nada.
- Antes de una salida se revisa que haya stock suficiente.
- Se bloquea la fila del producto mientras se procesa el movimiento, para que dos salidas al mismo tiempo no dejen el stock en negativo.
- El stock solo se escribe al crear el producto. Después cambia únicamente con movimientos, no al editar.
- Un producto que ya tiene movimientos no se puede eliminar, para no perder el historial.

## Estructura

```
inventario-app/
├── backend/    API en Laravel (controladores, modelos, validaciones, migraciones y rutas)
└── frontend/   Aplicación en Angular (pantallas, servicios y modelos)
```

## Mejoras pendientes

- Login de usuarios.
- Pruebas automáticas.
- Paginación y búsqueda en las listas.
- Registrar el stock inicial como un movimiento.
