-- Ensure pgTAP extension is available
-- CREATE EXTENSION IF NOT EXISTS pgtap; -- Usually run once per database

-- Wrap tests in a transaction that will be rolled back
BEGIN;

-- Plan the number of tests
SELECT plan(15); -- Adjust if you add/remove tests

--------------------------------------------------------------------------------
-- Test Setup: Create a sample project
--------------------------------------------------------------------------------
-- Clean up any existing test project to ensure test idempotency
DELETE FROM public.projects WHERE id = '00000000-0000-0000-0000-000000000001';

INSERT INTO public.projects (
    id,                             -- Provided (though has default)
    name,                           -- NOT NULL
    vercel_project_id,              -- NOT NULL
    -- Columns relevant for priority calculation by the trigger:
    latest_prod_deployment_status,
    github_ci_status,
    last_synced_at
    -- manual_priority_override is set by UPDATEs later in the test
)
VALUES (
    '00000000-0000-0000-0000-000000000001', -- id
    'Test Project Alpha',                   -- name
    'prj_testvercelid123',                  -- vercel_project_id
    'READY',                                -- latest_prod_deployment_status
    'success',                              -- github_ci_status
    NOW() - INTERVAL '1 day'                -- last_synced_at
);
    -- calculated_priority_score and priority_sort_key will be set by the trigger.
    -- created_at and updated_at will use their defaults.
    -- Other nullable columns will be NULL.

-- Fetch the initial calculated score for reference.
PREPARE get_initial_calculated_score AS SELECT calculated_priority_score FROM public.projects WHERE id = '00000000-0000-0000-0000-000000000001';
PREPARE get_initial_sort_key AS SELECT priority_sort_key FROM public.projects WHERE id = '00000000-0000-0000-0000-000000000001';

-- ... (rest of the test script remains the same) ...

UPDATE public.projects SET manual_priority_override = 100 WHERE id = '00000000-0000-0000-0000-000000000001';

SELECT results_eq(
    'SELECT manual_priority_override FROM public.projects WHERE id = ''00000000-0000-0000-0000-000000000001''',
    $$VALUES (100)$$,
    'TC1.1: manual_priority_override should be 100 after update.'
);

SELECT results_eq(
    'SELECT priority_sort_key FROM public.projects WHERE id = ''00000000-0000-0000-0000-000000000001''',
    $$VALUES (100)$$,
    'TC1.2: priority_sort_key should be 100 (the manual override).'
);

SELECT results_eq(
    'SELECT calculated_priority_score FROM public.projects WHERE id = ''00000000-0000-0000-0000-000000000001''',
    'EXECUTE get_initial_calculated_score',
    'TC1.3: calculated_priority_score should reflect project status, unaffected by manual override itself.'
);

SELECT results_eq(
    'SELECT reason_for_change FROM public.project_priority_history WHERE project_id = ''00000000-0000-0000-0000-000000000001'' ORDER BY timestamp DESC LIMIT 1',
    $$VALUES ('Manual priority override set to 100')$$,
    'TC1.4: History log should indicate manual override was set.'
);
SELECT results_eq(
    'SELECT final_priority_sort_key FROM public.project_priority_history WHERE project_id = ''00000000-0000-0000-0000-000000000001'' ORDER BY timestamp DESC LIMIT 1',
    $$VALUES (100)$$,
    'TC1.5: History log final_priority_sort_key should be 100.'
);

--------------------------------------------------------------------------------
-- Test Case 2: Changing an Existing Manual Override
--------------------------------------------------------------------------------
UPDATE public.projects SET manual_priority_override = 15000 WHERE id = '00000000-0000-0000-0000-000000000001';
SELECT results_eq(
    'SELECT priority_sort_key FROM public.projects WHERE id = ''00000000-0000-0000-0000-000000000001''',
    $$VALUES (15000)$$,
    'TC2.1: priority_sort_key should be 15000 after change.'
);
SELECT results_eq(
    'SELECT reason_for_change FROM public.project_priority_history WHERE project_id = ''00000000-0000-0000-0000-000000000001'' ORDER BY timestamp DESC LIMIT 1',
    $$VALUES ('Manual priority override set to 15000')$$,
    'TC2.2: History log should indicate manual override changed.'
);

--------------------------------------------------------------------------------
-- Test Case 3: Clearing a Manual Override
--------------------------------------------------------------------------------
UPDATE public.projects SET manual_priority_override = NULL WHERE id = '00000000-0000-0000-0000-000000000001';
SELECT results_eq(
    'SELECT manual_priority_override FROM public.projects WHERE id = ''00000000-0000-0000-0000-000000000001''',
    $$VALUES (NULL::integer)$$,
    'TC3.1: manual_priority_override should be NULL after clearing.'
);
SELECT results_eq(
    'SELECT priority_sort_key FROM public.projects WHERE id = ''00000000-0000-0000-0000-000000000001''',
    'EXECUTE get_initial_sort_key', 
    'TC3.2: priority_sort_key should revert to current calculated_priority_score.'
);
SELECT results_eq(
    'SELECT reason_for_change FROM public.project_priority_history WHERE project_id = ''00000000-0000-0000-0000-000000000001'' ORDER BY timestamp DESC LIMIT 1',
    $$VALUES ('Manual priority override cleared')$$,
    'TC3.3: History log should indicate manual override was cleared.'
);

--------------------------------------------------------------------------------
-- Test Case 4: Interaction with Automated Priority Changes
--------------------------------------------------------------------------------
UPDATE public.projects 
SET manual_priority_override = NULL, latest_prod_deployment_status = 'READY', github_ci_status = 'success' 
WHERE id = '00000000-0000-0000-0000-000000000001';

UPDATE public.projects SET latest_prod_deployment_status = 'ERROR' WHERE id = '00000000-0000-0000-0000-000000000001';

PREPARE get_error_state_calculated_score AS 
    SELECT public.calculate_project_priority_score(p.*) 
    FROM public.projects p 
    WHERE p.id = '00000000-0000-0000-0000-000000000001';

SELECT results_eq(
    'SELECT calculated_priority_score FROM public.projects WHERE id = ''00000000-0000-0000-0000-000000000001''',
    'EXECUTE get_error_state_calculated_score',
    'TC4.1: calculated_priority_score should update on status change (ERROR).'
);
SELECT results_eq(
    'SELECT priority_sort_key FROM public.projects WHERE id = ''00000000-0000-0000-0000-000000000001''',
    'EXECUTE get_error_state_calculated_score', 
    'TC4.2: priority_sort_key should reflect new calculated score (ERROR).'
);

UPDATE public.projects SET manual_priority_override = 500 WHERE id = '00000000-0000-0000-0000-000000000001';
SELECT results_eq(
    'SELECT priority_sort_key FROM public.projects WHERE id = ''00000000-0000-0000-0000-000000000001''',
    $$VALUES (500)$$,
    'TC4.3: priority_sort_key should be the manual override (500).'
);

UPDATE public.projects SET latest_prod_deployment_status = 'READY' WHERE id = '00000000-0000-0000-0000-000000000001';
SELECT results_eq(
    'SELECT calculated_priority_score FROM public.projects WHERE id = ''00000000-0000-0000-0000-000000000001''',
    'EXECUTE get_initial_calculated_score', 
    'TC4.4: calculated_priority_score should revert when status is READY (manual override active).'
);
SELECT results_eq(
    'SELECT priority_sort_key FROM public.projects WHERE id = ''00000000-0000-0000-0000-000000000001''',
    $$VALUES (500)$$,
    'TC4.5: priority_sort_key should still be the manual override (500) despite status change.'
);

DEALLOCATE get_initial_calculated_score;
DEALLOCATE get_initial_sort_key;
DEALLOCATE get_error_state_calculated_score;

SELECT * FROM finish();

ROLLBACK;