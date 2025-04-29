-- Custom SQL migration file, put your code below! --
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
AFTER UPDATE OR DELETE ON quote_services
  FOR EACH ROW EXECUTE FUNCTION audit_trigger();
