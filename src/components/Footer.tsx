import { PortalView } from '../types/portal';

interface FooterProps {
  onNavigate: (view: PortalView) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="bg-white border-t border-slate-200 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-slate-200">
          <div>
            <p className="font-display text-base font-bold text-slate-900">Meridian Talent</p>
            <p className="mt-1 text-xs text-slate-600 max-w-md">
              Direct international job board operating strictly under the Employer Pays Principle.
              Candidates never pay application or visa fees.
            </p>
          </div>

          <nav
            aria-label="Footer navigation"
            className="flex flex-wrap items-center gap-6 text-sm text-slate-600"
          >
            <button
              type="button"
              onClick={() => onNavigate('roles')}
              className="hover:text-slate-900 transition-colors"
            >
              Open Roles
            </button>
            <button
              type="button"
              onClick={() => onNavigate('applications')}
              className="hover:text-slate-900 transition-colors"
            >
              Applications
            </button>
            <button
              type="button"
              onClick={() => onNavigate('messages')}
              className="hover:text-slate-900 transition-colors"
            >
              Messages
            </button>
            <button
              type="button"
              onClick={() => onNavigate('employer')}
              className="hover:text-slate-900 transition-colors"
            >
              Employer Hub
            </button>
            <button
              type="button"
              onClick={() => onNavigate('charter')}
              className="hover:text-slate-900 transition-colors"
            >
              Charter
            </button>
          </nav>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500">
          <p>© 2026 Meridian Talent. All roles listed are free for candidates to apply.</p>
          <p>Equal opportunity international recruitment directory</p>
        </div>
      </div>
    </footer>
  );
}
