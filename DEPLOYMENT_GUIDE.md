# 🚀 Guía de Despliegue del Bot de Discord

El bot de Discord necesita estar corriendo 24/7 para funcionar. Aquí tienes las mejores opciones:

---

## ✅ Opción 1: Railway (Recomendado - GRATIS)

**✨ Ventajas:**
- 🆓 Plan gratuito con $5 USD de crédito mensual (suficiente para el bot)
- 🔄 Auto-deploy desde GitHub
- 📊 Logs en tiempo real
- ⚡ Muy fácil de configurar

### Pasos:

1. **Crear cuenta en Railway**
   - Ve a https://railway.app
   - Regístrate con GitHub

2. **Subir código a GitHub**
   ```bash
   cd discord-bot
   git init
   git add .
   git commit -m "Discord bot initial commit"
   git remote add origin https://github.com/TU_USUARIO/lhdt-discord-bot.git
   git push -u origin main
   ```

3. **Desplegar en Railway**
   - Clic en "New Project"
   - Selecciona "Deploy from GitHub repo"
   - Escoge tu repositorio `lhdt-discord-bot`
   - Railway detectará automáticamente que es Node.js

4. **Configurar variables de entorno**
   - Ve a tu proyecto → Variables
   - Agrega cada variable del archivo `.env`:
     ```
     SUPABASE_URL=https://adiscrkxzjmnlooxyxzr.supabase.co
     SUPABASE_SERVICE_KEY=tu_service_key
     DISCORD_BOT_TOKEN=tu_bot_token
     DISCORD_GUILD_ID=934385991664427039
     ```

5. **¡Listo!** El bot se despliega automáticamente y queda corriendo 24/7

---

## ✅ Opción 2: Render (También Gratis)

**✨ Ventajas:**
- 🆓 Plan gratuito (se duerme después de 15 min sin actividad, pero el bot Discord siempre está activo)
- 📦 Deploy automático desde GitHub
- 🔒 SSL gratis

### Pasos:

1. **Crear cuenta en Render**
   - Ve a https://render.com
   - Regístrate con GitHub

2. **Crear nuevo servicio**
   - Clic en "New +" → "Background Worker"
   - Conecta tu repositorio de GitHub
   - Nombre: `lhdt-discord-bot`
   - Environment: `Node`
   - Build Command: `npm install`
   - Start Command: `npm start`

3. **Variables de entorno**
   - Agrega las mismas variables del `.env`

4. **Deploy**
   - Clic en "Create Background Worker"

---

## ✅ Opción 3: VPS (si ya tienes uno)

Si tu hosting web es un VPS con acceso SSH, puedes correr el bot ahí usando **PM2**.

### Pasos:

1. **Subir el código al servidor**
   ```bash
   scp -r discord-bot/ usuario@tu-servidor:/home/usuario/
   ```

2. **Instalar PM2 (gestor de procesos)**
   ```bash
   ssh usuario@tu-servidor
   cd discord-bot
   npm install
   npm install -g pm2
   ```

3. **Configurar variables de entorno**
   ```bash
   nano .env
   # Pega tus variables aquí
   ```

4. **Iniciar el bot con PM2**
   ```bash
   pm2 start index.js --name lhdt-discord-bot
   pm2 save
   pm2 startup
   ```

5. **El bot queda corriendo 24/7** y se reinicia automáticamente si falla o si el servidor se reinicia.

### Comandos útiles de PM2:
```bash
pm2 status              # Ver estado
pm2 logs lhdt-discord-bot   # Ver logs
pm2 restart lhdt-discord-bot # Reiniciar
pm2 stop lhdt-discord-bot    # Detener
```

---

## ✅ Opción 4: Fly.io (Gratis)

**✨ Ventajas:**
- 🆓 Plan gratuito generoso
- 🌍 Deploy global
- 📦 Usa Docker

### Pasos:

1. **Instalar flyctl**
   ```bash
   # Windows (PowerShell)
   iwr https://fly.io/install.ps1 -useb | iex
   ```

2. **Login y crear app**
   ```bash
   cd discord-bot
   fly auth login
   fly launch
   ```

3. **Configurar secretos**
   ```bash
   fly secrets set SUPABASE_URL=https://adiscrkxzjmnlooxyxzr.supabase.co
   fly secrets set SUPABASE_SERVICE_KEY=tu_service_key
   fly secrets set DISCORD_BOT_TOKEN=tu_bot_token
   fly secrets set DISCORD_GUILD_ID=934385991664427039
   ```

4. **Deploy**
   ```bash
   fly deploy
   ```

---

## ❌ Opciones NO recomendadas:

### Hosting compartido (cPanel, Hostinger, etc.)
- ❌ No permiten procesos Node.js persistentes
- ❌ Solo sirven archivos estáticos o PHP

### Vercel / Netlify
- ❌ Son para sitios estáticos/serverless
- ❌ No soportan procesos persistentes como bots de Discord

---

## 🏆 Recomendación Final

**Para este bot, usa Railway o Render:**

| Característica | Railway | Render | VPS |
|----------------|---------|--------|-----|
| 💰 Costo | Gratis | Gratis | $5-20/mes |
| ⚡ Facilidad | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐ |
| 🔄 Auto-deploy | ✅ | ✅ | ❌ |
| 📊 Logs | ✅ | ✅ | Manual |
| ⏱️ Setup | 5 min | 10 min | 30 min |

---

## 📝 Notas importantes:

1. **NO subas el archivo `.env` a GitHub** (ya está en `.gitignore`)
2. **Usa variables de entorno** en la plataforma de deploy
3. **El bot debe estar corriendo 24/7** para que funcione
4. **Revisa los logs** si algo no funciona

---

## 🆘 Troubleshooting

### El bot no se conecta
- Verifica que las variables de entorno estén configuradas correctamente
- Revisa los logs de la plataforma
- Asegúrate de usar el **Service Role Key**, no el anon key

### El bot se desconecta
- Revisa los logs para ver el error
- Puede ser límite de rate de Discord (muy raro)
- Verifica conexión a Supabase

### Cambios en el código
- Si usas Railway/Render con GitHub, solo haz push y se redespliega automáticamente
- Si usas PM2, haz `pm2 restart lhdt-discord-bot` después de subir cambios
