import { useState } from 'react';
import { ChevronDown, ChevronUp, MessageSquare } from 'lucide-react';
import { ApplicationRecord, ApplicationStage } from '../types/portal';

interface ApplicationsViewProps {
  applications: ApplicationRecord[];
  onWithdraw: (id: string) => void;
  onOpenMessages: (applicationId: string) => void;
  onExploreRoles: () => void;
}

const PROGRESS_STEPS: ApplicationStage[] = [
  'Submitted',
  'Under Review',
  'Interview Scheduled',
  'Offer Issued',
  'Hired',
];

function getStageTextStyle(stage: ApplicationStage): string {
  switch (stage) {
    case 'Hired':
    case 'Offer Issued':
    case 'Interview Scheduled':
      return 'text-emerald-700 font-medium';
    case 'Under Review':
      return 'text-blue-700 font-medium';
    case 'Not Selected':
    case 'Withdrawn':
      return 'text-slate-500';
    case 'Submitted':
    default:
      return 'text-slate-800 font-medium';
  }
}

export function ApplicationsView({
  applications,
  onWithdraw,
  onOpenMessages,
  onExploreRoles,
}: ApplicationsViewProps) {
  const [expandedId, setExpandedId] = useState<string | null>(applications[0]?.id ?? null);
  const [confirmWithdrawId, setConfirmWithdrawId] = useState<string | null>(null);
  const [stageFilter, setStageFilter] = useState<'All' | ApplicationStage>('All');

  const filtered =
    stageFilter === 'All'
      ? applications
      : applications.filter((item) => item.stage === stageFilter);

  const stages: Array<'All' | ApplicationStage> = [
    'All',
    'Submitted',
    'Under Review',
    'Interview Scheduled',
    'Offer Issued',
    'Hired',
    'Withdrawn',
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-12">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            My Applications
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Track your direct applications, hiring milestones, and interview schedules.
          </p>
        </div>

        <button
          type="button"
          onClick={onExploreRoles}
          className="px-4 py-2 text-sm font-medium text-white bg-slate-900 rounded-md hover:bg-blue-800 transition-colors whitespace-nowrap shrink-0 self-start sm:self-auto"
        >
          Browse Open Roles
        </button>
      </div>

      {applications.length > 0 && (
        <div className="py-5 flex items-center justify-between gap-4 flex-wrap">
          <div
            role="group"
            aria-label="Filter applications by status"
            className="flex items-center gap-1 p-1 bg-slate-100 rounded-md overflow-x-auto"
          >
            {stages.map((stage) => (
              <button
                key={stage}
                type="button"
                onClick={() => setStageFilter(stage)}
                className={`px-3 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap shrink-0 ${
                  stageFilter === stage
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {stage === 'All' ? `All (${applications.length})` : stage}
              </button>
            ))}
          </div>
        </div>
      )}

      {applications.length === 0 ? (
        <div className="mt-6 bg-white border border-slate-200 rounded-lg p-12 text-center">
          <h2 className="font-display text-lg font-semibold text-slate-900">
            No applications submitted yet
          </h2>
          <p className="mt-2 text-sm text-slate-600 max-w-md mx-auto">
            Browse verified international roles and apply directly with zero candidate fees. Every
            submission appears here with a reference ID.
          </p>
          <button
            type="button"
            onClick={onExploreRoles}
            className="mt-5 px-5 py-2.5 text-sm font-medium text-white bg-blue-700 rounded-md hover:bg-blue-800 transition-colors"
          >
            Explore Open Roles
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="mt-4 bg-white border border-slate-200 rounded-lg p-10 text-center">
          <p className="text-sm text-slate-600">No applications currently in “{stageFilter}”.</p>
          <button
            type="button"
            onClick={() => setStageFilter('All')}
            className="mt-3 text-sm font-medium text-blue-700 hover:text-blue-900 underline underline-offset-4"
          >
            Show all applications
          </button>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
          <div className="hidden md:grid md:grid-cols-12 gap-4 px-6 py-3 bg-slate-50 border-b border-slate-200 text-xs font-medium text-slate-500">
            <div className="col-span-2">Reference</div>
            <div className="col-span-4">Role & Employer</div>
            <div className="col-span-2">Location</div>
            <div className="col-span-2">Submitted</div>
            <div className="col-span-2 text-right">Status</div>
          </div>

          <div className="divide-y divide-slate-200">
            {filtered.map((app) => {
              const isExpanded = expandedId === app.id;
              const confirming = confirmWithdrawId === app.id;
              const currentStepIndex = PROGRESS_STEPS.indexOf(app.stage);

              return (
                <div key={app.id} className="px-6 py-4">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 items-center">
                    <div className="md:col-span-2 font-mono text-xs font-medium text-slate-700 tabular-nums">
                      {app.referenceId}
                    </div>
                    <div className="md:col-span-4">
                      <p className="font-display text-sm font-semibold text-slate-900">
                        {app.roleTitle}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">{app.employer}</p>
                    </div>
                    <div className="md:col-span-2 text-xs text-slate-600">{app.location}</div>
                    <div className="md:col-span-2 font-mono text-xs text-slate-600 tabular-nums">
                      {app.submittedDate}
                    </div>
                    <div className="md:col-span-2 flex items-center md:justify-end justify-between gap-3">
                      <span className={`text-xs ${getStageTextStyle(app.stage)}`}>{app.stage}</span>
                      <button
                        type="button"
                        onClick={() => setExpandedId(isExpanded ? null : app.id)}
                        aria-expanded={isExpanded}
                        aria-label={isExpanded ? 'Hide application details' : 'View application details'}
                        className="p-1.5 text-slate-500 hover:text-slate-900 rounded"
                      >
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-slate-100 space-y-5">
                      {currentStepIndex >= 0 && (
                        <div>
                          <p className="text-xs font-medium text-slate-500 mb-2.5">
                            Hiring Progress ($0 Candidate Fees at Every Stage)
                          </p>
                          <ol className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                            {PROGRESS_STEPS.map((step, idx) => {
                              const reached = idx <= currentStepIndex;
                              const isCurrent = idx === currentStepIndex;
                              return (
                                <li
                                  key={step}
                                  className={`pt-2 border-t-2 text-xs ${
                                    isCurrent
                                      ? 'border-blue-700 text-blue-800 font-semibold'
                                      : reached
                                      ? 'border-slate-900 text-slate-800 font-medium'
                                      : 'border-slate-200 text-slate-400'
                                  }`}
                                >
                                  <span className="font-mono mr-1.5 tabular-nums">0{idx + 1}.</span>
                                  {step}
                                </li>
                              );
                            })}
                          </ol>
                        </div>
                      )}

                      {(app.interviewDate || app.recruiterNote) && (
                        <div className="p-4 bg-slate-50 border border-slate-200 rounded-md space-y-1 text-xs">
                          {app.interviewDate && (
                            <p className="text-slate-900 font-medium font-mono tabular-nums">
                              Scheduled Interview: {app.interviewDate}
                            </p>
                          )}
                          {app.recruiterNote && (
                            <p className="text-slate-600">{app.recruiterNote}</p>
                          )}
                        </div>
                      )}

                      <dl className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                        <div>
                          <dt className="text-slate-500">Applicant</dt>
                          <dd className="mt-0.5 text-slate-900 font-medium">
                            {app.candidateName} ({app.candidateEmail})
                          </dd>
                        </div>
                        <div>
                          <dt className="text-slate-500">Applicant Location & Experience</dt>
                          <dd className="mt-0.5 text-slate-900">
                            {app.candidateLocation} · {app.yearsExperience}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-slate-500">Resume / Attachment</dt>
                          <dd className="mt-0.5 text-slate-900 truncate">{app.resumeFileName}</dd>
                        </div>
                      </dl>

                      <div>
                        <p className="text-xs text-slate-500">Submitted Cover Note</p>
                        <p className="mt-1 text-sm text-slate-700 leading-relaxed max-w-[75ch]">
                          {app.coverNote}
                        </p>
                      </div>

                      <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
                        <button
                          type="button"
                          onClick={() => onOpenMessages(app.id)}
                          className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-slate-800 border border-slate-300 rounded-md hover:bg-slate-50 transition-colors"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          Open Messages with {app.employer}
                        </button>

                        {app.stage !== 'Withdrawn' && app.stage !== 'Hired' && (
                          <div className="flex flex-wrap items-center gap-3">
                            {confirming ? (
                              <>
                                <span className="text-xs text-slate-600">
                                  Withdraw this application?
                                </span>
                                <button
                                  type="button"
                                  onClick={() => setConfirmWithdrawId(null)}
                                  className="px-3 py-1.5 text-xs font-medium text-slate-700 border border-slate-300 rounded-md hover:bg-slate-50"
                                >
                                  Keep Active
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    onWithdraw(app.id);
                                    setConfirmWithdrawId(null);
                                  }}
                                  className="px-3 py-1.5 text-xs font-medium text-white bg-red-700 rounded-md hover:bg-red-800"
                                >
                                  Confirm Withdrawal
                                </button>
                              </>
                            ) : (
                              <button
                                type="button"
                                onClick={() => setConfirmWithdrawId(app.id)}
                                className="text-xs font-medium text-red-700 hover:text-red-900 underline underline-offset-4"
                              >
                                Withdraw Application
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
