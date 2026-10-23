const menuToggle = document.querySelector(".menu-toggle");
const primaryNav = document.querySelector(".primary-nav");
const searchToggle = document.querySelector(".search-toggle");
const searchPanel = document.querySelector(".search-panel");
const searchInput = document.querySelector("#site-search");
const searchClose = document.querySelector(".search-close");
const searchStatus = document.querySelector(".search-status");
const dropdownTriggers = [...document.querySelectorAll(".nav-trigger[aria-controls]")];
const newsletter = document.querySelector("#newsletter");
const newsletterStatus = document.querySelector(".newsletter-status");

const setMenuOpen = (isOpen) => {
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  primaryNav.classList.toggle("is-open", isOpen);
};

const setSearchOpen = (isOpen) => {
  searchToggle.setAttribute("aria-expanded", String(isOpen));
  searchPanel.hidden = !isOpen;
  if (isOpen) searchInput.focus();
};

const closeDropdowns = (except = null) => {
  dropdownTriggers.forEach((trigger) => {
    if (trigger === except) return;
    trigger.setAttribute("aria-expanded", "false");
    document.getElementById(trigger.getAttribute("aria-controls")).hidden = true;
  });
};

menuToggle.addEventListener("click", () => {
  setMenuOpen(menuToggle.getAttribute("aria-expanded") !== "true");
});

dropdownTriggers.forEach((trigger) => {
  trigger.addEventListener("click", () => {
    const isOpen = trigger.getAttribute("aria-expanded") !== "true";
    closeDropdowns(trigger);
    trigger.setAttribute("aria-expanded", String(isOpen));
    document.getElementById(trigger.getAttribute("aria-controls")).hidden = !isOpen;
  });
});

searchToggle.addEventListener("click", () => {
  setSearchOpen(searchPanel.hidden);
});

searchClose.addEventListener("click", () => {
  setSearchOpen(false);
  searchToggle.focus();
});

primaryNav.addEventListener("click", (event) => {
  if (event.target.closest("a") && window.matchMedia("(max-width: 1100px)").matches) {
    setMenuOpen(false);
    closeDropdowns();
  }
});

document.addEventListener("click", (event) => {
  if (!event.target.closest(".search-panel") && !event.target.closest(".search-toggle") && !searchPanel.hidden) {
    setSearchOpen(false);
  }
  if (!event.target.closest(".nav-item")) closeDropdowns();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    setSearchOpen(false);
    setMenuOpen(false);
    closeDropdowns();
  }
});

window.addEventListener("resize", () => {
  if (window.matchMedia("(min-width: 1101px)").matches) setMenuOpen(false);
});

searchPanel.addEventListener("submit", (event) => {
  event.preventDefault();
  const query = searchInput.value.trim().toLocaleLowerCase();
  if (!query) {
    searchStatus.textContent = "Enter a word or phrase to search.";
    searchInput.focus();
    return;
  }

  const sections = [...document.querySelectorAll("main section")];
  const match = sections.find((section) => section.textContent.toLocaleLowerCase().includes(query));
  if (!match) {
    searchStatus.textContent = `No section found for “${searchInput.value.trim()}”.`;
    return;
  }

  searchStatus.textContent = `Found “${searchInput.value.trim()}”.`;
  match.scrollIntoView({ behavior: "smooth", block: "start" });
  match.classList.add("search-result");
  window.setTimeout(() => match.classList.remove("search-result"), 1600);
});

newsletter.addEventListener("submit", (event) => {
  event.preventDefault();
  newsletterStatus.textContent = "Newsletter sign-up is not connected yet.";
});

document.querySelectorAll("img").forEach((image) => {
  image.addEventListener("error", () => {
    image.hidden = true;
  }, { once: true });
  if (image.complete && image.naturalWidth === 0) image.hidden = true;
});
