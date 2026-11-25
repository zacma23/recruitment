export type Department =
  | 'Engineering'
  | 'Operations'
  | 'Healthcare'
  | 'Finance'
  | 'Logistics';

export type WorkMode = 'Remote' | 'Hybrid' | 'On-site';

export type RoleStatus = 'Published' | 'Paused' | 'Closed';

export type PortalView = 'roles' | 'applications' | 'messages' | 'employer' | 'charter';

export type ApplicationStage =
  | 'Submitted'
  | 'Under Review'
  | 'Interview Scheduled'
  | 'Offer Issued'
  | 'Hired'
  | 'Not Selected'
  | 'Withdrawn';

export interface JobRole {
  id: string;
  referenceCode: string;
  title: string;
  employer: string;
  department: Department;
  location: string;
  country: string;
  workMode: WorkMode;
  employmentType: string;
  salaryRange: string;
  postedDate: string;
  status: RoleStatus;
  visaSponsorship: boolean;
  relocationSupport: string;
  summary: string;
  responsibilities: string[];
  qualifications: string[];
  hiringSteps: string[];
}

export interface ApplicationRecord {
  id: string;
  referenceId: string;
  roleId: string;
  roleTitle: string;
  employer: string;
  location: string;
  candidateName: string;
  candidateEmail: string;
  candidateLocation: string;
  yearsExperience: string;
  portfolioUrl: string;
  resumeFileName: string;
  coverNote: string;
  submittedDate: string;
  stage: ApplicationStage;
  interviewDate?: string;
  recruiterNote?: string;
}

export interface MessageItem {
  id: string;
  applicationId: string;
  sender: 'employer' | 'candidate';
  senderName: string;
  body: string;
  sentAt: string;
  readByCandidate: boolean;
  readByEmployer: boolean;
}

export interface NewRoleInput {
  title: string;
  employer: string;
  department: Department;
  location: string;
  country: string;
  workMode: WorkMode;
  salaryRange: string;
  visaSponsorship: boolean;
  relocationSupport: string;
  summary: string;
  responsibilities: string[];
  qualifications: string[];
}
