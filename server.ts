import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import crypto from 'crypto';
import { createServer as createViteServer } from 'vite';
import {
  INITIAL_USERS,
  INITIAL_TENANTS,
  INITIAL_AUDIT_LOGS,
  INITIAL_CLIENTS,
  INITIAL_UNITS,
  INITIAL_COLLABORATORS,
  INITIAL_SUPPLIERS,
  INITIAL_COMPLIANCE_DOCS,
  INITIAL_TERM_ACCEPTANCES,
  INITIAL_FACILITY_TICKETS,
  INITIAL_ASSETS,
  INITIAL_MAINTENANCE_PLANS,
  INITIAL_BI_METRICS,
  getSystemStats
} from './src/data/mockData';
import { SUPABASE_SQL_MIGRATION, SCHEMA_TABLES_SUMMARY } from './src/data/supabaseMigrations';
import {
  User,
  AuditLog,
  Client,
  Unit,
  Collaborator,
  Supplier,
  ComplianceDoc,
  TermAcceptance,
  FacilityTicket,
  Asset,
  MaintenancePlan,
  TicketTimelineEvent,
  NpsFeedback
} from './src/types';

const app = express();
const PORT = 3000;

// In-Memory Database State with persistent CRUD during runtime session
let dbUsers: User[] = [...INITIAL_USERS];
let dbAuditLogs: AuditLog[] = [...INITIAL_AUDIT_LOGS];
let dbClients: Client[] = [...INITIAL_CLIENTS];
let dbUnits: Unit[] = [...INITIAL_UNITS];
let dbCollaborators: Collaborator[] = [...INITIAL_COLLABORATORS];
let dbSuppliers: Supplier[] = [...INITIAL_SUPPLIERS];
let dbComplianceDocs: ComplianceDoc[] = [...INITIAL_COMPLIANCE_DOCS];
let dbTermAcceptances: TermAcceptance[] = [...INITIAL_TERM_ACCEPTANCES];
let dbTickets: FacilityTicket[] = [...INITIAL_FACILITY_TICKETS];
let dbAssets: Asset[] = [...INITIAL_ASSETS];
let dbMaintenancePlans: MaintenancePlan[] = [...INITIAL_MAINTENANCE_PLANS];

// Express Middleware
app.use(express.json({ limit: '5mb' }));

// 1. Security Headers Middleware (OWASP Security First)
app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

// Helper: Audit Log Generator with SHA-256 integrity hash
function recordAuditLog(params: {
  userId: string;
  userName: string;
  userRole: any;
  tenantId: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'AUTH_LOGIN' | 'AUTH_LOGOUT' | 'TERM_ACCEPT' | 'SECURITY_ALERT' | 'APPROVAL_COST';
  entity: 'USUARIO' | 'CLIENTE' | 'UNIDADE' | 'COLABORADOR' | 'FORNECEDOR' | 'CHAMADO' | 'DOCUMENTO' | 'ATIVO' | 'PLANO_PMOC' | 'SISTEMA';
  entityId: string;
  details: string;
  ipAddress?: string;
}): AuditLog {
  const timestamp = new Date().toISOString();
  const id = `aud-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  const ip = params.ipAddress || '189.120.44.102';

  // Compute cryptographic SHA-256 integrity hash
  const rawData = `${id}|${timestamp}|${params.userId}|${params.action}|${params.entity}|${params.entityId}|${params.details}`;
  const hash = crypto.createHash('sha256').update(rawData).digest('hex');

  const newLog: AuditLog = {
    id,
    timestamp,
    userId: params.userId,
    userName: params.userName,
    userRole: params.userRole,
    tenantId: params.tenantId,
    action: params.action,
    entity: params.entity,
    entityId: params.entityId,
    details: params.details,
    ipAddress: ip,
    integrityHash: hash
  };

  dbAuditLogs.unshift(newLog);
  return newLog;
}

// ==========================================
// API ROUTES
// ==========================================

// Healthcheck Endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    system: 'Facilities & Corporate Management Central Hub',
    version: '1.0.0-phase1',
    timestamp: new Date().toISOString()
  });
});

// 1. Auth: Login Endpoint
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email, role } = req.body;
  const ipAddress = req.ip || req.socket.remoteAddress || '189.120.44.102';

  const user = dbUsers.find(u => u.email.toLowerCase() === (email || '').toLowerCase()) ||
               dbUsers.find(u => u.role === role) ||
               dbUsers[0];

  user.lastLogin = new Date().toISOString();

  recordAuditLog({
    userId: user.id,
    userName: user.name,
    userRole: user.role,
    tenantId: user.tenantId,
    action: 'AUTH_LOGIN',
    entity: 'SISTEMA',
    entityId: user.id,
    details: `Autenticação bem-sucedida para perfil [${user.role}] com validação RBAC e RLS`,
    ipAddress
  });

  res.json({
    success: true,
    user,
    token: `bearer-${crypto.randomBytes(16).toString('hex')}`
  });
});

// Auth: Term Acceptance Endpoint
app.post('/api/auth/accept-term', (req: Request, res: Response) => {
  const { userId, termVersion } = req.body;
  const ipAddress = req.ip || req.socket.remoteAddress || '189.120.44.102';
  const userAgent = req.headers['user-agent'] || 'Browser Client';

  const user = dbUsers.find(u => u.id === userId);
  if (!user) {
    res.status(404).json({ error: 'Usuário não encontrado' });
    return;
  }

  user.termAccepted = true;
  user.termAcceptedAt = new Date().toISOString();

  const acceptance: TermAcceptance = {
    id: `ta-${Date.now()}`,
    userId: user.id,
    userName: user.name,
    userEmail: user.email,
    userRole: user.role,
    termVersion: termVersion || 'v2026.1',
    acceptedAt: user.termAcceptedAt,
    ipAddress,
    userAgent
  };

  dbTermAcceptances.unshift(acceptance);

  recordAuditLog({
    userId: user.id,
    userName: user.name,
    userRole: user.role,
    tenantId: user.tenantId,
    action: 'TERM_ACCEPT',
    entity: 'USUARIO',
    entityId: user.id,
    details: `Aceite formal do Termo de Governança, Compliance e LGPD ${acceptance.termVersion}`,
    ipAddress
  });

  res.json({ success: true, user, acceptance });
});

// 2. Dashboard Statistics Endpoint
app.get('/api/dashboard/stats', (req: Request, res: Response) => {
  const stats = getSystemStats(dbTickets, dbComplianceDocs);
  res.json(stats);
});

// 3. Audit Logs Endpoint
app.get('/api/audit-logs', (req: Request, res: Response) => {
  const { action, entity, search } = req.query;
  let filtered = [...dbAuditLogs];

  if (action) {
    filtered = filtered.filter(l => l.action === action);
  }
  if (entity) {
    filtered = filtered.filter(l => l.entity === entity);
  }
  if (search) {
    const q = (search as string).toLowerCase();
    filtered = filtered.filter(l =>
      l.userName.toLowerCase().includes(q) ||
      l.details.toLowerCase().includes(q) ||
      l.ipAddress.includes(q) ||
      l.integrityHash.includes(q)
    );
  }

  res.json(filtered);
});

// 4. Compliance Documents Endpoints
app.get('/api/compliance/docs', (req: Request, res: Response) => {
  res.json(dbComplianceDocs);
});

app.post('/api/compliance/docs', (req: Request, res: Response) => {
  const { title, code, category, validUntil, requiredForRoles, createdBy } = req.body;

  const newDoc: ComplianceDoc = {
    id: `doc-${Date.now()}`,
    title: title || 'Documento Regulatório sem Título',
    code: code || `DOC-${Date.now().toString().slice(-4)}`,
    category: category || 'REGULATORIO',
    version: 'v1.0',
    validUntil: validUntil || '2027-12-31',
    status: 'ATIVO',
    requiredForRoles: requiredForRoles || ['ADMIN', 'OPERACIONAL'],
    createdBy: createdBy || 'Administrador do Sistema',
    createdAt: new Date().toISOString()
  };

  dbComplianceDocs.unshift(newDoc);

  recordAuditLog({
    userId: 'u-admin-01',
    userName: 'Carlos Silva',
    userRole: 'ADMIN',
    tenantId: 't-001',
    action: 'CREATE',
    entity: 'DOCUMENTO',
    entityId: newDoc.id,
    details: `Novo documento de compliance cadastrado: [${newDoc.code}] ${newDoc.title}`
  });

  res.status(201).json(newDoc);
});

app.get('/api/compliance/term-acceptances', (req: Request, res: Response) => {
  res.json(dbTermAcceptances);
});

// 5. Cadastros: Clientes Endpoints
app.get('/api/cadastros/clientes', (req: Request, res: Response) => {
  res.json(dbClients);
});

app.post('/api/cadastros/clientes', (req: Request, res: Response) => {
  const { corporateName, fantasyName, cnpj, contactEmail, contactPhone } = req.body;

  const newClient: Client = {
    id: `cli-${Date.now()}`,
    tenantId: 't-001',
    corporateName,
    fantasyName: fantasyName || corporateName,
    cnpj,
    contactEmail,
    contactPhone,
    status: 'ATIVO',
    activeUnitsCount: 0,
    createdAt: new Date().toISOString()
  };

  dbClients.unshift(newClient);

  recordAuditLog({
    userId: 'u-admin-01',
    userName: 'Carlos Silva',
    userRole: 'ADMIN',
    tenantId: 't-001',
    action: 'CREATE',
    entity: 'CLIENTE',
    entityId: newClient.id,
    details: `Cliente cadastrado: ${newClient.corporateName} (CNPJ: ${newClient.cnpj})`
  });

  res.status(201).json(newClient);
});

// Cadastros: Unidades Endpoints
app.get('/api/cadastros/unidades', (req: Request, res: Response) => {
  res.json(dbUnits);
});

app.post('/api/cadastros/unidades', (req: Request, res: Response) => {
  const { clientId, clientName, name, code, address, city, state, postalCode, managerName, contactPhone } = req.body;

  const newUnit: Unit = {
    id: `unit-${Date.now()}`,
    clientId,
    clientName: clientName || 'Cliente Corporativo',
    name,
    code: code || `UNIT-${Math.floor(Math.random() * 900 + 100)}`,
    address,
    city,
    state,
    postalCode,
    managerName,
    contactPhone,
    activeTicketsCount: 0,
    createdAt: new Date().toISOString()
  };

  dbUnits.unshift(newUnit);

  // Increment unit count in client
  const client = dbClients.find(c => c.id === clientId);
  if (client) {
    client.activeUnitsCount += 1;
  }

  recordAuditLog({
    userId: 'u-admin-01',
    userName: 'Carlos Silva',
    userRole: 'ADMIN',
    tenantId: 't-001',
    action: 'CREATE',
    entity: 'UNIDADE',
    entityId: newUnit.id,
    details: `Nova unidade operacional registrada: [${newUnit.code}] ${newUnit.name} - ${newUnit.city}/${newUnit.state}`
  });

  res.status(201).json(newUnit);
});

// Cadastros: Colaboradores Endpoints
app.get('/api/cadastros/colaboradores', (req: Request, res: Response) => {
  res.json(dbCollaborators);
});

app.post('/api/cadastros/colaboradores', (req: Request, res: Response) => {
  const { name, cpf, email, phone, roleTitle, department, nrCertifications } = req.body;

  const newColab: Collaborator = {
    id: `colab-${Date.now()}`,
    name,
    cpf,
    email,
    phone,
    roleTitle,
    department: department || 'Operações de Facilities',
    nrCertifications: nrCertifications || ['NR-10'],
    status: 'ATIVO',
    assignedUnitIds: [],
    assignedUnitNames: [],
    createdAt: new Date().toISOString()
  };

  dbCollaborators.unshift(newColab);

  recordAuditLog({
    userId: 'u-admin-01',
    userName: 'Carlos Silva',
    userRole: 'ADMIN',
    tenantId: 't-001',
    action: 'CREATE',
    entity: 'COLABORADOR',
    entityId: newColab.id,
    details: `Colaborador cadastrado: ${newColab.name} (${newColab.roleTitle}) com certificações [${newColab.nrCertifications.join(', ')}]`
  });

  res.status(201).json(newColab);
});

// Cadastros: Fornecedores Endpoints
app.get('/api/cadastros/fornecedores', (req: Request, res: Response) => {
  res.json(dbSuppliers);
});

app.post('/api/cadastros/fornecedores', (req: Request, res: Response) => {
  const { corporateName, fantasyName, cnpj, category, contactEmail, phone } = req.body;

  const newSupplier: Supplier = {
    id: `sup-${Date.now()}`,
    corporateName,
    fantasyName: fantasyName || corporateName,
    cnpj,
    category: category || 'MULTISERVICOS',
    rating: 5.0,
    slaPerformancePct: 100.0,
    status: 'HOMOLOGADO',
    contactEmail,
    phone,
    activeContractsCount: 1,
    certificationsValidUntil: '2027-12-31'
  };

  dbSuppliers.unshift(newSupplier);

  recordAuditLog({
    userId: 'u-admin-01',
    userName: 'Carlos Silva',
    userRole: 'ADMIN',
    tenantId: 't-001',
    action: 'CREATE',
    entity: 'FORNECEDOR',
    entityId: newSupplier.id,
    details: `Fornecedor homologado cadastrado: ${newSupplier.corporateName} (Categoria: ${newSupplier.category})`
  });

  res.status(201).json(newSupplier);
});

// 6. Facilities: Chamados / Tickets Endpoints
app.get('/api/facilities/chamados', (req: Request, res: Response) => {
  res.json(dbTickets);
});

app.post('/api/facilities/chamados', (req: Request, res: Response) => {
  const { title, description, category, unitId, unitName, locationArea, priority, requesterName, slaHours } = req.body;

  const hours = slaHours || (priority === 'CRITICA' ? 2 : priority === 'ALTA' ? 8 : 24);
  const now = new Date();
  const expires = new Date(now.getTime() + hours * 60 * 60 * 1000);

  const newTicket: FacilityTicket = {
    id: `tkt-${Date.now()}`,
    code: `CHM-2026-${Math.floor(Math.random() * 9000 + 1000)}`,
    title,
    description,
    category: category || 'CORRETIVA',
    unitId: unitId || 'unit-01',
    unitName: unitName || 'Torre Berrini',
    locationArea: locationArea || 'Área Comum',
    priority: priority || 'MEDIA',
    status: 'NOVO',
    requesterId: 'u-cli-01',
    requesterName: requesterName || 'Roberto Santos',
    slaHours: hours,
    slaExpiresAt: expires.toISOString(),
    createdAt: now.toISOString(),
    updatedAt: now.toISOString()
  };

  dbTickets.unshift(newTicket);

  recordAuditLog({
    userId: 'u-cli-01',
    userName: newTicket.requesterName,
    userRole: 'CLIENTE',
    tenantId: 't-001',
    action: 'CREATE',
    entity: 'CHAMADO',
    entityId: newTicket.code,
    details: `Novo chamado de Facilities aberto: [${newTicket.code}] ${newTicket.title} - Prioridade: ${newTicket.priority}`
  });

  res.status(201).json(newTicket);
});

app.patch('/api/facilities/chamados/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, assignedToId, assignedToName } = req.body;

  const ticket = dbTickets.find(t => t.id === id || t.code === id);
  if (!ticket) {
    res.status(404).json({ error: 'Chamado não encontrado' });
    return;
  }

  if (status) ticket.status = status;
  if (assignedToId) ticket.assignedToId = assignedToId;
  if (assignedToName) ticket.assignedToName = assignedToName;
  ticket.updatedAt = new Date().toISOString();

  recordAuditLog({
    userId: 'u-op-01',
    userName: 'Fernanda Oliveira',
    userRole: 'OPERACIONAL',
    tenantId: 't-001',
    action: 'UPDATE',
    entity: 'CHAMADO',
    entityId: ticket.code,
    details: `Chamado [${ticket.code}] atualizado: Status -> ${ticket.status}, Responsável -> ${ticket.assignedToName || 'Atribuído'}`
  });

  res.json(ticket);
});

// Cost Approval Endpoint
app.post('/api/facilities/chamados/:id/approve-cost', (req: Request, res: Response) => {
  const { id } = req.params;
  const { approved, approvedBy, comment } = req.body;

  const ticket = dbTickets.find(t => t.id === id || t.code === id);
  if (!ticket) {
    res.status(404).json({ error: 'Chamado não encontrado' });
    return;
  }

  ticket.costApprovalStatus = approved ? 'APROVADO' : 'REJEITADO';
  if (approved) {
    ticket.status = 'EM_ANDAMENTO';
  } else {
    ticket.status = 'CANCELADO';
  }
  ticket.updatedAt = new Date().toISOString();

  const event: TicketTimelineEvent = {
    id: `tl-${Date.now()}`,
    timestamp: new Date().toISOString(),
    title: approved ? 'Orçamento e Alçada Aprovados' : 'Orçamento Rejeitado por Alçada',
    description: comment || (approved ? 'Aprovação concedida pelo gestor financeiro.' : 'Reprovado por exceder o orçamento alocado.'),
    authorName: approvedBy || 'Carlos Silva (ADMIN)',
    type: 'COST_APPROVAL'
  };

  if (!ticket.timelineEvents) ticket.timelineEvents = [];
  ticket.timelineEvents.unshift(event);

  recordAuditLog({
    userId: 'u-admin-01',
    userName: approvedBy || 'Carlos Silva',
    userRole: 'ADMIN',
    tenantId: 't-001',
    action: 'APPROVAL_COST',
    entity: 'CHAMADO',
    entityId: ticket.code,
    details: `Decisão de alçada financeira para [${ticket.code}]: ${ticket.costApprovalStatus} - Custo Estimado: R$ ${ticket.estimatedCost || 0}`
  });

  res.json(ticket);
});

// NPS Feedback Endpoint
app.post('/api/facilities/chamados/:id/nps', (req: Request, res: Response) => {
  const { id } = req.params;
  const { score, comment, csatTags } = req.body;

  const ticket = dbTickets.find(t => t.id === id || t.code === id);
  if (!ticket) {
    res.status(404).json({ error: 'Chamado não encontrado' });
    return;
  }

  ticket.npsFeedback = {
    score: Number(score) || 10,
    comment: comment || '',
    csatTags: csatTags || ['Atendimento'],
    createdAt: new Date().toISOString()
  };

  recordAuditLog({
    userId: ticket.requesterId || 'u-cli-01',
    userName: ticket.requesterName || 'Cliente Corporativo',
    userRole: 'CLIENTE',
    tenantId: 't-001',
    action: 'UPDATE',
    entity: 'CHAMADO',
    entityId: ticket.code,
    details: `Pesquisa de Satisfação NPS submetida para [${ticket.code}]: Nota ${score}/10`
  });

  res.json(ticket);
});

// 7. EAM: Assets & PMOC Endpoints
app.get('/api/eam/assets', (req: Request, res: Response) => {
  res.json(dbAssets);
});

app.post('/api/eam/assets', (req: Request, res: Response) => {
  const { name, category, unitId, unitName, locationArea, serialNumber, manufacturer, model, estimatedValue } = req.body;

  const newAsset: Asset = {
    id: `ast-${Date.now()}`,
    code: `AST-${category || 'EQUIP'}-${Math.floor(Math.random() * 900 + 100)}`,
    name: name || 'Equipamento Crítico Predial',
    category: category || 'GERADOR_NOBREAK',
    unitId: unitId || 'unit-01',
    unitName: unitName || 'Torre Berrini',
    locationArea: locationArea || 'Casa de Máquinas',
    serialNumber: serialNumber || `SN-${Date.now().toString().slice(-6)}`,
    manufacturer: manufacturer || 'Fabricante Industrial',
    model: model || 'Modelo Standard',
    installDate: new Date().toISOString().slice(0, 10),
    warrantyValidUntil: '2028-12-31',
    status: 'OPERACIONAL',
    lastInterventionDate: new Date().toISOString().slice(0, 10),
    nextPreventiveDate: '2026-09-01',
    estimatedValue: Number(estimatedValue) || 150000.00,
    createdAt: new Date().toISOString()
  };

  dbAssets.unshift(newAsset);

  recordAuditLog({
    userId: 'u-admin-01',
    userName: 'Carlos Silva',
    userRole: 'ADMIN',
    tenantId: 't-001',
    action: 'CREATE',
    entity: 'ATIVO',
    entityId: newAsset.id,
    details: `Ativo crítico cadastrado no inventário EAM: [${newAsset.code}] ${newAsset.name}`
  });

  res.status(201).json(newAsset);
});

app.get('/api/eam/plans', (req: Request, res: Response) => {
  res.json(dbMaintenancePlans);
});

app.post('/api/eam/plans', (req: Request, res: Response) => {
  const { title, assetId, assetName, unitId, unitName, frequency, mandatoryNorm, estimatedMonthlyCost } = req.body;

  const newPlan: MaintenancePlan = {
    id: `plan-${Date.now()}`,
    code: `PMOC-${frequency || 'MENSAL'}-${Math.floor(Math.random() * 900 + 100)}`,
    title: title || 'Plano de Manutenção Preventiva PMOC',
    assetId: assetId || 'ast-001',
    assetName: assetName || 'Chiller Parafuso Carrier',
    unitId: unitId || 'unit-01',
    unitName: unitName || 'Torre Berrini',
    frequency: frequency || 'MENSAL',
    mandatoryNorm: mandatoryNorm || 'Lei 13.589/2018 (PMOC)',
    nextExecutionDate: '2026-09-15',
    status: 'EM_DIA',
    assignedProviderName: 'ClimaTech HVAC',
    estimatedMonthlyCost: Number(estimatedMonthlyCost) || 2500.00
  };

  dbMaintenancePlans.unshift(newPlan);

  recordAuditLog({
    userId: 'u-admin-01',
    userName: 'Carlos Silva',
    userRole: 'ADMIN',
    tenantId: 't-001',
    action: 'CREATE',
    entity: 'PLANO_PMOC',
    entityId: newPlan.id,
    details: `Plano de Manutenção Preventiva PMOC ativado: [${newPlan.code}] ${newPlan.title}`
  });

  res.status(201).json(newPlan);
});

// 8. Executive BI Analytics Endpoint
app.get('/api/bi/metrics', (req: Request, res: Response) => {
  res.json(INITIAL_BI_METRICS);
});

// 9. Database & Migrations API
app.get('/api/database/sql-schema', (req: Request, res: Response) => {
  res.json({
    migrationSql: SUPABASE_SQL_MIGRATION,
    tablesSummary: SCHEMA_TABLES_SUMMARY
  });
});

// ==========================================
// VITE MIDDLEWARE / PRODUCTION STATIC SERVE
// ==========================================
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Facilities Central Server] Running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
