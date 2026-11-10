const root = document.documentElement;
const themeToggle = document.querySelector(".theme-toggle");
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const contactForm = document.querySelector(".contact-form");

function setTheme(theme) {
  root.dataset.theme = theme;
  themeToggle.setAttribute("aria-label", `Switch to ${theme === "light" ? "dark" : "light"} theme`);
  themeToggle.setAttribute("aria-pressed", String(theme === "light"));
  themeToggle.querySelector(".theme-label").textContent = theme === "light" ? "Light" : "Dark";
  document.querySelector('meta[name="theme-color"]').content = theme === "light" ? "#f8fafc" : "#101410";
}

let savedTheme = null;
try {
  savedTheme = localStorage.getItem("portfolio-theme-v2");
} catch (error) {
  console.warn("Theme preference could not be loaded from local storage.", error);
}
setTheme(savedTheme === "light" || savedTheme === "dark" ? savedTheme : "light");

themeToggle.addEventListener("click", () => {
  const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
  setTheme(nextTheme);
  try {
    localStorage.setItem("portfolio-theme-v2", nextTheme);
  } catch (error) {
    console.warn("Theme preference could not be saved to local storage.", error);
  }
});

menuToggle.addEventListener("click", () => {
  const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isExpanded));
  menuToggle.setAttribute("aria-label", isExpanded ? "Open menu" : "Close menu");
  navLinks.classList.toggle("is-open", !isExpanded);
});

navLinks.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", () => {
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open menu");
    navLinks.classList.remove("is-open");
    navLinks.querySelectorAll(".nav-link").forEach((item) => item.classList.remove("active"));
    link.classList.add("active");
  });
});

const revealElements = document.querySelectorAll(".section-heading, .about-copy, .fact-card, .service-card, .project-card, .skill-group, .contact-panel");
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        currentObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealElements.forEach((element) => {
    element.classList.add("reveal");
    observer.observe(element);
  });
}

document.querySelector("#year").textContent = new Date().getFullYear();

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!contactForm.reportValidity()) return;

  // Replace this address with your preferred email before publishing.
  const destination = "YOUR_EMAIL@example.com";
  if (destination.includes("YOUR_EMAIL")) {
    contactForm.querySelector(".form-note").textContent = "Please replace YOUR_EMAIL@example.com in script.js with your email address to enable sending.";
    return;
  }

  const formData = new FormData(contactForm);
  const subject = encodeURIComponent(formData.get("subject"));
  const body = encodeURIComponent(
    `Name: ${formData.get("name")}\nEmail: ${formData.get("email")}\n\n${formData.get("message")}`,
  );
  window.location.href = `mailto:${destination}?subject=${subject}&body=${body}`;
});
