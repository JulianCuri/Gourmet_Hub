# Gourmet Hub

Proyecto full-stack para gestion de menus de comedor/catering.
Incluye frontend en React y backend en Spring Boot con autenticacion JWT y control de roles.

## Stack

- Frontend: React 18 (Create React App)
- Backend: Spring Boot 3.1.4 + Java 17+
- Base de datos: H2 en modo archivo (desarrollo)
- Seguridad: JWT con roles

## Roles y permisos

- `ROLE_USER`: acceso al panel publico
- `ROLE_ADMIN`: gestion de menus, items y caracteristicas
- `ROLE_SUPER_ADMIN`: todo lo anterior + gestion de administradores

## Funcionalidades principales

### Panel publico

- Visualizacion de menus disponibles
- Filtrado por tipo de evento (almuerzo/cena), semana y dias
- Reserva de menus

### Panel de administracion

- Gestion de menus (crear, editar, eliminar)
- Gestion de items (crear, editar, eliminar)
- Gestion de caracteristicas dinamicas por item (crear/eliminar)

### Gestion de administradores (solo `ROLE_SUPER_ADMIN`)

- Busqueda/listado de usuarios
- Asignacion y revocacion de rol `ROLE_ADMIN`

## Caracteristicas dinamicas por item

- Cada caracteristica tiene nombre unico e icono
- Se pueden asignar hasta 3 caracteristicas por item

### Eliminacion de caracteristicas en uso

Cuando intentas eliminar una caracteristica ya asignada a items:

- Se muestra un aviso indicando que items pueden verse afectados
- Si confirmas:
  - se elimina la caracteristica
  - se quita automaticamente de los items que la tenian asignada
- Si cancelas: no se elimina nada

## Ejecucion local

### 1. Clonar

```bash
git clone https://github.com/JulianCuri/Gourmet_Hub.git
cd Gourmet_Hub
```

### 2. Frontend (terminal 1)

```bash
cd gourmet-hub
npm install
npm start
```

Frontend: `http://localhost:3000`

### 3. Backend (terminal 2)

```bash
cd gourmet-hub/backend
mvn clean package -DskipTests
java -jar target/backend-0.0.1-SNAPSHOT.jar --spring.profiles.active=dev
```

Alternativa:

```bash
cd gourmet-hub/backend
mvn -DskipTests spring-boot:run -Dspring-boot.run.profiles=dev
```

Backend/API: `http://localhost:8080` (`/api/*`)

## Usuarios de prueba

El backend viene con un usuario super administrador preconfigurado:

- **Email**: `superadmin@example.com`
- **Contraseña**: `superadmin`
- **Rol**: `ROLE_SUPER_ADMIN`

Con este usuario podes acceder a todas las funcionalidades del panel de administracion, gestion de caracteristicas y gestion de roles de otros usuarios.

## Base de datos (H2)

- Modo archivo (persistente en desarrollo)
- Ubicacion principal: `gourmet-hub/backend/data/`
- Consola H2: `http://localhost:8080/h2-console`

Para resetear datos locales:

1. Detener backend
2. Borrar archivos en `gourmet-hub/backend/data/`
3. Levantar backend nuevamente

## Endpoints del backend

Con el backend corriendo en `http://localhost:8080`, tenes disponibles:

### Raiz y utilidad

- `GET /` → redirige automaticamente a `/api/items`
- `GET /health` → health check del servidor

### Autenticacion

- `POST /api/auth/register` → registro de nuevos usuarios
- `POST /api/auth/login` → login (devuelve token JWT)

### Items

- `GET /api/items` → listado completo de items
- `GET /api/items/{id}` → detalle de un item
- `POST /api/items` → crear item (requiere rol `ADMIN`)
- `PUT /api/items/{id}` → editar item (requiere rol `ADMIN`)
- `DELETE /api/items/{id}` → eliminar item (requiere rol `ADMIN`)

### Menus

- `GET /api/menus` → listado completo de menus
- `GET /api/menus/{id}` → detalle de un menu
- `POST /api/menus` → crear menu (requiere rol `ADMIN`)
- `PUT /api/menus/{id}` → editar menu (requiere rol `ADMIN`)
- `DELETE /api/menus/{id}` → eliminar menu (requiere rol `ADMIN`)

### Caracteristicas dinamicas

- `GET /api/characteristics` → listado de caracteristicas
- `POST /api/characteristics` → crear caracteristica (requiere rol `ADMIN`)
- `DELETE /api/characteristics/{id}` → eliminar caracteristica (requiere rol `ADMIN`)

### Gestion de administradores

- `GET /api/admins/search?email=...` → buscar usuarios (requiere rol `SUPER_ADMIN`)
- `POST /api/admins/{userId}/grant-admin` → asignar rol `ADMIN` (requiere rol `SUPER_ADMIN`)
- `POST /api/admins/{userId}/revoke-admin` → quitar rol `ADMIN` (requiere rol `SUPER_ADMIN`)

### Desarrollo

- `POST /api/debug/delete-item/{id}` → eliminar item sin autenticacion (solo desarrollo)
- `GET /h2-console` → consola web de la base de datos H2

## Estructura (resumen)

```text
gourmet-hub/
  src/                    # Frontend React
  backend/
    src/main/java/...     # Backend Spring Boot
    src/main/resources/   # Configuracion
```

## Notas utiles

- Las fechas/horas de cierre se manejan en hora local y formato 24h
- Si Maven no puede borrar el jar en Windows, detiene primero el proceso Java activo

## Autor

- Julian Curi
