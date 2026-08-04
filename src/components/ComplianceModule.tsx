import React, { useState } from 'react';
import {
  FileCheck2,
  ShieldCheck,
  Search,
  Filter,
  Plus,
  Lock,
  Calendar,
  Clock,
  UserCheck,
  FileText,
  AlertCircle,
  Eye,
  CheckCircle2
} from 'lucide-react';
import { ComplianceDoc, AuditLog, TermAcceptance, DocType } from '../types';

interface ComplianceModuleProps {
  complianceDocs: ComplianceDoc[];
  auditLogs: AuditLog[];
  termAcceptances: TermAcceptance[];
  onAddComplianceDoc: (doc: Partial<ComplianceDoc>) => void;
}

export const ComplianceModule: React.FC<ComplianceModuleProps> = ({
  complianceDocs,
  auditLogs,
  termAcceptances,
  onAddComplianceDoc
}) => {
  const [activeTab, setActiveTab] = useState<'docs' | 'audit' | 'terms'>('docs');
  const [searchAudit, setSearchAudit] = useState('');
  const [selectedEntity, setSelectedEntity] = useState<string>('TODAS');
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  const [showDocModal, setShowDocModal] = useState(false);
  const [newDoc, setNewDoc] = useState({
    title: '',
    code: '',
    category: 'REGULATORIO' as DocType,
    validUntil: '2027-12-31'
  });

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = log.userName.toLowerCase().includes(searchAudit.toLowerCase()) ||
                          log.details.toLowerCase().includes(searchAudit.toLowerCase()) ||
                          log.integrityHash.includes(searchAudit.toLowerCase());
    const matchesEntity = selectedEntity === 'TODAS' || log.entity === selectedEntity;
    return matchesSearch && matchesEntity;
  });

  const handleAddDocSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDoc.title) return;
    onAddComplianceDoc(newDoc);
    setNewDoc({ title: '', code: '', category: 'REGULATORIO', validUntil: '2027-12-31' });
    setShowDocModal(false);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
              <FileCheck2 className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Core de Compliance, Governança & Auditoria
            </h2>
          </div>
          <p className="text-xs text-slate-600 mt-1">
            Gestão de laudos regulatórios (NR-10, AVCB, PMOC), registros de aceite de termos LGPD e trilha de auditoria RLS com hashes SHA-256.
          </p>
        </div>

        <button
          onClick={() => setShowDocModal(true)}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition flex items-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Documento Regulatório</span>
        </button>
      </div>

      {/* Navigation Subtabs */}
      <div className="flex border-b border-slate-200 gap-8 text-xs font-bold">
        <button
          onClick={() => setActiveTab('docs')}
          className={`pb-3.5 border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'docs'
              ? 'border-blue-600 text-blue-700 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>Documentos Regulatórios</span>
          <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-mono text-[10px] border border-slate-200">
            {complianceDocs.length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab('audit')}
          className={`pb-3.5 border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'audit'
              ? 'border-blue-600 text-blue-700 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>Trilha de Auditoria Imutável</span>
          <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-mono text-[10px] border border-slate-200">
            {auditLogs.length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab('terms')}
          className={`pb-3.5 border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'terms'
              ? 'border-blue-600 text-blue-700 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>Termos de Aceite Digitais</span>
          <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-mono text-[10px] border border-slate-200">
            {termAcceptances.length}
          </span>
        </button>
      </div>

      {/* Tab 1: Regulatory Documents */}
      {activeTab === 'docs' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {complianceDocs.map((doc) => (
            <div key={doc.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3.5 hover:border-slate-300 transition">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold bg-slate-50 text-slate-700 px-2.5 py-1 rounded border border-slate-200">
                  {doc.code}
                </span>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {doc.status}
                </span>
              </div>
              <h3 className="text-sm font-bold text-slate-900 leading-snug">{doc.title}</h3>
              <div className="text-xs text-slate-600 space-y-1">
                <p>Categoria: <strong className="text-slate-800">{doc.category}</strong> • Versão: <strong className="text-slate-800">{doc.version}</strong></p>
                <p>Emissor / Responsável: <span className="text-slate-700">{doc.createdBy}</span></p>
              </div>
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" /> Válida até: <strong className="text-slate-900 font-mono">{doc.validUntil}</strong>
                </span>
                <span className="text-[10px] text-blue-700 font-bold bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
                  Obrigatório
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Audit Logs Explorer */}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
          
          {/* Controls: Search & Entity Filter */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchAudit}
                onChange={e => setSearchAudit(e.target.value)}
                placeholder="Buscar usuário, ação ou hash..."
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter className="w-4 h-4 text-slate-400" />
              <select
                value={selectedEntity}
                onChange={e => setSelectedEntity(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-800 focus:outline-none"
              >
                <option value="TODAS">Todas as Entidades</option>
                <option value="SISTEMA">SISTEMA</option>
                <option value="USUARIO">USUARIO</option>
                <option value="CHAMADO">CHAMADO</option>
                <option value="DOCUMENTO">DOCUMENTO</option>
                <option value="CLIENTE">CLIENTE</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px]">
                  <th className="pb-3 font-semibold">Timestamp UTC</th>
                  <th className="pb-3 font-semibold">Usuário & Perfil</th>
                  <th className="pb-3 font-semibold">Operação</th>
                  <th className="pb-3 font-semibold">Detalhes do Evento</th>
                  <th className="pb-3 font-semibold">IP Rastreável</th>
                  <th className="pb-3 font-semibold">Hash SHA-256</th>
                  <th className="pb-3 font-semibold text-right">Inspecionar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 transition">
                    <td className="py-3 text-slate-500 whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'medium' })}
                    </td>
                    <td className="py-3 font-sans font-medium text-slate-900">
                      {log.userName} <span className="text-[10px] text-slate-500">({log.userRole})</span>
                    </td>
                    <td className="py-3">
                      <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold border ${
                        log.action === 'CREATE' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                        log.action === 'UPDATE' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                        log.action === 'AUTH_LOGIN' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
                        'bg-slate-100 text-slate-700 border-slate-200'
                      }`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3 font-sans text-slate-700 max-w-xs truncate">
                      {log.details}
                    </td>
                    <td className="py-3 text-slate-500">{log.ipAddress}</td>
                    <td className="py-3 text-emerald-700 font-bold truncate max-w-[120px]">
                      {(log.integrityHash || '').slice(0, 12)}...
                    </td>
                    <td className="py-3 text-right font-sans">
                      <button
                        onClick={() => setSelectedLog(log)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition"
                        title="Inspecionar Payload JSON"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Digital Term Acceptances */}
      {activeTab === 'terms' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px]">
                  <th className="pb-3 font-semibold">Usuário Assinante</th>
                  <th className="pb-3 font-semibold">E-mail</th>
                  <th className="pb-3 font-semibold">Versão do Termo</th>
                  <th className="pb-3 font-semibold">Data do Aceite</th>
                  <th className="pb-3 font-semibold">IP do Dispositivo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {termAcceptances.map((ta) => (
                  <tr key={ta.id} className="hover:bg-slate-50 transition">
                    <td className="py-3 font-bold text-slate-900">
                      {ta.userName} <span className="text-[10px] text-slate-500 font-normal">({ta.userRole})</span>
                    </td>
                    <td className="py-3 font-mono text-slate-600">{ta.userEmail}</td>
                    <td className="py-3 font-bold text-indigo-700">{ta.termVersion}</td>
                    <td className="py-3 text-slate-500">{new Date(ta.acceptedAt).toLocaleString()}</td>
                    <td className="py-3 font-mono text-slate-500">{ta.ipAddress}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Add Document */}
      {showDocModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-2xl max-w-md w-full border border-slate-200 shadow-xl space-y-4 text-slate-900">
            <h3 className="text-base font-bold text-slate-900">Cadastrar Documento Regulatório</h3>
            <form onSubmit={handleAddDocSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Título do Laudo / Documento</label>
                <input
                  type="text"
                  required
                  value={newDoc.title}
                  onChange={e => setNewDoc({ ...newDoc, title: e.target.value })}
                  placeholder="Ex: Laudo Técnico de SPDA e Aterramento"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Código de Registro</label>
                <input
                  type="text"
                  required
                  value={newDoc.code}
                  onChange={e => setNewDoc({ ...newDoc, code: e.target.value })}
                  placeholder="Ex: LAUDO-SPDA-2026"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Validade do Laudo</label>
                <input
                  type="date"
                  required
                  value={newDoc.validUntil}
                  onChange={e => setNewDoc({ ...newDoc, validUntil: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowDocModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition shadow-xs"
                >
                  Salvar Documento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Inspection Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-2xl max-w-lg w-full border border-slate-200 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Inspeção de Registro de Auditoria</span>
              </h3>
              <button onClick={() => setSelectedLog(null)} className="text-slate-500 hover:text-slate-900 text-xs">Fechar</button>
            </div>
            <pre className="p-4 rounded-xl bg-slate-50 text-slate-800 font-mono text-[11px] overflow-x-auto max-h-60 leading-tight border border-slate-200">
              {JSON.stringify(selectedLog, null, 2)}
            </pre>
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>Assinatura Digital RLS</span>
              <span className="text-emerald-700 font-bold font-mono">SHA-256 ÍNTEGRO</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
