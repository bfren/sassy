#!/usr/bin/env node
/*
 * Builds the samples site, and checks that the CSS shown in examples is what Sassy outputs.
 *
 *     node tools/site.mjs build    compiles the samples into _site, adding each example's CSS output
 *     node tools/site.mjs check    checks the CSS shown in README.md and the docs folders, that every
 *                                  custom property Sassy reads has a value or a fallback, and that each
 *                                  samples section names its docs pages
 *
 * Both fail if an example does not compile, or shows CSS that Sassy does not output.
 * Needs Node 20 or later and Dart Sass on the path as `sass` - or set SASS to run it from elsewhere.
 */

import { spawn } from "node:child_process";
import { cpSync, existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { availableParallelism, tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const srcPath = join(root, "src").replaceAll("\\", "/");
const samples = join(root, "samples");
const out = join(root, "_site");

//  =================================================================
//  Sass
//  =================================================================

/** Runs Dart Sass, resolving with its output, or rejecting with its error. */
const sass = args => new Promise((resolve, reject) => {
	const command = process.env.SASS ?? "sass";
	// on Windows Sass is a .bat file, which only runs through the shell
	const child = process.platform === "win32"
		? spawn([command, ...args].map(a => `"${a}"`).join(" "), { shell: true })
		: spawn(command, args);
	let stdout = "", stderr = "";
	child.stdout.on("data", d => (stdout += d));
	child.stderr.on("data", d => (stderr += d));
	child.on("error", e => reject(new Error(`could not run Sass: ${e.message}`)));
	child.on("close", code => (code === 0 ? resolve(stdout) : reject(new Error(stderr || stdout))));
});

/** Runs async tasks in order, as many at a time as there are processors, returning their results in order. */
const inParallel = async tasks => {
	const results = new Array(tasks.length);
	let next = 0;
	const worker = async () => {
		while (next < tasks.length) {
			const i = next++;
			results[i] = await tasks[i]();
		}
	};
	await Promise.all(Array.from({ length: Math.min(availableParallelism(), tasks.length) }, worker));
	return results;
};

/** An example's Sass, made to compile on its own: loading Sassy from this repository. */
const standalone = snippet =>
	/@use\s+"sassy\/src"/.test(snippet)
		? snippet.replaceAll('"sassy/src"', `"${srcPath}"`)
		: `@use "${srcPath}" as sassy\n\n${snippet}`;

/**
 * Compiles Sass examples, each on its own and several at once, returning each one's CSS or its error.
 * Every compile evaluates all of Sassy, which takes a second or two, so running them side by side
 * is what keeps the build quick.
 * @param {{ sass: string, label: string }[]} examples
 */
const compile = async examples => {
	const dir = mkdtempSync(join(tmpdir(), "sassy-"));
	try {
		return await inParallel(examples.map((ex, i) => async () => {
			const file = join(dir, `example-${i}.sass`);
			writeFileSync(file, standalone(ex.sass));
			try {
				return { css: await sass(["--no-source-map", "--quiet", file]) };
			} catch (e) {
				return { error: `${ex.label}: ${e.message.replaceAll(file, ex.label).trim()}` };
			}
		}));
	} finally {
		rmSync(dir, { recursive: true, force: true });
	}
};

//  =================================================================
//  CSS
//  =================================================================

const stripComments = css => css.replace(/\/\*[\s\S]*?\*\//g, "");

/** Splits CSS at a separator that is not inside quotes, brackets or parentheses. */
const splitTop = (text, separator) => {
	const parts = [];
	let depth = 0, quote = null, start = 0;
	for (let i = 0; i < text.length; i++) {
		const c = text[i];
		if (quote) {
			if (c === "\\") i++;
			else if (c === quote) quote = null;
		} else if (c === '"' || c === "'") quote = c;
		else if ("([".includes(c)) depth++;
		else if (")]".includes(c)) depth--;
		else if (c === separator && depth === 0) {
			parts.push(text.slice(start, i));
			start = i + 1;
		}
	}
	return [...parts, text.slice(start)].map(p => p.trim()).filter(Boolean);
};

/** Splits CSS into its top-level blocks: { head, body, text }; body is null for a statement such as @charset. */
const blocks = css => {
	const found = [];
	let depth = 0, quote = null, start = 0, open = -1;
	for (let i = 0; i < css.length; i++) {
		const c = css[i];
		if (quote) {
			if (c === "\\") i++;
			else if (c === quote) quote = null;
		} else if (c === '"' || c === "'") quote = c;
		else if (c === "{") {
			if (depth++ === 0) open = i;
		} else if (c === "}") {
			if (--depth === 0) {
				found.push({ head: css.slice(start, open).trim(), body: css.slice(open + 1, i), text: css.slice(start, i + 1).trim() });
				start = i + 1;
			}
		} else if (c === ";" && depth === 0) {
			found.push({ head: css.slice(start, i).trim(), body: null, text: css.slice(start, i + 1).trim() });
			start = i + 1;
		}
	}
	return found.filter(b => b.text);
};

const squash = text => text.replace(/\s+/g, " ").trim();

/** A selector written the way Sass writes it: single spaces, and [attr=value] without quotes. */
const normaliseSelector = selector =>
	squash(selector).replace(/\[([\w-]+)=(["'])([\w-]+)\2\]/g, "[$1=$3]").replace(/\s*([>+~])\s*/g, " $1 ");

const declarationsIn = body => splitTop(body, ";").map(d => {
	const colon = d.indexOf(":");
	return `${d.slice(0, colon).trim().toLowerCase()}: ${squash(d.slice(colon + 1))}`;
});

/** Every declaration in some CSS, as [at-rules and selector, declarations] pairs. */
const declarations = (css, context = "") =>
	blocks(stripComments(css)).flatMap(b => {
		if (b.body === null) return [];
		if (b.head.startsWith("@")) {
			// a layer nested in a layer is the same as its dotted name, which the docs show: @layer sassy.base.utilities
			const at = `${context}${squash(b.head)} > `.replace(/(@layer [^>]+?) > @layer /, "$1.");
			return b.body.includes("{") ? declarations(b.body, at) : [[at, declarationsIn(b.body)]];
		}
		return splitTop(b.head, ",").map(s => [context + normaliseSelector(s), declarationsIn(b.body)]);
	});

/**
 * A selector, plus a copy for each selector in a :has(), :is() or :where() list, since @extend merges
 * every selector that extends a placeholder into that list: .a:has(> .b, > .c) also gives .a:has( > .b) and .a:has( > .c).
 */
const expandLists = (selector, from = 0) => {
	const pseudo = /:(?:has|is|where)\(/g;
	pseudo.lastIndex = from;
	const match = pseudo.exec(selector);
	if (!match) return [selector];
	const open = match.index + match[0].length;
	let close = open;
	// stops at the end too, so a "(" inside a quoted attribute value cannot keep it looking for ")" forever
	for (let depth = 1; depth > 0 && close < selector.length; close++) {
		if (selector[close] === "(") depth++;
		else if (selector[close] === ")") depth--;
	}
	close--;
	const items = splitTop(selector.slice(open, close), ",");
	const copies = items.length > 1 ? items.map(item => selector.slice(0, open) + normaliseSelector(item) + selector.slice(close)) : [];
	return [selector, ...copies].flatMap(s => expandLists(s, open));
};

/** The declarations shown that are not in the compiled CSS, as readable strings. */
const missing = (shown, compiled) => {
	const index = new Map();
	for (const [selector, decls] of declarations(compiled)) {
		for (const key of expandLists(selector)) {
			const set = index.get(key) ?? new Set();
			decls.forEach(d => set.add(d));
			index.set(key, set);
		}
	}
	return declarations(shown).flatMap(([key, decls]) =>
		decls.filter(d => !index.get(key)?.has(d)).map(d => `${key} { ${d} }`)
	);
};

/** CSS indented two spaces per level of nesting, as Sass writes it, after ownCss has unwrapped and rewrapped blocks. */
const reindent = css => {
	let depth = 0;
	return css.split("\n").map(line => {
		const text = line.trim();
		if (text.startsWith("}")) depth--;
		const out = text && "  ".repeat(Math.max(depth, 0)) + text;
		if (text.endsWith("{")) depth++;
		return out;
	}).join("\n");
};

/** An example's own CSS: everything it outputs that loading Sassy on its own does not. */
const ownCss = (css, baseline) => {
	const baseBlocks = blocks(stripComments(baseline));
	const base = new Set(baseBlocks.map(b => squash(b.text)));
	return blocks(stripComments(css))
		.filter(b => !b.head.startsWith("@charset") && !base.has(squash(b.text)))
		.map(b => {
			// Sassy's output is a few large @layer blocks, so compare inside them, keeping the layer around what is left
			const layer = b.head.startsWith("@layer") && b.body !== null && baseBlocks.find(o => o.head === b.head);
			if (!layer) return b.text;
			const inner = ownCss(b.body, layer.body);
			return inner && `${b.head} {\n${inner}\n}`;
		})
		.filter(Boolean)
		.join("\n");
};

//  =================================================================
//  Highlighting
//  =================================================================

const escapeHtml = text => text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const unescapeHtml = text =>
	text.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, "&");

/** Token patterns for Sass and CSS, tried in order at each position. */
const styleTokens = [
	["comment", /\/\*[\s\S]*?\*\/|\/\/[^\n]*/y],
	["string", /"(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*'/y],
	["at", /@[\w-]+/y],
	["placeholder", /%(?:[\w-]|#\{[^}\n]*\})+/y],
	["variable", /\$[\w-]+/y],
	["property", /(?<=^[ \t]*)-{0,2}[a-zA-Z][\w-]*(?=:\s)/my],
	["function", /[a-zA-Z][\w-]*(?:\.[\w-]+)?(?=\()/y],
	["selector", /(?<![\w-])\.[a-zA-Z_][\w-]*/y]
];

/** Highlights code by wrapping each token in <span class="t-...">. */
const tokenise = (code, patterns) => {
	let html = "", plain = "";
	for (let i = 0; i < code.length;) {
		const hit = patterns.map(([type, re]) => {
			re.lastIndex = i;
			const m = re.exec(code);
			return m && m[0] ? { type, text: m[0] } : null;
		}).find(Boolean);
		if (hit) {
			html += escapeHtml(plain) + `<span class="t-${hit.type}">${escapeHtml(hit.text)}</span>`;
			plain = "";
			i += hit.text.length;
		} else {
			plain += code[i++];
		}
	}
	return html + escapeHtml(plain);
};

/** Highlights HTML: comments, then each tag's name, attributes and values. */
const highlightHtml = code =>
	code.split(/(<!--[\s\S]*?-->|<\/?[a-zA-Z][^>]*>)/).map(part => {
		if (part.startsWith("<!--")) return `<span class="t-comment">${escapeHtml(part)}</span>`;
		if (!/^<\/?[a-zA-Z]/.test(part)) return escapeHtml(part);
		return part.replace(/^(<\/?)([\w-]+)([\s\S]*?)(\/?>)$/, (_, open, name, attrs, close) =>
			`<span class="t-tag">${escapeHtml(open + name)}</span>` +
			attrs.replace(/([^\s=]+)(?:(=)("[^"]*"|'[^']*'|[^\s"'>]+))?|(\s+)/g, (m, attr, eq, value, space) =>
				space ? space : `<span class="t-attribute">${escapeHtml(attr)}</span>` + (eq ? `=<span class="t-string">${escapeHtml(value)}</span>` : "")
			) +
			`<span class="t-tag">${escapeHtml(close)}</span>`
		);
	}).join("");

const highlight = (code, lang) => (lang === "html" ? highlightHtml(code) : tokenise(code, styleTokens));

//  =================================================================
//  Site
//  =================================================================

const labels = { sass: "Sass", html: "HTML", css: "CSS" };
const codePattern = /<div class="(code(?: [^"]*)?)"[^>]*>([\s\S]*?)<\/div>/g;
const prePattern = /<pre data-lang="(sass|html|css)"( data-shown-only)?>(?:<code>)?([\s\S]*?)(?:<\/code>)?<\/pre>/g;

/** The code blocks of a page, in order: [{ classes, split, panels: [{ lang, code, shownOnly }] }]. */
const codeBlocks = html =>
	[...html.matchAll(codePattern)].map(m => ({
		classes: m[1],
		split: m[1].split(" ").includes("code-split"),
		panels: [...m[2].matchAll(prePattern)].map(p => ({ lang: p[1], code: unescapeHtml(p[3]).replace(/^\n/, ""), shownOnly: Boolean(p[2]) }))
	}));

/** One code block as tabs (or side by side, for a split block), with the CSS output added after the Sass. */
const renderCode = (block, id) => {
	const panels = block.panels.map((p, i) => ({ ...p, id: `${id}-${p.lang}${i}` }));
	const pre = (p, attrs = "") => `<pre class="code-panel"${attrs}><code>${highlight(p.code, p.lang)}</code></pre>`;
	if (block.split) {
		return `<div class="${block.classes}">${panels.map(p => `<figure><figcaption class="code-label">${labels[p.lang]}</figcaption>${pre(p)}</figure>`).join("")}</div>`;
	}
	if (panels.length === 1) {
		return `<div class="${block.classes}"><div class="code-label">${labels[panels[0].lang]}</div>${pre(panels[0])}</div>`;
	}
	const tabs = panels.map((p, i) =>
		`<button type="button" role="tab" id="${p.id}-tab" aria-controls="${p.id}"${i === 0 ? ' aria-selected="true"' : ""}>${labels[p.lang]}</button>`
	).join("");
	const bodies = panels.map(p => pre(p, ` role="tabpanel" id="${p.id}" aria-labelledby="${p.id}-tab" tabindex="0"`)).join("");
	return `<div class="${block.classes}"><div class="code-tabs" role="tablist" aria-label="Code">${tabs}</div>${bodies}</div>`;
};

/** Adds a CSS panel after each Sass panel, with the CSS that Sass outputs for it. */
const withCss = (block, css) => ({
	...block,
	panels: block.panels.flatMap(p => (p.lang === "sass" && css.has(p) ? [p, { lang: "css", code: css.get(p) }] : [p]))
});

const pages = () => readdirSync(samples).filter(f => f.endsWith(".html"));

//  =================================================================
//  Links between the samples and the docs
//  =================================================================

const siteUrl = "https://bfren.github.io/sassy";
const docsUrl = "https://github.com/bfren/sassy/blob/main/docs";

/** A section of a samples page, with the docs pages it names in data-docs, such as data-docs="131-list-group 133-table". */
const sectionPattern = /<section class="example" id="([^"]+)"(?: data-docs="([^"]*)")?>\s*<h2>(.*?)<\/h2>/g;

/** A docs page's title, from its first line. */
const docTitle = file => readFileSync(join(root, "docs", file), "utf8").match(/^# (.+)/)?.[1] ?? file;

/**
 * Every section of the layer pages (1-components.html and so on, which have a docs folder of the same name), with the
 * docs pages it names - each a file in that folder, without .md - and a problem for each section that names none, or a page that isn't there.
 */
const sectionDocs = () => {
	const problems = [];
	const sections = pages().filter(page => existsSync(join(root, "docs", page.replace(/\.html$/, "")))).flatMap(page => {
		const folder = page.replace(/\.html$/, "");
		return [...readFileSync(join(samples, page), "utf8").matchAll(sectionPattern)].map(([, id, names, title]) => {
			const docs = (names ?? "").split(" ").filter(Boolean).map(name => `${folder}/${name}.md`);
			if (!docs.length) problems.push(`${page}#${id}: name its docs pages with data-docs`);
			docs.filter(d => !existsSync(join(root, "docs", d))).forEach(d => problems.push(`${page}#${id}: data-docs names docs/${d}, which isn't there`));
			return { page, id, title: title.replace(/<[^>]+>/g, ""), docs: docs.filter(d => existsSync(join(root, "docs", d))) };
		});
	});
	return { sections, problems };
};

/** Adds a link to each section's docs pages at the end of the section. */
const withDocsLinks = (html, page, sections) =>
	html.replace(/<section class="example" id="([^"]+)"[^>]*>[\s\S]*?(?=\s*<\/section>)/g, (section, id) => {
		const docs = sections.find(s => s.page === page && s.id === id)?.docs ?? [];
		if (!docs.length) return section;
		const links = docs.map(d => `<a href="${docsUrl}/${d}">${docTitle(d)}</a>`).join(", ");
		return `${section}\n            <div class="example-docs">Docs: ${links}</div>`;
	});


/** Wraps each demo and the code block after it in one element, which _site.sass makes a Sassy card. */
const withExampleCards = html => {
	let out = "";
	let from = 0;
	for (const start of [...html.matchAll(/<div class="demo[" ]/g)].map(m => m.index)) {
		if (start < from) continue;
		// the demo ends at the </div> that closes it, counting the divs inside
		let depth = 0;
		let end = start;
		for (const tag of html.slice(start).matchAll(/<div\b|<\/div>/g)) {
			depth += tag[0] === "<div" ? 1 : -1;
			if (depth === 0) {
				end = start + tag.index + tag[0].length;
				break;
			}
		}
		// the code block holds no divs, so it ends at the first </div>
		const code = html.slice(end).match(/^\s*<div class="code[^"]*"[^>]*>[\s\S]*?<\/div>/);
		if (!code) continue;
		const close = end + code[0].length;
		out += `${html.slice(from, start)}<div class="example-card">${html.slice(start, close)}</div>`;
		from = close;
	}
	return out + html.slice(from);
};

/**
 * The nav of a page's sections, from each <section class="example" id> and its <h2>, placed after the <h1>.
 * It is an offcanvas below lg, opened by the button, and a sticky sidebar from lg; sassy.js marks the
 * section in view (scrollspy), and closes the offcanvas when a link in it is followed. A page with no sections gets none.
 */
const withSectionNav = html => {
	const sections = [...html.matchAll(sectionPattern)].map(([, id, , title]) => ({
		id,
		title: title.replace(/<[^>]+>/g, "")
	}));
	if (!sections.length) return html;
	const links = sections
		.map((s, i) => `                <a href="#${s.id}"${i ? "" : ' aria-current="location"'}>${s.title}</a>`)
		.join("\n");
	const nav = `
        <button type="button" class="site-sections-open" commandfor="site-sections" command="show-modal">Sections</button>
        <dialog class="site-sections" id="site-sections" closedby="any" aria-labelledby="site-sections-title">
            <header>
                <h2 id="site-sections-title">On this page</h2>
                <button type="button" class="close" commandfor="site-sections" command="close" aria-label="Close"></button>
            </header>
            <nav class="site-sections-nav" aria-labelledby="site-sections-title">
${links}
            </nav>
        </dialog>`;
	return html.replace(/(<main class="site-main[^"]*">[\s\S]*?<\/h1>)/, `$1${nav}`);
};

const build = async () => {
	const problems = [];
	rmSync(out, { recursive: true, force: true });
	mkdirSync(join(out, "css"), { recursive: true });
	mkdirSync(join(out, "js"), { recursive: true });
	cpSync(join(root, "src", "sassy.js"), join(out, "js", "sassy.js"));
	mkdirSync(join(out, "images"), { recursive: true });
	cpSync(join(root, "logo", "logo-light.svg"), join(out, "images", "logo.svg"));
	if (existsSync(join(samples, ".nojekyll"))) cpSync(join(samples, ".nojekyll"), join(out, ".nojekyll"));

	const { sections, problems: sectionProblems } = sectionDocs();
	problems.push(...sectionProblems);

	const found = pages().map(page => {
		const html = readFileSync(join(samples, page), "utf8");
		const blocks = codeBlocks(html);
		const panels = blocks.flatMap(b => b.panels).filter(p => p.lang === "sass");
		return { page, html, blocks, panels };
	});
	const examples = found.flatMap(f => f.panels.map((p, i) => ({ panel: p, page: f.page, label: `${f.page}, Sass example ${i + 1}`, sass: p.code })));

	// every example, and Sassy on its own once, alongside each page's own stylesheet
	const [results] = await Promise.all([
		compile([...examples, { label: "Sassy on its own", sass: "" }]),
		sass(["--no-source-map", "--quiet", `${join(samples, "sass")}:${join(out, "css")}`])
	]);
	const baseline = results.at(-1).css ?? "";

	const css = new Map();
	examples.forEach((ex, i) => {
		const r = results[i];
		if (r.error) return problems.push(r.error);
		css.set(ex.panel, reindent(ownCss(r.css, baseline)));
	});

	for (const { page, html, blocks, panels } of found) {
		const stylesheet = html.match(/<link rel="stylesheet" href="(css\/[^"]+)"/)?.[1];
		const pageCss = stylesheet && existsSync(join(out, stylesheet)) ? readFileSync(join(out, stylesheet), "utf8") : "";

		// the page must actually use the Sass it shows, unless marked as shown only
		panels.forEach((p, i) => {
			if (css.has(p) && !p.shownOnly) {
				missing(css.get(p), pageCss).forEach(m => problems.push(`${page}, Sass example ${i + 1}: not in ${stylesheet}: ${m}`));
			}
		});

		let n = 0;
		const built = withSectionNav(withDocsLinks(withExampleCards(html), page, sections).replace(codePattern, () => renderCode(withCss(blocks[n++], css), `code-${n}`)));
		writeFileSync(join(out, page), built);
	}
	console.log(`built ${found.length} pages with ${examples.length} examples`);
	return problems;
};

//  =================================================================
//  Docs
//  =================================================================

/** Each ```css block in a Markdown file, with the ```sass block before it and its line number. */
const docExamples = (file, text) => {
	const fences = [...text.matchAll(/^```(\w+)\n([\s\S]*?)^```/gm)].map(m => ({
		lang: m[1], code: m[2], line: text.slice(0, m.index).split("\n").length
	}));
	return fences.flatMap((f, i) => {
		if (f.lang !== "css") return [];
		const sassBlock = fences.slice(0, i).reverse().find(x => x.lang === "sass");
		return sassBlock ? [{ label: `${file}:${sassBlock.line}`, sass: sassBlock.code, css: f.code, cssLine: f.line }] : [];
	});
};

/** Lists custom properties the full build reads with a bare var() but never defines - they have no value. */
const undefinedProperties = async () => {
	const css = await sass(["--no-source-map", join(root, "src", "full.sass")]);
	const defined = new Set([...css.matchAll(/(?:^|[{;\s])(--sassy-[a-z0-9-]+)\s*:/g)].map(m => m[1]));
	const bare = new Set([...css.matchAll(/var\((--sassy-[a-z0-9-]+)\)/g)].map(m => m[1]));
	return [...bare].filter(p => !defined.has(p))
		.map(p => `src: var(${p}) has no fallback and is never defined - read it through its $sassy- variable`);
};

/** The cascade layers the full build must declare, lowest first - keep in step with src/_render.sass. */
const layerStack = ["base", "sm", "md", "lg", "xl", "\\32 xl", "\\33 xl"]
	.flatMap(pass => ["core", "components", "forms", "grid", "utilities", "theme"].map(folder => `sassy.${pass}.${folder}`));

/** The visually-hidden placeholders are the only rules allowed !important - see 4-utilities/_430-display.sass. */
const importantAllowed = /^\.bf-visually-hidden(?:-focusable:not\(:focus\):not\(:focus-within\))?$/;

/**
 * Checks the full build's cascade layers: one statement declaring the expected stack, nothing outside a layer,
 * and no !important outside visually-hidden - within layers !important reverses, and beats consumers' own.
 */
const layerProblems = css => {
	const problems = [];
	const top = blocks(stripComments(css)).filter(b => !b.head.startsWith("@charset"));
	const statement = top.find(b => b.body === null && b.head.startsWith("@layer "));
	const declared = statement ? splitTop(statement.head.slice(7), ",").join(", ") : "none";
	if (declared !== layerStack.join(", ")) problems.push(`dist: the layer order is ${declared}, not ${layerStack.join(", ")}`);
	if (top[0] !== statement) problems.push("dist: the @layer order statement must come before every other rule");
	top.filter(b => b.body !== null && !b.head.startsWith("@layer "))
		.forEach(b => problems.push(`dist: ${squash(b.head)} is not in a cascade layer`));
	for (const [selector, decls] of declarations(css)) {
		const rule = selector.replace(/^.* > /, "");
		if (decls.some(d => d.includes("!important")) && !splitTop(rule, ",").every(s => importantAllowed.test(s)))
			problems.push(`dist: ${selector} uses !important`);
	}
	return problems;
};

const check = async () => {
	// docs/*.md and each layer's folder, docs/1-components/123-tabs.md and so on
	const docs = readdirSync(join(root, "docs"), { recursive: true }).filter(f => f.endsWith(".md")).sort();
	const files = ["README.md", ...docs.map(f => `docs/${f}`)];
	const examples = files.flatMap(f => docExamples(f, readFileSync(join(root, f), "utf8")));
	const results = await compile(examples);
	const problems = examples.flatMap((ex, i) =>
		results[i].error ? [results[i].error] : missing(ex.css, results[i].css).map(m => `${ex.label}: the CSS shown is not output: ${m}`)
	);
	console.log(`checked ${examples.length} examples in ${files.length} files`);
	const { problems: sectionProblems } = sectionDocs();
	return [...problems, ...sectionProblems, ...(await undefinedProperties()), ...layerProblems(readFileSync(join(root, "dist", "full.css"), "utf8"))];
};

//  =================================================================
//  Run
//  =================================================================

const commands = { build, check };
const command = commands[process.argv[2]];
if (!command) {
	console.error("usage: node tools/site.mjs build|check");
	process.exit(2);
}
try {
	const started = Date.now();
	const problems = await command();
	console.log(`in ${((Date.now() - started) / 1000).toFixed(1)}s, ${availableParallelism()} at a time`);
	if (problems.length > 0) {
		console.error(`\n${problems.length} problem(s):\n${problems.map(p => `  - ${p}`).join("\n")}`);
		process.exit(1);
	}
} catch (e) {
	console.error(e.message);
	process.exit(1);
}
