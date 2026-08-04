import React, { useState } from 'react';
import { ShieldCheck, FileCheck2, AlertCircle, Lock, CheckCircle2, X } from 'lucide-react';
import { User } from '../types';

interface TermAcceptanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  onAcceptTerm: (userId: string, termVersion: string) => Promise<void>;
}

export const TermAcceptanceModal: React.FC<TermAcceptanceModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onAcceptTerm
}) => {
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    if (!agreed) return;
    setSubmitting(true);
    try {
      await onAcceptTerm(currentUser.id, 'v2026.1');
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden my-8 text-white">
        
        {/* Modal Header */}
        <div className="bg-slate-950 p-6 border-b border-slate-800 flex items-start justify-between">
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider font-mono">
                Governança & LGPD • Versão v2026.1
              </span>
              <h2 className="text-lg font-bold text-white tracking-tight">
                Termo de Aceite de Segurança e Compliance Corporativo
              </h2>
            </div>
          </div>
          {currentUser.termAccepted && (
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Modal Content / Terms Text */}
        <div className="p-6 space-y-4 text-xs text-slate-300 leading-relaxed max-h-[380px] overflow-y-auto bg-slate-950/40">
          
          <div className="p-3.5 rounded-xl bg-blue-950/40 border border-blue-900/60 text-blue-300 flex items-start gap-3">
            <AlertCircle className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            <p className="text-xs">
              Em conformidade com as diretrizes do ecossistema corporativo de Facilities, a aceitação formal deste termo é obrigatória para concessão e manutenção de acessos aos módulos operacionais e de governança.
            </p>
          </div>

          <div className="space-y-1">
            <h3 className="font-bold text-white text-sm">
              1. Responsabilidade e Acesso Baseado em Papéis (RBAC)
            </h3>
            <p className="text-slate-400">
              O usuário declara ciência de que suas credenciais e nível de acesso (Administrador, Operacional ou Cliente) são de uso individual e intransferível. Qualquer ação realizada sob este perfil será registrada com carimbo do tempo e hash de integridade imutável na trilha de auditoria do sistema.
            </p>
          </div>

          <div className="space-y-1">
            <h3 className="font-bold text-white text-sm">
              2. Proteção de Dados e Conformidade LGPD (Lei nº 13.709/2018)
            </h3>
            <p className="text-slate-400">
              Todos os dados de terceiros, colaboradores, clientes e fornecedores acessados neste ecossistema de Facilities estão protegidos por criptografia em trânsito e em repouso. O usuário compromete-se a não exportar ou divulgar informações confidenciais a partes não autorizadas.
            </p>
          </div>

          <div className="space-y-1">
            <h3 className="font-bold text-white text-sm">
              3. Cumprimento das Normas Regulamentadoras (NR-10, NR-35 e AVCB)
            </h3>
            <p className="text-slate-400">
              Para execução de chamados de Facilities (manutenção corretiva, preventiva ou emergencial), os executores devem manter vigentes suas certificações e laudos regulatórios técnicos nos respectivos cadastros de compliance.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] space-y-1.5 text-slate-400">
            <p><strong className="text-slate-200">Usuário Autenticado:</strong> {currentUser.name} ({currentUser.email})</p>
            <p><strong className="text-slate-200">Perfil Registrado:</strong> {currentUser.role}</p>
            <p><strong className="text-slate-200">Organização Tenant:</strong> {currentUser.tenantName}</p>
            <p><strong className="text-slate-200">Rastreabilidade IP:</strong> 189.120.44.102 (Sessão Criptografada SHA-256)</p>
          </div>

        </div>

        {/* Modal Actions */}
        <div className="p-6 bg-slate-900 border-t border-slate-800 space-y-4">
          
          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={agreed || currentUser.termAccepted}
              onChange={(e) => setAgreed(e.target.checked)}
              disabled={currentUser.termAccepted}
              className="mt-0.5 rounded border-slate-700 bg-slate-950 text-blue-600 focus:ring-blue-500/50 h-4 w-4"
            />
            <span className="text-xs text-slate-300 leading-tight">
              Declaro que li, compreendi e aceito integralmente os Termos de Governança, Compliance Corporativo e Segurança da Informação.
            </span>
          </label>

          <div className="flex items-center justify-end gap-3 pt-2">
            {currentUser.termAccepted ? (
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-950/60 px-4 py-2.5 rounded-xl border border-emerald-800">
                <CheckCircle2 className="w-4 h-4" />
                <span>Termo Aceito em {new Date(currentUser.termAcceptedAt || Date.now()).toLocaleDateString()}</span>
              </div>
            ) : (
              <button
                onClick={handleConfirm}
                disabled={!agreed || submitting}
                className={`px-6 py-2.5 rounded-xl text-xs font-bold text-white shadow-lg transition flex items-center gap-2 ${
                  agreed && !submitting
                    ? 'bg-blue-600 hover:bg-blue-500 shadow-blue-600/30 cursor-pointer'
                    : 'bg-slate-800 text-slate-500 border border-slate-700/50 cursor-not-allowed'
                }`}
              >
                {submitting ? 'Registrando Aceite Criptografado...' : 'Assinar Digitalmente & Confirmar'}
              </button>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
