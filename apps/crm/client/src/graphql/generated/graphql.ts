import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  /** Imported from 'graphql-scalars' */
  DateTime: { input: any; output: any };
  /** UImported from 'graphql-scalars' */
  EmailAddress: { input: any; output: any };
  /** Imported from 'graphql-scalars' */
  HexColorCode: { input: any; output: any };
  /** Imported from 'graphql-scalars' */
  JSON: { input: any; output: any };
  /** Imported from 'graphql-scalars' */
  UUID: { input: any; output: any };
};

/** Represents an audit log entry recording a change made to an entity in the system. */
export type Audit = {
  /** The date and time when the change occurred. */
  changedAt: Scalars['DateTime']['output'];
  /** The user who performed the change. */
  changedBy: UserProfile;
  /** The type of action that was performed on the entity (e.g., INSERT, UPDATE, DELETE). */
  entityAction: AuditAction;
  /** The unique identifier of the entity that was changed. */
  entityId: Scalars['UUID']['output'];
  /** A unique identifier for the audit record. */
  id: Scalars['UUID']['output'];
  /** The new values of the entity after the change (if applicable). */
  newValues?: Maybe<Scalars['JSON']['output']>;
  /** The original values of the entity before the change (if applicable). */
  originalValues?: Maybe<Scalars['JSON']['output']>;
};

/** Enumerates the possible actions that can be performed on an entity for auditing purposes. */
export enum AuditAction {
  Delete = 'DELETE',
  Insert = 'INSERT',
  Update = 'UPDATE',
}

/** Contains a list of audits and pagination metadata. */
export type AuditList = {
  /**
   * Synthetic unique identifier for the paginated list (to satisfy ESLint rules).
   * Can be a hash or string derived from query parameters.
   */
  id: Scalars['ID']['output'];
  /** The list of audits for the current page. */
  items: Array<Audit>;
  /** The total number of quotes matching the filter. */
  totalCount: Scalars['Int']['output'];
};

/** Business model type. */
export enum BusinessType {
  B2B = 'B2B',
  B2C = 'B2C',
}

/**
 * Represents a calendar associated with a company.
 * A company has a single calendar, which contains multiple categories and events.
 */
export type Calendar = {
  /** A list of all event categories defined in the calendar. */
  categories: Array<CalendarCategory>;
  /** The ID of the company that owns this calendar. */
  companyId: Scalars['UUID']['output'];
  /** Unique identifier for the calendar. */
  id: Scalars['UUID']['output'];
};

/** Represents a category under which events can be grouped. */
export type CalendarCategory = {
  /** Unique identifier for the category. */
  id: Scalars['UUID']['output'];
  /** The title of the category. */
  title: Scalars['String']['output'];
};

/** Represents a single event in the calendar. */
export type CalendarEvent = {
  /** The category this event belongs to. */
  category?: Maybe<CalendarCategory>;
  /** A hex color string (e.g. "#FF5733") used to visually represent this event. */
  color?: Maybe<Scalars['HexColorCode']['output']>;
  /** A longer description or notes about the event. */
  description?: Maybe<Scalars['String']['output']>;
  /** End time of the event in ISO 8601 format. */
  endTime: Scalars['DateTime']['output'];
  /** Unique identifier for the event. */
  id: Scalars['UUID']['output'];
  /** A list of users participating in the event. */
  participants: Array<UserProfile>;
  /** Start time of the event in ISO 8601 format. */
  startTime: Scalars['DateTime']['output'];
  /** The title of the event. */
  title: Scalars['String']['output'];
};

/**
 * Returned by the initial data query to provide all necessary information
 * to render the calendar view on first load.
 */
export type CalendarInitialData = {
  /** The calendar object associated with the given company. */
  calendar: Calendar;
  /** All categories associated with the calendar. */
  categories: Array<CalendarCategory>;
  /** All events that fall within the specified start and end dates. */
  events: Array<CalendarEvent>;
  /** A synthetic ID representing this response (e.g., `${companyId}:${startDate}:${endDate}`). */
  id: Scalars['ID']['output'];
};

/** Represents a company registered in the system, including location and industry metadata. */
export type Company = {
  /** Business type or legal structure. */
  businessType: BusinessType;
  /** Paginated list of contacts associated with this company. */
  contacts: CompanyPaginatedContacts;
  /** Country where the company is headquartered. */
  country: Country;
  /** Paginated list of deals in the sales pipeline for this company. */
  deals: CompanyPaginatedDeals;
  /** Unique identifier for the company (UUID format). */
  id: Scalars['UUID']['output'];
  /** Industry sector the company operates in (e.g., Fintech, Healthcare). */
  industry: Scalars['String']['output'];
  /** Official legal or trading name of the company. */
  name: Scalars['String']['output'];
  /** A list of notes associated with this contact, typically used to record interactions, updates, or important information. */
  notes: Array<CompanyNote>;
  /** Paginated list of quotes issued to this company. */
  quotes: CompanyPaginatedQuotes;
  /** General size classification of the company.. */
  size: CompanySize;
  /** Reported total annual revenue of the company, in base currency units. */
  totalRevenue: Scalars['Float']['output'];
  /** Company’s primary website URL, if available. */
  website?: Maybe<Scalars['String']['output']>;
};

/** Represents a company registered in the system, including location and industry metadata. */
export type CompanyContactsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};

/** Represents a company registered in the system, including location and industry metadata. */
export type CompanyDealsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};

/** Represents a company registered in the system, including location and industry metadata. */
export type CompanyQuotesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};

/** Represents geolocation data for a company used in map displays. */
export type CompanyLocation = {
  /** Unique identifier of the company. */
  id: Scalars['UUID']['output'];
  /** Latitude coordinate of the company's primary location. */
  latitude: Scalars['Float']['output'];
  /** Longitude coordinate of the company's primary location. */
  longitude: Scalars['Float']['output'];
  /** Name of the company. */
  name: Scalars['String']['output'];
};

/** Represents a note associated with a specific company, used for tracking interactions or important details. */
export type CompanyNote = {
  /** The company this note is associated with. */
  company: Company;
  /** The timestamp of when the note was created. */
  createdAt: Scalars['DateTime']['output'];
  /** The user who created the note. */
  createdBy: UserProfile;
  /** Unique identifier for the company note. */
  id: Scalars['UUID']['output'];
  /** The content or body of the note. */
  note: Scalars['String']['output'];
};

/** Represents a paginated list of contacts associated with a company. */
export type CompanyPaginatedContacts = {
  /**
   * A synthetic unique identifier for the paginated contact list.
   * Can be derived from query parameters (e.g., page number, filters).
   */
  id: Scalars['ID']['output'];
  /** The list of contacts returned for the current page. */
  items: Array<Contact>;
  /** The total number of contacts available for the company, regardless of pagination. */
  totalCount: Scalars['Int']['output'];
};

/** Represents a paginated list of deals associated with a company. */
export type CompanyPaginatedDeals = {
  /**
   * A synthetic unique identifier for the paginated contact list.
   * Can be derived from query parameters (e.g., page number, filters).
   */
  id: Scalars['ID']['output'];
  /** The list of deals returned for the current page. */
  items: Array<PipelineDeal>;
  /** The total number of deals available for the company, regardless of pagination. */
  totalCount: Scalars['Int']['output'];
};

/** Represents a paginated list of quotes associated with a company. */
export type CompanyPaginatedQuotes = {
  /**
   * A synthetic unique identifier for the paginated contact list.
   * Can be derived from query parameters (e.g., page number, filters).
   */
  id: Scalars['ID']['output'];
  /** The list of quotes returned for the current page. */
  items: Array<Quote>;
  /** The total number of quotes available for the company, regardless of pagination. */
  totalCount: Scalars['Int']['output'];
};

/** Defines the various roles a user can have within a company. */
export enum CompanyRole {
  /** An administrative user with full access and permissions. */
  Admin = 'ADMIN',
  /** An intern supporting the sales team. */
  SalesIntern = 'SALES_INTERN',
  /** A manager responsible for overseeing sales teams and activities. */
  SalesManager = 'SALES_MANAGER',
  /** A user responsible for direct sales operations and client interactions. */
  SalesPerson = 'SALES_PERSON',
}

/** Company size classification. */
export enum CompanySize {
  Large = 'LARGE',
  Medium = 'MEDIUM',
  Micro = 'MICRO',
  Small = 'SMALL',
}

/** Represents a person associated with a company, typically a lead or client contact. */
export type Contact = {
  /** The company the contact is associated with. */
  company: Company;
  /** Email address of the contact. */
  email: Scalars['EmailAddress']['output'];
  /** Contact’s given name. */
  firstName: Scalars['String']['output'];
  /** Unique identifier for the contact (UUID format). */
  id: Scalars['UUID']['output'];
  /** Job title or role of the contact at the company. */
  jobTitle: Scalars['String']['output'];
  /** Contact’s family or surname. */
  lastName: Scalars['String']['output'];
  /** A list of notes associated with this contact, typically used to record interactions, updates, or important information. */
  notes: Array<ContactNote>;
  /** Phone number of the contact. */
  phone: Scalars['String']['output'];
  /** Current engagement stage of the contact in your workflow. */
  stage: ContactStage;
  /** IANA timezone string representing the contact's local timezone. */
  timezone?: Maybe<TimeZone>;
};

/** Represents a note associated with a specific contact, used for tracking interactions or important details. */
export type ContactNote = {
  /** The contact this note is associated with. */
  contact: Contact;
  /** The timestamp of when the note was created. */
  createdAt: Scalars['DateTime']['output'];
  /** The user who created the note. */
  createdBy: UserProfile;
  /** Unique identifier for the contact note. */
  id: Scalars['UUID']['output'];
  /** The content or body of the note. */
  note: Scalars['String']['output'];
};

/** Describes the current status of a contact in the sales or client lifecycle. */
export enum ContactStage {
  Churned = 'CHURNED',
  Contacted = 'CONTACTED',
  Interested = 'INTERESTED',
  Lost = 'LOST',
  Negotiation = 'NEGOTIATION',
  New = 'NEW',
  Qualified = 'QUALIFIED',
  Unqualified = 'UNQUALIFIED',
  Won = 'WON',
}

/** Represents a country with standardized codes and names used for identification and classification. */
export type Country = {
  /** The two-letter ISO 3166-1 alpha-2 code for the country (e.g., "US"). */
  alpha2Code: Scalars['String']['output'];
  /** The three-letter ISO 3166-1 alpha-3 code for the country (e.g., "USA"). */
  alpha3Code: Scalars['String']['output'];
  /** A unique identifier for the country. */
  id: Scalars['UUID']['output'];
  /** The term used to describe a person from the country (e.g., "American"). */
  nationality: Scalars['String']['output'];
  /** The numeric ISO 3166-1 code for the country (e.g., 840 for the United States). */
  numCode: Scalars['Int']['output'];
  /** The commonly used short name of the country (e.g., "United States"). */
  shortName: Scalars['String']['output'];
};

/** Encapsulates summarized metrics and location data used for the dashboard. */
export type DashboardSummary = {
  /** List of company locations used for visualizing company distribution on a map. */
  companyLocations: Array<CompanyLocation>;
  /** Total number of companies associated with the given company ID. */
  totalCompanies: Scalars['Int']['output'];
  /** Total number of contacts linked to companies under the given company ID. */
  totalContacts: Scalars['Int']['output'];
  /** Total number of active deals in the pipeline for the company. */
  totalDeals: Scalars['Int']['output'];
  /** Total number of quotes created and associated with the company. */
  totalQuotes: Scalars['Int']['output'];
};

/** Represents a Kanban board tied to a specific company. */
export type Kanban = {
  /** ID of the company this kanban board belongs to. */
  companyId: Scalars['UUID']['output'];
  /** Unique identifier for the kanban board. */
  id: Scalars['UUID']['output'];
  /** All tasks associated with this kanban board. */
  tasks: Array<KanbanTask>;
};

/** Initial data returned when loading a kanban board, including structure and task state. */
export type KanbanInitialData = {
  /** Unique identifier for this payload. */
  id: Scalars['ID']['output'];
  /** The kanban board data. */
  kanban: Kanban;
  /** The set of stages (columns) in the kanban board. */
  stages: Array<KanbanStage>;
  /** Defines the order of tasks within each stage of the kanban board. */
  tasksOrder?: Maybe<Array<Maybe<KanbanTaskOrder>>>;
};

/** Represents a stage (or column) in a kanban board, such as "To Do", "In Progress", or "Done". */
export type KanbanStage = {
  /** Unique identifier for the stage. */
  id: Scalars['UUID']['output'];
  /** Title of the stage. */
  title: Scalars['String']['output'];
};

/** A task within the kanban board. */
export type KanbanTask = {
  /** The user assigned to this task, if any. */
  assignedUser?: Maybe<UserProfile>;
  /** Checklist items tied to this task, representing subtasks or actionable items. */
  checklistItems?: Maybe<Array<KanbanTaskChecklistItem>>;
  /** Comments associated with this task. */
  comments: Array<KanbanTaskComment>;
  /** Whether the task has been marked as completed. */
  completed: Scalars['Boolean']['output'];
  /** Optional description providing more context about the task. */
  description?: Maybe<Scalars['String']['output']>;
  /** Optional due date for the task. */
  dueDate?: Maybe<Scalars['DateTime']['output']>;
  /** Unique identifier for the task. */
  id: Scalars['UUID']['output'];
  /** Short, unique identifier (6 characters) for external referencing or display. Generated via nanoid. */
  serial: Scalars['String']['output'];
  /** The stage (column) this task currently belongs to. */
  stage: KanbanStage;
  /** The title or summary of the task. */
  title: Scalars['String']['output'];
};

/** A checklist item within a kanban task. */
export type KanbanTaskChecklistItem = {
  /** Whether this checklist item has been completed. */
  completed: Scalars['Boolean']['output'];
  /** Unique identifier for the checklist item. */
  id: Scalars['UUID']['output'];
  /** The task this checklist item belongs to. */
  task: KanbanTask;
  /** Title or label for the checklist item. */
  title: Scalars['String']['output'];
};

/** A comment left on a kanban task by a user. */
export type KanbanTaskComment = {
  /** Content of the comment. */
  comment: Scalars['String']['output'];
  /** Timestamp when the comment was created. */
  createdAt: Scalars['DateTime']['output'];
  /** The user who wrote the comment. */
  createdBy: UserProfile;
  /** Unique identifier for the comment. */
  id: Scalars['UUID']['output'];
  /** The task this comment is associated with. */
  task: KanbanTask;
};

/** Defines the order of task serials within a given kanban stage. */
export type KanbanTaskOrder = {
  /** Unique identifier for the task order entry. */
  id: Scalars['UUID']['output'];
  /** The stage this task order is associated with. */
  stage: KanbanStage;
  /** Ordered list of task serials (not UUIDs) in this stage. */
  taskOrder: Array<Scalars['String']['output']>;
};

/** Represents a sales or deal pipeline associated with a specific company. */
export type Pipeline = {
  /** Identifier of the company that owns this pipeline. */
  companyId: Scalars['UUID']['output'];
  /** All deals currently associated with this pipeline. */
  deals: Array<PipelineDeal>;
  /** Unique identifier of the pipeline. */
  id: Scalars['UUID']['output'];
};

/** Represents a deal within the pipeline, such as a potential sale or client opportunity. */
export type PipelineDeal = {
  /** The company associated with the deal. */
  company: Company;
  /** The contact person associated with the deal (e.g., client or lead). */
  contact: Contact;
  /** Timestamp indicating when the deal was created. */
  createdAt: Scalars['DateTime']['output'];
  /** Unique identifier of the deal. */
  id: Scalars['UUID']['output'];
  /** The user assigned as the primary owner or representative of the deal. */
  owner: UserProfile;
  /** A short, unique serial identifier (e.g., 6-character string) used to refer to the deal. */
  serial: Scalars['String']['output'];
  /** The current stage the deal is in within the pipeline. */
  stage: PipelineStage;
  /** Title or name of the deal. */
  title: Scalars['String']['output'];
  /** The monetary value associated with the deal. */
  value: Scalars['Float']['output'];
};

/**
 * Represents the order of deals in a given pipeline stage.
 * Used to preserve UI ordering.
 */
export type PipelineDealOrder = {
  /** An ordered list of deal serial identifiers for this stage. */
  dealOrder: Array<Scalars['String']['output']>;
  /** Unique identifier of the deal order entry. */
  id: Scalars['UUID']['output'];
  /** The stage associated with this deal order configuration. */
  stage: PipelineStage;
};

/**
 * Initial data payload returned when loading the pipeline view.
 * Includes pipeline details, stages, and ordered deals.
 */
export type PipelineInitialData = {
  /** Defines the order of deals within each stage of the pipeline. */
  dealsOrder?: Maybe<Array<Maybe<PipelineDealOrder>>>;
  /** Unique identifier of the pipeline initial data payload. */
  id: Scalars['ID']['output'];
  /** The pipeline associated with the given company. */
  pipeline: Pipeline;
  /** List of all stages in the pipeline. */
  stages: Array<PipelineStage>;
};

/** Represents a single stage within the pipeline (e.g., Prospecting, Negotiation, Closed). */
export type PipelineStage = {
  /** Unique identifier of the stage. */
  id: Scalars['UUID']['output'];
  /** Descriptive title of the stage. */
  title: Scalars['String']['output'];
};

export type Query = {
  /** Retrieves a single audit entry by its unique ID. */
  audit?: Maybe<Audit>;
  /** Retrieves a paginated and optionally filtered list of audit entries. */
  audits?: Maybe<AuditList>;
  /**
   * Fetches events for a company's calendar within the specified date range.
   * Useful for updating events when switching views (e.g., day/week/month).
   */
  calendarEventsByCompany?: Maybe<Array<CalendarEvent>>;
  /**
   * Fetches the initial calendar data for a company, including all categories and events
   * within a given time range. Intended for initial page load.
   */
  calendarInitialData?: Maybe<CalendarInitialData>;
  /**
   * Returns a paginated list of all companies.
   * Supports optional filtering by country and industry.
   */
  companies?: Maybe<Array<Maybe<Company>>>;
  /**
   * Fetches a company by its UUID.
   * Throws an error if the company does not exist.
   */
  company?: Maybe<Company>;
  /**
   * Fetches a single contact by its UUID.
   * Returns `null` if the contact is not found.
   */
  contact?: Maybe<Contact>;
  /** Returns a list of all contacts in the system. */
  contacts?: Maybe<Array<Maybe<Contact>>>;
  /** Returns high-level summary data for the dashboard view, scoped to a specific company. */
  dashboardSummary: DashboardSummary;
  /**
   * Fetches the initial data for rendering a kanban board belonging to a specific company.
   * Includes stages, task ordering, and tasks.
   */
  kanbanInitialData?: Maybe<KanbanInitialData>;
  /**
   * Retrieves the initial data needed to load the pipeline view for a given company,
   * including the pipeline, all stages, and ordered deals.
   */
  pipelineInitialData?: Maybe<PipelineInitialData>;
  /** Fetches a specific quote by UUID. */
  quote?: Maybe<Quote>;
  /** Returns a paginated list of quotes with optional filters and search. */
  quotes?: Maybe<QuoteList>;
  /** Retrieves a single user profile by their unique ID. */
  user?: Maybe<UserProfile>;
  /** Retrieves a list of user profiles by their unique IDs. */
  users?: Maybe<Array<Maybe<UserProfile>>>;
};

export type QueryAuditArgs = {
  id: Scalars['UUID']['input'];
};

export type QueryAuditsArgs = {
  action?: InputMaybe<AuditAction>;
  endDate?: InputMaybe<Scalars['DateTime']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  startDate?: InputMaybe<Scalars['DateTime']['input']>;
  userName?: InputMaybe<Scalars['String']['input']>;
};

export type QueryCalendarEventsByCompanyArgs = {
  companyId: Scalars['UUID']['input'];
  endDate: Scalars['DateTime']['input'];
  startDate: Scalars['DateTime']['input'];
};

export type QueryCalendarInitialDataArgs = {
  companyId: Scalars['UUID']['input'];
  endDate: Scalars['DateTime']['input'];
  startDate: Scalars['DateTime']['input'];
};

export type QueryCompaniesArgs = {
  contactIds?: InputMaybe<Array<Scalars['UUID']['input']>>;
  page?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  salesOwnerId?: InputMaybe<Scalars['UUID']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
};

export type QueryCompanyArgs = {
  id: Scalars['UUID']['input'];
};

export type QueryContactArgs = {
  id: Scalars['UUID']['input'];
};

export type QueryDashboardSummaryArgs = {
  companyId: Scalars['UUID']['input'];
};

export type QueryKanbanInitialDataArgs = {
  companyId: Scalars['UUID']['input'];
};

export type QueryPipelineInitialDataArgs = {
  companyId: Scalars['UUID']['input'];
};

export type QueryQuoteArgs = {
  id: Scalars['UUID']['input'];
};

export type QueryQuotesArgs = {
  companyId?: InputMaybe<Scalars['UUID']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  preparedBy?: InputMaybe<Scalars['UUID']['input']>;
  stage?: InputMaybe<QuoteStage>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type QueryUserArgs = {
  id: Scalars['UUID']['input'];
};

export type QueryUsersArgs = {
  ids?: InputMaybe<Array<Scalars['UUID']['input']>>;
};

/**
 * Represents a formal quote issued to a client for services or products,
 * including financial details, associated company and contact, and current stage.
 */
export type Quote = {
  /** The company this quote is issued on behalf of. */
  company: Company;
  /** The date the quote record was created in the system. */
  createdAt: Scalars['DateTime']['output'];
  /** The due date by which the quote is expected to be accepted or responded to. */
  dueAt?: Maybe<Scalars['DateTime']['output']>;
  /** Unique identifier for the quote (UUID format). */
  id: Scalars['UUID']['output'];
  /** The date when the quote was formally issued. */
  issuedAt?: Maybe<Scalars['DateTime']['output']>;
  /** A note associated with the quote, typically containing internal comments or additional instructions. */
  note: QuoteNote;
  /** The user who created and issued the quote. */
  preparedBy: UserProfile;
  /** The contact person the quote is prepared for. */
  preparedFor: Contact;
  /** The amount of sales tax included in the quote total. */
  salesTax: Scalars['Float']['output'];
  /** A list of services included in this quote, along with pricing and quantities. */
  services: Array<QuoteService>;
  /** The current status of the quote (e.g., DRAFT, SENT, ACCEPTED). */
  stage: QuoteStage;
  /** The title or reference name of the quote. */
  title: Scalars['String']['output'];
  /** The total cost of the quote, including services and any applied discounts or taxes. */
  total: Scalars['Float']['output'];
};

/** Contains a list of quotes and pagination metadata. */
export type QuoteList = {
  /**
   * Synthetic unique identifier for the paginated list (to satisfy ESLint rules).
   * Can be a hash or string derived from query parameters.
   */
  id: Scalars['ID']['output'];
  /** The list of quotes for the current page. */
  items: Array<QuoteSummary>;
  /** The total number of quotes matching the filter. */
  totalCount: Scalars['Int']['output'];
};

/** A note attached to a quote, typically used for internal remarks or contextual details. */
export type QuoteNote = {
  /** Unique identifier for the quote note (UUID format). */
  id: Scalars['UUID']['output'];
  /** The textual content of the note. */
  note: Scalars['String']['output'];
};

/**
 * Represents an individual service or line item included in a quote.
 * Each service contributes to the total value of the quote.
 */
export type QuoteService = {
  /** Discount applied to the service, if any. */
  discount: Scalars['Float']['output'];
  /** Unique identifier for the service line item (UUID format). */
  id: Scalars['UUID']['output'];
  /** Unit price of the service. */
  price: Scalars['Float']['output'];
  /** Quantity of the service units being quoted. */
  quantity: Scalars['Float']['output'];
  /** Descriptive title of the service or product being quoted. */
  title: Scalars['String']['output'];
  /** Total amount for this line item, factoring in price, quantity, and discount. */
  total: Scalars['Float']['output'];
};

/** Enumerates the lifecycle stages of a quote. */
export enum QuoteStage {
  Accepted = 'ACCEPTED',
  Draft = 'DRAFT',
  Sent = 'SENT',
}

/**
 * A lightweight version of a quote used in summary views or lists.
 * Excludes detailed fields like services or notes for performance optimization.
 */
export type QuoteSummary = {
  /** The company the quote is associated with. */
  company: Company;
  /** The creation timestamp of the quote. */
  createdAt: Scalars['DateTime']['output'];
  /** Unique identifier for the quote (UUID format). */
  id: Scalars['UUID']['output'];
  /** The user who prepared and issued the quote. */
  preparedBy: UserProfile;
  /** The contact for whom the quote was prepared. */
  preparedFor: Contact;
  /** The current stage of the quote (e.g., DRAFT, SENT, ACCEPTED). */
  stage: QuoteStage;
  /** Title or reference name of the quote. */
  title: Scalars['String']['output'];
  /** The total amount quoted, including any taxes or discounts. */
  total: Scalars['Float']['output'];
};

/** Represents a time zone associated with a specific country, including the GMT offset and ISO country code. */
export type TimeZone = {
  /** The two-letter ISO 3166-1 alpha-2 code for the country this time zone is associated with (e.g., "US"). */
  alpha2Code: Scalars['String']['output'];
  /** The country associated with this time zone. */
  country: Country;
  /** The time zone's offset from GMT/UTC, typically formatted as "+HH:MM" or "-HH:MM" (e.g., "-05:00"). */
  gmtOffset: Scalars['String']['output'];
  /** A unique identifier for the time zone entry. */
  id: Scalars['UUID']['output'];
};

/** Represents a user's profile within the system, including personal details, contact information, and associated organization data. */
export type UserProfile = {
  /** The company the user belongs to. */
  company: Company;
  /** The user's role within the company. */
  companyRole: CompanyRole;
  /** The country the user is located in or associated with. */
  country: Country;
  /** The user's email address. */
  email: Scalars['EmailAddress']['output'];
  /** The user's first name. */
  firstName: Scalars['String']['output'];
  /** A unique identifier for the user. */
  id: Scalars['UUID']['output'];
  /** A URL or file path to the user's profile image, if available. */
  image?: Maybe<Scalars['String']['output']>;
  /** The user's last name. */
  lastName: Scalars['String']['output'];
  /** The user's mobile phone number, if available. */
  mobile?: Maybe<Scalars['String']['output']>;
  /** The user's landline or office telephone number, if available. */
  telephone?: Maybe<Scalars['String']['output']>;
  /** The user's preferred time zone. */
  timezone: TimeZone;
};

export type CompanyByIdQueryVariables = Exact<{
  id: Scalars['UUID']['input'];
}>;

export type CompanyByIdQuery = { company?: { id: any } | null };

export const CompanyByIdDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'CompanyById' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
          type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'UUID' } } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'company' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'Field', name: { kind: 'Name', value: 'id' } }],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<CompanyByIdQuery, CompanyByIdQueryVariables>;
