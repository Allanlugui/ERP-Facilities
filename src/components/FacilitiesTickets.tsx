import React, { useState } from 'react';
import {
  Wrench,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Filter,
  UserCheck,
  Building,
  Flame,
  Search,
  ChevronRight,
  ShieldAlert,
  History,
  Check,
  X
} from 'lucide-react';
import { FacilityTicket, TicketPriority, TicketStatus, Unit, Collaborator } from '../types';

interface FacilitiesTicketsProps {
  tickets: FacilityTicket[];
  units: Unit[];
  collaborators: Collaborator[];
  onOpenNewTicketModal: () => void;
  onUpdateTicketStatus: (id: string, status: TicketStatus, assignedToId?: string, assignedToName?: string) => void;
  onApproveCost?: (ticketId: string, approved: boolean, comment?: string) => void;
}

export const FacilitiesTickets: React.FC<FacilitiesTicketsProps> = ({
  tickets,
  units,
  collaborators,
  onOpenNewTicketModal,
  onUpdateTicketStatus,
  onApproveCost
}) => {
  const [filterPriority, setFilterPriority] = useState<string>('TODAS');
  const [filterStatus, setFilterStatus] = useState<string>('TODOS');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedTimelineTicket, setSelectedTimelineTicket] = useState<FacilityTicket | null>(null);

  const filteredTickets = tickets.filter(t => {
    const matchesPriority = filterPriority === 'TODAS' || t.priority === filterPriority;
    const matchesStatus = filterStatus === 'TODOS' || t.status === filterStatus;
    const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          t.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          t.unitName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesPriority && matchesStatus && matchesSearch;
  });

  const getPriorityStyle = (p: TicketPriority) => {
    switch (p) {
      case 'CRITICA': return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'ALTA': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'MEDIA': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'BAIXA': return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getStatusStyle = (s: TicketStatus) => {
    switch (s) {
      case 'EM_ANDAMENTO': return 'bg-blue-50 text-blue-700 border border-blue-200';
      case 'CONCLUIDO': return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
      case 'AGUARDANDO_PECAS': return 'bg-amber-50 text-amber-700 border border-amber-200';
      case 'NOVO': return 'bg-indigo-50 text-indigo-700 border border-indigo-200';
      default: return 'bg-slate-100 text-slate-700 border border-slate-200';
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
              <Wrench className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Chamados & Operações de Facilities
            </h2>
          </div>
          <p className="text-xs text-slate-600 mt-1">
            Controle de demandas corretivas, preventivas e emergenciais com cronômetro de SLA e atribuição técnica.
          </p>
        </div>

        <button
          onClick={onOpenNewTicketModal}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition flex items-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Abrir Novo Chamado</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm text-xs">
        
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Buscar por código, título ou prédio..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 transition"
          />
        </div>

        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-semibold text-slate-600">Prioridade:</span>
            <select
              value={filterPriority}
              onChange={e => setFilterPriority(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none"
            >
              <option value="TODAS">Todas</option>
              <option value="CRITICA">CRÍTICA</option>
              <option value="ALTA">ALTA</option>
              <option value="MEDIA">MÉDIA</option>
              <option value="BAIXA">BAIXA</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-600">Status:</span>
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none"
            >
              <option value="TODOS">Todos</option>
              <option value="NOVO">NOVO</option>
              <option value="EM_ANDAMENTO">EM ANDAMENTO</option>
              <option value="AGUARDANDO_PECAS">AGUARDANDO PEÇAS</option>
              <option value="CONCLUIDO">CONCLUÍDO</option>
            </select>
          </div>
        </div>

      </div>

      {/* Tickets List Grid */}
      <div className="space-y-3">
        {filteredTickets.map(t => (
          <div
            key={t.id}
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-slate-300 transition flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div className="space-y-2 max-w-2xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-mono font-bold bg-slate-50 text-slate-700 border border-slate-200 px-2 py-0.5 rounded">
                  {t.code}
                </span>
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${getPriorityStyle(t.priority)}`}>
                  Prioridade: {t.priority}
                </span>
                <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                  {t.category}
                </span>

                {t.costApprovalStatus === 'PENDENTE' && (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1 animate-pulse">
                    <ShieldAlert className="w-3 h-3 text-amber-700" /> Excede Alçada (R$ {t.estimatedCost})
                  </span>
                )}
              </div>

              <h3 className="text-sm font-bold text-slate-900">{t.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{t.description}</p>
              
              <div className="pt-1 flex flex-wrap items-center gap-4 text-[11px] text-slate-500">
                <span className="flex items-center gap-1.5"><Building className="w-3.5 h-3.5 text-slate-400" /> <strong className="text-slate-800">{t.unitName}</strong> ({t.locationArea})</span>
                <span>Solicitante: <strong className="text-slate-800">{t.requesterName}</strong></span>
                {t.assignedToName && (
                  <span className="flex items-center gap-1 text-blue-700 font-semibold">
                    <UserCheck className="w-3.5 h-3.5" /> Técnico: {t.assignedToName}
                  </span>
                )}
                {t.assetName && (
                  <span className="text-indigo-700 font-medium">Ativo: {t.assetName}</span>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row md:flex-col items-start sm:items-center md:items-end justify-between gap-3 border-t md:border-t-0 border-slate-100 pt-3 md:pt-0 shrink-0">
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusStyle(t.status)}`}>
                {t.status.replace('_', ' ')}
              </span>

              <div className="text-left md:text-right text-xs">
                <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">SLA de Atendimento:</p>
                <p className="font-mono font-bold text-slate-900 flex items-center gap-1 mt-0.5">
                  <Clock className="w-3.5 h-3.5 text-amber-600" /> {t.slaHours}h acordadas
                </p>
              </div>

              {/* Status Update Quick Action */}
              <div className="flex flex-wrap items-center gap-2">
                
                {/* Timeline Modal Trigger */}
                <button
                  onClick={() => setSelectedTimelineTicket(t)}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition flex items-center gap-1 cursor-pointer"
                  title="Ver Linha do Tempo e Trilhas de Auditoria"
                >
                  <History className="w-3.5 h-3.5" />
                  <span>Timeline</span>
                </button>

                {/* Cost Approval Action for Admins/Managers */}
                {(t.status === 'AGUARDANDO_APROVACAO' || t.costApprovalStatus === 'PENDENTE') && onApproveCost && (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onApproveCost(t.id, true, 'Aprovado por Alçada Gerencial')}
                      className="px-2.5 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition flex items-center gap-1 cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" /> Aprovar
                    </button>
                    <button
                      onClick={() => onApproveCost(t.id, false, 'Reprovado por Alçada Financeira')}
                      className="px-2.5 py-1 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition flex items-center gap-1 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" /> Rejeitar
                    </button>
                  </div>
                )}

                {t.status === 'NOVO' && (
                  <button
                    onClick={() => {
                      const tech = collaborators[0] || { id: 'colab-01', name: 'Marcelo Pires' };
                      onUpdateTicketStatus(t.id, 'EM_ANDAMENTO', tech.id, tech.name);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-xs cursor-pointer"
                  >
                    Assumir Atendimento
                  </button>
                )}

                {t.status === 'EM_ANDAMENTO' && (
                  <button
                    onClick={() => onUpdateTicketStatus(t.id, 'CONCLUIDO')}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-xs cursor-pointer"
                  >
                    Concluir Chamado
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Timeline Modal Drawer */}
      {selectedTimelineTicket && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl space-y-4 text-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Trilha de Auditoria & Timeline: {selectedTimelineTicket.code}
                </h3>
                <p className="text-xs text-slate-500">{selectedTimelineTicket.title}</p>
              </div>
              <button
                onClick={() => setSelectedTimelineTicket(null)}
                className="text-slate-400 hover:text-slate-700 font-bold p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="relative pl-4 border-l-2 border-slate-200 space-y-4 max-h-80 overflow-y-auto py-2">
              {selectedTimelineTicket.timelineEvents && selectedTimelineTicket.timelineEvents.length > 0 ? (
                selectedTimelineTicket.timelineEvents.map((evt) => (
                  <div key={evt.id} className="relative">
                    <span className="absolute -left-[21px] top-0.5 w-2.5 h-2.5 rounded-full bg-blue-600 border-2 border-white" />
                    <p className="font-bold text-xs text-slate-900">{evt.title}</p>
                    <p className="text-xs text-slate-600 mt-0.5">{evt.description}</p>
                    <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400 font-mono">
                      <span>{new Date(evt.timestamp).toLocaleString('pt-BR')}</span>
                      <span>•</span>
                      <span>{evt.authorName}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-xs text-slate-500 italic">Histórico de eventos sendo compilado.</div>
              )}
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-100">
              <button
                onClick={() => setSelectedTimelineTicket(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
