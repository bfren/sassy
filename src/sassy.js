/*!
 * Sassy v0.5.0 - behaviour for components that CSS cannot provide on its own
 * https://github.com/bfren/sassy - MIT licence
 *
 * - Tabs: switches panels, with arrow keys, Home and End (the WAI-ARIA tabs pattern).
 * - Toolbars: one stop in the tab order, with arrow keys, Home and End between the controls in it
 *   (the WAI-ARIA toolbar pattern).
 * - Tooltips: shows popover tooltips on hover and focus, and positions them in browsers
 *   without CSS anchor positioning.
 * - Dropdowns and popovers: keeps a popovertarget button's aria-expanded in step with its menu or popover,
 *   positions it in browsers without CSS anchor positioning, and gives role="menu" its arrow keys, Home, End
 *   and Tab. Choosing a menu item closes the menu; a popover (role="dialog") stays open.
 * - Collapsible content: a button with aria-expanded and aria-controls shows and hides what it controls,
 *   for navs that collapse on small screens.
 * - Scrollspy: in a nav or list of #links where one has aria-current="location", moves aria-current="location"
 *   to the link of the section in view as the page scrolls.
 * - Carousels: plays a carousel whose slides element has aria-live="off", every --sassy-carousel-interval
 *   seconds, with a pause button (aria-pressed and aria-controls), waiting on hover and focus.
 * - Commands: a fallback for command / commandfor buttons in browsers without them.
 * - Closing dialogs: a fallback for closedby="any", so a click on a modal dialog's backdrop closes it, and following
 *   a link in a modal dialog to a section of the page outside it closes it.
 * - Dismissing: a button with commandfor and command="--dismiss" hides the element it names, such as an alert.
 *
 * Everything is found by ARIA role and standard attributes, never by class name, so it works
 * whatever selectors you extend Sassy's placeholders onto. Load it once, with defer:
 *     <script src="sassy.js" defer></script>
 * Content added later is handled too, except new tab lists, toolbars, collapsed content, playing carousels and scrollspy navs: call Sassy.init(element) for those.
 */
(() => {
	"use strict";

	//  =================================================================
	//  Arrow keys, shared by tabs and toolbars
	//  =================================================================

	/** The item a key moves to from the current one, or null if the key does not move. */
	const itemForKey = (items, current, key, vertical) => {
		const i = items.indexOf(current);
		const step = { [vertical ? "ArrowDown" : "ArrowRight"]: 1, [vertical ? "ArrowUp" : "ArrowLeft"]: -1 }[key];
		if (i < 0) return null;
		if (step) return items[(i + step + items.length) % items.length];
		if (key === "Home") return items[0];
		if (key === "End") return items[items.length - 1];
		return null;
	};

	/** Whether an element is laid out top to bottom, from its aria-orientation. */
	const isVertical = el => el.getAttribute("aria-orientation") === "vertical";

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
	const tabForKey = (list, current, key) => itemForKey(tabsOf(list).filter(enabled), current, key, isVertical(list));

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
	//  Toolbars
	//  =================================================================

	/** The controls in a toolbar that can take focus (not those of a toolbar nested in it). */
	const toolbarItems = bar =>
		[...bar.querySelectorAll("button, a[href], input, select, textarea, [tabindex]")]
			.filter(el => el.closest('[role="toolbar"]') === bar && !el.disabled);

	/** Makes one control the toolbar's stop in the tab order. */
	const rove = (bar, current) => toolbarItems(bar).forEach(el => (el.tabIndex = el === current ? 0 : -1));

	/** Sets up a toolbar: its first control is in the tab order, the rest are reached with the arrow keys. */
	const initToolbar = bar => {
		const items = toolbarItems(bar);
		if (items.length > 0) rove(bar, items[0]);
	};

	/** The toolbar and control an event happened on, if any. */
	const toolbarEvent = e => {
		const bar = e.target.closest?.('[role="toolbar"]');
		return bar && toolbarItems(bar).includes(e.target) ? { bar, item: e.target } : null;
	};

	// Tab comes back to the control last used, however it was reached
	document.addEventListener("focusin", e => {
		const hit = toolbarEvent(e);
		if (hit) rove(hit.bar, hit.item);
	});

	document.addEventListener("keydown", e => {
		// in a text field or list the arrow keys move the caret or the choice instead
		if (e.target.matches?.("input, select, textarea")) return;
		const hit = toolbarEvent(e);
		const next = hit && itemForKey(toolbarItems(hit.bar), hit.item, e.key, isVertical(hit.bar));
		if (next) {
			e.preventDefault();
			rove(hit.bar, next);
			next.focus();
		}
	});

	//  =================================================================
	//  Positioning, shared by everything that opens beside its trigger
	//  =================================================================

	const anchorPositioning = window.CSS?.supports?.("anchor-name: --sassy") ?? false;
	const anchored = new WeakMap(); // element -> the trigger currently holding its anchor name
	let anchorCount = 0;

	/** Anchors an element to its trigger with CSS anchor positioning; its CSS says where it goes. */
	const anchor = (trigger, el) => {
		el.dataset.sassyAnchor ??= `--sassy-anchor-${++anchorCount}`;
		const name = el.dataset.sassyAnchor;
		anchored.get(el)?.style.removeProperty("anchor-name");
		trigger.style.setProperty("anchor-name", name);
		el.style.setProperty("position-anchor", name);
		anchored.set(el, trigger);
	};

	/**
	 * Places an element beside its trigger without anchor positioning, on a side named as in CSS: above and
	 * centred by default (tooltips), below and lined up with the trigger's start or end (dropdowns), or on any
	 * side (popovers). It moves to the other side if there is no room, and is kept on screen.
	 */
	const place = (trigger, el, { side = "block-start", align = "centre" } = {}) => {
		el.style.margin = ""; // place() sets it to 0 below, which would hide the CSS offset next time
		const offset = parseFloat(getComputedStyle(el).marginTop) || 0;
		const t = trigger.getBoundingClientRect();
		const r = el.getBoundingClientRect();
		const rtl = getComputedStyle(trigger).direction === "rtl";
		const clamp = (v, size, room) => Math.min(Math.max(v, offset), room - size - offset);
		// before (above or left of) the trigger or after it, on one axis
		const beside = (from, to, size, room, before) => {
			const b = from - size - offset;
			const a = to + offset;
			return before ? (b >= 0 ? b : a) : a + size <= room || b < 0 ? a : b;
		};
		let top, left;
		if (side.startsWith("block")) {
			const start = rtl ? t.right - r.width : t.left;
			const end = rtl ? t.left : t.right - r.width;
			const x = { centre: t.left + (t.width - r.width) / 2, start, end }[align];
			top = beside(t.top, t.bottom, r.height, innerHeight, side === "block-start");
			left = clamp(x, r.width, innerWidth);
		} else {
			top = clamp(t.top + (t.height - r.height) / 2, r.height, innerHeight);
			left = beside(t.left, t.right, r.width, innerWidth, (side === "inline-start") !== rtl);
		}
		Object.assign(el.style, { margin: "0", top: `${top}px`, left: `${left}px` });
	};

	const isOpen = el => el.matches(":popover-open");

	/** Opens a popover beside its trigger: anchored by CSS where browsers support it, placed by script elsewhere. */
	const openBeside = (trigger, el) => {
		if (anchorPositioning) anchor(trigger, el);
		if (!isOpen(el)) el.showPopover();
		if (!anchorPositioning) place(trigger, el); // after opening, as a closed popover has no size
	};

	//  =================================================================
	//  Tooltips
	//  =================================================================

	const hideDelay = 100; // ms - time to move the pointer from the trigger onto the tooltip
	const timers = new WeakMap();

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

	const show = (trigger, tooltip) => {
		clearTimeout(timers.get(tooltip));
		openBeside(trigger, tooltip);
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
	//  Dropdowns and popovers: opened by a popovertarget button
	//  =================================================================

	// The browser opens and closes them, on Escape and a click outside too, and returns focus to the button.
	// This keeps the button's aria-expanded in step, places the menu, and gives role="menu" its keys.

	const invokers = new WeakMap(); // popover -> the button that last opened it

	/** The button that opens a popover, if one does: the one last used, or the first that names it. */
	const invokerOf = el =>
		invokers.get(el) ??
		[...document.querySelectorAll('[popovertarget]:not([popovertargetaction="hide"])')].find(b => b.getAttribute("popovertarget") === el.id);

	/** The items of a menu that can be chosen. */
	const menuItems = menu => [...menu.querySelectorAll('[role="menuitem"]')].filter(enabled);

	document.addEventListener(
		"click",
		e => {
			// not a close button inside the popover, which also names it
			const button = e.target.closest?.('[popovertarget]:not([popovertargetaction="hide"])');
			const el = button && document.getElementById(button.getAttribute("popovertarget"));
			if (el) invokers.set(el, button);
		},
		true // before the browser opens the popover
	);

	// toggle events don't bubble, so these listen as they pass down to the popover
	document.addEventListener(
		"beforetoggle",
		e => {
			const button = e.newState === "open" && invokerOf(e.target);
			if (button && anchorPositioning) anchor(button, e.target);
		},
		true
	);

	document.addEventListener(
		"toggle",
		e => {
			const menu = e.target;
			const button = invokerOf(menu);
			if (!button) return;
			const open = e.newState === "open";
			button.setAttribute("aria-expanded", String(open));
			if (!open) return;
			if (!anchorPositioning) {
				// shortcut: placed once the menu is shown, so it can be measured - it may appear in the
				// wrong place for a frame first; hide it in beforetoggle if that ever shows
				const style = getComputedStyle(menu);
				const prop = name => style.getPropertyValue(name).trim();
				place(
					button,
					menu,
					menu.matches('[role="dialog"]')
						? { side: prop("--sassy-popover-side") || "block-start" }
						: {
								side: prop("--sassy-dropdown-side") || "block-end",
								align: prop("--sassy-dropdown-align") === "span-inline-start" ? "end" : "start"
							}
				);
			}
			if (menu.matches('[role="menu"]')) menuItems(menu)[0]?.focus();
		},
		true
	);

	document.addEventListener("keydown", e => {
		const menu = e.target.closest?.('[role="menu"][popover]');
		if (!menu) return;
		// Tab leaves the menu: hiding it returns focus to the button, and Tab then moves on from there
		if (e.key === "Tab") return menu.hidePopover();
		const next = itemForKey(menuItems(menu), e.target, e.key, true);
		if (next) {
			e.preventDefault();
			next.focus();
		}
	});

	// choosing an item closes the menu - but not a popover (role="dialog"), whose buttons and links are content
	document.addEventListener("click", e => {
		const item = e.target.closest?.('a, button, [role="menuitem"]');
		const menu = item?.closest("[popover]");
		if (menu?.matches('[role="dialog"]')) return;
		if (menu && !item.hasAttribute("popovertarget") && isOpen(menu) && invokerOf(menu)) menu.hidePopover();
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
	//  Scrollspy: marks the link to the section in view
	//  =================================================================

	// A nav or list of #links, one of them with aria-current="location", follows the page: the link to the last
	// section whose top has scrolled past a line near the top (--sassy-scrollspy-offset, 25% by default) gets
	// aria-current="location", and the others lose it. At the very bottom, the last section is current.

	const spied = new WeakSet();

	/** The nearest ancestor that scrolls, or null for the page. */
	const scroller = el => {
		for (let p = el.parentElement; p && p !== document.body && p !== document.documentElement; p = p.parentElement) {
			if (/auto|scroll/.test(getComputedStyle(p).overflowY) && p.scrollHeight > p.clientHeight) return p;
		}
		return null;
	};

	const initScrollspy = nav => {
		if (spied.has(nav)) return;
		spied.add(nav);
		const links = [...nav.querySelectorAll('a[href^="#"]')]
			.map(link => ({ link, target: document.getElementById(decodeURIComponent(link.hash.slice(1))) }))
			.filter(x => x.target);
		if (!links.length) return;
		const area = scroller(links[0].target);
		const offset = getComputedStyle(nav).getPropertyValue("--sassy-scrollspy-offset").trim() || "25%";

		const update = () => {
			const top = area ? area.getBoundingClientRect().top : 0;
			const height = area ? area.clientHeight : innerHeight;
			const rem = parseFloat(getComputedStyle(document.documentElement).fontSize);
			const n = parseFloat(offset) || 0;
			const line = top + (offset.endsWith("%") ? (height * n) / 100 : offset.endsWith("rem") ? n * rem : n);
			const el = area ?? document.documentElement;
			const atBottom = el.scrollTop > 0 && Math.ceil(el.scrollTop + el.clientHeight) >= el.scrollHeight;
			const passed = links.filter(x => x.target.getBoundingClientRect().top <= line);
			const current = atBottom ? links[links.length - 1] : (passed[passed.length - 1] ?? links[0]);
			for (const x of links) {
				if (x === current) x.link.setAttribute("aria-current", "location");
				else x.link.removeAttribute("aria-current");
			}
		};

		(area ?? window).addEventListener("scroll", update, { passive: true });
		window.addEventListener("resize", update, { passive: true });
		update();

		// In a box that scrolls, following a link would scroll the page too, to bring the section to the top
		// of the window: scroll only the box instead.
		if (area) {
			nav.addEventListener("click", e => {
				const hit = links.find(x => x.link === e.target.closest?.("a"));
				if (!hit || e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
				e.preventDefault();
				const smooth = !window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
				area.scrollBy({
					top: hit.target.getBoundingClientRect().top - area.getBoundingClientRect().top,
					behavior: smooth ? "smooth" : "auto"
				});
				history.pushState(null, "", hit.link.hash);
			});
		}
	};

	//  =================================================================
	//  Carousels that play by themselves
	//  =================================================================

	// The slides element of a carousel with aria-live="off" rotates (the WAI-ARIA carousel pattern). A button with
	// aria-pressed and aria-controls naming it pauses and restarts it, and aria-live is "polite" while it is paused,
	// so screen readers read the slide people move to. It waits while the pointer is over the carousel, focus is in it,
	// or the page is hidden, and it starts paused for reduced motion.

	const playing = new WeakSet(); // slides elements set up to rotate

	/** The pause buttons of a carousel's slides element. */
	const pauseButtons = slides =>
		[...document.querySelectorAll("button[aria-pressed][aria-controls]")].filter(b => b.getAttribute("aria-controls") === slides.id);

	const setPaused = (slides, paused) => {
		slides.setAttribute("aria-live", paused ? "polite" : "off");
		pauseButtons(slides).forEach(b => b.setAttribute("aria-pressed", String(paused)));
	};

	/** Scrolls to the next slide, or back to the first from the end. */
	const advance = slides => {
		const rtl = getComputedStyle(slides).direction === "rtl";
		const box = slides.getBoundingClientRect();
		// how far a slide's start is past the start of the slides element
		const start = el => {
			const r = el.getBoundingClientRect();
			return rtl ? box.right - r.right : r.left - box.left;
		};
		const items = [...slides.children];
		const atEnd = Math.abs(slides.scrollLeft) + slides.clientWidth >= slides.scrollWidth - 1;
		const next = atEnd ? items[0] : items.find(el => start(el) > 1);
		if (next) slides.scrollBy({ left: rtl ? -start(next) : start(next), behavior: "smooth" });
	};

	const initCarousel = slides => {
		if (playing.has(slides)) return;
		playing.add(slides);
		if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) setPaused(slides, true);
		const region = slides.closest('[aria-roledescription="carousel"]') ?? slides;
		const interval = getComputedStyle(slides).getPropertyValue("--sassy-carousel-interval").trim();
		const ms = (parseFloat(interval) || 5) * (interval.endsWith("ms") ? 1 : 1000);
		setInterval(() => {
			const waiting = slides.getAttribute("aria-live") !== "off" || region.matches(":hover, :focus-within") || document.hidden;
			if (!waiting) advance(slides);
		}, ms);
	};

	document.addEventListener("click", e => {
		const button = e.target.closest?.("button[aria-pressed][aria-controls]");
		const slides = button && document.getElementById(button.getAttribute("aria-controls"));
		if (slides && playing.has(slides)) setPaused(slides, button.getAttribute("aria-pressed") !== "true");
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
	//  Closing dialogs from the backdrop: fallback for closedby="any"
	//  =================================================================

	if (!("closedBy" in HTMLDialogElement.prototype)) {
		// a click on the backdrop is a click on the dialog itself, outside its box
		document.addEventListener("click", e => {
			const dialog = e.target;
			if (!dialog.matches?.('dialog[closedby="any"]:modal')) return;
			const r = dialog.getBoundingClientRect();
			const inside = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
			if (!inside) dialog.close();
		});
	}

	//  =================================================================
	//  Closing dialogs when an in-page link in them is followed
	//  =================================================================

	// so the section the link goes to, under the modal, can be seen - such as from a nav in an offcanvas
	document.addEventListener("click", e => {
		const link = e.target.closest?.('a[href^="#"]');
		const dialog = link?.closest("dialog");
		const target = dialog?.matches(":modal") && document.getElementById(decodeURIComponent(link.hash.slice(1)));
		if (target && !dialog.contains(target)) dialog.close();
	});

	//  =================================================================
	//  Dismissing: command="--dismiss" hides the element named by commandfor
	//  =================================================================

	// A custom command does nothing by itself, so this runs in every browser, with or without command support.
	document.addEventListener("click", e => {
		const button = e.target.closest?.('button[commandfor][command="--dismiss"]');
		const target = button && document.getElementById(button.getAttribute("commandfor"));
		if (target) target.hidden = true;
	});

	//  =================================================================
	//  Start
	//  =================================================================

	/** Sets up the tab lists, toolbars, collapsible content, carousels and scrollspy navs in an element (the whole page by default). */
	const init = (root = document) => {
		root.querySelectorAll('[role="tablist"]').forEach(initTabs);
		root.querySelectorAll('[role="toolbar"]').forEach(initToolbar);
		root.querySelectorAll(toggleSelector).forEach(sync);
		root.querySelectorAll('[aria-roledescription="carousel"] [aria-live="off"]').forEach(initCarousel);
		root.querySelectorAll('a[href^="#"][aria-current="location"]').forEach(link => initScrollspy(link.closest("nav, ul, ol") ?? link.parentElement));
	};

	window.Sassy = { init };

	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", () => init());
	} else {
		init();
	}
})();
