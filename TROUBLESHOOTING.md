# 🔧 Guía de Solución de Problemas

Esta guía te ayudará a resolver los problemas más comunes con el bot de Discord.

---

## 🔑 Problemas de Autenticación con Supabase

### ❌ Error: "AuthApiError: Invalid API key" o "401 Unauthorized"

**Síntomas:**
- El bot muestra error al iniciar
- Mensajes de error: `GET https://xxxxx.supabase.co/auth/v1/admin/users 401 (Unauthorized)`
- Error: `Failed to load users. This feature requires Supabase Admin API access.`
- Error: `AuthApiError: Invalid API key`

**Causa:**
Estás usando la **ANON KEY** (clave pública) en lugar de la **SERVICE ROLE KEY** (clave de servicio).

**Solución:**

#### 1. Identifica qué clave estás usando

Abre tu archivo `.env` y verifica `SUPABASE_SERVICE_KEY`. Si la clave JWT decodificada contiene `"role":"anon"`, es la clave incorrecta.

Puedes verificar tu clave en https://jwt.io:
- **Incorrecta**: `"role": "anon"`
- **Correcta**: `"role": "service_role"`

#### 2. Obtén la clave correcta (SERVICE ROLE KEY)

1. Ve al **Dashboard de Supabase**: https://supabase.com/dashboard
2. Selecciona tu proyecto
3. Ve a **Settings** (⚙️ en la barra lateral) → **API**
4. Busca la sección **"Project API keys"**
5. Verás dos claves:
   - `anon` / `public` ❌ **NO uses esta**
   - `service_role` ✅ **USA ESTA**

6. Copia la clave `service_role` (haz clic en el ícono del ojo para revelarla)

#### 3. Actualiza tu archivo .env

```env
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4eHh4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY...
```

#### 4. Reinicia el bot

```bash
npm start
```

Deberías ver: `✅ Usando Service Role Key correctamente`

---

### 🔐 ¿Por qué necesito la Service Role Key?

El bot de Discord necesita realizar operaciones administrativas que requieren permisos elevados:

| Operación | Requiere Service Role |
|-----------|----------------------|
| Leer datos de usuarios | ✅ |
| Bypass de RLS (Row Level Security) | ✅ |
| Llamar funciones RPC de la base de datos | ✅ |
| Insertar/actualizar registros de roles | ✅ |
| Suscribirse a cambios en tiempo real | Depende |

La **ANON KEY** está diseñada para aplicaciones cliente (web/móvil) y tiene permisos muy limitados por seguridad.

La **SERVICE ROLE KEY** tiene permisos administrativos completos y **SOLO debe usarse en el backend** (como este bot).

---

### ⚠️ Seguridad de las Claves

**ANON KEY (Pública):**
- ✅ Puede exponerse en código cliente
- ✅ Segura para usar en navegadores/apps móviles
- ❌ Tiene permisos muy limitados
- ❌ NO funciona para operaciones administrativas

**SERVICE ROLE KEY (Secreta):**
- ❌ **NUNCA** la expongas en código cliente
- ❌ **NUNCA** la subas a GitHub (usa `.env` y `.gitignore`)
- ✅ Solo úsala en backend seguro
- ✅ Tiene permisos administrativos completos

---

## 🤖 Problemas con Discord

### ❌ El bot no asigna roles

**Síntomas:**
- El bot se conecta correctamente
- No da errores
- Pero no asigna roles a los usuarios

**Posibles causas y soluciones:**

#### 1. Jerarquía de roles incorrecta

En Discord, un bot solo puede gestionar roles que estén **por debajo** de su propio rol más alto.

**Solución:**
1. Ve a tu servidor de Discord → Configuración del Servidor → Roles
2. Arrastra el rol del bot **por encima** de todos los roles que debe gestionar
3. Reinicia el bot

#### 2. Permisos insuficientes

**Solución:**
1. Ve a tu servidor → Configuración del Servidor → Roles
2. Busca el rol del bot
3. Verifica que tenga estos permisos:
   - ✅ Gestionar Roles (Manage Roles)
   - ✅ Ver Canales (View Channels)

#### 3. IDs de roles incorrectos

Los IDs de roles en la base de datos deben coincidir exactamente con los de Discord.

**Solución:**
1. Activa el Modo Desarrollador en Discord
2. Haz clic derecho en un rol → Copiar ID
3. Verifica que coincida con el ID en tu tabla `discord_role_config`

---

### ❌ Error: "Missing Access"

**Causa:**
El bot no tiene los permisos necesarios en el servidor.

**Solución:**
1. Expulsa el bot del servidor
2. Vuelve a invitarlo usando esta URL (reemplaza `YOUR_CLIENT_ID`):
   ```
   https://discord.com/api/oauth2/authorize?client_id=YOUR_CLIENT_ID&permissions=268435456&scope=bot
   ```
3. Asegúrate de tener permisos de administrador al invitarlo

---

### ❌ Error: "Unknown Guild"

**Causa:**
El `DISCORD_GUILD_ID` en tu `.env` es incorrecto o el bot no está en ese servidor.

**Solución:**
1. Activa Modo Desarrollador en Discord (Configuración → Avanzado)
2. Haz clic derecho en tu servidor → Copiar ID
3. Actualiza `DISCORD_GUILD_ID` en `.env`
4. Reinicia el bot

---

### ❌ Error: "Privileged intent provided is not enabled or whitelisted"

**Causa:**
No has activado los "Privileged Gateway Intents" en el portal de desarrolladores de Discord.

**Solución:**
1. Ve a https://discord.com/developers/applications
2. Selecciona tu aplicación
3. Ve a **Bot** en el menú lateral
4. Baja hasta **Privileged Gateway Intents**
5. Activa:
   - ✅ **Server Members Intent** (obligatorio)
   - ✅ **Presence Intent** (opcional)
6. Guarda los cambios
7. Reinicia el bot

---

## 📊 El bot no escucha cambios de nivel

### ❌ Los roles no se actualizan cuando un usuario sube de nivel

**Posibles causas:**

#### 1. Realtime no está habilitado en Supabase

**Solución:**
1. Ve a tu proyecto en Supabase
2. Ve a **Database** → **Replication**
3. Habilita Realtime para la tabla `user_levels`
4. Reinicia el bot

#### 2. La suscripción no se establece

**Verificación:**
Busca en los logs del bot al iniciar:
```
📡 Escuchando cambios en user_levels
```

Si no aparece, revisa los logs de errores.

---

## 🌐 Problemas de Conexión

### ❌ El bot se desconecta constantemente

**Posibles causas:**

#### 1. Problemas de red

- Verifica tu conexión a internet
- Si estás detrás de un firewall, asegúrate de que Discord y Supabase no estén bloqueados

#### 2. Token de Discord inválido

**Solución:**
1. Ve a https://discord.com/developers/applications
2. Selecciona tu aplicación → Bot
3. Haz clic en **Reset Token**
4. Copia el nuevo token
5. Actualiza `DISCORD_BOT_TOKEN` en `.env`
6. Reinicia el bot

#### 3. Rate limiting de Discord

Si el bot hace demasiadas peticiones, Discord lo puede desconectar temporalmente.

**Solución:**
- El bot ya tiene delays implementados (1 segundo entre usuarios)
- Si sincronizas muchos usuarios, considera aumentar el delay en `index.js` línea 192

---

## 🗃️ Problemas con la Base de Datos

### ❌ Error: "relation 'table_name' does not exist"

**Causa:**
Falta una tabla en tu base de datos de Supabase.

**Solución:**
Asegúrate de tener creadas estas tablas:
- `discord_role_config`
- `user_discord_roles`
- `user_levels`
- `user_discord_status`
- `identities`

Y esta función RPC:
- `get_user_eligible_discord_roles`

Revisa la documentación de la base de datos del proyecto principal.

---

### ❌ Error al ejecutar RPC

**Síntomas:**
```
Error obteniendo roles elegibles: {...}
```

**Solución:**
1. Verifica que la función `get_user_eligible_discord_roles` exista en Supabase
2. Prueba ejecutarla manualmente en el SQL Editor:
   ```sql
   SELECT * FROM get_user_eligible_discord_roles('user-id-aqui');
   ```
3. Si da error, revisa la definición de la función

---

## 🚀 Problemas de Despliegue

### ❌ El bot funciona localmente pero no en producción

**Verificaciones:**

#### 1. Variables de entorno

Asegúrate de que todas las variables estén configuradas en tu plataforma de deploy (Railway, Render, etc.):
- `SUPABASE_URL`
- `SUPABASE_SERVICE_KEY` (la correcta, no anon)
- `DISCORD_BOT_TOKEN`
- `DISCORD_GUILD_ID`

#### 2. Node.js version

Verifica que la plataforma use Node.js >= 18.0.0

#### 3. Logs

Revisa los logs de la plataforma para ver errores específicos.

---

## 📋 Checklist de Diagnóstico

Usa esta lista para diagnosticar problemas:

- [ ] ¿Estoy usando la **SERVICE ROLE KEY** correcta de Supabase?
- [ ] ¿El bot token de Discord es válido?
- [ ] ¿El GUILD_ID es correcto?
- [ ] ¿Todas las variables de entorno están configuradas?
- [ ] ¿El rol del bot en Discord está por encima de los roles a gestionar?
- [ ] ¿El bot tiene permisos de "Gestionar Roles"?
- [ ] ¿Los Privileged Gateway Intents están habilitados?
- [ ] ¿Las tablas de la base de datos existen?
- [ ] ¿La función RPC existe y funciona?
- [ ] ¿Realtime está habilitado para user_levels?

---

## 🆘 ¿Aún tienes problemas?

Si después de seguir esta guía aún tienes problemas:

1. **Revisa los logs completos** del bot
2. **Verifica los logs de Supabase** en el dashboard
3. **Prueba las queries SQL manualmente** en Supabase SQL Editor
4. **Verifica permisos en Discord** paso a paso

### Información útil para reportar problemas:

Cuando reportes un problema, incluye:
- Versión de Node.js (`node --version`)
- Sistema operativo
- Plataforma de deploy (local, Railway, Render, etc.)
- Logs completos del error (sin exponer claves secretas)
- Pasos para reproducir el problema

---

## 💡 Consejos Generales

1. **Siempre revisa los logs primero** - contienen información valiosa
2. **Una variable mal configurada** es la causa del 80% de los problemas
3. **Guarda copias de seguridad** de tu archivo `.env`
4. **No subas secretos a GitHub** - verifica que `.gitignore` incluya `.env`
5. **Prueba localmente primero** antes de desplegar en producción

---

🎉 ¡Esperamos que esta guía te ayude a resolver tus problemas!
