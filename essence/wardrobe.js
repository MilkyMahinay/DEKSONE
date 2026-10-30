/* My Wardrobe — everything rendered from data.js.
   Top 11 · Bottom 6 · Shoes 5 · Accessories 9 (4-column grid). */

const CATEGORIES = [
  { title: "Top",         items: WARDROBE.top },
  { title: "Bottom",      items: WARDROBE.bottom },
  { title: "Shoes",       items: WARDROBE.shoes },
  { title: "Accessories", items: WARDROBE.accessory }
];

// Page title follows the navigation spelling (change it once in site.js).
document.getElementById("page-title").textContent = NAV.find(n => n.key === "wardrobe").label;

const stats = document.getElementById("stats");

function renderStats() {
  stats.textContent = "";
  const total = CATEGORIES.reduce((sum, category) => sum + category.items.length, 0);
  [{ n: total, l: "Pieces" }, ...CATEGORIES.map(category => ({ n: category.items.length, l: category.title }))].forEach(({ n, l }) => {
    const stat = el("div", "stat");
    stat.append(el("b", "", pad2(n)), el("span", "", l));
    stats.appendChild(stat);
  });
}

// Featured piece (the patterned yellow jacket from the design)
const featured = findItem("t6");
document.getElementById("w-feature").appendChild(renderTile(featured, "div"));
document.getElementById("w-feature-name").textContent = featured.name;

const catalog = document.getElementById("catalog");

function renderCatalog() {
  catalog.textContent = "";
  CATEGORIES.forEach(({ title, items }) => {
    const section = el("section", "category");

    const head = el("div", "sec-head");
    head.append(el("h2", "", title), el("span", "count", `${pad2(items.length)} pieces`));

    const grid = el("div", "pgrid");
    items.forEach((item, i) => grid.appendChild(renderProduct(item, i + 1)));

    section.append(head, grid);
    catalog.appendChild(section);
  });
}

const uploadForm = document.getElementById("upload-form");
const photoInput = document.getElementById("clothing-photo");
const photoPreview = document.getElementById("photo-preview");
const photoPrompt = document.getElementById("photo-prompt");
const uploadMessage = document.getElementById("upload-message");
const clothingName = document.getElementById("clothing-name");
let photoUrl = "";

photoInput.addEventListener("change", () => {
  const file = photoInput.files[0];
  if (!file) return;
  if (!file.type.startsWith("image/")) {
    photoInput.setCustomValidity("Please choose an image file.");
    photoInput.reportValidity();
    return;
  }

  photoInput.setCustomValidity("");
  clothingName.setCustomValidity("");
  if (photoUrl) URL.revokeObjectURL(photoUrl);
  photoUrl = URL.createObjectURL(file);
  photoPreview.src = photoUrl;
  photoPreview.hidden = false;
  photoPrompt.hidden = true;
  uploadMessage.textContent = `${file.name} is ready to preview.`;
});

uploadForm.addEventListener("submit", event => {
  event.preventDefault();
  clothingName.setCustomValidity(clothingName.value.trim() ? "" : "Enter a name for this clothing item.");
  if (!uploadForm.reportValidity()) return;

  const file = photoInput.files[0];
  if (!file || !file.type.startsWith("image/")) {
    uploadMessage.textContent = "Choose an image file to add.";
    return;
  }

  const category = CATEGORIES.find(item => item.items === WARDROBE[document.getElementById("clothing-category").value]);
  if (!category) {
    uploadMessage.textContent = "Choose a clothing category.";
    return;
  }

  category.items.push({
    id: `custom-${Date.now()}`,
    name: clothingName.value.trim(),
    src: photoUrl
  });

  renderCatalog();
  renderStats();
  uploadMessage.textContent = "Added to your wardrobe for this browser session.";
  uploadForm.reset();
  photoPreview.removeAttribute("src");
  photoPreview.hidden = true;
  photoPrompt.hidden = false;
  photoUrl = "";
});

renderStats();
renderCatalog();
