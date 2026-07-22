export type WorkspaceId = string;

export type Domain = {
  id: WorkspaceId;
  name: string;
  slug: string;
  icon: string;
  color: string;
  description: string;
  priority: number;
};

export type Initiative = {
  id: WorkspaceId;
  title: string;
  domainId: WorkspaceId | "";
  country: string;
  countryCode: string;
  description: string;
  mechanism: string;
  conditions: string;
  obstacles: string;
  feasibility: number;
  adaptation: string;
  cost: "low" | "medium" | "high" | "very_high";
  timelineYears: number;
  status: "draft" | "documented" | "analyzed" | "proposed";
  pinned: boolean;
  sources: { url: string; title: string }[];
  tags: string[];
  createdAt: number;
};

export type Contact = {
  id: WorkspaceId;
  name: string;
  role: string;
  expertise: string;
  country: string;
  email: string;
  linkedin: string;
  relationship: "identified" | "contacted" | "connected" | "collaborator" | "speaker";
  potential: number;
  notes: string;
  createdAt: number;
};

export type Milestone = {
  id: WorkspaceId;
  title: string;
  description: string;
  year: number;
  quarter: number;
  status: "planned" | "in_progress" | "completed" | "delayed";
};

export type WorkspaceTask = {
  id: WorkspaceId;
  milestoneId: WorkspaceId;
  title: string;
  status: "todo" | "in_progress" | "done";
  dueDate: string;
};

export type LibraryItem = {
  id: WorkspaceId;
  title: string;
  author: string;
  type: "book" | "article" | "report" | "video" | "podcast" | "documentary" | "other";
  domainId: WorkspaceId | "";
  url: string;
  summary: string;
  lessons: string;
  rating: number;
  isRead: boolean;
  createdAt: number;
};

export type JournalEntry = {
  id: WorkspaceId;
  title: string;
  content: string;
  mood: "motivated" | "reflective" | "doubtful" | "energized" | "focused";
  tags: string;
  createdAt: number;
};

export type ConferenceSession = {
  id: WorkspaceId;
  title: string;
  description: string;
  type: "keynote" | "panel" | "workshop" | "presentation";
  duration: number;
  domainId: WorkspaceId | "";
  status: "idea" | "confirmed" | "finalized";
  speakerIds: WorkspaceId[];
};

export type WorkspaceStore = {
  domains: Domain[];
  initiatives: Initiative[];
  contacts: Contact[];
  milestones: Milestone[];
  tasks: WorkspaceTask[];
  library: LibraryItem[];
  journal: JournalEntry[];
  sessions: ConferenceSession[];
};

export const seedDomains: Domain[] = [
  { id: "domain-education", name: "Éducation", slug: "education", icon: "📚", color: "#6B3A2A", description: "Systèmes éducatifs, réformes, pédagogie", priority: 1 },
  { id: "domain-sante", name: "Santé", slug: "sante", icon: "🩺", color: "#A63228", description: "Santé publique, accès aux soins", priority: 2 },
  { id: "domain-economie", name: "Économie", slug: "economie", icon: "📈", color: "#D4A853", description: "Modèles économiques, industrialisation", priority: 3 },
  { id: "domain-agriculture", name: "Agriculture", slug: "agriculture", icon: "🌾", color: "#4A7C59", description: "Souveraineté alimentaire, agroécologie", priority: 4 },
  { id: "domain-gouvernance", name: "Gouvernance", slug: "gouvernance", icon: "⚖️", color: "#3E1F13", description: "Institutions, transparence, justice", priority: 5 },
  { id: "domain-infrastructure", name: "Infrastructure", slug: "infrastructure", icon: "🏗️", color: "#9C5A3C", description: "Transports, énergie, numérique", priority: 6 },
  { id: "domain-culture", name: "Culture & Identité", slug: "culture", icon: "🎭", color: "#C4742A", description: "Patrimoine, langues, arts", priority: 7 },
];

export const emptyWorkspaceStore: WorkspaceStore = {
  domains: seedDomains,
  initiatives: [],
  contacts: [],
  milestones: [],
  tasks: [],
  library: [],
  journal: [],
  sessions: [],
};
