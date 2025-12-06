# Gourmet Hub

Proyecto full-stack para el curso: frontend (React) + backend (Spring Boot).

## Resumen
- Frontend: Create React App en `gourmet-hub/` (dev server en `http://localhost:3000`).
- Backend: Spring Boot en `gourmet-hub/backend` (servidor en `http://localhost:8080`).

Este repositorio contiene el código fuente necesario para ejecutar localmente ambas partes.

## Requisitos
- Node.js (v16+ recomendado) y `npm`
- Java 17+ y Maven

## Instrucciones rápidas (después de clonar)

1. Clonar el repositorio:

```powershell
git clone https://github.com/JulianCuri/Gourmet_Hub.git
cd Gourmet_Hub
```

2. Instalar dependencias del frontend y arrancarlo (terminal 1):

```powershell
npm install
npm start
```

Esto iniciará la app React en `http://localhost:3000`. La app hace llamadas a la API en `http://localhost:8080`.

3. Ejecutar el backend (terminal 2):

```powershell
cd backend
mvn -DskipTests spring-boot:run
# opción: mvn -DskipTests spring-boot:run -Dspring-boot.run.profiles=dev
```

El backend expondrá los endpoints REST en `http://localhost:8080/api/*`.

## Notas importantes
- La base de datos usada en desarrollo es H2 en modo archivo y los ficheros se crean bajo `backend/data/`.
- Para evitar problemas de bloqueo con H2 cuando ejecutes varias instancias, evita arrancar más de un proceso que use la misma carpeta `data` o usa el modo `AUTO_SERVER` (ver `backend/src/main/resources/application-dev.properties`).
- Hemos añadido reglas a `.gitignore` para evitar subir artefactos/DB/logs: `backend/target/`, `backend/data/`, `backend/logs/`.

## Qué contiene el repositorio
- `src/` — código del frontend (CRA).
- `backend/src/` — código fuente Java del backend (Spring Boot).
- `backend/pom.xml` — Maven pom del backend.

## Consejos para entregar al curso
- Incluye en la descripción de la entrega los comandos anteriores para que el corrector pueda arrancar frontend y backend.
- Si necesitas eliminar artefactos grandes del historial Git (jar, DBs), contactame y te ayudo con `git filter-repo` o BFG (nota: reescribe la historia del repo).

## Contacto
Si algo no arranca en tu máquina (errores de H2, puertos en uso, o dependencias faltantes) házmelo saber y te ayudo a diagnosticar.
# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
