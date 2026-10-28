/* =========================================================
   ROHENI — CUSTOM PIECES
   Navigation + Enquiry Form + Scroll Progress
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  /* =========================
     1. ELEMENTS
  ========================== */

  const header = document.getElementById("site-header");
  const menuToggle = document.getElementById("menu-toggle");
  const mobileMenu = document.getElementById("mobile-menu");
  const menuClose = document.getElementById("mobile-menu-close");

  const form = document.getElementById("custom-form");
  const submitButton = document.getElementById("submit-button");
  const formStatus = document.getElementById("form-status");

  const referenceInput = document.getElementById("reference-images");
  const fileList = document.getElementById("file-list");

  const description = document.getElementById("idea-description");
  const characterCount = document.getElementById("character-count");

  const yearElement = document.getElementById("current-year");

  /*
    IMPORTANT:
    Add your real form endpoint here before publishing.

    Example Formspree endpoint:
    https://formspree.io/f/YOUR_FORM_ID

    Leave empty until you have configured the service.
  */

  const FORM_ENDPOINT = "";

  const MAX_FILES = 5;
  const MAX_FILE_SIZE = 5 * 1024 * 1024;
  const MAX_DESCRIPTION_LENGTH = 1200;

  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp"
  ];


  /* =========================
     2. CURRENT YEAR
  ========================== */

  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }


  /* =========================
     3. GLASS NAVBAR ON SCROLL
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
     4. FULL-SCREEN MOBILE MENU
  ========================== */

  if (header && menuToggle && mobileMenu && menuClose) {
    const mobileLinks = mobileMenu.querySelectorAll("a");
    const mobileBreakpoint = window.matchMedia("(max-width: 900px)");

    // Establish the initial state.
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

    menuToggle.addEventListener("click", () => {
      const isOpen =
        menuToggle.getAttribute("aria-expanded") === "true";

      if (isOpen) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });

    menuClose.addEventListener("click", () => {
      closeMobileMenu();
    });

    mobileLinks.forEach((link) => {
      link.addEventListener("click", () => {
        closeMobileMenu(false);
      });
    });

    document.addEventListener("keydown", (event) => {
      if (
        event.key === "Escape" &&
        header.classList.contains("menu-open")
      ) {
        closeMobileMenu();
      }
    });

    mobileBreakpoint.addEventListener("change", (event) => {
      if (!event.matches && header.classList.contains("menu-open")) {
        closeMobileMenu(false);
      }
    });
  }


  /* =========================
     5. SCROLL PROGRESS
  ========================== */

  const progressBar = document.getElementById(
    "scroll-progress-fill"
  );

  if (progressBar) {
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

    if ("ResizeObserver" in window) {
      const observer = new ResizeObserver(requestUpdate);
      observer.observe(document.documentElement);
    }

    updateScrollProgress();
  }


  /* =========================
     6. FORM UTILITIES
  ========================== */

  if (!form || !submitButton || !formStatus) {
    return;
  }

  const nameInput = document.getElementById("customer-name");
  const emailInput = document.getElementById("customer-email");
  const garmentInput = document.getElementById("garment-type");

  const nameError = document.getElementById("name-error");
  const emailError = document.getElementById("email-error");
  const garmentError = document.getElementById("garment-error");
  const descriptionError = document.getElementById("description-error");
  const filesError = document.getElementById("files-error");

  const submitText = submitButton.querySelector(
    ".submit-button__text"
  );

  let selectedFiles = [];

  function showStatus(message, type = "error") {
    formStatus.textContent = message;

    formStatus.className =
      `form-status is-visible is-${type}`;
  }

  function clearStatus() {
    formStatus.textContent = "";
    formStatus.className = "form-status";
  }

  function setError(input, errorElement, message) {
    if (input) {
      input.setAttribute("aria-invalid", "true");
    }

    if (errorElement) {
      errorElement.textContent = message;
    }
  }

  function clearError(input, errorElement) {
    if (input) {
      input.removeAttribute("aria-invalid");
    }

    if (errorElement) {
      errorElement.textContent = "";
    }
  }

  function validateEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
  }

  function formatFileSize(bytes) {
    return bytes < 1024 * 1024
      ? `${Math.ceil(bytes / 1024)} KB`
      : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }


  /* =========================
     7. CHARACTER COUNT
  ========================== */

  if (description && characterCount) {
    function updateCharacterCount() {
      const length = description.value.length;

      characterCount.textContent =
        `${length} / ${MAX_DESCRIPTION_LENGTH}`;

      characterCount.style.color =
        length > MAX_DESCRIPTION_LENGTH
          ? "var(--custom-accent)"
          : "";
    }

    description.addEventListener("input", updateCharacterCount);

    updateCharacterCount();
  }


  /* =========================
     8. DATE VALIDATION
  ========================== */

  const neededBy = document.getElementById("needed-by");

  if (neededBy) {
    const today = new Date();
    const localDate = [
      today.getFullYear(),
      String(today.getMonth() + 1).padStart(2, "0"),
      String(today.getDate()).padStart(2, "0")
    ].join("-");

    neededBy.min = localDate;
  }


  /* =========================
     9. FILE UPLOADS
  ========================== */

  function syncFileInput() {
    if (!referenceInput || !("DataTransfer" in window)) {
      return;
    }

    const transfer = new DataTransfer();

    selectedFiles.forEach((file) => {
      transfer.items.add(file);
    });

    referenceInput.files = transfer.files;
  }

  function renderFiles() {
    if (!fileList) return;

    fileList.replaceChildren();

    selectedFiles.forEach((file, index) => {
      const item = document.createElement("div");
      item.className = "file-list__item";

      const name = document.createElement("span");
      name.className = "file-list__name";
      name.textContent =
        `${file.name} · ${formatFileSize(file.size)}`;

      const removeButton = document.createElement("button");
      removeButton.className = "file-list__remove";
      removeButton.type = "button";
      removeButton.textContent = "Remove";
      removeButton.setAttribute(
        "aria-label",
        `Remove ${file.name}`
      );

      removeButton.addEventListener("click", () => {
        selectedFiles.splice(index, 1);

        syncFileInput();
        renderFiles();
        clearError(referenceInput, filesError);
        clearStatus();
      });

      item.append(name, removeButton);
      fileList.appendChild(item);
    });
  }

  if (referenceInput) {
    referenceInput.addEventListener("change", () => {
      clearStatus();
      clearError(referenceInput, filesError);

      const incomingFiles = Array.from(referenceInput.files || []);
      const existingFiles = [...selectedFiles];

      let errorMessage = "";

      for (const file of incomingFiles) {
        if (existingFiles.some((existing) =>
          existing.name === file.name &&
          existing.size === file.size &&
          existing.lastModified === file.lastModified
        )) {
          continue;
        }

        if (!allowedTypes.includes(file.type)) {
          errorMessage =
            "Please upload JPG, PNG or WEBP images only.";
          break;
        }

        if (file.size > MAX_FILE_SIZE) {
          errorMessage =
            `${file.name} is larger than 5 MB. Choose a smaller image.`;
          break;
        }

        if (existingFiles.length >= MAX_FILES) {
          errorMessage = "You can upload a maximum of 5 images.";
          break;
        }

        existingFiles.push(file);
      }

      if (errorMessage) {
        setError(referenceInput, filesError, errorMessage);
      } else {
        selectedFiles = existingFiles;
      }

      syncFileInput();
      renderFiles();

      // Allows selecting the same file again after removal.
      referenceInput.value = "";
    });
  }


  /* =========================
     10. FIELD VALIDATION
  ========================== */

  function validateForm() {
    let firstInvalidField = null;

    clearStatus();

    const fields = [
      [nameInput, nameError],
      [emailInput, emailError],
      [garmentInput, garmentError],
      [description, descriptionError]
    ];

    fields.forEach(([input, errorElement]) => {
      clearError(input, errorElement);
    });

    if (referenceInput) {
      clearError(referenceInput, filesError);
    }

    if (!nameInput.value.trim()) {
      setError(
        nameInput,
        nameError,
        "Please enter your name."
      );

      firstInvalidField ||= nameInput;
    }

    if (!emailInput.value.trim()) {
      setError(
        emailInput,
        emailError,
        "Please enter your email address."
      );

      firstInvalidField ||= emailInput;
    } else if (!validateEmail(emailInput.value)) {
      setError(
        emailInput,
        emailError,
        "Please enter a valid email address."
      );

      firstInvalidField ||= emailInput;
    }

    if (!garmentInput.value) {
      setError(
        garmentInput,
        garmentError,
        "Please select the type of garment."
      );

      firstInvalidField ||= garmentInput;
    }

    const idea = description.value.trim();

    if (!idea) {
      setError(
        description,
        descriptionError,
        "Please tell us a little about your idea."
      );

      firstInvalidField ||= description;
    } else if (idea.length < 10) {
      setError(
        description,
        descriptionError,
        "Please add a little more detail (at least 10 characters)."
      );

      firstInvalidField ||= description;
    } else if (idea.length > MAX_DESCRIPTION_LENGTH) {
      setError(
        description,
        descriptionError,
        `Please keep your description under ${MAX_DESCRIPTION_LENGTH} characters.`
      );

      firstInvalidField ||= description;
    }

    if (neededBy && neededBy.value) {
      const today = new Date();
      const localDate = [
        today.getFullYear(),
        String(today.getMonth() + 1).padStart(2, "0"),
        String(today.getDate()).padStart(2, "0")
      ].join("-");

      if (neededBy.value < localDate) {
        setError(
          neededBy,
          neededBy.nextElementSibling,
          "Please select today or a future date."
        );

        firstInvalidField ||= neededBy;
      }
    }

    if (firstInvalidField) {
      showStatus(
        "A few details need your attention. Please check the highlighted fields."
      );

      firstInvalidField.focus();

      firstInvalidField.scrollIntoView({
        behavior: window.matchMedia(
          "(prefers-reduced-motion: reduce)"
        ).matches ? "auto" : "smooth",
        block: "center"
      });

      return false;
    }

    return true;
  }


  /* =========================
     11. CLEAR ERRORS AS USER TYPES
  ========================== */

  [
    [nameInput, nameError],
    [emailInput, emailError],
    [garmentInput, garmentError],
    [description, descriptionError]
  ].forEach(([input, errorElement]) => {
    if (!input) return;

    const eventName =
      input.tagName === "SELECT" ? "change" : "input";

    input.addEventListener(eventName, () => {
      clearError(input, errorElement);
      clearStatus();
    });
  });


  /* =========================
     12. FORM SUBMISSION
  ========================== */

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    /*
      Do not report success unless an actual service
      accepts the enquiry.
    */

    if (!FORM_ENDPOINT.trim()) {
      showStatus(
        "The form is ready, but it hasn't been connected to an enquiry service yet. Connect your form endpoint before accepting submissions.",
        "error"
      );

      formStatus.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });

      formStatus.focus();

      return;
    }

    const originalButtonText = submitText
      ? submitText.textContent
      : "Send enquiry";

    submitButton.disabled = true;

    if (submitText) {
      submitText.textContent = "Sending enquiry...";
    }

    clearStatus();

    try {
      const formData = new FormData(form);

      // Ensure the current selected files are included.
      if (referenceInput) {
        formData.delete("references");

        selectedFiles.forEach((file) => {
          formData.append("references", file);
        });
      }

      const response = await fetch(FORM_ENDPOINT, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json"
        }
      });

      if (!response.ok) {
        throw new Error("The enquiry could not be submitted.");
      }

      showStatus(
        "Thank you for reaching out to ROHENI. Your enquiry has been submitted successfully. We'll be in touch using the email address you provided.",
        "success"
      );

      form.reset();

      selectedFiles = [];
      renderFiles();

      if (characterCount && description) {
        characterCount.textContent = "0 / 1200";
      }

      if (referenceInput) {
        referenceInput.value = "";
      }

      if (neededBy) {
        const today = new Date();

        neededBy.min = [
          today.getFullYear(),
          String(today.getMonth() + 1).padStart(2, "0"),
          String(today.getDate()).padStart(2, "0")
        ].join("-");
      }

      formStatus.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });

      formStatus.focus();

    } catch (error) {
      console.error("ROHENI enquiry submission failed:", error);

      showStatus(
        "We couldn't submit your enquiry just now. Please try again in a moment."
      );

    } finally {
      submitButton.disabled = false;

      if (submitText) {
        submitText.textContent = originalButtonText;
      }
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

  // Recalculate if page content changes size.
  if ("ResizeObserver" in window) {
    const observer = new ResizeObserver(requestUpdate);
    observer.observe(document.documentElement);
  }

  updateScrollProgress();
})();