import React, { useState } from 'react';
import {
  Users,
  ShieldCheck,
  KeyRound,
  Building,
  Lock,
  CheckCircle2,
  XCircle,
  Plus,
  Search,
  UserPlus
} from 'lucide-react';
import { User, Tenant, UserRole } from '../types';

interface RoleManagementProps {
  users: User[];
  tenants: Tenant[];
  currentUser: User;
  onSwitchUserRole: (role: UserRole) => void;
  onAddUser: (user: Partial<User>) => void;
}

export const RoleManagement: React.FC<RoleManagementProps> = ({
  users,
  tenants,
  currentUser,
  onSwitchUserRole,
  onAddUser
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'users' | 'matrix' | 'tenants'>('users');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'OPERACIONAL' as UserRole });

  const rbacPermissionsList = [
    { code: 'ALL_ACCESS', label: 'Acesso Total ao Sistema (Super Admin)', admin: true, operational: false, client: false },
    { code: 'TICKETS_MANAGE', label: 'Gestão Completa de Chamados (Atribuição, Status, SLA)', admin: true, operational: true, client: false },
    { code: 'TICKETS_CREATE', label: 'Abertura de Chamados e Solicitações de Facilities', admin: true, operational: true, client: true },
    { code: 'CADASTROS_FULL', label: 'Cadastrar Clientes, Unidades, Colaboradores e Fornecedores', admin: true, operational: false, client: false },
    { code: 'CADASTROS_VIEW', label: 'Visualizar Cadastros de Unidades e Fornecedores', admin: true, operational: true, client: false },
    { code: 'COMPLIANCE_WRITE', label: 'Gerenciar Laudos Técnicos, AVCB e Termos de Governança', admin: true, operational: false, client: false },
    { code: 'AUDITORIA_VIEW_FULL', label: 'Consultar Trilha de Auditoria Imutável (Audit Logs)', admin: true, operational: true, client: false },
    { code: 'RLS_TENANT_BYPASS', label: 'Acesso Multi-Tenant Global (Restrito a Governança)', admin: true, operational: false, client: false }
  ];

  const handleCreateUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.name || !newUser.email) return;
    onAddUser(newUser);
    setNewUser({ name: '', email: '', role: 'OPERACIONAL' });
    setShowAddModal(false);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
              <Users className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Autenticação, RBAC & Multi-Tenancy
            </h2>
          </div>
          <p className="text-xs text-slate-600 mt-1">
            Gerenciamento granular de perfis de acesso (ADMIN, OPERACIONAL, CLIENTE), isolamento de Tenants e matriz de permissões.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition flex items-center gap-2 shrink-0"
          >
            <UserPlus className="w-4 h-4" />
            <span>Novo Usuário RBAC</span>
          </button>
        </div>
      </div>

      {/* Subtabs */}
      <div className="flex border-b border-slate-200 gap-8 text-xs font-bold">
        <button
          onClick={() => setActiveSubTab('users')}
          className={`pb-3.5 border-b-2 transition-all flex items-center gap-2 ${
            activeSubTab === 'users'
              ? 'border-blue-600 text-blue-700 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>Usuários Autenticados</span>
          <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-mono text-[10px] border border-slate-200">
            {users.length}
          </span>
        </button>
        <button
          onClick={() => setActiveSubTab('matrix')}
          className={`pb-3.5 border-b-2 transition-all flex items-center gap-2 ${
            activeSubTab === 'matrix'
              ? 'border-blue-600 text-blue-700 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>Matriz de Permissões RBAC</span>
        </button>
        <button
          onClick={() => setActiveSubTab('tenants')}
          className={`pb-3.5 border-b-2 transition-all flex items-center gap-2 ${
            activeSubTab === 'tenants'
              ? 'border-blue-600 text-blue-700 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>Organizações Multi-Tenant</span>
          <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-mono text-[10px] border border-slate-200">
            {tenants.length}
          </span>
        </button>
      </div>

      {/* Subtab 1: Users List */}
      {activeSubTab === 'users' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px]">
                  <th className="pb-3 font-semibold">Usuário & Avatar</th>
                  <th className="pb-3 font-semibold">E-mail</th>
                  <th className="pb-3 font-semibold">Perfil RBAC</th>
                  <th className="pb-3 font-semibold">Organização Tenant</th>
                  <th className="pb-3 font-semibold">Termo LGPD</th>
                  <th className="pb-3 font-semibold text-right">Simulação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50 transition">
                    <td className="py-3 pr-3 font-medium text-slate-900">
                      <div className="flex items-center gap-3">
                        <img src={u.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'} className="w-8 h-8 rounded-lg object-cover border border-slate-200" alt="" />
                        <div>
                          <p className="font-bold text-slate-900">{u.name}</p>
                          <p className="text-[10px] text-slate-500 font-mono">ID: {u.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 text-slate-600 font-mono">{u.email}</td>
                    <td className="py-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                        u.role === 'ADMIN' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
                        u.role === 'OPERACIONAL' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                        'bg-emerald-50 text-emerald-700 border-emerald-200'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 text-slate-800 font-semibold">{u.tenantName}</td>
                    <td className="py-3">
                      {u.termAccepted ? (
                        <span className="text-emerald-700 text-[11px] font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Aceito
                        </span>
                      ) : (
                        <span className="text-amber-700 text-[11px] font-bold flex items-center gap-1">
                          <XCircle className="w-3.5 h-3.5" /> Pendente
                        </span>
                      )}
                    </td>
                    <td className="py-3 text-right">
                      <button
                        onClick={() => onSwitchUserRole(u.role)}
                        className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 text-[11px] font-semibold border border-slate-200 transition"
                      >
                        Simular Perfil
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Subtab 2: RBAC Matrix */}
      {activeSubTab === 'matrix' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Matriz de Controle de Acesso Baseado em Papéis (RBAC)
              </h3>
              <p className="text-xs text-slate-600">Validação rigorosa de privilégios para segurança do ecossistema</p>
            </div>
            <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
              Security-First: Privilégio Mínimo
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px]">
                  <th className="pb-3 font-semibold">Funcionalidade / Escopo</th>
                  <th className="pb-3 font-semibold text-center text-indigo-700">ADMINISTRADOR</th>
                  <th className="pb-3 font-semibold text-center text-blue-700">EQUIPE OPERACIONAL</th>
                  <th className="pb-3 font-semibold text-center text-emerald-700">CLIENTE CORPORATIVO</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rbacPermissionsList.map((perm) => (
                  <tr key={perm.code} className="hover:bg-slate-50">
                    <td className="py-3 pr-3">
                      <p className="font-bold text-slate-900">{perm.label}</p>
                      <p className="text-[10px] font-mono text-slate-500">{perm.code}</p>
                    </td>
                    <td className="py-3 text-center">
                      {perm.admin ? (
                        <CheckCircle2 className="w-4 h-4 text-indigo-600 mx-auto" />
                      ) : (
                        <XCircle className="w-4 h-4 text-slate-300 mx-auto" />
                      )}
                    </td>
                    <td className="py-3 text-center">
                      {perm.operational ? (
                        <CheckCircle2 className="w-4 h-4 text-blue-600 mx-auto" />
                      ) : (
                        <XCircle className="w-4 h-4 text-slate-300 mx-auto" />
                      )}
                    </td>
                    <td className="py-3 text-center">
                      {perm.client ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto" />
                      ) : (
                        <XCircle className="w-4 h-4 text-slate-300 mx-auto" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Subtab 3: Multi-Tenants */}
      {activeSubTab === 'tenants' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tenants.map((t) => (
            <div key={t.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3 hover:border-slate-300 transition">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold bg-slate-50 text-blue-700 border border-slate-200 px-2 py-0.5 rounded">
                  {t.id}
                </span>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-0.5 rounded-full border border-emerald-200">
                  {t.status}
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900">{t.name}</h3>
              <p className="text-xs text-slate-600">CNPJ: <span className="font-mono text-slate-800">{t.cnpj}</span></p>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                <span>Plano: <strong className="text-indigo-700">{t.plan}</strong></span>
                <span>Unidades Ativas: <strong className="text-slate-900">{t.activeUnitsCount}</strong></span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-2xl max-w-md w-full border border-slate-200 shadow-xl space-y-4 text-slate-900">
            <h3 className="text-base font-bold text-slate-900">Cadastrar Novo Usuário RBAC</h3>
            <form onSubmit={handleCreateUserSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Nome Completo</label>
                <input
                  type="text"
                  required
                  value={newUser.name}
                  onChange={e => setNewUser({ ...newUser, name: e.target.value })}
                  placeholder="Ex: Gabriel Alencar"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">E-mail Corporativo</label>
                <input
                  type="email"
                  required
                  value={newUser.email}
                  onChange={e => setNewUser({ ...newUser, email: e.target.value })}
                  placeholder="gabriel@empresa.com.br"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Perfil RBAC</label>
                <select
                  value={newUser.role}
                  onChange={e => setNewUser({ ...newUser, role: e.target.value as UserRole })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:border-blue-500"
                >
                  <option value="OPERACIONAL">Equipe Operacional (Facilities)</option>
                  <option value="CLIENTE">Cliente Corporativo</option>
                  <option value="ADMIN">Administrador Geral</option>
                </select>
              </div>
              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition shadow-xs"
                >
                  Salvar Usuário
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
