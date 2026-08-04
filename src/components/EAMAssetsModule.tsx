import React, { useState } from 'react';
import {
  Cpu,
  Wrench,
  ShieldCheck,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Building,
  Calendar,
  DollarSign,
  FileText,
  ChevronRight,
  Zap,
  Activity,
  Layers,
  Sparkles
} from 'lucide-react';
import { Asset, MaintenancePlan, Unit, AssetCategory, PlanFrequency } from '../types';

interface EAMAssetsModuleProps {
  assets: Asset[];
  maintenancePlans: MaintenancePlan[];
  units: Unit[];
  onAddAsset: (asset: Partial<Asset>) => void;
  onAddPlan: (plan: Partial<MaintenancePlan>) => void;
  onCreateTicketFromAsset?: (asset: Asset) => void;
}

export const EAMAssetsModule: React.FC<EAMAssetsModuleProps> = ({
  assets = [],
  maintenancePlans = [],
  units = [],
  onAddAsset,
  onAddPlan,
  onCreateTicketFromAsset
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'assets' | 'pmoc'>('assets');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedUnit, setSelectedUnit] = useState<string>('ALL');

  // Modals
  const [showAddAssetModal, setShowAddAssetModal] = useState(false);
  const [showAddPlanModal, setShowAddPlanModal] = useState(false);
  const [selectedAssetDetail, setSelectedAssetDetail] = useState<Asset | null>(null);

  // New Asset Form State
  const [newAsset, setNewAsset] = useState<Partial<Asset>>({
    name: '',
    category: 'HVAC_CHILLER',
    unitId: units[0]?.id || 'unit-01',
    unitName: units[0]?.name || 'Torre Berrini',
    locationArea: '',
    serialNumber: '',
    manufacturer: '',
    model: '',
    estimatedValue: 100000
  });

  // New Plan Form State
  const [newPlan, setNewPlan] = useState<Partial<MaintenancePlan>>({
    title: '',
    assetId: assets[0]?.id || 'ast-001',
    assetName: assets[0]?.name || 'Chiller Parafuso',
    unitId: units[0]?.id || 'unit-01',
    unitName: units[0]?.name || 'Torre Berrini',
    frequency: 'MENSAL',
    mandatoryNorm: 'Lei 13.589/2018 (PMOC)',
    estimatedMonthlyCost: 2500
  });

  const filteredAssets = assets.filter(a => {
    const matchesSearch = a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          a.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          a.serialNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'ALL' || a.category === selectedCategory;
    const matchesUnit = selectedUnit === 'ALL' || a.unitId === selectedUnit;
    return matchesSearch && matchesCategory && matchesUnit;
  });

  const getCategoryBadge = (cat: AssetCategory) => {
    switch (cat) {
      case 'HVAC_CHILLER':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-50 text-cyan-700 border border-cyan-200">HVAC / Chiller</span>;
      case 'GERADOR_NOBREAK':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">Gerador & No-Break</span>;
      case 'SUBESTACAO_ELETRICA':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">Subestação Elétrica</span>;
      case 'COMBATE_INCENDIO':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">Combate a Incêndio</span>;
      case 'ELEVADORES':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">Elevadores</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">Equipamento General</span>;
    }
  };

  const getStatusBadge = (status: Asset['status']) => {
    switch (status) {
      case 'OPERACIONAL':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1 w-fit"><CheckCircle2 className="w-3 h-3" /> Operacional</span>;
      case 'EM_MANUTENCAO':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1 w-fit"><Wrench className="w-3 h-3" /> Em Manutenção</span>;
      case 'CRITICO':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1 w-fit"><AlertTriangle className="w-3 h-3" /> Falha Crítica</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">Desativado</span>;
    }
  };

  const handleAssetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddAsset(newAsset);
    setShowAddAssetModal(false);
  };

  const handlePlanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddPlan(newPlan);
    setShowAddPlanModal(false);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      
      {/* Module Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
              <Cpu className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Gestão Integrada de Ativos & PMOC (EAM)
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Mapeamento de equipamentos prediais críticos, cronogramas preventivos recorrentes e conformidade legal.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {activeSubTab === 'assets' ? (
            <button
              onClick={() => setShowAddAssetModal(true)}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Novo Ativo Crítico</span>
            </button>
          ) : (
            <button
              onClick={() => setShowAddPlanModal(true)}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Novo Plano PMOC</span>
            </button>
          )}
        </div>
      </div>

      {/* Navigation Subtabs */}
      <div className="flex border-b border-slate-200 gap-8 text-xs font-bold">
        <button
          onClick={() => setActiveSubTab('assets')}
          className={`pb-3.5 border-b-2 transition-all flex items-center gap-2 ${
            activeSubTab === 'assets'
              ? 'border-blue-600 text-blue-700 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Cpu className="w-4 h-4" />
          <span>Inventário de Equipamentos Críticos</span>
          <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-mono text-[10px] border border-slate-200">
            {assets.length}
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('pmoc')}
          className={`pb-3.5 border-b-2 transition-all flex items-center gap-2 ${
            activeSubTab === 'pmoc'
              ? 'border-indigo-600 text-indigo-700 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Planos de Manutenção Preventiva (PMOC)</span>
          <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-mono text-[10px] border border-slate-200">
            {maintenancePlans.length}
          </span>
        </button>
      </div>

      {/* SUBTAB 1: ASSETS INVENTORY */}
      {activeSubTab === 'assets' && (
        <div className="space-y-4">
          
          {/* Filter Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Buscar por nome, código ou série..."
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <select
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 font-medium focus:outline-none focus:border-blue-500"
              >
                <option value="ALL">Todas as Categorias</option>
                <option value="HVAC_CHILLER">HVAC / Chillers</option>
                <option value="GERADOR_NOBREAK">Geradores & No-Breaks</option>
                <option value="SUBESTACAO_ELETRICA">Subestação Elétrica</option>
                <option value="COMBATE_INCENDIO">Combate a Incêndio</option>
                <option value="ELEVADORES">Elevadores</option>
              </select>

              <select
                value={selectedUnit}
                onChange={e => setSelectedUnit(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 font-medium focus:outline-none focus:border-blue-500"
              >
                <option value="ALL">Todas as Unidades</option>
                {units.map(u => (
                  <option key={u.id} value={u.id}>{u.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Asset Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAssets.map((asset) => (
              <div
                key={asset.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4 hover:border-slate-300 transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="font-mono text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                      {asset.code}
                    </span>
                    {getStatusBadge(asset.status)}
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm leading-snug line-clamp-2">
                    {asset.name}
                  </h3>

                  <div className="mt-2 mb-3">
                    {getCategoryBadge(asset.category)}
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-600 border-t border-slate-100 pt-3">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Unidade:</span>
                      <span className="font-semibold text-slate-800 truncate max-w-[180px]">{asset.unitName}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Local:</span>
                      <span className="text-slate-700 truncate max-w-[180px]">{asset.locationArea}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Fabricante / Modelo:</span>
                      <span className="font-mono text-[11px] text-slate-700">{asset.manufacturer} {asset.model}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Próxima Preventiva:</span>
                      <span className="font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                        {asset.nextPreventiveDate}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Valor Patrimonial</span>
                    <span className="font-mono font-bold text-xs text-slate-900">
                      R$ {asset.estimatedValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>

                  <button
                    onClick={() => setSelectedAssetDetail(asset)}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 text-xs font-semibold border border-slate-200 transition flex items-center gap-1"
                  >
                    <span>Ficha Técnica</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* SUBTAB 2: PMOC PLANS */}
      {activeSubTab === 'pmoc' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Planos de Manutenção Operação e Controle (PMOC - Lei 13.589/2018)
              </h3>
              <p className="text-xs text-slate-500">Cronogramas automáticos vinculados aos alertas de compliance e ordens de serviço</p>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Recorrência Automatizada
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px]">
                  <th className="pb-3 font-semibold">Código & Título do Plano</th>
                  <th className="pb-3 font-semibold">Ativo Crítico / Unidade</th>
                  <th className="pb-3 font-semibold">Frequência & Norma Legal</th>
                  <th className="pb-3 font-semibold">Fornecedor Responsável</th>
                  <th className="pb-3 font-semibold">Custo Mensal Est.</th>
                  <th className="pb-3 font-semibold text-right">Status PMOC</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {maintenancePlans.map((plan) => (
                  <tr key={plan.id} className="hover:bg-slate-50 transition">
                    <td className="py-3 pr-3 font-medium text-slate-900">
                      <div className="flex items-center gap-2.5">
                        <span className="p-2 bg-indigo-50 text-indigo-600 rounded-xl border border-indigo-100">
                          <FileText className="w-4 h-4" />
                        </span>
                        <div>
                          <p className="font-bold text-slate-900">{plan.title}</p>
                          <p className="text-[10px] font-mono text-slate-500">{plan.code}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3">
                      <p className="font-semibold text-slate-800">{plan.assetName}</p>
                      <p className="text-[10px] text-slate-500">{plan.unitName}</p>
                    </td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200 mr-2">
                        {plan.frequency}
                      </span>
                      <p className="text-[10px] text-slate-500 mt-1">{plan.mandatoryNorm}</p>
                    </td>
                    <td className="py-3 text-slate-700 font-semibold">
                      {plan.assignedProviderName}
                    </td>
                    <td className="py-3 font-mono font-bold text-slate-900">
                      R$ {plan.estimatedMonthlyCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 text-right">
                      {plan.status === 'EM_DIA' ? (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 inline-flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Em Dia
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 inline-flex items-center gap-1">
                          <Clock className="w-3 h-3" /> Pendente
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Asset Detail Drawer/Modal */}
      {selectedAssetDetail && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full border border-slate-200 shadow-2xl p-6 space-y-5 text-slate-900 relative">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="p-2 bg-blue-50 text-blue-600 rounded-xl border border-blue-100">
                  <Cpu className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="text-base font-bold text-slate-900">{selectedAssetDetail.name}</h3>
                  <p className="text-xs text-slate-500 font-mono">Código EAM: {selectedAssetDetail.code}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedAssetDetail(null)}
                className="text-slate-400 hover:text-slate-700 font-bold p-1 rounded-lg hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Fabricante & Modelo</span>
                <p className="font-bold text-slate-900">{selectedAssetDetail.manufacturer}</p>
                <p className="font-mono text-slate-600">{selectedAssetDetail.model}</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Número de Série</span>
                <p className="font-mono font-bold text-slate-900">{selectedAssetDetail.serialNumber}</p>
                <p className="text-slate-500 text-[10px]">Garantia até: {selectedAssetDetail.warrantyValidUntil}</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Unidade & Localização</span>
                <p className="font-bold text-slate-900">{selectedAssetDetail.unitName}</p>
                <p className="text-slate-600">{selectedAssetDetail.locationArea}</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Valor Patrimonial</span>
                <p className="font-mono font-bold text-sm text-slate-900">
                  R$ {selectedAssetDetail.estimatedValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
                <p className="text-emerald-700 font-bold text-[10px]">Ativo Depreciável Integrado</p>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                onClick={() => setSelectedAssetDetail(null)}
                className="px-4 py-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition text-xs font-semibold"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Add Asset */}
      {showAddAssetModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl space-y-4 text-slate-900">
            <h3 className="text-base font-bold text-slate-900">Cadastrar Novo Ativo Crítico (EAM)</h3>
            <form onSubmit={handleAssetSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Nome do Equipamento / Ativo</label>
                <input
                  type="text"
                  required
                  value={newAsset.name}
                  onChange={e => setNewAsset({ ...newAsset, name: e.target.value })}
                  placeholder="Ex: Grupo Gerador Cummins 500kVA"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Categoria de Ativo</label>
                  <select
                    value={newAsset.category}
                    onChange={e => setNewAsset({ ...newAsset, category: e.target.value as AssetCategory })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:border-blue-500"
                  >
                    <option value="HVAC_CHILLER">HVAC / Chillers</option>
                    <option value="GERADOR_NOBREAK">Geradores & No-Breaks</option>
                    <option value="SUBESTACAO_ELETRICA">Subestação Elétrica</option>
                    <option value="COMBATE_INCENDIO">Combate a Incêndio</option>
                    <option value="ELEVADORES">Elevadores</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Unidade Instalação</label>
                  <select
                    value={newAsset.unitId}
                    onChange={e => {
                      const u = units.find(unit => unit.id === e.target.value);
                      setNewAsset({ ...newAsset, unitId: e.target.value, unitName: u?.name || 'Unidade' });
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:border-blue-500"
                  >
                    {units.map(u => (
                      <option key={u.id} value={u.id}>{u.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Fabricante</label>
                  <input
                    type="text"
                    required
                    value={newAsset.manufacturer}
                    onChange={e => setNewAsset({ ...newAsset, manufacturer: e.target.value })}
                    placeholder="Ex: Carrier"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Modelo</label>
                  <input
                    type="text"
                    required
                    value={newAsset.model}
                    onChange={e => setNewAsset({ ...newAsset, model: e.target.value })}
                    placeholder="Ex: 30XW-150TR"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Número de Série</label>
                  <input
                    type="text"
                    required
                    value={newAsset.serialNumber}
                    onChange={e => setNewAsset({ ...newAsset, serialNumber: e.target.value })}
                    placeholder="Ex: SN-2026-99"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Valor Patrimonial (R$)</label>
                  <input
                    type="number"
                    required
                    value={newAsset.estimatedValue}
                    onChange={e => setNewAsset({ ...newAsset, estimatedValue: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddAssetModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition shadow-xs"
                >
                  Salvar Ativo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Add PMOC Plan */}
      {showAddPlanModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl space-y-4 text-slate-900">
            <h3 className="text-base font-bold text-slate-900">Novo Plano de Manutenção Preventiva PMOC</h3>
            <form onSubmit={handlePlanSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Título da Rotina Preventiva</label>
                <input
                  type="text"
                  required
                  value={newPlan.title}
                  onChange={e => setNewPlan({ ...newPlan, title: e.target.value })}
                  placeholder="Ex: Manutenção Mensal de Chiller & Qualidade do Ar"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Frequência PMOC</label>
                  <select
                    value={newPlan.frequency}
                    onChange={e => setNewPlan({ ...newPlan, frequency: e.target.value as PlanFrequency })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:border-blue-500"
                  >
                    <option value="MENSAL">Mensal</option>
                    <option value="TRIMESTRAL">Trimestral</option>
                    <option value="SEMESTRAL">Semestral</option>
                    <option value="ANUAL">Anual</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Norma Legal Obrigatória</label>
                  <input
                    type="text"
                    required
                    value={newPlan.mandatoryNorm}
                    onChange={e => setNewPlan({ ...newPlan, mandatoryNorm: e.target.value })}
                    placeholder="Ex: Lei 13.589/2018 / NR-10"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Custo Estimado por Execução (R$)</label>
                <input
                  type="number"
                  required
                  value={newPlan.estimatedMonthlyCost}
                  onChange={e => setNewPlan({ ...newPlan, estimatedMonthlyCost: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddPlanModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition shadow-xs"
                >
                  Salvar Plano PMOC
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
