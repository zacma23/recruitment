import { useState } from 'react';
import { ShieldCheck } from 'lucide-react';

interface CandidateCharterViewProps {
  onBrowseRoles: () => void;
}

const CHARTER_IMAGE_PATH = '/src/assets/images/charter_interview_room_1795629497148.jpg';

const CHARTER_PRINCIPLES = [
  {
    index: '01.',
    title: 'Zero Candidate Fees',
    body: 'Candidates never pay application fees, interview deposits, offer-letter release charges, or administrative retainers. Under international fair-recruitment standards, hiring expenses belong strictly to the employer.',
  },
  {
    index: '02.',
    title: 'Direct Employer Accountability',
    body: 'Every opening lists the legal hiring organization, reference code, work location, and interview stages upfront. Offers are issued directly on verified employer letterhead only after structured interviews.',
  },
  {
    index: '03.',
    title: 'Transparent Compensation & Work Authorization',
    body: 'Salary bands are published before you invest time applying. Where international sponsorship is offered, the employer specifies which permit filing and relocation costs they fund directly.',
  },
  {
    index: '04.',
    title: 'Recognizing Recruitment Fraud',
    body: 'Treat any message demanding payment within 24–72 hours to unlock a job offer or visa process as fraudulent. Never wire money, pay via personal checkout links, or send passport scans before verifying an employer independently.',
  },
];

export function CandidateCharterView({ onBrowseRoles }: CandidateCharterViewProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch pb-10 border-b border-slate-200">
        <div className="lg:col-span-6 flex flex-col justify-center">
          <p className="text-sm font-medium text-blue-700 mb-3">Candidate Protection Standard</p>
          <h1
            className="font-display font-bold tracking-tight text-slate-900 leading-[1.15] [text-wrap:balance]"
            style={{ fontSize: 'clamp(2rem, 3.2vw, 2.75rem)' }}
          >
            Ethical international hiring starts with zero upfront fees.
          </h1>
          <p className="mt-4 text-base text-slate-600 leading-relaxed max-w-xl">
            Meridian Talent operates on the Employer Pays Principle aligned with International
            Labour Organization (ILO) guidelines. Employers fund recruitment and sponsorship;
            applicants apply directly at no cost.
          </p>
          <div className="mt-7">
            <button
              type="button"
              onClick={onBrowseRoles}
              className="px-5 py-2.5 text-sm font-medium text-white bg-blue-700 rounded-md hover:bg-blue-800 transition-colors"
            >
              Browse Verified Roles
            </button>
          </div>
        </div>

        <div className="lg:col-span-6">
          <div className="w-full aspect-[4/3] lg:h-full rounded-lg overflow-hidden border border-slate-200 bg-slate-900">
            {!imageError ? (
              <img
                src={CHARTER_IMAGE_PATH}
                alt="Sunlit corporate interview room with a light oak table and glass walls"
                referrerPolicy="no-referrer"
                onError={() => setImageError(true)}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-slate-900 to-slate-800 text-slate-200">
                <ShieldCheck className="w-10 h-10 text-blue-300 mb-3" />
                <p className="font-display text-lg font-semibold">Employer Pays Principle</p>
                <p className="text-sm text-slate-400 mt-1">
                  Transparent direct hiring without candidate fees
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8">
        {CHARTER_PRINCIPLES.map((principle) => (
          <div
            key={principle.index}
            className="bg-white border border-slate-200 rounded-lg p-6 lg:p-7"
          >
            <h2 className="font-display text-lg font-semibold text-slate-900">
              <span className="font-mono text-sm font-medium text-blue-700 mr-2 tabular-nums">
                {principle.index}
              </span>
              {principle.title}
            </h2>
            <p className="mt-3 text-sm text-slate-600 leading-relaxed max-w-[65ch]">
              {principle.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
