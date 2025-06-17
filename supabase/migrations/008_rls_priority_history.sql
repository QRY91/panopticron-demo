-- 8. RLS Policies for project_priority_history
-- Ensure RLS is enabled on the table first
ALTER TABLE public.project_priority_history ENABLE ROW LEVEL SECURITY;

-- Policy to allow authenticated users to read priority history.
-- Adjust the USING clause if history should be scoped, e.g., to projects the user owns/can access.
-- For a unified dashboard, authenticated users might be allowed to see all history.
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'project_priority_history' 
          AND policyname = 'Allow authenticated users to select priority history'
          AND schemaname = 'public'
    ) THEN
        CREATE POLICY "Allow authenticated users to select priority history"
        ON public.project_priority_history
        FOR SELECT
        TO authenticated
        USING (true); -- Allows authenticated users to read all history records.
                      -- For more granular control, you might join with a projects table
                      -- and check user permissions there:
                      -- USING (EXISTS (SELECT 1 FROM projects p WHERE p.id = project_id AND auth.uid() = p.user_id))
                      -- Or if projects have a team/org concept.
    END IF;
END $$;

-- The trigger function `update_project_priority_key_fields` inserts into `project_priority_history`.
-- If the trigger is SECURITY DEFINER (often the case if created by a superuser like 'postgres' in Supabase dashboard),
-- it runs with the permissions of its definer and can insert regardless of the invoking user's RLS.
-- If it's SECURITY INVOKER, the user whose action on 'projects' fired the trigger needs INSERT permission.
-- Let's assume the trigger operates with sufficient privileges (typical for Supabase).
-- If direct inserts from client/app are ever needed (unlikely for this history table):
-- CREATE POLICY "Allow specific role to insert priority history"
-- ON public.project_priority_history
-- FOR INSERT
-- TO service_role -- or another specific role
-- WITH CHECK (true);

COMMENT ON POLICY "Allow authenticated users to select priority history" ON public.project_priority_history IS 'Allows authenticated users to read project priority history, required for the lifeline chart.';