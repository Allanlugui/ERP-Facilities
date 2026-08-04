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
  Sparkles,
  Copy,
  Lock,
  Unlock,
  Trash2,
  Edit3,
  Paperclip,
  Upload,
  History,
  Award,
  Check,
  FileCheck,
  UserCheck,
  X,
  ShieldAlert,
  Eye,
  FileSpreadsheet,
  BadgeCheck,
  ArrowUpRight
} from 'lucide-react';
import { Asset, MaintenancePlan, Unit, AssetCategory, PlanFrequency, FacilityTicket, User, AssetAttachment, TechnicalAttributes } from '../types';

interface EAMAssetsModuleProps {
  assets: Asset[];
  maintenancePlans: MaintenancePlan[];
  units: Unit[];
  tickets?: FacilityTicket[];
  currentUser?: User;
  onAddAsset: (asset: Partial<Asset>) => void;
  onUpdateAsset?: (id: string, asset: Partial<Asset>, auditJustification?: string) => void;
  onDeleteAsset?: (id: string, reason: string) => void;
  onAddPlan: (plan: Partial<MaintenancePlan>) => void;
  onCreateTicketFromAsset?: (asset: Asset) => void;
}

export const EAMAssetsModule: React.FC<EAMAssetsModuleProps> = ({
  assets = [],
  maintenancePlans = [],
  units = [],
  tickets = [],
  currentUser,
  onAddAsset,
  onUpdateAsset,
  onDeleteAsset,
  onAddPlan,
  onCreateTicketFromAsset
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'assets' | 'pmoc'>('assets');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedUnit, setSelectedUnit] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');

  // Drawer / Detail State
  const [selectedAssetDetail, setSelectedAssetDetail] = useState<Asset | null>(null);
  const [detailTab, setDetailTab] = useState<'legal_fiscal' | 'technical' | 'history' | 'attachments'>('legal_fiscal');
  const [copiedKey, setCopiedKey] = useState(false);

  // Modals
  const [showAssetFormModal, setShowAssetFormModal] = useState(false);
  const [editingAssetId, setEditingAssetId] = useState<string | null>(null);
  const [showAddPlanModal, setShowAddPlanModal] = useState(false);

  // Decommission / Delete Modal
  const [decommissioningAsset, setDecommissioningAsset] = useState<Asset | null>(null);
  const [decommissionReason, setDecommissionReason] = useState('');

  // Form Section Stepper / Active Block for Form Modal
  const [formBlock, setFormBlock] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Immutability Governance Toggle (for Edit Mode)
  const [unlockImmutables, setUnlockImmutables] = useState(false);
  const [auditJustification, setAuditJustification] = useState('');

  // Initial Empty Asset Form State
  const initialFormState: Partial<Asset> = {
    code: '',
    patrimonyCode: '',
    name: '',
    category: 'HVAC_CHILLER',
    unitId: units[0]?.id || 'unit-01',
    unitName: units[0]?.name || 'Torre Berrini',
    cnpj: '33.123.456/0001-00',
    department: 'Operações & Facilities',
    locationArea: 'Casa de Máquinas Cobertura',
    building: 'Torre A',
    floor: 'Cobertura',
    room: 'CM-01',
    status: 'OPERACIONAL',
    nfeNumber: '',
    nfeAccessKey: '',
    nfeIssueDate: new Date().toISOString().slice(0, 10),
    purchaseDate: new Date().toISOString().slice(0, 10),
    receiptDate: new Date().toISOString().slice(0, 10),
    startupDate: new Date().toISOString().slice(0, 10),
    warrantyMonths: 60,
    warrantyValidUntil: new Date(Date.now() + 5 * 365 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    estimatedValue: 150000,
    acquisitionValue: 150000,
    manufacturer: '',
    model: '',
    partNumber: '',
    serialNumber: '',
    serialPhotoUrl: '',
    batchNumber: '',
    manufactureDate: '',
    installerTechName: currentUser?.name || 'Eng. Marcelo Pires',
    installerCreaCft: 'CREA-SP 50698123',
    startupReportId: '',
    registeredBy: `${currentUser?.name || 'Carlos Silva'} (ID AUDIT)`,
    technicalAttributes: {
      powerKwCv: '',
      currentAmperes: '',
      voltageV: '380V / 220V',
      rpm: '',
      bearingType: '',
      btusCapacity: '',
      refrigerantGas: 'R410A',
      compressorType: 'Scroll',
      processor: '',
      ramGb: '',
      storageSsd: '',
      macAddress: ''
    },
    attachments: []
  };

  const [assetFormData, setAssetFormData] = useState<Partial<Asset>>(initialFormState);

  // Attachment upload simulator state
  const [newAttachmentTitle, setNewAttachmentTitle] = useState('');
  const [newAttachmentType, setNewAttachmentType] = useState<AssetAttachment['type']>('NF_PDF');

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

  // Calculate high-level summary stats
  const totalAssetsCount = assets.length;
  const totalPatrimonialValue = assets.reduce((acc, a) => acc + (a.estimatedValue || 0), 0);
  const operationalAssetsCount = assets.filter(a => a.status === 'OPERACIONAL').length;
  const operationalRate = totalAssetsCount > 0 ? Math.round((operationalAssetsCount / totalAssetsCount) * 100) : 100;
  const inMaintenanceCount = assets.filter(a => a.status === 'EM_MANUTENCAO' || a.status === 'CRITICO').length;

  // Filtered assets list
  const filteredAssets = assets.filter(a => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      a.name.toLowerCase().includes(q) ||
      a.code.toLowerCase().includes(q) ||
      (a.patrimonyCode && a.patrimonyCode.toLowerCase().includes(q)) ||
      a.serialNumber.toLowerCase().includes(q) ||
      (a.nfeAccessKey && a.nfeAccessKey.includes(q)) ||
      a.manufacturer.toLowerCase().includes(q);

    const matchesCategory = selectedCategory === 'ALL' || a.category === selectedCategory;
    const matchesUnit = selectedUnit === 'ALL' || a.unitId === selectedUnit;
    const matchesStatus = selectedStatus === 'ALL' || a.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesUnit && matchesStatus;
  });

  // Helper Badge Colors
  const getCategoryBadge = (cat: AssetCategory) => {
    switch (cat) {
      case 'HVAC_CHILLER':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-50 text-cyan-700 border border-cyan-200">HVAC / Chillers</span>;
      case 'GERADOR_NOBREAK':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">Geradores & No-Breaks</span>;
      case 'SUBESTACAO_ELETRICA':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">Subestação Elétrica</span>;
      case 'COMBATE_INCENDIO':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">Combate a Incêndio</span>;
      case 'ELEVADORES':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">Elevadores</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">Equipamento Geral</span>;
    }
  };

  const getStatusBadge = (status: Asset['status']) => {
    switch (status) {
      case 'OPERACIONAL':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1 w-fit"><CheckCircle2 className="w-3 h-3" /> Operacional</span>;
      case 'EM_MANUTENCAO':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1 w-fit"><Wrench className="w-3 h-3" /> Em Manutenção</span>;
      case 'CRITICO':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1 w-fit"><AlertTriangle className="w-3 h-3 text-rose-600 animate-pulse" /> Falha Crítica</span>;
      case 'EM_ESTOQUE':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1 w-fit">Em Estoque</span>;
      case 'BAIXADO':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-500 border border-slate-300 flex items-center gap-1 w-fit">Baixado / Inativo</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">Desativado</span>;
    }
  };

  // Open Create Modal
  const handleOpenCreateModal = () => {
    setEditingAssetId(null);
    setAssetFormData(initialFormState);
    setFormBlock(1);
    setUnlockImmutables(false);
    setAuditJustification('');
    setShowAssetFormModal(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (asset: Asset) => {
    setEditingAssetId(asset.id);
    setAssetFormData({ ...asset });
    setFormBlock(1);
    setUnlockImmutables(false);
    setAuditJustification('');
    setShowAssetFormModal(true);
  };

  // Save Asset (Create or Update)
  const handleSaveAssetSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Check if edit requires justification for unlocked immutables
    if (editingAssetId && unlockImmutables && !auditJustification.trim()) {
      alert('É obrigatório informar a justificativa corporativa de auditoria ao desbloquear e alterar campos imutáveis do ativo.');
      return;
    }

    if (editingAssetId && onUpdateAsset) {
      onUpdateAsset(editingAssetId, assetFormData, unlockImmutables ? auditJustification : undefined);
    } else {
      onAddAsset(assetFormData);
    }

    setShowAssetFormModal(false);
  };

  // Decommission / Delete Asset
  const handleConfirmDecommission = () => {
    if (!decommissioningAsset || !decommissionReason.trim()) return;
    if (onDeleteAsset) {
      onDeleteAsset(decommissioningAsset.id, decommissionReason);
    }
    setDecommissioningAsset(null);
    setDecommissionReason('');
    if (selectedAssetDetail?.id === decommissioningAsset.id) {
      setSelectedAssetDetail(null);
    }
  };

  // Add Attachment handler
  const handleAddAttachment = () => {
    if (!newAttachmentTitle.trim()) return;

    const newAtt: AssetAttachment = {
      id: `att-${Date.now()}`,
      title: newAttachmentTitle,
      type: newAttachmentType,
      fileName: `${newAttachmentTitle.replace(/\s+/g, '_')}_${Date.now().toString().slice(-4)}.pdf`,
      uploadedAt: new Date().toISOString().slice(0, 10)
    };

    const currentAttachments = assetFormData.attachments || [];
    setAssetFormData({
      ...assetFormData,
      attachments: [...currentAttachments, newAtt]
    });

    setNewAttachmentTitle('');
  };

  // Copy NF-e Key
  const handleCopyNfeKey = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  // Submit PMOC Plan
  const handlePlanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddPlan(newPlan);
    setShowAddPlanModal(false);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">

      {/* Top Header & Strategic Executive Metrics */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="flex items-center gap-3">
            <span className="p-3 rounded-2xl bg-blue-600 text-white shadow-md shadow-blue-500/20">
              <Cpu className="w-6 h-6" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                  Gestão Integrada de Ativos Fisiológicos & EAM Corporativo
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-50 text-blue-700 border border-blue-200">
                  Compliance NBR / Lei 13.589
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Cadastro industrial com validade jurídica, rastreabilidade fiscal NF-e, garantias auditadas e PMOC automatizado.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {activeSubTab === 'assets' ? (
              <button
                onClick={handleOpenCreateModal}
                className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/10 transition flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Novo Ativo Corporativo (CRUD 5 Blocos)</span>
              </button>
            ) : (
              <button
                onClick={() => setShowAddPlanModal(true)}
                className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-500/10 transition flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Novo Plano PMOC (Lei 13.589/2018)</span>
              </button>
            )}
          </div>
        </div>

        {/* Executive Asset KPI Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-500">
              <span className="font-semibold">Inventário Total de Ativos</span>
              <Layers className="w-4 h-4 text-blue-600" />
            </div>
            <div className="mt-2">
              <span className="text-2xl font-black text-slate-900 font-mono">{totalAssetsCount}</span>
              <p className="text-[10px] text-slate-500 mt-0.5">Equipamentos Mapeados</p>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-500">
              <span className="font-semibold">Valor Patrimonial Total</span>
              <DollarSign className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="mt-2">
              <span className="text-xl font-black text-slate-900 font-mono">
                R$ {totalPatrimonialValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
              <p className="text-[10px] text-emerald-700 font-semibold mt-0.5">Depreciação Contábil Integrada</p>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-500">
              <span className="font-semibold">Taxa de Operacionalidade</span>
              <Activity className="w-4 h-4 text-cyan-600" />
            </div>
            <div className="mt-2">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-slate-900 font-mono">{operationalRate}%</span>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">Meta ≥ 95%</span>
              </div>
              <p className="text-[10px] text-slate-500 mt-0.5">{operationalAssetsCount} operacionais / {inMaintenanceCount} em intervenção</p>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-500">
              <span className="font-semibold">Planos PMOC Ativos</span>
              <FileCheck className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="mt-2">
              <span className="text-2xl font-black text-indigo-900 font-mono">{maintenancePlans.length}</span>
              <p className="text-[10px] text-indigo-700 font-semibold mt-0.5">100% com Responsável Técnico CREA</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Subtabs */}
      <div className="flex border-b border-slate-200 gap-8 text-xs font-bold">
        <button
          onClick={() => setActiveSubTab('assets')}
          className={`pb-3.5 border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'assets'
              ? 'border-blue-600 text-blue-700 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Cpu className="w-4 h-4" />
          <span>Inventário de Ativos Críticos (EAM)</span>
          <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-mono text-[10px] border border-slate-200">
            {assets.length}
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('pmoc')}
          className={`pb-3.5 border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'pmoc'
              ? 'border-indigo-600 text-indigo-700 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Cronogramas Preventivos (PMOC - Lei 13.589/2018)</span>
          <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-mono text-[10px] border border-slate-200">
            {maintenancePlans.length}
          </span>
        </button>
      </div>

      {/* SUBTAB 1: ASSETS INVENTORY & CRUD */}
      {activeSubTab === 'assets' && (
        <div className="space-y-4">
          
          {/* Advanced Multi-Filter Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
            <div className="relative w-full md:w-96">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Buscar por nome, TAG, plaqueta, série, NF-e ou fabricante..."
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
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

              <select
                value={selectedStatus}
                onChange={e => setSelectedStatus(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 font-medium focus:outline-none focus:border-blue-500"
              >
                <option value="ALL">Todos os Status</option>
                <option value="OPERACIONAL">Operacional</option>
                <option value="EM_MANUTENCAO">Em Manutenção</option>
                <option value="CRITICO">Falha Crítica</option>
                <option value="EM_ESTOQUE">Em Estoque</option>
                <option value="BAIXADO">Baixado / Inativo</option>
              </select>
            </div>
          </div>

          {/* Assets Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAssets.map((asset) => (
              <div
                key={asset.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4 hover:border-blue-300 transition flex flex-col justify-between group relative"
              >
                <div>
                  {/* Card Header Tag & Patrimony */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-mono text-[10px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                        {asset.code}
                      </span>
                      {asset.patrimonyCode && (
                        <span className="font-mono text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                          {asset.patrimonyCode}
                        </span>
                      )}
                    </div>
                    {getStatusBadge(asset.status)}
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm leading-snug line-clamp-2 group-hover:text-blue-600 transition">
                    {asset.name}
                  </h3>

                  <div className="mt-2 mb-3">
                    {getCategoryBadge(asset.category)}
                  </div>

                  {/* Core Technical Detail Strip */}
                  <div className="space-y-1.5 text-xs text-slate-600 border-t border-slate-100 pt-3">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Unidade:</span>
                      <span className="font-semibold text-slate-800 truncate max-w-[180px]">{asset.unitName}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Localização:</span>
                      <span className="text-slate-700 truncate max-w-[180px]">{asset.locationArea}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Fabricante / Modelo:</span>
                      <span className="font-mono text-[11px] text-slate-800 font-medium">{asset.manufacturer} {asset.model}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Nº de Série (Auditado):</span>
                      <span className="font-mono text-[11px] font-bold text-slate-900">{asset.serialNumber}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Garantia de Fábrica:</span>
                      <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                        Até {asset.warrantyValidUntil}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Valor Patrimonial</span>
                    <span className="font-mono font-bold text-xs text-slate-900">
                      R$ {asset.estimatedValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEditModal(asset)}
                      title="Editar Ativo Crítico"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 border border-slate-200 transition"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDecommissioningAsset(asset)}
                      title="Baixar ou Excluir Ativo"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedAssetDetail(asset);
                        setDetailTab('legal_fiscal');
                      }}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-700 text-xs font-semibold border border-slate-200 transition flex items-center gap-1 cursor-pointer"
                    >
                      <span>Ficha Técnica</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredAssets.length === 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
              <Cpu className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-sm font-bold text-slate-700">Nenhum ativo encontrado com os filtros selecionados</p>
              <p className="text-xs text-slate-400">Tente ajustar a busca ou cadastrar um novo equipamento no sistema EAM.</p>
              <button
                onClick={handleOpenCreateModal}
                className="mt-2 px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 transition"
              >
                Cadastrar Ativo Agora
              </button>
            </div>
          )}

        </div>
      )}

      {/* SUBTAB 2: PMOC PREVENTIVE ROUTINES */}
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
                      {plan.assignedProviderName || 'Engenharia Própria'}
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

      {/* DETAILED INDUSTRIAL ASSET DRAWER / FICHA TÉCNICA */}
      {selectedAssetDetail && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-4xl w-full border border-slate-200 shadow-2xl overflow-hidden my-8">
            
            {/* Drawer Header */}
            <div className="bg-slate-900 p-6 text-white space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <span className="p-3 bg-blue-600 rounded-2xl text-white shadow-lg shadow-blue-500/30 shrink-0">
                    <Cpu className="w-6 h-6" />
                  </span>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-bold bg-slate-800 px-2 py-0.5 rounded text-blue-400 border border-slate-700">
                        TAG: {selectedAssetDetail.code}
                      </span>
                      {selectedAssetDetail.patrimonyCode && (
                        <span className="font-mono text-xs font-bold bg-indigo-950 px-2 py-0.5 rounded text-indigo-300 border border-indigo-800">
                          Patrimônio: {selectedAssetDetail.patrimonyCode}
                        </span>
                      )}
                      {getStatusBadge(selectedAssetDetail.status)}
                    </div>
                    <h2 className="text-xl font-black mt-1 text-white leading-tight">
                      {selectedAssetDetail.name}
                    </h2>
                    <p className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                      <Building className="w-3.5 h-3.5 text-slate-500" />
                      <span>{selectedAssetDetail.unitName} &bull; {selectedAssetDetail.locationArea}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const ast = selectedAssetDetail;
                      setSelectedAssetDetail(null);
                      handleOpenEditModal(ast);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white transition border border-slate-700 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-blue-400" />
                    <span>Editar Ativo</span>
                  </button>
                  <button
                    onClick={() => setSelectedAssetDetail(null)}
                    className="text-slate-400 hover:text-white font-bold p-1.5 rounded-xl hover:bg-slate-800 transition"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Drawer Tabs Header */}
              <div className="flex gap-4 border-t border-slate-800 pt-3 text-xs font-bold">
                <button
                  onClick={() => setDetailTab('legal_fiscal')}
                  className={`pb-2 border-b-2 transition cursor-pointer ${
                    detailTab === 'legal_fiscal' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Blocos 1, 2 & 4: Jurídico, Fiscal & Instalação
                </button>
                <button
                  onClick={() => setDetailTab('technical')}
                  className={`pb-2 border-b-2 transition cursor-pointer ${
                    detailTab === 'technical' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Bloco 3: Atributos Técnicos Dinâmicos
                </button>
                <button
                  onClick={() => setDetailTab('history')}
                  className={`pb-2 border-b-2 transition cursor-pointer ${
                    detailTab === 'history' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Histórico Vinculado (OS & PMOC)
                </button>
                <button
                  onClick={() => setDetailTab('attachments')}
                  className={`pb-2 border-b-2 transition cursor-pointer ${
                    detailTab === 'attachments' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Bloco 5: Anexos & Auditoria ({selectedAssetDetail.attachments?.length || 0})
                </button>
              </div>
            </div>

            {/* Drawer Body Content */}
            <div className="p-6 max-h-[65vh] overflow-y-auto space-y-6 text-xs text-slate-800">

              {/* TAB 1: LEGAL, FISCAL & INSTALLATION */}
              {detailTab === 'legal_fiscal' && (
                <div className="space-y-5">
                  
                  {/* Bloco 1: Identificação Legal */}
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                    <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-2">
                      <BadgeCheck className="w-4 h-4 text-blue-600" />
                      Bloco 1: Identificação Legal & Validade Jurídica
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold block uppercase">Código de Patrimônio</span>
                        <p className="font-mono font-bold text-slate-900 text-sm">{selectedAssetDetail.patrimonyCode || 'N/A'}</p>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold block uppercase">CNPJ / Filial</span>
                        <p className="font-mono font-medium text-slate-800">{selectedAssetDetail.cnpj || '33.123.456/0001-00'}</p>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold block uppercase">Centro de Custo / Dept.</span>
                        <p className="font-semibold text-slate-800">{selectedAssetDetail.department || 'Operações'}</p>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold block uppercase">Audit Trail Responsável</span>
                        <p className="font-semibold text-slate-900">{selectedAssetDetail.registeredBy || 'Eng. Carlos Silva'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Bloco 2: Rastreabilidade Fiscal e Garantia */}
                  <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-200/80 space-y-3">
                    <h4 className="font-extrabold text-emerald-950 text-xs uppercase tracking-wider flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
                        Bloco 2: Rastreabilidade Fiscal & Proteção de Garantia
                      </span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded border border-emerald-300">
                        Validade Fiscal Auditada
                      </span>
                    </h4>

                    {selectedAssetDetail.nfeAccessKey && (
                      <div className="p-3 bg-white rounded-xl border border-emerald-200 flex items-center justify-between gap-3">
                        <div>
                          <span className="text-[10px] text-slate-400 font-bold uppercase block">Chave de Acesso NF-e (44 dígitos)</span>
                          <span className="font-mono text-xs font-bold text-slate-800 break-all">{selectedAssetDetail.nfeAccessKey}</span>
                        </div>
                        <button
                          onClick={() => handleCopyNfeKey(selectedAssetDetail.nfeAccessKey!)}
                          className="px-2.5 py-1.5 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-800 text-[10px] font-bold transition flex items-center gap-1 shrink-0"
                        >
                          {copiedKey ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedKey ? 'Copiado!' : 'Copiar Chave'}</span>
                        </button>
                      </div>
                    )}

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold block uppercase">Nota Fiscal (NF-e)</span>
                        <p className="font-mono font-bold text-slate-900">{selectedAssetDetail.nfeNumber || 'NFE-009842'}</p>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold block uppercase">Data de Start-up</span>
                        <p className="font-medium text-slate-800">{selectedAssetDetail.startupDate || selectedAssetDetail.installDate}</p>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold block uppercase">Garantia de Fábrica</span>
                        <p className="font-bold text-emerald-700">{selectedAssetDetail.warrantyMonths || 60} Meses (até {selectedAssetDetail.warrantyValidUntil})</p>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold block uppercase">Valor de Aquisição</span>
                        <p className="font-mono font-bold text-slate-900">R$ {(selectedAssetDetail.acquisitionValue || selectedAssetDetail.estimatedValue).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                      </div>
                    </div>
                  </div>

                  {/* Bloco 4: Instalação e Responsabilidade Operacional */}
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                    <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-2">
                      <UserCheck className="w-4 h-4 text-indigo-600" />
                      Bloco 4: Responsabilidade Operacional & Laudo de Start-up
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold block uppercase">Técnico Instalador</span>
                        <p className="font-bold text-slate-900">{selectedAssetDetail.installerTechName || 'Eng. Marcelo Pires'}</p>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold block uppercase">Registro CREA / CFT</span>
                        <p className="font-mono font-semibold text-indigo-700">{selectedAssetDetail.installerCreaCft || 'CREA-SP 50698123'}</p>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold block uppercase">Relatório de Start-up ID</span>
                        <p className="font-mono text-slate-800">{selectedAssetDetail.startupReportId || 'REP-STARTUP-2023'}</p>
                      </div>
                    </div>
                  </div>

                </div>
              )}

              {/* TAB 2: TECHNICAL ATTRIBUTES */}
              {detailTab === 'technical' && (
                <div className="space-y-5">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-2">
                        <Cpu className="w-4 h-4 text-blue-600" />
                        Bloco 3: Ficha Técnica Industrial do Equipamento
                      </h4>
                      {getCategoryBadge(selectedAssetDetail.category)}
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-white p-3.5 rounded-xl border border-slate-200">
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold uppercase block">Fabricante / Marca</span>
                        <p className="font-bold text-slate-900">{selectedAssetDetail.manufacturer}</p>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold uppercase block">Modelo Comercial</span>
                        <p className="font-mono font-semibold text-slate-800">{selectedAssetDetail.model}</p>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold uppercase block">Número de Série</span>
                        <p className="font-mono font-black text-blue-700">{selectedAssetDetail.serialNumber}</p>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold uppercase block">Part Number (PN)</span>
                        <p className="font-mono text-slate-700">{selectedAssetDetail.partNumber || 'N/A'}</p>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold uppercase block">Lote de Fabricação</span>
                        <p className="font-mono text-slate-700">{selectedAssetDetail.batchNumber || 'N/A'}</p>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold uppercase block">Data de Fabricação</span>
                        <p className="text-slate-700">{selectedAssetDetail.manufactureDate || 'N/A'}</p>
                      </div>
                    </div>

                    {/* Category Dynamic Technical Attributes */}
                    <div>
                      <h5 className="font-extrabold text-slate-700 text-[11px] mb-2 uppercase">Atributos Técnicos Específicos por Categoria</h5>
                      {selectedAssetDetail.technicalAttributes && Object.keys(selectedAssetDetail.technicalAttributes).length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-indigo-50/50 p-4 rounded-xl border border-indigo-100">
                          {Object.entries(selectedAssetDetail.technicalAttributes).map(([key, val]) => (
                            val ? (
                              <div key={key}>
                                <span className="text-[10px] text-indigo-700 font-bold uppercase block">{key.replace(/([A-Z])/g, ' $1')}</span>
                                <p className="font-bold text-slate-900">{val}</p>
                              </div>
                            ) : null
                          ))}
                        </div>
                      ) : (
                        <p className="text-slate-400 italic">Nenhum atributo dinâmico cadastrado.</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: LINKED MAINTENANCE HISTORY (OS & PMOC) */}
              {detailTab === 'history' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">Histórico Cruzado de Manutenções & Ordens de Serviço</h4>
                      <p className="text-[11px] text-slate-500">Rastreabilidade integral de chamados e preventivas vinculadas a este ativo</p>
                    </div>
                  </div>

                  {/* Linked Tickets */}
                  <div className="space-y-2">
                    <h5 className="font-bold text-xs text-slate-700 uppercase tracking-wider">Ordens de Serviço Registradas ({tickets.filter(t => t.assetId === selectedAssetDetail.id).length})</h5>
                    {tickets.filter(t => t.assetId === selectedAssetDetail.id).length > 0 ? (
                      <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden bg-white">
                        {tickets.filter(t => t.assetId === selectedAssetDetail.id).map(t => (
                          <div key={t.id} className="p-3 hover:bg-slate-50 transition flex items-center justify-between gap-3">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-[10px] font-bold bg-slate-100 px-1.5 py-0.5 rounded text-slate-700">{t.code}</span>
                                <span className="font-bold text-slate-900">{t.title}</span>
                              </div>
                              <p className="text-[11px] text-slate-500 mt-0.5">Aberto por {t.createdByName} em {new Date(t.createdAt).toLocaleDateString('pt-BR')}</p>
                            </div>
                            <div className="text-right">
                              <span className="font-mono font-bold text-slate-900 block">R$ {t.estimatedCost ? t.estimatedCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) : '0,00'}</span>
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">{t.status}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-slate-500 text-center">
                        Nenhuma ordem de serviço corretiva aberta para este equipamento.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 4: ATTACHMENTS & AUDIT */}
              {detailTab === 'attachments' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Bloco 5: Documentos Digitais de Comprovação</h4>
                  </div>

                  {selectedAssetDetail.attachments && selectedAssetDetail.attachments.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {selectedAssetDetail.attachments.map(att => (
                        <div key={att.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2.5">
                            <span className="p-2 bg-blue-50 text-blue-600 rounded-lg border border-blue-100">
                              <Paperclip className="w-4 h-4" />
                            </span>
                            <div>
                              <p className="font-bold text-slate-900 line-clamp-1">{att.title}</p>
                              <p className="text-[10px] font-mono text-slate-500">{att.fileName}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => alert(`Visualizando documento de auditoria: ${att.fileName}`)}
                            className="p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-blue-50 hover:text-blue-600 text-slate-600 transition"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 text-center text-slate-400">
                      Nenhum anexo digital cadastrado.
                    </div>
                  )}
                </div>
              )}

            </div>

            {/* Drawer Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <span className="text-[11px] text-slate-500 font-mono">
                Criado em: {new Date(selectedAssetDetail.createdAt).toLocaleDateString('pt-BR')} &bull; Status EAM: {selectedAssetDetail.status}
              </span>
              <button
                onClick={() => setSelectedAssetDetail(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition cursor-pointer"
              >
                Fechar Ficha Técnica
              </button>
            </div>

          </div>
        </div>
      )}

      {/* FORM MODAL: 5-BLOCK ENTERPRISE ASSET FORM (CREATE & EDIT) */}
      {showAssetFormModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full border border-slate-200 shadow-2xl overflow-hidden my-6">
            
            {/* Modal Header */}
            <div className="bg-slate-900 p-5 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="p-2 bg-blue-600 rounded-xl text-white">
                  <Cpu className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="text-base font-bold text-white">
                    {editingAssetId ? 'Editar Ficha do Ativo Crítico' : 'Cadastrar Novo Ativo Corporativo (EAM)'}
                  </h3>
                  <p className="text-[11px] text-slate-400">Estrutura industrial em 5 blocos com controle de imutabilidade e auditoria</p>
                </div>
              </div>

              <button
                onClick={() => setShowAssetFormModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Stepper Header (Blocos 1 ao 5) */}
            <div className="bg-slate-100 p-3 border-b border-slate-200 flex items-center justify-between text-xs font-bold gap-1 overflow-x-auto">
              {[1, 2, 3, 4, 5].map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() => setFormBlock(b as any)}
                  className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
                    formBlock === b
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
                  }`}
                >
                  <span className="w-4 h-4 rounded-full bg-slate-900/20 text-[10px] font-mono flex items-center justify-center">
                    {b}
                  </span>
                  <span>
                    {b === 1 && 'Identificação Legal'}
                    {b === 2 && 'Fiscal & Garantia'}
                    {b === 3 && 'Produto & Série'}
                    {b === 4 && 'Instalação & Resp.'}
                    {b === 5 && 'Atributos & Anexos'}
                  </span>
                </button>
              ))}
            </div>

            {/* If Editing, Show Governance Immutability Lock Control */}
            {editingAssetId && (
              <div className="mx-6 mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0" />
                  <div>
                    <span className="font-bold text-amber-900 block">Campos Imutáveis Protegidos por Governança</span>
                    <span className="text-[10px] text-amber-800">Campos como TAG, Plaqueta, Série e Chave NF-e estão travados para prevenir fraude fiscal.</span>
                  </div>
                </div>

                <label className="flex items-center gap-2 font-bold text-amber-900 cursor-pointer shrink-0 bg-white px-3 py-1.5 rounded-lg border border-amber-300">
                  <input
                    type="checkbox"
                    checked={unlockImmutables}
                    onChange={e => setUnlockImmutables(e.target.checked)}
                    className="rounded text-blue-600"
                  />
                  {unlockImmutables ? <Unlock className="w-3.5 h-3.5 text-rose-600" /> : <Lock className="w-3.5 h-3.5 text-amber-700" />}
                  <span>Desbloquear Edição Crítica</span>
                </label>
              </div>
            )}

            {editingAssetId && unlockImmutables && (
              <div className="mx-6 mt-2 p-3 bg-rose-50 border border-rose-200 rounded-xl space-y-1 text-xs">
                <label className="block font-bold text-rose-900">Justificativa Corporativa de Auditoria (Obrigatória)</label>
                <input
                  type="text"
                  required
                  value={auditJustification}
                  onChange={e => setAuditJustification(e.target.value)}
                  placeholder="Informe o motivo da alteração de dados imutáveis (Ex: Retificação fiscal de NF-e)"
                  className="w-full px-3 py-1.5 rounded-lg border border-rose-300 bg-white text-rose-950 text-xs focus:outline-none focus:border-rose-600"
                />
              </div>
            )}

            {/* Form Fields */}
            <form onSubmit={handleSaveAssetSubmit} className="p-6 space-y-4 text-xs">
              
              {/* BLOCK 1: IDENTIFICAÇÃO LEGAL E PROPRIEDADE */}
              {formBlock === 1 && (
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">
                      Bloco 1: Identificação Legal & Propriedade (Validade Jurídica)
                    </h4>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Nome Completo do Equipamento / Ativo</label>
                    <input
                      type="text"
                      required
                      value={assetFormData.name}
                      onChange={e => setAssetFormData({ ...assetFormData, name: e.target.value })}
                      placeholder="Ex: Grupo Gerador Cummins 500kVA Silenciado"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:border-blue-500 font-medium"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Código de Ativo / TAG</label>
                      <input
                        type="text"
                        disabled={!!editingAssetId && !unlockImmutables}
                        value={assetFormData.code}
                        onChange={e => setAssetFormData({ ...assetFormData, code: e.target.value })}
                        placeholder="Ex: AST-GERADOR-01"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 font-mono disabled:opacity-60"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Código de Patrimônio (Plaqueta Auditoria)</label>
                      <input
                        type="text"
                        disabled={!!editingAssetId && !unlockImmutables}
                        value={assetFormData.patrimonyCode}
                        onChange={e => setAssetFormData({ ...assetFormData, patrimonyCode: e.target.value })}
                        placeholder="Ex: PAT-984210"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 font-mono disabled:opacity-60"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Categoria</label>
                      <select
                        value={assetFormData.category}
                        onChange={e => setAssetFormData({ ...assetFormData, category: e.target.value as AssetCategory })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:border-blue-500 font-medium"
                      >
                        <option value="HVAC_CHILLER">HVAC / Chillers</option>
                        <option value="GERADOR_NOBREAK">Geradores & No-Breaks</option>
                        <option value="SUBESTACAO_ELETRICA">Subestação Elétrica</option>
                        <option value="COMBATE_INCENDIO">Combate a Incêndio</option>
                        <option value="ELEVADORES">Elevadores</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Unidade Interna</label>
                      <select
                        value={assetFormData.unitId}
                        onChange={e => {
                          const u = units.find(unit => unit.id === e.target.value);
                          setAssetFormData({ ...assetFormData, unitId: e.target.value, unitName: u?.name || 'Unidade' });
                        }}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:border-blue-500 font-medium"
                      >
                        {units.map(u => (
                          <option key={u.id} value={u.id}>{u.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Status Operacional</label>
                      <select
                        value={assetFormData.status}
                        onChange={e => setAssetFormData({ ...assetFormData, status: e.target.value as any })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:border-blue-500 font-semibold"
                      >
                        <option value="OPERACIONAL">Operacional</option>
                        <option value="EM_MANUTENCAO">Em Manutenção</option>
                        <option value="CRITICO">Falha Crítica</option>
                        <option value="EM_ESTOQUE">Em Estoque</option>
                        <option value="BAIXADO">Baixado / Inativo</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">CNPJ / Filial Proprietária</label>
                      <input
                        type="text"
                        value={assetFormData.cnpj}
                        onChange={e => setAssetFormData({ ...assetFormData, cnpj: e.target.value })}
                        placeholder="Ex: 33.123.456/0001-00"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-mono text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Centro de Custo / Dept.</label>
                      <input
                        type="text"
                        value={assetFormData.department}
                        onChange={e => setAssetFormData({ ...assetFormData, department: e.target.value })}
                        placeholder="Ex: Operações & Facilities"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-900"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* BLOCK 2: RASTREABILIDADE FISCAL E GARANTIA */}
              {formBlock === 2 && (
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">
                      Bloco 2: Rastreabilidade Fiscal & Contratual (Garantia)
                    </h4>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-slate-700 font-semibold">Chave de Acesso da Nota Fiscal (NF-e - 44 Dígitos)</label>
                      <span className="font-mono text-[10px] text-slate-400">
                        {(assetFormData.nfeAccessKey?.length || 0)}/44 dígitos
                      </span>
                    </div>
                    <input
                      type="text"
                      maxLength={44}
                      disabled={!!editingAssetId && !unlockImmutables}
                      value={assetFormData.nfeAccessKey}
                      onChange={e => setAssetFormData({ ...assetFormData, nfeAccessKey: e.target.value.replace(/\D/g, '') })}
                      placeholder="Ex: 35230433123456000100550010000098421987654321"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-mono text-slate-900 disabled:opacity-60"
                    />
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Número da NF-e</label>
                      <input
                        type="text"
                        value={assetFormData.nfeNumber}
                        onChange={e => setAssetFormData({ ...assetFormData, nfeNumber: e.target.value })}
                        placeholder="Ex: NFE-009842"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-mono text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Data de Emissão NF</label>
                      <input
                        type="date"
                        value={assetFormData.nfeIssueDate}
                        onChange={e => setAssetFormData({ ...assetFormData, nfeIssueDate: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Data de Recebimento</label>
                      <input
                        type="date"
                        value={assetFormData.receiptDate}
                        onChange={e => setAssetFormData({ ...assetFormData, receiptDate: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Data de Start-up</label>
                      <input
                        type="date"
                        value={assetFormData.startupDate}
                        onChange={e => setAssetFormData({ ...assetFormData, startupDate: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-900"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Garantia Fábrica (Meses)</label>
                      <input
                        type="number"
                        value={assetFormData.warrantyMonths}
                        onChange={e => {
                          const m = Number(e.target.value);
                          setAssetFormData({
                            ...assetFormData,
                            warrantyMonths: m,
                            warrantyValidUntil: new Date(Date.now() + m * 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
                          });
                        }}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-bold text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Vencimento Garantia</label>
                      <input
                        type="date"
                        value={assetFormData.warrantyValidUntil}
                        onChange={e => setAssetFormData({ ...assetFormData, warrantyValidUntil: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-bold text-emerald-700"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Valor de Aquisição (R$)</label>
                      <input
                        type="number"
                        required
                        value={assetFormData.estimatedValue}
                        onChange={e => setAssetFormData({ ...assetFormData, estimatedValue: Number(e.target.value), acquisitionValue: Number(e.target.value) })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-mono font-bold text-slate-900"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* BLOCK 3: RASTREABILIDADE DO PRODUTO (FABRICAÇÃO) */}
              {formBlock === 3 && (
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">
                      Bloco 3: Rastreabilidade do Produto (Fabricação & Série)
                    </h4>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Fabricante / Marca</label>
                      <input
                        type="text"
                        required
                        value={assetFormData.manufacturer}
                        onChange={e => setAssetFormData({ ...assetFormData, manufacturer: e.target.value })}
                        placeholder="Ex: Carrier / STEMAC / WEG"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Modelo Comercial</label>
                      <input
                        type="text"
                        required
                        value={assetFormData.model}
                        onChange={e => setAssetFormData({ ...assetFormData, model: e.target.value })}
                        placeholder="Ex: 30XW-150TR-A"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Número de Série (Auditado)</label>
                      <input
                        type="text"
                        required
                        disabled={!!editingAssetId && !unlockImmutables}
                        value={assetFormData.serialNumber}
                        onChange={e => setAssetFormData({ ...assetFormData, serialNumber: e.target.value })}
                        placeholder="Ex: SN-CAR-99812-SP"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-mono text-slate-900 font-bold disabled:opacity-60"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Part Number (PN)</label>
                      <input
                        type="text"
                        value={assetFormData.partNumber}
                        onChange={e => setAssetFormData({ ...assetFormData, partNumber: e.target.value })}
                        placeholder="Ex: PN-CAR-30XW150"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-mono text-slate-900"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Lote de Fabricação</label>
                      <input
                        type="text"
                        value={assetFormData.batchNumber}
                        onChange={e => setAssetFormData({ ...assetFormData, batchNumber: e.target.value })}
                        placeholder="Ex: LOTE-2023-04"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-mono text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Data de Fabricação</label>
                      <input
                        type="date"
                        value={assetFormData.manufactureDate}
                        onChange={e => setAssetFormData({ ...assetFormData, manufactureDate: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-900"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* BLOCK 4: INSTALAÇÃO E RESPONSABILIDADE OPERACIONAL */}
              {formBlock === 4 && (
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">
                      Bloco 4: Instalação & Responsabilidade Operacional
                    </h4>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Prédio / Bloco</label>
                      <input
                        type="text"
                        value={assetFormData.building}
                        onChange={e => setAssetFormData({ ...assetFormData, building: e.target.value })}
                        placeholder="Ex: Torre Berrini Bloco B"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Andar / Nível</label>
                      <input
                        type="text"
                        value={assetFormData.floor}
                        onChange={e => setAssetFormData({ ...assetFormData, floor: e.target.value })}
                        placeholder="Ex: Cobertura / Subsolo 2"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Sala Técnica</label>
                      <input
                        type="text"
                        value={assetFormData.room}
                        onChange={e => setAssetFormData({ ...assetFormData, room: e.target.value })}
                        placeholder="Ex: Casa de Máquinas CM-01"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Localização Descritiva Completa</label>
                    <input
                      type="text"
                      required
                      value={assetFormData.locationArea}
                      onChange={e => setAssetFormData({ ...assetFormData, locationArea: e.target.value })}
                      placeholder="Ex: Cobertura / Casa de Máquinas Bloco B - Chiller 01"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-900"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Técnico Instalador</label>
                      <input
                        type="text"
                        value={assetFormData.installerTechName}
                        onChange={e => setAssetFormData({ ...assetFormData, installerTechName: e.target.value })}
                        placeholder="Ex: Eng. Marcelo Pires"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Registro CREA / CFT</label>
                      <input
                        type="text"
                        value={assetFormData.installerCreaCft}
                        onChange={e => setAssetFormData({ ...assetFormData, installerCreaCft: e.target.value })}
                        placeholder="Ex: CREA-SP 50698123"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-mono text-slate-900 font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Relatório Start-up ID</label>
                      <input
                        type="text"
                        value={assetFormData.startupReportId}
                        onChange={e => setAssetFormData({ ...assetFormData, startupReportId: e.target.value })}
                        placeholder="Ex: REP-STARTUP-CAR2023"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-mono text-slate-900"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* BLOCK 5: ATRIBUTOS TÉCNICOS DINÂMICOS E ANEXOS */}
              {formBlock === 5 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">
                      Bloco 5: Atributos Técnicos Dinâmicos por Categoria & Anexos
                    </h4>
                  </div>

                  {/* Dynamic Technical Specs according to asset category */}
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                    <h5 className="font-bold text-slate-800 text-xs">Especificações Técnicas Específicas: {assetFormData.category}</h5>

                    {assetFormData.category === 'HVAC_CHILLER' && (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <div>
                          <label className="block text-slate-600 font-semibold mb-1">Capacidade (BTU/TR)</label>
                          <input
                            type="text"
                            value={assetFormData.technicalAttributes?.btusCapacity || ''}
                            onChange={e => setAssetFormData({
                              ...assetFormData,
                              technicalAttributes: { ...assetFormData.technicalAttributes, btusCapacity: e.target.value }
                            })}
                            placeholder="Ex: 150 TR (1.800.000 BTU/h)"
                            className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-600 font-semibold mb-1">Gás Refrigerante</label>
                          <input
                            type="text"
                            value={assetFormData.technicalAttributes?.refrigerantGas || ''}
                            onChange={e => setAssetFormData({
                              ...assetFormData,
                              technicalAttributes: { ...assetFormData.technicalAttributes, refrigerantGas: e.target.value }
                            })}
                            placeholder="Ex: R134a Eco / R410A"
                            className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-600 font-semibold mb-1">Compressor</label>
                          <input
                            type="text"
                            value={assetFormData.technicalAttributes?.compressorType || ''}
                            onChange={e => setAssetFormData({
                              ...assetFormData,
                              technicalAttributes: { ...assetFormData.technicalAttributes, compressorType: e.target.value }
                            })}
                            placeholder="Ex: Parafuso Hermético"
                            className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-600 font-semibold mb-1">Tensão Elétrica</label>
                          <input
                            type="text"
                            value={assetFormData.technicalAttributes?.voltageV || ''}
                            onChange={e => setAssetFormData({
                              ...assetFormData,
                              technicalAttributes: { ...assetFormData.technicalAttributes, voltageV: e.target.value }
                            })}
                            placeholder="Ex: 380V Trifásico"
                            className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white"
                          />
                        </div>
                      </div>
                    )}

                    {assetFormData.category === 'GERADOR_NOBREAK' && (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <div>
                          <label className="block text-slate-600 font-semibold mb-1">Potência (kW / kVA)</label>
                          <input
                            type="text"
                            value={assetFormData.technicalAttributes?.powerKwCv || ''}
                            onChange={e => setAssetFormData({
                              ...assetFormData,
                              technicalAttributes: { ...assetFormData.technicalAttributes, powerKwCv: e.target.value }
                            })}
                            placeholder="Ex: 500 kVA / 400 kW"
                            className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-600 font-semibold mb-1">Corrente Nominal (A)</label>
                          <input
                            type="text"
                            value={assetFormData.technicalAttributes?.currentAmperes || ''}
                            onChange={e => setAssetFormData({
                              ...assetFormData,
                              technicalAttributes: { ...assetFormData.technicalAttributes, currentAmperes: e.target.value }
                            })}
                            placeholder="Ex: 760 A"
                            className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-600 font-semibold mb-1">Rotação (RPM)</label>
                          <input
                            type="text"
                            value={assetFormData.technicalAttributes?.rpm || ''}
                            onChange={e => setAssetFormData({
                              ...assetFormData,
                              technicalAttributes: { ...assetFormData.technicalAttributes, rpm: e.target.value }
                            })}
                            placeholder="Ex: 1800 RPM"
                            className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-600 font-semibold mb-1">Rolamento</label>
                          <input
                            type="text"
                            value={assetFormData.technicalAttributes?.bearingType || ''}
                            onChange={e => setAssetFormData({
                              ...assetFormData,
                              technicalAttributes: { ...assetFormData.technicalAttributes, bearingType: e.target.value }
                            })}
                            placeholder="Ex: Blindado NSK"
                            className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white"
                          />
                        </div>
                      </div>
                    )}

                    {assetFormData.category !== 'HVAC_CHILLER' && assetFormData.category !== 'GERADOR_NOBREAK' && (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-slate-600 font-semibold mb-1">Tensão Nominal (V)</label>
                          <input
                            type="text"
                            value={assetFormData.technicalAttributes?.voltageV || ''}
                            onChange={e => setAssetFormData({
                              ...assetFormData,
                              technicalAttributes: { ...assetFormData.technicalAttributes, voltageV: e.target.value }
                            })}
                            placeholder="Ex: 13.8kV / 380V"
                            className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-600 font-semibold mb-1">Capacidade / Potência</label>
                          <input
                            type="text"
                            value={assetFormData.technicalAttributes?.powerKwCv || ''}
                            onChange={e => setAssetFormData({
                              ...assetFormData,
                              technicalAttributes: { ...assetFormData.technicalAttributes, powerKwCv: e.target.value }
                            })}
                            placeholder="Ex: 750 kVA"
                            className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Attachment Simulator Uploader */}
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                    <h5 className="font-bold text-slate-800 text-xs">Simulador de Upload de Anexo Obrigatório</h5>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <input
                        type="text"
                        value={newAttachmentTitle}
                        onChange={e => setNewAttachmentTitle(e.target.value)}
                        placeholder="Título do documento (Ex: Cópia da NF-e 9842 PDF)"
                        className="flex-1 px-3 py-1.5 rounded-xl border border-slate-200 bg-white"
                      />
                      <select
                        value={newAttachmentType}
                        onChange={e => setNewAttachmentType(e.target.value as any)}
                        className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white"
                      >
                        <option value="NF_PDF">Nota Fiscal PDF</option>
                        <option value="PLACA_SERIAL_FOTO">Foto Plaqueta / Serial</option>
                        <option value="TERMO_GARANTIA">Termo de Garantia</option>
                        <option value="LAUDO_COMISSIONAMENTO">Laudo Comissionamento</option>
                      </select>
                      <button
                        type="button"
                        onClick={handleAddAttachment}
                        className="px-3 py-1.5 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Anexar</span>
                      </button>
                    </div>

                    {assetFormData.attachments && assetFormData.attachments.length > 0 && (
                      <div className="space-y-1.5 pt-2">
                        {assetFormData.attachments.map(att => (
                          <div key={att.id} className="p-2 bg-white rounded-lg border border-slate-200 flex items-center justify-between">
                            <span className="font-semibold text-slate-800">{att.title}</span>
                            <span className="font-mono text-[10px] text-slate-500">{att.type}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                </div>
              )}

              {/* Footer Stepper Controls */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                <button
                  type="button"
                  disabled={formBlock === 1}
                  onClick={() => setFormBlock((formBlock - 1) as any)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 disabled:opacity-40 transition font-bold"
                >
                  &larr; Bloco Anterior
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAssetFormModal(false)}
                    className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 transition"
                  >
                    Cancelar
                  </button>

                  {formBlock < 5 ? (
                    <button
                      type="button"
                      onClick={() => setFormBlock((formBlock + 1) as any)}
                      className="px-5 py-2 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition cursor-pointer"
                    >
                      Próximo Bloco &rarr;
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white font-extrabold hover:bg-emerald-700 transition shadow-md shadow-emerald-500/20 cursor-pointer"
                    >
                      {editingAssetId ? 'Salvar Alterações no Ativo' : 'Finalizar e Cadastrar Ativo EAM'}
                    </button>
                  )}
                </div>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* DECOMMISSION / DELETE ASSET CONFIRMATION MODAL */}
      {decommissioningAsset && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full border border-slate-200 shadow-2xl p-6 space-y-4 text-slate-900">
            <div className="flex items-center gap-3 text-rose-600">
              <span className="p-2.5 bg-rose-50 rounded-2xl border border-rose-200">
                <ShieldAlert className="w-6 h-6" />
              </span>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Baixa ou Exclusão Patrimonial</h3>
                <p className="text-xs text-slate-500 font-mono">{decommissioningAsset.code} - {decommissioningAsset.patrimonyCode}</p>
              </div>
            </div>

            <p className="text-xs text-slate-600">
              Você está prestes a realizar a baixa patrimonial auditada do equipamento <strong>{decommissioningAsset.name}</strong>. Esta ação é irreversível e exige justificativa no relatório de auditoria fiscal.
            </p>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-800">Motivo da Baixa Patrimonial (Audit Trail)</label>
              <textarea
                required
                rows={3}
                value={decommissionReason}
                onChange={e => setDecommissionReason(e.target.value)}
                placeholder="Informe o motivo (Ex: Equipamento obsoleto baixado por sinistro ou término de vida útil)"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 focus:outline-none focus:border-rose-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setDecommissioningAsset(null)}
                className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-semibold"
              >
                Cancelar
              </button>
              <button
                disabled={!decommissionReason.trim()}
                onClick={handleConfirmDecommission}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-500/20 disabled:opacity-50 transition"
              >
                Confirmar Baixa Auditada
              </button>
            </div>
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
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:border-blue-500 font-mono font-bold"
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
