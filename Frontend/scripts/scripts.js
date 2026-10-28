/* =========================================================
   ROHENI — NAVIGATION INTERACTIONS
   Glass navbar + Full-screen mobile menu
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  const header = document.getElementById("site-header");
  const menuToggle = document.getElementById("menu-toggle");
  const mobileMenu = document.getElementById("mobile-menu");
  const menuClose = document.getElementById("mobile-menu-close");

  const mobileBreakpoint = window.matchMedia("(max-width: 900px)");

  /* =========================
     GLASS NAVBAR ON SCROLL
  ========================== */

  if (header) {
    const updateHeader = () => {
      header.classList.toggle("is-scrolled", window.scrollY > 30);
    };

    updateHeader();

    window.addEventListener("scroll", updateHeader, {
      passive: true
    });
  }

  /* =========================
     FULL-SCREEN MOBILE MENU
  ========================== */

  if (!header || !menuToggle || !mobileMenu || !menuClose) {
    return;
  }

  const mobileLinks = mobileMenu.querySelectorAll("a");

  // Ensure the menu starts closed.
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation menu");

  mobileMenu.setAttribute("aria-hidden", "true");
  mobileMenu.setAttribute("inert", "");

  function openMobileMenu() {
    header.classList.add("menu-open");
    document.body.classList.add("menu-open");

    menuToggle.classList.add("is-active");
    menuToggle.setAttribute("aria-expanded", "true");
    menuToggle.setAttribute("aria-label", "Close navigation menu");

    mobileMenu.setAttribute("aria-hidden", "false");
    mobileMenu.removeAttribute("inert");

    menuClose.focus();
  }

  function closeMobileMenu(returnFocus = true) {
    header.classList.remove("menu-open");
    document.body.classList.remove("menu-open");

    menuToggle.classList.remove("is-active");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation menu");

    mobileMenu.setAttribute("aria-hidden", "true");
    mobileMenu.setAttribute("inert", "");

    if (returnFocus) {
      menuToggle.focus();
    }
  }

  /* =========================
     OPEN / CLOSE BUTTON
  ========================== */

  menuToggle.addEventListener("click", () => {
    const isOpen =
      menuToggle.getAttribute("aria-expanded") === "true";

    if (isOpen) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  });

  /* =========================
     CLOSE BUTTON (X)
  ========================== */

  menuClose.addEventListener("click", () => {
    closeMobileMenu();
  });

  /* =========================
     CLOSE AFTER NAVIGATION
  ========================== */

  mobileLinks.forEach((link) => {
    link.addEventListener("click", () => {
      closeMobileMenu(false);
    });
  });

  /* =========================
     CLOSE ON ESCAPE
  ========================== */

  document.addEventListener("keydown", (event) => {
    if (
      event.key === "Escape" &&
      header.classList.contains("menu-open")
    ) {
      closeMobileMenu();
    }
  });

  /* =========================
     CLOSE WHEN RESIZING
     BACK TO DESKTOP
  ========================== */

  mobileBreakpoint.addEventListener("change", (event) => {
    if (!event.matches && header.classList.contains("menu-open")) {
      closeMobileMenu(false);
    }
  });
});


/* =========================================
   ROHENI — SIMULTANEOUS LETTER SHUFFLE
========================================= */

document.addEventListener("DOMContentLoaded", () => {
  const title = document.querySelector(".scramble-title");

  if (!title) return;

  const finalText = "Collection 002 Available.";
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

  const duration = 1000;
  const interval = 50;

  title.setAttribute("aria-label", finalText);
  title.setAttribute("aria-live", "off");

  // Create a span for every character.
  const letters = Array.from(finalText, (character) => {
    const span = document.createElement("span");

    span.className = "scramble-char";
    span.setAttribute("aria-hidden", "true");

    if (character === " ") {
      span.classList.add("scramble-space");
      span.innerHTML = "&nbsp;";
    } else if (character === ".") {
      span.classList.add("period");
      span.textContent = ".";
    } else {
      span.textContent = character;
    }

    return {
      span,
      character
    };
  });

  title.replaceChildren(
    ...letters.map(({ span }) => span)
  );

  // Shuffle all characters simultaneously.
  const shuffle = window.setInterval(() => {
    letters.forEach(({ span, character }) => {
      if (character === " " || character === ".") return;

      span.textContent =
        characters[Math.floor(Math.random() * characters.length)];
    });
  }, interval);

  // Settle all characters on the final text.
  window.setTimeout(() => {
    window.clearInterval(shuffle);

    letters.forEach(({ span, character }) => {
      span.textContent = character === " " ? "\u00A0" : character;
    });
  }, duration);
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

  // Recalculate if page content changes size.
  if ("ResizeObserver" in window) {
    const observer = new ResizeObserver(requestUpdate);
    observer.observe(document.documentElement);
  }

  updateScrollProgress();
})();