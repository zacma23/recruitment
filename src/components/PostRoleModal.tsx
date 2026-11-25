import { FormEvent, useState } from 'react';
import { X } from 'lucide-react';
import { Department, NewRoleInput, WorkMode } from '../types/portal';

interface PostRoleModalProps {
  onClose: () => void;
  onPublishRole: (input: NewRoleInput) => void;
}

interface RoleErrors {
  title?: string;
  employer?: string;
  location?: string;
  country?: string;
  salaryRange?: string;
  summary?: string;
  zeroFeePledge?: string;
}

export function PostRoleModal({ onClose, onPublishRole }: PostRoleModalProps) {
  const [title, setTitle] = useState('');
  const [employer, setEmployer] = useState('');
  const [department, setDepartment] = useState<Department>('Engineering');
  const [location, setLocation] = useState('');
  const [country, setCountry] = useState('');
  const [workMode, setWorkMode] = useState<WorkMode>('Hybrid');
  const [salaryRange, setSalaryRange] = useState('');
  const [visaSponsorship, setVisaSponsorship] = useState(true);
  const [relocationSupport, setRelocationSupport] = useState('');
  const [summary, setSummary] = useState('');
  const [responsibilitiesText, setResponsibilitiesText] = useState('');
  const [qualificationsText, setQualificationsText] = useState('');
  const [zeroFeePledge, setZeroFeePledge] = useState(false);
  const [errors, setErrors] = useState<RoleErrors>({});

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const nextErrors: RoleErrors = {};

    if (title.trim().length < 3) nextErrors.title = 'Enter the role title.';
    if (employer.trim().length < 2) nextErrors.employer = 'Enter the hiring company name.';
    if (location.trim().length < 2) nextErrors.location = 'Enter city and country.';
    if (country.trim().length < 2) nextErrors.country = 'Enter hiring country.';
    if (salaryRange.trim().length < 4) {
      nextErrors.salaryRange = 'Include a transparent salary band (e.g., EUR 70,000 – 85,000 / yr).';
    }
    if (summary.trim().length < 20) {
      nextErrors.summary = 'Provide a clear role summary (at least 20 characters).';
    }
    if (!zeroFeePledge) {
      nextErrors.zeroFeePledge = 'Employers must confirm candidates are never charged fees.';
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const parseLines = (raw: string, fallback: string[]) => {
      const lines = raw
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean);
      return lines.length > 0 ? lines : fallback;
    };

    onPublishRole({
      title: title.trim(),
      employer: employer.trim(),
      department,
      location: location.trim(),
      country: country.trim(),
      workMode,
      salaryRange: salaryRange.trim(),
      visaSponsorship,
      relocationSupport:
        relocationSupport.trim() ||
        (visaSponsorship
          ? 'Employer sponsors work permit and covers relocation documentation costs directly.'
          : 'Candidates must hold existing work authorization in the hiring country.'),
      summary: summary.trim(),
      responsibilities: parseLines(responsibilitiesText, [
        'Deliver core domain objectives in partnership with cross-functional team leads.',
        'Maintain clear operational documentation and quality standards.',
      ]),
      qualifications: parseLines(qualificationsText, [
        'Demonstrated professional experience in a comparable role.',
        'Clear written and verbal collaboration skills across distributed teams.',
      ]),
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="post-role-modal-title"
    >
      <div className="bg-white border border-slate-200 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-medium text-slate-500">Employer Submission</p>
            <h2
              id="post-role-modal-title"
              className="mt-0.5 font-display text-lg font-bold text-slate-900"
            >
              Post a Verified Zero-Fee Role
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close post role form"
            className="p-2 text-slate-500 hover:text-slate-900 rounded-md"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate className="p-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="role-title" className="block text-xs font-medium text-slate-700 mb-1.5">
                Role Title *
              </label>
              <input
                id="role-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Senior Civil Project Engineer"
                className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-md text-slate-900 focus:border-blue-700 focus:outline-none"
              />
              {errors.title && <p className="mt-1 text-xs text-red-700">{errors.title}</p>}
            </div>

            <div>
              <label htmlFor="role-employer" className="block text-xs font-medium text-slate-700 mb-1.5">
                Hiring Company *
              </label>
              <input
                id="role-employer"
                type="text"
                value={employer}
                onChange={(e) => setEmployer(e.target.value)}
                placeholder="Northbridge Engineering GmbH"
                className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-md text-slate-900 focus:border-blue-700 focus:outline-none"
              />
              {errors.employer && <p className="mt-1 text-xs text-red-700">{errors.employer}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor="role-dept" className="block text-xs font-medium text-slate-700 mb-1.5">
                Department
              </label>
              <select
                id="role-dept"
                value={department}
                onChange={(e) => setDepartment(e.target.value as Department)}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-md text-slate-900 focus:border-blue-700 focus:outline-none"
              >
                <option value="Engineering">Engineering</option>
                <option value="Operations">Operations</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Finance">Finance</option>
                <option value="Logistics">Logistics</option>
              </select>
            </div>

            <div>
              <label htmlFor="role-location" className="block text-xs font-medium text-slate-700 mb-1.5">
                City, Country *
              </label>
              <input
                id="role-location"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Zurich, Switzerland"
                className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-md text-slate-900 focus:border-blue-700 focus:outline-none"
              />
              {errors.location && <p className="mt-1 text-xs text-red-700">{errors.location}</p>}
            </div>

            <div>
              <label htmlFor="role-country" className="block text-xs font-medium text-slate-700 mb-1.5">
                Country *
              </label>
              <input
                id="role-country"
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="Switzerland"
                className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-md text-slate-900 focus:border-blue-700 focus:outline-none"
              />
              {errors.country && <p className="mt-1 text-xs text-red-700">{errors.country}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="role-salary" className="block text-xs font-medium text-slate-700 mb-1.5">
                Published Compensation Band *
              </label>
              <input
                id="role-salary"
                type="text"
                value={salaryRange}
                onChange={(e) => setSalaryRange(e.target.value)}
                placeholder="CHF 115,000 – 130,000 / yr"
                className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-md text-slate-900 focus:border-blue-700 focus:outline-none"
              />
              {errors.salaryRange && (
                <p className="mt-1 text-xs text-red-700">{errors.salaryRange}</p>
              )}
            </div>

            <div>
              <label htmlFor="role-workmode" className="block text-xs font-medium text-slate-700 mb-1.5">
                Work Model
              </label>
              <select
                id="role-workmode"
                value={workMode}
                onChange={(e) => setWorkMode(e.target.value as WorkMode)}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-md text-slate-900 focus:border-blue-700 focus:outline-none"
              >
                <option value="Hybrid">Hybrid</option>
                <option value="Remote">Remote</option>
                <option value="On-site">On-site</option>
              </select>
            </div>
          </div>

          <div className="space-y-3">
            <label className="inline-flex items-center gap-2 text-xs font-medium text-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={visaSponsorship}
                onChange={(e) => setVisaSponsorship(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-blue-700 focus:ring-blue-700"
              />
              Employer funds work visa sponsorship for eligible international hires
            </label>

            <div>
              <label
                htmlFor="role-relocation"
                className="block text-xs font-medium text-slate-700 mb-1.5"
              >
                Relocation / Authorization Details (optional)
              </label>
              <input
                id="role-relocation"
                type="text"
                value={relocationSupport}
                onChange={(e) => setRelocationSupport(e.target.value)}
                placeholder="Employer covers permit legal fees and initial relocation flight."
                className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-md text-slate-900 focus:border-blue-700 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label htmlFor="role-summary" className="block text-xs font-medium text-slate-700 mb-1.5">
              Role Overview *
            </label>
            <textarea
              id="role-summary"
              rows={3}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Describe the team mission, scope of work, and day-to-day focus..."
              className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-md text-slate-900 focus:border-blue-700 focus:outline-none"
            />
            {errors.summary && <p className="mt-1 text-xs text-red-700">{errors.summary}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="role-responsibilities"
                className="block text-xs font-medium text-slate-700 mb-1.5"
              >
                Responsibilities (one per line)
              </label>
              <textarea
                id="role-responsibilities"
                rows={3}
                value={responsibilitiesText}
                onChange={(e) => setResponsibilitiesText(e.target.value)}
                placeholder="Lead quarterly site reviews&#10;Coordinate supplier schedules"
                className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-md text-slate-900 focus:border-blue-700 focus:outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="role-qualifications"
                className="block text-xs font-medium text-slate-700 mb-1.5"
              >
                Qualifications (one per line)
              </label>
              <textarea
                id="role-qualifications"
                rows={3}
                value={qualificationsText}
                onChange={(e) => setQualificationsText(e.target.value)}
                placeholder="4+ years domain experience&#10;Fluent English communication"
                className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-md text-slate-900 focus:border-blue-700 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="flex items-start gap-2.5 text-xs text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={zeroFeePledge}
                onChange={(e) => setZeroFeePledge(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded border-slate-300 text-blue-700 focus:ring-blue-700"
              />
              <span>
                We confirm that candidates will never be charged application, recruitment, offer
                letter, or visa-processing fees for this position.
              </span>
            </label>
            {errors.zeroFeePledge && (
              <p className="mt-1 text-xs text-red-700">{errors.zeroFeePledge}</p>
            )}
          </div>

          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-700 border border-slate-300 rounded-md hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-sm font-medium text-white bg-slate-900 rounded-md hover:bg-blue-800 transition-colors"
            >
              Publish Role
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
