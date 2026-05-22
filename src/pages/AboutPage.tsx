import {
  FileSpreadsheet, Mail,
  FileUp, Database, GitMerge, ScanSearch, FileDown, Send,
} from 'lucide-react';
import { SAP_USER_DATA_FIELD, SEND_TO_FIELD } from '../api/client';

const FIELDS = [
  {
    icon: FileSpreadsheet,
    name: SAP_USER_DATA_FIELD,
    type: 'file (.xlsx, .xls)',
    description: 'SAP user/role export. Expected columns: User Name, Role Name, T.Code.',
  },
  {
    icon: Mail,
    name: SEND_TO_FIELD,
    type: 'email',
    description: 'Recipient address for the generated SoD violation report.',
  },
];

const STEPS = [
  {
    icon: FileUp,
    title: 'Submit',
    detail: 'You upload an SAP user-role export and provide an email to receive the report.',
  },
  {
    icon: FileSpreadsheet,
    title: 'Parse workbook',
    detail: 'Rows are read into structured records — one per User × Role × T-Code combination.',
  },
  {
    icon: Database,
    title: 'Load rule set',
    detail: 'The Segregation-of-Duties rule set (rule name, Access Point 1 T-code, Access Point 2 T-code) is pulled from Google Sheets.',
  },
  {
    icon: GitMerge,
    title: 'Cross-reference',
    detail: 'User T-code assignments are joined against the rule set so every rule can be evaluated per user.',
  },
  {
    icon: ScanSearch,
    title: 'Detect conflicts',
    detail: 'Two analyses run: intra-role (both access points held within a single role) and inter-role (access points spread across multiple roles assigned to the same user).',
  },
  {
    icon: FileDown,
    title: 'Build reports',
    detail: 'Findings are written to two Excel files: Intra Role conflicts.xlsx and Inter Role conflicts.xlsx.',
  },
  {
    icon: Send,
    title: 'Deliver',
    detail: 'The report email is sent to the recipient address with both Excel files attached and a summary table in the body.',
  },
];

export default function AboutPage() {
  return (
    <div className="space-y-8">

      <div>
        <h1 className="text-2xl font-semibold text-[#002970] dark:text-slate-100 tracking-tight">About</h1>
        <p className="text-sm text-slate-500 mt-1.5 max-w-2xl">
          SOD Conflict Detection scans an SAP user-role export against a configurable
          Segregation-of-Duties rule set and emails the conflict report to a recipient
          you choose. Analysis runs in an n8n workflow; this UI is just the submission
          surface.
        </p>
      </div>

      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-[13px] font-semibold text-[#002970] dark:text-slate-100 uppercase tracking-[0.08em]">
            Form parameters
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            What the upload form sends to the workflow.
          </p>
        </div>
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {FIELDS.map(({ icon: Icon, name, type, description }) => (
            <div key={name} className="px-6 py-4 flex items-start gap-4">
              <div className="w-9 h-9 rounded-md bg-[#e0f4fc] border border-[#00BAF2]/30 flex items-center justify-center shrink-0">
                <Icon size={15} className="text-[#00BAF2]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2 flex-wrap">
                  <code className="text-[13px] font-mono font-semibold text-[#002970] dark:text-slate-100">{name}</code>
                  <span className="text-[11px] text-slate-400">{type}</span>
                </div>
                <p className="text-[12.5px] text-slate-500 mt-1 leading-relaxed">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h2 className="text-[13px] font-semibold text-[#002970] dark:text-slate-100 uppercase tracking-[0.08em]">
            How it works
          </h2>
          <span className="text-[11px] text-slate-400">{STEPS.length} stages</span>
        </div>
        <div className="px-6 py-6">
          <div className="relative">
            <div className="absolute left-[19px] top-3 bottom-3 w-px bg-slate-200 dark:bg-slate-700" />
            <div className="space-y-5">
              {STEPS.map((s, i) => {
                const Icon = s.icon;
                return (
                  <div key={i} className="flex gap-4 relative">
                    <div className="w-10 h-10 rounded-full bg-white border-2 border-[#00BAF2]/30 flex items-center justify-center shrink-0 z-10 shadow-sm">
                      <Icon size={15} className="text-[#00BAF2]" />
                    </div>
                    <div className="flex-1 min-w-0 pt-1">
                      <p className="text-[13.5px] font-semibold text-[#002970] dark:text-slate-100">
                        <span className="text-slate-400 font-mono mr-1.5 text-[11px]">{String(i + 1).padStart(2, '0')}</span>
                        {s.title}
                      </p>
                      <p className="text-[12.5px] text-slate-500 mt-1 leading-relaxed">{s.detail}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-[13px] font-semibold text-[#002970] dark:text-slate-100 uppercase tracking-[0.08em]">
            Two kinds of conflicts
          </h2>
        </div>
        <div className="px-6 py-5 space-y-4 text-[13px] text-slate-600 leading-relaxed">
          <div>
            <p className="font-semibold text-[#002970] dark:text-slate-100">Intra-role conflict</p>
            <p className="mt-1">
              A single SAP role contains both T-codes named by a rule. The user only
              needs that one role to violate the rule.
            </p>
          </div>
          <div>
            <p className="font-semibold text-[#002970] dark:text-slate-100">Inter-role conflict</p>
            <p className="mt-1">
              The two conflicting T-codes live in different roles, but the same user is
              assigned both — so the user violates the rule by combination.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
