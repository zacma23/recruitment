import { ChangeEvent, FormEvent, useState } from 'react';
import { CheckCircle2, FileText, Upload, X } from 'lucide-react';
import { ApplicationRecord, JobRole } from '../types/portal';

interface ApplicationModalProps {
  role: JobRole;
  onClose: () => void;
  onSubmitApplication: (record: ApplicationRecord) => void;
  onGoToApplications: () => void;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  location?: string;
  yearsExperience?: string;
  portfolioUrl?: string;
  coverNote?: string;
  feeAck?: string;
}

export function ApplicationModal({
  role,
  onClose,
  onSubmitApplication,
  onGoToApplications,
}: ApplicationModalProps) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [location, setLocation] = useState('');
  const [yearsExperience, setYearsExperience] = useState('3–5 years');
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [resumeFileName, setResumeFileName] = useState('');
  const [coverNote, setCoverNote] = useState('');
  const [feeAck, setFeeAck] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submittedRecord, setSubmittedRecord] = useState<ApplicationRecord | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setResumeFileName(`${file.name} (${Math.max(1, Math.round(file.size / 1024))} KB)`);
    }
  };

  const validate = (): FormErrors => {
    const next: FormErrors = {};
    if (fullName.trim().length < 2) {
      next.fullName = 'Enter your full name.';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      next.email = 'Enter a valid email address.';
    }
    if (location.trim().length < 2) {
      next.location = 'Enter your current city and country.';
    }
    if (portfolioUrl.trim()) {
      try {
        const parsed = new URL(portfolioUrl.trim());
        if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
          next.portfolioUrl = 'URL must start with https:// or http://';
        }
      } catch {
        next.portfolioUrl = 'Enter a valid link (e.g., https://linkedin.com/in/...).';
      }
    }
    if (coverNote.trim().length < 20) {
      next.coverNote = 'Provide a brief note on your relevant experience (at least 20 characters).';
    }
    if (!feeAck) {
      next.feeAck = 'Confirm you understand this application is completely free.';
    }
    return next;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    const today = new Date().toISOString().slice(0, 10);
    const newRecord: ApplicationRecord = {
      id: `app-${Date.now()}`,
      referenceId: `APP-2026-${randomDigits}`,
      roleId: role.id,
      roleTitle: role.title,
      employer: role.employer,
      location: role.location,
      candidateName: fullName.trim(),
      candidateEmail: email.trim(),
      candidateLocation: location.trim(),
      yearsExperience,
      portfolioUrl: portfolioUrl.trim(),
      resumeFileName: resumeFileName || 'Not attached',
      coverNote: coverNote.trim(),
      submittedDate: today,
      stage: 'Submitted',
    };

    onSubmitApplication(newRecord);
    setSubmittedRecord(newRecord);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="application-modal-title"
    >
      <div className="bg-white border border-slate-200 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-medium text-slate-500">
              {role.employer} · <span className="font-mono tabular-nums">{role.referenceCode}</span>
            </p>
            <h2
              id="application-modal-title"
              className="mt-0.5 font-display text-lg font-bold text-slate-900"
            >
              {submittedRecord ? 'Application Submitted' : `Apply for ${role.title}`}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close application form"
            className="p-2 text-slate-500 hover:text-slate-900 rounded-md"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submittedRecord ? (
          <div className="p-6 sm:p-8 space-y-6">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-display text-base font-semibold text-slate-900">
                  Your direct application has been recorded
                </h3>
                <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                  {role.employer} reviews applications directly with zero candidate fees. Track
                  your status anytime under My Applications.
                </p>
              </div>
            </div>

            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4 border-y border-slate-200 text-sm">
              <div>
                <dt className="text-xs text-slate-500">Application Reference</dt>
                <dd className="mt-0.5 font-mono font-medium text-slate-900 tabular-nums">
                  {submittedRecord.referenceId}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-slate-500">Submitted Date</dt>
                <dd className="mt-0.5 font-mono text-slate-900 tabular-nums">
                  {submittedRecord.submittedDate}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-slate-500">Applicant</dt>
                <dd className="mt-0.5 text-slate-900">{submittedRecord.candidateName}</dd>
              </div>
              <div>
                <dt className="text-xs text-slate-500">Application Fee</dt>
                <dd className="mt-0.5 font-medium text-emerald-700">$0 (Free)</dd>
              </div>
            </dl>

            <div className="flex flex-wrap items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-slate-700 border border-slate-300 rounded-md hover:bg-slate-50 transition-colors"
              >
                Return to Open Roles
              </button>
              <button
                type="button"
                onClick={onGoToApplications}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-700 rounded-md hover:bg-blue-800 transition-colors"
              >
                View My Applications
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="p-6 space-y-5">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-md text-xs text-slate-700 leading-relaxed">
              <strong className="font-semibold text-slate-900">Candidate Protection Notice:</strong>{' '}
              Applying on Meridian Talent is 100% free. Do not share passport copies, bank account
              numbers, or payment card details during initial application.
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="candidate-name"
                  className="block text-xs font-medium text-slate-700 mb-1.5"
                >
                  Full Name *
                </label>
                <input
                  id="candidate-name"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Jordan Rivera"
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-md text-slate-900 focus:border-blue-700 focus:outline-none"
                />
                {errors.fullName && (
                  <p className="mt-1 text-xs text-red-700">{errors.fullName}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="candidate-email"
                  className="block text-xs font-medium text-slate-700 mb-1.5"
                >
                  Email Address *
                </label>
                <input
                  id="candidate-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jordan.rivera@example.com"
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-md text-slate-900 focus:border-blue-700 focus:outline-none"
                />
                {errors.email && <p className="mt-1 text-xs text-red-700">{errors.email}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="candidate-location"
                  className="block text-xs font-medium text-slate-700 mb-1.5"
                >
                  Current City & Country *
                </label>
                <input
                  id="candidate-location"
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Warsaw, Poland"
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-md text-slate-900 focus:border-blue-700 focus:outline-none"
                />
                {errors.location && (
                  <p className="mt-1 text-xs text-red-700">{errors.location}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="candidate-experience"
                  className="block text-xs font-medium text-slate-700 mb-1.5"
                >
                  Relevant Experience
                </label>
                <select
                  id="candidate-experience"
                  value={yearsExperience}
                  onChange={(e) => setYearsExperience(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-md text-slate-900 focus:border-blue-700 focus:outline-none"
                >
                  <option value="1–2 years">1–2 years</option>
                  <option value="3–5 years">3–5 years</option>
                  <option value="6–9 years">6–9 years</option>
                  <option value="10+ years">10+ years</option>
                </select>
              </div>
            </div>

            <div>
              <label
                htmlFor="candidate-portfolio"
                className="block text-xs font-medium text-slate-700 mb-1.5"
              >
                LinkedIn, GitHub, or Portfolio URL (optional)
              </label>
              <input
                id="candidate-portfolio"
                type="url"
                value={portfolioUrl}
                onChange={(e) => setPortfolioUrl(e.target.value)}
                placeholder="https://linkedin.com/in/yourprofile"
                className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-md text-slate-900 focus:border-blue-700 focus:outline-none"
              />
              {errors.portfolioUrl && (
                <p className="mt-1 text-xs text-red-700">{errors.portfolioUrl}</p>
              )}
            </div>

            <div>
              <span className="block text-xs font-medium text-slate-700 mb-1.5">
                Resume / CV (PDF, DOC, DOCX — optional)
              </span>
              {resumeFileName ? (
                <div className="flex items-center justify-between gap-3 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-sm">
                  <span className="inline-flex items-center gap-2 text-slate-800 truncate">
                    <FileText className="w-4 h-4 text-blue-700 shrink-0" />
                    <span className="truncate">{resumeFileName}</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setResumeFileName('')}
                    className="text-xs font-medium text-slate-600 hover:text-red-700 shrink-0"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <label className="flex items-center justify-center gap-2 px-4 py-3 border border-dashed border-slate-300 rounded-md text-sm text-slate-600 hover:border-blue-700 hover:text-slate-900 cursor-pointer transition-colors">
                  <Upload className="w-4 h-4" />
                  <span>Select Resume File</span>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    className="sr-only"
                  />
                </label>
              )}
            </div>

            <div>
              <label
                htmlFor="candidate-cover"
                className="block text-xs font-medium text-slate-700 mb-1.5"
              >
                Summary of Relevant Experience *
              </label>
              <textarea
                id="candidate-cover"
                rows={4}
                value={coverNote}
                onChange={(e) => setCoverNote(e.target.value)}
                placeholder="Highlight key projects, domain experience, and availability for this role..."
                className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-md text-slate-900 focus:border-blue-700 focus:outline-none"
              />
              {errors.coverNote && (
                <p className="mt-1 text-xs text-red-700">{errors.coverNote}</p>
              )}
            </div>

            <div>
              <label className="flex items-start gap-2.5 text-xs text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={feeAck}
                  onChange={(e) => setFeeAck(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded border-slate-300 text-blue-700 focus:ring-blue-700"
                />
                <span>
                  I understand this is a free, direct application and that Meridian Talent and its
                  employers never charge candidates application or visa-processing fees.
                </span>
              </label>
              {errors.feeAck && <p className="mt-1 text-xs text-red-700">{errors.feeAck}</p>}
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
                className="px-5 py-2 text-sm font-medium text-white bg-blue-700 rounded-md hover:bg-blue-800 transition-colors"
              >
                Submit Application
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
