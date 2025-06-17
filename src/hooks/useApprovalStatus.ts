// src/hooks/useApprovalStatus.ts
import { useState, useEffect, useCallback, useRef } from 'react';
import { useGetIdentity, useIsAuthenticated } from '@refinedev/core';
import { supabaseBrowserClient } from '@utils/supabase/client';

interface ApprovalStatus {
  isApproved: boolean | null;
  isLoading: boolean; // This expects a boolean
  error: string | null;
}

export const useApprovalStatus = (): ApprovalStatus => {
  const { data: identity, isLoading: isLoadingIdentity } = useGetIdentity<{ id: string }>();
  const { data: authCoreData, isLoading: isAuthCheckLoading } = useIsAuthenticated();

  const [isApprovedInternal, setIsApprovedInternal] = useState<boolean | null>(null);
  const [approvalError, setApprovalError] = useState<string | null>(null);
  const [isCheckingApproval, setIsCheckingApproval] = useState<boolean>(false);

  const prevIdentityId = useRef(identity?.id);
  const prevAuthCoreStatus = useRef(authCoreData?.authenticated);

  const performCheck = useCallback(async (userId: string) => {
    // ... (same as before)
    if (!userId) {
      setIsApprovedInternal(false);
      setIsCheckingApproval(false);
      return;
    }
    setIsCheckingApproval(true);
    setApprovalError(null);
    try {
      const { data, error } = await supabaseBrowserClient
        .from("approved_users")
        .select("user_id", { count: 'exact' })
        .eq("user_id", userId)
        .maybeSingle();
      if (error) {
        setApprovalError("Could not verify approval status.");
        setIsApprovedInternal(false);
      } else {
        setIsApprovedInternal(!!data);
      }
    } catch (e) {
      setApprovalError("Unexpected error during approval check.");
      setIsApprovedInternal(false);
    } finally {
      setIsCheckingApproval(false);
    }
  }, []);

  useEffect(() => { /* ... Effect 1 for identity change ... */
    if (identity?.id !== prevIdentityId.current) {
        setIsApprovedInternal(null);
        setApprovalError(null);
        setIsCheckingApproval(false);
        prevIdentityId.current = identity?.id;
    }
  }, [identity?.id]);

  useEffect(() => { /* ... Effect 2 for main logic ... */
    const currentIdentityId = identity?.id;
    const currentAuthCoreStatus = authCoreData?.authenticated;

    if (currentAuthCoreStatus !== prevAuthCoreStatus.current) {
        if (currentAuthCoreStatus === true) {
            setIsApprovedInternal(null);
        } else {
            setIsApprovedInternal(false);
            setApprovalError(null);
        }
        prevAuthCoreStatus.current = currentAuthCoreStatus;
    }

    if (currentAuthCoreStatus && currentIdentityId) {
      if (isApprovedInternal === null && !isCheckingApproval) {
        performCheck(currentIdentityId);
      }
    } else if (!currentAuthCoreStatus && !isAuthCheckLoading && !isLoadingIdentity) {
      if (isApprovedInternal !== false) {
        setIsApprovedInternal(false);
        setApprovalError(null);
      }
    }
  }, [
    authCoreData?.authenticated,
    identity?.id,
    isAuthCheckLoading,
    isLoadingIdentity,
    isApprovedInternal,
    performCheck,
    isCheckingApproval
  ]);

  // Ensure isLoadingOverall is always explicitly boolean
  const isLoadingOverall: boolean = // <<< Explicitly type here
    !!(isAuthCheckLoading ||
    isLoadingIdentity ||
    isCheckingApproval ||
    (authCoreData?.authenticated && identity?.id && isApprovedInternal === null));

  return {
    isApproved: isLoadingOverall ? null : isApprovedInternal,
    isLoading: isLoadingOverall, // Now guaranteed to be boolean
    error: approvalError,
  };
};