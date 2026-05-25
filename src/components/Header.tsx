import { NavLink } from 'react-router-dom';
import { Info, Sun, Moon } from 'lucide-react';
import { useTheme } from '../lib/useTheme';

const NAV_ITEMS = [
  { to: '/about', label: 'About', icon: Info },
] as const;

export default function Header() {
  const { theme, toggle } = useTheme();
  const isDark = theme === 'dark';

  return (
    <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center h-16 gap-8">

          <a href="/" className="flex items-center gap-3 shrink-0 -my-px">
            <img
              src="/paytm-logo.svg"
              alt="Paytm"
              className="h-7 w-auto block dark:brightness-0 dark:invert"
            />
            <div className="h-8 w-px bg-slate-200 dark:bg-slate-700" aria-hidden="true" />
            <div className="leading-tight">
              <div className="text-[15px] font-semibold text-[#002970] dark:text-slate-100 tracking-tight">SAP SoD Analyzer</div>
              <div className="text-[10.5px] text-slate-400 dark:text-slate-500 font-medium uppercase tracking-[0.12em]">IT Internal Audit</div>
            </div>
          </a>

          <nav className="flex items-center gap-1 flex-1">
            {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[13px] font-medium transition-colors ${
                    isActive
                      ? 'bg-[#002970] dark:bg-[#00BAF2] text-white'
                      : 'text-slate-500 dark:text-slate-400 hover:text-[#002970] dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`
                }
              >
                <Icon size={14} />
                {label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <div className="hidden md:inline-flex items-center gap-1.5 px-2.5 h-7 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-[11px] font-medium text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              n8n connected
            </div>

            <button
              type="button"
              onClick={toggle}
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-[#002970] dark:hover:text-white transition-colors"
            >
              {isDark ? <Sun size={15} /> : <Moon size={15} />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
