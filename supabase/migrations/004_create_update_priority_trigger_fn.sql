-- 4. Create or replace the trigger function that updates priority fields and logs to history
CREATE OR REPLACE FUNCTION public.update_project_priority_key_fields()
RETURNS TRIGGER AS $$
DECLARE
    v_reason_text TEXT := 'Project definition updated';
    v_old_priority_sort_key INTEGER;
    v_old_calculated_score INTEGER;
    v_old_manual_override INTEGER;
BEGIN
    -- RAISE NOTICE '[TRIGGER START] Op: %, Project ID: %', TG_OP, NEW.id; -- Keep NOTICE for debugging if desired

    IF TG_OP = 'UPDATE' THEN
        v_old_priority_sort_key := OLD.priority_sort_key;
        v_old_calculated_score := OLD.calculated_priority_score;
        v_old_manual_override := OLD.manual_priority_override;
        -- RAISE NOTICE '[TRIGGER UPDATE] OLD values: manual_override=%, calculated_score=%, final_sort_key=%', 
        --              v_old_manual_override, v_old_calculated_score, v_old_priority_sort_key;
    END IF;

    -- RAISE NOTICE '[TRIGGER UPDATE] NEW incoming values: manual_override=%', NEW.manual_priority_override;

    -- Section 1: Calculate current priority scores
    NEW.calculated_priority_score := public.calculate_project_priority_score(NEW);
    NEW.priority_sort_key := COALESCE(NEW.manual_priority_override, NEW.calculated_priority_score);

    -- RAISE NOTICE '[TRIGGER CALC] NEW calculated_score: %, NEW final_sort_key: %', 
    --              NEW.calculated_priority_score, NEW.priority_sort_key;

    -- Section 2: Log to project_priority_history
    IF (TG_OP = 'INSERT' OR NEW.priority_sort_key IS DISTINCT FROM v_old_priority_sort_key) THEN
        -- RAISE NOTICE '[TRIGGER HISTORY] Condition met for logging. TG_OP: %, NEW.priority_sort_key: %, OLD.priority_sort_key: %', 
        --              TG_OP, NEW.priority_sort_key, v_old_priority_sort_key;
        
        IF TG_OP = 'UPDATE' THEN
            IF NEW.manual_priority_override IS DISTINCT FROM v_old_manual_override THEN
                IF NEW.manual_priority_override IS NOT NULL THEN
                    v_reason_text := 'Manual priority override set to ' || NEW.manual_priority_override::TEXT;
                ELSE
                    v_reason_text := 'Manual priority override cleared';
                END IF;
            ELSIF NEW.latest_prod_deployment_status IS DISTINCT FROM OLD.latest_prod_deployment_status THEN
                v_reason_text := 'Vercel status changed: ' || COALESCE(OLD.latest_prod_deployment_status, 'N/A') || ' -> ' || COALESCE(NEW.latest_prod_deployment_status, 'N/A');
            ELSIF NEW.github_ci_status IS DISTINCT FROM OLD.github_ci_status THEN
                v_reason_text := 'GitHub CI status changed: ' || COALESCE(OLD.github_ci_status, 'N/A') || ' -> ' || COALESCE(NEW.github_ci_status, 'N/A');
            ELSIF NEW.last_synced_at IS DISTINCT FROM OLD.last_synced_at THEN
                 v_reason_text := 'Project sync status updated';
            ELSE
                v_reason_text := 'Calculated priority score updated'; 
            END IF;
        ELSIF TG_OP = 'INSERT' THEN
            v_reason_text := 'Project created with initial priority';
        END IF;

        -- RAISE NOTICE '[TRIGGER HISTORY] Reason: %', v_reason_text;

        INSERT INTO public.project_priority_history (
            project_id, timestamp, calculated_priority_score, 
            manual_override_value_at_event, final_priority_sort_key, reason_for_change
        ) VALUES (
            NEW.id, 
            clock_timestamp(), -- Use clock_timestamp() for higher resolution
            NEW.calculated_priority_score, 
            NEW.manual_priority_override, 
            NEW.priority_sort_key, 
            v_reason_text
        );
        -- RAISE NOTICE '[TRIGGER HISTORY] Logged to project_priority_history.';
    -- ELSE
        -- RAISE NOTICE '[TRIGGER HISTORY] Condition NOT met for logging. TG_OP: %, NEW.priority_sort_key: %, OLD.priority_sort_key: %', 
        --              TG_OP, NEW.priority_sort_key, v_old_priority_sort_key;
    END IF;
    
    -- RAISE NOTICE '[TRIGGER END] Project ID: %', NEW.id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION public.update_project_priority_key_fields() IS 'Trigger function for projects table. Updates calculated_priority_score and priority_sort_key. Logs changes to project_priority_history if priority_sort_key changes or on insert. Uses clock_timestamp() for history entries.';