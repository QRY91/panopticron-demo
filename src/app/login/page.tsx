// src/app/login/page.tsx
import { AuthPage } from "@components/auth-page";
import { authProviderServer } from "@providers/auth-provider/auth-provider.server";
import { redirect } from "next/navigation";

// --- Add these imports for custom title ---
import { ThemedTitleV2 } from "@refinedev/mui";
import PanopticonIcon from "@components/icons/PanopticonIcon";
// --- End imports for custom title ---

export default async function Login() {
  const data = await getData();

  if (data.authenticated) {
    // Redirect to /projects if authenticated, otherwise to whatever redirectTo suggests (or root)
    redirect(data?.redirectTo || "/dashboard");
  }

  return (
    <AuthPage
      type="login"
      // --- Add custom title prop ---
      title={
        <ThemedTitleV2
          collapsed={false} // In auth pages, title is usually not collapsed
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