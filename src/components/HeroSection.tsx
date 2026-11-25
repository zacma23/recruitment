import { useState } from 'react';
import { ArrowDownRight, Building2 } from 'lucide-react';

interface HeroSectionProps {
  openRoleCount: number;
  sponsoredCount: number;
  countryCount: number;
  onBrowseRoles: () => void;
  onViewCharter: () => void;
}

const HERO_IMAGE_PATH = '/src/assets/images/hero_global_workplace_1795629382185.jpg';

export function HeroSection({
  openRoleCount,
  sponsoredCount,
  countryCount,
  onBrowseRoles,
  onViewCharter,
}: HeroSectionProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <section className="bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-10 lg:pt-14 lg:pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          <div className="lg:col-span-6 flex flex-col justify-center">
            <p className="text-sm font-medium text-blue-700 mb-3">
              Direct Employer Hiring · Zero Candidate Fees
            </p>
            <h1
              className="font-display font-bold tracking-tight text-slate-900 leading-[1.12] [text-wrap:balance]"
              style={{ fontSize: 'clamp(2.25rem, 3.8vw, 3.25rem)' }}
            >
              International careers with verified employers and free applications.
            </h1>
            <p className="mt-5 text-base text-slate-600 leading-relaxed max-w-xl">
              Apply directly to hiring teams across Europe, North America, and Asia-Pacific. Every
              opening publishes its compensation band upfront, and participating employers cover all
              recruitment and work-permit sponsorship expenses.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={onBrowseRoles}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-blue-700 rounded-md hover:bg-blue-800 transition-colors whitespace-nowrap shrink-0"
              >
                Browse Open Roles
                <ArrowDownRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={onViewCharter}
                className="px-4 py-2.5 text-sm font-medium text-slate-700 hover:text-slate-900 underline underline-offset-4 decoration-slate-300 hover:decoration-slate-900 transition-colors whitespace-nowrap shrink-0"
              >
                Read Zero-Fee Charter
              </button>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative w-full aspect-video lg:aspect-auto lg:h-full min-h-[260px] rounded-lg overflow-hidden border border-slate-200 bg-slate-900">
              {!imageError ? (
                <img
                  src={HERO_IMAGE_PATH}
                  alt="Sunlit international corporate atrium with architectural dark navy steel beams and modern workspaces"
                  referrerPolicy="no-referrer"
                  onError={() => setImageError(true)}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 text-slate-200">
                  <Building2 className="w-10 h-10 text-blue-300 mb-3" />
                  <p className="font-display text-lg font-semibold">Meridian Talent Network</p>
                  <p className="text-sm text-slate-400 mt-1">
                    Verified international employer offices
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-slate-200 grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <p className="font-mono text-2xl font-medium text-slate-900 tabular-nums">$0</p>
            <p className="mt-1 text-sm text-slate-600">Application or processing fees for candidates</p>
          </div>
          <div>
            <p className="font-mono text-2xl font-medium text-slate-900 tabular-nums">
              {openRoleCount}
            </p>
            <p className="mt-1 text-sm text-slate-600">Active verified roles with salary ranges</p>
          </div>
          <div>
            <p className="font-mono text-2xl font-medium text-slate-900 tabular-nums">
              {sponsoredCount}
            </p>
            <p className="mt-1 text-sm text-slate-600">Roles offering employer-funded sponsorship</p>
          </div>
          <div>
            <p className="font-mono text-2xl font-medium text-slate-900 tabular-nums">
              {countryCount}
            </p>
            <p className="mt-1 text-sm text-slate-600">Hiring countries with direct team review</p>
          </div>
        </div>
      </div>
    </section>
  );
}
