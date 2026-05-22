import { getWebhookUrl } from '../api/client';
import {
  FileUp, FileSpreadsheet, Database, GitMerge, ScanSearch,
  FileDown, Mail, Copy, Check,
} from 'lucide-react';
import { useState } from 'react';

type Step = {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  detail: string;
  node: string;
};

const STEPS: Step[] = [
  { icon: FileUp,          title: 'Form Submission',     detail: 'SAP_USER_DATA file and "Send to" email captured from the upload form.',         node: 'On Form Submission4' },
  { icon: FileSpreadsheet, title: 'Read Excel',          detail: 'Workbook rows parsed into JSON (User Name, Role Name, T.Code).',                node: 'Read Excel File4 → Code: Transform Data8' },
  { icon: Database,        title: 'Load Rule Set',       detail: 'Pulls the SoD rule set (Rule Set, Access Point 1/2 T-codes) from Google Sheets.', node: 'TCode - Sap Hana (Rules)4 → Code: Transform Data9' },
  { icon: GitMerge,        title: 'Merge Rules & Users', detail: 'Combines the rule set with grouped user → role → T-code data.',                 node: 'Merge8' },
  { icon: ScanSearch,      title: 'Detect Conflicts',    detail: 'Runs Intra-role and Inter-role SoD analysis against the rule set.',             node: 'Function — Analyze Intra/Inter role2' },
  { icon: FileDown,        title: 'Build Reports',       detail: 'Converts results to "Intra Role conflicts.xlsx" and "Inter role conflicts.xlsx".', node: 'Intra/Inter role to File' },
  { icon: Mail,            title: 'Email Report',        detail: 'Gmail node sends a summary table with both Excel attachments to "Send to".',    node: 'Send Security Report4' },
];

export default function WorkflowPage() {
  const url = getWebhookUrl();
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch { /* ignore */ }
  }

  return (
    <div className="space-y-8">

      <div>
        <h1 className="text-2xl font-semibold text-[#002970] tracking-tight">Workflow</h1>
        <p className="text-sm text-slate-500 mt-1.5 max-w-2xl">
          What happens after submission — derived directly from the
          {' '}<span className="font-mono text-[12px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">SAP SOD Project (Live)</span>
          {' '}n8n workflow.
        </p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="px-6 py-4 border-b border-slate-100">
          <h2 className="text-[13px] font-semibold text-[#002970] uppercase tracking-[0.08em]">
            Webhook endpoint
          </h2>
        </div>
        <div className="px-6 py-5">
          <div className="flex items-center gap-2 rounded-md bg-slate-50 border border-slate-200 px-3 py-2.5">
            <code className="flex-1 text-[12.5px] text-[#002970] font-mono break-all">{url}</code>
            <button
              onClick={copy}
              className="shrink-0 inline-flex items-center gap-1.5 px-2.5 h-7 text-[11.5px] font-medium text-slate-600 hover:text-[#002970] hover:bg-white border border-transparent hover:border-slate-200 rounded-md transition-colors"
            >
              {copied ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Override at runtime with <span className="font-mono text-slate-500">VITE_N8N_WEBHOOK_URL</span> in <span className="font-mono text-slate-500">.env</span>.
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-[13px] font-semibold text-[#002970] uppercase tracking-[0.08em]">
            Pipeline
          </h2>
          <span className="text-[11px] text-slate-400">{STEPS.length} stages</span>
        </div>
        <div className="px-6 py-6">
          <div className="relative">
            <div className="absolute left-[19px] top-3 bottom-3 w-px bg-slate-200" />
            <div className="space-y-5">
              {STEPS.map((s, i) => {
                const Icon = s.icon;
                return (
                  <div key={i} className="flex gap-4 relative">
                    <div className="w-10 h-10 rounded-full bg-white border-2 border-[#00BAF2]/30 flex items-center justify-center shrink-0 z-10 shadow-sm">
                      <Icon size={15} className="text-[#00BAF2]" />
                    </div>
                    <div className="flex-1 min-w-0 pt-1">
                      <div className="flex items-baseline gap-2 flex-wrap">
                        <p className="text-[13.5px] font-semibold text-[#002970]">
                          <span className="text-slate-400 font-mono mr-1.5 text-[11px]">{String(i + 1).padStart(2, '0')}</span>
                          {s.title}
                        </p>
                        <span className="text-[11px] text-slate-400 font-mono">{s.node}</span>
                      </div>
                      <p className="text-[12.5px] text-slate-500 mt-1 leading-relaxed">{s.detail}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
