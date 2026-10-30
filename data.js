/* ESSENCE — shared wardrobe data (used by Outfits and My Wardrobe).
   Photos live in /images/<category>/. To add or replace a photo, set `src`,
   e.g.  src: "images/tops/my-new-top.jpg".
   Items with src: null still show a placeholder tile with a color swatch. */

const WARDROBE = {
  top: [
    { id: "t1",  name: "Light blue tee",         swatch: "#a9cde6", src: "images/tops/light-blue-tee.jpg" },
    { id: "t2",  name: "White polo",             swatch: "#f4f2ee", src: "images/tops/white-polo.jpg" },
    { id: "t3",  name: "Cream half-zip sweater", swatch: "#e9e1cf", src: "images/tops/cream-half-zip-sweater.jpg" },
    { id: "t4",  name: "Green half-zip sweater", swatch: "#1f5a35", src: "images/tops/green-half-zip-sweater.jpg" },
    { id: "t5",  name: "Olive quilted vest",     swatch: "#4a4a2c", src: "images/tops/olive-quilted-vest.jpg" },
    { id: "t6",  name: "South Lake jacket",      swatch: "#d9a441", src: "images/tops/south-lake-jacket.jpg" },
    { id: "t7",  name: "Brown leather jacket",   swatch: "#4a2f25", src: "images/tops/brown-leather-jacket.jpg" },
    { id: "t8",  name: "Brown suede jacket",     swatch: "#4b3a33", src: "images/tops/brown-suede-jacket.jpg" },
    { id: "t9",  name: "Charcoal wool jacket",   swatch: "#3b3b3b", src: "images/tops/charcoal-wool-jacket.jpg" },
    { id: "t10", name: "Car tapestry jacket",    swatch: "#5a3a30", src: "images/tops/car-tapestry-jacket.jpg" },
    { id: "t11", name: "Yellow utility jacket",  swatch: "#d9a21c", src: "images/tops/yellow-utility-jacket.jpg" }
  ],
  bottom: [
    { id: "b1", name: "Light jeans",    swatch: "#cfdbe6", src: "images/bottoms/light-jeans.jpg" },
    { id: "b2", name: "Brown trousers", swatch: "#3e2f28", src: "images/bottoms/brown-trousers.jpg" },
    { id: "b3", name: "Beige trousers", swatch: "#d8cdbb", src: "images/bottoms/beige-trousers.jpg" },
    { id: "b4", name: "Blue jeans",     swatch: "#5d7ea3", src: "images/bottoms/blue-jeans.jpg" },
    { id: "b5", name: "Ripped light-blue jeans", swatch: "#9fb6cc", src: "images/bottoms/ripped-light-blue-jeans.jpg" },
    { id: "b6", name: "Pink jeans",     swatch: "#e7b3c0", src: "images/bottoms/pink-jeans.jpg" }
  ],
  shoes: [
    { id: "s1", name: "Brown retro sneakers",  swatch: "#8a8575", src: "images/shoes/brown-retro-sneakers.jpg" },
    { id: "s2", name: "Black slip-on loafers", swatch: "#1b1b1b", src: "images/shoes/black-slip-on-loafers.jpg" },
    { id: "s3", name: "Black chunky sneakers", swatch: "#262626", src: "images/shoes/black-chunky-sneakers.jpg" },
    { id: "s4", name: "Grey chunky sneakers",  swatch: "#c9c6bd", src: "images/shoes/grey-chunky-sneakers.jpg" },
    { id: "s5", name: "White canvas sneakers", swatch: "#ece9e2", src: "images/shoes/white-canvas-sneakers.jpg" }
  ],
  accessory: [
    { id: "a1", name: "Black crossbody bag",   swatch: "#1c1c1c", src: "images/accessories/crossbody-bag.jpg" },
    { id: "a2", name: "Tweed beanie",          swatch: "#5a4632", src: "images/accessories/tweed-beanie.jpg" },
    { id: "a3", name: "Belt, gold buckle",     swatch: "#4a2f25", src: "images/accessories/belt-gold-buckle.jpg" },
    { id: "a4", name: "Navy cap",              swatch: "#1d2a44", src: "images/accessories/navy-cap.jpg" },
    { id: "a5", name: "Angular sunglasses",    swatch: "#111111", src: "images/accessories/angular-sunglasses.jpg" },
    { id: "a6", name: "Tweed tie",             swatch: "#3a2c20", src: "images/accessories/tweed-tie.jpg" },
    { id: "a7", name: "Wallet on lanyard",     swatch: "#4a1f2a", src: "images/accessories/wallet-lanyard.jpg" },
    { id: "a8", name: "Cat-eye sunglasses",    swatch: "#151515", src: "images/accessories/cat-eye-sunglasses.jpg" },
    { id: "a9", name: "Belt, silver buckle",   swatch: "#5a3a2a", src: "images/accessories/belt-silver-buckle.jpg" }
  ]
};

// The nine saved outfits shown in the design (reading order).
const SEED_OUTFITS = [
  { id: "seed-1", name: "Retro",         items: { top: "t1", bottom: "b1", shoes: "s1", accessory: "a4" } },
  { id: "seed-2", name: "Brownie Casual",items: { top: "t2", bottom: "b2", shoes: "s2", accessory: "a3" } },
  { id: "seed-3", name: "Brio",          items: { top: "t3", bottom: "b3", shoes: "s3", accessory: "a5" } },
  { id: "seed-4", name: "Nature",        items: { top: "t4", bottom: "b4", shoes: "s4", accessory: "a1" } },
  { id: "seed-5", name: "Camping",       items: { top: "t5", bottom: "b5", shoes: "s3", accessory: "a2" } },
  { id: "seed-6", name: "Spring Fit",    items: { top: "t6", bottom: "b2", shoes: "s2", accessory: "a9" } },
  { id: "seed-7", name: "Nature",        items: { top: "t8", bottom: "b1", shoes: "s1", accessory: "a7" } },
  { id: "seed-8", name: "Camping",       items: { top: "t2", bottom: "b6", shoes: "s2", accessory: "a2" } },
  { id: "seed-9", name: "Spring Fit",    items: { top: "t1", bottom: "b4", shoes: "s4", accessory: "a8" } }
];

function findItem(id) {
  for (const list of Object.values(WARDROBE)) {
    const hit = list.find(i => i.id === id);
    if (hit) return hit;
  }
  return null;
}
