
/* =========================================================
   ROHENI — CONTACT PAGE NAVIGATION
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  const menuToggle = document.getElementById("menu-toggle");
  const mobileMenu = document.getElementById("mobile-menu");

  if (!menuToggle || !mobileMenu) return;


  const setMenuState = (isOpen) => {

    menuToggle.classList.toggle("is-active", isOpen);
    mobileMenu.classList.toggle("is-open", isOpen);

    menuToggle.setAttribute("aria-expanded", String(isOpen));

    menuToggle.setAttribute(
      "aria-label",
      isOpen ? "Close navigation menu" : "Open navigation menu"
    );

    mobileMenu.inert = !isOpen;

  };


  // Toggle the mobile navigation.

  menuToggle.addEventListener("click", () => {

    const isOpen =
      menuToggle.getAttribute("aria-expanded") === "true";

    setMenuState(!isOpen);

  });


  // Close the menu when a navigation link is selected.

  mobileMenu.querySelectorAll("a").forEach((link) => {

    link.addEventListener("click", () => {
      setMenuState(false);
    });

  });


  // Close the menu when clicking outside the header.

  document.addEventListener("click", (event) => {

    if (
      !event.target.closest("#site-header") &&
      menuToggle.getAttribute("aria-expanded") === "true"
    ) {
      setMenuState(false);
    }

  });


  // Close the menu with Escape.

  document.addEventListener("keydown", (event) => {

    if (
      event.key === "Escape" &&
      menuToggle.getAttribute("aria-expanded") === "true"
    ) {
      setMenuState(false);
      menuToggle.focus();
    }

  });


  // Close the mobile menu when returning to desktop width.

  window.addEventListener("resize", () => {

    if (window.innerWidth > 640) {
      setMenuState(false);
    }

  });

});



/* =========================================
   ROHENI — VERTICAL SCROLL PROGRESS
========================================= */

(() => {
  const progressBar = document.getElementById(
    "scroll-progress-fill"
  );

  if (!progressBar) return;

  let ticking = false;

  function updateScrollProgress() {
    const root = document.documentElement;

    const scrollableHeight =
      root.scrollHeight - window.innerHeight;

    const scrollPosition =
      window.scrollY || root.scrollTop;

    const progress =
      scrollableHeight > 0
        ? Math.min(
            1,
            Math.max(0, scrollPosition / scrollableHeight)
          )
        : 0;

    progressBar.style.transform = `scaleY(${progress})`;

    ticking = false;
  }

  function requestUpdate() {
    if (ticking) return;

    ticking = true;
    window.requestAnimationFrame(updateScrollProgress);
  }

  window.addEventListener("scroll", requestUpdate, {
    passive: true
  });

  window.addEventListener("resize", requestUpdate, {
    passive: true
  });

  window.addEventListener("load", requestUpdate);

  updateScrollProgress();
})();
