-- 2. Create the function to calculate project priority score
CREATE OR REPLACE FUNCTION public.calculate_project_priority_score(p_project_row projects)
RETURNS INTEGER AS $$
DECLARE
    score INTEGER := 10000; -- Base score (lower priority)
BEGIN
    -- Malus for Vercel deployment status
    IF p_project_row.latest_prod_deployment_status = 'ERROR' THEN
        score := score - 8000;
    ELSIF p_project_row.latest_prod_deployment_status = 'CANCELLED' THEN
        score := score - 7000;
    ELSIF p_project_row.latest_prod_deployment_status = 'BUILDING' OR p_project_row.latest_prod_deployment_status = 'QUEUED' THEN
        score := score - 1000;
    END IF;

    -- Malus for GitHub CI status
    IF p_project_row.github_ci_status = 'failure' THEN
        score := score - 500;
    END IF;

    -- Malus for data staleness
    IF p_project_row.last_synced_at IS NULL THEN
        score := score - 1000; 
    ELSIF p_project_row.last_synced_at < (NOW() - INTERVAL '3 days') THEN
        score := score - 300;
    END IF;

    -- Ensure score is at least 1 (highest priority)
    RETURN GREATEST(1, score);
END;
$$ LANGUAGE plpgsql STABLE; -- STABLE because it doesn't modify the database but depends on row data

COMMENT ON FUNCTION public.calculate_project_priority_score(projects) IS 'Calculates a numerical priority score for a project based on its status fields. Lower scores indicate higher priority.';