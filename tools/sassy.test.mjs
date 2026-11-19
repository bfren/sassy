/*
 * Tests for src/sassy.js: tab keys, toolbar keys, dismissing, and opening tooltips beside their trigger.
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

/** A page with sassy.js loaded. `before` runs first, to change what the browser supports. */
const load = (body, before) => {
	const dom = new JSDOM(body, { runScripts: "outside-only" });
	before?.(dom.window);
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

/** A page with a tooltip 100 x 30 that is 8px from its trigger. jsdom has no popovers, so opening one is stubbed. */
const tooltipPage = before => {
	const window = load(`
		<style>[role="tooltip"] { margin: 8px; }</style>
		<button id="a" aria-describedby="tip">A</button>
		<button id="b" aria-describedby="tip">B</button>
		<div id="tip" role="tooltip" popover="manual">Tip</div>`, before);
	window.HTMLElement.prototype.showPopover = function () { this.dataset.opened = "true"; };
	const $ = id => window.document.getElementById(id);
	const box = (el, left, top, width, height) =>
		(el.getBoundingClientRect = () => ({ left, top, width, height, right: left + width, bottom: top + height }));
	box($("tip"), 0, 0, 100, 30);
	const focus = el => el.dispatchEvent(new window.FocusEvent("focusin", { bubbles: true }));
	return { window, $, box, focus };
};

test("positioning without anchor positioning: above and centred, below if no room, kept on screen", () => {
	const { $, box, focus } = tooltipPage(window => (window.CSS.supports = () => false));
	const at = () => [$("tip").style.top, $("tip").style.left];

	box($("a"), 400, 200, 50, 20);
	focus($("a"));
	assert.equal($("tip").dataset.opened, "true");
	assert.deepEqual(at(), ["162px", "375px"]); // 200 - 30 - 8, and 400 + (50 - 100) / 2
	assert.equal($("tip").style.margin, "0px");

	box($("a"), 400, 10, 50, 20);
	focus($("a"));
	assert.deepEqual(at(), ["38px", "375px"]); // no room above, so 8px below the trigger's bottom at 30

	box($("a"), 1000, 200, 20, 20);
	focus($("a"));
	assert.equal(at()[1], "916px"); // 1024 - 100 - 8: kept inside the right edge

	box($("a"), 0, 200, 20, 20);
	focus($("a"));
	assert.equal(at()[1], "8px"); // and the left edge
});

test("positioning with anchor positioning: the tooltip anchors to whichever trigger opened it", () => {
	const { $, focus } = tooltipPage(window => (window.CSS.supports = () => true));
	const anchorOf = el => el.style.getPropertyValue("anchor-name");

	focus($("a"));
	const name = $("tip").style.getPropertyValue("position-anchor");
	assert.match(name, /^--sassy-anchor-\d+$/);
	assert.equal(anchorOf($("a")), name);
	assert.equal($("tip").style.top, ""); // CSS places it, not the script

	focus($("b"));
	assert.equal(anchorOf($("b")), name);
	assert.equal(anchorOf($("a")), ""); // the name moves, so only one trigger holds it
});
