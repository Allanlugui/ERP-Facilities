import React from 'react';
import {
  LayoutDashboard,
  ShieldAlert,
  FileCheck2,
  Users,
  Wrench,
  Database,
  Lock,
  Building,
  CheckSquare,
  Sparkles,
  Cpu,
  UserCheck,
  BarChart3
} from 'lucide-react';
import { UserRole } from '../types';

export type ActiveTab = 'dashboard' | 'rbac' | 'compliance' | 'cadastros' | 'facilities' | 'eam' | 'tenant_portal' | 'bi_analytics' | 'database';

interface SidebarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  userRole: UserRole;
  openTicketsCount: number;
  pendingDocsCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  userRole,
  openTicketsCount,
  pendingDocsCount
}) => {
  const menuItems = [
    {
      id: 'dashboard' as ActiveTab,
      label: 'Painel Central',
      sublabel: 'Visão Geral & KPIs',
      icon: LayoutDashboard,
      badge: null,
      allowedRoles: ['ADMIN', 'OPERACIONAL', 'CLIENTE']
    },
    {
      id: 'facilities' as ActiveTab,
      label: 'Operações & Chamados',
      sublabel: 'Atendimento & SLA',
      icon: Wrench,
      badge: openTicketsCount > 0 ? `${openTicketsCount} ABERTOS` : null,
      badgeColor: 'bg-amber-50 text-amber-700 border border-amber-200',
      allowedRoles: ['ADMIN', 'OPERACIONAL', 'CLIENTE']
    },
    {
      id: 'eam' as ActiveTab,
      label: 'Gestão de Ativos & PMOC',
      sublabel: 'Equipamentos & Preventivas',
      icon: Cpu,
      badge: 'EAM',
      badgeColor: 'bg-blue-50 text-blue-700 border border-blue-200',
      allowedRoles: ['ADMIN', 'OPERACIONAL']
    },
    {
      id: 'tenant_portal' as ActiveTab,
      label: 'Portal do Inquilino & NPS',
      sublabel: 'Acompanhamento & Avaliação',
      icon: UserCheck,
      badge: 'PORTAL',
      badgeColor: 'bg-indigo-50 text-indigo-700 border border-indigo-200',
      allowedRoles: ['ADMIN', 'OPERACIONAL', 'CLIENTE']
    },
    {
      id: 'bi_analytics' as ActiveTab,
      label: 'BI & Métricas Executivas',
      sublabel: 'MTTR, MTBF, SLA e OpEx',
      icon: BarChart3,
      badge: 'BI',
      badgeColor: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
      allowedRoles: ['ADMIN', 'OPERACIONAL']
    },
    {
      id: 'compliance' as ActiveTab,
      label: 'Compliance & Governança',
      sublabel: 'Documentos & Auditoria',
      icon: FileCheck2,
      badge: pendingDocsCount > 0 ? `${pendingDocsCount} LAUDOS` : null,
      badgeColor: 'bg-rose-50 text-rose-700 border border-rose-200',
      allowedRoles: ['ADMIN', 'OPERACIONAL', 'CLIENTE']
    },
    {
      id: 'cadastros' as ActiveTab,
      label: 'Cadastros Base',
      sublabel: 'Clientes, Unidades e Equipes',
      icon: Building,
      badge: null,
      allowedRoles: ['ADMIN', 'OPERACIONAL']
    },
    {
      id: 'rbac' as ActiveTab,
      label: 'Perfis & Multi-Tenancy',
      sublabel: 'Controle RBAC e Usuários',
      icon: Users,
      badge: 'RBAC',
      badgeColor: 'bg-indigo-50 text-indigo-700 border border-indigo-200',
      allowedRoles: ['ADMIN']
    },
    {
      id: 'database' as ActiveTab,
      label: 'Banco & Migrações SQL',
      sublabel: 'PostgreSQL & Supabase',
      icon: Database,
      badge: 'RLS',
      badgeColor: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
      allowedRoles: ['ADMIN', 'OPERACIONAL']
    }
  ];

  return (
    <aside className="w-64 bg-white text-slate-700 flex flex-col h-[calc(100vh-57px)] border-r border-slate-200 shrink-0 select-none">
      
      {/* System Status Banner */}
      <div className="p-3.5 border-b border-slate-200 bg-slate-50">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-1">
          <span className="uppercase tracking-widest text-[9px] font-bold text-slate-500">ECORP INFRASTRUCTURE</span>
          <span className="inline-flex items-center gap-1.5 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            100% ONLINE
          </span>
        </div>
        <p className="text-[11px] text-slate-500 leading-tight">
          Enterprise Node v2026 • Full-Stack Active
        </p>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        <div className="px-2 py-1.5 text-[9px] font-bold uppercase tracking-wider text-slate-400">
          Navegação Executiva
        </div>

        {menuItems.map((item) => {
          const isAllowed = item.allowedRoles.includes(userRole);
          const isActive = activeTab === item.id;
          const Icon = item.icon;

          if (!isAllowed) {
            return (
              <div
                key={item.id}
                className="opacity-40 px-3 py-2.5 rounded-xl flex items-center justify-between text-slate-400 text-xs cursor-not-allowed"
                title="Acesso restrito ao perfil Administrador"
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4 text-slate-400" />
                  <div>
                    <p className="font-medium text-slate-400">{item.label}</p>
                    <p className="text-[10px] text-slate-400">{item.sublabel}</p>
                  </div>
                </div>
                <Lock className="w-3.5 h-3.5 text-slate-400" />
              </div>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full text-left px-3 py-2.5 rounded-xl flex items-center justify-between text-xs font-medium transition-all duration-150 relative group ${
                isActive
                  ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200 shadow-xs'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-transparent'
              }`}
            >
              {isActive && (
                <span className="absolute left-0 top-2 bottom-2 w-1 bg-blue-600 rounded-r-full" />
              )}
              
              <div className="flex items-center gap-3 min-w-0">
                <Icon className={`w-4 h-4 shrink-0 transition-colors ${isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
                <div className="truncate">
                  <p className={`truncate leading-none ${isActive ? 'text-blue-900 font-bold' : 'text-slate-700'}`}>{item.label}</p>
                  <p className={`text-[10px] mt-1 truncate ${isActive ? 'text-blue-600' : 'text-slate-400'}`}>
                    {item.sublabel}
                  </p>
                </div>
              </div>

              {item.badge && (
                <span className={`px-2 py-0.5 text-[9px] rounded-full font-mono font-bold shrink-0 ${item.badgeColor}`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer Security Badge */}
      <div className="p-3 m-2.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
          <ShieldAlert className="w-4 h-4 text-emerald-600" />
          <span>Security-First Core</span>
        </div>
        <p className="text-[10px] text-slate-500 leading-snug">
          RBAC Granular, RLS no PostgreSQL e Trilha SHA-256 ativados.
        </p>
      </div>

    </aside>
  );
};
