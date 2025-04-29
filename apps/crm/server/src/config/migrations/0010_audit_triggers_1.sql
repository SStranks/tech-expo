-- Custom SQL migration file, put your code below! --
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
$audit_trigger$ LANGUAGE plpgsql;--> statement-breakpoint

CREATE TRIGGER audit_calendar_category
AFTER UPDATE OR DELETE ON calendar_event_categories
  FOR EACH ROW EXECUTE FUNCTION audit_trigger();