import React, { useState } from 'react';
import { Wrench, Clock, AlertTriangle, Building, X } from 'lucide-react';
import { Unit, TicketPriority } from '../types';

interface NewTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  units: Unit[];
  onCreateTicket: (ticketData: any) => Promise<void>;
}

export const NewTicketModal: React.FC<NewTicketModalProps> = ({
  isOpen,
  onClose,
  units,
  onCreateTicket
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<'CORRETIVA' | 'PREVENTIVA' | 'EMERGENCIAL' | 'MELHORIA'>('CORRETIVA');
  const [unitId, setUnitId] = useState(units[0]?.id || 'unit-01');
  const [locationArea, setLocationArea] = useState('Área Comum / Recepção');
  const [priority, setPriority] = useState<TicketPriority>('MEDIA');
  const [submitting, setSubmitting] = useState(false);

  const [assetCode, setAssetCode] = useState('');
  const [costCenter, setCostCenter] = useState('CC-FAC-2026');
  const [impactLevel, setImpactLevel] = useState<'NENHUM' | 'PARCIAL' | 'TOTAL'>('PARCIAL');
  const [attachmentName, setAttachmentName] = useState('');

  if (!isOpen) return null;

  const getSlaHours = (p: TicketPriority) => {
    switch (p) {
      case 'CRITICA': return 2;
      case 'ALTA': return 8;
      case 'MEDIA': return 24;
      case 'BAIXA': return 48;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;
    setSubmitting(true);

    const selectedUnit = units.find(u => u.id === unitId) || units[0];

    try {
      await onCreateTicket({
        title,
        description,
        category,
        unitId: selectedUnit.id,
        unitName: selectedUnit.name,
        locationArea,
        priority,
        slaHours: getSlaHours(priority),
        assetCode,
        costCenter,
        impactLevel,
        attachmentName,
        requesterName: 'Roberto Santos (Cliente TechCorp)'
      });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden my-8 text-white">
        
        <div className="bg-slate-950 p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider font-mono">
                Operações de Facilities
              </span>
              <h2 className="text-base font-bold text-white leading-tight">
                Abrir Novo Chamado Técnico
              </h2>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          
          <div>
            <label className="block text-slate-300 font-bold mb-1">
              Título da Solicitação / Problema
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Ex: Vazamento no Sistema de Ar Condicionado do 18º Andar"
              className="w-full px-3 py-2 rounded-xl border border-slate-800 bg-slate-950 text-white focus:outline-none focus:border-blue-500/50"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1">
              Descrição Detalhada do Chamado
            </label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Descreva a ocorrência, urgência e impacto nas operações prediais..."
              className="w-full px-3 py-2 rounded-xl border border-slate-800 bg-slate-950 text-white focus:outline-none focus:border-blue-500/50"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-bold mb-1">Categoria</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-slate-800 bg-slate-950 text-white focus:outline-none focus:border-blue-500/50"
              >
                <option value="CORRETIVA">Manutenção Corretiva</option>
                <option value="PREVENTIVA">Manutenção Preventiva</option>
                <option value="EMERGENCIAL">Emergencial / Segurança</option>
                <option value="MELHORIA">Melhoria de Infraestrutura</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">Unidade Operacional</label>
              <select
                value={unitId}
                onChange={e => setUnitId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-800 bg-slate-950 text-white focus:outline-none focus:border-blue-500/50"
              >
                {units.map(u => (
                  <option key={u.id} value={u.id}>{u.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-bold mb-1">Código / TAG do Ativo EAM (Opções)</label>
              <input
                type="text"
                value={assetCode}
                onChange={e => setAssetCode(e.target.value)}
                placeholder="Ex: AST-CHILLER-01"
                className="w-full px-3 py-2 rounded-xl border border-slate-800 bg-slate-950 font-mono text-white focus:outline-none focus:border-blue-500/50"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">Centro de Custo Responsável</label>
              <input
                type="text"
                value={costCenter}
                onChange={e => setCostCenter(e.target.value)}
                placeholder="Ex: CC-FAC-2026"
                className="w-full px-3 py-2 rounded-xl border border-slate-800 bg-slate-950 font-mono text-white focus:outline-none focus:border-blue-500/50"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-bold mb-1">Grau de Impacto Operacional</label>
              <select
                value={impactLevel}
                onChange={e => setImpactLevel(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-slate-800 bg-slate-950 text-white focus:outline-none focus:border-blue-500/50"
              >
                <option value="NENHUM">Sem Impacto Direto nas Atividades</option>
                <option value="PARCIAL">Impacto Parcial no Setor</option>
                <option value="TOTAL">Paralisação Total Crítica</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">Anexar Evidência Digital / Foto</label>
              <input
                type="text"
                value={attachmentName}
                onChange={e => setAttachmentName(e.target.value)}
                placeholder="Ex: foto_vazamento_chiller_01.jpg"
                className="w-full px-3 py-2 rounded-xl border border-slate-800 bg-slate-950 text-white focus:outline-none focus:border-blue-500/50"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-bold mb-1">Local Exato / Setor</label>
              <input
                type="text"
                required
                value={locationArea}
                onChange={e => setLocationArea(e.target.value)}
                placeholder="Ex: Bloco B - Sala de Reuniões 02"
                className="w-full px-3 py-2 rounded-xl border border-slate-800 bg-slate-950 text-white focus:outline-none focus:border-blue-500/50"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">Nível de Prioridade</label>
              <select
                value={priority}
                onChange={e => setPriority(e.target.value as TicketPriority)}
                className="w-full px-3 py-2 rounded-xl border border-slate-800 bg-slate-950 text-white focus:outline-none focus:border-blue-500/50"
              >
                <option value="CRITICA">CRÍTICA (em até 2h)</option>
                <option value="ALTA">ALTA (em até 8h)</option>
                <option value="MEDIA">MÉDIA (em até 24h)</option>
                <option value="BAIXA">BAIXA (em até 48h)</option>
              </select>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-900/60 text-amber-300 flex items-center justify-between">
            <span className="flex items-center gap-2 font-bold">
              <Clock className="w-4 h-4 text-amber-400" />
              SLA Estimado de Resolução:
            </span>
            <span className="font-mono font-bold text-xs bg-amber-900/80 text-amber-200 border border-amber-700/60 px-2.5 py-0.5 rounded">
              {getSlaHours(priority)} horas
            </span>
          </div>

          <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-lg shadow-blue-600/20 transition"
            >
              {submitting ? 'Registrando Chamado...' : 'Registrar Chamado'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
