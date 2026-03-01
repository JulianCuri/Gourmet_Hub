# Gourmet Hub

Proyecto full-stack para gestión de menús de servicio de catering. Frontend (React) + Backend (Spring Boot con autenticación JWT y control de roles).

## Resumen del Proyecto

**Gourmet Hub** es una plataforma integral para la gestión de menús y administración de usuarios con roles diferenciados:

- **Frontend**: Create React App (React 18) en `gourmet-hub/` - Interfaz de usuario responsiva con panel de administración
- **Backend**: Spring Boot 3.1.4 (Java 20) en `gourmet-hub/backend` - API REST con autenticación JWT y autorización basada en roles
- **Base de datos**: H2 en modo archivo (desarrollo)
- **Autenticación**: JWT (JSON Web Tokens) con roles: `ROLE_USER`, `ROLE_ADMIN`, `ROLE_SUPER_ADMIN`

## Características Principales

### Panel Público (sin autenticación)
- Visualización de menús disponibles por semana
- Filtrado por tipo de evento (Almuerzo/Cena) y días
- Catálogo de ítems (platos principales, postes, bebidas)
- Reserva de menús

### Panel de Administración (ROLE_ADMIN y ROLE_SUPER_ADMIN)
- Gestión de menús (crear, editar, eliminar)
- Gestión de ítems (crear, editar, eliminar)
- Sistema de características personalizables por ítem (hasta 3)

### Gestión de Administradores (ROLE_SUPER_ADMIN solamente)
- Búsqueda y listado de usuarios
- Asignación/revocación del rol ROLE_ADMIN
- Protección: solo super administrador puede acceder

## Requisitos

- **Node.js** v16+ y npm
- **Java 20** (o compatible) y Maven 3.6+
- **Git**

## Inicio Rápido

### 1. Clonar el repositorio
```bash
git clone https://github.com/JulianCuri/Gourmet_Hub.git
cd Gourmet_Hub
```

### 2. Instalar y ejecutar el Frontend (Terminal 1)
```bash
# Desde la raíz del proyecto
npm install
npm start
```
La aplicación React se abrirá en `http://localhost:3000` y realizará peticiones proxy a `http://localhost:8080`.

### 3. Ejecutar el Backend (Terminal 2)
```bash
cd backend

# Opción 1: Usando Maven (genera JAR automáticamente)
mvn clean install -DskipTests
java -jar target/backend-0.0.1-SNAPSHOT.jar --spring.profiles.active=dev

# Opción 2: Usando Maven directamente (más lento en primera ejecución)
mvn -DskipTests spring-boot:run -Dspring-boot.run.profiles=dev
```

El backend estará disponible en `http://localhost:8080` con endpoints en `/api/*`.

## Configuración

### Base de Datos (H2)
- **Ubicación**: `backend/data/` (archivos de BD local)
- **Modo**: Archivo con `AUTO_SERVER=TRUE` para evitar bloqueos
- **Configuración**: Ver `backend/src/main/resources/application-dev.properties`

### Usuario Super Administrador por Defecto
Se crea automáticamente en el seeding de la aplicación (ver `DataInitializer.java`):

**Email**: `superadmin@example.com`  
**Contraseña**: `superadmin`  
**Rol**: `ROLE_SUPER_ADMIN`

### CORS
El frontend en `localhost:3000` está permitido para realizar peticiones autenticadas. Ver `SecurityConfig.java` en el backend.

## Estructura del Proyecto

```
.
├── README.md
├── package.json                                    # Dependencias del frontend
├── gourmet-hub/
│   ├── public/                                    # Activos estáticos
│   │   ├── images/
│   │   │   ├── principales/                      # Imágenes de platos principales
│   │   │   ├── postres/                          # Imágenes de postres
│   │   │   └── bebidas/                          # Imágenes de bebidas
│   │   └── index.html
│   └── src/
│       ├── App.js                                # Componente raíz con rutas
│       ├── components/
│       │   ├── Admin/                            # Componentes del panel admin
│       │   │   ├── AdminLayout/
│       │   │   ├── MenuForm/
│       │   │   ├── MenuList/
│       │   │   ├── ItemForm/
│       │   │   ├── ItemList/
│       │   │   └── ManageAdmins/
│       │   ├── Auth/                             # Autenticación y autorización
│       │   │   ├── Login.js
│       │   │   └── NotAuthorizedAdmin.js
│       │   ├── Header/
│       │   ├── Footer/
│       │   ├── Main/
│       │   ├── MenuCard/
│       │   └── ItemCard/
│       ├── pages/
│       │   ├── Admin/AdminPage.js
│       │   └── MainPage.js
│       ├── mock/                                 # Datos de prueba
│       │   ├── items.js
│       │   └── menus.js
│       └── setupProxy.js                         # Proxy para dev (localhost:3000 → localhost:8080)
│
└── backend/
    ├── pom.xml
    ├── src/main/
    │   ├── java/com/gourmethub/backend/
    │   │   ├── config/
    │   │   │   ├── JwtFilter.java                # Filtro de autenticación JWT
    │   │   │   ├── JwtUtil.java                  # Utilidades para JWT
    │   │   │   └── SecurityConfig.java           # Configuración de seguridad
    │   │   ├── controller/
    │   │   │   ├── AuthController.java           # Endpoints de login
    │   │   │   ├── AdminController.java          # Gestión de admins
    │   │   │   ├── MenuController.java           # CRUD de menús
    │   │   │   └── ItemController.java           # CRUD de ítems
    │   │   ├── model/
    │   │   │   ├── User.java
    │   │   │   ├── Menu.java
    │   │   │   └── Item.java
    │   │   ├── repository/
    │   │   │   ├── UserRepository.java
    │   │   │   ├── MenuRepository.java
    │   │   │   └── ItemRepository.java
    │   │   └── BackendApplication.java
    │   └── resources/
    │       ├── application.properties
    │       ├── application-dev.properties         # Configuración para desarrollo
    │       └── data.sql                           # Seeding inicial
    └── data/                                      # Base de datos H2 (generada en runtime)
```

## Flujo de Autenticación

1. **Login**: Usuario ingresa email y contraseña en `/administracion/login`
2. **JWT**: Backend emite un token JWT que incluye email, nombre y roles
3. **Almacenamiento**: Token se guarda en `localStorage`
4. **Autorización**: Cada request incluye el token en header `Authorization: Bearer <token>`
5. **Extracción**: Backend valida el token y extrae roles para autorizar acciones específicas

## Rutas Protegidas por Rol

### Accesibles con ROLE_ADMIN o ROLE_SUPER_ADMIN
- `/administracion` - Panel principal
- `/administracion/agregar-menu` - Crear menús
- `/administracion/editar-menu/:id` - Editar menús
- `/administracion/items` - Gestión de ítems
- `/administracion/agregar-item` - Crear ítems

### Accesibles solo con ROLE_SUPER_ADMIN
- `/administracion/gestionar-admins` - Gestión de administradores y asignación de roles

## Notas Importantes

### Zona Horaria
- Las fechas de cierre de menú se guardan en **hora local** sin conversión UTC
- Se muestran en formato **24 horas** (HH:mm) en todo el panel
- Validación: solo se permiten menús de lunes a viernes

### Base de Datos
- H2 en modo archivo: cambios persisten entre reinicios
- Ubicación: `backend/data/gourmet.db` y archivos relacionados
- Para resetear: detener backend, eliminar carpeta `backend/data/`, reiniciar

### Problemas Comunes

**Puerto 3000/8080 en uso**:
```bash
# Cambiar puerto del frontend en package.json o ejecutar:
PORT=3001 npm start

# Para backend, cambiar en application-dev.properties:
server.port=8081
```

**H2 bloqueado (WARNING: Can't open URL)**:
- Backend ya está ejecutándose en otra terminal
- O reiniciar eliminando `backend/data/` y ejecutar nuevamente

**CORS error al hacer peticiones**:
- Verificar que el proxy en `setupProxy.js` esté configurado correctamente
- Backend debe tener CORS habilitado para `http://localhost:3000`

## Desarrollo y Testing

### Frontend Tests
```bash
npm test
```

### Frontend Build
```bash
npm run build
```

### Backend Tests
```bash
cd backend
mvn test
```

## Despliegue

Para desplegar a producción:

1. **Frontend**: 
   ```bash
   npm run build
   # Servir contenido de build/ desde un servidor web o plataforma como Vercel/Netlify
   ```

2. **Backend**:
   - Configurar base de datos PostgreSQL/MySQL (modificar `application.properties`)
   - Cambiar JWT secret a un valor seguro (`JwtUtil.SECRET`)
   - Desabilitar H2 console en producción
   - Usar variable de entorno para JWT_SECRET

```bash
java -jar backend-0.0.1-SNAPSHOT.jar --spring.profiles.active=prod
```

## Contacto y Soporte

Si experimentas problemas al ejecutar el proyecto:
- Verifica que Node.js v16+ y Java 20 estén instalados: `node --version` y `java -version`
- Asegúrate que los puertos 3000 y 8080 estén disponibles
- Revisa los logs del backend en la terminal de ejecución
- Limpia caché y reinstala dependencias si es necesario

---

**Autor**: Julián Curi  
**Curso**: Desarrollo Web Full-Stack  
**Última actualización**: Marzo 2026
