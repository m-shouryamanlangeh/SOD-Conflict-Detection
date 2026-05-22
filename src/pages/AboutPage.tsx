import { FileSpreadsheet, Mail, ArrowRight } from 'lucide-react';
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

export default function AboutPage() {
  return (
    <div className="space-y-8">

      <div>
        <h1 className="text-2xl font-semibold text-[#002970] tracking-tight">About</h1>
        <p className="text-sm text-slate-500 mt-1.5 max-w-2xl">
          A focused upload UI in front of the SAP SoD n8n workflow.
        </p>
      </div>

      {/* Form parameters */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="px-6 py-4 border-b border-slate-100">
          <h2 className="text-[13px] font-semibold text-[#002970] uppercase tracking-[0.08em]">
            Form parameters
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Pulled verbatim from <span className="font-mono text-slate-500">On Form Submission4</span> in the n8n workflow JSON.
          </p>
        </div>
        <div className="divide-y divide-slate-100">
          {FIELDS.map(({ icon: Icon, name, type, description }) => (
            <div key={name} className="px-6 py-4 flex items-start gap-4">
              <div className="w-9 h-9 rounded-md bg-[#e0f4fc] border border-[#00BAF2]/30 flex items-center justify-center shrink-0">
                <Icon size={15} className="text-[#00BAF2]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2 flex-wrap">
                  <code className="text-[13px] font-mono font-semibold text-[#002970]">{name}</code>
                  <span className="text-[11px] text-slate-400">{type}</span>
                </div>
                <p className="text-[12.5px] text-slate-500 mt-1 leading-relaxed">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* What happens */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="px-6 py-4 border-b border-slate-100">
          <h2 className="text-[13px] font-semibold text-[#002970] uppercase tracking-[0.08em]">
            What happens next
          </h2>
        </div>
        <div className="px-6 py-5 flex items-center gap-2 flex-wrap text-[12.5px] text-slate-600">
          <Pill>Workbook parsed</Pill>
          <ArrowRight size={12} className="text-slate-300" />
          <Pill>Rules loaded from Google Sheets</Pill>
          <ArrowRight size={12} className="text-slate-300" />
          <Pill>Intra-role analysis</Pill>
          <ArrowRight size={12} className="text-slate-300" />
          <Pill>Inter-role analysis</Pill>
          <ArrowRight size={12} className="text-slate-300" />
          <Pill>Excel reports built</Pill>
          <ArrowRight size={12} className="text-slate-300" />
          <Pill highlight>Email delivered</Pill>
        </div>
      </div>
    </div>
  );
}

function Pill({ children, highlight }: { children: React.ReactNode; highlight?: boolean }) {
  return (
    <span className={`px-2.5 py-1 rounded-md border text-[12px] font-medium ${
      highlight
        ? 'bg-[#002970] text-white border-[#002970]'
        : 'bg-slate-50 text-slate-600 border-slate-200'
    }`}>
      {children}
    </span>
  );
}
