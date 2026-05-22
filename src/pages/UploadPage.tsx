import { useRef, useState } from 'react';
import {
  Upload, Mail, FileSpreadsheet, Loader2,
  AlertCircle, CheckCircle2, X, Send,
  FileUp, Workflow, ScanSearch, Sigma, MailCheck,
  ShieldAlert, ListChecks, Clock,
} from 'lucide-react';
import { submitSodJob, SAP_USER_DATA_FIELD, SEND_TO_FIELD } from '../api/client';

const ACCEPT = '.xlsx,.xls';

const STEPS = [
  { icon: FileUp,     label: 'Uploading file',      sub: 'Sending SAP user data to n8n…'         },
  { icon: Workflow,   label: 'Reading workbook',    sub: 'Spreadsheet node parsing rows…'        },
  { icon: ScanSearch, label: 'Loading rule set',    sub: 'Pulling SoD rules from Google Sheets…' },
  { icon: Sigma,      label: 'Analyzing conflicts', sub: 'Intra-role and Inter-role analysis…'   },
  { icon: MailCheck,  label: 'Emailing report',     sub: 'Gmail node sending Excel attachments…' },
];
const STEP_DURATIONS = [1500, 2500, 2500, 99999, 800];

function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(2)} MB`;
}

function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 uppercase tracking-[0.08em] mb-2">
      {children}
      {required && <span className="text-rose-500 -mt-0.5">*</span>}
    </label>
  );
}

function Progress({ step }: { step: number }) {
  const pct = Math.round(((step + 1) / STEPS.length) * 100);

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
      <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-slate-50 to-white dark:from-slate-800/40 dark:to-slate-900">
        <div className="flex items-center gap-2.5">
          <Loader2 size={15} className="text-[#00BAF2] animate-spin" />
          <span className="text-sm font-semibold text-[#002970] dark:text-slate-100">Processing submission</span>
        </div>
        <span className="text-xs font-semibold text-[#00BAF2] tabular-nums">{pct}%</span>
      </div>

      <div className="h-1 bg-slate-100 dark:bg-slate-800">
        <div
          className="h-1 bg-gradient-to-r from-[#00BAF2] to-[#002970] transition-all duration-700 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>

      <div className="px-6 py-5">
        <div className="relative">
          <div className="absolute left-[15px] top-3 bottom-3 w-px bg-slate-200" />
          <div className="space-y-3.5">
            {STEPS.map((s, i) => {
              const SI     = s.icon;
              const done   = i < step;
              const active = i === step;
              return (
                <div key={i} className="flex items-center gap-3 relative">
                  <div className={`w-[31px] h-[31px] rounded-full flex items-center justify-center shrink-0 z-10 transition-all duration-300 ${
                    done   ? 'bg-emerald-500 ring-4 ring-emerald-100 dark:ring-emerald-900/40' :
                    active ? 'bg-[#00BAF2] ring-4 ring-[#00BAF2]/15' :
                             'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700'
                  }`}>
                    {done   ? <CheckCircle2 size={14} className="text-white" /> :
                     active ? <Loader2 size={14} className="text-white animate-spin" /> :
                              <SI size={13} className="text-slate-300" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-[13px] font-medium transition-colors ${
                      done   ? 'text-emerald-600' :
                      active ? 'text-[#002970] dark:text-slate-100' :
                               'text-slate-400'
                    }`}>{s.label}</p>
                    {active && (
                      <p className="text-[11px] text-slate-400 mt-0.5">{s.sub}</p>
                    )}
                  </div>
                  {done   && <span className="text-[10px] text-emerald-500 font-semibold uppercase tracking-wider shrink-0">Done</span>}
                  {active && <span className="text-[10px] text-[#00BAF2] font-semibold uppercase tracking-wider shrink-0">In&nbsp;progress</span>}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="px-6 py-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex items-center gap-2 text-[11px] text-slate-400">
        <Clock size={11} />
        <span>Average runtime is 15–45 seconds. Please don't close this tab.</span>
      </div>
    </div>
  );
}

export default function UploadPage() {
  const [file,    setFile]      = useState<File | null>(null);
  const [sendTo,  setSendTo]    = useState('');
  const [loading, setLoading]   = useState(false);
  const [step,    setStep]      = useState(0);
  const [error,   setError]     = useState('');
  const [done,    setDone]      = useState<{ message: string } | null>(null);
  const [dragging, setDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const stepTimer    = useRef<ReturnType<typeof setTimeout> | null>(null);

  function startProgress() {
    setStep(0);
    let current = 0;
    function advance() {
      if (current < STEPS.length - 2) {
        current += 1;
        setStep(current);
        stepTimer.current = setTimeout(advance, STEP_DURATIONS[current]);
      }
    }
    stepTimer.current = setTimeout(advance, STEP_DURATIONS[0]);
  }

  function finishProgress(cb: () => void) {
    if (stepTimer.current) clearTimeout(stepTimer.current);
    setStep(STEPS.length - 1);
    setTimeout(cb, 600);
  }

  function reset() {
    if (stepTimer.current) clearTimeout(stepTimer.current);
    setFile(null);
    setSendTo('');
    setError('');
    setDone(null);
    setLoading(false);
    setStep(0);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  function validateFile(f: File): string {
    const lower = f.name.toLowerCase();
    if (!lower.endsWith('.xlsx') && !lower.endsWith('.xls')) {
      return 'Only .xlsx or .xls files are accepted.';
    }
    return '';
  }

  function handleFile(f: File | null | undefined) {
    if (!f) return;
    const err = validateFile(f);
    if (err) { setError(err); return; }
    setError('');
    setFile(f);
  }

  function onDrop(e: React.DragEvent<HTMLLabelElement>) {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files?.[0]);
  }

  function parseRecipients(raw: string): string[] {
    return raw
      .split(/[,;\n]+/)
      .map(s => s.trim())
      .filter(Boolean);
  }
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const recipients = parseRecipients(sendTo);
  const invalid    = recipients.filter(r => !EMAIL_RE.test(r));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file)              { setError('Please select an Excel file (.xlsx or .xls).');          return; }
    if (recipients.length === 0) { setError('Please enter at least one recipient email.');       return; }
    if (invalid.length > 0) {
      setError(`Invalid email${invalid.length > 1 ? 's' : ''}: ${invalid.join(', ')}`);
      return;
    }

    setError('');
    setDone(null);
    setLoading(true);
    startProgress();

    // n8n's Gmail node accepts a comma-separated To string, so we normalize here.
    const normalized = recipients.join(', ');

    try {
      const res = await submitSodJob({ file, sendTo: normalized });
      finishProgress(() => {
        setDone({
          message: res.body && res.body.length < 500
            ? res.body
            : 'Workflow accepted the file. You’ll receive the SoD report by email shortly.',
        });
        setLoading(false);
      });
    } catch (err) {
      if (stepTimer.current) clearTimeout(stepTimer.current);
      setError(err instanceof Error ? err.message : 'Submission failed.');
      setLoading(false);
    }
  }

  const canSubmit = !!file && recipients.length > 0 && invalid.length === 0 && !loading;

  return (
    <div className="space-y-8">

      {/* Page hero */}
      <div className="flex items-start justify-between gap-6">
        <div>
          <h1 className="text-2xl font-semibold text-[#002970] dark:text-slate-100 tracking-tight">
            Segregation of Duties Analysis
          </h1>
          <p className="text-sm text-slate-500 mt-1.5 max-w-xl">
            Upload an SAP user/role export. We'll evaluate it against the configured
            rule set and email back the intra-role and inter-role conflict reports.
          </p>
        </div>
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#e0f4fc] dark:bg-[#00BAF2]/10 text-[12px] font-medium text-[#002970] dark:text-[#00BAF2] border border-[#00BAF2]/30">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00BAF2]" />
          Live workflow
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 items-start">

        {/* ── Form column ───────────────────────────────────────────── */}
        <div className="space-y-6">

          <form onSubmit={handleSubmit}
                className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">

            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-[13px] font-semibold text-[#002970] dark:text-slate-100 uppercase tracking-[0.08em]">
                Submission
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Fields below map 1:1 to the n8n form-trigger node.
              </p>
            </div>

            <div className="px-6 py-6 space-y-6">

              {/* File field — maps to "SAP_USER_DATA" */}
              <div>
                <FieldLabel required>
                  <span className="font-mono normal-case tracking-normal text-[11px] text-slate-600">{SAP_USER_DATA_FIELD}</span>
                  <span className="text-slate-300 font-normal normal-case tracking-normal">— SAP user data export</span>
                </FieldLabel>

                {!file ? (
                  <label
                    onDragOver={e => { e.preventDefault(); setDragging(true); }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={onDrop}
                    className={`flex flex-col items-center justify-center gap-2 cursor-pointer rounded-lg border-2 border-dashed px-4 py-10 transition-colors ${
                      dragging
                        ? 'border-[#00BAF2] bg-[#e0f4fc]/60 dark:bg-[#00BAF2]/10'
                        : 'border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/30 hover:border-[#00BAF2] hover:bg-[#e0f4fc]/30 dark:hover:bg-[#00BAF2]/10'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-[#00BAF2]/10 flex items-center justify-center mb-1">
                      <Upload size={18} className="text-[#00BAF2]" />
                    </div>
                    <p className="text-[13px] text-[#002970] dark:text-slate-100 font-medium">
                      Drop the workbook here, or <span className="text-[#00BAF2] underline-offset-2 hover:underline">browse</span>
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Accepted formats: <span className="font-mono">.xlsx</span>, <span className="font-mono">.xls</span> · max ~10 MB
                    </p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept={ACCEPT}
                      className="hidden"
                      onChange={e => handleFile(e.target.files?.[0])}
                    />
                  </label>
                ) : (
                  <div className="flex items-center gap-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/30 px-4 py-3">
                    <div className="w-9 h-9 rounded-md bg-emerald-50 dark:bg-emerald-500/15 border border-emerald-200 dark:border-emerald-500/30 flex items-center justify-center shrink-0">
                      <FileSpreadsheet size={16} className="text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-medium text-[#002970] dark:text-slate-100 truncate">{file.name}</p>
                      <p className="text-[11px] text-slate-400 tabular-nums">{formatBytes(file.size)}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => { setFile(null); if (fileInputRef.current) fileInputRef.current.value = ''; }}
                      className="p-1.5 rounded-md text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
                      aria-label="Remove file"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}

                <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                  Expected columns: <span className="font-mono text-slate-500">User Name</span>,&nbsp;
                  <span className="font-mono text-slate-500">Role Name</span>,&nbsp;
                  <span className="font-mono text-slate-500">T.Code</span>.
                </p>
              </div>

              {/* Email field — maps to "Send to". Accepts comma- or semicolon-separated recipients. */}
              <div>
                <FieldLabel required>
                  <span className="font-mono normal-case tracking-normal text-[11px] text-slate-600">{SEND_TO_FIELD}</span>
                  <span className="text-slate-300 font-normal normal-case tracking-normal">— one or more recipients</span>
                </FieldLabel>
                <div className="relative">
                  <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <input
                    type="text"
                    value={sendTo}
                    onChange={e => setSendTo(e.target.value)}
                    placeholder="alice@company.com, bob@company.com"
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg pl-9 pr-3 h-10 text-[13px] text-[#002970] dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-[#00BAF2] focus:ring-2 focus:ring-[#00BAF2]/20 transition-all"
                  />
                </div>

                {recipients.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2.5">
                    {recipients.map((r) => {
                      const bad = !EMAIL_RE.test(r);
                      return (
                        <span
                          key={r}
                          className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11.5px] font-medium border ${
                            bad
                              ? 'bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-500/30'
                              : 'bg-[#e0f4fc] dark:bg-[#00BAF2]/10 text-[#002970] dark:text-[#00BAF2] border-[#00BAF2]/30'
                          }`}
                        >
                          {bad && <AlertCircle size={10} className="text-rose-500" />}
                          {r}
                        </span>
                      );
                    })}
                  </div>
                )}

                <p className="text-[11px] text-slate-400 mt-2">
                  Separate multiple recipients with a comma. The Excel reports (Intra + Inter role)
                  will be emailed to <span className="font-medium text-slate-500">{recipients.length || 'all'}</span>{' '}
                  recipient{recipients.length === 1 ? '' : 's'} once the workflow completes.
                </p>
              </div>

              {error && (
                <div className="flex gap-2.5 items-start rounded-lg border border-rose-200 dark:border-rose-500/30 bg-rose-50 dark:bg-rose-500/10 px-3.5 py-3">
                  <AlertCircle size={14} className="text-rose-500 mt-0.5 shrink-0" />
                  <p className="text-[12.5px] text-rose-700 dark:text-rose-300 leading-relaxed break-words">{error}</p>
                </div>
              )}
            </div>

            {/* Footer / actions */}
            <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/30 flex items-center justify-between gap-3">
              <p className="text-[11px] text-slate-400">
                {file && recipients.length > 0 && invalid.length === 0
                  ? <>Ready to submit <span className="font-mono text-slate-500">{file.name}</span> to <span className="font-medium text-slate-500">{recipients.length}</span> recipient{recipients.length === 1 ? '' : 's'}</>
                  : <>Fill both fields to enable submission.</>}
              </p>
              <div className="flex items-center gap-2">
                {(file || sendTo || done) && !loading && (
                  <button
                    type="button"
                    onClick={reset}
                    className="px-3.5 h-9 text-[13px] font-medium text-slate-600 hover:text-[#002970] dark:text-slate-100 hover:bg-slate-200/70 rounded-md transition-colors"
                  >
                    Clear
                  </button>
                )}
                <button
                  type="submit"
                  disabled={!canSubmit}
                  className="inline-flex items-center gap-2 px-4 h-9 bg-[#002970] hover:bg-[#001a4f] disabled:bg-slate-300 disabled:cursor-not-allowed text-white text-[13px] font-semibold rounded-md transition-colors shadow-sm"
                >
                  {loading ? <Loader2 size={14} className="animate-spin" /> : <Send size={13} />}
                  {loading ? 'Submitting…' : 'Run analysis'}
                </button>
              </div>
            </div>
          </form>

          {loading && <Progress step={step} />}

          {done && !loading && (
            <div className="rounded-xl border border-emerald-200 dark:border-emerald-500/30 bg-emerald-50/80 dark:bg-emerald-500/10 overflow-hidden">
              <div className="px-5 py-4 flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-emerald-500 flex items-center justify-center shrink-0 shadow-sm">
                  <CheckCircle2 size={16} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-semibold text-emerald-800 dark:text-emerald-200">Submission accepted</p>
                  <p className="text-[12px] text-emerald-700/90 dark:text-emerald-300/90 mt-1 leading-relaxed break-words">{done.message}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── Sidebar ───────────────────────────────────────────────── */}
        <aside className="space-y-4">

          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-3">
              <ListChecks size={14} className="text-[#00BAF2]" />
              <h3 className="text-[12px] font-semibold text-[#002970] dark:text-slate-100 uppercase tracking-[0.08em]">
                What you'll get
              </h3>
            </div>
            <ul className="space-y-2.5">
              {[
                { t: 'Intra-Role conflicts',  d: 'Where a single role contains conflicting access points.' },
                { t: 'Inter-Role conflicts',  d: 'Where access points conflict across a user’s roles.' },
                { t: 'Email summary',         d: 'A summary table plus both Excel attachments to "Send to".' },
              ].map(({ t, d }) => (
                <li key={t} className="flex gap-2.5">
                  <CheckCircle2 size={13} className="text-emerald-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-[12.5px] font-medium text-[#002970] dark:text-slate-100 leading-tight">{t}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">{d}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-3">
              <ShieldAlert size={14} className="text-amber-500" />
              <h3 className="text-[12px] font-semibold text-[#002970] dark:text-slate-100 uppercase tracking-[0.08em]">
                Before you submit
              </h3>
            </div>
            <ul className="space-y-2 text-[12px] text-slate-500 leading-relaxed">
              <li>• Workbook must contain a single sheet with the three expected columns.</li>
              <li>• Submissions are processed asynchronously by n8n.</li>
              <li>• Use a distribution list as recipient if multiple reviewers need the report.</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
