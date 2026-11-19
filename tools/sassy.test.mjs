/*
 * Tests for src/sassy.js: tab keys, toolbar keys, dismissing, tooltips and dropdowns.
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

/** A page with sassy.js loaded. `before` runs first, to change what the browser supports (older jsdom has no window.CSS). */
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
	const { $, box, focus } = tooltipPage(window => (window.CSS = { supports: () => false }));
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
	const { $, focus } = tooltipPage(window => (window.CSS = { supports: () => true }));
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

const menuItems = `
	<button id="m1" role="menuitem">Copy</button>
	<button id="m2" role="menuitem" disabled>Cut</button>
	<button id="m3" role="menuitem">Paste</button>`;

/**
 * A page with a dropdown menu, or with other popover content and attributes. jsdom has no popovers, so opening,
 * closing and the toggle events are stubbed.
 */
const dropdownPage = (menuStyle = "", menu = `role="menu">${menuItems}`) => {
	const window = load(`
		<style>[popover] { margin: 2px; } [popover][data-opened="true"] { display: block; }</style>
		<button id="open" popovertarget="menu" aria-haspopup="menu">Actions</button>
		<div id="menu" popover style="${menuStyle}" ${menu}</div>`, window => (window.CSS = { supports: () => false }));
	const { HTMLElement, Event } = window;
	const matches = HTMLElement.prototype.matches;
	HTMLElement.prototype.matches = function (s) { return s === ":popover-open" ? this.dataset.opened === "true" : matches.call(this, s); };
	HTMLElement.prototype.hidePopover = function () { delete this.dataset.opened; };
	const $ = id => window.document.getElementById(id);
	const box = (el, left, top, width, height) =>
		(el.getBoundingClientRect = () => ({ left, top, width, height, right: left + width, bottom: top + height }));
	box($("menu"), 0, 0, 160, 100);
	const toggle = state => {
		if (state === "open") $("menu").dataset.opened = "true";
		$("menu").dispatchEvent(Object.assign(new Event("toggle"), { newState: state }));
	};
	return { window, $, box, toggle };
};

test("dropdowns: opening sets aria-expanded, places the menu below its button, and focuses the first item", () => {
	const { window, $, box, toggle } = dropdownPage();
	box($("open"), 100, 50, 80, 30);
	$("open").click(); // remembers which button opened the menu
	toggle("open");
	assert.equal($("open").getAttribute("aria-expanded"), "true");
	assert.deepEqual([$("menu").style.top, $("menu").style.left], ["82px", "100px"]); // 50 + 30 + 2, lined up with the start
	assert.equal(window.document.activeElement, $("m1"));

	box($("open"), 100, 700, 80, 30); // 768px tall window: no room below, so above
	toggle("open");
	assert.equal($("menu").style.top, "598px"); // 700 - 100 - 2

	toggle("closed");
	assert.equal($("open").getAttribute("aria-expanded"), "false");
});

test("dropdowns: %bf-dropdown-end lines the menu up with the button's end", () => {
	const { $, box, toggle } = dropdownPage("--sassy-dropdown-align: span-inline-start");
	box($("open"), 300, 50, 80, 30);
	toggle("open");
	assert.equal($("menu").style.left, "220px"); // 300 + 80 - 160
});

test("dropdowns: arrow keys move through enabled items, Tab and choosing an item close the menu", () => {
	const { window, $, toggle } = dropdownPage();
	toggle("open");
	press(window, $("m1"), "ArrowDown");
	assert.equal(window.document.activeElement, $("m3")); // Cut is disabled
	press(window, $("m3"), "ArrowDown");
	assert.equal(window.document.activeElement, $("m1"));
	press(window, $("m1"), "End");
	assert.equal(window.document.activeElement, $("m3"));

	press(window, $("m3"), "Tab");
	assert.equal($("menu").dataset.opened, undefined);

	toggle("open");
	$("m1").click();
	assert.equal($("menu").dataset.opened, undefined);
});

test("popovers: placed above and centred, or on the side set, and clicks inside keep them open", () => {
	const popover = `role="dialog" aria-labelledby="h"><h3 id="h">Title</h3><button id="m1">More</button>
		<button id="x" popovertarget="menu" popovertargetaction="hide">Close</button>`;
	let { $, box, toggle } = dropdownPage("", popover);
	box($("open"), 100, 200, 80, 30);
	$("open").click();
	toggle("open");
	assert.deepEqual([$("menu").style.top, $("menu").style.left], ["98px", "60px"]); // 200 - 100 - 2, and 100 + (80 - 160) / 2
	$("m1").click();
	assert.equal($("menu").dataset.opened, "true");
	$("x").click(); // the close button is not the popover's button, so aria-expanded stays on the opener
	toggle("closed");
	assert.equal($("open").getAttribute("aria-expanded"), "false");
	assert.equal($("x").hasAttribute("aria-expanded"), false);

	({ $, box, toggle } = dropdownPage("--sassy-popover-side: inline-end", popover));
	box($("open"), 100, 200, 80, 30);
	toggle("open");
	assert.deepEqual([$("menu").style.top, $("menu").style.left], ["165px", "182px"]); // 200 + (30 - 100) / 2, and 180 + 2

	box($("open"), 900, 200, 80, 30); // 1024px wide window: no room after, so before
	toggle("open");
	assert.equal($("menu").style.left, "738px"); // 900 - 160 - 2
});
