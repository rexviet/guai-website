export interface DispatchOptions {
  eventType?: string;
  clientPayload?: Record<string, any>;
  fetchFn?: typeof fetch;
  immediate?: boolean;
}

export interface DispatchResult {
  success: boolean;
  reason?: string;
  status?: number;
}

let debounceTimer: NodeJS.Timeout | null = null;

export function resetDebounceTimer(): void {
  if (debounceTimer) {
    clearTimeout(debounceTimer);
    debounceTimer = null;
  }
}

export async function triggerGitHubDispatch(options?: DispatchOptions): Promise<DispatchResult> {
  const token = process.env.GITHUB_TOKEN || process.env.GITHUB_PAT_TOKEN;
  if (!token) {
    console.warn('[GitHubDispatch] Skipped dispatch: GITHUB_TOKEN environment variable is not configured.');
    return { success: false, reason: 'missing_token' };
  }

  const owner = process.env.GITHUB_REPO_OWNER || 'guai-studio';
  const repo = process.env.GITHUB_REPO_NAME || 'guai-studio-website';
  const eventType = options?.eventType || 'strapi_content_update';
  const clientPayload = options?.clientPayload || {};
  const fetchImpl = options?.fetchFn || fetch;

  const performDispatch = async (): Promise<DispatchResult> => {
    const url = `https://api.github.com/repos/${owner}/${repo}/dispatches`;
    try {
      const response = await fetchImpl(url, {
        method: 'POST',
        headers: {
          'Accept': 'application/vnd.github+json',
          'Authorization': `Bearer ${token}`,
          'User-Agent': 'Strapi-CMS-Dispatch',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event_type: eventType,
          client_payload: {
            triggered_at: new Date().toISOString(),
            ...clientPayload,
          },
        }),
      });

      if (response.ok || response.status === 204) {
        console.log(`[GitHubDispatch] Successfully triggered GitHub repository_dispatch for ${owner}/${repo}`);
        return { success: true, status: response.status };
      } else {
        const errorText = await response.text().catch(() => '');
        console.error(`[GitHubDispatch] GitHub API returned status ${response.status}: ${errorText}`);
        return { success: false, status: response.status, reason: errorText };
      }
    } catch (err: any) {
      console.error(`[GitHubDispatch] Failed to dispatch GitHub workflow:`, err);
      return { success: false, reason: err?.message || 'unknown_error' };
    }
  };

  if (options?.immediate) {
    return performDispatch();
  }

  return new Promise((resolve) => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
    debounceTimer = setTimeout(async () => {
      const result = await performDispatch();
      resolve(result);
    }, 2000);
  });
}
