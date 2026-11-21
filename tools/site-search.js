/*
 * The samples site's search box: an ARIA combobox over search.json, which tools/site.mjs build writes.
 * Finds sections by title and placeholders by name: a placeholder a demo uses goes to that demo, and any
 * other goes to its docs page, in a new tab. Ctrl K, ⌘K on a Mac, or / focuses the box.
 * Not part of Sassy - tools/site.mjs copies it into the site.
 */
(() => {
	"use strict";

	const input = document.getElementById("site-search-input");
	const list = document.getElementById("site-search-results");
	if (!input || !list) return;

	const mac = /Mac|iPhone|iPad/.test(navigator.platform);
	const key = input.parentElement.querySelector(".site-search-key");
	if (key) key.textContent = mac ? "⌘ K" : "Ctrl K";

	const max = 10;
	let index = null;
	let results = [];
	let active = -1;

	const load = () => (index ??= fetch("search.json").then(r => r.json()).catch(() => ({ sections: [], docs: [] })));

	/** How well text matches the query: 0 for no match, higher for a closer one. */
	const score = (text, q) => {
		const t = text.toLowerCase();
		if (t === q) return 4;
		if (t.startsWith(q)) return 3;
		if (t.includes(` ${q}`) || t.includes(`-${q}`)) return 2;
		return t.includes(q) ? 1 : 0;
	};

	const search = (data, raw) => {
		const q = raw.trim().toLowerCase().replace(/^%/, "");
		if (!q) return [];
		// a step typed in full finds its family: rounded-3 is bf-rounded-…, as tools/site.mjs lists it
		const name = (q.startsWith("bf-") ? q : `bf-${q}`).replace(/-n?\d+(?:pc|vh|vw)?$/, "-…");
		const found = [];

		for (const s of data.sections) {
			const n = score(s.title, q);
			if (n) found.push({ rank: 20 + n, label: s.title, note: `${s.layer} demo`, url: s.url });
		}
		for (const d of data.docs) {
			const n = score(d.title, q);
			if (n) found.push({ rank: 20 + n, label: d.title, note: "Docs", url: `${data.docsUrl}/${d.doc}`, newTab: true });
		}
		// a placeholder typed in full comes first, then titles, then placeholders starting with or containing the query
		// then placeholders that set a matching CSS property, such as radius for border-radius: those that set fewest first
		const word = q.replace(/\s+/g, "-");
		for (const d of data.docs) {
			d.names.forEach((n, i) => {
				const props = d.props[i] ? d.props[i].split(" ") : [];
				const prop = props.find(p => p === word) ?? props.find(p => p.includes(word));
				const rank = n === name ? 30 : n.startsWith(name) ? 12 : n.includes(q) ? 11 : prop ? (prop === word ? 6 : 5) : 0;
				if (!rank) return;
				const demo = data.sections.find(s => s.names.includes(n));
				const where = demo ? `${demo.title} - ${demo.layer} demo` : `${d.title} docs`;
				found.push({
					rank, size: props.length, label: `%${n}`, code: true,
					note: rank < 10 ? `${prop} - ${where}` : where,
					url: demo ? demo.url : `${data.docsUrl}/${d.doc}`, newTab: !demo
				});
			});
		}
		// shorter names before their longer variants
		return found.sort((a, b) => b.rank - a.rank || (a.size ?? 0) - (b.size ?? 0) || a.label.length - b.label.length || a.label.localeCompare(b.label)).slice(0, max);
	};

	const setActive = i => {
		active = i;
		[...list.children].forEach((li, n) => li.setAttribute("aria-selected", String(n === i)));
		const li = list.children[i];
		if (li) {
			input.setAttribute("aria-activedescendant", li.id);
			li.scrollIntoView({ block: "nearest" });
		} else {
			input.removeAttribute("aria-activedescendant");
		}
	};

	const close = () => {
		list.hidden = true;
		input.setAttribute("aria-expanded", "false");
		setActive(-1);
	};

	const render = () => {
		list.replaceChildren(...results.map((r, i) => {
			const li = document.createElement("li");
			li.id = `site-search-result-${i}`;
			li.setAttribute("role", "option");
			li.setAttribute("aria-selected", "false");
			const label = document.createElement(r.code ? "code" : "span");
			label.className = "site-search-label";
			label.textContent = r.label;
			const note = document.createElement("span");
			note.className = "site-search-note";
			note.textContent = r.newTab ? `${r.note} (opens in a new tab)` : r.note;
			li.append(label, note);
			return li;
		}));
		if (!results.length && input.value.trim()) {
			const li = document.createElement("li");
			li.className = "site-search-empty";
			li.textContent = "No results";
			list.append(li);
		}
		const open = input.value.trim() !== "";
		list.hidden = !open;
		input.setAttribute("aria-expanded", String(open));
		setActive(results.length ? 0 : -1);
	};

	const go = r => {
		if (!r) return;
		if (r.newTab) {
			window.open(r.url, "_blank", "noopener");
		} else {
			close();
			input.blur();
			location.href = r.url;
		}
	};

	input.addEventListener("focus", load);
	input.addEventListener("input", async () => {
		const value = input.value;
		const data = await load();
		if (value !== input.value) return; // typed again while loading
		results = search(data, value);
		render();
	});

	input.addEventListener("keydown", e => {
		if (e.key === "ArrowDown" || e.key === "ArrowUp") {
			if (!results.length) return;
			e.preventDefault();
			const step = e.key === "ArrowDown" ? 1 : -1;
			setActive((active + step + results.length) % results.length);
		} else if (e.key === "Enter") {
			e.preventDefault();
			go(results[active]);
		} else if (e.key === "Escape") {
			if (list.hidden) input.blur();
			else {
				e.preventDefault();
				input.value = "";
				results = [];
				close();
			}
		}
	});

	// mousedown rather than click, so the box keeps focus and the list stays until a result is chosen
	list.addEventListener("mousedown", e => {
		const li = e.target.closest("[role=option]");
		if (!li) return;
		e.preventDefault();
		go(results[[...list.children].indexOf(li)]);
	});

	input.addEventListener("blur", () => setTimeout(() => {
		if (document.activeElement !== input) close();
	}));

	document.addEventListener("keydown", e => {
		const typing = e.target.closest?.("input, textarea, select, [contenteditable]");
		if ((e.key === "k" && (mac ? e.metaKey : e.ctrlKey) && !e.altKey && !e.shiftKey) || (e.key === "/" && !typing)) {
			e.preventDefault();
			input.focus();
			input.select();
		}
	});
})();
