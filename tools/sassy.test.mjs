/*
 * Tests for src/sassy.js: tab keys.
 *
 *     npm install --no-save jsdom && node --test tools/sassy.test.mjs
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { JSDOM } from "jsdom";

const script = readFileSync(new URL("../src/sassy.js", import.meta.url), "utf8");

/** A page with sassy.js loaded. */
const load = body => {
	const dom = new JSDOM(body, { runScripts: "outside-only" });
	dom.window.eval(script);
	dom.window.Sassy.init(); // jsdom's readyState varies, so the script may be waiting for DOMContentLoaded
	return dom.window;
};

const press = (window, el, key) =>
	el.dispatchEvent(new window.KeyboardEvent("keydown", { key, bubbles: true, cancelable: true }));

test("tabs: arrow keys wrap, Home and End jump, disabled tabs are skipped, panels follow", () => {
	const window = load(`
		<div role="tablist">
			<button role="tab" id="t1" aria-controls="p1" aria-selected="true">1</button>
			<button role="tab" id="t2" aria-controls="p2" disabled>2</button>
			<button role="tab" id="t3" aria-controls="p3">3</button>
		</div>
		<div id="p1"></div><div id="p2"></div><div id="p3"></div>`);
	const $ = id => window.document.getElementById(id);

	assert.equal($("p3").hidden, true);
	press(window, $("t1"), "ArrowRight");
	assert.equal($("t3").getAttribute("aria-selected"), "true");
	assert.equal($("p1").hidden, true);
	assert.equal($("p3").hidden, false);
	press(window, $("t3"), "ArrowRight");
	assert.equal($("t1").getAttribute("aria-selected"), "true");
	press(window, $("t1"), "End");
	assert.equal($("t3").getAttribute("aria-selected"), "true");
	press(window, $("t3"), "Home");
	assert.equal($("t1").getAttribute("aria-selected"), "true");
});
