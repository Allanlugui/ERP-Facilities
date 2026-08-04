import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar, ActiveTab } from './components/Sidebar';
import { CentralDashboard } from './components/CentralDashboard';
import { RoleManagement } from './components/RoleManagement';
import { ComplianceModule } from './components/ComplianceModule';
import { CadastrosHub } from './components/CadastrosHub';
import { FacilitiesTickets } from './components/FacilitiesTickets';
import { EAMAssetsModule } from './components/EAMAssetsModule';
import { ClientTenantPortal } from './components/ClientTenantPortal';
import { ExecutiveBIDashboard } from './components/ExecutiveBIDashboard';
import { DatabaseSQLViewer } from './components/DatabaseSQLViewer';
import { TermAcceptanceModal } from './components/TermAcceptanceModal';
import { NewTicketModal } from './components/NewTicketModal';

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
  UserRole,
  TicketStatus,
  Asset,
  MaintenancePlan,
  BiMetrics,
  NpsFeedback
} from './types';

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
} from './data/mockData';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User>(INITIAL_USERS[0]);
  const [tenants, setTenants] = useState<Tenant[]>(INITIAL_TENANTS);
  const [activeTenant, setActiveTenant] = useState<Tenant>(INITIAL_TENANTS[0]);

  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');

  // Application Data State
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);
  const [clients, setClients] = useState<Client[]>(INITIAL_CLIENTS);
  const [units, setUnits] = useState<Unit[]>(INITIAL_UNITS);
  const [collaborators, setCollaborators] = useState<Collaborator[]>(INITIAL_COLLABORATORS);
  const [suppliers, setSuppliers] = useState<Supplier[]>(INITIAL_SUPPLIERS);
  const [complianceDocs, setComplianceDocs] = useState<ComplianceDoc[]>(INITIAL_COMPLIANCE_DOCS);
  const [termAcceptances, setTermAcceptances] = useState<TermAcceptance[]>(INITIAL_TERM_ACCEPTANCES);
  const [tickets, setTickets] = useState<FacilityTicket[]>(INITIAL_FACILITY_TICKETS);
  const [assets, setAssets] = useState<Asset[]>(INITIAL_ASSETS);
  const [maintenancePlans, setMaintenancePlans] = useState<MaintenancePlan[]>(INITIAL_MAINTENANCE_PLANS);
  const [biMetrics, setBiMetrics] = useState<BiMetrics>(INITIAL_BI_METRICS);

  // Modals
  const [isTermModalOpen, setIsTermModalOpen] = useState(false);
  const [isNewTicketModalOpen, setIsNewTicketModalOpen] = useState(false);

  // Fetch API endpoints on mount
  useEffect(() => {
    fetch('/api/facilities/chamados')
      .then(res => res.ok ? res.json() : null)
      .then(data => { if (data) setTickets(data); })
      .catch(() => {});

    fetch('/api/eam/assets')
      .then(res => res.ok ? res.json() : null)
      .then(data => { if (data) setAssets(data); })
      .catch(() => {});

    fetch('/api/eam/plans')
      .then(res => res.ok ? res.json() : null)
      .then(data => { if (data) setMaintenancePlans(data); })
      .catch(() => {});

    fetch('/api/bi/metrics')
      .then(res => res.ok ? res.json() : null)
      .then(data => { if (data) setBiMetrics(data); })
      .catch(() => {});

    fetch('/api/audit-logs')
      .then(res => res.ok ? res.json() : null)
      .then(data => { if (data) setAuditLogs(data); })
      .catch(() => {});

    fetch('/api/compliance/docs')
      .then(res => res.ok ? res.json() : null)
      .then(data => { if (data) setComplianceDocs(data); })
      .catch(() => {});
  }, []);

  const stats: SystemStats = getSystemStats(tickets, complianceDocs);

  // Handlers
  const handleSwitchUserRole = (role: UserRole) => {
    const matchingUser = users.find(u => u.role === role) || {
      ...currentUser,
      role
    };
    setCurrentUser(matchingUser);
  };

  const handleSwitchTenant = (tenantId: string) => {
    const found = tenants.find(t => t.id === tenantId);
    if (found) {
      setActiveTenant(found);
      setCurrentUser(prev => ({ ...prev, tenantId: found.id, tenantName: found.name }));
    }
  };

  const handleAcceptTerm = async (userId: string, termVersion: string) => {
    try {
      const res = await fetch('/api/auth/accept-term', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, termVersion })
      });
      if (res.ok) {
        const data = await res.json();
        setCurrentUser(data.user);
        setUsers(prev => prev.map(u => u.id === userId ? data.user : u));
        setTermAcceptances(prev => [data.acceptance, ...prev]);
        
        // Refresh audit logs
        const logsRes = await fetch('/api/audit-logs');
        if (logsRes.ok) {
          const logsData = await logsRes.json();
          setAuditLogs(logsData);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateTicket = async (ticketData: any) => {
    try {
      const res = await fetch('/api/facilities/chamados', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ticketData)
      });
      if (res.ok) {
        const newTicket = await res.json();
        setTickets(prev => [newTicket, ...prev]);

        // Refresh audit logs
        const logsRes = await fetch('/api/audit-logs');
        if (logsRes.ok) {
          const logsData = await logsRes.json();
          setAuditLogs(logsData);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateTicketStatus = async (
    id: string,
    status: TicketStatus,
    assignedToId?: string,
    assignedToName?: string
  ) => {
    try {
      const res = await fetch(`/api/facilities/chamados/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, assignedToId, assignedToName })
      });
      if (res.ok) {
        const updated = await res.json();
        setTickets(prev => prev.map(t => t.id === id ? updated : t));

        // Refresh audit logs
        const logsRes = await fetch('/api/audit-logs');
        if (logsRes.ok) {
          const logsData = await logsRes.json();
          setAuditLogs(logsData);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddUser = (userData: Partial<User>) => {
    const newUserObj: User = {
      id: `u-${Date.now()}`,
      name: userData.name || 'Novo Usuário',
      email: userData.email || 'usuario@empresa.com.br',
      role: userData.role || 'OPERACIONAL',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      tenantId: activeTenant.id,
      tenantName: activeTenant.name,
      status: 'ATIVO',
      permissions: ['TICKETS_MANAGE'],
      lastLogin: new Date().toISOString(),
      termAccepted: false,
      createdAt: new Date().toISOString()
    };
    setUsers(prev => [newUserObj, ...prev]);
  };

  const handleAddComplianceDoc = async (docData: Partial<ComplianceDoc>) => {
    try {
      const res = await fetch('/api/compliance/docs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(docData)
      });
      if (res.ok) {
        const newDoc = await res.json();
        setComplianceDocs(prev => [newDoc, ...prev]);

        const logsRes = await fetch('/api/audit-logs');
        if (logsRes.ok) {
          const logsData = await logsRes.json();
          setAuditLogs(logsData);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddClient = async (clientData: Partial<Client>) => {
    try {
      const res = await fetch('/api/cadastros/clientes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(clientData)
      });
      if (res.ok) {
        const newClient = await res.json();
        setClients(prev => [newClient, ...prev]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddUnit = async (unitData: Partial<Unit>) => {
    try {
      const res = await fetch('/api/cadastros/unidades', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(unitData)
      });
      if (res.ok) {
        const newUnit = await res.json();
        setUnits(prev => [newUnit, ...prev]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddCollaborator = async (colabData: Partial<Collaborator>) => {
    try {
      const res = await fetch('/api/cadastros/colaboradores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(colabData)
      });
      if (res.ok) {
        const newColab = await res.json();
        setCollaborators(prev => [newColab, ...prev]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddSupplier = async (supplierData: Partial<Supplier>) => {
    try {
      const res = await fetch('/api/cadastros/fornecedores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(supplierData)
      });
      if (res.ok) {
        const newSupplier = await res.json();
        setSuppliers(prev => [newSupplier, ...prev]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddAsset = async (assetData: Partial<Asset>) => {
    try {
      const res = await fetch('/api/eam/assets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(assetData)
      });
      if (res.ok) {
        const newAsset = await res.json();
        setAssets(prev => [newAsset, ...prev]);

        const logsRes = await fetch('/api/audit-logs');
        if (logsRes.ok) setAuditLogs(await logsRes.json());
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateAsset = async (id: string, assetData: Partial<Asset>, auditJustification?: string) => {
    try {
      const res = await fetch(`/api/eam/assets/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...assetData, auditJustification })
      });
      if (res.ok) {
        const updatedAsset = await res.json();
        setAssets(prev => prev.map(a => a.id === id ? updatedAsset : a));

        const logsRes = await fetch('/api/audit-logs');
        if (logsRes.ok) setAuditLogs(await logsRes.json());
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteAsset = async (id: string, reason: string) => {
    try {
      const res = await fetch(`/api/eam/assets/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason })
      });
      if (res.ok) {
        setAssets(prev => prev.filter(a => a.id !== id));

        const logsRes = await fetch('/api/audit-logs');
        if (logsRes.ok) setAuditLogs(await logsRes.json());
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddPlan = async (planData: Partial<MaintenancePlan>) => {
    try {
      const res = await fetch('/api/eam/plans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(planData)
      });
      if (res.ok) {
        const newPlan = await res.json();
        setMaintenancePlans(prev => [newPlan, ...prev]);

        const logsRes = await fetch('/api/audit-logs');
        if (logsRes.ok) setAuditLogs(await logsRes.json());
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleApproveCost = async (ticketId: string, approved: boolean, comment?: string) => {
    try {
      const res = await fetch(`/api/facilities/chamados/${ticketId}/approve-cost`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ approved, approvedBy: currentUser.name, comment })
      });
      if (res.ok) {
        const updated = await res.json();
        setTickets(prev => prev.map(t => t.id === ticketId ? updated : t));

        const logsRes = await fetch('/api/audit-logs');
        if (logsRes.ok) setAuditLogs(await logsRes.json());
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmitNps = async (ticketId: string, nps: NpsFeedback) => {
    try {
      const res = await fetch(`/api/facilities/chamados/${ticketId}/nps`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nps)
      });
      if (res.ok) {
        const updated = await res.json();
        setTickets(prev => prev.map(t => t.id === ticketId ? updated : t));

        const logsRes = await fetch('/api/audit-logs');
        if (logsRes.ok) setAuditLogs(await logsRes.json());
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col antialiased">
      
      {/* Top Navbar Header */}
      <Navbar
        currentUser={currentUser}
        tenants={tenants}
        activeTenant={activeTenant}
        auditLogs={auditLogs}
        onSwitchUserRole={handleSwitchUserRole}
        onSwitchTenant={handleSwitchTenant}
        onOpenTermModal={() => setIsTermModalOpen(true)}
      />

      {/* Main Body Area: Sidebar + Active Module */}
      <div className="flex flex-1 overflow-hidden">
        
        <Sidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          userRole={currentUser.role}
          openTicketsCount={tickets.filter(t => t.status === 'NOVO' || t.status === 'EM_ANDAMENTO').length}
          pendingDocsCount={complianceDocs.filter(d => d.status === 'PENDENTE').length}
        />

        {/* Content Panel */}
        <main className="flex-1 overflow-y-auto bg-slate-50">
          
          {activeTab === 'dashboard' && (
            <CentralDashboard
              stats={stats}
              tickets={tickets}
              complianceDocs={complianceDocs}
              auditLogs={auditLogs}
              onNavigateTab={setActiveTab}
              onOpenNewTicketModal={() => setIsNewTicketModalOpen(true)}
            />
          )}

          {activeTab === 'rbac' && (
            <RoleManagement
              users={users}
              tenants={tenants}
              currentUser={currentUser}
              onSwitchUserRole={handleSwitchUserRole}
              onAddUser={handleAddUser}
            />
          )}

          {activeTab === 'compliance' && (
            <ComplianceModule
              complianceDocs={complianceDocs}
              auditLogs={auditLogs}
              termAcceptances={termAcceptances}
              onAddComplianceDoc={handleAddComplianceDoc}
            />
          )}

          {activeTab === 'cadastros' && (
            <CadastrosHub
              clients={clients}
              units={units}
              collaborators={collaborators}
              suppliers={suppliers}
              onAddClient={handleAddClient}
              onAddUnit={handleAddUnit}
              onAddCollaborator={handleAddCollaborator}
              onAddSupplier={handleAddSupplier}
            />
          )}

          {activeTab === 'facilities' && (
            <FacilitiesTickets
              tickets={tickets}
              units={units}
              collaborators={collaborators}
              onOpenNewTicketModal={() => setIsNewTicketModalOpen(true)}
              onUpdateTicketStatus={handleUpdateTicketStatus}
              onApproveCost={handleApproveCost}
            />
          )}

          {activeTab === 'eam' && (
            <EAMAssetsModule
              assets={assets}
              maintenancePlans={maintenancePlans}
              units={units}
              tickets={tickets}
              currentUser={currentUser}
              onAddAsset={handleAddAsset}
              onUpdateAsset={handleUpdateAsset}
              onDeleteAsset={handleDeleteAsset}
              onAddPlan={handleAddPlan}
            />
          )}

          {activeTab === 'tenant_portal' && (
            <ClientTenantPortal
              tickets={tickets}
              units={units}
              complianceDocs={complianceDocs}
              onCreateTicket={() => setIsNewTicketModalOpen(true)}
              onSubmitNps={handleSubmitNps}
            />
          )}

          {activeTab === 'bi_analytics' && (
            <ExecutiveBIDashboard
              metrics={biMetrics}
              tickets={tickets}
              assets={assets}
            />
          )}

          {activeTab === 'database' && (
            <DatabaseSQLViewer />
          )}

        </main>

      </div>

      {/* Modals */}
      <TermAcceptanceModal
        isOpen={isTermModalOpen}
        onClose={() => setIsTermModalOpen(false)}
        currentUser={currentUser}
        onAcceptTerm={handleAcceptTerm}
      />

      <NewTicketModal
        isOpen={isNewTicketModalOpen}
        onClose={() => setIsNewTicketModalOpen(false)}
        units={units}
        onCreateTicket={handleCreateTicket}
      />

    </div>
  );
}
