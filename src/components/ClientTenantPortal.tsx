import React, { useState } from 'react';
import {
  Building2,
  Clock,
  Plus,
  CheckCircle2,
  AlertOctagon,
  FileText,
  Star,
  Send,
  Calendar,
  User,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  ThumbsUp,
  MessageSquare,
  Search,
  ExternalLink,
  Layers
} from 'lucide-react';
import { FacilityTicket, Unit, ComplianceDoc, NpsFeedback } from '../types';

interface ClientTenantPortalProps {
  tickets: FacilityTicket[];
  units: Unit[];
  complianceDocs: ComplianceDoc[];
  onCreateTicket: (ticket: Partial<FacilityTicket>) => void;
  onSubmitNps: (ticketId: string, nps: NpsFeedback) => void;
}

export const ClientTenantPortal: React.FC<ClientTenantPortalProps> = ({
  tickets = [],
  units = [],
  complianceDocs = [],
  onCreateTicket,
  onSubmitNps
}) => {
  const [activeTab, setActiveTab] = useState<'tracker' | 'new_ticket' | 'docs'>('tracker');
  const [selectedTicket, setSelectedTicket] = useState<FacilityTicket | null>(null);

  // NPS Modal state
  const [showNpsModal, setShowNpsModal] = useState<FacilityTicket | null>(null);
  const [npsScore, setNpsScore] = useState<number>(10);
  const [npsComment, setNpsComment] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>(['Pontualidade', 'Qualidade Técnica']);

  // New Ticket Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<FacilityTicket['category']>('CORRETIVA');
  const [unitId, setUnitId] = useState(units[0]?.id || 'unit-01');
  const [locationArea, setLocationArea] = useState('');
  const [priority, setPriority] = useState<FacilityTicket['priority']>('MEDIA');

  // Dynamic SLA Calculation Helper
  const getDynamicSlaHours = (p: FacilityTicket['priority'], c: FacilityTicket['category']) => {
    if (c === 'EMERGENCIAL' || p === 'CRITICA') return 2;
    if (p === 'ALTA') return 8;
    if (p === 'MEDIA') return 24;
    return 48;
  };

  const currentDynamicSla = getDynamicSlaHours(priority, category);

  const handleCreateTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const targetUnit = units.find(u => u.id === unitId) || units[0];

    onCreateTicket({
      title,
      description,
      category,
      unitId: targetUnit?.id,
      unitName: targetUnit?.name,
      locationArea,
      priority,
      requesterName: 'Roberto Santos (Cliente Corp)',
      slaHours: currentDynamicSla
    });

    // Reset Form & Redirect to Tracker
    setTitle('');
    setDescription('');
    setLocationArea('');
    setActiveTab('tracker');
  };

  const handleNpsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showNpsModal) return;

    onSubmitNps(showNpsModal.id, {
      score: npsScore,
      comment: npsComment,
      csatTags: selectedTags,
      createdAt: new Date().toISOString()
    });

    setShowNpsModal(null);
    setNpsComment('');
  };

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const getStatusBadge = (status: FacilityTicket['status']) => {
    switch (status) {
      case 'NOVO':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">Novo Chamado</span>;
      case 'EM_ANDAMENTO':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">Em Atendimento</span>;
      case 'AGUARDANDO_PECAS':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">Aguardando Peças</span>;
      case 'AGUARDANDO_APROVACAO':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-orange-50 text-orange-700 border border-orange-200">Análise de Orçamento</span>;
      case 'CONCLUIDO':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">Concluído</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">Cancelado</span>;
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-blue-950 text-white p-6 rounded-2xl border border-slate-800 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30">
              Portal Tenant Omnichannel
            </span>
            <span className="text-xs text-slate-400">| Atendimento Corporativo</span>
          </div>
          <h2 className="text-2xl font-bold mt-1 tracking-tight">
            Portal do Inquilino & Cliente Corporativo
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Acompanhamento em tempo real das operações de facilities da sua empresa, prestação de contas, SLA dinâmico e avaliação de qualidade (NPS/CSAT).
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setActiveTab('new_ticket')}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Abrir Chamado Rápido</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-8 text-xs font-bold">
        <button
          onClick={() => setActiveTab('tracker')}
          className={`pb-3.5 border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'tracker'
              ? 'border-blue-600 text-blue-700 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Meus Chamados & Linha do Tempo</span>
          <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-mono text-[10px] border border-slate-200">
            {tickets.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('new_ticket')}
          className={`pb-3.5 border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'new_ticket'
              ? 'border-blue-600 text-blue-700 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Plus className="w-4 h-4" />
          <span>Solicitar Atendimento (SLA Dinâmico)</span>
        </button>

        <button
          onClick={() => setActiveTab('docs')}
          className={`pb-3.5 border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'docs'
              ? 'border-blue-600 text-blue-700 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Certificados da Edificação (AVCB/PMOC)</span>
          <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-mono text-[10px] border border-emerald-200">
            {complianceDocs.length}
          </span>
        </button>
      </div>

      {/* TAB 1: TICKET TRACKER & TIMELINE */}
      {activeTab === 'tracker' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Ticket List */}
          <div className="lg:col-span-2 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Chamados Ativos na Sua Unidade
            </h3>

            {tickets.map((t) => (
              <div
                key={t.id}
                onClick={() => setSelectedTicket(t)}
                className={`bg-white rounded-2xl border p-5 shadow-xs transition cursor-pointer space-y-3 ${
                  selectedTicket?.id === t.id
                    ? 'border-blue-500 ring-2 ring-blue-500/10'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                      {t.code}
                    </span>
                    {getStatusBadge(t.status)}
                  </div>
                  
                  <span className="text-[11px] font-mono font-bold text-slate-600 bg-slate-50 px-2.5 py-0.5 rounded-full border border-slate-200">
                    SLA: {t.slaHours}h
                  </span>
                </div>

                <div>
                  <h4 className="font-bold text-slate-900 text-sm leading-snug">{t.title}</h4>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-1">{t.description}</p>
                </div>

                <div className="flex flex-wrap items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500 gap-2">
                  <div className="flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    <span>{t.unitName} • {t.locationArea}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {t.status === 'CONCLUIDO' && !t.npsFeedback && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowNpsModal(t);
                        }}
                        className="px-2.5 py-1 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold text-[11px] border border-amber-200 transition flex items-center gap-1"
                      >
                        <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                        <span>Avaliar Atendimento</span>
                      </button>
                    )}

                    {t.npsFeedback && (
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-bold text-[10px] border border-emerald-200 flex items-center gap-1">
                        <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                        NPS {t.npsFeedback.score}/10
                      </span>
                    )}

                    <span className="text-[11px] text-blue-600 font-semibold hover:underline flex items-center gap-0.5">
                      Detalhes
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Ticket Detail / Timeline Panel */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4 h-fit">
            {selectedTicket ? (
              <div className="space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-[10px] font-bold text-slate-500">{selectedTicket.code}</span>
                    {getStatusBadge(selectedTicket.status)}
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm">{selectedTicket.title}</h3>
                  <p className="text-xs text-slate-500 mt-1">{selectedTicket.unitName} - {selectedTicket.locationArea}</p>
                </div>

                {/* Timeline Events */}
                <div>
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                    Linha do Tempo em Tempo Real
                  </h4>

                  <div className="relative pl-4 border-l-2 border-slate-200 space-y-4">
                    {selectedTicket.timelineEvents && selectedTicket.timelineEvents.length > 0 ? (
                      selectedTicket.timelineEvents.map((evt) => (
                        <div key={evt.id} className="relative">
                          <span className="absolute -left-[21px] top-0.5 w-2.5 h-2.5 rounded-full bg-blue-600 border-2 border-white" />
                          <p className="font-bold text-xs text-slate-900">{evt.title}</p>
                          <p className="text-[11px] text-slate-600 mt-0.5">{evt.description}</p>
                          <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400">
                            <span>{new Date(evt.timestamp).toLocaleString('pt-BR')}</span>
                            <span>•</span>
                            <span>{evt.authorName}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-xs text-slate-500 italic">
                        Nenhum evento registrado ainda nesta OS.
                      </div>
                    )}
                  </div>
                </div>

                {/* NPS Summary if present */}
                {selectedTicket.npsFeedback && (
                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-amber-900">Sua Avaliação NPS</span>
                      <span className="font-bold font-mono text-xs text-amber-700">{selectedTicket.npsFeedback.score}/10</span>
                    </div>
                    {selectedTicket.npsFeedback.comment && (
                      <p className="text-xs text-amber-800 italic">"{selectedTicket.npsFeedback.comment}"</p>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-10 space-y-2 text-slate-400">
                <Clock className="w-8 h-8 mx-auto stroke-1" />
                <p className="text-xs font-medium">Selecione um chamado ao lado para ver o histórico detalhado em tempo real.</p>
              </div>
            )}
          </div>

        </div>
      )}

      {/* TAB 2: NEW TICKET FORM WITH DYNAMIC SLA */}
      {activeTab === 'new_ticket' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm max-w-3xl mx-auto space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-base font-bold text-slate-900">
              Solicitar Atendimento de Facilities
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Defina o local, categoria e severidade para acionamento automatizado do SLA.
            </p>
          </div>

          <form onSubmit={handleCreateTicketSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Título da Solicitacão</label>
              <input
                type="text"
                required
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Ex: Ar condicionado vazando água sobre as estações do 18º andar"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:border-blue-500 text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Unidade / Edifício</label>
                <select
                  value={unitId}
                  onChange={e => setUnitId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:border-blue-500 text-xs"
                >
                  {units.map(u => (
                    <option key={u.id} value={u.id}>{u.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Área / Local Exato</label>
                <input
                  type="text"
                  required
                  value={locationArea}
                  onChange={e => setLocationArea(e.target.value)}
                  placeholder="Ex: Sala de Reunião B2, 18º Andar"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:border-blue-500 text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Categoria Operacional</label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value as FacilityTicket['category'])}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:border-blue-500 text-xs"
                >
                  <option value="EMERGENCIAL">Emergencial (Chiller, Inundação, Apagão)</option>
                  <option value="CORRETIVA">Corretiva (Manutenção Geral)</option>
                  <option value="PREVENTIVA">Preventiva (Inspeção Periódica)</option>
                  <option value="MELHORIA">Melhoria / Adaptacao</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Prioridade / Criticidade</label>
                <select
                  value={priority}
                  onChange={e => setPriority(e.target.value as FacilityTicket['priority'])}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:border-blue-500 text-xs"
                >
                  <option value="CRITICA">Crítica (Risco imediato à operação)</option>
                  <option value="ALTA">Alta (Impacta ambiente comercial)</option>
                  <option value="MEDIA">Média (Avaria pontual)</option>
                  <option value="BAIXA">Baixa (Pequenos ajustes)</option>
                </select>
              </div>
            </div>

            {/* Dynamic SLA Highlight Box */}
            <div className="p-4 bg-blue-50 rounded-2xl border border-blue-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-blue-600 shrink-0" />
                <div>
                  <p className="font-bold text-slate-900 text-xs">Cálculo Automático de SLA Contratual</p>
                  <p className="text-[11px] text-slate-600">Tempo estimado para primeiro atendimento e resolução prévia.</p>
                </div>
              </div>
              <span className="text-base font-bold font-mono text-blue-700 bg-white px-3 py-1 rounded-xl border border-blue-200 shadow-2xs">
                {currentDynamicSla} horas
              </span>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Descrição Detalhada</label>
              <textarea
                rows={4}
                required
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Forneça detalhes técnicos, fotos ou especificações adicionais sobre o problema..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:border-blue-500 text-xs"
              />
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setActiveTab('tracker')}
                className="px-4 py-2.5 rounded-xl text-slate-600 hover:text-slate-900 transition font-semibold"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition shadow-xs flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Enviar Chamado</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 3: LEGAL COMPLIANCE DOCS FOR TENANT */}
      {activeTab === 'docs' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Certificados e Documentos da Edificação
              </h3>
              <p className="text-xs text-slate-500">Acesso transparente às licenças regulatórias (Corpo de Bombeiros, Vigilância Sanitária, Elétrica)</p>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> 100% Regularizado
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {complianceDocs.map((doc) => (
              <div key={doc.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-mono text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                      {doc.category}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">Validade: {doc.expirationDate}</span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">{doc.title}</h4>
                  <p className="text-xs text-slate-600 mt-1">{doc.unitName} - Emissor: {doc.issuingBody}</p>
                </div>

                <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 font-mono">HASH: {(doc.sha256Hash || '').slice(0, 16)}...</span>
                  <button className="text-xs text-blue-600 font-bold hover:underline flex items-center gap-1">
                    <span>Visualizar PDF</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* NPS Satisfaction Modal */}
      {showNpsModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl space-y-5 text-slate-900">
            <div className="text-center space-y-1">
              <span className="p-3 bg-amber-50 text-amber-600 rounded-full inline-block border border-amber-200">
                <Star className="w-6 h-6 fill-amber-500" />
              </span>
              <h3 className="text-base font-bold text-slate-900">Pesquisa de Satisfação (NPS)</h3>
              <p className="text-xs text-slate-500">
                Como você avalia o atendimento do chamado <span className="font-mono font-bold text-slate-800">[{showNpsModal.code}]</span>?
              </p>
            </div>

            <form onSubmit={handleNpsSubmit} className="space-y-4 text-xs">
              
              {/* Score 0 to 10 Picker */}
              <div>
                <label className="block text-slate-700 font-semibold mb-2 text-center">
                  Sua Nota: <span className="font-mono text-base font-bold text-blue-600">{npsScore} / 10</span>
                </label>
                <div className="flex items-center justify-between gap-1 overflow-x-auto pb-1">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((score) => (
                    <button
                      key={score}
                      type="button"
                      onClick={() => setNpsScore(score)}
                      className={`w-8 h-8 rounded-xl font-bold font-mono transition text-xs ${
                        npsScore === score
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {score}
                    </button>
                  ))}
                </div>
              </div>

              {/* CSAT Tags */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1.5">Destaques do Atendimento</label>
                <div className="flex flex-wrap gap-1.5">
                  {['Pontualidade', 'Qualidade Técnica', 'Atendimento Cordial', 'Limpeza do Local', 'Comunicação'].map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition ${
                        selectedTags.includes(tag)
                          ? 'bg-blue-100 text-blue-800 border border-blue-300'
                          : 'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Comment text */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Comentários Adicionais</label>
                <textarea
                  rows={3}
                  value={npsComment}
                  onChange={e => setNpsComment(e.target.value)}
                  placeholder="Conte-nos o que funcionou bem ou o que pode melhorar..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowNpsModal(null)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:text-slate-900 transition"
                >
                  Pular
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition shadow-xs"
                >
                  Enviar Avaliação
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
