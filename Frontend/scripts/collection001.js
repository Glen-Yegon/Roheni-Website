
/* =========================================================
   ROHENI — COLLECTION 001
   Sticky Navigation + Mobile Menu + Lenis
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  const header = document.getElementById("site-header");
  const menuToggle = document.getElementById("menu-toggle");
  const mobileMenu = document.getElementById("mobile-menu");

  if (!header) return;


  /* =========================================
     1. STICKY GLASS NAVBAR
  ========================================= */

  let scrollPending = false;

  function updateHeader() {
    header.classList.toggle(
      "is-scrolled",
      window.scrollY > 24
    );

    scrollPending = false;
  }

  window.addEventListener(
    "scroll",
    () => {
      if (scrollPending) return;

      scrollPending = true;
      window.requestAnimationFrame(updateHeader);
    },
    { passive: true }
  );

  updateHeader();


  /* =========================================
     2. MOBILE MENU
  ========================================= */

  if (menuToggle && mobileMenu) {
    function closeMenu() {
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open menu");

      mobileMenu.classList.remove("is-open");
      mobileMenu.setAttribute("inert", "");

      document.body.classList.remove("menu-open");
    }

    function openMenu() {
      menuToggle.setAttribute("aria-expanded", "true");
      menuToggle.setAttribute("aria-label", "Close menu");

      mobileMenu.classList.add("is-open");
      mobileMenu.removeAttribute("inert");

      document.body.classList.add("menu-open");
    }

    menuToggle.addEventListener("click", () => {
      const isExpanded =
        menuToggle.getAttribute("aria-expanded") === "true";

      if (isExpanded) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    mobileMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", (event) => {
      if (
        event.key === "Escape" &&
        menuToggle.getAttribute("aria-expanded") === "true"
      ) {
        closeMenu();
        menuToggle.focus();
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 700) {
        closeMenu();
      }
    });
  }


  /* =========================================
     3. LENIS SMOOTH SCROLL
  ========================================= */

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (typeof window.Lenis === "function" && !reduceMotion) {
    const lenis = new window.Lenis({
      duration: 1.1,
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.1
    });

    function raf(time) {
      lenis.raf(time);
      window.requestAnimationFrame(raf);
    }

    window.requestAnimationFrame(raf);

    // Smooth-scroll only to anchors that exist on this page.
    document.querySelectorAll('a[href^="#"]').forEach((link) => {
      link.addEventListener("click", (event) => {
        const href = link.getAttribute("href");

        if (!href || href === "#") return;

        const target = document.querySelector(href);

        if (!target) return;

        event.preventDefault();

        lenis.scrollTo(target, {
          offset: -12,
          duration: 1.1
        });
      });
    });
  }
});



// =========================================================
// ROHENI — COLLECTION 001
// Editorial scroll reveal
// =========================================================

(() => {
  const initRoheniCollection = () => {
    const collection = document.querySelector(
      ".roheni-collection"
    );

    if (!collection) return;

    const revealItems = collection.querySelectorAll(
      "[data-reveal]"
    );

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // Keep everything visible if motion is reduced
    // or IntersectionObserver is unavailable.
    if (
      prefersReducedMotion ||
      !("IntersectionObserver" in window)
    ) {
      revealItems.forEach((item) => {
        item.classList.add("is-visible");
      });

      return;
    }

    // Enable reveal styling only when the observer is ready.
    collection.classList.add("reveal-ready");

    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -35px 0px"
      }
    );

    revealItems.forEach((item) => {
      revealObserver.observe(item);
    });
  };

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      initRoheniCollection,
      { once: true }
    );
  } else {
    initRoheniCollection();
  }
})();

/* =========================================================
   ROHENI — BRING IT BACK MODAL
========================================================= */

(() => {
  const initBringBackModal = () => {
    const modal = document.getElementById("bring-back-modal");
    const panel = modal?.querySelector(".bring-back-modal__panel");
    const openButton = document.getElementById("bring-back-open");
    const closeButtons = modal?.querySelectorAll("[data-modal-close]");
    const form = document.getElementById("bring-back-form");
    const status = document.getElementById("bring-back-status");
    const submitButton = form?.querySelector('[type="submit"]');

    if (!modal || !panel || !openButton || !form) return;

    let previousFocus = null;

    const openModal = () => {
      previousFocus = document.activeElement;

      modal.classList.add("is-open");
      modal.setAttribute("aria-hidden", "false");
      document.body.classList.add("bring-back-modal-open");

      window.requestAnimationFrame(() => {
        panel.focus();
      });
    };

    const closeModal = () => {
      modal.classList.remove("is-open");
      modal.setAttribute("aria-hidden", "true");
      document.body.classList.remove("bring-back-modal-open");

      if (previousFocus && typeof previousFocus.focus === "function") {
        previousFocus.focus();
      }
    };

    openButton.addEventListener("click", openModal);

    closeButtons?.forEach((button) => {
      button.addEventListener("click", closeModal);
    });

    document.addEventListener("keydown", (event) => {
      if (!modal.classList.contains("is-open")) return;

      if (event.key === "Escape") {
        closeModal();
        return;
      }

      if (event.key !== "Tab") return;

      const focusable = [
        ...panel.querySelectorAll(
          'a[href], button:not(:disabled), input:not(:disabled), textarea:not(:disabled), select:not(:disabled), [tabindex]:not([tabindex="-1"])'
        ),
      ].filter((element) => element.getClientRects().length > 0);

      if (!focusable.length) {
        event.preventDefault();
        panel.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });

    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      if (!form.reportValidity()) return;

      status.textContent = "";
      submitButton.disabled = true;
      submitButton.querySelector("span:first-child").textContent = "SENDING...";

      try {
        const response = await fetch(form.dataset.endpoint || "", {
          method: "POST",
          body: new FormData(form),
          headers: { Accept: "application/json" },
        });

        if (!form.dataset.endpoint) {
          throw new Error("Please configure the form submission endpoint.");
        }

        if (!response.ok) {
          throw new Error("The request could not be sent.");
        }

        form.reset();
        status.textContent = "Thank you. Your request has been sent.";
      } catch (error) {
        status.textContent =
          "We couldn't send your request just now. Please try again shortly.";
      } finally {
        submitButton.disabled = false;
        submitButton.querySelector("span:first-child").textContent =
          "SEND MY REQUEST";
      }
    });
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initBringBackModal);
  } else {
    initBringBackModal();
  }
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

const piece = event.currentTarget.dataset.piece;

if (piece && bringBackForm) {
  const pieceField = bringBackForm.querySelector(
    '[name="piece"], #bring-back-piece'
  );

  if (pieceField) {
    pieceField.value = piece;
  }
}