/* ── Configuration ── */
const INQUIRY_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwANgpSp_U1Xubz8OVQVySFlGcg2ZqdJGHj96BZkNLdtmLJnLah_ZlNtUNxCd4Qorsugw/exec";

/* ── Language state ── */
let currentLang = "en";

/* ── DOM references ── */
const header = document.querySelector("#site-header");
const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector("#primary-navigation");
const navLinks = document.querySelectorAll(".nav-menu a");
const revealItems = document.querySelectorAll(".reveal");
const galleryItems = document.querySelectorAll(".gallery-item");
const lightbox = document.querySelector("#lightbox");
const lightboxImage = document.querySelector("#lightbox-image");
const lightboxCaption = document.querySelector("#lightbox-caption");
const lightboxClose = document.querySelector(".lightbox-close");
const inquiryForm = document.querySelector("#visit-inquiry-form");
const formPopup = document.querySelector("#form-popup");
const formPopupTitle = document.querySelector("#form-popup-title");
const formPopupMessage = document.querySelector("#form-popup-message");
const formPopupCloseButtons = document.querySelectorAll("[data-popup-close]");
const langToggle = document.querySelector("#lang-toggle");

/* ── Language toggle system ── */
function switchLanguage(lang) {
  currentLang = lang;
  const attr = `data-${lang}`;

  // Switch all elements that have data-en and data-kn attributes
  document.querySelectorAll("[data-en][data-kn]").forEach((el) => {
    const text = el.getAttribute(attr);
    if (text !== null) {
      el.textContent = text;
    }
  });

  // Switch placeholders on inputs/textareas
  document.querySelectorAll("[data-placeholder-en][data-placeholder-kn]").forEach((el) => {
    const placeholderAttr = `data-placeholder-${lang}`;
    const placeholder = el.getAttribute(placeholderAttr);
    if (placeholder !== null) {
      el.placeholder = placeholder;
    }
  });

  // Switch select option texts
  document.querySelectorAll("select option[data-en][data-kn]").forEach((opt) => {
    const text = opt.getAttribute(attr);
    if (text !== null) {
      opt.textContent = text;
    }
  });

  // Update the toggle button label
  const langLabel = document.querySelector(".lang-label");
  if (langLabel) {
    langLabel.textContent = langLabel.getAttribute(attr);
  }

  // Set html lang attribute
  document.documentElement.lang = lang === "kn" ? "kn" : "en";
}

function toggleLanguage() {
  const newLang = currentLang === "en" ? "kn" : "en";
  switchLanguage(newLang);
}

/* ── Header scroll ── */
function updateHeader() {
  header.classList.toggle("is-scrolled", window.scrollY > 24);
}

/* ── Mobile nav ── */
function setNavOpen(isOpen) {
  navToggle.classList.toggle("is-active", isOpen);
  navMenu.classList.toggle("is-open", isOpen);
  header.classList.toggle("is-open", isOpen);
  document.body.classList.toggle("nav-open", isOpen);
  navToggle.setAttribute("aria-expanded", String(isOpen));
  navToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
}

function handleAnchorClick(event) {
  const link = event.currentTarget;
  const targetId = link.getAttribute("href");

  if (!targetId || !targetId.startsWith("#") || targetId === "#") {
    return;
  }

  const target = document.querySelector(targetId);

  if (!target) {
    return;
  }

  event.preventDefault();
  setNavOpen(false);
  target.scrollIntoView({ behavior: "smooth", block: "start" });
}

/* ── Scroll reveal ── */
function initRevealObserver() {
  if (!("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.14,
      rootMargin: "0px 0px -8% 0px",
    }
  );

  revealItems.forEach((item) => observer.observe(item));
}

/* ── Hero parallax ── */
function updateHeroParallax() {
  const hero = document.querySelector(".hero");

  if (!hero || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }

  const drift = Math.min(window.scrollY * 0.08, 54);
  hero.style.setProperty("--hero-drift", `${drift}px`);
}

/* ── Lightbox ── */
function openLightbox(item) {
  const image = item.querySelector("img");
  const captionKey = currentLang === "kn" ? "captionKn" : "caption";
  const caption = item.dataset[captionKey] || item.dataset.caption || image.alt;

  lightboxImage.src = image.src;
  lightboxImage.alt = image.alt;
  lightboxCaption.textContent = caption;
  lightbox.classList.add("is-open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.classList.add("nav-open");
  lightboxClose.focus();
}

function closeLightbox() {
  lightbox.classList.remove("is-open");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.classList.remove("nav-open");
}

/* ── Form helpers ── */
function setStatus(form, message, type = "") {
  const status = form.querySelector(".form-status");

  if (!status) {
    return;
  }

  status.textContent = message;
  status.classList.remove("success", "error");

  if (type) {
    status.classList.add(type);
  }
}

function getLocalizedText(enText, knText) {
  return currentLang === "kn" ? knText : enText;
}

function setSubmitting(form, isSubmitting) {
  const button = form.querySelector('button[type="submit"]');
  const text = button.querySelector(".submit-text");

  if (!button.dataset.originalEn && text) {
    button.dataset.originalEn = text.getAttribute("data-en") || text.textContent.trim();
    button.dataset.originalKn = text.getAttribute("data-kn") || button.dataset.originalEn;
  }

  button.disabled = isSubmitting;
  button.classList.toggle("is-submitting", isSubmitting);

  const nextText = isSubmitting
    ? "Sending..."
    : getLocalizedText(button.dataset.originalEn, button.dataset.originalKn);

  if (text) {
    text.textContent = nextText;
  } else {
    button.textContent = nextText;
  }
}

function syncInvalidFields(form) {
  Array.from(form.elements).forEach((field) => {
    if (!field.willValidate) {
      return;
    }

    if (field.checkValidity()) {
      field.removeAttribute("aria-invalid");
    } else {
      field.setAttribute("aria-invalid", "true");
    }
  });
}

function clearInvalidFields(form) {
  Array.from(form.elements).forEach((field) => field.removeAttribute("aria-invalid"));
}

function validateForm(form) {
  if (form.checkValidity()) {
    syncInvalidFields(form);
    return true;
  }

  syncInvalidFields(form);
  form.reportValidity();
  const msg = currentLang === "kn"
    ? "ದಯವಿಟ್ಟು ಅಗತ್ಯ ಕ್ಷೇತ್ರಗಳನ್ನು ಪೂರ್ಣಗೊಳಿಸಿ."
    : "Please complete the required fields.";
  setStatus(form, msg, "error");
  return false;
}

function clearInvalidState(event) {
  const field = event.target;

  if (field.willValidate && field.checkValidity()) {
    field.removeAttribute("aria-invalid");
  }
}

let popupReturnFocus = null;

function showPopup(type, title, message) {
  if (!formPopup) {
    return;
  }

  popupReturnFocus = document.activeElement;
  formPopup.classList.remove("is-success", "is-error");
  formPopup.classList.add("is-open", `is-${type}`);
  formPopup.setAttribute("aria-hidden", "false");
  document.body.classList.add("popup-open");

  formPopupTitle.textContent = title;
  formPopupMessage.textContent = message;

  const closeButton = formPopup.querySelector(".form-popup-close");
  if (closeButton) {
    closeButton.focus();
  }
}

function closePopup() {
  if (!formPopup || !formPopup.classList.contains("is-open")) {
    return;
  }

  formPopup.classList.remove("is-open", "is-success", "is-error");
  formPopup.setAttribute("aria-hidden", "true");
  document.body.classList.remove("popup-open");

  if (popupReturnFocus && typeof popupReturnFocus.focus === "function") {
    popupReturnFocus.focus();
  }
}

async function handleInquirySubmit(event) {
  event.preventDefault();

  const form = event.currentTarget;

  if (!validateForm(form)) {
    return;
  }

  setSubmitting(form, true);
  setStatus(form, "Sending...");

  try {
    const response = await fetch(INQUIRY_SCRIPT_URL, {
      method: "POST",
      body: new FormData(form),
    });

    const result = await response.json();

    if (!response.ok || result.status === "error" || result.success === false) {
      throw new Error(result.message || "Unable to send inquiry.");
    }

    form.reset();
    clearInvalidFields(form);
    setStatus(form, "Inquiry sent successfully.", "success");
    showPopup(
      "success",
      "Inquiry Sent",
      "✅ Thank you for contacting Bag Hills!\n\nWe've received your inquiry successfully.\n\nOur team will get back to you soon.\n\nHave a wonderful day!"
    );
  } catch (error) {
    console.error("Inquiry submission failed:", error);
    const errorMessage = "Something went wrong.\nPlease try again.";
    setStatus(form, errorMessage, "error");
    showPopup("error", "Unable to Send", errorMessage);
  } finally {
    setSubmitting(form, false);
  }
}

/* ── Event listeners ── */
window.addEventListener("scroll", () => {
  updateHeader();
  updateHeroParallax();
});

navToggle.addEventListener("click", () => {
  setNavOpen(!navMenu.classList.contains("is-open"));
});

navLinks.forEach((link) => link.addEventListener("click", handleAnchorClick));

galleryItems.forEach((item) => {
  item.addEventListener("click", () => openLightbox(item));
});

lightboxClose.addEventListener("click", closeLightbox);

lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    setNavOpen(false);
    closeLightbox();
    closePopup();
  }
});

if (inquiryForm) {
  inquiryForm.addEventListener("submit", handleInquirySubmit);
  inquiryForm.addEventListener("input", clearInvalidState);
  inquiryForm.addEventListener("change", clearInvalidState);
}

formPopupCloseButtons.forEach((button) => {
  button.addEventListener("click", closePopup);
});

if (langToggle) {
  langToggle.addEventListener("click", toggleLanguage);
}

document.querySelector("#year").textContent = new Date().getFullYear();

updateHeader();
updateHeroParallax();
initRevealObserver();
