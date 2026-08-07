import test from "node:test";
import assert from "node:assert";
import { validateLeadForm, submitLead } from "./lead-client.ts";

test("validateLeadForm returns errors for invalid or missing required fields", () => {
  const emptyResult = validateLeadForm({
    name: "",
    email: "",
    message: "",
  });
  assert.strictEqual(emptyResult.isValid, false);
  assert.ok(emptyResult.errors.name);
  assert.ok(emptyResult.errors.email);
  assert.ok(emptyResult.errors.message);

  const invalidEmailResult = validateLeadForm({
    name: "John Doe",
    email: "invalid-email",
    message: "Hello world",
  });
  assert.strictEqual(invalidEmailResult.isValid, false);
  assert.ok(invalidEmailResult.errors.email);
});

test("validateLeadForm passes for valid required fields", () => {
  const validResult = validateLeadForm({
    name: "Viet Phung",
    email: "viet@example.com",
    message: "Need AI Video Ads production",
    phone: "0901234567",
    company: "GuAI Studio",
    service_interest: "genai-commercial-video",
  });
  assert.strictEqual(validResult.isValid, true);
  assert.strictEqual(Object.keys(validResult.errors).length, 0);
});

test("submitLead returns structured result when API responds", async (t) => {
  // Mock fetch globally for this test
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => {
    return new Response(
      JSON.stringify({ success: true, message: "Lead submitted successfully", data: { id: "lead-123" } }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  };

  try {
    const formData = new FormData();
    formData.append("name", "Test User");
    formData.append("email", "test@example.com");
    formData.append("message", "Test message");

    const response = await submitLead(formData, "http://localhost:1337");
    assert.strictEqual(response.success, true);
    assert.strictEqual(response.message, "Lead submitted successfully");
  } finally {
    globalThis.fetch = originalFetch;
  }
});
