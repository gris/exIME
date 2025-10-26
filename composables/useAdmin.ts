import type { Alumni } from "~/types/alumni";

export interface UseAdminReturn {
  isAdmin: Ref<boolean>;
  loading: Ref<boolean>;
  error: Ref<string | null>;
  checkAdmin: () => Promise<void>;
}

/**
 * Composable to check if the current user has admin privileges
 * Fetches the user's profile and caches the admin status
 */
export const useAdmin = (): UseAdminReturn => {
  const isAdmin = useState<boolean>("isAdmin", () => false);
  const loading = useState<boolean>("isAdminLoading", () => false);
  const error = useState<string | null>("isAdminError", () => null);

  const checkAdmin = async () => {
    // Skip if already checked
    if (isAdmin.value || loading.value) {
      return;
    }

    loading.value = true;
    error.value = null;

    try {
      const profile = await $fetch<Alumni | null>("/api/alumni/me");

      if (profile && profile.is_admin === true) {
        isAdmin.value = true;
      } else {
        isAdmin.value = false;
      }
    } catch (err: any) {
      console.error("Error checking admin status:", err);
      error.value = err.message || "Failed to check admin status";
      isAdmin.value = false;
    } finally {
      loading.value = false;
    }
  };

  // Auto-check when the composable is first used
  if (!isAdmin.value && !loading.value && process.client) {
    checkAdmin();
  }

  return {
    isAdmin: readonly(isAdmin) as Ref<boolean>,
    loading: readonly(loading) as Ref<boolean>,
    error: readonly(error) as Ref<string | null>,
    checkAdmin,
  };
};
