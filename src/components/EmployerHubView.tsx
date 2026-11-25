import { FormEvent, useEffect, useMemo, useState } from 'react';
import { Check, Plus, Search, Send } from 'lucide-react';
import {
  ApplicationRecord,
  ApplicationStage,
  JobRole,
  MessageItem,
  RoleStatus,
} from '../types/portal';

interface EmployerHubViewProps {
  jobs: JobRole[];
  applications: ApplicationRecord[];
  messages: MessageItem[];
  onUpdateRoleStatus: (roleId: string, status: RoleStatus) => void;
  onUpdateApplicationStage: (
    applicationId: string,
    stage: ApplicationStage,
    interviewDate: string,
    candidateNote: string
  ) => void;
  onSendMessage: (applicationId: string, body: string, sender: 'candidate' | 'employer') => void;
  onMarkThreadRead: (applicationId: string, viewer: 'candidate' | 'employer') => void;
  onOpenPostRole: () => void;
}

type HubTab = 'pipeline' | 'listings' | 'inbox';

const MANAGEABLE_STAGES: ApplicationStage[] = [
  'Submitted',
  'Under Review',
  'Interview Scheduled',
  'Offer Issued',
  'Hired',
  'Not Selected',
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

export function EmployerHubView({
  jobs,
  applications,
  messages,
  onUpdateRoleStatus,
  onUpdateApplicationStage,
  onSendMessage,
  onMarkThreadRead,
  onOpenPostRole,
}: EmployerHubViewProps) {
  const [activeTab, setActiveTab] = useState<HubTab>('pipeline');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAppId, setSelectedAppId] = useState<string | null>(applications[0]?.id ?? null);

  const [stageInput, setStageInput] = useState<ApplicationStage>('Under Review');
  const [interviewInput, setInterviewInput] = useState('');
  const [updateNoteInput, setUpdateNoteInput] = useState('');
  const [saveFeedback, setSaveFeedback] = useState(false);

  const [inboxAppId, setInboxAppId] = useState<string | null>(applications[0]?.id ?? null);
  const [replyDraft, setReplyDraft] = useState('');

  const filteredApplications = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return applications;
    return applications.filter(
      (app) =>
        app.candidateName.toLowerCase().includes(q) ||
        app.roleTitle.toLowerCase().includes(q) ||
        app.referenceId.toLowerCase().includes(q) ||
        app.employer.toLowerCase().includes(q)
    );
  }, [applications, searchQuery]);

  const activePipelineApp = useMemo(() => {
    if (filteredApplications.length === 0) return null;
    return filteredApplications.find((a) => a.id === selectedAppId) ?? filteredApplications[0];
  }, [filteredApplications, selectedAppId]);

  useEffect(() => {
    if (activePipelineApp) {
      setStageInput(
        activePipelineApp.stage === 'Withdrawn' ? 'Under Review' : activePipelineApp.stage
      );
      setInterviewInput(activePipelineApp.interviewDate ?? '');
      setUpdateNoteInput('');
      setSaveFeedback(false);
    }
  }, [activePipelineApp]);

  const activeInboxApp = useMemo(() => {
    if (applications.length === 0) return null;
    return applications.find((a) => a.id === inboxAppId) ?? applications[0];
  }, [applications, inboxAppId]);

  useEffect(() => {
    if (activeTab === 'inbox' && activeInboxApp) {
      onMarkThreadRead(activeInboxApp.id, 'employer');
    }
  }, [activeTab, activeInboxApp, onMarkThreadRead]);

  const publishedCount = jobs.filter((j) => j.status === 'Published').length;
  const activeApplicantCount = applications.filter((a) => a.stage !== 'Withdrawn').length;
  const scheduledCount = applications.filter((a) => a.stage === 'Interview Scheduled').length;
  const unreadFromCandidates = messages.filter(
    (m) => m.sender === 'candidate' && !m.readByEmployer
  ).length;

  const handleStageUpdate = (e: FormEvent) => {
    e.preventDefault();
    if (!activePipelineApp || activePipelineApp.stage === 'Withdrawn') return;
    onUpdateApplicationStage(
      activePipelineApp.id,
      stageInput,
      interviewInput.trim(),
      updateNoteInput.trim()
    );
    setUpdateNoteInput('');
    setSaveFeedback(true);
  };

  const handleEmployerSend = (e: FormEvent) => {
    e.preventDefault();
    if (!activeInboxApp || !replyDraft.trim()) return;
    onSendMessage(activeInboxApp.id, replyDraft.trim(), 'employer');
    setReplyDraft('');
  };

  const activeInboxMessages = useMemo(() => {
    if (!activeInboxApp) return [];
    return messages.filter((m) => m.applicationId === activeInboxApp.id);
  }, [messages, activeInboxApp]);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-12">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <p className="text-xs font-medium text-blue-700 mb-1">
            Recruiting Administration · Zero Candidate Fee Policy
          </p>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Employer Hub
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Manage verified openings, review candidate applications, and send interview updates.
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenPostRole}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-slate-900 rounded-md hover:bg-blue-800 transition-colors whitespace-nowrap shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Post a Role
        </button>
      </div>

      <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4 pb-6 border-b border-slate-200">
        <div className="bg-white border border-slate-200 rounded-lg p-5">
          <p className="text-xs text-slate-500">Published Roles</p>
          <p className="mt-1 font-mono text-2xl font-medium text-slate-900 tabular-nums">
            {publishedCount}
          </p>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-5">
          <p className="text-xs text-slate-500">Active Applications</p>
          <p className="mt-1 font-mono text-2xl font-medium text-slate-900 tabular-nums">
            {activeApplicantCount}
          </p>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-5">
          <p className="text-xs text-slate-500">Interviews Scheduled</p>
          <p className="mt-1 font-mono text-2xl font-medium text-slate-900 tabular-nums">
            {scheduledCount}
          </p>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-5">
          <p className="text-xs text-slate-500">Unread Candidate Replies</p>
          <p className="mt-1 font-mono text-2xl font-medium text-slate-900 tabular-nums">
            {unreadFromCandidates}
          </p>
        </div>
      </div>

      <div className="py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div
          role="tablist"
          aria-label="Employer Hub sections"
          className="flex items-center gap-1 p-1 bg-slate-100 rounded-md w-fit"
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'pipeline'}
            onClick={() => setActiveTab('pipeline')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'pipeline'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Applicant Pipeline ({applications.length})
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'listings'}
            onClick={() => setActiveTab('listings')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'listings'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Manage Listings ({jobs.length})
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'inbox'}
            onClick={() => setActiveTab('inbox')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap shrink-0 tabular-nums ${
              activeTab === 'inbox'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {unreadFromCandidates > 0 ? `Team Inbox (${unreadFromCandidates})` : 'Team Inbox'}
          </button>
        </div>

        {activeTab === 'pipeline' && (
          <div className="relative w-full sm:w-72">
            <Search
              className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              aria-hidden="true"
            />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search candidate, role, or ref..."
              aria-label="Search applications"
              className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-300 rounded-md text-slate-900 focus:border-blue-700 focus:outline-none"
            />
          </div>
        )}
      </div>

      {activeTab === 'pipeline' && (
        <>
          {filteredApplications.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-lg p-12 text-center">
              <p className="font-display text-base font-semibold text-slate-900">
                No matching applications
              </p>
              <p className="mt-1 text-sm text-slate-600">
                Submitted candidate applications will appear here for review and interview scheduling.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-5 bg-white border border-slate-200 rounded-lg divide-y divide-slate-200">
                {filteredApplications.map((app) => {
                  const isSelected = activePipelineApp?.id === app.id;
                  return (
                    <button
                      key={app.id}
                      type="button"
                      onClick={() => setSelectedAppId(app.id)}
                      className={`w-full text-left p-4 transition-colors ${
                        isSelected ? 'bg-slate-50' : 'bg-white hover:bg-slate-50/70'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 text-xs">
                        <span className="font-mono text-slate-500 tabular-nums">
                          {app.referenceId}
                        </span>
                        <span className={getStageTextStyle(app.stage)}>{app.stage}</span>
                      </div>
                      <p
                        className={`mt-1 font-display text-sm font-semibold ${
                          isSelected ? 'text-blue-800' : 'text-slate-900'
                        }`}
                      >
                        {app.candidateName}
                      </p>
                      <p className="text-xs text-slate-600 mt-0.5">
                        {app.roleTitle} · {app.employer}
                      </p>
                      <p className="text-xs text-slate-500 mt-1.5 font-mono tabular-nums">
                        Applied {app.submittedDate} · {app.yearsExperience}
                      </p>
                    </button>
                  );
                })}
              </div>

              {activePipelineApp && (
                <div className="lg:col-span-7 bg-white border border-slate-200 rounded-lg p-6 space-y-6">
                  <div className="pb-5 border-b border-slate-200 flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="text-xs text-slate-500">
                        <span className="font-mono tabular-nums">
                          {activePipelineApp.referenceId}
                        </span>{' '}
                        · {activePipelineApp.employer}
                      </p>
                      <h2 className="mt-1 font-display text-xl font-bold text-slate-900">
                        {activePipelineApp.candidateName}
                      </h2>
                      <p className="text-sm text-slate-600 mt-0.5">
                        {activePipelineApp.roleTitle} · {activePipelineApp.location}
                      </p>
                    </div>
                    <span className={`text-sm ${getStageTextStyle(activePipelineApp.stage)}`}>
                      {activePipelineApp.stage}
                    </span>
                  </div>

                  <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <dt className="text-slate-500">Candidate Email</dt>
                      <dd className="mt-0.5 text-slate-900 font-medium">
                        {activePipelineApp.candidateEmail}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-slate-500">Current Location & Experience</dt>
                      <dd className="mt-0.5 text-slate-900">
                        {activePipelineApp.candidateLocation} · {activePipelineApp.yearsExperience}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-slate-500">Resume / CV</dt>
                      <dd className="mt-0.5 text-slate-900">{activePipelineApp.resumeFileName}</dd>
                    </div>
                    <div>
                      <dt className="text-slate-500">Portfolio / Profile</dt>
                      <dd className="mt-0.5 text-slate-900 truncate">
                        {activePipelineApp.portfolioUrl || 'Not provided'}
                      </dd>
                    </div>
                  </dl>

                  <div>
                    <p className="text-xs font-medium text-slate-500">Candidate Cover Note</p>
                    <p className="mt-1.5 text-sm text-slate-700 leading-relaxed">
                      {activePipelineApp.coverNote}
                    </p>
                  </div>

                  {activePipelineApp.stage === 'Withdrawn' ? (
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-md text-xs text-slate-600">
                      This application was withdrawn by the candidate and is closed.
                    </div>
                  ) : (
                    <form
                      onSubmit={handleStageUpdate}
                      className="pt-5 border-t border-slate-200 space-y-4"
                    >
                      <h3 className="font-display text-sm font-semibold text-slate-900">
                        Update Hiring Stage & Notify Candidate
                      </h3>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label
                            htmlFor="stage-select"
                            className="block text-xs font-medium text-slate-700 mb-1.5"
                          >
                            Hiring Stage
                          </label>
                          <select
                            id="stage-select"
                            value={stageInput}
                            onChange={(e) => {
                              setStageInput(e.target.value as ApplicationStage);
                              setSaveFeedback(false);
                            }}
                            className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-md text-slate-900 focus:border-blue-700 focus:outline-none"
                          >
                            {MANAGEABLE_STAGES.map((stage) => (
                              <option key={stage} value={stage}>
                                {stage}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label
                            htmlFor="interview-date-input"
                            className="block text-xs font-medium text-slate-700 mb-1.5"
                          >
                            Interview Schedule (optional)
                          </label>
                          <input
                            id="interview-date-input"
                            type="text"
                            value={interviewInput}
                            onChange={(e) => {
                              setInterviewInput(e.target.value);
                              setSaveFeedback(false);
                            }}
                            placeholder="e.g., 2026-12-05 · 15:00 CET"
                            className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-md text-slate-900 focus:border-blue-700 focus:outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="candidate-update-note"
                          className="block text-xs font-medium text-slate-700 mb-1.5"
                        >
                          Message to Candidate (optional — posts to candidate inbox)
                        </label>
                        <textarea
                          id="candidate-update-note"
                          rows={3}
                          value={updateNoteInput}
                          onChange={(e) => {
                            setUpdateNoteInput(e.target.value);
                            setSaveFeedback(false);
                          }}
                          placeholder="Share interview agenda, next steps, or feedback..."
                          className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-md text-slate-900 focus:border-blue-700 focus:outline-none"
                        />
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <span className="text-xs text-slate-500">
                          All hiring stages are conducted with $0 candidate fees.
                        </span>
                        <div className="flex items-center gap-3">
                          {saveFeedback && (
                            <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700">
                              <Check className="w-3.5 h-3.5" />
                              Stage updated
                            </span>
                          )}
                          <button
                            type="submit"
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-700 rounded-md hover:bg-blue-800 transition-colors"
                          >
                            Save Stage Update
                          </button>
                        </div>
                      </div>
                    </form>
                  )}
                </div>
              )}
            </div>
          )}
        </>
      )}

      {activeTab === 'listings' && (
        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
          <div className="hidden lg:grid lg:grid-cols-12 gap-4 px-6 py-3 bg-slate-50 border-b border-slate-200 text-xs font-medium text-slate-500">
            <div className="col-span-2">Reference</div>
            <div className="col-span-4">Role & Employer</div>
            <div className="col-span-2">Location</div>
            <div className="col-span-1 text-right">Applicants</div>
            <div className="col-span-1">Status</div>
            <div className="col-span-2 text-right">Actions</div>
          </div>

          <div className="divide-y divide-slate-200">
            {jobs.map((job) => {
              const count = applications.filter((a) => a.roleId === job.id).length;
              return (
                <div
                  key={job.id}
                  className="px-6 py-4 grid grid-cols-1 lg:grid-cols-12 gap-3 lg:gap-4 items-center"
                >
                  <div className="lg:col-span-2 font-mono text-xs text-slate-600 tabular-nums">
                    {job.referenceCode}
                  </div>
                  <div className="lg:col-span-4">
                    <p className="font-display text-sm font-semibold text-slate-900">{job.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {job.employer} · <span className="font-mono tabular-nums">{job.salaryRange}</span>
                    </p>
                  </div>
                  <div className="lg:col-span-2 text-xs text-slate-600">{job.location}</div>
                  <div className="lg:col-span-1 lg:text-right font-mono text-xs text-slate-900 tabular-nums">
                    <span className="lg:hidden text-slate-500 font-sans mr-1">Applicants:</span>
                    {count}
                  </div>
                  <div className="lg:col-span-1 text-xs">
                    <span
                      className={
                        job.status === 'Published'
                          ? 'text-emerald-700 font-medium'
                          : job.status === 'Paused'
                          ? 'text-amber-700 font-medium'
                          : 'text-slate-500'
                      }
                    >
                      {job.status}
                    </span>
                  </div>
                  <div className="lg:col-span-2 flex items-center lg:justify-end gap-3 text-xs">
                    {job.status !== 'Published' && (
                      <button
                        type="button"
                        onClick={() => onUpdateRoleStatus(job.id, 'Published')}
                        className="font-medium text-blue-700 hover:text-blue-900 underline underline-offset-4"
                      >
                        Publish
                      </button>
                    )}
                    {job.status === 'Published' && (
                      <button
                        type="button"
                        onClick={() => onUpdateRoleStatus(job.id, 'Paused')}
                        className="font-medium text-slate-700 hover:text-slate-900 underline underline-offset-4"
                      >
                        Pause
                      </button>
                    )}
                    {job.status !== 'Closed' && (
                      <button
                        type="button"
                        onClick={() => onUpdateRoleStatus(job.id, 'Closed')}
                        className="font-medium text-slate-500 hover:text-red-700 underline underline-offset-4"
                      >
                        Close
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === 'inbox' && (
        <>
          {applications.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-lg p-12 text-center">
              <p className="text-sm text-slate-600">
                No candidate conversations yet. Messages appear once candidates apply.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-4 bg-white border border-slate-200 rounded-lg divide-y divide-slate-200">
                {applications.map((app) => {
                  const thread = messages.filter((m) => m.applicationId === app.id);
                  const unread = thread.filter(
                    (m) => m.sender === 'candidate' && !m.readByEmployer
                  ).length;
                  const isSelected = activeInboxApp?.id === app.id;

                  return (
                    <button
                      key={app.id}
                      type="button"
                      onClick={() => setInboxAppId(app.id)}
                      className={`w-full text-left p-4 transition-colors ${
                        isSelected ? 'bg-slate-50' : 'bg-white hover:bg-slate-50/70'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 text-xs text-slate-500">
                        <span className="font-mono tabular-nums">{app.referenceId}</span>
                        {unread > 0 && (
                          <span className="font-medium text-blue-700 tabular-nums">
                            {unread} new
                          </span>
                        )}
                      </div>
                      <p
                        className={`mt-1 font-display text-sm font-semibold ${
                          isSelected ? 'text-blue-800' : 'text-slate-900'
                        }`}
                      >
                        {app.candidateName}
                      </p>
                      <p className="text-xs text-slate-600 mt-0.5 truncate">{app.roleTitle}</p>
                    </button>
                  );
                })}
              </div>

              {activeInboxApp && (
                <div className="lg:col-span-8 bg-white border border-slate-200 rounded-lg flex flex-col min-h-[440px]">
                  <div className="px-6 py-4 border-b border-slate-200">
                    <p className="text-xs text-slate-500">
                      Conversation with {activeInboxApp.candidateName} ·{' '}
                      <span className="font-mono tabular-nums">{activeInboxApp.referenceId}</span>
                    </p>
                    <h2 className="mt-0.5 font-display text-base font-bold text-slate-900">
                      {activeInboxApp.roleTitle} ({activeInboxApp.employer})
                    </h2>
                  </div>

                  <div className="flex-1 p-6 space-y-5 overflow-y-auto max-h-[380px]">
                    {activeInboxMessages.length === 0 ? (
                      <p className="text-sm text-slate-500">
                        Send the first interview update or scheduling note to{' '}
                        {activeInboxApp.candidateName}.
                      </p>
                    ) : (
                      activeInboxMessages.map((msg) => {
                        const isEmployer = msg.sender === 'employer';
                        return (
                          <div
                            key={msg.id}
                            className={`flex flex-col ${isEmployer ? 'items-end' : 'items-start'}`}
                          >
                            <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                              <span className="font-medium text-slate-700">
                                {isEmployer ? `${msg.senderName} (Team)` : msg.senderName}
                              </span>
                              <span aria-hidden="true">·</span>
                              <span className="font-mono tabular-nums">{msg.sentAt}</span>
                            </div>
                            <div
                              className={`max-w-[85%] rounded-md px-4 py-3 text-sm leading-relaxed border ${
                                isEmployer
                                  ? 'bg-slate-900 text-white border-slate-900'
                                  : 'bg-slate-50 text-slate-800 border-slate-200'
                              }`}
                            >
                              {msg.body}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>

                  <form
                    onSubmit={handleEmployerSend}
                    className="p-4 border-t border-slate-200 flex items-end gap-3"
                  >
                    <div className="flex-1">
                      <label htmlFor="employer-reply-input" className="sr-only">
                        Send update to candidate
                      </label>
                      <textarea
                        id="employer-reply-input"
                        rows={2}
                        value={replyDraft}
                        onChange={(e) => setReplyDraft(e.target.value)}
                        placeholder={`Send an interview update to ${activeInboxApp.candidateName}...`}
                        className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-md text-slate-900 focus:border-blue-700 focus:outline-none resize-none"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={!replyDraft.trim()}
                      className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-blue-700 rounded-md hover:bg-blue-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors whitespace-nowrap shrink-0"
                    >
                      <Send className="w-4 h-4" />
                      Send Update
                    </button>
                  </form>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </section>
  );
}
