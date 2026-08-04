import React, { useState } from 'react';
import {
  Building2,
  ShieldCheck,
  UserCheck,
  Bell,
  LogOut,
  CheckCircle2,
  AlertTriangle,
  ChevronDown,
  Lock,
  KeyRound,
  FileCheck2
} from 'lucide-react';
import { User, Tenant, AuditLog } from '../types';

interface NavbarProps {
  currentUser: User;
  tenants: Tenant[];
  activeTenant: Tenant;
  auditLogs: AuditLog[];
  onSwitchUserRole: (role: 'ADMIN' | 'OPERACIONAL' | 'CLIENTE') => void;
  onSwitchTenant: (tenantId: string) => void;
  onOpenTermModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  tenants = [],
  activeTenant,
  auditLogs = [],
  onSwitchUserRole,
  onSwitchTenant,
  onOpenTermModal
}) => {
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showTenantMenu, setShowTenantMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'OPERACIONAL':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'CLIENTE':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getRoleTitle = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'Administrador Geral (Full Control)';
      case 'OPERACIONAL': return 'Gestão Operacional (Facilities)';
      case 'CLIENTE': return 'Cliente Corporativo (Tenant)';
      default: return role;
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 lg:px-6 py-2.5 text-slate-800 shadow-xs">
      <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto">
        
        {/* Left: Brand Identity & Tenant Switcher */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm">
              <Building2 className="w-4 h-4 text-white" />
            </div>
            <div className="hidden sm:block">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-widest text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200">
                  CORE PLATFORM
                </span>
              </div>
              <h1 className="text-sm font-bold text-slate-900 tracking-tight leading-snug">
                Corporate Facilities & Governance
              </h1>
            </div>
          </div>

          <div className="h-5 w-px bg-slate-200 hidden md:block" />

          {/* Tenant Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowTenantMenu(!showTenantMenu);
                setShowRoleMenu(false);
                setShowNotifications(false);
              }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-medium text-slate-800 transition shadow-xs"
              title="Alternar Organização Multi-Tenant"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <div className="text-left leading-none">
                <span className="text-[9px] font-bold text-slate-400 block uppercase tracking-wider">Tenant</span>
                <span className="font-semibold text-slate-900 max-w-[130px] truncate block">
                  {activeTenant.name}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
            </button>

            {showTenantMenu && (
              <div className="absolute left-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 py-2.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3.5 py-1.5 text-[10px] font-bold tracking-wider text-slate-500 uppercase border-b border-slate-100 mb-1 flex items-center justify-between">
                  <span>Organizações Multi-Tenant</span>
                  <span className="text-[9px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-mono font-bold">{tenants.length} ATIVAS</span>
                </div>
                <div className="space-y-0.5 px-1 max-h-60 overflow-y-auto">
                  {tenants.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => {
                        onSwitchTenant(t.id);
                        setShowTenantMenu(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between hover:bg-slate-50 transition ${
                        t.id === activeTenant.id ? 'bg-blue-50 border border-blue-200 text-blue-700 font-semibold' : 'text-slate-700'
                      }`}
                    >
                      <div>
                        <p className="font-bold text-slate-900">{t.name}</p>
                        <p className="text-[10px] text-slate-500 font-mono mt-0.5">CNPJ: {t.cnpj}</p>
                      </div>
                      {t.id === activeTenant.id && <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Controls: Security Badge, Role Switcher, Notifications, User */}
        <div className="flex items-center gap-2.5">
          
          {/* Security Status Badge */}
          <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-50 text-slate-700 text-[11px] font-medium border border-slate-200">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>PostgreSQL RLS: <strong className="text-emerald-700 font-semibold">Ativo & Auditado</strong></span>
          </div>

          {/* Terms Acceptance Badge */}
          <button
            onClick={onOpenTermModal}
            className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-semibold border transition ${
              currentUser.termAccepted
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 animate-pulse'
            }`}
            title="Clique para visualizar o Termo de Governança e Aceite"
          >
            <FileCheck2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>LGPD: {currentUser.termAccepted ? 'Termo Assinado' : 'Pendente Aceite'}</span>
          </button>

          {/* Notification Drawer Button */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowRoleMenu(false);
                setShowTenantMenu(false);
              }}
              className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-100 relative transition shadow-xs"
              title="Notificações e Auditoria Recente"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-600 animate-ping" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-600" />
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 p-3.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 mb-2.5">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                    Trilha de Auditoria Live
                  </span>
                  <span className="text-[10px] bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full font-mono font-bold">
                    {(auditLogs || []).length} logs
                  </span>
                </div>

                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                  {(auditLogs || []).slice(0, 4).map((log) => (
                    <div key={log.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs hover:border-slate-300 transition">
                      <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1">
                        <span className="font-bold text-slate-900">{log.userName}</span>
                        <span className="font-mono text-slate-400">{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <p className="text-slate-700 text-[11px] leading-snug">{log.details}</p>
                      <div className="mt-1.5 flex items-center justify-between text-[9px] text-slate-500 font-mono pt-1 border-t border-slate-200">
                        <span className="flex items-center gap-1">
                          <Lock className="w-2.5 h-2.5 text-emerald-600" />
                          SHA256: {(log.integrityHash || '').slice(0, 8)}...
                        </span>
                        <span className="text-slate-400">{log.ipAddress}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Role Switcher & User Profile Menu */}
          <div className="relative">
            <button
              onClick={() => {
                setShowRoleMenu(!showRoleMenu);
                setShowTenantMenu(false);
                setShowNotifications(false);
              }}
              className="flex items-center gap-2.5 p-1 pl-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition shadow-xs"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-7 h-7 rounded-lg object-cover ring-2 ring-blue-500/20"
              />
              <div className="text-left hidden lg:block pr-1">
                <p className="text-xs font-bold text-slate-900 leading-none">
                  {currentUser.name}
                </p>
                <div className="mt-1 flex items-center gap-1">
                  <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded border ${getRoleBadgeColor(currentUser.role)}`}>
                    {currentUser.role}
                  </span>
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {showRoleMenu && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 py-2.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-4 py-2.5 border-b border-slate-100">
                  <p className="text-xs font-bold text-slate-900">{currentUser.name}</p>
                  <p className="text-[11px] text-slate-500 truncate font-mono mt-0.5">{currentUser.email}</p>
                  <div className="mt-1.5 flex items-center gap-1.5">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getRoleBadgeColor(currentUser.role)}`}>
                      {getRoleTitle(currentUser.role)}
                    </span>
                  </div>
                </div>

                <div className="px-3.5 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">
                  Simular Perfil de Acesso (RBAC Test)
                </div>

                <div className="px-1 space-y-0.5">
                  <button
                    onClick={() => {
                      onSwitchUserRole('ADMIN');
                      setShowRoleMenu(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between hover:bg-slate-50 transition ${
                      currentUser.role === 'ADMIN' ? 'font-bold text-indigo-700 bg-indigo-50 border border-indigo-200' : 'text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <KeyRound className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Administrador Geral</span>
                    </div>
                    {currentUser.role === 'ADMIN' && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />}
                  </button>

                  <button
                    onClick={() => {
                      onSwitchUserRole('OPERACIONAL');
                      setShowRoleMenu(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between hover:bg-slate-50 transition ${
                      currentUser.role === 'OPERACIONAL' ? 'font-bold text-blue-700 bg-blue-50 border border-blue-200' : 'text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                      <span>Equipe Operacional</span>
                    </div>
                    {currentUser.role === 'OPERACIONAL' && <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />}
                  </button>

                  <button
                    onClick={() => {
                      onSwitchUserRole('CLIENTE');
                      setShowRoleMenu(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between hover:bg-slate-50 transition ${
                      currentUser.role === 'CLIENTE' ? 'font-bold text-emerald-700 bg-emerald-50 border border-emerald-200' : 'text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Building2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Cliente Corporativo</span>
                    </div>
                    {currentUser.role === 'CLIENTE' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                  </button>
                </div>

                <div className="border-t border-slate-100 mt-2 pt-1.5 px-1.5">
                  <button
                    onClick={() => {
                      onOpenTermModal();
                      setShowRoleMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 rounded-xl flex items-center gap-2 transition"
                  >
                    <FileCheck2 className="w-3.5 h-3.5 text-amber-600" />
                    <span>Revisar Termo LGPD de Aceite</span>
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </header>
  );
};
