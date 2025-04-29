-- TRIGGERS --
-- Drizzle does not have trigger functionality yet; generate custom migration file;
-- NODE_OPTIONS='--import tsx' pnpm exec drizzle-kit generate --custom --name=audit_triggers_1

-- TABLES TO HAVE TRIGGERS:
-- Calendar: Category, Event
-- Companies: Company, CompanyNote
-- Contacts: Contact, ContactNote
-- Kanban: Stage, Task (inc TaskComment, TaskChecklist) 
-- Pipeline: Stage, Deal
-- Quotes: Quote (inc Services), QuoteNote
-- 

CREATE OR REPLACE FUNCTION audit_trigger() RETURNS TRIGGER AS $audit_trigger$
DECLARE
  new_data jsonb;
  old_data jsonb;
  key text;
  new_values jsonb;
  old_values jsonb;
  client_id uuid;
BEGIN
  client_id := current_setting('app.client_id', true);
  new_values := '{}';
  old_values := '{}';

  IF TG_OP = 'UPDATE' THEN
    new_data := to_jsonb(NEW);
    old_data := to_jsonb(OLD);

    FOR key IN SELECT jsonb_object_keys(new_data) INTERSECT SELECT jsonb_object_keys(old_data)
    LOOP
      IF new_data ->> key != old_data ->> key THEN
          new_values := new_values || jsonb_build_object(key, new_data ->> key);
          old_values := old_values || jsonb_build_object(key, old_data ->> key);
      END IF;
    END LOOP;

  ELSIF TG_OP = 'DELETE' THEN
    old_data := to_jsonb(OLD);
    old_values := old_data;

    FOR key IN SELECT jsonb_object_keys(old_data)
    LOOP
      old_values := old_values || jsonb_build_object(key, old_data ->> key);
    END LOOP;

  END IF;

  IF (TG_OP = 'DELETE') THEN
    INSERT INTO audit_log (table_name, entity_id, entity_action, user_id, values_original, values_new)
    VALUES (TG_TABLE_NAME, OLD.id, TG_OP::entity_action, client_id, old_values, new_values);
  ELSIF (TG_OP = 'UPDATE') THEN
    INSERT INTO audit_log (table_name, entity_id, entity_action, user_id, values_original, values_new)
    VALUES (TG_TABLE_NAME, NEW.id, TG_OP::entity_action, client_id, old_values, new_values);
  END IF;
  RETURN NULL;
END;
$audit_trigger$ LANGUAGE plpgsql;

CREATE TRIGGER audit_calendar_category
AFTER UPDATE OR DELETE ON calendar_event_categories
  FOR EACH ROW EXECUTE FUNCTION audit_trigger();

CREATE TRIGGER audit_calendar_event
AFTER UPDATE OR DELETE ON calendar_events
  FOR EACH ROW EXECUTE FUNCTION audit_trigger();

CREATE TRIGGER audit_companies
AFTER UPDATE OR DELETE ON companies
  FOR EACH ROW EXECUTE FUNCTION audit_trigger();

CREATE TRIGGER audit_companies_notes
AFTER UPDATE OR DELETE ON companies_notes
  FOR EACH ROW EXECUTE FUNCTION audit_trigger();

CREATE TRIGGER audit_contacts
AFTER UPDATE OR DELETE ON contacts
  FOR EACH ROW EXECUTE FUNCTION audit_trigger();

CREATE TRIGGER audit_contacts_notes
AFTER UPDATE OR DELETE ON contacts_notes
  FOR EACH ROW EXECUTE FUNCTION audit_trigger();

CREATE TRIGGER audit_pipeline_stages
AFTER UPDATE OR DELETE ON pipeline_stages
  FOR EACH ROW EXECUTE FUNCTION audit_trigger();

CREATE TRIGGER audit_pipeline_deals
AFTER UPDATE OR DELETE ON pipeline_deals
  FOR EACH ROW EXECUTE FUNCTION audit_trigger();

CREATE TRIGGER audit_kanban_tasks
AFTER UPDATE OR DELETE ON kanban_tasks
  FOR EACH ROW EXECUTE FUNCTION audit_trigger();

CREATE TRIGGER audit_kanban_task_checklist
AFTER UPDATE OR DELETE ON kanban_task_checklist
  FOR EACH ROW EXECUTE FUNCTION audit_trigger();

CREATE TRIGGER audit_kanban_task_comments
AFTER UPDATE OR DELETE ON kanban_task_comments
  FOR EACH ROW EXECUTE FUNCTION audit_trigger();

CREATE TRIGGER audit_quotes
AFTER UPDATE OR DELETE ON quotes
  FOR EACH ROW EXECUTE FUNCTION audit_trigger();

CREATE TRIGGER audit_quotes_notes
AFTER UPDATE OR DELETE ON quotes_notes
  FOR EACH ROW EXECUTE FUNCTION audit_trigger();

CREATE TRIGGER audit_quotes_services
AFTER UPDATE OR DELETE ON quotes_services
  FOR EACH ROW EXECUTE FUNCTION audit_trigger();

