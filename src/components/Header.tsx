import { NavLink } from 'react-router-dom';
import { Upload, Info } from 'lucide-react';

const NAV_ITEMS = [
  { to: '/',      label: 'Upload', icon: Upload },
  { to: '/about', label: 'About',  icon: Info   },
] as const;

export default function Header() {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center h-16 gap-8">

          <a href="/" className="flex items-center shrink-0">
            <div className="leading-tight">
              <div className="text-[15px] font-semibold text-[#002970] tracking-tight">SAP SoD Analyzer</div>
              <div className="text-[10.5px] text-slate-400 font-medium uppercase tracking-[0.12em]">IT Internal Audit</div>
            </div>
          </a>

          <nav className="flex items-center gap-1 flex-1">
            {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[13px] font-medium transition-colors ${
                    isActive
                      ? 'bg-[#002970] text-white'
                      : 'text-slate-500 hover:text-[#002970] hover:bg-slate-100'
                  }`
                }
              >
                <Icon size={14} />
                {label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-2 text-[11px] text-slate-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="font-medium">n8n connected</span>
          </div>
        </div>
      </div>
    </header>
  );
}
