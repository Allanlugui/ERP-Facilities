export type UserRole = 'ADMIN' | 'OPERACIONAL' | 'CLIENTE';

export type TicketPriority = 'BAIXA' | 'MEDIA' | 'ALTA' | 'CRITICA';

export type TicketStatus = 'NOVO' | 'EM_ANDAMENTO' | 'AGUARDANDO_PECAS' | 'AGUARDANDO_APROVACAO' | 'CONCLUIDO' | 'CANCELADO';

export type DocType = 'REGULATORIO' | 'AUDITORIA' | 'CONTRATO' | 'LICENCA' | 'SOP';

export type DocStatus = 'ATIVO' | 'PENDENTE' | 'EXPIRADO';

export type AssetCategory = 'HVAC_CHILLER' | 'GERADOR_NOBREAK' | 'SUBESTACAO_ELETRICA' | 'COMBATE_INCENDIO' | 'ELEVADORES' | 'BOMBAS_HIDRAULICAS';

export type AssetStatus = 'OPERACIONAL' | 'EM_MANUTENCAO' | 'CRITICO' | 'DESACTIVADO';

export type PlanFrequency = 'SEMANAL' | 'MENSAL' | 'TRIMESTRAL' | 'SEMESTRAL' | 'ANUAL';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  tenantId: string;
  tenantName: string;
  status: 'ATIVO' | 'INATIVO' | 'BLOQUEADO';
  permissions: string[];
  lastLogin: string;
  termAccepted: boolean;
  termAcceptedAt?: string;
  createdAt: string;
}

export interface Tenant {
  id: string;
  name: string;
  cnpj: string;
  status: 'ATIVO' | 'SUSPENSO';
  plan: 'ENTERPRISE' | 'CORPORATE' | 'STANDARD';
  activeUnitsCount: number;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  tenantId: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'AUTH_LOGIN' | 'AUTH_LOGOUT' | 'TERM_ACCEPT' | 'SECURITY_ALERT' | 'APPROVAL_COST';
  entity: 'USUARIO' | 'CLIENTE' | 'UNIDADE' | 'COLABORADOR' | 'FORNECEDOR' | 'CHAMADO' | 'DOCUMENTO' | 'ATIVO' | 'PLANO_PMOC' | 'SISTEMA';
  entityId: string;
  details: string;
  ipAddress: string;
  integrityHash: string;
}

export interface Client {
  id: string;
  tenantId: string;
  corporateName: string;
  fantasyName: string;
  cnpj: string;
  contactEmail: string;
  contactPhone: string;
  status: 'ATIVO' | 'INATIVO';
  activeUnitsCount: number;
  createdAt: string;
}

export interface Unit {
  id: string;
  clientId: string;
  clientName: string;
  name: string;
  code: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  managerName: string;
  contactPhone: string;
  activeTicketsCount: number;
  createdAt: string;
}

export interface Collaborator {
  id: string;
  name: string;
  cpf: string;
  email: string;
  phone: string;
  roleTitle: string;
  department: string;
  nrCertifications: string[]; // e.g., ['NR-10', 'NR-35', 'NR-33']
  status: 'ATIVO' | 'AFASTADO' | 'FERIAS';
  assignedUnitIds: string[];
  assignedUnitNames: string[];
  createdAt: string;
}

export interface Supplier {
  id: string;
  corporateName: string;
  fantasyName: string;
  cnpj: string;
  category: 'AR_CONDICIONADO' | 'ELETIRCA' | 'CIVIL' | 'LIMPEZA' | 'SEGURANCA' | 'ELEVADORES' | 'MULTISERVICOS';
  rating: number; // 1-5
  slaPerformancePct: number;
  status: 'HOMOLOGADO' | 'EM_ANALISE' | 'SUSPENSO';
  contactEmail: string;
  phone: string;
  activeContractsCount: number;
  certificationsValidUntil: string;
}

export interface ComplianceDoc {
  id: string;
  title: string;
  code: string;
  category: DocType;
  version: string;
  fileUrl?: string;
  validUntil: string;
  status: DocStatus;
  requiredForRoles: UserRole[];
  createdBy: string;
  createdAt: string;
}

export interface TermAcceptance {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userRole: UserRole;
  termVersion: string;
  acceptedAt: string;
  ipAddress: string;
  userAgent: string;
}

export interface TicketTimelineEvent {
  id: string;
  timestamp: string;
  title: string;
  description: string;
  authorName: string;
  type: 'CREATED' | 'ASSIGNED' | 'STATUS_CHANGE' | 'COST_APPROVAL' | 'INSPECTION' | 'COMPLETED';
}

export interface NpsFeedback {
  score: number; // 1 to 10
  comment: string;
  csatTags: string[]; // e.g. ['Pontualidade', 'Qualidade Técnica', 'Limpeza']
  createdAt: string;
}

export interface FacilityTicket {
  id: string;
  code: string;
  title: string;
  description: string;
  category: 'PREVENTIVA' | 'CORRETIVA' | 'EMERGENCIAL' | 'MELHORIA';
  unitId: string;
  unitName: string;
  locationArea: string;
  priority: TicketPriority;
  status: TicketStatus;
  requesterId: string;
  requesterName: string;
  assignedToId?: string;
  assignedToName?: string;
  assetId?: string;
  assetName?: string;
  requiredSkillCategory?: 'AR_CONDICIONADO' | 'ELETIRCA' | 'CIVIL' | 'ELEVADORES' | 'SEGURANCA' | 'GERAL';
  estimatedCost?: number;
  actualCost?: number;
  costApprovalStatus?: 'NAO_REQUERIDO' | 'PENDENTE' | 'APROVADO' | 'REJEITADO';
  approvalThresholdLimit?: number;
  timelineEvents?: TicketTimelineEvent[];
  npsFeedback?: NpsFeedback;
  slaHours: number;
  slaExpiresAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface Asset {
  id: string;
  code: string;
  name: string;
  category: AssetCategory;
  unitId: string;
  unitName: string;
  locationArea: string;
  serialNumber: string;
  manufacturer: string;
  model: string;
  installDate: string;
  warrantyValidUntil: string;
  status: AssetStatus;
  lastInterventionDate: string;
  nextPreventiveDate: string;
  estimatedValue: number;
  createdAt: string;
}

export interface MaintenancePlan {
  id: string;
  code: string;
  title: string;
  assetId: string;
  assetName: string;
  unitId: string;
  unitName: string;
  frequency: PlanFrequency;
  mandatoryNorm: string; // e.g. 'Lei 13.589/2018 (PMOC)', 'NR-10', 'AVCB'
  nextExecutionDate: string;
  status: 'EM_DIA' | 'PENDENTE' | 'ATRASADO';
  assignedProviderName: string;
  estimatedMonthlyCost: number;
}

export interface BiMetrics {
  mttrHours: number;
  mtbfDays: number;
  slaCompliancePct: number;
  totalMaintenanceOpEx: number;
  monthlyOpexByUnit: { unitName: string; prevCost: number; corrCost: number; totalCost: number }[];
  ticketsByCategory: { category: string; count: number; cost: number }[];
  monthlyCostsHistory: { month: string; prevCost: number; corrCost: number }[];
}

export interface SystemStats {
  totalTickets: number;
  openTickets: number;
  inProgressTickets: number;
  criticalTickets: number;
  slaCompliancePct: number;
  overallCompliancePct: number;
  activeUnits: number;
  activeCollaborators: number;
  homologatedSuppliers: number;
  recentAuditCount: number;
  totalAssetsCount?: number;
  activePmocPlansCount?: number;
  pendingApprovalsCount?: number;
}

