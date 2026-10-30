/* Outfits — design-focused.
   The only interactive part is the category pickers (Top, Bottom, Shoes, Accessorory):
   click a piece, press Enter/Space, or use the arrow buttons to move to the next one
   (Arrow keys on a focused piece go forward/back). The accessory can also be "NOT SELECTED".
   Everything else (name field, SAVE OUTFIT, VIEW, CHOOSE) is visual only. */

// "Accessorory" spelling follows the Figma design.
const SLOTS = [
  { key: "top",       label: "Top",         list: WARDROBE.top },
  { key: "bottom",    label: "Bottom",      list: WARDROBE.bottom },
  { key: "shoes",     label: "Shoes",       list: WARDROBE.shoes },
  { key: "accessory", label: "Accessorory", list: WARDROBE.accessory, optional: true }
];

// Starting selection (accessory starts as NOT SELECTED = -1)
const state = { top: 6, bottom: 3, shoes: 4, accessory: -1 };

const picker = document.getElementById("picker");
const resultGrid = document.getElementById("result-grid");
const collectionsEl = document.getElementById("collections");

function currentItem(slot) {
  const i = state[slot.key];
  return i < 0 ? null : slot.list[i];
}

function cycle(slot, dir, focusSel) {
  const min = slot.optional ? -1 : 0;
  const max = slot.list.length - 1;
  let i = state[slot.key] + dir;
  if (i > max) i = min;
  if (i < min) i = max;
  state[slot.key] = i;
  renderBuilder(focusSel);
}

function arrowButton(slot, dir) {
  const btn = el("button", "arrow", dir > 0 ? "›" : "‹");
  btn.type = "button";
  btn.dataset.slot = slot.key;
  btn.dataset.ctl = dir > 0 ? "next" : "prev";
  btn.setAttribute("aria-label", `${dir > 0 ? "Next" : "Previous"} ${slot.label.toLowerCase()}`);
  btn.addEventListener("click", () =>
    cycle(slot, dir, `[data-slot="${slot.key}"][data-ctl="${btn.dataset.ctl}"]`));
  return btn;
}

function renderBuilder(focusSel) {
  picker.textContent = "";

  SLOTS.forEach((slot, n) => {
    const idx = state[slot.key];
    const item = currentItem(slot);

    const card = el("div", "slot");

    const head = el("div", "slot-head");
    const title = el("span", "slot-title");
    title.append(el("span", "no", pad2(n + 1)), document.createTextNode(slot.label));
    head.append(title, el("span", "count", `${idx < 0 ? "—" : pad2(idx + 1)} / ${pad2(slot.list.length)}`));

    const tile = renderTile(item, "button");
    tile.dataset.slot = slot.key;
    tile.dataset.ctl = "tile";
    tile.setAttribute(
      "aria-label",
      `${slot.label}: ${item ? item.name : "not selected"}. Press to see the next ${slot.label.toLowerCase()}.`
    );
    const tileSel = `[data-slot="${slot.key}"][data-ctl="tile"]`;
    tile.addEventListener("click", () => cycle(slot, 1, tileSel));
    tile.addEventListener("keydown", e => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") { e.preventDefault(); cycle(slot, 1, tileSel); }
      if (e.key === "ArrowLeft"  || e.key === "ArrowUp")   { e.preventDefault(); cycle(slot, -1, tileSel); }
    });

    const foot = el("div", "slot-foot");
    foot.append(arrowButton(slot, -1), el("span", "slot-name", item ? item.name : "Not selected"), arrowButton(slot, 1));

    card.append(head, tile, foot);
    picker.appendChild(card);
  });

  resultGrid.textContent = "";
  SLOTS.forEach(slot => {
    const item = currentItem(slot);
    const fig = el("figure", "mini");
    fig.appendChild(renderTile(item, "div"));
    fig.appendChild(el("figcaption", "", item ? item.name : "Not selected"));
    resultGrid.appendChild(fig);
  });

  if (focusSel) {
    const target = picker.querySelector(focusSel);
    if (target) target.focus();
  }
}

/* Saved outfits: static display of the nine outfits from the design. */
function renderCollections() {
  collectionsEl.textContent = "";

  SEED_OUTFITS.forEach(outfit => {
    const col = el("article", "collection");

    SLOTS.forEach(slot => {
      const item = findItem(outfit.items[slot.key]);
      const tile = renderTile(item);
      tile.classList.add(`c-${slot.key}`);
      col.appendChild(tile);
    });

    col.append(
      el("h3", "coll-name", outfit.name),
      el("span", "btn-light", "VIEW"),
      el("span", "btn-gray", "CHOOSE")
    );
    collectionsEl.appendChild(col);
  });
}

renderBuilder();
renderCollections();
