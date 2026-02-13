import { useState, useEffect } from 'react';
import Head from 'next/head';

interface BotStats {
  status: 'online' | 'offline' | 'loading';
  totalUsers: number;
  rolesManaged: number;
  levelUps: number;
  lastSync: string;
}

interface RoleInfo {
  name: string;
  color: string;
  userCount: number;
  level: number;
}

export default function Home() {
  const [stats, setStats] = useState<BotStats>({
    status: 'loading',
    totalUsers: 0,
    rolesManaged: 0,
    levelUps: 0,
    lastSync: 'Never',
  });

  const [roles, setRoles] = useState<RoleInfo[]>([
    { name: 'Novato', color: '#99AAB5', userCount: 0, level: 1 },
    { name: 'Aprendiz', color: '#57F287', userCount: 0, level: 5 },
    { name: 'Experto', color: '#5865F2', userCount: 0, level: 10 },
    { name: 'Maestro', color: '#FEE75C', userCount: 0, level: 20 },
    { name: 'Leyenda', color: '#EB459E', userCount: 0, level: 50 },
  ]);

  useEffect(() => {
    // Simulate loading bot stats
    const timer = setTimeout(() => {
      setStats({
        status: 'online',
        totalUsers: 142,
        rolesManaged: 387,
        levelUps: 23,
        lastSync: new Date().toLocaleTimeString('es-ES'),
      });

      // Simulate role user counts
      setRoles(prevRoles => 
        prevRoles.map((role, index) => ({
          ...role,
          userCount: Math.floor(Math.random() * 50) + 10,
        }))
      );
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const StatusIndicator = ({ status }: { status: string }) => {
    const colors = {
      online: 'bg-discord-green',
      offline: 'bg-discord-red',
      loading: 'bg-discord-yellow animate-pulse',
    };

    return (
      <div className="flex items-center gap-2">
        <div className={`w-3 h-3 rounded-full ${colors[status as keyof typeof colors]}`} />
        <span className="text-sm font-medium capitalize">{status === 'loading' ? 'Cargando...' : status}</span>
      </div>
    );
  };

  return (
    <>
      <Head>
        <title>LHDT Discord Bot - Dashboard</title>
        <meta name="description" content="Dashboard del Bot de Discord para LHDT" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-discord-notquiteblack via-discord-dark to-discord-notquiteblack">
        {/* Header */}
        <header className="bg-discord-dark/80 backdrop-blur-sm border-b border-discord-greyple/20 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-discord-blurple rounded-full flex items-center justify-center">
                  <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
                  </svg>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">LHDT Discord Bot</h1>
                  <p className="text-discord-greyple text-sm">Sistema de Roles Automáticos</p>
                </div>
              </div>
              <StatusIndicator status={stats.status} />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Usuarios Conectados"
              value={stats.totalUsers}
              icon="👥"
              color="from-discord-blurple to-blue-600"
            />
            <StatCard
              title="Roles Gestionados"
              value={stats.rolesManaged}
              icon="🎭"
              color="from-discord-green to-green-600"
            />
            <StatCard
              title="Subidas de Nivel (Hoy)"
              value={stats.levelUps}
              icon="⬆️"
              color="from-discord-fuchsia to-pink-600"
            />
            <StatCard
              title="Última Sincronización"
              value={stats.lastSync}
              icon="🔄"
              color="from-discord-yellow to-yellow-600"
              isTime
            />
          </div>

          {/* Roles Section */}
          <div className="bg-discord-dark/60 backdrop-blur-sm rounded-2xl border border-discord-greyple/20 p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <span>🎯</span>
                Roles por Nivel
              </h2>
              <button className="px-4 py-2 bg-discord-blurple hover:bg-discord-blurple/80 text-white rounded-lg font-medium transition-colors">
                Sincronizar Ahora
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {roles.map((role, index) => (
                <div
                  key={index}
                  className="bg-discord-notquiteblack/50 rounded-xl p-5 border border-discord-greyple/10 hover:border-discord-greyple/30 transition-all hover:scale-105"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: role.color }}
                      />
                      <h3 className="text-white font-semibold">{role.name}</h3>
                    </div>
                    <span className="text-discord-greyple text-sm">Nivel {role.level}+</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-discord-greyple text-sm">Usuarios</span>
                    <span className="text-white font-bold text-xl">{role.userCount}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Features Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FeatureCard
              icon="⚡"
              title="Sincronización Automática"
              description="Los roles se actualizan automáticamente cuando los usuarios suben de nivel"
            />
            <FeatureCard
              icon="🔔"
              title="Notificaciones en Tiempo Real"
              description="Recibe notificaciones instantáneas de cambios de nivel vía Supabase Realtime"
            />
            <FeatureCard
              icon="🛡️"
              title="Gestión de Roles"
              description="Control total sobre qué roles se asignan según el nivel alcanzado"
            />
          </div>

          {/* Footer Info */}
          <div className="mt-12 text-center">
            <p className="text-discord-greyple text-sm">
              Bot desarrollado para LHDT • Versión 1.0.0 • {new Date().getFullYear()}
            </p>
          </div>
        </main>
      </div>
    </>
  );
}

function StatCard({ 
  title, 
  value, 
  icon, 
  color,
  isTime = false 
}: { 
  title: string; 
  value: number | string; 
  icon: string; 
  color: string;
  isTime?: boolean;
}) {
  return (
    <div className={`bg-gradient-to-br ${color} rounded-2xl p-6 text-white shadow-xl hover:scale-105 transition-transform`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-4xl">{icon}</span>
        <div className="text-right">
          <p className="text-sm font-medium opacity-90">{title}</p>
          <p className="text-3xl font-bold mt-1">
            {isTime ? value : typeof value === 'number' ? value.toLocaleString('es-ES') : value}
          </p>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ 
  icon, 
  title, 
  description 
}: { 
  icon: string; 
  title: string; 
  description: string;
}) {
  return (
    <div className="bg-discord-dark/60 backdrop-blur-sm rounded-xl p-6 border border-discord-greyple/20 hover:border-discord-blurple/50 transition-all">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-white font-semibold text-lg mb-2">{title}</h3>
      <p className="text-discord-greyple text-sm leading-relaxed">{description}</p>
    </div>
  );
}
