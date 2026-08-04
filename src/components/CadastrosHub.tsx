import React, { useState } from 'react';
import {
  Building,
  MapPin,
  Users,
  Truck,
  Plus,
  Search,
  CheckCircle2,
  Phone,
  Mail,
  Award,
  Star
} from 'lucide-react';
import { Client, Unit, Collaborator, Supplier } from '../types';

interface CadastrosHubProps {
  clients: Client[];
  units: Unit[];
  collaborators: Collaborator[];
  suppliers: Supplier[];
  onAddClient: (client: Partial<Client>) => void;
  onAddUnit: (unit: Partial<Unit>) => void;
  onAddCollaborator: (colab: Partial<Collaborator>) => void;
  onAddSupplier: (supplier: Partial<Supplier>) => void;
}

export const CadastrosHub: React.FC<CadastrosHubProps> = ({
  clients,
  units,
  collaborators,
  suppliers,
  onAddClient,
  onAddUnit,
  onAddCollaborator,
  onAddSupplier
}) => {
  const [activeTab, setActiveTab] = useState<'clients' | 'units' | 'collaborators' | 'suppliers'>('clients');
  const [modalType, setModalType] = useState<string | null>(null);

  // Form states
  const [clientForm, setClientForm] = useState({ corporateName: '', fantasyName: '', cnpj: '', contactEmail: '', contactPhone: '' });
  const [unitForm, setUnitForm] = useState({ name: '', code: '', address: '', city: 'São Paulo', state: 'SP', managerName: '', contactPhone: '' });
  const [colabForm, setColabForm] = useState({ name: '', cpf: '', email: '', phone: '', roleTitle: 'Técnico de Facilities', nrCertificationsStr: 'NR-10, NR-35' });
  const [supplierForm, setSupplierForm] = useState({ corporateName: '', cnpj: '', category: 'AR_CONDICIONADO', contactEmail: '', phone: '' });

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
              <Building className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Gestão de Cadastros Base
            </h2>
          </div>
          <p className="text-xs text-slate-600 mt-1">
            Mapeamento relacional de Clientes Corporativos, Unidades/Prédios, Colaboradores Operacionais e Fornecedores Terceirizados.
          </p>
        </div>

        <button
          onClick={() => setModalType(activeTab)}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition flex items-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>
            {activeTab === 'clients' ? 'Novo Cliente' :
             activeTab === 'units' ? 'Nova Unidade' :
             activeTab === 'collaborators' ? 'Novo Colaborador' : 'Novo Fornecedor'}
          </span>
        </button>
      </div>

      {/* Navigation Subtabs */}
      <div className="flex border-b border-slate-200 gap-8 text-xs font-bold">
        <button
          onClick={() => setActiveTab('clients')}
          className={`pb-3.5 border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'clients' ? 'border-blue-600 text-blue-700 font-bold' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>Clientes Corporativos</span>
          <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-mono text-[10px] border border-slate-200">{clients.length}</span>
        </button>
        <button
          onClick={() => setActiveTab('units')}
          className={`pb-3.5 border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'units' ? 'border-blue-600 text-blue-700 font-bold' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>Unidades & Prédios</span>
          <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-mono text-[10px] border border-slate-200">{units.length}</span>
        </button>
        <button
          onClick={() => setActiveTab('collaborators')}
          className={`pb-3.5 border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'collaborators' ? 'border-blue-600 text-blue-700 font-bold' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>Equipe Operacional & NR</span>
          <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-mono text-[10px] border border-slate-200">{collaborators.length}</span>
        </button>
        <button
          onClick={() => setActiveTab('suppliers')}
          className={`pb-3.5 border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'suppliers' ? 'border-blue-600 text-blue-700 font-bold' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>Fornecedores Homologados</span>
          <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-mono text-[10px] border border-slate-200">{suppliers.length}</span>
        </button>
      </div>

      {/* Tab 1: Clientes */}
      {activeTab === 'clients' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {clients.map(c => (
            <div key={c.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3.5 hover:border-slate-300 transition">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold bg-slate-50 text-blue-700 border border-slate-200 px-2.5 py-0.5 rounded">
                  {c.id}
                </span>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-0.5 rounded-full border border-emerald-200">
                  {c.status}
                </span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">{c.corporateName}</h3>
                <p className="text-xs text-slate-600">Nome Fantasia: <strong className="text-slate-800">{c.fantasyName}</strong></p>
                <p className="text-[11px] font-mono text-slate-500 mt-0.5">CNPJ: {c.cnpj}</p>
              </div>
              <div className="pt-3 border-t border-slate-100 text-xs text-slate-600 space-y-1.5">
                <p className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-slate-400" /> {c.contactEmail}</p>
                <p className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-slate-400" /> {c.contactPhone}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Unidades */}
      {activeTab === 'units' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {units.map(u => (
            <div key={u.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3.5 hover:border-slate-300 transition">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold bg-slate-50 text-slate-700 border border-slate-200 px-2.5 py-0.5 rounded">
                  {u.code}
                </span>
                <span className="text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-full">
                  {u.clientName}
                </span>
              </div>
              <h3 className="text-sm font-bold text-slate-900">{u.name}</h3>
              <p className="text-xs text-slate-600 flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                <span>{u.address} - {u.city}/{u.state}</span>
              </p>
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                <span>Gestor: <strong className="text-slate-900">{u.managerName}</strong></span>
                <span className="text-slate-500 font-mono">{u.contactPhone}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Colaboradores */}
      {activeTab === 'collaborators' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {collaborators.map(col => (
            <div key={col.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3.5 hover:border-slate-300 transition">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">{col.name}</span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  {col.status}
                </span>
              </div>
              <p className="text-xs font-semibold text-blue-700">{col.roleTitle}</p>
              <p className="text-[11px] text-slate-500 font-mono">CPF: {col.cpf}</p>
              
              <div className="space-y-1.5 pt-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Certificações NR:</span>
                <div className="flex flex-wrap gap-1.5">
                  {col.nrCertifications.map(nr => (
                    <span key={nr} className="px-2.5 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200 font-mono font-bold text-[10px]">
                      {nr}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 4: Fornecedores */}
      {activeTab === 'suppliers' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {suppliers.map(sup => (
            <div key={sup.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3.5 hover:border-slate-300 transition">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-3 py-0.5 rounded-full border border-indigo-200">
                  {sup.category}
                </span>
                <div className="flex items-center gap-1 text-amber-600 text-xs font-bold font-mono">
                  <Star className="w-3.5 h-3.5 fill-amber-500" />
                  <span>{sup.rating}</span>
                </div>
              </div>
              <h3 className="text-sm font-bold text-slate-900">{sup.corporateName}</h3>
              <p className="text-[11px] font-mono text-slate-500">CNPJ: {sup.cnpj}</p>
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                <span>Performance SLA: <strong className="text-emerald-700 font-bold">{sup.slaPerformancePct}%</strong></span>
                <span className="text-slate-500 font-mono">{sup.phone}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal CADASTRO CLIENTE */}
      {modalType === 'clients' && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-2xl max-w-md w-full border border-slate-200 shadow-xl space-y-4 text-slate-900">
            <h3 className="text-base font-bold text-slate-900">Novo Cliente Corporativo</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              onAddClient(clientForm);
              setModalType(null);
            }} className="space-y-3.5 text-xs">
              <input
                type="text"
                placeholder="Razão Social"
                required
                value={clientForm.corporateName}
                onChange={e => setClientForm({ ...clientForm, corporateName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:border-blue-500"
              />
              <input
                type="text"
                placeholder="CNPJ"
                required
                value={clientForm.cnpj}
                onChange={e => setClientForm({ ...clientForm, cnpj: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:border-blue-500"
              />
              <input
                type="email"
                placeholder="E-mail de Contato"
                required
                value={clientForm.contactEmail}
                onChange={e => setClientForm({ ...clientForm, contactEmail: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:border-blue-500"
              />
              <input
                type="text"
                placeholder="Telefone"
                required
                value={clientForm.contactPhone}
                onChange={e => setClientForm({ ...clientForm, contactPhone: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:border-blue-500"
              />
              <div className="pt-3 flex justify-end gap-2">
                <button type="button" onClick={() => setModalType(null)} className="px-4 py-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition">Cancelar</button>
                <button type="submit" className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition shadow-xs">Salvar Cliente</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal CADASTRO UNIDADE */}
      {modalType === 'units' && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-2xl max-w-md w-full border border-slate-200 shadow-xl space-y-4 text-slate-900">
            <h3 className="text-base font-bold text-slate-900">Nova Unidade Operacional</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              onAddUnit({ ...unitForm, clientId: 'cli-001' });
              setModalType(null);
            }} className="space-y-3.5 text-xs">
              <input
                type="text"
                placeholder="Nome do Prédio / Unidade"
                required
                value={unitForm.name}
                onChange={e => setUnitForm({ ...unitForm, name: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:border-blue-500"
              />
              <input
                type="text"
                placeholder="Código da Unidade (Ex: UNIT-A01)"
                required
                value={unitForm.code}
                onChange={e => setUnitForm({ ...unitForm, code: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:border-blue-500"
              />
              <input
                type="text"
                placeholder="Endereço Completo"
                required
                value={unitForm.address}
                onChange={e => setUnitForm({ ...unitForm, address: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:border-blue-500"
              />
              <input
                type="text"
                placeholder="Nome do Gestor Responsável"
                required
                value={unitForm.managerName}
                onChange={e => setUnitForm({ ...unitForm, managerName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:border-blue-500"
              />
              <div className="pt-3 flex justify-end gap-2">
                <button type="button" onClick={() => setModalType(null)} className="px-4 py-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition">Cancelar</button>
                <button type="submit" className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition shadow-xs">Salvar Unidade</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal CADASTRO COLABORADOR */}
      {modalType === 'collaborators' && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-2xl max-w-md w-full border border-slate-200 shadow-xl space-y-4 text-slate-900">
            <h3 className="text-base font-bold text-slate-900">Novo Colaborador Técnico</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              onAddCollaborator({
                ...colabForm,
                nrCertifications: colabForm.nrCertificationsStr.split(',').map(s => s.trim())
              });
              setModalType(null);
            }} className="space-y-3.5 text-xs">
              <input
                type="text"
                placeholder="Nome Completo"
                required
                value={colabForm.name}
                onChange={e => setColabForm({ ...colabForm, name: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:border-blue-500"
              />
              <input
                type="text"
                placeholder="CPF"
                required
                value={colabForm.cpf}
                onChange={e => setColabForm({ ...colabForm, cpf: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:border-blue-500"
              />
              <input
                type="email"
                placeholder="E-mail"
                required
                value={colabForm.email}
                onChange={e => setColabForm({ ...colabForm, email: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:border-blue-500"
              />
              <input
                type="text"
                placeholder="Certificações NR (separadas por vírgula)"
                value={colabForm.nrCertificationsStr}
                onChange={e => setColabForm({ ...colabForm, nrCertificationsStr: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:border-blue-500"
              />
              <div className="pt-3 flex justify-end gap-2">
                <button type="button" onClick={() => setModalType(null)} className="px-4 py-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition">Cancelar</button>
                <button type="submit" className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition shadow-xs">Salvar Técnico</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal CADASTRO FORNECEDOR */}
      {modalType === 'suppliers' && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-2xl max-w-md w-full border border-slate-200 shadow-xl space-y-4 text-slate-900">
            <h3 className="text-base font-bold text-slate-900">Novo Fornecedor Terceirizado</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              onAddSupplier(supplierForm);
              setModalType(null);
            }} className="space-y-3.5 text-xs">
              <input
                type="text"
                placeholder="Razão Social"
                required
                value={supplierForm.corporateName}
                onChange={e => setSupplierForm({ ...supplierForm, corporateName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:border-blue-500"
              />
              <input
                type="text"
                placeholder="CNPJ"
                required
                value={supplierForm.cnpj}
                onChange={e => setSupplierForm({ ...supplierForm, cnpj: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:border-blue-500"
              />
              <select
                value={supplierForm.category}
                onChange={e => setSupplierForm({ ...supplierForm, category: e.target.value as any })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:border-blue-500"
              >
                <option value="AR_CONDICIONADO">Ar Condicionado / HVAC</option>
                <option value="ELETIRCA">Elétrica & Energia</option>
                <option value="CIVIL">Manutenção Civil</option>
                <option value="LIMPEZA">Limpeza & Sanitização</option>
                <option value="ELEVADORES">Elevadores</option>
              </select>
              <div className="pt-3 flex justify-end gap-2">
                <button type="button" onClick={() => setModalType(null)} className="px-4 py-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition">Cancelar</button>
                <button type="submit" className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition shadow-xs">Homologar Fornecedor</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
