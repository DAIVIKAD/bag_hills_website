/* ── Configuration ── */
const scriptURL = "https://script.google.com/macros/s/AKfycbz5I9PEO04JtZAmPm4pM2ACLcXOwSW80VI7d9CIx75LfnlwKbhyzGOtf-xzbyjsiWXDvA/exec";
const FEEDBACK_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwHKPnX58MHGReVDpeeca8FMmIvc1KwmM-Dwa7iyoft/exec";

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
const contactForm = document.forms["submit-to-google-sheet"];
const feedbackForm = document.querySelector("#feedback-form");
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
function getFieldValue(form, name) {
  const field = form.elements[name];
  return field ? field.value.trim() : "";
}

function setStatus(form, message, type = "") {
  const status = form.querySelector(".form-status");
  status.textContent = message;
  status.classList.remove("success", "error");

  if (type) {
    status.classList.add(type);
  }
}

function setSubmitting(form, isSubmitting, loadingText) {
  const button = form.querySelector('button[type="submit"]');

  if (!button.dataset.originalText) {
    button.dataset.originalText = button.textContent;
  }

  button.disabled = isSubmitting;
  button.textContent = isSubmitting ? loadingText : button.dataset.originalText;
}

function validateForm(form) {
  if (form.checkValidity()) {
    return true;
  }

  form.reportValidity();
  const msg = currentLang === "kn"
    ? "ದಯವಿಟ್ಟು ಅಗತ್ಯ ಕ್ಷೇತ್ರಗಳನ್ನು ಪೂರ್ಣಗೊಳಿಸಿ."
    : "Please complete the required fields.";
  setStatus(form, msg, "error");
  return false;
}

function isScriptConfigured() {
  return (
    FEEDBACK_SCRIPT_URL &&
    !FEEDBACK_SCRIPT_URL.includes("PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE") &&
    FEEDBACK_SCRIPT_URL.includes("script.google.com")
  );
}

/* ── Contact form submission ── */
function submitContactToGoogleSheet(form) {
  if (!validateForm(form)) {
    return Promise.resolve();
  }

  const loadingText = currentLang === "kn" ? "ಕಳುಹಿಸಲಾಗುತ್ತಿದೆ..." : "Sending...";
  setSubmitting(form, true, loadingText);
  setStatus(form, loadingText);

  return fetch(scriptURL, {
      method: "POST",
      body: new FormData(form),
    })
    .then(() => {
      form.reset();
      setStatus(form, "Message Sent Successfully", "success");
      window.setTimeout(() => {
        const status = form.querySelector(".form-status");
        if (status.textContent === "Message Sent Successfully") {
          setStatus(form, "");
        }
      }, 4000);
    })
    .catch((error) => {
      console.error("Error!", error.message);
      const errorMessage = currentLang === "kn"
        ? "ಸಂದೇಶವನ್ನು ಕಳುಹಿಸಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ."
        : "Unable to send your message. Please try again.";
      setStatus(form, errorMessage, "error");
    })
    .finally(() => {
      setSubmitting(form, false, loadingText);
    });
}

/* ── Form submission ── */
async function submitToGoogleSheet(form, payload, loadingText) {
  if (!validateForm(form)) {
    return;
  }

  if (!isScriptConfigured()) {
    const msg = currentLang === "kn"
      ? "Google Apps Script URL ಇನ್ನೂ ಕಾನ್ಫಿಗರ್ ಆಗಿಲ್ಲ. script.js ನಲ್ಲಿ SCRIPT_URL ಅನ್ನು ಬದಲಿಸಿ."
      : "Google Apps Script URL is not configured yet. Replace SCRIPT_URL in script.js.";
    setStatus(form, msg, "error");
    return;
  }

  setSubmitting(form, true, loadingText);
  const savingMsg = currentLang === "kn" ? "ನಿಮ್ಮ ಪ್ರತಿಕ್ರಿಯೆ ಉಳಿಸಲಾಗುತ್ತಿದೆ..." : "Saving your response...";
  setStatus(form, savingMsg);

  try {
    // Use no-cors mode to avoid CORS issues with Google Apps Script
    // Google Apps Script doesn't support CORS preflight for POST with JSON content-type
    const response = await fetch(FEEDBACK_SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "text/plain",
      },
      body: JSON.stringify(payload),
    });

    // With no-cors mode, we can't read the response body
    // But we know the request was sent. 
    // If the response is opaque (no-cors), we assume success.
    // If it's a regular response, check normally.
    if (response.type === "opaque") {
      form.reset();
      const successMsg = currentLang === "kn"
        ? "ಧನ್ಯವಾದ. ನಿಮ್ಮ ಪ್ರತಿಕ್ರಿಯೆ ಉಳಿಸಲಾಗಿದೆ."
        : "Thank you. Your response has been saved.";
      setStatus(form, successMsg, "success");
    } else {
      const result = await response.json();

      if (!response.ok || result.status === "error" || result.success === false) {
        throw new Error(result.message || "Unable to save the response.");
      }

      form.reset();
      const successMsg = currentLang === "kn"
        ? "ಧನ್ಯವಾದ. ನಿಮ್ಮ ಪ್ರತಿಕ್ರಿಯೆ ಉಳಿಸಲಾಗಿದೆ."
        : "Thank you. Your response has been saved.";
      setStatus(form, successMsg, "success");
    }
  } catch (error) {
    // If error is a network/opaque error from no-cors, it likely still worked
    if (error.message === "Failed to fetch" || error.name === "TypeError") {
      // Likely CORS issue — try an alternative approach using a form submit
      try {
        await submitViaFormData(form, payload, loadingText);
      } catch (fallbackError) {
        const errMsg = currentLang === "kn"
          ? "ಏನೋ ತಪ್ಪಾಗಿದೆ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ."
          : "Something went wrong. Please try again.";
        setStatus(form, errMsg, "error");
      }
    } else {
      const errMsg = currentLang === "kn"
        ? (error.message || "ಏನೋ ತಪ್ಪಾಗಿದೆ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.")
        : (error.message || "Something went wrong. Please try again.");
      setStatus(form, errMsg, "error");
    }
  } finally {
    setSubmitting(form, false, loadingText);
  }
}

/* ── Fallback submission via form-urlencoded ── */
async function submitViaFormData(form, payload, loadingText) {
  const formData = new URLSearchParams();
  for (const [key, value] of Object.entries(payload)) {
    formData.append(key, value);
  }

  const response = await fetch(FEEDBACK_SCRIPT_URL, {
    method: "POST",
    mode: "no-cors",
    body: formData,
  });

  // With no-cors, response will be opaque
  form.reset();
  const successMsg = currentLang === "kn"
    ? "ಧನ್ಯವಾದ. ನಿಮ್ಮ ಪ್ರತಿಕ್ರಿಯೆ ಉಳಿಸಲಾಗಿದೆ."
    : "Thank you. Your response has been saved.";
  setStatus(form, successMsg, "success");
}

/* ── Contact form handler ── */
async function handleContactSubmit(event) {
  event.preventDefault();
  await submitContactToGoogleSheet(event.currentTarget);
}

/* ── Feedback form handler ── */
async function handleFeedbackSubmit(event) {
  event.preventDefault();

  const form = event.currentTarget;
  const payload = {
    formType: "feedback",
    name: getFieldValue(form, "name"),
    place: getFieldValue(form, "place"),
    rating: getFieldValue(form, "rating"),
    feedback: getFieldValue(form, "feedback"),
  };

  const loadingMsg = currentLang === "kn" ? "ಹಂಚಿಕೊಳ್ಳಲಾಗುತ್ತಿದೆ..." : "Sharing...";
  await submitToGoogleSheet(form, payload, loadingMsg);
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
  }
});

contactForm.addEventListener("submit", handleContactSubmit);
feedbackForm.addEventListener("submit", handleFeedbackSubmit);

if (langToggle) {
  langToggle.addEventListener("click", toggleLanguage);
}

document.querySelector("#year").textContent = new Date().getFullYear();

updateHeader();
updateHeroParallax();
initRevealObserver();
