import test from 'node:test';
import assert from 'node:assert/strict';
import { triggerGitHubDispatch, resetDebounceTimer } from './github-dispatch.js';

test('triggerGitHubDispatch - skips dispatch when GITHUB_TOKEN is missing', async () => {
  resetDebounceTimer();
  const originalToken = process.env.GITHUB_TOKEN;
  const originalPat = process.env.GITHUB_PAT_TOKEN;
  delete process.env.GITHUB_TOKEN;
  delete process.env.GITHUB_PAT_TOKEN;

  try {
    const result = await triggerGitHubDispatch({ eventType: 'test_event', immediate: true });
    assert.deepEqual(result, { success: false, reason: 'missing_token' });
  } finally {
    if (originalToken) process.env.GITHUB_TOKEN = originalToken;
    if (originalPat) process.env.GITHUB_PAT_TOKEN = originalPat;
  }
});

test('triggerGitHubDispatch - builds correct request options and payload when token is present', async () => {
  resetDebounceTimer();
  process.env.GITHUB_TOKEN = 'ghp_test1234567890';
  process.env.GITHUB_REPO_OWNER = 'test-owner';
  process.env.GITHUB_REPO_NAME = 'test-repo';

  let mockFetchCalled = false;
  let requestUrl = '';
  let requestHeaders: Record<string, string> = {};
  let requestBody: any = null;

  const mockFetch = async (url: string | URL | Request, init?: RequestInit) => {
    mockFetchCalled = true;
    requestUrl = url.toString();
    requestHeaders = (init?.headers as Record<string, string>) || {};
    requestBody = JSON.parse(init?.body as string);
    return new Response(null, { status: 204 });
  };

  try {
    const result = await triggerGitHubDispatch({
      eventType: 'strapi_content_update',
      clientPayload: { model: 'api::service.service', action: 'afterUpdate' },
      fetchFn: mockFetch as typeof fetch,
      immediate: true,
    });

    assert.equal(result.success, true);
    assert.equal(mockFetchCalled, true);
    assert.equal(requestUrl, 'https://api.github.com/repos/test-owner/test-repo/dispatches');
    assert.equal(requestHeaders['Authorization'], 'Bearer ghp_test1234567890');
    assert.equal(requestHeaders['Accept'], 'application/vnd.github+json');
    assert.equal(requestBody.event_type, 'strapi_content_update');
    assert.equal(requestBody.client_payload.model, 'api::service.service');
  } finally {
    delete process.env.GITHUB_TOKEN;
    delete process.env.GITHUB_REPO_OWNER;
    delete process.env.GITHUB_REPO_NAME;
  }
});
