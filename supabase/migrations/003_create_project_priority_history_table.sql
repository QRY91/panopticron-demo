
-- 3. Create the project_priority_history table
CREATE TABLE IF NOT EXISTS public.project_priority_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    calculated_priority_score INTEGER,
    manual_override_value_at_event INTEGER,
    final_priority_sort_key INTEGER,
    reason_for_change TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
    -- Removed UNIQUE constraint from here, will add separately for clarity and idempotency
);

-- Ensure foreign key constraint is deferrable
ALTER TABLE public.project_priority_history
DROP CONSTRAINT IF EXISTS project_priority_history_project_id_fkey;

ALTER TABLE public.project_priority_history
ADD CONSTRAINT project_priority_history_project_id_fkey
FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE CASCADE
DEFERRABLE INITIALLY DEFERRED;

-- Remove old non-unique index if it exists, as the UNIQUE constraint will create its own index
DROP INDEX IF EXISTS public.idx_project_priority_history_project_id_timestamp;

-- Add a UNIQUE constraint on (project_id, timestamp) for ON CONFLICT
ALTER TABLE public.project_priority_history
DROP CONSTRAINT IF EXISTS uq_project_priority_history_project_id_timestamp; -- Drop if exists from a previous attempt

ALTER TABLE public.project_priority_history
ADD CONSTRAINT uq_project_priority_history_project_id_timestamp
UNIQUE (project_id, timestamp); -- This is the key change for ON CONFLICT

-- Optional: Index on reason_for_change if you plan to filter by it often
CREATE INDEX IF NOT EXISTS idx_project_priority_history_reason 
ON public.project_priority_history (reason_for_change);

COMMENT ON TABLE public.project_priority_history IS 'Logs changes to project priority scores over time.';
COMMENT ON COLUMN public.project_priority_history.project_id IS 'Foreign key to the projects table. Constraint is DEFERRABLE INITIALLY DEFERRED.';
COMMENT ON COLUMN public.project_priority_history.timestamp IS 'When this priority state was recorded. Part of a unique key with project_id.';
COMMENT ON CONSTRAINT uq_project_priority_history_project_id_timestamp ON public.project_priority_history IS 'Ensures that each project has only one history entry per exact timestamp, used for ON CONFLICT.';
COMMENT ON COLUMN public.project_priority_history.calculated_priority_score IS 'The system-calculated score at the time of this entry.';
COMMENT ON COLUMN public.project_priority_history.manual_override_value_at_event IS 'The manual override value active at the time of this entry, if any.';
COMMENT ON COLUMN public.project_priority_history.final_priority_sort_key IS 'The resulting sort key (manual or calculated) at the time of this entry.';
COMMENT ON COLUMN public.project_priority_history.reason_for_change IS 'A textual description of why the priority changed.';