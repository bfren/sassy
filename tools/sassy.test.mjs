/*
 * Tests for src/sassy.js: tab keys, toolbar keys, dismissing, closing dialogs, scrollspy, carousels, tooltips, dropdowns and popovers.
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

test("closing dialogs: a click on the backdrop of a closedby=\"any\" modal closes it, and a click inside does not", () => {
	const window = load(`
		<dialog id="any" closedby="any" open><p id="text">Menu</p></dialog>
		<dialog id="none" open></dialog>`);
	const { HTMLElement, MouseEvent } = window;
	// jsdom has no top layer, so an open dialog stands in for a modal one
	const matches = HTMLElement.prototype.matches;
	HTMLElement.prototype.matches = function (s) { return matches.call(this, s.replace(":modal", "[open]")); };
	HTMLElement.prototype.close = function () { this.removeAttribute("open"); };
	const $ = id => window.document.getElementById(id);
	for (const id of ["any", "none"]) $(id).getBoundingClientRect = () => ({ left: 0, top: 0, right: 400, bottom: 800 });
	const click = (el, x) => el.dispatchEvent(new MouseEvent("click", { bubbles: true, clientX: x, clientY: 100 }));

	click($("any"), 200); // on the dialog's own padding
	click($("text"), 200);
	assert.equal($("any").open, true);
	click($("any"), 600);
	assert.equal($("any").open, false);
	click($("none"), 600);
	assert.equal($("none").open, true); // closedby is not set
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

/** A carousel of three 100px slides that plays. Timers and layout are stubbed: tick() runs the interval. */
const carouselPage = ({ reduce = false, style = "" } = {}) => {
	let tick, delay;
	const window = load(`
		<section aria-roledescription="carousel" aria-label="News">
			<button id="pause" aria-controls="slides" aria-pressed="false">Pause</button>
			<div id="slides" aria-live="off" style="${style}">
				<div id="s1" role="group" aria-roledescription="slide" aria-label="1 of 3"></div>
				<div id="s2" role="group" aria-roledescription="slide" aria-label="2 of 3"></div>
				<div id="s3" role="group" aria-roledescription="slide" aria-label="3 of 3"></div>
			</div>
		</section>`, window => {
		window.setInterval = (fn, ms) => ((tick = fn), (delay = ms));
		window.matchMedia = () => ({ matches: reduce });
		Object.defineProperty(window.document, "hidden", { value: false }); // jsdom pages are hidden unless told otherwise
	});
	const $ = id => window.document.getElementById(id);
	const slides = $("slides");
	const scrolls = [];
	let x = 0; // how far the slides are scrolled
	const layout = () => {
		slides.getBoundingClientRect = () => ({ left: 0, right: 100 });
		["s1", "s2", "s3"].forEach((id, i) => ($(id).getBoundingClientRect = () => ({ left: i * 100 - x, right: i * 100 - x + 100 })));
	};
	Object.defineProperties(slides, {
		scrollLeft: { get: () => x },
		clientWidth: { value: 100 },
		scrollWidth: { value: 300 }
	});
	slides.scrollBy = ({ left }) => (scrolls.push(left), (x += left), layout());
	layout();
	return { window, $, scrolls, tick: () => tick(), delay: () => delay };
};

test("carousels: play every 5 seconds, wrap from the last slide to the first, and pause with the button", () => {
	const { $, scrolls, tick, delay } = carouselPage();
	assert.equal(delay(), 5000);
	tick();
	tick();
	tick(); // at the end, so back to the start
	assert.deepEqual(scrolls, [100, 100, -200]);

	$("pause").click();
	assert.equal($("pause").getAttribute("aria-pressed"), "true");
	assert.equal($("slides").getAttribute("aria-live"), "polite");
	tick();
	assert.equal(scrolls.length, 3);

	$("pause").click();
	assert.equal($("slides").getAttribute("aria-live"), "off");
	tick();
	assert.equal(scrolls.length, 4);
});

test("carousels: start paused for reduced motion, and read the interval from --sassy-carousel-interval", () => {
	const { $, scrolls, tick, delay } = carouselPage({ reduce: true, style: "--sassy-carousel-interval: 1500ms" });
	assert.equal(delay(), 1500);
	assert.equal($("pause").getAttribute("aria-pressed"), "true");
	tick();
	assert.equal(scrolls.length, 0);
});

/** A page of three sections and a nav that spies on them. Layout is stubbed: scrollTo(y) moves the sections up by y. */
const scrollspyPage = (navStyle = "") => {
	const window = load(`
		<nav id="nav" style="${navStyle}">
			<a id="l1" href="#one" aria-current="location">One</a>
			<a id="l2" href="#two">Two</a>
			<a id="l3" href="#three">Three</a>
			<a id="away" href="https://example.com/">Away</a>
		</nav>
		<section id="one"></section><section id="two"></section><section id="three"></section>`);
	const $ = id => window.document.getElementById(id);
	const root = window.document.documentElement;
	let y = 0;
	Object.defineProperties(root, { scrollTop: { get: () => y }, clientHeight: { value: 800 }, scrollHeight: { value: 2000 } });
	const layout = () => ["one", "two", "three"].forEach((id, i) => ($(id).getBoundingClientRect = () => ({ top: 100 + i * 600 - y })));
	layout();
	const scrollTo = to => {
		y = to;
		layout();
		window.dispatchEvent(new window.Event("scroll"));
	};
	const current = () => ["l1", "l2", "l3"].filter(id => $(id).getAttribute("aria-current") === "location");
	return { $, scrollTo, current };
};

test("scrollspy: the link to the last section past a line 25% down is current, and the last at the bottom", () => {
	const { scrollTo, current } = scrollspyPage(); // window 768px tall, so the line is at 192
	scrollTo(0); // the script ran before the layout was stubbed
	assert.deepEqual(current(), ["l1"]);
	scrollTo(500); // two's top at 200: not yet past the line
	assert.deepEqual(current(), ["l1"]);
	scrollTo(510); // two's top at 190
	assert.deepEqual(current(), ["l2"]);
	scrollTo(1150); // three's top at 150
	assert.deepEqual(current(), ["l3"]);
});

test("scrollspy: the offset can be in rem, and the last section is current at the bottom even if its top has not reached the line", () => {
	const { $, scrollTo, current } = scrollspyPage("--sassy-scrollspy-offset: 3rem"); // 48px
	scrollTo(560); // two's top at 140, under the line
	assert.deepEqual(current(), ["l1"]);
	scrollTo(660); // two's top at 40
	assert.deepEqual(current(), ["l2"]);
	scrollTo(1200); // three's top at 100, under the line, but the page can't scroll further
	assert.deepEqual(current(), ["l3"]);
	assert.equal($("away").hasAttribute("aria-current"), false);
});

test("scrollspy: in a box that scrolls, a link scrolls only the box", () => {
	const window = load(`
		<nav><a id="l1" href="#one" aria-current="location">One</a><a id="l2" href="#two">Two</a></nav>
		<div id="box" style="overflow-y: auto"><section id="one"></section><section id="two"></section></div>`, window => {
		// the box must scroll before the script looks for it
		Object.defineProperties(window.HTMLDivElement.prototype, { scrollHeight: { value: 1000 }, clientHeight: { value: 200 } });
	});
	const $ = id => window.document.getElementById(id);
	$("box").getBoundingClientRect = () => ({ top: 50 });
	$("two").getBoundingClientRect = () => ({ top: 650 });
	let by, url;
	$("box").scrollBy = ({ top }) => (by = top);
	window.history.pushState = (state, title, to) => (url = to); // jsdom's about:blank can't take a hash
	const click = new window.MouseEvent("click", { bubbles: true, cancelable: true });
	$("l2").dispatchEvent(click);
	assert.equal(click.defaultPrevented, true); // so the page doesn't move
	assert.equal(by, 600);
	assert.equal(url, "#two");
});
