import React from 'react';
import {
  Wrench,
  AlertTriangle,
  Clock,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
  Building,
  FileText,
  Activity,
  ArrowUpRight,
  ShieldAlert,
  Flame,
  Users
} from 'lucide-react';
import { SystemStats, FacilityTicket, ComplianceDoc, AuditLog } from '../types';

interface CentralDashboardProps {
  stats: SystemStats;
  tickets: FacilityTicket[];
  complianceDocs: ComplianceDoc[];
  auditLogs: AuditLog[];
  onNavigateTab: (tab: any) => void;
  onOpenNewTicketModal: () => void;
}

export const CentralDashboard: React.FC<CentralDashboardProps> = ({
  stats,
  tickets = [],
  complianceDocs = [],
  auditLogs = [],
  onNavigateTab,
  onOpenNewTicketModal
}) => {
  const safeTickets = tickets || [];
  const safeAuditLogs = auditLogs || [];
  const criticalTickets = safeTickets.filter(t => t.priority === 'CRITICA' && t.status !== 'CONCLUIDO');
  const recentTickets = safeTickets.slice(0, 5);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      
      {/* Welcome & Executive Quick Action Header */}
      <div className="relative overflow-hidden rounded-2xl bg-white p-6 sm:p-8 border border-slate-200 text-slate-900 shadow-sm">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 font-mono">
                ENTERPRISE FACILITY HUB • PHASE 1 CORE
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">
              Visão Geral de Operações & Governança
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
              Monitoramento em tempo real do ecossistema corporativo: fluxo de chamados de Facilities, compliance de laudos regulatórios (NR-10, AVCB, PMOC) e auditoria imutável RLS.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onOpenNewTicketModal}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition flex items-center gap-2"
            >
              <Wrench className="w-4 h-4" />
              <span>Abrir Novo Chamado</span>
            </button>
            <button
              onClick={() => onNavigateTab('compliance')}
              className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-semibold text-xs transition flex items-center gap-2 shadow-xs"
            >
              <FileText className="w-4 h-4 text-emerald-600" />
              <span>Ver Compliance</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Chamados Abertos */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-blue-300 transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Chamados em Aberto</span>
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 group-hover:scale-105 transition-transform">
              <Wrench className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">{stats.openTickets + stats.inProgressTickets}</span>
            <span className="text-xs text-slate-500 font-medium">de {stats.totalTickets} total</span>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-xs text-blue-700 font-medium pt-2 border-t border-slate-100">
            <Clock className="w-3.5 h-3.5" />
            <span>{stats.inProgressTickets} em atendimento técnico</span>
          </div>
        </div>

        {/* Card 2: Emergências Críticas */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-rose-300 transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Emergências Críticas</span>
            <div className="p-2.5 rounded-xl bg-rose-50 text-rose-600 border border-rose-100 group-hover:scale-105 transition-transform">
              <Flame className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-rose-600 tracking-tight">{stats.criticalTickets}</span>
            <span className="text-xs text-slate-500 font-medium">SLA emergencial (&lt;2h)</span>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-xs text-rose-700 font-medium pt-2 border-t border-slate-100">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Atendimento prioritário</span>
          </div>
        </div>

        {/* Card 3: SLA Performance */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-emerald-300 transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Cumprimento de SLA</span>
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 group-hover:scale-105 transition-transform">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">{stats.slaCompliancePct}%</span>
            <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">Meta &gt;95%</span>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-xs text-emerald-700 font-medium pt-2 border-t border-slate-100">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Operações dentro do prazo</span>
          </div>
        </div>

        {/* Card 4: Compliance Regulatório */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-indigo-300 transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Compliance Regulatório</span>
            <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">{stats.overallCompliancePct}%</span>
            <span className="text-xs text-slate-500 font-medium">AVCB / PMOC / NR10</span>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-xs text-indigo-700 font-medium pt-2 border-t border-slate-100">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Laudos técnicos auditados</span>
          </div>
        </div>

      </div>

      {/* Critical Emergency Banner if exists */}
      {criticalTickets.length > 0 && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-rose-600 text-white font-bold text-xs shrink-0 flex items-center gap-1.5 shadow-xs">
              <Flame className="w-4 h-4 animate-bounce" />
              <span>ALERTA CRÍTICO</span>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">
                {criticalTickets[0].code} - {criticalTickets[0].title}
              </p>
              <p className="text-[11px] text-slate-600 mt-0.5">
                Unidade: <strong className="text-slate-900">{criticalTickets[0].unitName}</strong> • Responsável: <strong className="text-slate-900">{criticalTickets[0].assignedToName || 'Aguardando atribuição'}</strong>
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('facilities')}
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shrink-0 self-start sm:self-auto transition shadow-xs"
          >
            Assumir Atendimento Imutável
          </button>
        </div>
      )}

      {/* Main Grid: Recent Tickets & Live Audit Trail */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (2 cols): Chamados Recentes */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                Chamados Operacionais Recentes
              </h3>
              <p className="text-xs text-slate-500">Últimas demandas registradas nas unidades corporativas</p>
            </div>
            <button
              onClick={() => onNavigateTab('facilities')}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition"
            >
              <span>Ver Todos ({tickets.length})</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {recentTickets.map((t) => (
              <div
                key={t.id}
                className="p-4 rounded-xl border border-slate-100 bg-slate-50/60 hover:bg-slate-50 hover:border-slate-300 transition flex items-start justify-between gap-4 group"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-white text-slate-700 border border-slate-200">
                      {t.code}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      t.priority === 'CRITICA' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                      t.priority === 'ALTA' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                      'bg-slate-100 text-slate-700 border-slate-200'
                    }`}>
                      {t.priority}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{t.title}</h4>
                  <p className="text-[11px] text-slate-500 line-clamp-1">{t.unitName} • {t.locationArea}</p>
                </div>

                <div className="text-right shrink-0">
                  <span className={`inline-block px-2.5 py-1 rounded-lg text-[10px] font-bold border ${
                    t.status === 'EM_ANDAMENTO' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                    t.status === 'CONCLUIDO' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                    'bg-indigo-50 text-indigo-700 border-indigo-200'
                  }`}>
                    {(t.status || '').replace('_', ' ')}
                  </span>
                  <p className="text-[10px] text-slate-500 mt-1 font-mono">
                    SLA: {t.slaHours}h
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column (1 col): Trilha de Auditoria ao Vivo */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-600" />
                <span>Auditoria RLS (Live)</span>
              </h3>
              <p className="text-xs text-slate-500">Assinaturas SHA-256 no PostgreSQL</p>
            </div>
            <button
              onClick={() => onNavigateTab('compliance')}
              className="text-xs text-blue-600 font-semibold hover:underline"
            >
              Filtros
            </button>
          </div>

          <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
            {safeAuditLogs.slice(0, 5).map((log) => (
              <div key={log.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1.5 hover:border-slate-200 transition">
                <div className="flex items-center justify-between text-[10px] text-slate-500">
                  <span className="font-bold text-slate-900">{log.userName} ({log.userRole})</span>
                  <span className="font-mono text-slate-400">{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <p className="text-slate-700 text-[11px] leading-snug">{log.details}</p>
                <div className="pt-1.5 flex items-center justify-between text-[9px] text-slate-500 font-mono border-t border-slate-200">
                  <span>IP: {log.ipAddress}</span>
                  <span className="text-emerald-700 font-bold">SHA256 OK</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
