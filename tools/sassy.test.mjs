/*
 * Tests for src/sassy.js: tab keys and the tooltip fallback placement.
 *
 *     npm install --no-save jsdom && node --test tools/sassy.test.mjs
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { JSDOM } from "jsdom";

const script = readFileSync(new URL("../src/sassy.js", import.meta.url), "utf8");

/** A page with sassy.js loaded. jsdom has no CSS anchor positioning, so tooltips use the fallback. */
const load = body => {
	const dom = new JSDOM(`<style>[role=tooltip] { margin-top: 6px }</style>${body}`, { runScripts: "outside-only" });
	dom.window.CSS.supports = () => false; // some jsdom versions claim to support anchor positioning
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

test("tooltip fallback: keeps the CSS offset every time it is shown", () => {
	const window = load(`
		<button id="trigger" aria-describedby="tip">Trigger</button>
		<div id="tip" role="tooltip" popover>Tip</div>`);
	const tip = window.document.getElementById("tip");
	const trigger = window.document.getElementById("trigger");

	// jsdom has no Popover API
	let open = false;
	tip.showPopover = () => (open = true);
	const matches = tip.matches.bind(tip);
	tip.matches = selector => (selector === ":popover-open" ? open : matches(selector));

	// no room above (jsdom has no layout), so the tooltip goes below the trigger, the offset away
	for (let i = 0; i < 2; i++) {
		trigger.dispatchEvent(new window.FocusEvent("focusin", { bubbles: true }));
		assert.equal(tip.style.top, "6px", `show ${i + 1}`);
	}
});
