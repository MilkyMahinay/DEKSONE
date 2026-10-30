/* ESSENCE — shared header + tile renderers */

// Spelling follows the Figma design ("MY WARDROVE"). Change it here to fix it on every page.
const NAV = [
  { label: "HOME",        href: "home.html",       key: "home" },
  { label: "OUTFITS",     href: "outfits.html",    key: "outfits" },
  { label: "EVENTS",      href: "events.html",     key: "events" },
  { label: "MY WARDROVE", href: "wardrobe.html",   key: "wardrobe" }
];

function renderHeader() {
  const el = document.getElementById("site-header");
  if (!el) return;
  const { page, tone, overlay } = el.dataset;

  el.classList.add("site-header");
  if (tone === "light") el.classList.add("on-dark");
  if (overlay === "true") el.classList.add("overlay");
  el.textContent = "";

  const brand = document.createElement("div");
  brand.className = "brand";
  const word = document.createElement("a");
  word.className = "wordmark";
  word.href = "home.html";
  word.textContent = "ESSENCE";
  const tag = document.createElement("p");
  tag.className = "tagline";
  tag.textContent = "Minimal. Intentional. Essential.";
  brand.append(word, tag);

  const nav = document.createElement("nav");
  nav.className = "main-nav";
  nav.setAttribute("aria-label", "Main navigation");
  NAV.forEach(link => {
    const a = document.createElement("a");
    a.textContent = link.label;
    a.href = link.href;
    if (link.key === page) a.setAttribute("aria-current", "page");
    nav.appendChild(a);
  });

  const account = document.createElement("a");
  account.className = "header-account";
  account.href = "account.html";
  account.textContent = "ACCOUNT";
  if (page === "account") account.setAttribute("aria-current", "page");
  const mobileAccount = account.cloneNode(true);
  mobileAccount.classList.add("mobile-account");
  nav.appendChild(mobileAccount);

  const menuButton = document.createElement("button");
  menuButton.className = "menu-toggle";
  menuButton.type = "button";
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute("aria-controls", "main-navigation");
  menuButton.innerHTML = '<span class="menu-icon" aria-hidden="true"></span><span class="menu-label">MENU</span>';
  nav.id = "main-navigation";

  menuButton.addEventListener("click", () => {
    const isOpen = el.classList.toggle("menu-open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
    menuButton.querySelector(".menu-label").textContent = isOpen ? "CLOSE" : "MENU";
  });

  nav.addEventListener("click", event => {
    if (event.target.closest("a")) {
      el.classList.remove("menu-open");
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.querySelector(".menu-label").textContent = "MENU";
    }
  });

  el.append(brand, menuButton, nav, account);
}

/* Small DOM helper */
function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

const pad2 = n => String(n).padStart(2, "0");

/* Builds a product tile. `item` null = "NOT SELECTED" state.
   tag: "figure" (default), "div" or "button". */
function renderTile(item, tag = "figure") {
  const node = document.createElement(tag);
  node.className = "tile";
  if (tag === "button") node.type = "button";

  if (!item) {
    node.classList.add("empty");
    node.appendChild(el("span", "tile-label not-selected", "NOT SELECTED"));
    return node;
  }

  if (item.src) {
    const img = document.createElement("img");
    img.src = item.src;
    img.alt = tag === "button" ? "" : item.name;
    img.loading = "lazy";
    node.appendChild(img);
  } else {
    const swatch = el("span", "swatch");
    swatch.style.background = item.swatch || "#cfcac2";
    swatch.setAttribute("aria-hidden", "true");
    node.append(swatch, el("span", "tile-label", item.name));
    if (tag === "figure") {
      node.setAttribute("role", "img");
      node.setAttribute("aria-label", `${item.name} (placeholder)`);
    }
  }
  return node;
}

/* Product card: photo + caption (name and running number). */
function renderProduct(item, number) {
  const fig = el("figure", "product");
  fig.appendChild(renderTile(item, "div"));
  const cap = el("figcaption");
  cap.append(el("span", "p-name", item.name), el("span", "p-no", pad2(number)));
  fig.appendChild(cap);
  return fig;
}

renderHeader();
