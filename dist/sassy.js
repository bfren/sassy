/*!
 * Sassy v0.3.0 - behaviour for components that CSS cannot provide on its own
 * https://github.com/bfren/sassy - MIT licence
 *
 * - Tabs: switches panels, with arrow keys, Home and End (the WAI-ARIA tabs pattern).
 * - Tooltips: shows popover tooltips on hover and focus, and positions them in browsers
 *   without CSS anchor positioning.
 * - Collapsible content: a button with aria-expanded and aria-controls shows and hides what it controls,
 *   for navs that collapse on small screens.
 * - Commands: a fallback for command / commandfor buttons in browsers without them.
 *
 * Everything is found by ARIA role and standard attributes, never by class name, so it works
 * whatever selectors you extend Sassy's placeholders onto. Load it once, with defer:
 *     <script src="sassy.js" defer></script>
 * Content added later is handled too, except new tab lists and collapsed content: call Sassy.init(element) for those.
 */
(() => {
	"use strict";

	//  =================================================================
	//  Tabs
	//  =================================================================

	/** The tabs that belong to a tab list (not those of a tab list nested in a panel). */
	const tabsOf = list =>
		[...list.querySelectorAll('[role="tab"]')].filter(tab => tab.closest('[role="tablist"]') === list);

	/** The panel a tab controls, if it exists. */
	const panelOf = tab => document.getElementById(tab.getAttribute("aria-controls"));

	/** Whether a tab can be selected. */
	const enabled = tab => !tab.disabled && tab.getAttribute("aria-disabled") !== "true";

	/** Selects one tab in a list: only it is selected, in the tab order, and has its panel shown. */
	const select = (list, selected) =>
		tabsOf(list).forEach(tab => {
			const isSelected = tab === selected;
			tab.setAttribute("aria-selected", String(isSelected));
			tab.tabIndex = isSelected ? 0 : -1;
			const panel = panelOf(tab);
			if (panel) panel.hidden = !isSelected;
		});

	/** The tab a key moves to from the current one, or null if the key does not move. */
	const tabForKey = (list, current, key) => {
		const tabs = tabsOf(list).filter(enabled);
		const i = tabs.indexOf(current);
		const vertical = list.getAttribute("aria-orientation") === "vertical";
		const step = { [vertical ? "ArrowDown" : "ArrowRight"]: 1, [vertical ? "ArrowUp" : "ArrowLeft"]: -1 }[key];
		if (i < 0) return null;
		if (step) return tabs[(i + step + tabs.length) % tabs.length];
		if (key === "Home") return tabs[0];
		if (key === "End") return tabs[tabs.length - 1];
		return null;
	};

	/** Sets up a tab list: selects the tab marked aria-selected="true", or the first. */
	const initTabs = list => {
		const tabs = tabsOf(list);
		if (tabs.length > 0) {
			select(list, tabs.find(tab => tab.getAttribute("aria-selected") === "true") ?? tabs[0]);
		}
	};

	/** The tab list and tab an event happened on, if any. */
	const tabEvent = e => {
		const tab = e.target.closest?.('[role="tab"]');
		const list = tab?.closest('[role="tablist"]');
		return list && tabsOf(list).includes(tab) && enabled(tab) ? { list, tab } : null;
	};

	document.addEventListener("click", e => {
		const hit = tabEvent(e);
		if (hit) select(hit.list, hit.tab);
	});

	document.addEventListener("keydown", e => {
		const hit = tabEvent(e);
		const next = hit && tabForKey(hit.list, hit.tab, e.key);
		if (next) {
			e.preventDefault();
			select(hit.list, next);
			next.focus();
		}
	});

	//  =================================================================
	//  Tooltips
	//  =================================================================

	const anchorPositioning = window.CSS?.supports?.("anchor-name: --sassy") ?? false;
	const hideDelay = 100; // ms - time to move the pointer from the trigger onto the tooltip
	const timers = new WeakMap();
	const anchored = new WeakMap(); // tooltip -> the trigger currently holding its anchor name
	let anchorCount = 0;

	/** The tooltip an element is described by: a [role="tooltip"][popover] named in aria-describedby. */
	const tooltipOf = el => {
		for (const id of (el?.getAttribute?.("aria-describedby") ?? "").split(/\s+/)) {
			const tooltip = id ? document.getElementById(id) : null;
			if (tooltip?.matches('[role="tooltip"][popover]')) return tooltip;
		}
		return null;
	};

	/** The trigger an event happened on, and its tooltip. */
	const triggerEvent = e => {
		const trigger = e.target.closest?.("[aria-describedby]");
		const tooltip = tooltipOf(trigger);
		return tooltip ? { trigger, tooltip } : null;
	};

	const isOpen = tooltip => tooltip.matches(":popover-open");

	/** Anchors a tooltip to its trigger with CSS anchor positioning. */
	const anchor = (trigger, tooltip) => {
		tooltip.dataset.sassyAnchor ??= `--sassy-tooltip-${++anchorCount}`;
		const name = tooltip.dataset.sassyAnchor;
		anchored.get(tooltip)?.style.removeProperty("anchor-name");
		trigger.style.setProperty("anchor-name", name);
		tooltip.style.setProperty("position-anchor", name);
		anchored.set(tooltip, trigger);
	};

	/** Places a tooltip above its trigger (or below, if there is no room) without anchor positioning. */
	const place = (trigger, tooltip) => {
		tooltip.style.margin = ""; // place() sets it to 0 below, which would hide the CSS offset next time
		const offset = parseFloat(getComputedStyle(tooltip).marginTop) || 0;
		const t = trigger.getBoundingClientRect();
		const r = tooltip.getBoundingClientRect();
		const above = t.top - r.height - offset;
		const top = above >= 0 ? above : t.bottom + offset;
		const left = Math.min(Math.max(t.left + (t.width - r.width) / 2, offset), innerWidth - r.width - offset);
		Object.assign(tooltip.style, { margin: "0", top: `${top}px`, left: `${left}px` });
	};

	const show = (trigger, tooltip) => {
		clearTimeout(timers.get(tooltip));
		if (anchorPositioning) anchor(trigger, tooltip);
		if (!isOpen(tooltip)) tooltip.showPopover();
		if (!anchorPositioning) place(trigger, tooltip);
	};

	const hide = (tooltip, delay = hideDelay) =>
		timers.set(tooltip, setTimeout(() => isOpen(tooltip) && tooltip.hidePopover(), delay));

	document.addEventListener("pointerover", e => {
		const hit = triggerEvent(e);
		if (hit) show(hit.trigger, hit.tooltip);
		// keep a tooltip open while the pointer is over it
		const tooltip = e.target.closest?.('[role="tooltip"][popover]');
		if (tooltip) clearTimeout(timers.get(tooltip));
	});

	document.addEventListener("pointerout", e => {
		const hit = triggerEvent(e);
		if (hit && !hit.trigger.contains(e.relatedTarget)) hide(hit.tooltip);
		const tooltip = e.target.closest?.('[role="tooltip"][popover]');
		if (tooltip && !tooltip.contains(e.relatedTarget)) hide(tooltip);
	});

	document.addEventListener("focusin", e => {
		const hit = triggerEvent(e);
		if (hit) show(hit.trigger, hit.tooltip);
	});

	document.addEventListener("focusout", e => {
		const hit = triggerEvent(e);
		if (hit) hide(hit.tooltip, 0);
	});

	document.addEventListener("keydown", e => {
		if (e.key === "Escape") {
			document.querySelectorAll('[role="tooltip"][popover]').forEach(tooltip => isOpen(tooltip) && hide(tooltip, 0));
		}
	});

	//  =================================================================
	//  Collapsible content
	//  =================================================================

	/** A disclosure button: not a tab, and not something that opens a menu or runs a command. */
	const toggleSelector = "button[aria-expanded][aria-controls]:not([role], [command], [aria-haspopup])";

	/** Shows or hides what a button controls, to match its aria-expanded. */
	const sync = button => {
		const target = document.getElementById(button.getAttribute("aria-controls"));
		if (target) target.hidden = button.getAttribute("aria-expanded") !== "true";
	};

	document.addEventListener("click", e => {
		const button = e.target.closest?.(toggleSelector);
		if (button) {
			button.setAttribute("aria-expanded", String(button.getAttribute("aria-expanded") !== "true"));
			sync(button);
		}
	});

	//  =================================================================
	//  Commands: fallback for browsers without command / commandfor
	//  =================================================================

	if (!("command" in HTMLButtonElement.prototype)) {
		const popoverOpen = el => el.matches(":popover-open");
		const commands = {
			"show-modal": el => el.open || el.showModal(),
			"close": el => el.close(),
			"request-close": el => (el.requestClose ? el.requestClose() : el.close()),
			"show-popover": el => popoverOpen(el) || el.showPopover(),
			"hide-popover": el => popoverOpen(el) && el.hidePopover(),
			"toggle-popover": el => el.togglePopover()
		};

		document.addEventListener("click", e => {
			const button = e.target.closest?.("button[commandfor][command]");
			const target = button && document.getElementById(button.getAttribute("commandfor"));
			const command = commands[button?.getAttribute("command")];
			if (target && command) command(target);
		});
	}

	//  =================================================================
	//  Start
	//  =================================================================

	/** Sets up the tab lists and collapsible content in an element (the whole page by default). */
	const init = (root = document) => {
		root.querySelectorAll('[role="tablist"]').forEach(initTabs);
		root.querySelectorAll(toggleSelector).forEach(sync);
	};

	window.Sassy = { init };

	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", () => init());
	} else {
		init();
	}
})();
