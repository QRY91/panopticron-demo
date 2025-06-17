// src/app/forgot-password/page.tsx
import { AuthPage } from "@components/auth-page";
import { redirect } from "next/navigation";
import { authProviderServer } from "@providers/auth-provider/auth-provider.server";

// --- Add these imports for custom title ---
import { ThemedTitleV2 } from "@refinedev/mui";
import PanopticonIcon from "@components/icons/PanopticonIcon";
// --- End imports for custom title ---

export default async function ForgotPassword() {
  const data = await getData();

  if (data.authenticated) {
    redirect(data?.redirectTo || "/dashboard");
  }

  return (
    <AuthPage
      type="forgotPassword"
      // --- Add custom title prop ---
      title={
        <ThemedTitleV2
          collapsed={false}
          text="Panopticron"
          icon={<PanopticonIcon style={{ width: 32, height: 32, marginRight: '8px' }} />}
        />
      }
    />
  );
}

async function getData() {
  const { authenticated, redirectTo, error } = await authProviderServer.check();
  return {
    authenticated,
    redirectTo: authenticated ? (redirectTo || "/dashboard") : null,
    error,
  };
}