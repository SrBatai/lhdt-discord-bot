# Web Dashboard - LHDT Discord Bot

Este es el dashboard web para monitorear y gestionar el Bot de Discord de LHDT.

## 🎨 Características

- **Dashboard en Tiempo Real**: Visualiza estadísticas del bot en tiempo real
- **Gestión de Roles**: Monitorea los roles por nivel y su distribución
- **Interfaz Moderna**: Diseño profesional con Tailwind CSS y tema de Discord
- **Responsive**: Funciona perfectamente en dispositivos móviles y desktop

## 🚀 Inicio Rápido

### Desarrollo

Para iniciar el servidor de desarrollo:

```bash
npm run web:dev
```

El dashboard estará disponible en [http://localhost:3000](http://localhost:3000)

### Producción

Para construir la aplicación para producción:

```bash
npm run web:build
npm run web:start
```

## 📁 Estructura del Proyecto

```
├── pages/
│   ├── _app.tsx        # Configuración de la aplicación Next.js
│   ├── index.tsx       # Página principal (redirige a Home)
│   └── Home.tsx        # Dashboard principal
├── styles/
│   └── globals.css     # Estilos globales con Tailwind CSS
├── public/             # Archivos estáticos
├── components/         # Componentes reutilizables (futuro)
├── next.config.js      # Configuración de Next.js
├── tailwind.config.js  # Configuración de Tailwind CSS
└── tsconfig.json       # Configuración de TypeScript
```

## 🎯 Página Home.tsx

La página principal (`pages/Home.tsx`) incluye:

### Componentes Principales

1. **Header**: Muestra el logo, nombre del bot y estado de conexión
2. **StatCards**: Tarjetas con estadísticas clave:
   - Usuarios Conectados
   - Roles Gestionados
   - Subidas de Nivel (Hoy)
   - Última Sincronización
3. **Roles por Nivel**: Sección que muestra todos los roles disponibles y cuántos usuarios tienen cada uno
4. **Features**: Tarjetas informativas sobre las funcionalidades del bot

### Diseño

- **Colores**: Utiliza la paleta oficial de Discord
  - Blurple: `#5865F2`
  - Green: `#57F287`
  - Yellow: `#FEE75C`
  - Fuchsia: `#EB459E`
  - Red: `#ED4245`
  - Dark: `#23272A`
  - Not Quite Black: `#2C2F33`
  - Greyple: `#99AAB5`

- **Gradientes**: Fondos con degradados suaves
- **Animaciones**: Efectos hover y transiciones suaves
- **Responsive**: Grid adaptable para diferentes tamaños de pantalla

## 🔧 Tecnologías Utilizadas

- **Next.js 16**: Framework de React para aplicaciones web
- **React 19**: Biblioteca de UI
- **TypeScript**: Tipado estático para JavaScript
- **Tailwind CSS v4**: Framework de CSS utility-first
- **PostCSS**: Procesador de CSS

## 📊 Datos Simulados

Actualmente, el dashboard usa datos simulados para demostración. En el futuro, se conectará a:

- API del bot de Discord para estadísticas en tiempo real
- Supabase para datos de usuarios y roles
- WebSockets para actualizaciones en tiempo real

## 🎨 Personalización

### Modificar Colores

Edita `styles/globals.css` en la sección `@theme`:

```css
@theme {
  --color-discord-blurple: #5865F2;
  --color-discord-green: #57F287;
  /* ... más colores */
}
```

### Agregar Nuevos Componentes

Crea componentes reutilizables en la carpeta `components/`:

```tsx
// components/MyComponent.tsx
export default function MyComponent() {
  return <div>Mi componente</div>
}
```

### Modificar el Dashboard

El archivo principal es `pages/Home.tsx`. Puedes modificar:

- Las estadísticas mostradas
- Los roles disponibles
- El diseño y estructura
- Los colores y estilos

## 🚀 Próximas Funcionalidades

- [ ] Integración con API del bot para datos reales
- [ ] Autenticación de administradores
- [ ] Panel de configuración de roles
- [ ] Historial de sincronizaciones
- [ ] Gráficos de actividad
- [ ] Logs en tiempo real
- [ ] Gestión de usuarios
- [ ] Configuración del bot desde la web

## 📝 Scripts Disponibles

- `npm run web:dev` - Inicia el servidor de desarrollo
- `npm run web:build` - Construye la aplicación para producción
- `npm run web:start` - Inicia el servidor de producción
- `npm run web:lint` - Ejecuta el linter

## 🐛 Debugging

Para debugging, activa las herramientas de desarrollo de React:

1. Instala [React Developer Tools](https://react.dev/learn/react-developer-tools)
2. Abre las DevTools del navegador
3. Ve a la pestaña "Components" o "Profiler"

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - igual que el bot principal.
