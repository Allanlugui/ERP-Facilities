import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import {
  TrendingUp,
  Clock,
  ShieldCheck,
  DollarSign,
  Building2,
  Wrench,
  AlertTriangle,
  BarChart3,
  PieChart as PieIcon,
  Download,
  Calendar,
  Sparkles
} from 'lucide-react';
import { BiMetrics } from '../types';
import { INITIAL_BI_METRICS } from '../data/mockData';

interface ExecutiveBIDashboardProps {
  metrics?: BiMetrics;
}

const CATEGORY_COLORS = ['#3b82f6', '#f59e0b', '#ef4444', '#10b981'];

export const ExecutiveBIDashboard: React.FC<ExecutiveBIDashboardProps> = ({ metrics }) => {
  const safeMetrics = metrics || INITIAL_BI_METRICS;
  const monthlyOpexByUnit = safeMetrics.monthlyOpexByUnit || [];
  const ticketsByCategory = safeMetrics.ticketsByCategory || [];
  const monthlyCostsHistory = safeMetrics.monthlyCostsHistory || [];
  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
              <BarChart3 className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Painel Executivo de BI & Indicadores de Facilities
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Métricas operacionais de alto nível (MTTR, MTBF, SLA, OpEx) para governança corporativa e tomadas de decisão.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <span className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            <span>Ano Vigente 2026</span>
          </span>
          <button className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition flex items-center gap-2">
            <Download className="w-4 h-4" />
            <span>Exportar Relatório Executive</span>
          </button>
        </div>
      </div>

      {/* Top Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* MTTR */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              MTTR (Tempo Médio de Reparo)
            </span>
            <span className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <Clock className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 font-mono">{safeMetrics.mttrHours}</span>
            <span className="text-xs font-bold text-slate-500">horas</span>
          </div>
          <p className="text-[10px] text-emerald-700 font-bold flex items-center gap-1">
            <TrendingUp className="w-3 h-3 rotate-180" /> -12% redução vs trimestre anterior
          </p>
        </div>

        {/* MTBF */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              MTBF (Tempo Entre Falhas)
            </span>
            <span className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <Wrench className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 font-mono">{safeMetrics.mtbfDays}</span>
            <span className="text-xs font-bold text-slate-500">dias</span>
          </div>
          <p className="text-[10px] text-emerald-700 font-bold flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +18% confiabilidade dos ativos
          </p>
        </div>

        {/* SLA Compliance */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Aderência de SLA Contratual
            </span>
            <span className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <ShieldCheck className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 font-mono">{safeMetrics.slaCompliancePct}%</span>
          </div>
          <p className="text-[10px] text-emerald-700 font-bold">
            Meta Global: &gt;95.0% Cumprida
          </p>
        </div>

        {/* OpEx Total */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              OpEx Total Acumulado
            </span>
            <span className="p-2 bg-amber-50 text-amber-600 rounded-xl">
              <DollarSign className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-black text-slate-900 font-mono">
              R$ {(safeMetrics.totalMaintenanceOpEx || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>
          <p className="text-[10px] text-slate-500">
            Preventiva (62%) vs Corretiva (38%)
          </p>
        </div>

      </div>

      {/* Charts Section 1: Bar Chart per Unit & Pie Chart by Category */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* OpEx per Unit Bar Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Custos de Manutenção por Unidade Predial (R$)
              </h3>
              <p className="text-xs text-slate-500">Comparativo entre Manutenção Preventiva vs Corretiva por edifício</p>
            </div>
            <span className="text-[10px] font-bold font-mono bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full border border-slate-200">
              OpEx Reais
            </span>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyOpexByUnit} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="unitName" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} tickFormatter={(v) => `R$${v/1000}k`} />
                <Tooltip
                  formatter={(value: number) => [`R$ ${value.toLocaleString('pt-BR')}`, 'Custo']}
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="prevCost" name="Manutenção Preventiva" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                <Bar dataKey="corrCost" name="Manutenção Corretiva" fill="#f59e0b" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Cost Distribution Pie Chart */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900">
              Distribuição por Categoria
            </h3>
            <p className="text-xs text-slate-500">Proporção financeira por tipo de chamado</p>
          </div>

          <div className="h-56 w-full my-auto">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={ticketsByCategory}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="cost"
                  nameKey="category"
                >
                  {ticketsByCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => [`R$ ${value.toLocaleString('pt-BR')}`, 'Gasto']}
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs">
            {ticketsByCategory.map((c, idx) => (
              <div key={c.category} className="flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: CATEGORY_COLORS[idx] }} />
                  <span className="font-medium text-slate-700">{c.category}</span>
                </div>
                <span className="font-mono font-bold text-slate-900">
                  R$ {c.cost.toLocaleString('pt-BR')}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Historical Expenditure Area Chart */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Evolução Histórica de Gastos com Manutenção (Semestral)
            </h3>
            <p className="text-xs text-slate-500">Tendência de inversão entre gastos preventivos (planejados) e emergenciais</p>
          </div>
          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Otimização OpEx Ativa
          </span>
        </div>

        <div className="h-64 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlyCostsHistory} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
              <defs>
                <linearGradient id="colorPrev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorCorr" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} tickFormatter={(v) => `R$${v/1000}k`} />
              <Tooltip
                formatter={(value: number) => [`R$ ${value.toLocaleString('pt-BR')}`, 'Gasto']}
                contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Area type="monotone" dataKey="prevCost" name="Investimento Preventivo" stroke="#3b82f6" fillOpacity={1} fill="url(#colorPrev)" strokeWidth={2} />
              <Area type="monotone" dataKey="corrCost" name="Gasto Corretivo Não Planejado" stroke="#f59e0b" fillOpacity={1} fill="url(#colorCorr)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};
