-- 1. Add priority-related columns to the 'projects' table
ALTER TABLE public.projects
ADD COLUMN IF NOT EXISTS calculated_priority_score INTEGER DEFAULT 10000,
ADD COLUMN IF NOT EXISTS manual_priority_override INTEGER DEFAULT NULL,
ADD COLUMN IF NOT EXISTS priority_sort_key INTEGER DEFAULT 10000;

-- Optional: Add an index for faster sorting on the final key
CREATE INDEX IF NOT EXISTS idx_projects_priority_sort_key 
ON public.projects (priority_sort_key ASC NULLS LAST);

COMMENT ON COLUMN public.projects.calculated_priority_score IS 'Score calculated by the system based on project status, lower is higher priority.';
COMMENT ON COLUMN public.projects.manual_priority_override IS 'Manually set priority score; overrides calculated_priority_score if set. Lower is higher priority.';
COMMENT ON COLUMN public.projects.priority_sort_key IS 'The final key used for sorting projects by priority, derived from manual_priority_override or calculated_priority_score.';