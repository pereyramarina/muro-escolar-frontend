# 🎨 Muro Escolar - Frontend

## 📝 Descripción del Proyecto
La aplicación cliente de **Muro Escolar** es una interfaz dinámica y adaptativa. Está diseñada para facilitar la interacción de la comunidad educativa, permitiendo una navegación intuitiva, la gestión visual de proyectos y la lectura de estadísticas, todo respaldado por un acceso seguro e inmediato.

---

## 👥 Perfiles Institucionales

| Rol de Usuario | Nivel de Acceso y Funciones |
| :--- | :--- |
| **Directivo** | Acceso total. Supervisión del sistema y visualización del panel de métricas globales. |
| **Docente** | Gestión de aulas. Seguimiento de proyectos y emisión de devoluciones a los estudiantes. |
| **Alumno** | Acceso personal. Carga de obras, visualización de portafolio y lectura de feedback. |

---

## ✨ Características Principales
* **Sesiones Persistentes:** Autenticación fluida que almacena de forma segura los tokens JWT, evitando inicios de sesión repetitivos al abrir la aplicación.
* **Vistas Dinámicas:** El dashboard adapta su menú y sus herramientas de forma automática según el rol del usuario autenticado.
* **Sistema de Feedback:** Interfaz dedicada a la comunicación constructiva y evaluación de las obras artísticas.
* **Reportes Estadísticos:** Gráficos y resúmenes de actividad consultados en tiempo real desde la red de microservicios.

---

## 🚀 Guía de Instalación y Ejecución

1. Clonar el repositorio en el entorno local.
2. Ejecutar el comando `npm install` para integrar todas las librerías de la interfaz.
3. Confirmar que el backend (API Gateway) se encuentre en ejecución en el puerto `3000`.
4. Ejecutar el comando de inicio (por ejemplo, `npm run start` o `npm run dev` según el framework utilizado).