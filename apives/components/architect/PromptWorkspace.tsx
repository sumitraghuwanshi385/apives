import React, { useState, useMemo } from 'react';
import { Wand2, Keyboard, RefreshCw, Sparkles, Plus, Check } from 'lucide-react';

interface PromptWorkspaceProps {
  promptText: string;
  setPromptText: (val: string) => void;
  onClearText: () => void;
  onChipClick: (chip: string) => void;
  onGenerate: () => void;
  isGenerating: boolean;
  generationStep: number;
}

export interface SpecDefinition {
  name: string;
  expandedText: string;
  relatedChips: string[];
}

export const MAIN_SPECS: Record<string, SpecDefinition> = {
  'SaaS': {
    name: 'SaaS',
    expandedText: 'Multi-tenant SaaS architecture with organizations, workspaces, user invitations, subscriptions, billing, RBAC, audit logs and scalable API design.',
    relatedChips: ['Authentication', 'Multi Tenant', 'Billing', 'Subscription', 'Organizations', 'Workspace', 'RBAC', 'API Keys', 'Audit Logs', 'Notifications', 'Stripe', 'Webhooks', 'Teams'],
  },
  'CRM': {
    name: 'CRM',
    expandedText: 'Customer management, lead pipeline, contacts, activities, sales workflow, follow-ups, permissions, reports and REST endpoints.',
    relatedChips: ['Leads', 'Deals', 'Contacts', 'Companies', 'Pipelines', 'Tasks', 'Calendar', 'Reports', 'Activities', 'Email Integration'],
  },
  'HRMS': {
    name: 'HRMS',
    expandedText: 'Employee management, payroll, attendance, leave, departments, roles, recruitment, authentication and analytics.',
    relatedChips: ['Payroll', 'Attendance', 'Leave', 'Recruitment', 'Departments', 'Performance', 'Employee Portal'],
  },
  'Inventory': {
    name: 'Inventory',
    expandedText: 'Inventory management, warehouses, stock movements, suppliers, purchase orders, SKU tracking and reporting.',
    relatedChips: ['Warehouse', 'Suppliers', 'Purchase Orders', 'Stock Alerts', 'SKU', 'Barcode', 'Transfers'],
  },
  'E-commerce': {
    name: 'E-commerce',
    expandedText: 'Products, categories, carts, checkout, payments, orders, inventory synchronization, shipping and customer accounts.',
    relatedChips: ['Catalog', 'Cart', 'Checkout', 'Stripe', 'Shipping', 'Discounts', 'Reviews', 'Orders'],
  },
  'Booking': {
    name: 'Booking',
    expandedText: 'Appointment scheduling, calendars, availability, reminders, payments, cancellations and notifications.',
    relatedChips: ['Calendar', 'Slots', 'Reminders', 'Cancellations', 'Notifications', 'Availability', 'Deposits'],
  },
  'Chat': {
    name: 'Chat',
    expandedText: 'Real-time messaging, conversations, unread counts, typing indicators, attachments, presence and notifications.',
    relatedChips: ['WebSockets', 'Rooms', 'Direct Messages', 'Reactions', 'Read Receipts', 'File Uploads', 'Presence'],
  },
  'Analytics': {
    name: 'Analytics',
    expandedText: 'Dashboard, reports, KPIs, charts, filters, exports, event tracking and aggregated metrics.',
    relatedChips: ['Event Tracking', 'Aggregation', 'Metrics', 'Export CSV', 'Visualizations', 'Time Series'],
  },
  'Payments': {
    name: 'Payments',
    expandedText: 'Invoices, subscriptions, refunds, webhooks, payment gateways, transaction history and reconciliation.',
    relatedChips: ['Invoices', 'Webhooks', 'Subscriptions', 'Refunds', 'Stripe', 'Usage Billing', 'Taxation'],
  },
};

export const SUB_CHIP_TEXTS: Record<string, string> = {
  'Authentication': 'including JWT authentication, passwordless login, OAuth 2.0 social providers, multi-factor authentication (MFA), and token rotation',
  'Multi Tenant': 'including organization-level database isolation, custom tenant domains, workspace switching, and tenant-scoped rate limits',
  'Billing': 'including subscription billing, invoices, payment gateway integration, webhooks, retry handling, plans, coupons and usage-based pricing',
  'Subscription': 'including flexible recurring billing tiers, plan upgrades, downgrades, trial periods, and automated proration calculations',
  'Organizations': 'including organization hierarchies, team management, workspace provisioning, and enterprise SSO integration',
  'Workspace': 'including workspace member invites, granular permissions, project partitioning, and workspace settings',
  'RBAC': 'including role-based access control with custom roles, granular permission sets, resource policies, and middleware guards',
  'API Keys': 'including developer API key management, scope restrictions, usage quotas, rate limiting, and key rotation',
  'Audit Logs': 'including immutable activity audit logging, IP address tracking, user action telemetry, and compliance export logs',
  'Notifications': 'including real-time webhooks, push notifications, email alerts, in-app notification inbox, and user preference controls',
  'Stripe': 'including Stripe Connect, payment intent processing, webhook signature verification, and automated customer sync',
  'Webhooks': 'including outbound webhook dispatching, event signatures, exponential backoff retries, and failure dead-letter queues',
  'Teams': 'including team seat management, department assignments, shared resources, and team member activity feeds',
  'Leads': 'including lead scoring, stage progression tracking, custom qualification forms, and automated lead routing',
  'Deals': 'including kanban sales pipelines, deal velocity analytics, win/loss probability metrics, and revenue forecasting',
  'Contacts': 'including 360-degree contact timeline view, custom profile attributes, contact bulk import/export, and deduplication',
  'Companies': 'including company account hierarchies, parent-subsidiary linking, domain auto-enrichment, and company contacts',
  'Pipelines': 'including customizable multi-stage deal pipelines, stage SLA automation, and stage conversion reports',
  'Tasks': 'including task assignments, due date reminders, activity logging, and automated task triggers',
  'Calendar': 'including meeting scheduling, calendar sync with Google/Outlook, booking link generation, and conflict prevention',
  'Reports': 'including real-time sales reports, pipeline health dashboards, team performance metrics, and scheduled PDF exports',
  'Activities': 'including automated call logs, email tracking, meeting notes, and interaction history timelines',
  'Email Integration': 'including two-way email sync, email template management, open/click tracking, and automated drip sequences',
  'Payroll': 'including automated salary calculations, tax deductions, payslip generation, direct deposit integration, and year-end tax forms',
  'Attendance': 'including biometric time logging, shift scheduling, geo-fenced clock-in, overtime calculations, and timeoff tracking',
  'Leave': 'including leave policy configuration, multi-level approval workflows, leave balance tracking, and holiday calendars',
  'Recruitment': 'including job posting management, candidate applicant tracking system (ATS), interview scheduling, and offer letter workflows',
  'Departments': 'including organizational chart mapping, department budget tracking, cost center management, and manager hierarchies',
  'Performance': 'including quarterly performance review cycles, 360-degree feedback surveys, KPI goal tracking, and appraisal reports',
  'Employee Portal': 'including self-service employee portal, document access, personal detail updates, and company announcements',
  'Warehouse': 'including multi-warehouse location tracking, bin/shelf mapping, inter-warehouse stock transfers, and zone picking',
  'Suppliers': 'including vendor management, supplier performance ratings, lead time tracking, and contract management',
  'Purchase Orders': 'including automated reorder triggers, purchase order approval workflows, receiving logs, and vendor invoice matching',
  'Stock Alerts': 'including low-stock threshold alerts, safety stock calculations, expiration date tracking, and automated reorder alerts',
  'SKU': 'including unique SKU auto-generation, barcode printing, variant attributes, and unit of measure conversions',
  'Barcode': 'including barcode/QR code scanning endpoint support, mobile inventory audit tools, and batch scanning',
  'Transfers': 'including stock transfer requests, transit status tracking, receiving discrepancy resolution, and transfer logs',
};

export const PromptWorkspace: React.FC<PromptWorkspaceProps> = ({
  promptText,
  setPromptText,
  onClearText,
  onChipClick,
  onGenerate,
  isGenerating,
  generationStep,
}) => {
  const [selectedChips, setSelectedChips] = useState<Set<string>>(new Set());
  const [lastSelectedMain, setLastSelectedMain] = useState<string | null>(null);

  // Compute dynamic suggestions (max 10)
  const activeSuggestions = useMemo(() => {
    let pool: string[] = [];
    if (lastSelectedMain && MAIN_SPECS[lastSelectedMain]) {
      pool = MAIN_SPECS[lastSelectedMain].relatedChips;
    } else {
      // Default initial suggestions if no main chip clicked
      pool = MAIN_SPECS['SaaS'].relatedChips;
    }
    // Filter out already selected chips
    const filtered = pool.filter(chip => !selectedChips.has(chip));
    return filtered.slice(0, 10);
  }, [lastSelectedMain, selectedChips]);

  const handleChipClickInternal = (chipName: string) => {
    setSelectedChips(prev => new Set(prev).add(chipName));

    if (MAIN_SPECS[chipName]) {
      setLastSelectedMain(chipName);
      const spec = MAIN_SPECS[chipName];
      if (!promptText.trim()) {
        setPromptText(`Design a scalable API for ${spec.expandedText}`);
      } else {
        setPromptText(prev => `${prev.trim()}\n\nArchitectural Requirement (${chipName}): ${spec.expandedText}`);
      }
    } else if (SUB_CHIP_TEXTS[chipName]) {
      const subText = SUB_CHIP_TEXTS[chipName];
      if (!promptText.trim()) {
        setPromptText(`Design a scalable API ${subText}.`);
      } else {
        setPromptText(prev => `${prev.trim()} ${subText}.`);
      }
    } else {
      if (!promptText.trim()) {
        setPromptText(`Build API with ${chipName}`);
      } else {
        setPromptText(prev => `${prev.trim()}, including ${chipName.toLowerCase()} capabilities`);
      }
    }

    onChipClick(chipName);
  };

  const handleClear = () => {
    setSelectedChips(new Set());
    setLastSelectedMain(null);
    onClearText();
  };

  return (
    <div className="bg-dark-900/80 border border-white/10 hover:border-mora-500/40 rounded-3xl p-5 md:p-6 shadow-2xl backdrop-blur-xl transition-all duration-300 relative group overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-mora-500 via-mora-400 to-transparent opacity-80"></div>
      
      <div className="flex items-center justify-between mb-3">
        <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <Wand2 size={14} className="text-mora-500" />
          Describe API System Architecture
        </label>
        <div className="flex items-center gap-2">
          <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono text-slate-500 bg-white/5 px-2 py-0.5 rounded-full border border-white/5">
            <Keyboard size={10} /> Ctrl+Enter to generate
          </span>
          {promptText && (
            <button 
              onClick={handleClear}
              className="text-[10px] font-mono text-slate-400 hover:text-white uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all flex items-center gap-1 cursor-pointer"
            >
              Clear Text (Ctrl+K)
            </button>
          )}
        </div>
      </div>

      <textarea
        value={promptText}
        onChange={(e) => setPromptText(e.target.value)}
        placeholder="e.g. Build an enterprise API for HR Management System. Include employee directory, leave management workflows, payroll integration & RBAC permissions..."
        className="w-full h-40 bg-black/80 border border-white/10 rounded-2xl p-4 text-slate-100 placeholder-slate-600 font-mono text-xs md:text-sm focus:outline-none focus:border-mora-500 focus:ring-1 focus:ring-mora-500 transition-all leading-relaxed resize-none"
      />

      {/* SMART INSERT SPEC CHIPS & DYNAMIC SUGGESTIONS */}
      <div className="mt-3 space-y-2">
        {/* MAIN CATEGORY CHIPS */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-[10px] font-mono text-slate-500 uppercase whitespace-nowrap flex items-center gap-1">
            <Sparkles size={11} className="text-mora-400" /> Insert Spec:
          </span>
          {Object.keys(MAIN_SPECS).map((specName) => {
            const isSelected = selectedChips.has(specName);
            return (
              <button
                key={specName}
                onClick={() => handleChipClickInternal(specName)}
                className={`text-[10px] font-mono px-3 py-1 rounded-full whitespace-nowrap transition-all duration-300 flex items-center gap-1 cursor-pointer ${
                  isSelected
                    ? 'bg-mora-500/30 text-mora-300 border border-mora-500/60 font-bold shadow-sm'
                    : 'bg-white/5 hover:bg-mora-500/20 text-slate-300 hover:text-mora-300 border border-white/10 hover:border-mora-500/40'
                }`}
              >
                {isSelected ? <Check size={10} className="text-mora-400" /> : <Plus size={10} />}
                {specName}
              </button>
            );
          })}
        </div>

        {/* DYNAMIC AUTO SUGGESTIONS CHIPS */}
        {activeSuggestions.length > 0 && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none pt-1 border-t border-white/5 animate-fade-in">
            <span className="text-[9px] font-mono text-mora-400 uppercase whitespace-nowrap font-bold tracking-wider">
              Suggested Specs:
            </span>
            {activeSuggestions.map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => handleChipClickInternal(suggestion)}
                className="bg-mora-500/10 hover:bg-mora-500/20 text-mora-300 hover:text-white border border-mora-500/30 text-[9px] font-mono px-2.5 py-0.5 rounded-full whitespace-nowrap transition-all duration-200 flex items-center gap-1 cursor-pointer animate-slide-up"
              >
                <Plus size={9} className="text-mora-400" />
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* GENERATE SUBMIT ACTION */}
      <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4 pt-3 border-t border-white/10">
        <div className="text-[11px] font-mono text-slate-400">
          {promptText ? `${promptText.length} characters entered` : 'Ready to compile architecture'}
        </div>

        <button
          onClick={onGenerate}
          disabled={isGenerating || !promptText.trim()}
          className={`w-auto h-[52px] px-[28px] rounded-full text-[15px] font-semibold transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer ${
            isGenerating || !promptText.trim()
              ? 'bg-white/5 text-slate-500 border border-white/10 cursor-not-allowed'
              : 'bg-gradient-to-r from-mora-500 to-mora-400 text-black hover:from-mora-400 hover:to-mora-300 shadow-mora-500/20 active:scale-[0.98]'
          }`}
        >
          {isGenerating ? (
            <>
              <RefreshCw size={18} className="animate-spin text-black" />
              <span>Generating...</span>
            </>
          ) : (
            <>
              <Wand2 size={18} />
              <span>Generate Architecture</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
