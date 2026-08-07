import test from "node:test";
import assert from "node:assert";
import { getServices } from "./strapi-client.ts";

test("getServices returns an array", async () => {
  const result = await getServices("en");
  assert(Array.isArray(result));
});
