-- 6. Backfill priority fields for existing projects by re-evaluating them.
-- This will cause the trigger to fire for each project.
DO $$
DECLARE
    project_row public.projects%ROWTYPE;
BEGIN
    RAISE NOTICE 'Starting backfill for project priority fields by re-evaluating projects...';
    FOR project_row IN SELECT * FROM public.projects LOOP
        -- Perform an update that will engage the trigger.
        -- Updating manual_priority_override to its current value is a safe way
        -- to ensure the trigger's "UPDATE OF manual_priority_override" condition is met.
        -- The trigger will then recalculate everything.
        UPDATE public.projects
        SET manual_priority_override = project_row.manual_priority_override 
        WHERE id = project_row.id;
        
        RAISE NOTICE 'Triggered re-evaluation for project ID: %', project_row.id;
    END LOOP;
    RAISE NOTICE 'Finished backfill for project priority fields.';
END $$;

-- Note: If a project's priority_sort_key does not change as a result of this backfill,
-- the trigger's condition `NEW.priority_sort_key IS DISTINCT FROM v_old_priority_sort_key`
-- might prevent a new history entry. If you want a history entry for *every* project
-- during backfill, regardless of whether the key changed from its pre-backfill state,
-- you'd need a separate script for history backfill (see next file).