import { AuditLogTable, AuditLogTableRelations } from './AuditLog.js';
import { CalendarTable, CalendarTableRelations } from './calendar/Calendar.js';
import { CalendarCategoriesTable, CalendarCategoriesTableRelations } from './calendar/Categories.js';
import { CalendarEventsTable, CalendarEventsTableRelations } from './calendar/Events.js';
import {
  CalendarEventsParticipantsTable,
  CalendarEventsParticipantsTableRelations,
} from './calendar/EventsParticipants.js';
import { CompaniesTable, CompaniesTableRelations } from './companies/Companies.js';
import { CompaniesNotesTable, CompaniesNotesTableRelations } from './companies/CompanyNotes.js';
import { ContactsTable, ContactsTableRelations } from './contacts/Contacts.js';
import { ContactsNotesTable, ContactsNotesTableeRelations } from './contacts/ContactsNotes.js';
import { CountriesTable, CountriesTablerelations } from './Countries.js';
import { KanbanTaskChecklistItemRelations, KanbanTaskChecklistItemTable } from './kanban/ChecklistItems.js';
import { KanbanTable, KanbanTableRelations } from './kanban/Kanban.js';
import { KanbanStagesTable, KanbanStagesTableRelations } from './kanban/Stages.js';
import { KanbanTasksTable, KanbanTaskTableRelations } from './kanban/Tasks.js';
import { KanbanTaskCommentsTable, KanbanTaskCommentsTableRelations } from './kanban/TasksComments.js';
import { PipelineDealsTable, PipelineDealsTableRelations } from './pipeline/Deals.js';
import { PipelineTable, PipelineTableRelations } from './pipeline/Pipeline.js';
import { PipelineStagesTable, PipelineStagesTableRelations } from './pipeline/Stages.js';
import { QuotesTable, QuotesTableRelations } from './quotes/Quotes.js';
import { QuotesNotesTable, QuotesNotesTableRelations } from './quotes/QuotesNotes.js';
import { QuoteServicesTable, QuoteServicesTableRelations } from './quotes/Services.js';
import { TimeZoneTable, TimeZoneTableRelations } from './TimeZones.js';
import { UserTable, UserTableRelations } from './user/User.js';
import { UserProfileTable, UserProfileTableRelations } from './user/UserProfile.js';
import { UserRefreshTokensTable, UserRefreshTokensTableRelations } from './user/UserRefreshTokens.js';

const schemas = {
  AuditLogTable,
  AuditLogTableRelations,
  CalendarCategoriesTable,
  CalendarCategoriesTableRelations,
  CalendarEventsParticipantsTable,
  CalendarEventsParticipantsTableRelations,
  CalendarEventsTable,
  CalendarEventsTableRelations,
  CalendarTable,
  CalendarTableRelations,
  CompaniesNotesTable,
  CompaniesNotesTableRelations,
  CompaniesTable,
  CompaniesTableRelations,
  ContactsNotesTable,
  ContactsNotesTableeRelations,
  ContactsTable,
  ContactsTableRelations,
  CountriesTable,
  CountriesTablerelations,
  KanbanStagesTable,
  KanbanStagesTableRelations,
  KanbanTable,
  KanbanTableRelations,
  KanbanTaskChecklistItemRelations,
  KanbanTaskChecklistItemTable,
  KanbanTaskCommentsTable,
  KanbanTaskCommentsTableRelations,
  KanbanTasksTable,
  KanbanTaskTableRelations,
  PipelineDealsTable,
  PipelineDealsTableRelations,
  PipelineStagesTable,
  PipelineStagesTableRelations,
  PipelineTable,
  PipelineTableRelations,
  QuoteServicesTable,
  QuoteServicesTableRelations,
  QuotesNotesTable,
  QuotesNotesTableRelations,
  QuotesTable,
  QuotesTableRelations,
  TimeZoneTable,
  TimeZoneTableRelations,
  UserProfileTable,
  UserProfileTableRelations,
  UserRefreshTokensTable,
  UserRefreshTokensTableRelations,
  UserTable,
  UserTableRelations,
};

export default schemas;
