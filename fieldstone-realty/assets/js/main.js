/* ==========================================================
   Fieldstone Realty — main.js
   No dependencies. Edit LISTINGS to show your own properties.
   ========================================================== */

// ---------- SETTINGS ----------
const CURRENCY = "$";
const AREA_UNIT = "sq ft";     // e.g. "m²"

// Your listings. Newest first.
// type: "house" | "townhouse" | "apartment"
// art:  illustration used when there is no photo: "gabled" | "modern" | "terrace" | "block" | "cottage"
// image: optional photo path, e.g. "assets/img/12-linden.jpg" — replaces the illustration
const LISTINGS = [
  { address: "12 Linden Avenue", area: "Westbrook", price: 865000, type: "house", beds: 4, baths: 2, size: 2140, badge: "New", art: "gabled", sky: "#dfe6f6", body: "#f1d3c8" },
  { address: "3/48 Quay Street", area: "Harbour City", price: 545000, type: "apartment", beds: 2, baths: 1, size: 910, badge: "Open home Sat", art: "block", sky: "#f4e6dc", body: "#c9d3e8" },
  { address: "7 Fern Lane", area: "Elm Park", price: 1240000, type: "house", beds: 5, baths: 3, size: 3020, badge: "", art: "modern", sky: "#e2ece3", body: "#ffffff" },
  { address: "21B Mill Road", area: "Old Town", price: 698000, type: "townhouse", beds: 3, baths: 2, size: 1480, badge: "Price reduced", art: "terrace", sky: "#efe3f0", body: "#e8c9a9" },
  { address: "88 Orchard Close", area: "Westbrook", price: 742000, type: "house", beds: 3, baths: 1, size: 1650, badge: "", art: "cottage", sky: "#e6eef3", body: "#f4efe4" },
  { address: "15/2 Bay View Terrace", area: "Harbour City", price: 1495000, type: "apartment", beds: 3, baths: 2, size: 1720, badge: "Water views", art: "block", sky: "#dde9f0", body: "#e9e2d6" }
];
// ------------------------------

const money = (n) => CURRENCY + Math.round(n).toLocaleString("en-US");
const INK = "#1d1f1c";

/* ---------- House illustrations (SVG) ---------- */
const ART = {
  gabled: (b) => `<svg viewBox="0 0 140 120"><path d="M14 54 70 12l56 42" fill="${INK}"/><rect x="24" y="50" width="92" height="70" fill="${b}" stroke="${INK}" stroke-width="3"/><rect x="38" y="66" width="20" height="18" fill="#fff" stroke="${INK}" stroke-width="3"/><rect x="82" y="66" width="20" height="18" fill="#fff" stroke="${INK}" stroke-width="3"/><rect x="61" y="88" width="18" height="32" fill="var(--cobalt)"/><rect x="92" y="20" width="10" height="22" fill="${INK}"/></svg>`,
  modern: (b) => `<svg viewBox="0 0 170 120"><rect x="10" y="56" width="90" height="64" fill="${b}" stroke="${INK}" stroke-width="3"/><rect x="56" y="22" width="104" height="44" fill="${b}" stroke="${INK}" stroke-width="3"/><rect x="66" y="32" width="84" height="24" fill="#cfe0f5" stroke="${INK}" stroke-width="3"/><rect x="20" y="70" width="44" height="50" fill="#cfe0f5" stroke="${INK}" stroke-width="3"/><path d="M42 70v50" stroke="${INK}" stroke-width="3"/><rect x="74" y="88" width="16" height="32" fill="var(--cobalt)"/><path d="M50 18h120" stroke="${INK}" stroke-width="5"/></svg>`,
  terrace: (b) => `<svg viewBox="0 0 120 150"><path d="M8 50 34 18l26 32 26-32 26 32" fill="${INK}"/><rect x="12" y="48" width="44" height="102" fill="${b}" stroke="${INK}" stroke-width="3"/><rect x="64" y="48" width="44" height="102" fill="#f6f1ea" stroke="${INK}" stroke-width="3"/><rect x="22" y="62" width="24" height="22" fill="#fff" stroke="${INK}" stroke-width="3"/><rect x="74" y="62" width="24" height="22" fill="#fff" stroke="${INK}" stroke-width="3"/><rect x="22" y="94" width="24" height="18" fill="#fff" stroke="${INK}" stroke-width="3"/><rect x="74" y="94" width="24" height="18" fill="#fff" stroke="${INK}" stroke-width="3"/><rect x="26" y="120" width="16" height="30" fill="var(--cobalt)"/><rect x="78" y="120" width="16" height="30" fill="${INK}"/></svg>`,
  block: (b) => {
    let w = "";
    for (let r = 0; r < 5; r++) for (let c = 0; c < 3; c++) w += `<rect x="${18 + c * 26}" y="${22 + r * 24}" width="16" height="14" fill="${(r + c) % 4 === 0 ? "#ffe9a8" : "#fff"}" stroke="${INK}" stroke-width="2.5"/>`;
    return `<svg viewBox="0 0 110 160"><rect x="8" y="10" width="94" height="150" fill="${b}" stroke="${INK}" stroke-width="3"/>${w}<rect x="43" y="140" width="24" height="20" fill="var(--cobalt)"/><path d="M4 10h102" stroke="${INK}" stroke-width="5"/></svg>`;
  },
  cottage: (b) => `<svg viewBox="0 0 170 110"><path d="M10 56 46 22h78l36 34" fill="${INK}"/><rect x="128" y="10" width="12" height="26" fill="${INK}"/><rect x="18" y="52" width="134" height="58" fill="${b}" stroke="${INK}" stroke-width="3"/><rect x="32" y="66" width="26" height="20" fill="#fff" stroke="${INK}" stroke-width="3"/><rect x="112" y="66" width="26" height="20" fill="#fff" stroke="${INK}" stroke-width="3"/><path d="M74 110V80a11 11 0 0 1 22 0v30" fill="var(--cobalt)"/></svg>`
};
const artFor = (l) => (ART[l.art] || ART.gabled)(l.body || "#fff");

/* ---------- Mobile navigation ---------- */
const toggle = document.querySelector(".nav-toggle");
const nav = document.getElementById("site-nav");
if (toggle && nav) {
  toggle.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!open));
    nav.classList.toggle("open", !open);
  });
  nav.addEventListener("click", (e) => {
    if (e.target.closest("a")) { toggle.setAttribute("aria-expanded", "false"); nav.classList.remove("open"); }
  });
}

/* ---------- Hero street ---------- */
const skyline = document.querySelector("[data-skyline]");
if (skyline) {
  const order = ["terrace", "gabled", "block", "modern", "cottage", "block", "terrace"];
  skyline.innerHTML = order.map((a, i) => ART[a](["#f1d3c8", "#ffffff", "#c9d3e8", "#ffffff", "#f4efe4", "#e9e2d6", "#e8c9a9"][i])).join("");
}

/* ---------- Listings with filters ---------- */
const cardsEl = document.querySelector("[data-cards]");
const countEl = document.querySelector("[data-count]");
const emptyEl = document.querySelector("[data-empty]");
const sortEl = document.querySelector("[data-sort]");
const search = document.querySelector("[data-search]");
const state = { type: "all", beds: 0, max: 0, sort: "new" };

function renderListings() {
  let list = LISTINGS.map((l, i) => ({ ...l, i }))
    .filter((l) => (state.type === "all" || l.type === state.type) && l.beds >= state.beds && (!state.max || l.price <= state.max));
  if (state.sort === "low") list.sort((a, b) => a.price - b.price);
  if (state.sort === "high") list.sort((a, b) => b.price - a.price);

  cardsEl.innerHTML = list.map((l) => `
    <li class="card">
      <div class="card-photo${l.image ? " has-image" : ""}" style="--sky:${l.sky || "var(--tint)"};${l.image ? `background-image:url('${l.image}')` : ""}" ${l.image ? `role="img" aria-label="Photo of ${l.address}"` : ""}>
        ${l.badge ? `<span class="badge${l.badge === "New" ? " new" : ""}">${l.badge}</span>` : ""}
        ${l.image ? "" : artFor(l)}
      </div>
      <div class="card-body">
        <p class="price">${money(l.price)}</p>
        <p class="address">${l.address}, ${l.area}</p>
        <ul class="facts">
          <li><b>${l.beds}</b> bed</li>
          <li><b>${l.baths}</b> bath</li>
          <li><b>${l.size.toLocaleString("en-US")}</b> ${AREA_UNIT}</li>
          <li>${l.type[0].toUpperCase() + l.type.slice(1)}</li>
        </ul>
        <button type="button" class="btn btn-line" data-view="${l.i}">Request a viewing</button>
      </div>
    </li>`).join("");

  countEl.textContent = list.length === LISTINGS.length
    ? `${list.length} homes available`
    : `${list.length} of ${LISTINGS.length} homes match your search`;
  emptyEl.hidden = list.length > 0;
}

if (cardsEl) {
  const readSearch = () => {
    state.type = search.elements.type.value;
    state.beds = Number(search.elements.beds.value);
    state.max = Number(search.elements.max.value);
    renderListings();
  };
  search.addEventListener("change", readSearch);
  search.addEventListener("submit", (e) => {
    e.preventDefault(); readSearch();
    document.getElementById("listings").scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  });
  sortEl.addEventListener("change", () => { state.sort = sortEl.value; renderListings(); });
  document.querySelector("[data-reset]").addEventListener("click", () => { search.reset(); readSearch(); });
  cardsEl.addEventListener("click", (e) => {
    const b = e.target.closest("[data-view]");
    if (b) openViewing(LISTINGS[Number(b.dataset.view)]);
  });
  renderListings();
}

/* ---------- Mortgage calculator ---------- */
const calc = document.querySelector("[data-calc]");
if (calc) {
  const $ = (s) => document.querySelector(s);
  function update() {
    const price = Number(calc.elements.price.value);
    const depPct = Number(calc.elements.deposit.value);
    const rate = Number(calc.elements.rate.value);
    const years = Number(calc.querySelector("[name=term]:checked").value);
    const deposit = price * depPct / 100;
    const loan = price - deposit;
    const r = rate / 100 / 12, n = years * 12;
    const monthly = r ? loan * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1) : loan / n;
    const total = monthly * n, interest = total - loan;

    $("[data-out=price]").textContent = money(price);
    $("[data-out=deposit]").textContent = `${depPct}% · ${money(deposit)}`;
    $("[data-out=rate]").textContent = `${rate.toFixed(2)}%`;
    $("[data-monthly]").innerHTML = `${money(monthly)}<small> / month</small>`;
    $("[data-loan]").textContent = money(loan);
    $("[data-interest]").textContent = money(interest);
    $("[data-deposit]").textContent = money(deposit);
    $("[data-total]").textContent = money(total);
    $("[data-bar-principal]").style.width = `${(loan / total) * 100}%`;
    $("[data-bar-interest]").style.width = `${(interest / total) * 100}%`;
  }
  calc.addEventListener("input", update);
  calc.addEventListener("change", update);
  update();
}

/* ---------- Form validation helper ---------- */
const rules = {
  name: (v) => v.trim().length >= 2,
  phone: (v) => v.replace(/\D/g, "").length >= 7,
  email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())
};
function validate(form, names) {
  let first = null;
  names.forEach((n) => {
    const el = form.elements[n];
    const ok = rules[n](el.value);
    el.closest(".field").classList.toggle("invalid", !ok);
    el.setAttribute("aria-invalid", String(!ok));
    if (!ok && !first) first = el;
  });
  if (first) first.focus();
  return !first;
}

/* ---------- Viewing dialog ----------
   Demo mode: shows a confirmation. To receive requests, post the form to a
   form service (see documentation.html). */
const dlg = document.querySelector("[data-viewing]");
const vForm = document.querySelector("[data-viewing-form]");
let current = null;
function openViewing(l) {
  current = l;
  vForm.reset();
  vForm.querySelectorAll(".invalid").forEach((f) => f.classList.remove("invalid"));
  vForm.querySelector("[data-v-success]").hidden = true;
  vForm.querySelector("[data-v-send]").hidden = false;
  dlg.querySelector("[data-v-home]").textContent = `${l.address}, ${l.area} · ${money(l.price)}`;
  if (typeof dlg.showModal === "function") dlg.showModal();
}
if (vForm) {
  vForm.addEventListener("submit", (e) => {
    if (e.submitter && e.submitter.value === "cancel") return; // close
    e.preventDefault();
    if (!validate(vForm, ["name", "phone"])) return;
    vForm.querySelector("[data-v-success]").hidden = false;
    vForm.querySelector("[data-v-send]").hidden = true;
  });
}

/* ---------- Contact form ---------- */
const cForm = document.querySelector("[data-contact-form]");
if (cForm) {
  cForm.addEventListener("submit", (e) => {
    if (!validate(cForm, ["name", "phone", "email"])) { e.preventDefault(); return; }
    if (!cForm.getAttribute("action")) {
      e.preventDefault();
      cForm.querySelector(".form-success").hidden = false;
    }
  });
}

/* ---------- Footer year ---------- */
document.querySelectorAll("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));
