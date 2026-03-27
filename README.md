Si queres ver como funciona la app podes entrar desde este link https://zxgym-frontend.onrender.com :D

Todos los datos guardados en la db son ficticios, estan completados por amigos para probar el funcionamiento de la app, pero no son reales.

ZXGym - Es una pagina web basada en un gimnasio ficticio
La diseñe principalmente pensando en como funciona la administracion de un gimnasio, esta diseñada con un enfoque en la escalabilidad por si algun dia en el futuro se me ocurren nuevas funciones, cuenta con rendimiento y una experiencia de usuario fluida. El sistema permite gestionar socios, staff técnico (entrenadores) y administradores.

Tecnologías Principales:

Para el back use C# en .NET y EF. Con eso desarrolle una API REST capaz de respoonder las necesidades de la pagina

Frontend: Interfaz construida con React, con componentes modulares y gestión de estados con Hooks. Personalizado mediante CSS modular para la separación de responsabilidades, evitar conflictos de estilos y facilitar el mantenimiento a largo plazo.

Características principales:

Gestión de Staff y Permisos: Implementación de un sistema de invitaciones basado en tokens para registrar Managers (acceso total) y Entrenadores (acceso parcial).

Formularios: Flujos de registro divididos por fases (datos personales y problemas de salud) con validaciones en tiempo real y componentes personalizados como el sistema de patologías (socios). Ademas agregue un sistema de hasheo con BCrypt para las contraseñas de todos los usuarios.

Tablas para la visualización de datos con soporte para búsqueda avanzada, filtrado dinámico por estados y ordenamiento configurable.

