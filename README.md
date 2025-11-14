# Bot de Discord para LHDT

Bot automático que sincroniza roles de Discord con los niveles de usuarios en la plataforma LHDT.

## 🚀 Configuración Rápida

### 1. Instalar dependencias

```bash
cd discord-bot
npm install
```

### 2. Configurar variables de entorno

Copia el archivo `.env.example` a `.env`:

```bash
cp .env.example .env
```

Edita `.env` con tus valores:

```env
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGc...  # ⚠️ Service Role Key (NO uses la anon key!)
DISCORD_BOT_TOKEN=MTIxMjM...     # Token del bot de Discord
DISCORD_GUILD_ID=1234567890      # ID de tu servidor
```

**⚠️ IMPORTANTE - Clave de Supabase:**

Debes usar la **SERVICE ROLE KEY**, NO la **ANON/PUBLIC KEY**.

Para obtener la clave correcta:
1. Ve a tu proyecto en [Supabase Dashboard](https://supabase.com/dashboard)
2. Settings → API
3. En "Project API keys", copia la clave **"service_role"** (no la "anon")
4. Esta clave tiene permisos administrativos - manténla secreta

Si usas la clave incorrecta, verás errores como:
- `AuthApiError: Invalid API key`
- `401 (Unauthorized)`
- `This feature requires Supabase Admin API access`

### 3. Obtener el Bot Token de Discord

1. Ve a [Discord Developer Portal](https://discord.com/developers/applications)
2. Crea una nueva aplicación o selecciona la existente
3. Ve a la sección **Bot**
4. Haz clic en **Reset Token** y copia el token
5. **IMPORTANTE**: Activa estos **Privileged Gateway Intents**:
   - ✅ Server Members Intent
   - ✅ Presence Intent (opcional)

### 4. Invitar el bot a tu servidor

Usa esta URL (reemplaza `YOUR_CLIENT_ID` con tu Client ID):

```
https://discord.com/api/oauth2/authorize?client_id=YOUR_CLIENT_ID&permissions=268435456&scope=bot
```

Permisos necesarios:
- ✅ Manage Roles (Gestionar Roles)
- ✅ View Channels (Ver Canales)

### 5. Obtener el Guild ID

1. Activa el **Modo Desarrollador** en Discord (Configuración → Avanzado → Modo Desarrollador)
2. Haz clic derecho en tu servidor → **Copiar ID**

### 6. Ejecutar el bot

```bash
npm start
```

Para desarrollo con auto-reload:

```bash
npm run dev
```

## 📋 Funcionalidades

### ✨ Al Iniciar
- Se conecta a Discord y Supabase
- Sincroniza roles de todos los usuarios existentes
- Muestra estadísticas de conexión

### 👋 Nuevo Miembro
- Detecta cuando alguien se une al servidor
- Si tiene cuenta LHDT vinculada, asigna roles automáticamente
- Asigna roles por defecto configurados

### ⬆️ Subida de Nivel
- Escucha cambios en la tabla `user_levels`
- Cuando un usuario sube de nivel, sincroniza roles automáticamente
- Agrega roles nuevos según nivel alcanzado
- Remueve roles que ya no aplican

### 🔄 Sincronización Manual
- Los admins pueden forzar sincronización desde el Admin Panel
- El bot sincroniza roles al iniciar

## 🏗️ Estructura

```
discord-bot/
├── index.js          # Bot principal
├── package.json      # Dependencias
├── .env.example      # Ejemplo de configuración
├── .env              # Tu configuración (NO subir a git)
└── README.md         # Esta guía
```

## ⚙️ Requisitos

- **Node.js** >= 18.0.0
- Cuenta de Discord con permisos de administrador en el servidor
- Aplicación de Discord creada en el Developer Portal
- Base de datos Supabase con las tablas del sistema de Discord

## 🔒 Seguridad

- **NUNCA** subas el archivo `.env` a git (ya está en `.gitignore`)
- Usa el **Service Role Key** de Supabase, no el anon key
- El bot debe tener un rol en Discord **más alto** que los roles que va a gestionar
- Protege tu Bot Token como una contraseña

## 🐛 Troubleshooting

**¿Tienes problemas?** Consulta la [Guía de Solución de Problemas](TROUBLESHOOTING.md) completa.

### Problemas comunes:

#### ❌ Error: "AuthApiError: Invalid API key" o "401 Unauthorized"

**Causa:** Estás usando la ANON KEY en lugar de la SERVICE ROLE KEY.

**Solución:** 
1. Ve a Supabase Dashboard → Settings → API
2. Copia la clave **"service_role"** (NO la "anon")
3. Actualiza `SUPABASE_SERVICE_KEY` en tu `.env`
4. Reinicia el bot

Ver más detalles en [TROUBLESHOOTING.md](TROUBLESHOOTING.md#-problemas-de-autenticación-con-supabase)

### El bot no asigna roles
- Verifica que el rol del bot esté más arriba en la jerarquía que los roles a asignar
- Revisa que los IDs de roles en la BD coincidan con los de Discord
- Mira los logs del bot para ver errores específicos

### El bot se desconecta
- Verifica tu conexión a internet
- Revisa que el Bot Token sea válido
- Chequea los logs de Supabase por errores de BD

### No escucha cambios de nivel
- Verifica que la suscripción de Realtime esté activa en Supabase
- Revisa que el trigger `on_level_change_sync_discord` exista en la BD

## 📊 Logs

El bot muestra logs detallados:
- ✅ Operaciones exitosas
- ❌ Errores
- ℹ️ Información general
- 🔄 Sincronizaciones
- ⬆️ Subidas de nivel
- 👋 Nuevos miembros

## 🚀 Producción

Para producción, considera usar:
- **PM2**: Para mantener el bot corriendo
- **Docker**: Para containerización
- **Railway/Render**: Para hosting en la nube

### Ejemplo con PM2:

```bash
npm install -g pm2
pm2 start index.js --name lhdt-bot
pm2 save
pm2 startup
```

## 📞 Soporte

Si tienes problemas:
1. Revisa los logs del bot
2. Verifica las variables de entorno
3. Confirma que la base de datos esté configurada correctamente
4. Revisa permisos del bot en Discord
