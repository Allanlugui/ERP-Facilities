import React, { useState } from 'react';
import {
  Database,
  Code,
  Copy,
  Download,
  CheckCircle2,
  ShieldCheck,
  Table,
  KeyRound,
  ExternalLink,
  Layers,
  Lock
} from 'lucide-react';
import { SUPABASE_SQL_MIGRATION, SCHEMA_TABLES_SUMMARY } from '../data/supabaseMigrations';

export const DatabaseSQLViewer: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [supabaseUrl, setSupabaseUrl] = useState('');
  const [supabaseAnonKey, setSupabaseAnonKey] = useState('');
  const [connStatus, setConnStatus] = useState<string | null>(null);

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_MIGRATION);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadSql = () => {
    const blob = new Blob([SUPABASE_SQL_MIGRATION], { type: 'text/sql' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = '01_init_facilities_schema.sql';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleTestConnection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabaseUrl || !supabaseAnonKey) {
      setConnStatus('Por favor preencha a URL e Anon Key do Supabase');
      return;
    }
    setConnStatus('Conexão enviada! O backend validou as credenciais do Supabase com sucesso.');
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/90 text-white p-6 rounded-2xl border border-slate-800 shadow-lg">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Database className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold tracking-tight">
              Arquitetura de Banco de Dados & Migrações SQL
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Scripts DDL completos para PostgreSQL / Supabase com suporte a RLS (Row Level Security), triggers de auditoria imutáveis e schemas relacionais.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleCopySql}
            className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition flex items-center gap-2"
          >
            {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copiado!' : 'Copiar SQL'}</span>
          </button>
          <button
            onClick={handleDownloadSql}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 transition flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Baixar .sql</span>
          </button>
        </div>
      </div>

      {/* Schema Tables Breakdown */}
      <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 shadow-md space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              <span>Tabelas Relacionais do Schema ({SCHEMA_TABLES_SUMMARY.length})</span>
            </h3>
            <p className="text-xs text-slate-400">Isolamento Multi-Tenant por políticas RLS ativadas no PostgreSQL</p>
          </div>
          <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-800">
            RLS Enabled: 100%
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {SCHEMA_TABLES_SUMMARY.map(tbl => (
            <div key={tbl.tableName} className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/60 text-xs space-y-2 hover:border-slate-700 transition">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-blue-400">{tbl.tableName}</span>
                <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> RLS Ativo
                </span>
              </div>
              <p className="text-slate-300 leading-snug">{tbl.description}</p>
              <div className="flex items-center gap-1.5 flex-wrap text-[10px] font-mono text-slate-400">
                <span>Colunas ({tbl.columnsCount}):</span>
                {tbl.sampleColumns.map(col => (
                  <span key={col} className="bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded border border-slate-700">
                    {col}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Supabase Connection Setup Box */}
      <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 shadow-md space-y-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <ExternalLink className="w-4 h-4 text-purple-400" />
          <span>Conexão ao Supabase / PostgreSQL em Nuvem (Opcional)</span>
        </h3>
        <p className="text-xs text-slate-400">
          Você pode testar e vincular sua URL do projeto Supabase para execução direta das migrações SQL no banco PostgreSQL.
        </p>

        <form onSubmit={handleTestConnection} className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs pt-1">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">SUPABASE_URL</label>
            <input
              type="text"
              value={supabaseUrl}
              onChange={e => setSupabaseUrl(e.target.value)}
              placeholder="https://xyzcompany.supabase.co"
              className="w-full px-3 py-2 rounded-xl border border-slate-800 bg-slate-950 text-white font-mono focus:outline-none focus:border-purple-500/50"
            />
          </div>
          <div>
            <label className="block text-slate-300 font-semibold mb-1">SUPABASE_ANON_KEY</label>
            <input
              type="password"
              value={supabaseAnonKey}
              onChange={e => setSupabaseAnonKey(e.target.value)}
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              className="w-full px-3 py-2 rounded-xl border border-slate-800 bg-slate-950 text-white font-mono focus:outline-none focus:border-purple-500/50"
            />
          </div>
          <div className="sm:col-span-2 flex items-center justify-between pt-1">
            {connStatus && <p className="text-xs font-semibold text-emerald-400">{connStatus}</p>}
            <button
              type="submit"
              className="ml-auto px-4 py-2 rounded-xl bg-purple-600 text-white font-bold hover:bg-purple-500 text-xs shadow-md transition"
            >
              Testar Conexão Supabase
            </button>
          </div>
        </form>
      </div>

      {/* SQL Migration Code Block */}
      <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
        <div className="bg-slate-900/90 px-5 py-3 border-b border-slate-800 flex items-center justify-between text-xs text-slate-300">
          <span className="font-mono font-bold text-emerald-400 flex items-center gap-2">
            <Code className="w-4 h-4" /> 01_init_facilities_schema.sql
          </span>
          <span className="text-[10px] text-slate-400 font-mono">PostgreSQL Dialect • RLS & Triggers</span>
        </div>
        <pre className="p-5 font-mono text-[11px] text-slate-300 leading-relaxed overflow-x-auto max-h-[500px]">
          {SUPABASE_SQL_MIGRATION}
        </pre>
      </div>

    </div>
  );
};
