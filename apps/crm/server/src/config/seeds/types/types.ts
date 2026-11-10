interface MetaData {
  createdBy: string;
  name: string;
}

export interface CalendarEventJSON extends MetaData {
  categories: string[];
  categoryTitles: {
    [key: string]: [
      {
        description: string;
        end_timestamp: Date;
        start_timestamp: Date;
        title: string;
      },
    ];
  };
}

export interface CompaniesNotesJSON extends MetaData {
  chain_notes: { comment: string }[][];
  non_chain_notes: { [key: string]: string[] };
}

type ContactNoteNonChainCategory =
  'new' | 'contacted' | 'interested' | 'unqualified' | 'qualified' | 'negotiation' | 'lost' | 'won' | 'churned';

export interface ContactsNotesJSON extends MetaData {
  chain_notes: { [key: string]: { comment: string }[][] };
  non_chain_notes: { [key: string]: { [key in ContactNoteNonChainCategory]: string } };
}

export interface DigitalIndustryJSON extends MetaData {
  jobTitles: { [key: string]: string[] };
  sectors: { [key: string]: string };
  types: { [key: string]: string };
}

export interface KanbanTasksJSON extends MetaData {
  stages: string[];
  tasks: {
    checklist: { completed: boolean; title: string }[];
    comments: string[];
    description: string;
    title: string;
  }[];
}

export interface PipelineDealsJSON extends MetaData {
  deal_title: string[];
}

export interface QuotesNotesJSON extends MetaData {
  formal_notes: { [key: string]: { description: string; title: string }[] };
  informal_notes: string[];
}

export interface QuotesServicesJSON extends MetaData {
  services: { [key: string]: string[] };
}
