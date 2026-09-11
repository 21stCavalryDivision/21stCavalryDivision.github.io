/* ==========================================================
   21ST CAVALRY DIVISION — MOBILE NAV FIX v2

   IMPORTANT:
   The site's main script.js already owns the hamburger click event.
   The old mobile.js added a SECOND click listener on some pages, which
   toggled the menu twice and made it appear impossible to close.

   v2 does NOT add another hamburger click handler.
   It only adds safe close/accessibility helpers.
   ========================================================== */

(() => {
    "use strict";

    const toggle =
        document.querySelector(".nav-toggle");

    const nav =
        document.querySelector(".main-nav");

    if (!toggle || !nav) {
        return;
    }

    function closeMobileNav() {
        nav.classList.remove("open");
        toggle.setAttribute(
            "aria-expanded",
            "false"
        );
    }

    /* Make sure the menu starts collapsed on phone/tablet. */
    if (window.innerWidth <= 900) {
        closeMobileNav();
    }

    /* Close after choosing a page. */
    nav
        .querySelectorAll("a")
        .forEach(link => {
            link.addEventListener(
                "click",
                closeMobileNav
            );
        });

    /* Escape closes menu. */
    document.addEventListener(
        "keydown",
        event => {
            if (event.key === "Escape") {
                closeMobileNav();
            }
        }
    );

    /* Returning to desktop must clear the mobile open state. */
    window.addEventListener(
        "resize",
        () => {
            if (window.innerWidth > 900) {
                closeMobileNav();
            }
        }
    );

    /*
       If the page is restored from Safari's back/forward cache,
       force the phone menu closed instead of restoring an old open state.
    */
    window.addEventListener(
        "pageshow",
        () => {
            if (window.innerWidth <= 900) {
                closeMobileNav();
            }
        }
    );
})();
