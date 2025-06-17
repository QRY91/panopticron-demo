// src/providers/mock-auth-provider.ts
import { AuthProvider } from "@refinedev/core";
import { DEMO_CONFIG } from "@/demo-config";

export const mockAuthProvider: AuthProvider = {
  // Demo mode: always return successful login
  login: async ({ email, password, remember, providerName }) => {
    console.log("Demo Mode: Mock login successful");

    // Simulate some delay for realistic UX
    await new Promise(resolve => setTimeout(resolve, 500));

    // Store demo user in localStorage for consistency
    localStorage.setItem("demo_user", JSON.stringify(DEMO_CONFIG.DEMO_USER));
    localStorage.setItem("demo_authenticated", "true");

    return {
      success: true,
      redirectTo: "/dashboard",
    };
  },

  // Demo mode: always return successful logout
  logout: async () => {
    console.log("Demo Mode: Mock logout successful");

    // Clear demo storage
    localStorage.removeItem("demo_user");
    localStorage.removeItem("demo_authenticated");

    return {
      success: true,
      redirectTo: "/login",
    };
  },

  // Demo mode: always return as authenticated
  check: async () => {
    const isAuthenticated = localStorage.getItem("demo_authenticated") === "true";

    if (isAuthenticated) {
      return {
        authenticated: true,
      };
    }

    return {
      authenticated: false,
      redirectTo: "/login",
    };
  },

  // Demo mode: return demo user identity
  getIdentity: async () => {
    const demoUser = localStorage.getItem("demo_user");

    if (demoUser) {
      return JSON.parse(demoUser);
    }

    return DEMO_CONFIG.DEMO_USER;
  },

  // Demo mode: return full permissions
  getPermissions: async () => {
    return ["admin", "user", "viewer"]; // Full permissions for demo
  },

  // Demo mode: handle forgot password
  forgotPassword: async ({ email }) => {
    console.log("Demo Mode: Mock forgot password for:", email);

    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    return {
      success: true,
      successNotification: {
        message: "Demo Mode: Password reset email sent (simulated)",
        description: "In demo mode, no actual email is sent",
      },
    };
  },

  // Demo mode: handle update password
  updatePassword: async ({ password, confirmPassword }) => {
    console.log("Demo Mode: Mock password update");

    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 800));

    return {
      success: true,
      successNotification: {
        message: "Demo Mode: Password updated (simulated)",
        description: "In demo mode, no actual password change occurs",
      },
    };
  },

  // Demo mode: handle register
  register: async ({ email, password, firstName, lastName }) => {
    console.log("Demo Mode: Mock registration for:", email);

    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 1200));

    // Auto-login after registration in demo mode
    localStorage.setItem("demo_user", JSON.stringify({
      ...DEMO_CONFIG.DEMO_USER,
      email: email || DEMO_CONFIG.DEMO_USER.email,
      name: firstName && lastName ? `${firstName} ${lastName}` : DEMO_CONFIG.DEMO_USER.name,
    }));
    localStorage.setItem("demo_authenticated", "true");

    return {
      success: true,
      redirectTo: "/dashboard",
      successNotification: {
        message: "Demo Mode: Registration successful (simulated)",
        description: "Welcome to the demo environment",
      },
    };
  },

  // Demo mode: handle OAuth providers
  onError: async (error) => {
    console.warn("Demo Mode: Auth error handled:", error);

    return {
      error: {
        message: "Demo Mode: Authentication error (simulated)",
        name: "DemoAuthError",
      },
    };
  },
};

export default mockAuthProvider;
