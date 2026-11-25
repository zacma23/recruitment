import { useMemo, useState } from 'react';
import {
  ArrowLeft,
  Bookmark,
  Check,
  Search,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import { Department, JobRole, WorkMode } from '../types/portal';

interface JobBoardProps {
  jobs: JobRole[];
  selectedRoleId: string | null;
  onSelectRole: (id: string) => void;
  savedRoleIds: string[];
  onToggleSave: (id: string) => void;
  appliedRoleIds: string[];
  onStartApply: (role: JobRole) => void;
}

const DEPARTMENTS: Array<'All' | Department> = [
  'All',
  'Engineering',
  'Operations',
  'Healthcare',
  'Finance',
  'Logistics',
];

const WORK_MODES: Array<'All' | WorkMode> = ['All', 'Remote', 'Hybrid', 'On-site'];

export function JobBoard({
  jobs,
  selectedRoleId,
  onSelectRole,
  savedRoleIds,
  onToggleSave,
  appliedRoleIds,
  onStartApply,
}: JobBoardProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState<'All' | Department>('All');
  const [workModeFilter, setWorkModeFilter] = useState<'All' | WorkMode>('All');
  const [visaOnly, setVisaOnly] = useState(false);
  const [savedOnly, setSavedOnly] = useState(false);
  const [mobileDetailOpen, setMobileDetailOpen] = useState(false);

  const publishedJobs = useMemo(
    () => jobs.filter((job) => job.status === 'Published'),
    [jobs]
  );

  const filteredJobs = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return publishedJobs.filter((job) => {
      if (departmentFilter !== 'All' && job.department !== departmentFilter) {
        return false;
      }
      if (workModeFilter !== 'All' && job.workMode !== workModeFilter) {
        return false;
      }
      if (visaOnly && !job.visaSponsorship) {
        return false;
      }
      if (savedOnly && !savedRoleIds.includes(job.id)) {
        return false;
      }
      if (!q) {
        return true;
      }
      return (
        job.title.toLowerCase().includes(q) ||
        job.employer.toLowerCase().includes(q) ||
        job.location.toLowerCase().includes(q) ||
        job.department.toLowerCase().includes(q) ||
        job.summary.toLowerCase().includes(q)
      );
    });
  }, [publishedJobs, searchQuery, departmentFilter, workModeFilter, visaOnly, savedOnly, savedRoleIds]);

  const activeRole = useMemo(() => {
    if (filteredJobs.length === 0) return null;
    const match = filteredJobs.find((job) => job.id === selectedRoleId);
    return match ?? filteredJobs[0];
  }, [filteredJobs, selectedRoleId]);

  const hasFilters =
    searchQuery.trim() !== '' ||
    departmentFilter !== 'All' ||
    workModeFilter !== 'All' ||
    visaOnly ||
    savedOnly;

  const resetFilters = () => {
    setSearchQuery('');
    setDepartmentFilter('All');
    setWorkModeFilter('All');
    setVisaOnly(false);
    setSavedOnly(false);
  };

  const handleRowSelect = (roleId: string) => {
    onSelectRole(roleId);
    setMobileDetailOpen(true);
  };

  return (
    <section id="open-roles" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h2 className="font-display text-2xl font-bold tracking-tight text-slate-900">
            Open Positions
          </h2>
          <p className="mt-1 text-sm text-slate-600 tabular-nums">
            Showing {filteredJobs.length} of {publishedJobs.length} published roles · Free direct application
          </p>
        </div>

        <div className="relative w-full md:w-80">
          <Search
            className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
            aria-hidden="true"
          />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search role, employer, or city..."
            aria-label="Search open roles"
            className="w-full pl-10 pr-9 py-2.5 text-sm bg-white border border-slate-300 rounded-md text-slate-900 placeholder:text-slate-400 focus:border-blue-700 focus:outline-none"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              aria-label="Clear search"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="py-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200">
        <div
          role="group"
          aria-label="Filter by department"
          className="flex items-center gap-1 p-1 bg-slate-100 rounded-md overflow-x-auto"
        >
          {DEPARTMENTS.map((dept) => {
            const active = departmentFilter === dept;
            return (
              <button
                key={dept}
                type="button"
                onClick={() => setDepartmentFilter(dept)}
                className={`px-3 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap shrink-0 ${
                  active
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {dept === 'All' ? 'All Departments' : dept}
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-slate-500 shrink-0" aria-hidden="true" />
            <label htmlFor="work-mode-select" className="text-xs font-medium text-slate-600">
              Work model
            </label>
            <select
              id="work-mode-select"
              value={workModeFilter}
              onChange={(e) => setWorkModeFilter(e.target.value as 'All' | WorkMode)}
              className="text-xs font-medium text-slate-900 bg-white border border-slate-300 rounded-md px-2.5 py-1.5 focus:border-blue-700 focus:outline-none"
            >
              {WORK_MODES.map((mode) => (
                <option key={mode} value={mode}>
                  {mode === 'All' ? 'All Models' : mode}
                </option>
              ))}
            </select>
          </div>

          <label className="inline-flex items-center gap-2 text-xs font-medium text-slate-700 select-none cursor-pointer">
            <input
              type="checkbox"
              checked={visaOnly}
              onChange={(e) => setVisaOnly(e.target.checked)}
              className="w-4 h-4 rounded border-slate-300 text-blue-700 focus:ring-blue-700"
            />
            Employer-sponsored visa only
          </label>

          <label className="inline-flex items-center gap-2 text-xs font-medium text-slate-700 select-none cursor-pointer tabular-nums">
            <input
              type="checkbox"
              checked={savedOnly}
              onChange={(e) => setSavedOnly(e.target.checked)}
              className="w-4 h-4 rounded border-slate-300 text-blue-700 focus:ring-blue-700"
            />
            Saved only ({savedRoleIds.length})
          </label>

          {hasFilters && (
            <button
              type="button"
              onClick={resetFilters}
              className="text-xs font-medium text-blue-700 hover:text-blue-900 underline underline-offset-4 whitespace-nowrap shrink-0"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {filteredJobs.length === 0 ? (
        <div className="py-16 text-center bg-white border border-slate-200 rounded-lg mt-6 px-6">
          <h3 className="font-display text-lg font-semibold text-slate-900">
            No matching openings
          </h3>
          <p className="mt-2 text-sm text-slate-600 max-w-md mx-auto">
            No roles match your current search or department filters. Clear your filters to view
            all available positions.
          </p>
          <button
            type="button"
            onClick={resetFilters}
            className="mt-5 px-4 py-2 text-sm font-medium text-white bg-slate-900 rounded-md hover:bg-blue-800 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div
            className={`lg:col-span-5 bg-white border border-slate-200 rounded-lg divide-y divide-slate-200 ${
              mobileDetailOpen ? 'hidden lg:block' : 'block'
            }`}
          >
            {filteredJobs.map((job) => {
              const isSelected = activeRole?.id === job.id;
              const isSaved = savedRoleIds.includes(job.id);
              const isApplied = appliedRoleIds.includes(job.id);

              return (
                <div
                  key={job.id}
                  onClick={() => handleRowSelect(job.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleRowSelect(job.id);
                    }
                  }}
                  className={`p-5 transition-colors cursor-pointer ${
                    isSelected ? 'bg-slate-50' : 'bg-white hover:bg-slate-50/70'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-slate-500">
                        {job.employer} · <span className="font-mono tabular-nums">{job.referenceCode}</span>
                      </p>
                      <h3
                        className={`mt-1 font-display text-base font-semibold leading-snug ${
                          isSelected ? 'text-blue-800' : 'text-slate-900'
                        }`}
                      >
                        {job.title}
                      </h3>
                    </div>

                    <button
                      type="button"
                      aria-label={isSaved ? `Remove ${job.title} from saved roles` : `Save ${job.title}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleSave(job.id);
                      }}
                      className={`p-2 rounded-md transition-colors shrink-0 ${
                        isSaved
                          ? 'text-blue-700 hover:bg-blue-50'
                          : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                    </button>
                  </div>

                  <div className="mt-2.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-600">
                    <span>{job.location}</span>
                    <span aria-hidden="true">·</span>
                    <span>{job.workMode}</span>
                    <span aria-hidden="true">·</span>
                    <span>{job.department}</span>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <span className="font-mono font-medium text-slate-900 tabular-nums">
                      {job.salaryRange}
                    </span>
                    <div className="flex items-center gap-2 text-slate-500">
                      {job.visaSponsorship && (
                        <span className="text-slate-700 font-medium">Employer visa sponsorship</span>
                      )}
                      {isApplied && (
                        <>
                          {job.visaSponsorship && <span aria-hidden="true">·</span>}
                          <span className="inline-flex items-center gap-1 font-medium text-emerald-700">
                            <Check className="w-3.5 h-3.5" />
                            Applied
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {activeRole && (
            <article
              className={`lg:col-span-7 bg-white border border-slate-200 rounded-lg p-6 lg:p-8 ${
                mobileDetailOpen ? 'block' : 'hidden lg:block'
              }`}
            >
              <button
                type="button"
                onClick={() => setMobileDetailOpen(false)}
                className="lg:hidden inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 mb-5"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Open Roles
              </button>

              <div className="pb-6 border-b border-slate-200">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500">
                  <span className="font-medium text-slate-700">{activeRole.employer}</span>
                  <span aria-hidden="true">·</span>
                  <span>{activeRole.department}</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono tabular-nums">Ref {activeRole.referenceCode}</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono tabular-nums">Posted {activeRole.postedDate}</span>
                </div>

                <h3 className="mt-2 font-display text-2xl font-bold tracking-tight text-slate-900 [text-wrap:balance]">
                  {activeRole.title}
                </h3>

                <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-600">
                  <span>{activeRole.location}</span>
                  <span aria-hidden="true">·</span>
                  <span>{activeRole.workMode}</span>
                  <span aria-hidden="true">·</span>
                  <span>{activeRole.employmentType}</span>
                </div>

                <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4 py-4 border-y border-slate-100">
                  <div>
                    <p className="text-xs text-slate-500">Published Compensation Band</p>
                    <p className="mt-0.5 font-mono text-sm font-medium text-slate-900 tabular-nums">
                      {activeRole.salaryRange}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Candidate Application Fee</p>
                    <p className="mt-0.5 text-sm font-medium text-emerald-700">
                      $0 — Always free to apply
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => onStartApply(activeRole)}
                    className="px-5 py-2.5 text-sm font-medium text-white bg-blue-700 rounded-md hover:bg-blue-800 transition-colors whitespace-nowrap shrink-0"
                  >
                    {appliedRoleIds.includes(activeRole.id)
                      ? 'Submit Updated Application'
                      : 'Apply for This Role'}
                  </button>
                  <button
                    type="button"
                    onClick={() => onToggleSave(activeRole.id)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 hover:text-slate-900 transition-colors whitespace-nowrap shrink-0"
                  >
                    <Bookmark
                      className={`w-4 h-4 ${
                        savedRoleIds.includes(activeRole.id) ? 'fill-blue-700 text-blue-700' : ''
                      }`}
                    />
                    {savedRoleIds.includes(activeRole.id) ? 'Saved' : 'Save Role'}
                  </button>
                </div>
              </div>

              <div className="py-6 space-y-6">
                <div>
                  <h4 className="font-display text-sm font-semibold text-slate-900">
                    Role Overview
                  </h4>
                  <p className="mt-2 text-sm text-slate-700 leading-relaxed max-w-[70ch]">
                    {activeRole.summary}
                  </p>
                </div>

                <div>
                  <h4 className="font-display text-sm font-semibold text-slate-900">
                    Relocation & Work Authorization Support
                  </h4>
                  <p className="mt-2 text-sm text-slate-700 leading-relaxed max-w-[70ch]">
                    {activeRole.relocationSupport}
                  </p>
                </div>

                <div>
                  <h4 className="font-display text-sm font-semibold text-slate-900">
                    Core Responsibilities
                  </h4>
                  <ul className="mt-2.5 space-y-2 text-sm text-slate-700 leading-relaxed list-disc pl-5">
                    {activeRole.responsibilities.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-display text-sm font-semibold text-slate-900">
                    Qualifications
                  </h4>
                  <ul className="mt-2.5 space-y-2 text-sm text-slate-700 leading-relaxed list-disc pl-5">
                    {activeRole.qualifications.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div className="pt-5 border-t border-slate-200">
                  <h4 className="font-display text-sm font-semibold text-slate-900">
                    Structured Hiring Process
                  </h4>
                  <ol className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {activeRole.hiringSteps.map((step, index) => (
                      <li key={step} className="text-sm text-slate-700">
                        <span className="font-mono text-xs font-medium text-blue-700 mr-2 tabular-nums">
                          0{index + 1}.
                        </span>
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </article>
          )}
        </div>
      )}
    </section>
  );
}
