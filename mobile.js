/* ==========================================================
   21ST CAVALRY DIVISION — MOBILE NAV HELPER v1
   Only adds toggle behavior on pages that do not already have
   the standard navToggle/mainNav IDs.
   ========================================================== */

(() => {
    "use strict";

    const toggle = document.querySelector(".nav-toggle");
    const nav = document.querySelector(".main-nav");

    if (!toggle || !nav) return;

    /*
      Most Command Center pages already have their own nav handler.
      If both standard IDs exist, leave that existing JavaScript alone.
    */
    const pageAlreadyOwnsToggle =
        toggle.id === "navToggle" &&
        nav.id === "mainNav";

    if (!pageAlreadyOwnsToggle) {
        if (!toggle.id) toggle.id = "mobileNavToggle";
        if (!nav.id) nav.id = "mobileMainNav";

        toggle.addEventListener("click", () => {
            const open = nav.classList.toggle("open");
            toggle.setAttribute("aria-expanded", String(open));
        });
    }

    /* Closing helpers are safe even on pages with their own toggle code. */
    nav.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => {
            nav.classList.remove("open");
            toggle.setAttribute("aria-expanded", "false");
        });
    });

    document.addEventListener("keydown", event => {
        if (event.key === "Escape") {
            nav.classList.remove("open");
            toggle.setAttribute("aria-expanded", "false");
        }
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 900) {
            nav.classList.remove("open");
            toggle.setAttribute("aria-expanded", "false");
        }
    });
})();
