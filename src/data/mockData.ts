import {
  User,
  Tenant,
  AuditLog,
  Client,
  Unit,
  Collaborator,
  Supplier,
  ComplianceDoc,
  TermAcceptance,
  FacilityTicket,
  SystemStats,
  Asset,
  MaintenancePlan,
  BiMetrics
} from '../types';

export const INITIAL_ASSETS: Asset[] = [
  {
    id: 'ast-001',
    code: 'AST-CHILLER-01',
    name: 'Chiller Parafuso Carrier 30XW 150 TR',
    category: 'HVAC_CHILLER',
    unitId: 'unit-01',
    unitName: 'Torre Berrini - Centro de Inovação',
    locationArea: 'Cobertura / Casa de Máquinas Bloco B',
    serialNumber: 'CAR-2023-99812-SP',
    manufacturer: 'Carrier HVAC',
    model: '30XW-150TR-A',
    installDate: '2023-04-10',
    warrantyValidUntil: '2028-04-10',
    status: 'EM_MANUTENCAO',
    lastInterventionDate: '2026-08-03',
    nextPreventiveDate: '2026-09-01',
    estimatedValue: 280000.00,
    createdAt: '2023-04-15T10:00:00Z'
  },
  {
    id: 'ast-002',
    code: 'AST-GERADOR-01',
    name: 'Grupo Gerador STEMAC 500 kVA CUMMINS',
    category: 'GERADOR_NOBREAK',
    unitId: 'unit-03',
    unitName: 'Sede Paulista - Edifício Corporate',
    locationArea: 'Subsolo 2 - Sala Técnica 04',
    serialNumber: 'STM-500KVA-2022',
    manufacturer: 'STEMAC / Cummins',
    model: 'QSX15-G9',
    installDate: '2022-08-20',
    warrantyValidUntil: '2027-08-20',
    status: 'OPERACIONAL',
    lastInterventionDate: '2026-07-15',
    nextPreventiveDate: '2026-08-15',
    estimatedValue: 195000.00,
    createdAt: '2022-08-25T09:00:00Z'
  },
  {
    id: 'ast-003',
    code: 'AST-SUBESTACAO-01',
    name: 'Subestação Abrigada Aroeira 13.8kV / 750kVA',
    category: 'SUBESTACAO_ELETRICA',
    unitId: 'unit-01',
    unitName: 'Torre Berrini - Centro de Inovação',
    locationArea: 'Subsolo 1 - Módulo de Alta Tensão',
    serialNumber: 'WEG-SUB-13800-750',
    manufacturer: 'WEG Equipamentos',
    model: 'Dry Transformer 750kVA',
    installDate: '2021-03-12',
    warrantyValidUntil: '2026-03-12',
    status: 'OPERACIONAL',
    lastInterventionDate: '2026-06-10',
    nextPreventiveDate: '2026-12-10',
    estimatedValue: 340000.00,
    createdAt: '2021-03-15T11:00:00Z'
  },
  {
    id: 'ast-004',
    code: 'AST-INCENDIO-01',
    name: 'Central de Alarme de Incêndio Endereçável Bosch FPA-5000',
    category: 'COMBATE_INCENDIO',
    unitId: 'unit-02',
    unitName: 'Hub Faria Lima - Agência Digital',
    locationArea: 'Portaria Central & Sala de Monitoramento',
    serialNumber: 'BOSCH-FPA5000-2024',
    manufacturer: 'Bosch Building Technologies',
    model: 'FPA-5000 Modular',
    installDate: '2024-01-18',
    warrantyValidUntil: '2029-01-18',
    status: 'OPERACIONAL',
    lastInterventionDate: '2026-05-20',
    nextPreventiveDate: '2026-11-20',
    estimatedValue: 85000.00,
    createdAt: '2024-01-20T14:00:00Z'
  },
  {
    id: 'ast-005',
    code: 'AST-ELEVADOR-01',
    name: 'Elevador de Passageiros Inteligente OTIS SkyRise 2.5m/s',
    category: 'ELEVADORES',
    unitId: 'unit-03',
    unitName: 'Sede Paulista - Edifício Corporate',
    locationArea: 'Caixa de Corrida - Elevador Social Lote A',
    serialNumber: 'OTIS-SKYRISE-2023-01',
    manufacturer: 'Otis Elevadores',
    model: 'SkyRise High Speed',
    installDate: '2023-09-05',
    warrantyValidUntil: '2028-09-05',
    status: 'OPERACIONAL',
    lastInterventionDate: '2026-07-28',
    nextPreventiveDate: '2026-08-28',
    estimatedValue: 420000.00,
    createdAt: '2023-09-10T16:00:00Z'
  }
];

export const INITIAL_MAINTENANCE_PLANS: MaintenancePlan[] = [
  {
    id: 'plan-001',
    code: 'PMOC-HVAC-MONTHLY',
    title: 'Plano PMOC Obrigatório - Higienização e Filtros Chiller 150 TR',
    assetId: 'ast-001',
    assetName: 'Chiller Parafuso Carrier 30XW 150 TR',
    unitId: 'unit-01',
    unitName: 'Torre Berrini - Centro de Inovação',
    frequency: 'MENSAL',
    mandatoryNorm: 'Lei 13.589/2018 (PMOC) & ANVISA RE-09',
    nextExecutionDate: '2026-08-15',
    status: 'EM_DIA',
    assignedProviderName: 'ClimaTech HVAC',
    estimatedMonthlyCost: 3500.00
  },
  {
    id: 'plan-002',
    code: 'PMOC-GERADOR-TRIMESTRAL',
    title: 'Manutenção Preventiva Trimestral de Geradores & Baterias',
    assetId: 'ast-002',
    assetName: 'Grupo Gerador STEMAC 500 kVA CUMMINS',
    unitId: 'unit-03',
    unitName: 'Sede Paulista - Edifício Corporate',
    frequency: 'TRIMESTRAL',
    mandatoryNorm: 'ABNT NBR 10861 & NR-10',
    nextExecutionDate: '2026-08-10',
    status: 'PENDENTE',
    assignedProviderName: 'Engeluz Elétrica',
    estimatedMonthlyCost: 2800.00
  },
  {
    id: 'plan-003',
    code: 'PMOC-SUBESTACAO-ANUAL',
    title: 'Termografia e Ensaios Dielétricos em Subestação 13.8kV',
    assetId: 'ast-003',
    assetName: 'Subestação Abrigada Aroeira 13.8kV / 750kVA',
    unitId: 'unit-01',
    unitName: 'Torre Berrini - Centro de Inovação',
    frequency: 'ANUAL',
    mandatoryNorm: 'NR-10 SEP & ABNT NBR 14039',
    nextExecutionDate: '2026-12-10',
    status: 'EM_DIA',
    assignedProviderName: 'Engeluz Elétrica',
    estimatedMonthlyCost: 12000.00
  },
  {
    id: 'plan-004',
    code: 'PMOC-ELEVADORES-MENSAL',
    title: 'Inspeção Geral de Segurança e Cabos de Aço de Elevadores',
    assetId: 'ast-005',
    assetName: 'Elevador de Passageiros Inteligente OTIS SkyRise',
    unitId: 'unit-03',
    unitName: 'Sede Paulista - Edifício Corporate',
    frequency: 'MENSAL',
    mandatoryNorm: 'ABNT NBR 16042 & Decreto Municipal SP',
    nextExecutionDate: '2026-08-28',
    status: 'EM_DIA',
    assignedProviderName: 'Otis Elevadores',
    estimatedMonthlyCost: 4200.00
  }
];

export const INITIAL_BI_METRICS: BiMetrics = {
  mttrHours: 3.4,
  mtbfDays: 38.5,
  slaCompliancePct: 98.2,
  totalMaintenanceOpEx: 142800.00,
  monthlyOpexByUnit: [
    { unitName: 'Torre Berrini', prevCost: 24500, corrCost: 18200, totalCost: 42700 },
    { unitName: 'Sede Paulista', prevCost: 31000, corrCost: 21500, totalCost: 52500 },
    { unitName: 'Hub Faria Lima', prevCost: 12800, corrCost: 9400, totalCost: 22200 },
    { unitName: 'CD Viracopos', prevCost: 16400, corrCost: 9000, totalCost: 25400 }
  ],
  ticketsByCategory: [
    { category: 'PREVENTIVA', count: 18, cost: 68000 },
    { category: 'CORRETIVA', count: 12, cost: 42000 },
    { category: 'EMERGENCIAL', count: 3, cost: 24800 },
    { category: 'MELHORIA', count: 5, cost: 8000 }
  ],
  monthlyCostsHistory: [
    { month: 'Mar/26', prevCost: 72000, corrCost: 48000 },
    { month: 'Abr/26', prevCost: 75000, corrCost: 41000 },
    { month: 'Mai/26', prevCost: 78000, corrCost: 39000 },
    { month: 'Jun/26', prevCost: 81000, corrCost: 35000 },
    { month: 'Jul/26', prevCost: 83000, corrCost: 38000 },
    { month: 'Ago/26', prevCost: 84700, corrCost: 58100 }
  ]
};

export const INITIAL_TENANTS: Tenant[] = [
  {
    id: 't-001',
    name: 'FACILITIES CORP MATRIZ',
    cnpj: '12.345.678/0001-90',
    status: 'ATIVO',
    plan: 'ENTERPRISE',
    activeUnitsCount: 12,
    createdAt: '2025-01-15T08:00:00Z'
  },
  {
    id: 't-002',
    name: 'TECHTOWER EMPREENDIMENTOS',
    cnpj: '98.765.432/0001-10',
    status: 'ATIVO',
    plan: 'CORPORATE',
    activeUnitsCount: 5,
    createdAt: '2025-03-10T10:30:00Z'
  }
];

export const INITIAL_USERS: User[] = [
  {
    id: 'u-admin-01',
    name: 'Carlos Silva',
    email: 'admin@facilitiescorp.com.br',
    role: 'ADMIN',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    tenantId: 't-001',
    tenantName: 'FACILITIES CORP MATRIZ',
    status: 'ATIVO',
    permissions: [
      'ALL_ACCESS',
      'USER_MANAGE',
      'COMPLIANCE_WRITE',
      'AUDIT_VIEW',
      'CADASTROS_FULL',
      'TICKETS_MANAGE'
    ],
    lastLogin: '2026-08-03T17:45:00Z',
    termAccepted: true,
    termAcceptedAt: '2026-01-10T09:12:00Z',
    createdAt: '2025-01-15T08:00:00Z'
  },
  {
    id: 'u-op-01',
    name: 'Fernanda Oliveira',
    email: 'f.oliveira@facilitiescorp.com.br',
    role: 'OPERACIONAL',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
    tenantId: 't-001',
    tenantName: 'FACILITIES CORP MATRIZ',
    status: 'ATIVO',
    permissions: [
      'TICKETS_MANAGE',
      'CADASTROS_VIEW',
      'COMPLIANCE_VIEW',
      'UNITS_MANAGE'
    ],
    lastLogin: '2026-08-03T16:20:00Z',
    termAccepted: true,
    termAcceptedAt: '2026-02-01T11:00:00Z',
    createdAt: '2025-02-01T09:00:00Z'
  },
  {
    id: 'u-cli-01',
    name: 'Roberto Santos',
    email: 'roberto@techcorp.com.br',
    role: 'CLIENTE',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    tenantId: 't-001',
    tenantName: 'FACILITIES CORP MATRIZ',
    status: 'ATIVO',
    permissions: [
      'TICKETS_CREATE',
      'TICKETS_VIEW_OWN',
      'UNITS_VIEW_OWN',
      'COMPLIANCE_VIEW_PUBLIC'
    ],
    lastLogin: '2026-08-03T14:10:00Z',
    termAccepted: true,
    termAcceptedAt: '2026-03-15T14:30:00Z',
    createdAt: '2025-03-15T10:00:00Z'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'aud-1001',
    timestamp: '2026-08-03T17:45:12Z',
    userId: 'u-admin-01',
    userName: 'Carlos Silva',
    userRole: 'ADMIN',
    tenantId: 't-001',
    action: 'AUTH_LOGIN',
    entity: 'SISTEMA',
    entityId: 'sys-01',
    details: 'Sessão iniciada via IP seguro com dupla verificação RBAC',
    ipAddress: '189.120.44.102',
    integrityHash: 'a8f9c73d902e1a34f82b54e7d1c60aef93'
  },
  {
    id: 'aud-1002',
    timestamp: '2026-08-03T16:30:00Z',
    userId: 'u-op-01',
    userName: 'Fernanda Oliveira',
    userRole: 'OPERACIONAL',
    tenantId: 't-001',
    action: 'UPDATE',
    entity: 'CHAMADO',
    entityId: 'CHM-2026-042',
    details: 'Status do chamado atualizado para EM_ANDAMENTO com atribuição técnica NR-10',
    ipAddress: '201.88.19.45',
    integrityHash: 'c4e2a188f39002931bc782910ad5fe9301'
  },
  {
    id: 'aud-1003',
    timestamp: '2026-08-03T15:10:22Z',
    userId: 'u-admin-01',
    userName: 'Carlos Silva',
    userRole: 'ADMIN',
    tenantId: 't-001',
    action: 'CREATE',
    entity: 'DOCUMENTO',
    entityId: 'DOC-NR10-2026',
    details: 'Novo documento regulatório cadastrado: Laudo Técnico de Instalações Elétricas (NR-10)',
    ipAddress: '189.120.44.102',
    integrityHash: 'd71a938b801237cfa902183e91129bc781'
  },
  {
    id: 'aud-1004',
    timestamp: '2026-08-03T14:10:00Z',
    userId: 'u-cli-01',
    userName: 'Roberto Santos',
    userRole: 'CLIENTE',
    tenantId: 't-001',
    action: 'CREATE',
    entity: 'CHAMADO',
    entityId: 'CHM-2026-045',
    details: 'Chamado emergencial aberto: Falha no Chiller do Bloco B - Unidade Berrini',
    ipAddress: '177.34.88.12',
    integrityHash: 'e9218274a10874bf82039129081239ab7d'
  },
  {
    id: 'aud-1005',
    timestamp: '2026-08-02T19:00:00Z',
    userId: 'u-admin-01',
    userName: 'Carlos Silva',
    userRole: 'ADMIN',
    tenantId: 't-001',
    action: 'TERM_ACCEPT',
    entity: 'USUARIO',
    entityId: 'u-admin-01',
    details: 'Aceite registrado do Termo de Governança e LGPD v2026.1',
    ipAddress: '189.120.44.102',
    integrityHash: 'f00129388127391abf83912803810237aa'
  }
];

export const INITIAL_CLIENTS: Client[] = [
  {
    id: 'cli-001',
    tenantId: 't-001',
    corporateName: 'TECHCORP TECNOLOGIA S.A.',
    fantasyName: 'TechCorp HQ',
    cnpj: '33.123.456/0001-00',
    contactEmail: 'facilities@techcorp.com.br',
    contactPhone: '(11) 3090-8800',
    status: 'ATIVO',
    activeUnitsCount: 3,
    createdAt: '2025-02-10T10:00:00Z'
  },
  {
    id: 'cli-002',
    tenantId: 't-001',
    corporateName: 'BANCO INOVACAO INVESTIMENTOS S.A.',
    fantasyName: 'Banco Inovação',
    cnpj: '44.987.654/0001-22',
    contactEmail: 'operacoes@bancoinovacao.com.br',
    contactPhone: '(11) 4004-9900',
    status: 'ATIVO',
    activeUnitsCount: 4,
    createdAt: '2025-03-01T11:30:00Z'
  },
  {
    id: 'cli-003',
    tenantId: 't-001',
    corporateName: 'LOGISTICA GLOBEX BRASIL LTDA',
    fantasyName: 'Globex Logistics',
    cnpj: '55.333.111/0001-88',
    contactEmail: 'admin@globexlog.com.br',
    contactPhone: '(19) 3888-7700',
    status: 'ATIVO',
    activeUnitsCount: 2,
    createdAt: '2025-04-12T14:15:00Z'
  }
];

export const INITIAL_UNITS: Unit[] = [
  {
    id: 'unit-01',
    clientId: 'cli-001',
    clientName: 'TechCorp HQ',
    name: 'Torre Berrini - Centro de Inovação',
    code: 'UNIT-BERRINI-01',
    address: 'Av. das Nações Unidas, 12901 - 18º Andar',
    city: 'São Paulo',
    state: 'SP',
    postalCode: '04578-910',
    managerName: 'Roberto Santos',
    contactPhone: '(11) 98888-1122',
    activeTicketsCount: 3,
    createdAt: '2025-02-11T09:00:00Z'
  },
  {
    id: 'unit-02',
    clientId: 'cli-001',
    clientName: 'TechCorp HQ',
    name: 'Hub Faria Lima - Agência Digital',
    code: 'UNIT-FARIA-02',
    address: 'Av. Brigadeiro Faria Lima, 3477 - 5º Andar',
    city: 'São Paulo',
    state: 'SP',
    postalCode: '04538-133',
    managerName: 'Mariana Costa',
    contactPhone: '(11) 97777-3344',
    activeTicketsCount: 1,
    createdAt: '2025-02-15T10:00:00Z'
  },
  {
    id: 'unit-03',
    clientId: 'cli-002',
    clientName: 'Banco Inovação',
    name: 'Sede Paulista - Edifício Corporate',
    code: 'UNIT-PAULISTA-01',
    address: 'Av. Paulista, 1578 - 22º ao 25º Andar',
    city: 'São Paulo',
    state: 'SP',
    postalCode: '01310-200',
    managerName: 'Alexandre Vieira',
    contactPhone: '(11) 96666-5566',
    activeTicketsCount: 2,
    createdAt: '2025-03-02T08:30:00Z'
  },
  {
    id: 'unit-04',
    clientId: 'cli-003',
    clientName: 'Globex Logistics',
    name: 'Centro de Distribuição Viracopos',
    code: 'UNIT-VIRACOPOS-CD',
    address: 'Rodovia Santos Dumont, Km 66',
    city: 'Campinas',
    state: 'SP',
    postalCode: '13055-900',
    managerName: 'Carlos Eduardo Mendes',
    contactPhone: '(19) 99111-2233',
    activeTicketsCount: 0,
    createdAt: '2025-04-15T11:00:00Z'
  }
];

export const INITIAL_COLLABORATORS: Collaborator[] = [
  {
    id: 'colab-01',
    name: 'Marcelo Pires',
    cpf: '123.456.789-00',
    email: 'marcelo.pires@facilitiescorp.com.br',
    phone: '(11) 98123-4567',
    roleTitle: 'Engenheiro de Manutenção Predial',
    department: 'Manutenção & Engenharia',
    nrCertifications: ['NR-10', 'NR-35', 'NR-33', 'CREA-SP'],
    status: 'ATIVO',
    assignedUnitIds: ['unit-01', 'unit-02'],
    assignedUnitNames: ['Torre Berrini', 'Hub Faria Lima'],
    createdAt: '2025-01-20T08:00:00Z'
  },
  {
    id: 'colab-02',
    name: 'Juliana Camargo',
    cpf: '234.567.890-11',
    email: 'juliana.camargo@facilitiescorp.com.br',
    phone: '(11) 97234-5678',
    roleTitle: 'Supervisora de Operations & Cleanliness',
    department: 'Hard & Soft Services',
    nrCertifications: ['NR-06', 'ISO 9001 Lead Auditor'],
    status: 'ATIVO',
    assignedUnitIds: ['unit-03'],
    assignedUnitNames: ['Sede Paulista'],
    createdAt: '2025-02-01T09:00:00Z'
  },
  {
    id: 'colab-03',
    name: 'Thiago Alcantara',
    cpf: '345.678.901-22',
    email: 'thiago.alcantara@facilitiescorp.com.br',
    phone: '(19) 96345-6789',
    roleTitle: 'Técnico Eletricista Sênior',
    department: 'Manutenção Elétrica',
    nrCertifications: ['NR-10 Sep', 'NR-35', 'SEP'],
    status: 'ATIVO',
    assignedUnitIds: ['unit-01', 'unit-04'],
    assignedUnitNames: ['Torre Berrini', 'CD Viracopos'],
    createdAt: '2025-03-10T10:00:00Z'
  }
];

export const INITIAL_SUPPLIERS: Supplier[] = [
  {
    id: 'sup-01',
    corporateName: 'CLIMA TECH REFRIGERACAO E AR CONDICIONADO LTDA',
    fantasyName: 'ClimaTech HVAC',
    cnpj: '11.222.333/0001-44',
    category: 'AR_CONDICIONADO',
    rating: 4.9,
    slaPerformancePct: 98.5,
    status: 'HOMOLOGADO',
    contactEmail: 'atendimento@climatech.com.br',
    phone: '(11) 3344-5566',
    activeContractsCount: 4,
    certificationsValidUntil: '2027-01-15'
  },
  {
    id: 'sup-02',
    corporateName: 'ENGELUZ ENGENHARIA ELETRICA & ENERGIA S.A.',
    fantasyName: 'Engeluz Elétrica',
    cnpj: '22.333.444/0001-55',
    category: 'ELETIRCA',
    rating: 4.8,
    slaPerformancePct: 96.2,
    status: 'HOMOLOGADO',
    contactEmail: 'comercial@engeluz.com.br',
    phone: '(11) 2211-4433',
    activeContractsCount: 6,
    certificationsValidUntil: '2026-12-31'
  },
  {
    id: 'sup-03',
    corporateName: 'OTIS ELEVADORES E ESCADAS ROLANTES LTDA',
    fantasyName: 'Otis Elevadores',
    cnpj: '60.555.777/0001-99',
    category: 'ELEVADORES',
    rating: 5.0,
    slaPerformancePct: 99.1,
    status: 'HOMOLOGADO',
    contactEmail: 'suporte@otis.com.br',
    phone: '0800-707-6847',
    activeContractsCount: 3,
    certificationsValidUntil: '2028-06-30'
  },
  {
    id: 'sup-04',
    corporateName: 'SERVCLEAN SERVICOS TERCEIRIZADOS E HIGIENIZACAO',
    fantasyName: 'ServClean Facilities',
    cnpj: '77.888.999/0001-11',
    category: 'LIMPEZA',
    rating: 4.4,
    slaPerformancePct: 92.0,
    status: 'HOMOLOGADO',
    contactEmail: 'operacoes@servclean.com.br',
    phone: '(11) 4003-2211',
    activeContractsCount: 2,
    certificationsValidUntil: '2026-10-15'
  }
];

export const INITIAL_COMPLIANCE_DOCS: ComplianceDoc[] = [
  {
    id: 'doc-01',
    title: 'Laudo Técnico de Inspeção das Instalações Elétricas (NR-10)',
    code: 'REG-NR10-2026-01',
    category: 'REGULATORIO',
    version: 'v2.1',
    validUntil: '2027-03-30',
    status: 'ATIVO',
    requiredForRoles: ['ADMIN', 'OPERACIONAL'],
    createdBy: 'Eng. Marcelo Pires (CREA-SP 50698123)',
    createdAt: '2026-01-15T10:00:00Z'
  },
  {
    id: 'doc-02',
    title: 'Auto de Vistoria do Corpo de Bombeiros (AVCB) - Torre Berrini',
    code: 'AVCB-SP-2026-88',
    category: 'LICENCA',
    version: 'v1.0',
    validUntil: '2027-08-10',
    status: 'ATIVO',
    requiredForRoles: ['ADMIN', 'OPERACIONAL', 'CLIENTE'],
    createdBy: 'Corpo de Bombeiros SP',
    createdAt: '2025-08-10T14:00:00Z'
  },
  {
    id: 'doc-03',
    title: 'PMOC - Plano de Manutenção, Operação e Controle de Ar Condicionado',
    code: 'PMOC-HVAC-2026',
    category: 'REGULATORIO',
    version: 'v3.0',
    validUntil: '2026-11-20',
    status: 'ATIVO',
    requiredForRoles: ['ADMIN', 'OPERACIONAL'],
    createdBy: 'ClimaTech HVAC (Resp. Técnico)',
    createdAt: '2026-02-01T09:30:00Z'
  },
  {
    id: 'doc-04',
    title: 'Termo de Aceite do Regulamento de Governança e Segurança Operacional v2026',
    code: 'GOV-TERM-2026',
    category: 'SOP',
    version: 'v2026.1',
    validUntil: '2027-12-31',
    status: 'ATIVO',
    requiredForRoles: ['ADMIN', 'OPERACIONAL', 'CLIENTE'],
    createdBy: 'Dept. Jurídico & Compliance Corporativo',
    createdAt: '2026-01-02T08:00:00Z'
  }
];

export const INITIAL_TERM_ACCEPTANCES: TermAcceptance[] = [
  {
    id: 'ta-001',
    userId: 'u-admin-01',
    userName: 'Carlos Silva',
    userEmail: 'admin@facilitiescorp.com.br',
    userRole: 'ADMIN',
    termVersion: 'v2026.1',
    acceptedAt: '2026-01-10T09:12:00Z',
    ipAddress: '189.120.44.102',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/122.0'
  },
  {
    id: 'ta-002',
    userId: 'u-op-01',
    userName: 'Fernanda Oliveira',
    userEmail: 'f.oliveira@facilitiescorp.com.br',
    userRole: 'OPERACIONAL',
    termVersion: 'v2026.1',
    acceptedAt: '2026-02-01T11:00:00Z',
    ipAddress: '201.88.19.45',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Safari/17.2'
  },
  {
    id: 'ta-003',
    userId: 'u-cli-01',
    userName: 'Roberto Santos',
    userEmail: 'roberto@techcorp.com.br',
    userRole: 'CLIENTE',
    termVersion: 'v2026.1',
    acceptedAt: '2026-03-15T14:30:00Z',
    ipAddress: '177.34.88.12',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_3 like Mac OS X) Mobile'
  }
];

export const INITIAL_FACILITY_TICKETS: FacilityTicket[] = [
  {
    id: 'tkt-001',
    code: 'CHM-2026-045',
    title: 'Falha no Chiller Principal do Bloco B - Unidade Berrini',
    description: 'Temperatura no 18º andar subindo para 26°C. Necessário atendimento emergencial do contrato HVAC.',
    category: 'EMERGENCIAL',
    unitId: 'unit-01',
    unitName: 'Torre Berrini - Centro de Inovação',
    locationArea: 'Casa de Máquinas 18º Andar - Bloco B',
    priority: 'CRITICA',
    status: 'EM_ANDAMENTO',
    requesterId: 'u-cli-01',
    requesterName: 'Roberto Santos',
    assignedToId: 'colab-01',
    assignedToName: 'Marcelo Pires (ClimaTech HVAC)',
    assetId: 'ast-001',
    assetName: 'Chiller Parafuso Carrier 30XW 150 TR',
    requiredSkillCategory: 'AR_CONDICIONADO',
    estimatedCost: 3800.00,
    actualCost: 3500.00,
    costApprovalStatus: 'APROVADO',
    approvalThresholdLimit: 1500.00,
    timelineEvents: [
      { id: 'tl-1', timestamp: '2026-08-03T14:10:00Z', title: 'Chamado Emergencial Criado', description: 'Registrado via Portal do Cliente por Roberto Santos.', authorName: 'Roberto Santos', type: 'CREATED' },
      { id: 'tl-2', timestamp: '2026-08-03T14:15:00Z', title: 'Atribuição Inteligente de Especialidade', description: 'Sistema direcionou automaticamente para contrato ClimaTech HVAC.', authorName: 'Motor de Roteamento', type: 'ASSIGNED' },
      { id: 'tl-3', timestamp: '2026-08-03T15:00:00Z', title: 'Orçamento & Aprovação de Alçada', description: 'Custo estimado de R$ 3.800,00 aprovado por Alçada Gerencial.', authorName: 'Carlos Silva (ADMIN)', type: 'COST_APPROVAL' },
      { id: 'tl-4', timestamp: '2026-08-03T16:30:00Z', title: 'Em Execução no Local', description: 'Substituição do sensor de pressão de descarga do compressor.', authorName: 'Marcelo Pires', type: 'STATUS_CHANGE' }
    ],
    slaHours: 2,
    slaExpiresAt: '2026-08-03T20:00:00Z',
    createdAt: '2026-08-03T14:10:00Z',
    updatedAt: '2026-08-03T16:30:00Z'
  },
  {
    id: 'tkt-002',
    code: 'CHM-2026-044',
    title: 'Manutenção Preventiva de No-Breaks e Gerador',
    description: 'Execução do protocolo trimestral de teste com carga e inspeção de banco de baterias.',
    category: 'PREVENTIVA',
    unitId: 'unit-03',
    unitName: 'Sede Paulista - Edifício Corporate',
    locationArea: 'Subsolo 2 - Sala TÉCNICA 04',
    priority: 'MEDIA',
    status: 'AGUARDANDO_PECAS',
    requesterId: 'u-op-01',
    requesterName: 'Fernanda Oliveira',
    assignedToId: 'colab-03',
    assignedToName: 'Thiago Alcantara',
    assetId: 'ast-002',
    assetName: 'Grupo Gerador STEMAC 500 kVA CUMMINS',
    requiredSkillCategory: 'ELETIRCA',
    estimatedCost: 1200.00,
    actualCost: 1100.00,
    costApprovalStatus: 'NAO_REQUERIDO',
    approvalThresholdLimit: 1500.00,
    timelineEvents: [
      { id: 'tl-201', timestamp: '2026-08-03T10:00:00Z', title: 'Ordem de Serviço Gerada via PMOC', description: 'Plano preventivo recorrente ativado pelo sistema.', authorName: 'Agendador PMOC', type: 'CREATED' },
      { id: 'tl-202', timestamp: '2026-08-03T11:00:00Z', title: 'Técnico Especialista Atribuído', description: 'Thiago Alcantara (NR-10 / SEP).', authorName: 'Fernanda Oliveira', type: 'ASSIGNED' },
      { id: 'tl-203', timestamp: '2026-08-03T15:00:00Z', title: 'Solicitada Bateria Selada 12V 100Ah', description: 'Aguardando entrega de peças do fornecedor.', authorName: 'Thiago Alcantara', type: 'STATUS_CHANGE' }
    ],
    slaHours: 24,
    slaExpiresAt: '2026-08-04T10:00:00Z',
    createdAt: '2026-08-03T10:00:00Z',
    updatedAt: '2026-08-03T15:00:00Z'
  },
  {
    id: 'tkt-003',
    code: 'CHM-2026-043',
    title: 'Troca de Iluminação Fluorescente por LED no Hub Faria Lima',
    description: 'Adequação de iluminação para padrão de eficiência energética ISO 50001.',
    category: 'MELHORIA',
    unitId: 'unit-02',
    unitName: 'Hub Faria Lima - Agência Digital',
    locationArea: 'Open Space 5º Andar',
    priority: 'BAIXA',
    status: 'AGUARDANDO_APROVACAO',
    requesterId: 'u-cli-01',
    requesterName: 'Roberto Santos',
    assetId: 'ast-003',
    assetName: 'Subestação Abrigada Aroeira 13.8kV',
    requiredSkillCategory: 'ELETIRCA',
    estimatedCost: 2850.00,
    costApprovalStatus: 'PENDENTE',
    approvalThresholdLimit: 1500.00,
    timelineEvents: [
      { id: 'tl-301', timestamp: '2026-08-03T12:00:00Z', title: 'Solicitação de Retrofit de LED', description: 'Iniciada pelo cliente para redução de consumo elétrico.', authorName: 'Roberto Santos', type: 'CREATED' },
      { id: 'tl-302', timestamp: '2026-08-03T12:05:00Z', title: 'Alçada Excedida - Aguardando Aprovação', description: 'Valor estimado de R$ 2.850,00 excede o limite automático de R$ 1.500,00.', authorName: 'Motor de Custos', type: 'COST_APPROVAL' }
    ],
    slaHours: 48,
    slaExpiresAt: '2026-08-05T12:00:00Z',
    createdAt: '2026-08-03T12:00:00Z',
    updatedAt: '2026-08-03T12:00:00Z'
  },
  {
    id: 'tkt-004',
    code: 'CHM-2026-041',
    title: 'Vazamento no Sanitário Acessível - 22º Andar Paulista',
    description: 'Substituição da válvula de descarga automática e calafetagem de cuba.',
    category: 'CORRETIVA',
    unitId: 'unit-03',
    unitName: 'Sede Paulista - Edifício Corporate',
    locationArea: 'Banheiro PCD 22º Andar',
    priority: 'ALTA',
    status: 'CONCLUIDO',
    requesterId: 'u-op-01',
    requesterName: 'Fernanda Oliveira',
    assignedToId: 'colab-02',
    assignedToName: 'Juliana Camargo',
    requiredSkillCategory: 'CIVIL',
    estimatedCost: 650.00,
    actualCost: 620.00,
    costApprovalStatus: 'NAO_REQUERIDO',
    approvalThresholdLimit: 1500.00,
    timelineEvents: [
      { id: 'tl-401', timestamp: '2026-08-02T09:00:00Z', title: 'Chamado Aberto', description: 'Identificado vazamento em rotina de vistoria.', authorName: 'Fernanda Oliveira', type: 'CREATED' },
      { id: 'tl-402', timestamp: '2026-08-02T10:00:00Z', title: 'Atribuição Técnica', description: 'Encaminhado para a equipe de civil e hidráulica.', authorName: 'Fernanda Oliveira', type: 'ASSIGNED' },
      { id: 'tl-403', timestamp: '2026-08-02T14:00:00Z', title: 'Inspeção Final & Teste de Estanqueidade', description: 'Serviço executado com êxito.', authorName: 'Juliana Camargo', type: 'INSPECTION' },
      { id: 'tl-404', timestamp: '2026-08-02T15:30:00Z', title: 'Chamado Concluído', description: 'Baixa efetuada e aprovada.', authorName: 'Juliana Camargo', type: 'COMPLETED' }
    ],
    npsFeedback: {
      score: 10,
      comment: 'Atendimento extremamente rápido e ambiente deixado impecavelmente limpo!',
      csatTags: ['Pontualidade', 'Qualidade Técnica', 'Limpeza'],
      createdAt: '2026-08-02T16:00:00Z'
    },
    slaHours: 8,
    slaExpiresAt: '2026-08-02T18:00:00Z',
    createdAt: '2026-08-02T09:00:00Z',
    updatedAt: '2026-08-02T15:30:00Z'
  }
];

export function getSystemStats(tickets: FacilityTicket[], docs: ComplianceDoc[]): SystemStats {
  const totalTickets = tickets.length;
  const openTickets = tickets.filter(t => t.status === 'NOVO').length;
  const inProgressTickets = tickets.filter(t => t.status === 'EM_ANDAMENTO' || t.status === 'AGUARDANDO_PECAS').length;
  const criticalTickets = tickets.filter(t => t.priority === 'CRITICA' && t.status !== 'CONCLUIDO').length;
  const pendingApprovalsCount = tickets.filter(t => t.status === 'AGUARDANDO_APROVACAO' || t.costApprovalStatus === 'PENDENTE').length;

  const completedOrOnTime = tickets.filter(t => t.status === 'CONCLUIDO' || new Date(t.slaExpiresAt) > new Date()).length;
  const slaCompliancePct = totalTickets > 0 ? Math.round((completedOrOnTime / totalTickets) * 100) : 100;
  
  const activeDocs = docs.filter(d => d.status === 'ATIVO').length;
  const overallCompliancePct = docs.length > 0 ? Math.round((activeDocs / docs.length) * 100) : 100;

  return {
    totalTickets,
    openTickets,
    inProgressTickets,
    criticalTickets,
    slaCompliancePct,
    overallCompliancePct,
    activeUnits: INITIAL_UNITS.length,
    activeCollaborators: INITIAL_COLLABORATORS.length,
    homologatedSuppliers: INITIAL_SUPPLIERS.filter(s => s.status === 'HOMOLOGADO').length,
    recentAuditCount: INITIAL_AUDIT_LOGS.length,
    totalAssetsCount: INITIAL_ASSETS.length,
    activePmocPlansCount: INITIAL_MAINTENANCE_PLANS.length,
    pendingApprovalsCount
  };
}
