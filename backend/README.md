Gourmet Hub - Backend (Spring Boot)

Quick start (dev):

1. From repository root:
   cd backend
   mvn spring-boot:run

2. API:
   - POST /api/auth/register { email, password }
   - POST /api/auth/login { email, password } -> { token, email }

3. H2 console: http://localhost:8080/h2-console (JDBC URL: jdbc:h2:mem:gourmet)
4. Swagger UI: http://localhost:8080/swagger-ui/index.html

Dev notes:
- The backend for user authentication/management is planned for Sprint-2. This backend currently focuses on Items and Menus for Sprint-1.
- JWT secret is in application-dev.properties (base64) for dev only.
