/* Categories — the only interactive part is choosing a category.
   Cards and tabs are two views of the same choice. A link such as
   categories.html#shoes opens with that category already chosen. */

const CATS = [
  { key: "top",       title: "Top",         list: WARDROBE.top,       cover: "t7" },
  { key: "bottom",    title: "Bottom",      list: WARDROBE.bottom,    cover: "b4" },
  { key: "shoes",     title: "Shoes",       list: WARDROBE.shoes,     cover: "s5" },
  { key: "accessory", title: "Accessories", list: WARDROBE.accessory, cover: "a1" }
];
const ALL = { key: "all", title: "All pieces", list: CATS.flatMap(c => c.list) };

let active = (location.hash || "").slice(1);
if (!CATS.some(c => c.key === active)) active = "all";

const cardsEl = document.getElementById("cat-cards");
const tabsEl = document.getElementById("tabs");
const resultsEl = document.getElementById("results");
const gridEl = document.getElementById("results-grid");
const titleEl = document.getElementById("results-title");
const countEl = document.getElementById("results-count");

// Stats
const statsEl = document.getElementById("stats");
[{ n: ALL.list.length, l: "Pieces" }, { n: CATS.length, l: "Categories" }].forEach(({ n, l }) => {
  const stat = el("div", "stat");
  stat.append(el("b", "", pad2(n)), el("span", "", l));
  statsEl.appendChild(stat);
});

function setActive(key, scroll) {
  active = key;
  try { history.replaceState(null, "", key === "all" ? location.pathname : `#${key}`); } catch { /* ignore */ }
  render();
  if (scroll) resultsEl.scrollIntoView({ behavior: "smooth", block: "start" });
}

function renderCards() {
  cardsEl.textContent = "";
  CATS.forEach(cat => {
    const btn = el("button", "cat-card");
    btn.type = "button";
    btn.setAttribute("aria-pressed", String(active === cat.key));
    btn.setAttribute("aria-label", `${cat.title}, ${cat.list.length} pieces`);
    btn.appendChild(renderTile(findItem(cat.cover), "div"));

    const label = el("span", "cat-label");
    label.append(el("b", "", cat.title), el("span", "", `${pad2(cat.list.length)} pieces`));
    btn.appendChild(label);

    btn.addEventListener("click", () => setActive(active === cat.key ? "all" : cat.key, true));
    cardsEl.appendChild(btn);
  });
}

function renderTabs() {
  tabsEl.textContent = "";
  [ALL, ...CATS].forEach(cat => {
    const btn = el("button", "tab", cat.key === "all" ? "All" : cat.title);
    btn.type = "button";
    btn.setAttribute("aria-pressed", String(active === cat.key));
    btn.addEventListener("click", () => setActive(cat.key, false));
    tabsEl.appendChild(btn);
  });
}

function renderResults() {
  const cat = active === "all" ? ALL : CATS.find(c => c.key === active);
  titleEl.textContent = cat.title;
  countEl.textContent = `${pad2(cat.list.length)} pieces`;
  gridEl.textContent = "";
  cat.list.forEach((item, i) => gridEl.appendChild(renderProduct(item, i + 1)));
}

function render() {
  renderCards();
  renderTabs();
  renderResults();
}

render();
