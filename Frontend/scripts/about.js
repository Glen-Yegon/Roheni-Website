
/* =========================================================
   ROHENI — ABOUT PAGE
   Mobile navigation
========================================================= */

(() => {
  "use strict";

  const menuToggle = document.getElementById("menu-toggle");
  const mobileMenu = document.getElementById("mobile-menu");

  if (!menuToggle || !mobileMenu) return;

  const openMenu = () => {
    mobileMenu.inert = false;
    mobileMenu.classList.add("is-open");

    menuToggle.setAttribute("aria-expanded", "true");
    menuToggle.setAttribute("aria-label", "Close menu");
  };

  const closeMenu = () => {
    mobileMenu.classList.remove("is-open");

    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open menu");

    mobileMenu.inert = true;
  };

  menuToggle.addEventListener("click", () => {
    const isOpen =
      menuToggle.getAttribute("aria-expanded") === "true";

    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
      menuToggle.focus();
    }
  });

  document.addEventListener("click", (event) => {
    const clickedInsideMenu = mobileMenu.contains(event.target);
    const clickedToggle = menuToggle.contains(event.target);

    if (!clickedInsideMenu && !clickedToggle) {
      closeMenu();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 767) {
      closeMenu();
    }
  });
})();




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
