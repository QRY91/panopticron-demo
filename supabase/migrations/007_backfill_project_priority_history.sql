-- 7. Backfill project_priority_history with current state of projects
-- This creates an initial baseline history entry for all projects.
-- It's useful if the main backfill trigger didn't create entries because scores didn't change.

-- Start a DO block to allow procedural statements like RAISE NOTICE
DO $$
BEGIN
    RAISE NOTICE 'Starting backfill for project_priority_history...';

    INSERT INTO public.project_priority_history (
        project_id,
        timestamp,
        calculated_priority_score,
        manual_override_value_at_event,
        final_priority_sort_key,
        reason_for_change
    )
    SELECT
        p.id,                                 -- project_id
        COALESCE(p.updated_at, p.created_at, NOW()), -- Use existing timestamps if available, else NOW()
        p.calculated_priority_score,
        p.manual_priority_override,
        p.priority_sort_key,
        'Initial baseline priority from backfill' -- reason_for_change
    FROM
        public.projects p
    ON CONFLICT (project_id, timestamp) DO NOTHING; -- Avoid duplicates if somehow run multiple times or if a similar entry exists

    RAISE NOTICE 'Finished backfilling project_priority_history with initial baseline entries. Check the table to confirm.';

END $$;