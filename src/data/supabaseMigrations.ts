export const SUPABASE_SQL_MIGRATION = `-- ====================================================================
-- ECOSSISTEMA CENTRAL DE FACILITIES E GESTÃO CORPORATIVA
-- SCRIPT DE MIGRAÇÃO INICIAL (POSTGRESQL / SUPABASE) - FASE 1
-- SECURITY-FIRST: ROW LEVEL SECURITY (RLS), RBAC & TRILHA DE AUDITORIA
-- ====================================================================

-- 1. EXTENSÕES BÁSICAS DE SEGURANÇA E UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. TIPOS ENUM PERSONALIZADOS
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('ADMIN', 'OPERACIONAL', 'CLIENTE');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE ticket_priority AS ENUM ('BAIXA', 'MEDIA', 'ALTA', 'CRITICA');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE ticket_status AS ENUM ('NOVO', 'EM_ANDAMENTO', 'AGUARDANDO_PECAS', 'CONCLUIDO', 'CANCELADO');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE doc_type AS ENUM ('REGULATORIO', 'AUDITORIA', 'CONTRATO', 'LICENCA', 'SOP');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE doc_status AS ENUM ('ATIVO', 'PENDENTE', 'EXPIRADO');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- 3. TABELA DE TENANTS (MULTI-TENANCY CORPORATIVO)
CREATE TABLE IF NOT EXISTS public.tenants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    cnpj VARCHAR(20) UNIQUE NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'ATIVO',
    plan VARCHAR(50) NOT NULL DEFAULT 'ENTERPRISE',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. TABELA DE PERFIS DE USUÁRIOS (INTEGRADO AO AUTH DO SUPABASE)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL REFERENCES public.tenants(id),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role user_role NOT NULL DEFAULT 'OPERACIONAL',
    avatar_url TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'ATIVO',
    permissions JSONB DEFAULT '[]'::jsonb,
    term_accepted BOOLEAN DEFAULT FALSE,
    term_accepted_at TIMESTAMPTZ,
    last_login TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. TABELA DE TRILHA DE AUDITORIA (AUDIT LOGS - GOVERNANÇA E COMPLIANCE)
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    user_name VARCHAR(255),
    user_role user_role,
    tenant_id UUID REFERENCES public.tenants(id),
    action VARCHAR(50) NOT NULL, -- 'CREATE', 'UPDATE', 'DELETE', 'AUTH_LOGIN', 'TERM_ACCEPT'
    entity VARCHAR(50) NOT NULL, -- 'USUARIO', 'CLIENTE', 'UNIDADE', 'CHAMADO', etc.
    entity_id VARCHAR(255),
    details TEXT,
    ip_address VARCHAR(45),
    integrity_hash VARCHAR(64) NOT NULL
);

-- 6. TABELA DE CLIENTES BASE
CREATE TABLE IF NOT EXISTS public.clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    corporate_name VARCHAR(255) NOT NULL,
    fantasy_name VARCHAR(255),
    cnpj VARCHAR(20) NOT NULL,
    contact_email VARCHAR(255),
    contact_phone VARCHAR(50),
    status VARCHAR(20) DEFAULT 'ATIVO',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. TABELA DE UNIDADES E LOCAIS DE ATENDIMENTO
CREATE TABLE IF NOT EXISTS public.units (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(10) NOT NULL,
    postal_code VARCHAR(20),
    manager_name VARCHAR(255),
    contact_phone VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. TABELA DE COLABORADORES E CERTIFICAÇÕES (EQUIPE OPERACIONAL)
CREATE TABLE IF NOT EXISTS public.collaborators (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    cpf VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50),
    role_title VARCHAR(150) NOT NULL,
    department VARCHAR(150),
    nr_certifications JSONB DEFAULT '[]'::jsonb, -- e.g., ["NR-10", "NR-35"]
    status VARCHAR(20) DEFAULT 'ATIVO',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. TABELA DE FORNECEDORES TERCEIRIZADOS (FACILITIES & SLA)
CREATE TABLE IF NOT EXISTS public.suppliers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    corporate_name VARCHAR(255) NOT NULL,
    fantasy_name VARCHAR(255),
    cnpj VARCHAR(20) UNIQUE NOT NULL,
    category VARCHAR(100) NOT NULL,
    rating NUMERIC(3,2) DEFAULT 5.0,
    sla_performance_pct NUMERIC(5,2) DEFAULT 100.0,
    status VARCHAR(20) DEFAULT 'HOMOLOGADO',
    contact_email VARCHAR(255),
    phone VARCHAR(50),
    certifications_valid_until DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. TABELA DE DOCUMENTOS DE COMPLIANCE E REGULATÓRIOS
CREATE TABLE IF NOT EXISTS public.compliance_docs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    code VARCHAR(100) UNIQUE NOT NULL,
    category doc_type NOT NULL,
    version VARCHAR(20) DEFAULT 'v1.0',
    valid_until DATE NOT NULL,
    status doc_status DEFAULT 'ATIVO',
    required_for_roles JSONB DEFAULT '["ADMIN", "OPERACIONAL"]'::jsonb,
    created_by VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. TABELA DE TERMOS DE ACEITE DIGITAIS
CREATE TABLE IF NOT EXISTS public.term_acceptances (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id),
    user_name VARCHAR(255) NOT NULL,
    user_email VARCHAR(255) NOT NULL,
    user_role user_role NOT NULL,
    term_version VARCHAR(50) NOT NULL,
    accepted_at TIMESTAMPTZ DEFAULT NOW(),
    ip_address VARCHAR(45),
    user_agent TEXT
);

-- 12. TABELA DE CHAMADOS / DEMANDAS DE FACILITIES
CREATE TABLE IF NOT EXISTS public.facility_tickets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    code VARCHAR(50) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(50) NOT NULL, -- 'PREVENTIVA', 'CORRETIVA', etc.
    unit_id UUID NOT NULL REFERENCES public.units(id),
    location_area VARCHAR(255),
    priority ticket_priority NOT NULL DEFAULT 'MEDIA',
    status ticket_status NOT NULL DEFAULT 'NOVO',
    requester_id UUID REFERENCES public.profiles(id),
    requester_name VARCHAR(255),
    assigned_to_id UUID REFERENCES public.collaborators(id),
    assigned_to_name VARCHAR(255),
    sla_hours INT NOT NULL DEFAULT 24,
    sla_expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. REGISTRO DE POLÍTICAS DE RLS (ROW LEVEL SECURITY)
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.units ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collaborators ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compliance_docs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.term_acceptances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.facility_tickets ENABLE ROW LEVEL SECURITY;

-- Política Genérica de Isolamento por Tenant:
CREATE POLICY tenant_isolation_policy_profiles ON public.profiles
    FOR ALL USING (tenant_id = (SELECT tenant_id FROM public.profiles WHERE id = auth.uid()));

CREATE POLICY tenant_isolation_policy_tickets ON public.facility_tickets
    FOR ALL USING (tenant_id = (SELECT tenant_id FROM public.profiles WHERE id = auth.uid()));

CREATE POLICY tenant_isolation_policy_audit ON public.audit_logs
    FOR SELECT USING (tenant_id = (SELECT tenant_id FROM public.profiles WHERE id = auth.uid()));

-- 14. FUNÇÃO E TRIGGER PARA AUDITORIA AUTOMÁTICA EM MUDANÇAS
CREATE OR REPLACE FUNCTION log_audit_trigger()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.audit_logs (
        user_id,
        user_name,
        action,
        entity,
        entity_id,
        details,
        integrity_hash
    ) VALUES (
        auth.uid(),
        'SISTEMA_AUTO',
        TG_OP,
        TG_TABLE_NAME,
        COALESCE(NEW.id, OLD.id)::text,
        'Operação automática disparada por banco de dados',
        encode(digest(concat(NOW(), TG_OP, TG_TABLE_NAME), 'sha256'), 'hex')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Disparador no cadastro de chamados
CREATE OR REPLACE TRIGGER trigger_audit_facility_tickets
    AFTER INSERT OR UPDATE OR DELETE ON public.facility_tickets
    FOR EACH ROW EXECUTE FUNCTION log_audit_trigger();

-- FIM DA MIGRAÇÃO FASE 1
`;

export interface SchemaTableInfo {
  tableName: string;
  description: string;
  columnsCount: number;
  hasRLS: boolean;
  sampleColumns: string[];
}

export const SCHEMA_TABLES_SUMMARY: SchemaTableInfo[] = [
  {
    tableName: 'public.tenants',
    description: 'Empresas contratantes e isolamento do ecossistema corporativo (Multi-Tenancy).',
    columnsCount: 7,
    hasRLS: true,
    sampleColumns: ['id', 'name', 'cnpj', 'status', 'plan', 'created_at']
  },
  {
    tableName: 'public.profiles',
    description: 'Perfis de acesso estendidos com RBAC (ADMIN, OPERACIONAL, CLIENTE).',
    columnsCount: 12,
    hasRLS: true,
    sampleColumns: ['id', 'tenant_id', 'name', 'email', 'role', 'permissions', 'term_accepted']
  },
  {
    tableName: 'public.audit_logs',
    description: 'Trilha de auditoria imutável com hash SHA-256 para compliance e governança.',
    columnsCount: 12,
    hasRLS: true,
    sampleColumns: ['id', 'timestamp', 'user_id', 'action', 'entity', 'details', 'integrity_hash']
  },
  {
    tableName: 'public.clients',
    description: 'Cadastro de clientes corporativos atrelados às unidades operacionais.',
    columnsCount: 8,
    hasRLS: true,
    sampleColumns: ['id', 'tenant_id', 'corporate_name', 'cnpj', 'contact_email', 'status']
  },
  {
    tableName: 'public.units',
    description: 'Edifícios, prédios e locais de atendimento de Facilities.',
    columnsCount: 11,
    hasRLS: true,
    sampleColumns: ['id', 'client_id', 'name', 'code', 'address', 'city', 'manager_name']
  },
  {
    tableName: 'public.collaborators',
    description: 'Equipe técnica própria com registro de certificações obrigatórias (NR-10/NR-35).',
    columnsCount: 10,
    hasRLS: true,
    sampleColumns: ['id', 'name', 'cpf', 'role_title', 'nr_certifications', 'status']
  },
  {
    tableName: 'public.suppliers',
    description: 'Fornecedores e parceiros terceirizados homologados com métricas de SLA.',
    columnsCount: 11,
    hasRLS: true,
    sampleColumns: ['id', 'corporate_name', 'cnpj', 'category', 'sla_performance_pct', 'status']
  },
  {
    tableName: 'public.compliance_docs',
    description: 'Repositório de documentos regulatórios (AVCB, PMOC, Laudos) e validades.',
    columnsCount: 10,
    hasRLS: true,
    sampleColumns: ['id', 'title', 'code', 'category', 'valid_until', 'status']
  },
  {
    tableName: 'public.term_acceptances',
    description: 'Registro probatório de aceite de Termos de Governança e LGPD.',
    columnsCount: 9,
    hasRLS: true,
    sampleColumns: ['id', 'user_id', 'term_version', 'accepted_at', 'ip_address', 'user_agent']
  },
  {
    tableName: 'public.facility_tickets',
    description: 'Gestão de demandas e chamados operacionais de Facilities com controle de SLA.',
    columnsCount: 16,
    hasRLS: true,
    sampleColumns: ['id', 'code', 'title', 'priority', 'status', 'sla_hours', 'sla_expires_at']
  }
];
