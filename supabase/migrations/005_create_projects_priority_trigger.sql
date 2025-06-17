-- 5. Create the trigger on the 'projects' table
-- Drop the trigger first if it already exists to ensure the latest definition is applied
DROP TRIGGER IF EXISTS projects_set_priority_trigger ON public.projects;

CREATE TRIGGER projects_set_priority_trigger
BEFORE INSERT OR UPDATE OF 
    latest_prod_deployment_status, 
    github_ci_status, 
    last_synced_at,
    manual_priority_override -- Crucial: trigger must fire if manual_priority_override changes
    -- Add any other columns from the 'projects' table that are inputs to calculate_project_priority_score
ON public.projects
FOR EACH ROW
EXECUTE FUNCTION public.update_project_priority_key_fields();

COMMENT ON TRIGGER projects_set_priority_trigger ON public.projects IS 'Automatically updates priority scores and logs history when relevant project fields change or on new project creation.';