# DM Assistant 5e

Herramienta interactiva para asistir a un **Dungeon Master** durante sus partidas de **Dungeons & Dragons 5e**. Funciona en navegadores web (diseño responsivo, *mobile-first*) y como aplicación **Android** (`.apk`) mediante un contenedor híbrido con CapacitorJS.

Taller práctico individual de *Desarrollo de Aplicaciones Multiplataforma* (Ingeniería Multimedia).

## Enlaces

| Recurso | Enlace |
| --- | --- |
| Aplicación web (Vercel) | https://tallerweb3ercorte.vercel.app |
| APK de Android (GitHub Releases) | https://github.com/jriossocha-boop/Taller_Web_3erCorte/releases/tag/v1.0.0 |
|Descarga directa: [DM-Assistant-v1.0.0.apk] |(https://github.com/jriossocha-boop/Taller_Web_3erCorte/releases/download/v1.0.0/DM-Assistant-v1.0.0.apk) |

## Módulos

### 1. Bestiario
- Consume `/api/monsters` de la [API de D&D 5e](https://www.dnd5eapi.co/api/).
- Búsqueda por nombre y filtros por **tipo** y **tamaño**.
- Tarjeta genérica y reutilizable (`MonsterCard`) que recibe título y estadísticas por props: tipo, tamaño, Clase de Armadura (CA), Puntos de Golpe (PG) y Nivel de Desafío (CR).
- Ficha detallada en modal: atributos, acciones de combate, imagen, XP y más.
- Los detalles se cargan por lotes en paralelo, por lo que las estadísticas aparecen de forma progresiva.

### 2. Generador de Loot
- Se elige el **nivel de desafío (CR)** del monstruo derrotado.
- Monedas aleatorias (cp, sp, gp, pp) que escalan con el CR.
- Objetos reales obtenidos de `/api/equipment` y, en CR altos, objetos mágicos reales de `/api/magic-items` (con rareza y descripción).
- La cantidad y la calidad del botín dependen del CR: filtro por valor en monedas de oro y más objetos mágicos en niveles altos.
- Los detalles del equipo se guardan en una caché global para no repetir peticiones a la API.

### 3. Bandeja de dados
- Dados estándar: **d4, d6, d8, d10, d12, d20 y d100**.
- Cada tirada genera un resultado dentro del rango correcto de cada dado.
- Animación del lanzamiento, resultado destacado, color personalizable e historial de las últimas tiradas.

## Tecnologías

- [React](https://react.dev/) + [Vite](https://vite.dev/)
- JavaScript y CSS con [Tailwind CSS](https://tailwindcss.com/)
- [CapacitorJS](https://capacitorjs.com/) (`@capacitor/core`, `@capacitor/cli`, `@capacitor/android`)
- API pública [dnd5eapi.co](https://www.dnd5eapi.co/api/) (sin autenticación)
- Despliegue en [Vercel](https://vercel.com/) y empaquetado con Android Studio

## Estructura del proyecto

```
src/
├── App.jsx
├── main.jsx
├── index.css
└── components/
    ├── layout/       # Navbar, Footer
    ├── bestiary/     # MonsterList, MonsterCard, MonsterDetailModal
    ├── loot/         # LootGenerator, LootResult
    ├── dice/         # DiceRoller, DiceButton
    └── services/     # dndApi.jsx (consumo de la API y caché)
android/              # Proyecto nativo generado con Capacitor
```

## Ejecutar en local

Requisitos: [Node.js](https://nodejs.org/) 18 o superior.

```bash
git clone https://github.com/TU-USUARIO/TU-REPOSITORIO.git
cd TU-REPOSITORIO
npm install
npm run dev
```

La aplicación queda disponible en `http://localhost:5173`.

Para generar la versión de producción (carpeta `dist/`):

```bash
npm run build
npm run preview
```

## Generar el APK de Android

1. Compilar la web: `npm run build`
2. Sincronizar con Capacitor: `npx cap sync android`
3. Abrir el proyecto en Android Studio: `npx cap open android`
4. Menú **Build > Build Bundle(s) / APK(s) > Build APK(s)**
5. El archivo se genera en `android/app/build/outputs/apk/debug/app-debug.apk`

El APK instalable se publica en la sección **Releases** del repositorio (versión `v1.0.0`).

## Despliegue

La aplicación web se despliega de forma continua en Vercel: cada `push` a la rama principal genera un nuevo despliegue de producción.

## Autor

Juan Sebastian Rios Socha — Taller 3er Corte, Desarrollo de Aplicaciones Multiplataforma.

Los datos de monstruos y objetos pertenecen a la [D&D 5e API](https://www.dnd5eapi.co/) y al contenido SRD de Dungeons & Dragons.