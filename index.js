// Discord Bot para LHDT - Sistema de Roles Automáticos
require('dotenv').config();
const { Client, GatewayIntentBits, REST, Routes } = require('discord.js');
const { createClient } = require('@supabase/supabase-js');

// Configuración
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
const DISCORD_GUILD_ID = process.env.DISCORD_GUILD_ID;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY || !DISCORD_BOT_TOKEN || !DISCORD_GUILD_ID) {
  console.error('❌ Faltan variables de entorno requeridas');
  console.error('Requeridas: SUPABASE_URL, SUPABASE_SERVICE_KEY, DISCORD_BOT_TOKEN, DISCORD_GUILD_ID');
  process.exit(1);
}

// Validar que se esté usando Service Role Key y no Anon Key
function validateSupabaseKey(key) {
  try {
    // Decodificar el JWT para verificar el rol
    const payload = JSON.parse(Buffer.from(key.split('.')[1], 'base64').toString());
    
    if (payload.role === 'anon') {
      console.error('');
      console.error('❌ =====================================================');
      console.error('❌ ERROR: Estás usando la ANON KEY de Supabase');
      console.error('❌ =====================================================');
      console.error('');
      console.error('Este bot requiere la SERVICE ROLE KEY para funcionar correctamente.');
      console.error('');
      console.error('La ANON KEY tiene permisos limitados y NO puede:');
      console.error('  • Acceder a la API de administración de Supabase');
      console.error('  • Realizar operaciones que requieran bypass de RLS');
      console.error('  • Gestionar usuarios de forma administrativa');
      console.error('');
      console.error('📖 Cómo obtener tu SERVICE ROLE KEY:');
      console.error('  1. Ve a https://supabase.com/dashboard/project/TU_PROYECTO');
      console.error('  2. Ve a Settings → API');
      console.error('  3. En la sección "Project API keys"');
      console.error('  4. Copia la clave "service_role" (NO la "anon/public")');
      console.error('  5. Actualiza SUPABASE_SERVICE_KEY en tu archivo .env');
      console.error('');
      console.error('⚠️  IMPORTANTE: La service_role key es secreta y tiene permisos');
      console.error('    administrativos completos. NUNCA la expongas en código cliente.');
      console.error('');
      console.error('=====================================================');
      console.error('');
      process.exit(1);
    }
    
    if (payload.role === 'service_role') {
      console.log('✅ Usando Service Role Key correctamente');
      return true;
    }
    
    console.warn('⚠️  Advertencia: La clave JWT tiene un rol inesperado:', payload.role);
    return true;
  } catch (err) {
    console.warn('⚠️  No se pudo validar el formato de la clave Supabase');
    console.warn('   Asegúrate de estar usando la SERVICE ROLE KEY, no la ANON KEY');
    return true; // Continuar de todos modos si no se puede decodificar
  }
}

validateSupabaseKey(SUPABASE_SERVICE_KEY);

// Inicializar Supabase con service key para bypass RLS
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Inicializar Discord bot
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
  ],
});

// Función para obtener roles elegibles de un usuario desde Supabase
async function getEligibleRoles(userId) {
  try {
    const { data, error } = await supabase.rpc('get_user_eligible_discord_roles', {
      p_user_id: userId,
    });

    if (error) {
      console.error('Error obteniendo roles elegibles:', error);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error('Error inesperado obteniendo roles:', err);
    return [];
  }
}

// Función para sincronizar roles de un usuario en Discord
async function syncUserRoles(discordUserId, lhdtUserId) {
  try {
    const guild = await client.guilds.fetch(DISCORD_GUILD_ID);
    const member = await guild.members.fetch(discordUserId);

    if (!member) {
      console.log(`⚠️ Usuario ${discordUserId} no encontrado en el servidor`);
      return;
    }

    // Obtener roles elegibles desde Supabase
    const eligibleRoles = await getEligibleRoles(lhdtUserId);
    
    if (eligibleRoles.length === 0) {
      console.log(`ℹ️ Usuario ${lhdtUserId} no tiene roles elegibles`);
      return;
    }

    console.log(`📋 Roles elegibles para ${member.user.tag}:`, eligibleRoles.map(r => r.role_name));

    // Obtener IDs de roles elegibles
    const eligibleRoleIds = eligibleRoles.map(r => r.discord_role_id);

    // Obtener todos los roles gestionados por el bot (desde config)
    const { data: allManagedRoles } = await supabase
      .from('discord_role_config')
      .select('discord_role_id');
    
    const allManagedRoleIds = (allManagedRoles || []).map(r => r.discord_role_id);

    // Roles a agregar (elegibles que no tiene)
    const rolesToAdd = eligibleRoleIds.filter(roleId => !member.roles.cache.has(roleId));
    
    // Roles a remover (gestionados por bot que tiene pero no es elegible)
    const rolesToRemove = allManagedRoleIds.filter(roleId => 
      member.roles.cache.has(roleId) && !eligibleRoleIds.includes(roleId)
    );

    // Agregar roles
    for (const roleId of rolesToAdd) {
      try {
        await member.roles.add(roleId);
        const roleName = eligibleRoles.find(r => r.discord_role_id === roleId)?.role_name;
        console.log(`✅ Rol agregado a ${member.user.tag}: ${roleName}`);
        
        // Registrar en BD
        await supabase.from('user_discord_roles').insert({
          user_id: lhdtUserId,
          discord_user_id: discordUserId,
          discord_role_id: roleId,
          role_name: roleName,
        }).onConflict('user_id,discord_role_id').merge();
      } catch (err) {
        console.error(`❌ Error agregando rol ${roleId}:`, err.message);
      }
    }

    // Remover roles
    for (const roleId of rolesToRemove) {
      try {
        await member.roles.remove(roleId);
        console.log(`➖ Rol removido de ${member.user.tag}: ${roleId}`);
        
        // Eliminar de BD
        await supabase.from('user_discord_roles').delete()
          .eq('user_id', lhdtUserId)
          .eq('discord_role_id', roleId);
      } catch (err) {
        console.error(`❌ Error removiendo rol ${roleId}:`, err.message);
      }
    }

    console.log(`✨ Sincronización completada para ${member.user.tag}`);
  } catch (err) {
    console.error('❌ Error sincronizando roles:', err);
  }
}

// Función para asignar rol por defecto a nuevos miembros
async function assignDefaultRoles(member, lhdtUserId) {
  try {
    const { data: defaultRoles } = await supabase
      .from('discord_role_config')
      .select('discord_role_id, role_name')
      .eq('is_default', true);

    if (!defaultRoles || defaultRoles.length === 0) {
      console.log('ℹ️ No hay roles por defecto configurados');
      return;
    }

    for (const role of defaultRoles) {
      try {
        if (!member.roles.cache.has(role.discord_role_id)) {
          await member.roles.add(role.discord_role_id);
          console.log(`✅ Rol por defecto asignado a ${member.user.tag}: ${role.role_name}`);
          
          // Registrar en BD
          await supabase.from('user_discord_roles').insert({
            user_id: lhdtUserId,
            discord_user_id: member.id,
            discord_role_id: role.discord_role_id,
            role_name: role.role_name,
          }).onConflict('user_id,discord_role_id').merge();
        }
      } catch (err) {
        console.error(`❌ Error asignando rol por defecto ${role.role_name}:`, err.message);
      }
    }
  } catch (err) {
    console.error('❌ Error obteniendo roles por defecto:', err);
  }
}

// Evento: Bot listo
client.once('ready', async () => {
  console.log('');
  console.log('🎮 ========================================');
  console.log(`✅ Bot conectado como ${client.user.tag}`);
  console.log(`🏠 Servidor: ${DISCORD_GUILD_ID}`);
  console.log('🎮 ========================================');
  console.log('');

  // Verificar conexión a Supabase
  const { data, error } = await supabase.from('discord_role_config').select('count');
  if (error) {
    console.error('❌ Error conectando a Supabase:', error);
  } else {
    console.log('✅ Conectado a Supabase');
  }

  // Sincronizar roles de todos los usuarios con Discord conectado al iniciar
  console.log('🔄 Sincronizando roles existentes...');
  const { data: users } = await supabase
    .from('user_discord_status')
    .select('id, discord_id')
    .not('discord_id', 'is', null);

  if (users && users.length > 0) {
    console.log(`📊 Encontrados ${users.length} usuarios con Discord conectado`);
    for (const user of users) {
      await syncUserRoles(user.discord_id, user.id);
      // Pequeño delay para no saturar la API
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    console.log('✅ Sincronización inicial completada');
  }
});

// Evento: Nuevo miembro se une al servidor
client.on('guildMemberAdd', async (member) => {
  console.log(`👋 Nuevo miembro: ${member.user.tag}`);

  // Buscar si el usuario tiene cuenta en LHDT
  const { data: identity } = await supabase
    .from('identities')
    .select('user_id')
    .eq('provider', 'discord')
    .eq('provider_id', member.id)
    .maybeSingle();

  if (identity) {
    console.log(`✅ Usuario ${member.user.tag} tiene cuenta LHDT`);
    await assignDefaultRoles(member, identity.user_id);
    await syncUserRoles(member.id, identity.user_id);
  } else {
    console.log(`ℹ️ Usuario ${member.user.tag} no tiene cuenta LHDT vinculada`);
  }
});

// Escuchar cambios en la tabla user_levels (cuando sube de nivel)
const levelChannel = supabase
  .channel('user_levels_changes')
  .on(
    'postgres_changes',
    {
      event: 'UPDATE',
      schema: 'public',
      table: 'user_levels',
    },
    async (payload) => {
      const { new: newLevel, old: oldLevel } = payload;
      
      // Solo sincronizar si cambió el nivel
      if (newLevel.level !== oldLevel.level) {
        console.log(`⬆️ Usuario subió de nivel ${oldLevel.level} → ${newLevel.level}`);
        
        // Obtener Discord ID del usuario
        const { data: identity } = await supabase
          .from('identities')
          .select('provider_id')
          .eq('user_id', newLevel.user_id)
          .eq('provider', 'discord')
          .maybeSingle();

        if (identity) {
          console.log(`🔄 Sincronizando roles para nivel ${newLevel.level}...`);
          await syncUserRoles(identity.provider_id, newLevel.user_id);
        }
      }
    }
  )
  .subscribe((status) => {
    if (status === 'SUBSCRIBED') {
      console.log('📡 Escuchando cambios en user_levels');
    }
  });

// Manejo de errores
client.on('error', (error) => {
  console.error('❌ Error del bot:', error);
});

process.on('unhandledRejection', (error) => {
  console.error('❌ Error no manejado:', error);
});

// Iniciar bot
client.login(DISCORD_BOT_TOKEN)
  .then(() => console.log('🔐 Autenticando con Discord...'))
  .catch((err) => {
    console.error('❌ Error al iniciar sesión:', err);
    process.exit(1);
  });
