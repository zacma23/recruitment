import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { PortalView } from '../types/portal';

interface HeaderProps {
  activeView: PortalView;
  onNavigate: (view: PortalView) => void;
  applicationCount: number;
  unreadMessageCount: number;
  onOpenPostRole: () => void;
}

export function Header({
  activeView,
  onNavigate,
  applicationCount,
  unreadMessageCount,
  onOpenPostRole,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: PortalView; label: string }[] = [
    { id: 'roles', label: 'Open Roles' },
    {
      id: 'applications',
      label: applicationCount > 0 ? `Applications (${applicationCount})` : 'Applications',
    },
    {
      id: 'messages',
      label: unreadMessageCount > 0 ? `Messages (${unreadMessageCount})` : 'Messages',
    },
    { id: 'employer', label: 'Employer Hub' },
    { id: 'charter', label: 'Charter' },
  ];

  const handleSelect = (view: PortalView) => {
    onNavigate(view);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        <button
          type="button"
          onClick={() => handleSelect('roles')}
          className="font-display text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 hover:text-blue-700 transition-colors"
        >
          Meridian Talent
        </button>

        <nav
          aria-label="Primary navigation"
          className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600"
        >
          {navItems.map((item) => {
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelect(item.id)}
                className={`py-1 whitespace-nowrap shrink-0 tabular-nums border-b-2 transition-colors ${
                  isActive
                    ? 'text-slate-900 border-blue-700'
                    : 'border-transparent hover:text-slate-900 hover:border-slate-300'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onOpenPostRole}
            className="hidden sm:inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-slate-900 rounded-md hover:bg-blue-800 transition-colors whitespace-nowrap shrink-0"
          >
            Post a Role
          </button>

          <button
            type="button"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="md:hidden inline-flex items-center justify-center w-11 h-11 text-slate-700 hover:text-slate-900 rounded-md"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-2">
          {navItems.map((item) => {
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelect(item.id)}
                className={`block w-full text-left px-3 py-2.5 text-sm font-medium rounded-md tabular-nums ${
                  isActive
                    ? 'bg-slate-100 text-slate-900'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                {item.label}
              </button>
            );
          })}
          <div className="pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenPostRole();
              }}
              className="w-full px-4 py-2.5 text-sm font-medium text-white bg-slate-900 rounded-md hover:bg-blue-800 transition-colors"
            >
              Post a Role
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
