import { FormEvent, useEffect, useMemo, useState } from 'react';
import { Send } from 'lucide-react';
import { ApplicationRecord, MessageItem } from '../types/portal';

interface MessagesViewProps {
  applications: ApplicationRecord[];
  messages: MessageItem[];
  initialApplicationId: string | null;
  onSendMessage: (applicationId: string, body: string, sender: 'candidate' | 'employer') => void;
  onMarkThreadRead: (applicationId: string, viewer: 'candidate' | 'employer') => void;
  onExploreRoles: () => void;
}

export function MessagesView({
  applications,
  messages,
  initialApplicationId,
  onSendMessage,
  onMarkThreadRead,
  onExploreRoles,
}: MessagesViewProps) {
  const [selectedAppId, setSelectedAppId] = useState<string | null>(
    initialApplicationId ?? applications[0]?.id ?? null
  );
  const [draft, setDraft] = useState('');

  useEffect(() => {
    if (initialApplicationId) {
      setSelectedAppId(initialApplicationId);
    }
  }, [initialApplicationId]);

  const activeApp = useMemo(() => {
    if (applications.length === 0) return null;
    return applications.find((a) => a.id === selectedAppId) ?? applications[0];
  }, [applications, selectedAppId]);

  useEffect(() => {
    if (activeApp) {
      onMarkThreadRead(activeApp.id, 'candidate');
    }
  }, [activeApp, onMarkThreadRead]);

  const activeMessages = useMemo(() => {
    if (!activeApp) return [];
    return messages.filter((m) => m.applicationId === activeApp.id);
  }, [messages, activeApp]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!activeApp || !draft.trim()) return;
    onSendMessage(activeApp.id, draft.trim(), 'candidate');
    setDraft('');
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-12">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Candidate Messages
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Direct communication with hiring teams regarding interviews, schedules, and role details.
          </p>
        </div>
      </div>

      {applications.length === 0 ? (
        <div className="mt-6 bg-white border border-slate-200 rounded-lg p-12 text-center">
          <h2 className="font-display text-lg font-semibold text-slate-900">
            No conversations yet
          </h2>
          <p className="mt-2 text-sm text-slate-600 max-w-md mx-auto">
            Apply to an open position to start a direct conversation thread with the employer&apos;s
            hiring team.
          </p>
          <button
            type="button"
            onClick={onExploreRoles}
            className="mt-5 px-5 py-2.5 text-sm font-medium text-white bg-blue-700 rounded-md hover:bg-blue-800 transition-colors"
          >
            Browse Open Roles
          </button>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-4 bg-white border border-slate-200 rounded-lg divide-y divide-slate-200">
            {applications.map((app) => {
              const threadMessages = messages.filter((m) => m.applicationId === app.id);
              const lastMsg = threadMessages[threadMessages.length - 1];
              const unreadCount = threadMessages.filter(
                (m) => m.sender === 'employer' && !m.readByCandidate
              ).length;
              const isSelected = activeApp?.id === app.id;

              return (
                <button
                  key={app.id}
                  type="button"
                  onClick={() => setSelectedAppId(app.id)}
                  className={`w-full text-left p-4 transition-colors ${
                    isSelected ? 'bg-slate-50' : 'bg-white hover:bg-slate-50/70'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 text-xs text-slate-500">
                    <span className="font-mono tabular-nums">{app.referenceId}</span>
                    {unreadCount > 0 ? (
                      <span className="font-medium text-blue-700 tabular-nums">
                        {unreadCount} unread
                      </span>
                    ) : (
                      <span className="font-mono tabular-nums">
                        {lastMsg ? lastMsg.sentAt.slice(0, 10) : app.submittedDate}
                      </span>
                    )}
                  </div>
                  <p
                    className={`mt-1 font-display text-sm font-semibold truncate ${
                      isSelected ? 'text-blue-800' : 'text-slate-900'
                    }`}
                  >
                    {app.roleTitle}
                  </p>
                  <p className="text-xs text-slate-600 mt-0.5 truncate">{app.employer}</p>
                  {lastMsg && (
                    <p className="mt-2 text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {lastMsg.body}
                    </p>
                  )}
                </button>
              );
            })}
          </div>

          {activeApp && (
            <div className="lg:col-span-8 bg-white border border-slate-200 rounded-lg flex flex-col min-h-[460px]">
              <div className="px-6 py-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs text-slate-500">
                    {activeApp.employer} ·{' '}
                    <span className="font-mono tabular-nums">{activeApp.referenceId}</span> ·{' '}
                    <span className="font-medium text-slate-700">{activeApp.stage}</span>
                  </p>
                  <h2 className="mt-0.5 font-display text-base font-bold text-slate-900">
                    {activeApp.roleTitle}
                  </h2>
                </div>
                {activeApp.interviewDate && (
                  <p className="text-xs font-mono text-emerald-700 font-medium tabular-nums">
                    Interview: {activeApp.interviewDate}
                  </p>
                )}
              </div>

              <div className="flex-1 p-6 space-y-5 overflow-y-auto max-h-[420px]">
                {activeMessages.length === 0 ? (
                  <p className="text-sm text-slate-500">
                    No messages yet for this application. Send a message below to reach the hiring
                    team with questions about interview scheduling or role details.
                  </p>
                ) : (
                  activeMessages.map((msg) => {
                    const isCandidate = msg.sender === 'candidate';
                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${isCandidate ? 'items-end' : 'items-start'}`}
                      >
                        <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                          <span className="font-medium text-slate-700">
                            {isCandidate ? `${msg.senderName} (You)` : msg.senderName}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span className="font-mono tabular-nums">{msg.sentAt}</span>
                        </div>
                        <div
                          className={`max-w-[85%] rounded-md px-4 py-3 text-sm leading-relaxed border ${
                            isCandidate
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
                onSubmit={handleSubmit}
                className="p-4 border-t border-slate-200 flex items-end gap-3"
              >
                <div className="flex-1">
                  <label htmlFor="candidate-message-input" className="sr-only">
                    Reply to hiring team
                  </label>
                  <textarea
                    id="candidate-message-input"
                    rows={2}
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    placeholder={`Write a message to ${activeApp.employer}...`}
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-md text-slate-900 focus:border-blue-700 focus:outline-none resize-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={!draft.trim()}
                  className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-blue-700 rounded-md hover:bg-blue-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors whitespace-nowrap shrink-0"
                >
                  <Send className="w-4 h-4" />
                  Send
                </button>
              </form>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
