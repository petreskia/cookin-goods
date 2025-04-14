// document.addEventListener("DOMContentLoaded", () => {
//   // ===== Performance Utilities =====
//   function debounce(func, wait = 20, immediate = true) {
//     let timeout;
//     return function () {
//       const context = this,
//         args = arguments;
//       const later = function () {
//         timeout = null;
//         if (!immediate) func.apply(context, args);
//       };
//       const callNow = immediate && !timeout;
//       clearTimeout(timeout);
//       timeout = setTimeout(later, wait);
//       if (callNow) func.apply(context, args);
//     };
//   }

//   // ===== Project Sliders Enhancement =====
//   const sliders = document.querySelectorAll(".projects-slider");

//   function getScrollAmount() {
//     if (window.innerWidth <= 576) {
//       return 277; // Width of project-img on mobile
//     } else if (window.innerWidth <= 768) {
//       return 350;
//     } else if (window.innerWidth <= 992) {
//       return 400;
//     } else {
//       return 453;
//     }
//   }

//   sliders.forEach((slider) => {
//     let isDragging = false;
//     let startX = 0;
//     let scrollLeft = 0;
//     let initialMargin = "";
//     let lastTouchTime = 0;
//     let lastClickTime = 0;
//     let startY = 0; // Track vertical touch position
//     let isScrollingHorizontally = false;

//     // Check if we're on mobile/tablet
//     const isMobileOrTablet = window.innerWidth < 992;

//     slider.setAttribute("role", "region");
//     slider.setAttribute("aria-label", "Project images carousel");

//     if (window.innerWidth >= 1440) {
//       initialMargin = window.getComputedStyle(slider).marginLeft;
//     }

//     // Modified touch event handlers to allow vertical scrolling
//     slider.addEventListener(
//       "touchstart",
//       (e) => {
//         isDragging = true;
//         startX = e.touches[0].pageX - slider.offsetLeft;
//         startY = e.touches[0].pageY; // Track vertical position
//         scrollLeft = slider.scrollLeft;
//         slider.style.scrollBehavior = "auto";
//         lastTouchTime = Date.now();
//         isScrollingHorizontally = false; // Reset direction detection
//       },
//       { passive: true }
//     );

//     slider.addEventListener("touchend", () => {
//       isDragging = false;
//       slider.style.scrollBehavior = "smooth";

//       // Only snap to grid on desktop, not on mobile/tablet
//       if (!isMobileOrTablet) {
//         const scrollAmount = getScrollAmount();
//         const remainder = slider.scrollLeft % scrollAmount;

//         if (remainder > scrollAmount / 2) {
//           slider.scrollLeft += scrollAmount - remainder;
//         } else {
//           slider.scrollLeft -= remainder;
//         }
//       }
//     });

//     let lastMoveTime = 0;

//     slider.addEventListener(
//       "touchmove",
//       (e) => {
//         if (!isDragging) return;

//         const x = e.touches[0].pageX - slider.offsetLeft;
//         const y = e.touches[0].pageY;
//         const walkX = x - startX;
//         const walkY = y - startY;

//         const now = Date.now();
//         if (now - lastMoveTime < 10) return; // Limit FPS
//         lastMoveTime = now;

//         // Determine scroll direction if not already determined
//         if (
//           !isScrollingHorizontally &&
//           Math.abs(walkX) > Math.abs(walkY) &&
//           Math.abs(walkX) > 10
//         ) {
//           isScrollingHorizontally = true;
//         }

//         // Only handle horizontal scrolling and prevent default if we're scrolling horizontally
//         if (isScrollingHorizontally) {
//           e.preventDefault(); // Only prevent default for horizontal scrolling
//           slider.scrollLeft = scrollLeft - walkX;
//         }
//         // Otherwise, let the default vertical scrolling happen
//       },
//       { passive: false }
//     );

//     slider.addEventListener("click", (e) => {
//       if (isDragging || Date.now() - lastTouchTime < 300) {
//         return;
//       }

//       if (Date.now() - lastClickTime < 300) {
//         return;
//       }
//       lastClickTime = Date.now();

//       // Only implement click-to-scroll on desktop
//       if (!isMobileOrTablet) {
//         const clickX = e.clientX - slider.getBoundingClientRect().left;
//         const sliderCenterX = slider.offsetWidth / 2;
//         const scrollAmount = getScrollAmount();

//         if (clickX < sliderCenterX) {
//           slider.scrollBy({
//             left: -scrollAmount,
//             behavior: "smooth",
//           });
//         } else {
//           slider.scrollBy({
//             left: scrollAmount,
//             behavior: "smooth",
//           });
//         }
//       }
//     });

//     // Mouse event handlers
//     slider.addEventListener("mousedown", (e) => {
//       isDragging = true;
//       startX = e.pageX - slider.offsetLeft;
//       scrollLeft = slider.scrollLeft;
//       slider.style.scrollBehavior = "auto";
//       // slider.style.cursor = "grabbing";
//       e.preventDefault();
//     });

//     slider.addEventListener("mouseleave", () => {
//       if (isDragging) {
//         isDragging = false;
//         slider.style.scrollBehavior = "smooth";
//         // slider.style.cursor = "grab";
//       }
//     });

//     slider.addEventListener("mouseup", () => {
//       isDragging = false;
//       slider.style.scrollBehavior = "smooth";
//       // slider.style.cursor = "grab";

//       // Only snap to grid on desktop
//       if (!isMobileOrTablet) {
//         const scrollAmount = getScrollAmount();
//         const remainder = slider.scrollLeft % scrollAmount;

//         if (remainder > scrollAmount / 2) {
//           slider.scrollLeft += scrollAmount - remainder;
//         } else {
//           slider.scrollLeft -= remainder;
//         }
//       }
//     });

//     slider.addEventListener("mousemove", (e) => {
//       if (!isDragging) return;
//       e.preventDefault();
//       const x = e.pageX - slider.offsetLeft;
//       const walk = (x - startX) * 2;
//       slider.scrollLeft = scrollLeft - walk;
//     });

//     slider.tabIndex = 0;
//     slider.addEventListener("keydown", (e) => {
//       if (e.key === "ArrowLeft") {
//         // On mobile/tablet, scroll less for a more natural feel
//         const scrollAmount = isMobileOrTablet ? 100 : getScrollAmount();
//         slider.scrollBy({
//           left: -scrollAmount,
//           behavior: "smooth",
//         });
//         e.preventDefault();
//       } else if (e.key === "ArrowRight") {
//         const scrollAmount = isMobileOrTablet ? 100 : getScrollAmount();
//         slider.scrollBy({
//           left: scrollAmount,
//           behavior: "smooth",
//         });
//         e.preventDefault();
//       }
//     });

//     function updateMargins() {
//       let sliderMargin;

//       if (window.innerWidth >= 1440) {
//         sliderMargin = (window.innerWidth - 1440) / 2;
//       } else if (window.innerWidth >= 992) {
//         sliderMargin = 15;
//       } else if (window.innerWidth >= 768) {
//         sliderMargin = 10;
//       } else {
//         sliderMargin = 15;
//       }

//       slider.style.marginLeft = `${sliderMargin}px`;

//       const project = slider.closest(".project");
//       if (project) {
//         const info = project.querySelector(".project-info");
//         const widgets = project.querySelector(".widgets-container");

//         if (info) {
//           info.style.setProperty("--info-margin", `${sliderMargin}px`);
//         }

//         if (widgets) {
//           widgets.style.setProperty("--widgets-margin", `${sliderMargin}px`);
//         }
//       }
//     }

//     updateMargins();

//     const cards = slider.querySelectorAll(".project-card");
//     cards.forEach((card) => {
//       // Only apply scroll-snap-align on desktop
//       if (isMobileOrTablet) {
//         card.style.scrollSnapAlign = "start";
//       }
//     });

//     window.addEventListener("resize", updateMargins);

//     // Add observer to reset slider position when not in focus
//     const project = slider.closest(".project");
//     if (project) {
//       const resetObserver = new IntersectionObserver(
//         (entries) => {
//           entries.forEach((entry) => {
//             // When project goes out of view, reset slider to first position
//             if (!entry.isIntersecting) {
//               setTimeout(() => {
//                 slider.scrollTo({
//                   left: 0,
//                   behavior: "auto",
//                 });
//               }, 300);
//             }
//           });
//         },
//         { threshold: 0.1 }
//       );

//       resetObserver.observe(project);
//     }
//   });

//   // ===== Navbar Enhancement =====
//   const navbar = document.querySelector(".navbar");

//   if (navbar) {
//     // Keep navbar fixed at the top at all times
//     navbar.style.transform = "translateX(-50%)";
//     navbar.style.position = "fixed";
//     navbar.style.top = "20px";
//     navbar.style.left = "50%";
//     navbar.style.zIndex = "1000";
//   }
// });
// document.addEventListener("DOMContentLoaded", () => {
//   const aboutSection = document.querySelector(".about-section");
//   const servicesInfo = document.querySelector(".services-info");
//   const teamInfo = document.querySelector(".team-info");

//   function handleScroll() {
//     if (window.innerWidth >= 1440) {
//       const aboutSectionTop = aboutSection.getBoundingClientRect().top;

//       if (aboutSectionTop <= 0) {
//         servicesInfo.style.position = "fixed";
//         servicesInfo.style.top = "0";
//         servicesInfo.style.width = "auto";
//         teamInfo.style.width = "100%";
//       } else {
//         servicesInfo.style.position = "relative";
//         servicesInfo.style.top = "auto";
//         servicesInfo.style.width = "auto";
//         teamInfo.style.width = "453px";
//       }
//     } else {
//       servicesInfo.style.position = "static";
//       servicesInfo.style.top = "auto";
//       servicesInfo.style.width = "auto";
//       teamInfo.style.width = "100%";
//     }
//   }

//   window.addEventListener("scroll", handleScroll);
// });

document.addEventListener("DOMContentLoaded", () => {
  // ===== Performance Utilities =====
  const debounce = (func, wait = 20, immediate = true) => {
    let timeout;
    return function (...args) {
      const context = this;
      const later = () => {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      const callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  };

  // ===== Project Sliders Enhancement =====
  const sliders = document.querySelectorAll(".projects-slider");

  const getScrollAmount = () => {
    const w = window.innerWidth;
    if (w <= 576) return 277;
    if (w <= 768) return 350;
    if (w <= 992) return 400;
    return 453;
  };

  sliders.forEach((slider) => {
    let isDragging = false,
      startX = 0,
      scrollLeft = 0,
      startY = 0,
      isScrollingHorizontally = false,
      lastTouchTime = 0,
      lastClickTime = 0;

    const isMobileOrTablet = window.innerWidth < 992;

    // Accessibility
    slider.setAttribute("role", "region");
    slider.setAttribute("aria-label", "Project images carousel");

    // Touch Events
    slider.addEventListener(
      "touchstart",
      (e) => {
        isDragging = true;
        startX = e.touches[0].pageX - slider.offsetLeft;
        startY = e.touches[0].pageY;
        scrollLeft = slider.scrollLeft;
        slider.style.scrollBehavior = "auto";
        lastTouchTime = Date.now();
        isScrollingHorizontally = false;
      },
      { passive: true }
    );

    slider.addEventListener("touchend", () => {
      isDragging = false;
      slider.style.scrollBehavior = "smooth";

      if (!isMobileOrTablet) {
        const scrollAmount = getScrollAmount();
        const remainder = slider.scrollLeft % scrollAmount;
        slider.scrollLeft +=
          remainder > scrollAmount / 2 ? scrollAmount - remainder : -remainder;
      }
    });

    slider.addEventListener(
      "touchmove",
      (e) => {
        if (!isDragging) return;

        const x = e.touches[0].pageX - slider.offsetLeft;
        const y = e.touches[0].pageY;
        const walkX = (x - startX) * 1.5;
        const walkY = y - startY;

        if (
          !isScrollingHorizontally &&
          Math.abs(walkX) > Math.abs(walkY) &&
          Math.abs(walkX) > 10
        ) {
          isScrollingHorizontally = true;
        }

        if (isScrollingHorizontally) {
          e.preventDefault();
          slider.scrollLeft = scrollLeft - walkX;
        }
      },
      { passive: false }
    );

    // Click-to-scroll on desktop
    slider.addEventListener("click", (e) => {
      if (
        isDragging ||
        Date.now() - lastTouchTime < 300 ||
        Date.now() - lastClickTime < 300
      )
        return;
      lastClickTime = Date.now();

      if (!isMobileOrTablet) {
        const clickX = e.clientX - slider.getBoundingClientRect().left;
        const centerX = slider.offsetWidth / 2;
        const scrollAmount = getScrollAmount();

        slider.scrollBy({
          left: clickX < centerX ? -scrollAmount : scrollAmount,
          behavior: "smooth",
        });
      }
    });

    // Mouse Drag
    slider.addEventListener("mousedown", (e) => {
      isDragging = true;
      startX = e.pageX - slider.offsetLeft;
      scrollLeft = slider.scrollLeft;
      slider.style.scrollBehavior = "auto";
      slider.style.cursor = "grabbing";
      e.preventDefault();
    });

    slider.addEventListener("mouseleave", () => {
      if (isDragging) {
        isDragging = false;
        slider.style.scrollBehavior = "smooth";
        slider.style.cursor = "grab";
      }
    });

    slider.addEventListener("mouseup", () => {
      isDragging = false;
      slider.style.scrollBehavior = "smooth";
      slider.style.cursor = "grab";

      if (!isMobileOrTablet) {
        const scrollAmount = getScrollAmount();
        const remainder = slider.scrollLeft % scrollAmount;
        slider.scrollLeft +=
          remainder > scrollAmount / 2 ? scrollAmount - remainder : -remainder;
      }
    });

    slider.addEventListener("mousemove", (e) => {
      if (!isDragging) return;
      e.preventDefault();
      const x = e.pageX - slider.offsetLeft;
      slider.scrollLeft = scrollLeft - (x - startX) * 1.5;
    });

    // Keyboard Nav
    slider.tabIndex = 0;
    slider.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        const amount = isMobileOrTablet ? 100 : getScrollAmount();
        slider.scrollBy({
          left: e.key === "ArrowLeft" ? -amount : amount,
          behavior: "smooth",
        });
        e.preventDefault();
      }
    });

    // Margin Adjustments
    const updateMargins = () => {
      const w = window.innerWidth;
      const margin =
        w >= 1440 ? (w - 1440) / 2 : w >= 992 ? 15 : w >= 768 ? 10 : 15;
      slider.style.marginLeft = `${margin}px`;

      const project = slider.closest(".project");
      if (project) {
        const info = project.querySelector(".project-info");
        const widgets = project.querySelector(".widgets-container");

        if (info) info.style.setProperty("--info-margin", `${margin}px`);
        if (widgets)
          widgets.style.setProperty("--widgets-margin", `${margin}px`);
      }
    };
    updateMargins();
    window.addEventListener("resize", updateMargins);

    // Snap Behavior
    slider.querySelectorAll(".project-card").forEach((card) => {
      card.style.scrollSnapAlign = isMobileOrTablet ? "none" : "start";
    });

    // Auto-reset scroll when out of view
    const project = slider.closest(".project");
    if (project) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) {
              setTimeout(() => {
                slider.scrollTo({ left: 0, behavior: "auto" });
              }, 300);
            }
          });
        },
        { threshold: 0.1 }
      );
      observer.observe(project);
    }
  });

  // ===== Navbar Fixation =====
  const navbar = document.querySelector(".navbar");
  if (navbar) {
    Object.assign(navbar.style, {
      transform: "translateX(-50%)",
      position: "fixed",
      top: "20px",
      left: "50%",
      zIndex: "1000",
    });
  }
});

// ===== Section Scroll Behavior =====
const aboutSection = document.querySelector(".about-section");
const servicesInfo = document.querySelector(".services-info");
const teamInfo = document.querySelector(".team-info");

function handleScroll() {
  if (window.innerWidth >= 768) {
    const aboutTop = aboutSection.getBoundingClientRect().top;
    if (aboutTop <= 0) {
      Object.assign(servicesInfo.style, {
        position: "fixed",
        top: "0",
        width: "auto",
      });
      teamInfo.style.width = "100%";
    } else {
      Object.assign(servicesInfo.style, {
        position: "relative",
        top: "auto",
        width: "auto",
      });
      teamInfo.style.width = "453px";
    }
  } else {
    Object.assign(servicesInfo.style, {
      position: "static",
      top: "auto",
      width: "auto",
    });
    teamInfo.style.width = "100%";
  }
}
window.addEventListener("scroll", handleScroll);

// Cursor
// const cursor = document.querySelector(".custom-cursor");
// const sliders = document.querySelectorAll(".projects-slider");

// // Move the cursor with mouse
// document.addEventListener("mousemove", (e) => {
//   cursor.style.left = e.clientX + "px";
//   cursor.style.top = e.clientY + "px";
// });

// // Add event listeners to each slider
// sliders.forEach((slider) => {
//   // Handle hover state
//   slider.addEventListener("mouseenter", () => {
//     cursor.classList.add("slider-hover");
//   });

//   slider.addEventListener("mouseleave", () => {
//     cursor.classList.remove("slider-hover");
//     cursor.classList.remove("arrow-active"); // Remove arrow active state
//     cursor.textContent = ""; // Remove arrow when exiting
//   });

//   // Handle direction arrows
//   slider.addEventListener("mousemove", (e) => {
//     const rect = slider.getBoundingClientRect();
//     const centerX = rect.left + rect.width / 2;

//     // Check if we can scroll in the direction
//     const canScrollLeft = slider.scrollLeft > 0;
//     const canScrollRight =
//       slider.scrollLeft + slider.clientWidth < slider.scrollWidth - 1; // -1 for rounding errors

//     if (e.clientX < centerX) {
//       // Left side
//       if (canScrollLeft) {
//         cursor.textContent = "←";
//         cursor.classList.add("arrow-active"); // Add class for larger cursor with arrow
//       } else {
//         cursor.textContent = ""; // No arrow if can't scroll left
//         cursor.classList.remove("arrow-active"); // Remove class to get small default cursor
//       }
//     } else {
//       // Right side
//       if (canScrollRight) {
//         cursor.textContent = "→";
//         cursor.classList.add("arrow-active"); // Add class for larger cursor with arrow
//       } else {
//         cursor.textContent = ""; // No arrow if can't scroll right
//         cursor.classList.remove("arrow-active"); // Remove class to get small default cursor
//       }
//     }
//   });

//   // Update cursor when scrolling to handle edge cases
//   slider.addEventListener("scroll", () => {
//     // Force update the cursor by triggering a mousemove event
//     const mouseEvent = new MouseEvent("mousemove", {
//       clientX: parseInt(cursor.style.left),
//       clientY: parseInt(cursor.style.top),
//     });
//     slider.dispatchEvent(mouseEvent);
//   });
// });
