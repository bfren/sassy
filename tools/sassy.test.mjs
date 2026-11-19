/*
 * Tests for src/sassy.js: tab keys, toolbar keys and dismissing.
 *
 *     npm install --no-save jsdom@31.0.1 && node --test tools/sassy.test.mjs
 *
 * Use the jsdom version CI pins in .github/workflows/check.yml.
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

test("dismissing: a --dismiss button hides the element it names, and other commands do not", () => {
	const window = load(`
		<div id="alert">
			<button id="other" commandfor="alert" command="--other"></button>
			<button id="close" commandfor="alert" command="--dismiss"><span id="icon"></span></button>
		</div>`);
	const $ = id => window.document.getElementById(id);

	$("other").click();
	assert.equal($("alert").hidden, false);
	$("icon").click(); // a click on something inside the button
	assert.equal($("alert").hidden, true);
});

test("toolbars: one tab stop, arrow keys wrap, Home and End jump, disabled controls and text fields are skipped", () => {
	const window = load(`
		<div role="toolbar">
			<div role="group"><button id="b1">1</button><button id="b2" disabled>2</button><button id="b3">3</button></div>
			<div role="group"><button id="b4">4</button><input id="text"></div>
		</div>`);
	const $ = id => window.document.getElementById(id);
	const tabStops = () => ["b1", "b3", "b4", "text"].filter(id => $(id).tabIndex === 0);

	assert.deepEqual(tabStops(), ["b1"]);
	$("b1").focus();
	press(window, $("b1"), "ArrowRight");
	assert.equal(window.document.activeElement, $("b3"));
	assert.deepEqual(tabStops(), ["b3"]);
	press(window, $("b3"), "End");
	assert.equal(window.document.activeElement, $("text"));
	press(window, $("text"), "ArrowRight"); // moves the caret, not the focus
	assert.equal(window.document.activeElement, $("text"));
	$("b4").focus();
	press(window, $("b4"), "ArrowRight");
	assert.equal(window.document.activeElement, $("text"));
	$("b1").focus();
	press(window, $("b1"), "ArrowLeft");
	assert.equal(window.document.activeElement, $("text"));
	press(window, $("b4"), "Home");
	assert.equal(window.document.activeElement, $("b1"));
});
