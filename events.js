/* Events — display only.
   The four events below are SAMPLES. Their dates are counted from today
   (offset = days from today), so the page always looks current. */

const SAMPLE_EVENTS = [
  { offset: 2,  title: "Friday Dinner",       time: "19:30", place: "Rooftop restaurant",
    note: "Smart casual. Warm layer for the evening.",
    items: { top: "t3", bottom: "b2", shoes: "s2", accessory: "a3" } },
  { offset: 9,  title: "Gallery Opening",     time: "18:00", place: "Contemporary art gallery",
    note: "Dark, minimal and tailored.",
    items: { top: "t9", bottom: "b3", shoes: "s2", accessory: "a7" } },
  { offset: 16, title: "Weekend Trip",        time: "All day", place: "Mountain cabin",
    note: "Layers, easy shoes, something for the cold.",
    items: { top: "t5", bottom: "b4", shoes: "s1", accessory: "a2" } },
  { offset: 24, title: "Team Presentation",   time: "10:00", place: "Office",
    note: "Clean and understated.",
    items: { top: "t2", bottom: "b2", shoes: "s5", accessory: "a9" } }
];

const today = new Date();
today.setHours(0, 0, 0, 0);
const addDays = n => { const d = new Date(today); d.setDate(d.getDate() + n); return d; };
const fmt = (d, opts) => d.toLocaleDateString("en-GB", opts);

// Stats
const weekCount = SAMPLE_EVENTS.filter(e => e.offset < 7).length;
const statsEl = document.getElementById("stats");
[
  { n: SAMPLE_EVENTS.length, l: "Upcoming" },
  { n: SAMPLE_EVENTS.length, l: "Outfits planned" },
  { n: weekCount,            l: "This week" }
].forEach(({ n, l }) => {
  const stat = el("div", "stat");
  stat.append(el("b", "", pad2(n)), el("span", "", l));
  statsEl.appendChild(stat);
});

// Week strip: today + the next six days
const weekEl = document.getElementById("week");
for (let i = 0; i < 7; i++) {
  const d = addDays(i);
  const hasEvent = SAMPLE_EVENTS.some(e => e.offset === i);
  const cell = el("div", `day${i === 0 ? " today" : ""}${hasEvent ? " has-event" : ""}`);
  cell.append(
    el("span", "wd", fmt(d, { weekday: "short" }).toUpperCase()),
    el("span", "dn", fmt(d, { day: "numeric" })),
    el("span", "dot")
  );
  cell.setAttribute("aria-label",
    `${fmt(d, { weekday: "long", day: "numeric", month: "long" })}${i === 0 ? ", today" : ""}${hasEvent ? ", event planned" : ""}`);
  weekEl.appendChild(cell);
}

// Event list
const eventsEl = document.getElementById("events");
SAMPLE_EVENTS.forEach((ev, index) => {
  const d = addDays(ev.offset);
  const row = el("article", "event");
 row.id = `event-${index + 1}`;

  const date = el("div", "ev-date");
  date.append(
    el("span", "ev-day", fmt(d, { day: "2-digit" })),
    el("span", "ev-mon", fmt(d, { month: "short" }).toUpperCase()),
    el("span", "ev-wd", fmt(d, { weekday: "short" }).toUpperCase())
  );

  const info = el("div", "ev-info");
  info.append(
    el("h3", "", ev.title),
    el("p", "ev-meta", `${ev.time} · ${ev.place}`),
    el("p", "ev-note", ev.note),
    el("span", "badge", "OUTFIT PLANNED")
  );

  const outfit = el("div", "ev-outfit");
  outfit.setAttribute("role", "list");
  outfit.setAttribute("aria-label", `Outfit for ${ev.title}`);
  ["top", "bottom", "shoes", "accessory"].forEach(key => {
    const item = findItem(ev.items[key]);
    const tile = renderTile(item, "div");
    tile.setAttribute("role", "listitem");
    tile.title = item.name;
    outfit.appendChild(tile);
  });

  row.append(date, info, outfit);
  eventsEl.appendChild(row);
});

// Full month calendar below the event list.
const monthGrid = document.getElementById("month-grid");
const monthLabel = document.getElementById("calendar-month");
let calendarMonth = new Date(today.getFullYear(), today.getMonth(), 1);

function dateKey(date) {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}

function renderMonth() {
  monthGrid.textContent = "";
  monthLabel.textContent = calendarMonth.toLocaleDateString("en-GB", {
    month: "long",
    year: "numeric"
  });

  ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].forEach(day => {
    const heading = el("div", "month-weekday", day);
    heading.setAttribute("role", "columnheader");
    monthGrid.appendChild(heading);
  });

  const firstDay = new Date(calendarMonth);
  const mondayOffset = (firstDay.getDay() + 6) % 7;
  const gridStart = new Date(firstDay);
  gridStart.setDate(firstDay.getDate() - mondayOffset);

  for (let i = 0; i < 42; i++) {
    const date = new Date(gridStart);
    date.setDate(gridStart.getDate() + i);
    const inMonth = date.getMonth() === calendarMonth.getMonth();
    const eventIndex = SAMPLE_EVENTS.findIndex(event => dateKey(addDays(event.offset)) === dateKey(date));
    const cell = el("div", `month-day${inMonth ? "" : " outside-month"}${dateKey(date) === dateKey(today) ? " is-today" : ""}${eventIndex >= 0 ? " has-event" : ""}`);
    cell.setAttribute("role", "gridcell");
    cell.setAttribute("aria-label", `${fmt(date, { weekday: "long", day: "numeric", month: "long" })}${eventIndex >= 0 ? `, ${SAMPLE_EVENTS[eventIndex].title}` : ""}`);
    cell.appendChild(el("span", "month-date", String(date.getDate())));
    if (eventIndex >= 0) {
      const eventLink = el("a", "month-event", SAMPLE_EVENTS[eventIndex].title);
      eventLink.href = `#event-${eventIndex + 1}`;
      eventLink.setAttribute("aria-label", `View ${SAMPLE_EVENTS[eventIndex].title}`);
      cell.appendChild(eventLink);
    }
    monthGrid.appendChild(cell);
  }
}

document.getElementById("calendar-prev").addEventListener("click", () => {
  calendarMonth.setMonth(calendarMonth.getMonth() - 1);
  renderMonth();
});
document.getElementById("calendar-next").addEventListener("click", () => {
  calendarMonth.setMonth(calendarMonth.getMonth() + 1);
  renderMonth();
});

renderMonth();
