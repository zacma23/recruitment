/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useCallback, useEffect, useMemo, useState } from 'react';
import { ApplicationModal } from './components/ApplicationModal';
import { ApplicationsView } from './components/ApplicationsView';
import { CandidateCharterView } from './components/CandidateCharterView';
import { EmployerHubView } from './components/EmployerHubView';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { JobBoard } from './components/JobBoard';
import { MessagesView } from './components/MessagesView';
import { PostRoleModal } from './components/PostRoleModal';
import { INITIAL_APPLICATIONS, INITIAL_JOBS, INITIAL_MESSAGES } from './data/initialJobs';
import {
  ApplicationRecord,
  ApplicationStage,
  JobRole,
  MessageItem,
  NewRoleInput,
  PortalView,
  RoleStatus,
} from './types/portal';

const STORAGE_KEYS = {
  jobs: 'meridian_talent_jobs_v2',
  applications: 'meridian_talent_applications_v2',
  messages: 'meridian_talent_messages_v2',
  saved: 'meridian_talent_saved_v2',
};

function readStoredArray<T>(key: string, fallback: T[]): T[] {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

function formatNowStamp(): string {
  const now = new Date();
  const date = now.toISOString().slice(0, 10);
  const hours = String(now.getHours()).padStart(2, '0');
  const mins = String(now.getMinutes()).padStart(2, '0');
  return `${date} ${hours}:${mins}`;
}

export default function App() {
  const [activeView, setActiveView] = useState<PortalView>('roles');
  const [jobs, setJobs] = useState<JobRole[]>(() =>
    readStoredArray<JobRole>(STORAGE_KEYS.jobs, INITIAL_JOBS)
  );
  const [applications, setApplications] = useState<ApplicationRecord[]>(() =>
    readStoredArray<ApplicationRecord>(STORAGE_KEYS.applications, INITIAL_APPLICATIONS)
  );
  const [messages, setMessages] = useState<MessageItem[]>(() =>
    readStoredArray<MessageItem>(STORAGE_KEYS.messages, INITIAL_MESSAGES)
  );
  const [savedRoleIds, setSavedRoleIds] = useState<string[]>(() =>
    readStoredArray<string>(STORAGE_KEYS.saved, ['role-rotterdam-logistics'])
  );

  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(
    () => jobs.find((j) => j.status === 'Published')?.id ?? null
  );
  const [focusedMessageAppId, setFocusedMessageAppId] = useState<string | null>(null);
  const [applyingRole, setApplyingRole] = useState<JobRole | null>(null);
  const [postRoleOpen, setPostRoleOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.jobs, JSON.stringify(jobs));
    } catch {
      // Ignore storage errors in restricted environments
    }
  }, [jobs]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.applications, JSON.stringify(applications));
    } catch {
      // Ignore storage errors
    }
  }, [applications]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.messages, JSON.stringify(messages));
    } catch {
      // Ignore storage errors
    }
  }, [messages]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.saved, JSON.stringify(savedRoleIds));
    } catch {
      // Ignore storage errors
    }
  }, [savedRoleIds]);

  const publishedJobs = useMemo(
    () => jobs.filter((job) => job.status === 'Published'),
    [jobs]
  );

  const appliedRoleIds = useMemo(
    () =>
      applications
        .filter((app) => app.stage !== 'Withdrawn')
        .map((app) => app.roleId),
    [applications]
  );

  const sponsoredCount = useMemo(
    () => publishedJobs.filter((job) => job.visaSponsorship).length,
    [publishedJobs]
  );

  const countryCount = useMemo(
    () => new Set(publishedJobs.map((job) => job.country)).size,
    [publishedJobs]
  );

  const unreadCandidateMessages = useMemo(
    () => messages.filter((m) => m.sender === 'employer' && !m.readByCandidate).length,
    [messages]
  );

  const handleToggleSave = (roleId: string) => {
    setSavedRoleIds((prev) =>
      prev.includes(roleId) ? prev.filter((id) => id !== roleId) : [roleId, ...prev]
    );
  };

  const handleSubmitApplication = (record: ApplicationRecord) => {
    setApplications((prev) => [record, ...prev]);
    const confirmationMsg: MessageItem = {
      id: `msg-${Date.now()}`,
      applicationId: record.id,
      sender: 'employer',
      senderName: `${record.employer} Hiring Team`,
      body: `We received your application for ${record.roleTitle} (Ref ${record.referenceId}). Our hiring team reviews applications directly and will message you here with next steps. As a reminder, all hiring stages are completely free for candidates.`,
      sentAt: formatNowStamp(),
      readByCandidate: false,
      readByEmployer: true,
    };
    setMessages((prev) => [...prev, confirmationMsg]);
  };

  const handleWithdrawApplication = (appId: string) => {
    setApplications((prev) =>
      prev.map((app) => (app.id === appId ? { ...app, stage: 'Withdrawn' } : app))
    );
  };

  const handleUpdateRoleStatus = (roleId: string, status: RoleStatus) => {
    setJobs((prev) => prev.map((job) => (job.id === roleId ? { ...job, status } : job)));
  };

  const handleUpdateApplicationStage = (
    applicationId: string,
    stage: ApplicationStage,
    interviewDate: string,
    candidateNote: string
  ) => {
    const target = applications.find((a) => a.id === applicationId);
    setApplications((prev) =>
      prev.map((app) =>
        app.id === applicationId
          ? {
              ...app,
              stage,
              interviewDate: interviewDate || app.interviewDate,
              recruiterNote: candidateNote || app.recruiterNote,
            }
          : app
      )
    );

    if (target) {
      const summaryLine =
        candidateNote ||
        `Your application status for ${target.roleTitle} (${target.referenceId}) has been updated to: ${stage}.${
          interviewDate ? ` Scheduled interview: ${interviewDate}.` : ''
        }`;

      const updateMsg: MessageItem = {
        id: `msg-${Date.now()}`,
        applicationId,
        sender: 'employer',
        senderName: `${target.employer} Hiring Team`,
        body: summaryLine,
        sentAt: formatNowStamp(),
        readByCandidate: false,
        readByEmployer: true,
      };
      setMessages((prev) => [...prev, updateMsg]);
    }
  };

  const handleSendMessage = (
    applicationId: string,
    body: string,
    sender: 'candidate' | 'employer'
  ) => {
    const app = applications.find((a) => a.id === applicationId);
    if (!app) return;

    const item: MessageItem = {
      id: `msg-${Date.now()}`,
      applicationId,
      sender,
      senderName: sender === 'candidate' ? app.candidateName : `${app.employer} Hiring Team`,
      body,
      sentAt: formatNowStamp(),
      readByCandidate: sender === 'candidate',
      readByEmployer: sender === 'employer',
    };
    setMessages((prev) => [...prev, item]);
  };

  const handleMarkThreadRead = useCallback(
    (applicationId: string, viewer: 'candidate' | 'employer') => {
      setMessages((prev) => {
        let changed = false;
        const next = prev.map((msg) => {
          if (msg.applicationId !== applicationId) return msg;
          if (viewer === 'candidate' && !msg.readByCandidate) {
            changed = true;
            return { ...msg, readByCandidate: true };
          }
          if (viewer === 'employer' && !msg.readByEmployer) {
            changed = true;
            return { ...msg, readByEmployer: true };
          }
          return msg;
        });
        return changed ? next : prev;
      });
    },
    []
  );

  const handlePublishRole = (input: NewRoleInput) => {
    const refNumber = 2630 + jobs.length;
    const newRole: JobRole = {
      id: `role-${Date.now()}`,
      referenceCode: `MT-${refNumber}`,
      title: input.title,
      employer: input.employer,
      department: input.department,
      location: input.location,
      country: input.country,
      workMode: input.workMode,
      employmentType: 'Full-time',
      salaryRange: input.salaryRange,
      postedDate: new Date().toISOString().slice(0, 10),
      status: 'Published',
      visaSponsorship: input.visaSponsorship,
      relocationSupport: input.relocationSupport,
      summary: input.summary,
      responsibilities: input.responsibilities,
      qualifications: input.qualifications,
      hiringSteps: [
        'Direct employer application review',
        'Structured interview with hiring manager',
        'Role-specific practical discussion',
        'Written offer with zero candidate fees',
      ],
    };
    setJobs((prev) => [newRole, ...prev]);
    setSelectedRoleId(newRole.id);
    setPostRoleOpen(false);
    setActiveView('roles');
  };

  const handleNavigate = (view: PortalView) => {
    setActiveView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenMessagesForApp = (applicationId: string) => {
    setFocusedMessageAppId(applicationId);
    handleNavigate('messages');
  };

  const scrollToRoles = () => {
    setActiveView('roles');
    requestAnimationFrame(() => {
      document.getElementById('open-roles')?.scrollIntoView({ behavior: 'smooth' });
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Header
        activeView={activeView}
        onNavigate={handleNavigate}
        applicationCount={applications.filter((a) => a.stage !== 'Withdrawn').length}
        unreadMessageCount={unreadCandidateMessages}
        onOpenPostRole={() => setPostRoleOpen(true)}
      />

      <main className="flex-1">
        {activeView === 'roles' && (
          <>
            <HeroSection
              openRoleCount={publishedJobs.length}
              sponsoredCount={sponsoredCount}
              countryCount={countryCount}
              onBrowseRoles={scrollToRoles}
              onViewCharter={() => handleNavigate('charter')}
            />
            <JobBoard
              jobs={jobs}
              selectedRoleId={selectedRoleId}
              onSelectRole={setSelectedRoleId}
              savedRoleIds={savedRoleIds}
              onToggleSave={handleToggleSave}
              appliedRoleIds={appliedRoleIds}
              onStartApply={setApplyingRole}
            />
          </>
        )}

        {activeView === 'applications' && (
          <ApplicationsView
            applications={applications}
            onWithdraw={handleWithdrawApplication}
            onOpenMessages={handleOpenMessagesForApp}
            onExploreRoles={() => handleNavigate('roles')}
          />
        )}

        {activeView === 'messages' && (
          <MessagesView
            applications={applications}
            messages={messages}
            initialApplicationId={focusedMessageAppId}
            onSendMessage={handleSendMessage}
            onMarkThreadRead={handleMarkThreadRead}
            onExploreRoles={() => handleNavigate('roles')}
          />
        )}

        {activeView === 'employer' && (
          <EmployerHubView
            jobs={jobs}
            applications={applications}
            messages={messages}
            onUpdateRoleStatus={handleUpdateRoleStatus}
            onUpdateApplicationStage={handleUpdateApplicationStage}
            onSendMessage={handleSendMessage}
            onMarkThreadRead={handleMarkThreadRead}
            onOpenPostRole={() => setPostRoleOpen(true)}
          />
        )}

        {activeView === 'charter' && (
          <CandidateCharterView onBrowseRoles={() => handleNavigate('roles')} />
        )}
      </main>

      <Footer onNavigate={handleNavigate} />

      {applyingRole && (
        <ApplicationModal
          role={applyingRole}
          onClose={() => setApplyingRole(null)}
          onSubmitApplication={handleSubmitApplication}
          onGoToApplications={() => {
            setApplyingRole(null);
            handleNavigate('applications');
          }}
        />
      )}

      {postRoleOpen && (
        <PostRoleModal
          onClose={() => setPostRoleOpen(false)}
          onPublishRole={handlePublishRole}
        />
      )}
    </div>
  );
}
