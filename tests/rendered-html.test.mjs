import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

async function render(path = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${path}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(
    new Request(`http://localhost${path}`, { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("renders a multi-page Indian civic service portal", async () => {
  const response = await render("/");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /Independent civic innovation prototype/);
  assert.match(html, /Cleaner streets start with one clear signal/);
  assert.match(html, /Report issue/i);
  assert.match(html, /Officer dashboard/i);
  assert.match(html, /What would you like to do/);
  assert.match(html, /All data and authority actions are simulated/);
});

test("preserves report, map, dashboard and future application views", async () => {
  const pages = await Promise.all(["/report", "/track", "/map", "/dashboard", "/future"].map(async path => {
    const response = await render(path);
    assert.equal(response.status, 200, path);
    return response.text();
  }));
  assert.match(pages[0], /Report a cleanliness issue/);
  assert.match(pages[0], /Public social post link/);
  assert.match(pages[0], /Overflowing garbage or bin/);
  assert.match(pages[0], /Clogged drain or sewer/);
  assert.match(pages[0], /Problem not listed here/);
  assert.match(pages[1], /Track and verify a report/);
  assert.match(pages[2], /Every signal has a place/);
  assert.match(pages[3], /AI-prioritised response queue/i);
  assert.match(pages[3], /Where should the city act next/);
  assert.match(pages[4], /Consent is the bridge/);
});

test("ships interaction, accessibility, responsive and social-preview assets", async () => {
  const [page, css, layout, locations] = await Promise.all([
    readFile(new URL("../app/components/PortalPage.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/data/india-locations.ts", import.meta.url), "utf8"),
    access(new URL("../public/og.png", import.meta.url)),
  ]);
  assert.match(page, /className="skip-link"/);
  assert.match(page, /navigator\.geolocation/);
  assert.match(page, /google\.com\/maps\/search/);
  assert.match(page, /Choose from all 36 state\/UT entries/);
  assert.match(page, /role="combobox"/);
  assert.match(page, /No directory match/);
  assert.match(page, /INDIA_CITY_COUNT/);
  assert.match(locations, /export const INDIA_CITY_COUNT = 4242/);
  assert.equal([...locations.matchAll(/\n {4}"code": "[A-Z]{2}",/g)].length, 36);
  assert.match(locations, /"name": "Andaman and Nicobar Islands"/);
  assert.match(locations, /"name": "Dadra and Nagar Haveli and Daman and Diu"/);
  assert.match(locations, /"name": "Ladakh"/);
  assert.match(locations, /"Leh"/);
  assert.match(locations, /"Puducherry"/);
  assert.match(page, /type="range"/);
  assert.match(page, /22 scheduled Indian languages/);
  assert.match(page, /Decrease text size/);
  assert.match(page, /evidence-before\.jpg/);
  assert.match(page, /evidence-after\.jpg/);
  assert.match(page, /useTicketFeed/);
  assert.match(page, /REPORT_STORAGE_KEY/);
  assert.match(page, /Choose officer city dashboard/);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
  assert.match(css, /@media \(max-width: 760px\)/);
  assert.match(css, /\.city-results/);
  assert.match(layout, /SwachhNexus — Signal to Action to Proof/);
  assert.match(layout, /og\.png/);
});
