// document.addEventListener("DOMContentLoaded", () => {
//   const sliders = document.querySelectorAll(".projects-slider");

//   sliders.forEach((slider, index) => {
//     let isDragging = false;
//     let startX = 0;
//     let scrollLeft = 0;
//     let initialMargin = "";

//     if (window.innerWidth >= 1440) {
//       initialMargin = window.getComputedStyle(slider).marginLeft;
//     }

//     slider.addEventListener("touchstart", (e) => {
//       isDragging = true;
//       startX = e.touches[0].pageX - slider.offsetLeft;
//       scrollLeft = slider.scrollLeft;
//       slider.style.scrollBehavior = "auto";
//     });

//     slider.addEventListener("touchend", () => {
//       isDragging = false;
//       slider.style.scrollBehavior = "smooth";
//     });

//     slider.addEventListener("touchmove", (e) => {
//       if (!isDragging) return;
//       const x = e.touches[0].pageX - slider.offsetLeft;
//       const walk = (x - startX) * 1;
//       slider.scrollLeft = scrollLeft - walk;
//     });

//     slider.addEventListener("click", (e) => {
//       if (isDragging) {
//         return;
//       }

//       const clickX = e.clientX - slider.getBoundingClientRect().left;
//       const sliderCenterX = slider.offsetWidth / 2;
//       const fixedScrollAmount = 453;

//       if (clickX < sliderCenterX) {
//         slider.scrollLeft -= fixedScrollAmount;
//       } else {
//         slider.scrollLeft += fixedScrollAmount;
//       }
//     });

//     slider.addEventListener("mousedown", (e) => {
//       e.preventDefault();
//       isDragging = true;
//       startX = e.pageX - slider.offsetLeft;
//       scrollLeft = slider.scrollLeft;
//       slider.style.scrollBehavior = "auto";
//     });

//     slider.addEventListener("mouseleave", () => {
//       isDragging = false;
//       slider.style.scrollBehavior = "smooth";
//     });

//     slider.addEventListener("mouseup", () => {
//       isDragging = false;
//       slider.style.scrollBehavior = "smooth";
//     });

//     slider.addEventListener("mousemove", (e) => {
//       if (!isDragging) return;
//       e.preventDefault();
//       const x = e.pageX - slider.offsetLeft;
//       const walk = (x - startX) * 1;
//       slider.scrollLeft = scrollLeft - walk;
//     });

//     function smoothReturn() {
//       slider.style.scrollBehavior = "smooth";
//       slider.scrollLeft = 0;
//       setTimeout(() => {
//         slider.style.scrollBehavior = "auto";
//       }, 500);
//     }

//     function updateMargins() {
//       const sliderMargin = parseInt(window.getComputedStyle(slider).marginLeft);
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
//     window.addEventListener("resize", updateMargins);
//   });
// });

// // About Section scroll
// document.addEventListener("DOMContentLoaded", () => {
//   const teamInfo = document.querySelector(".team-info");
//   const servicesInfo = document.querySelector(".services-info");
//   const aboutSection = document.querySelector(".about-section");

//   let isFooterAtTop = false;

//   // Observe when footer (about-section) reaches top 0
//   const observer = new IntersectionObserver(
//     (entries) => {
//       entries.forEach((entry) => {
//         isFooterAtTop = entry.isIntersecting; // Update flag based on intersection
//       });
//     },
//     { threshold: 0 }
//   );

//   observer.observe(aboutSection);

//   const handleScroll = (event, isTouch = false) => {
//     event.preventDefault();

//     if (!isFooterAtTop) {
//       // Normal scrolling before reaching the bottom
//       window.scrollBy({
//         top: isTouch ? event.touches[0].clientY : event.deltaY,
//         behavior: "auto",
//       });
//       return;
//     }

//     const maxScrollTop = teamInfo.scrollHeight - teamInfo.clientHeight;
//     const scrollAmount = isTouch ? event.touches[0].clientY : event.deltaY;

//     if (teamInfo.scrollTop >= maxScrollTop && scrollAmount > 0) {
//       // If team-info is fully scrolled down, continue website scrolling
//       window.scrollBy({ top: scrollAmount, behavior: "auto" });
//     } else if (teamInfo.scrollTop <= 0 && scrollAmount < 0) {
//       // If team-info is at the top, continue website scrolling up
//       window.scrollBy({ top: scrollAmount, behavior: "auto" });
//     } else {
//       // Scroll team-info
//       teamInfo.scrollTop += scrollAmount;
//     }
//   };

//   servicesInfo.addEventListener("wheel", (event) => handleScroll(event));
//   servicesInfo.addEventListener("touchmove", (event) =>
//     handleScroll(event, true)
//   );
// });

//  2nd version
// document.addEventListener("DOMContentLoaded", () => {
//   // ===== Project Sliders Enhancement =====
//   const sliders = document.querySelectorAll(".projects-slider");

//   // Debounce function to improve performance for resize events
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

//   // Calculate the optimal scroll amount based on screen size
//   function getScrollAmount() {
//     if (window.innerWidth <= 576) {
//       return window.innerWidth * 0.85; // 85vw for mobile
//     } else if (window.innerWidth <= 768) {
//       return 350; // Medium screens
//     } else if (window.innerWidth <= 992) {
//       return 400; // Tablets
//     } else {
//       return 453; // Desktop default
//     }
//   }

//   sliders.forEach((slider) => {
//     let isDragging = false;
//     let startX = 0;
//     let scrollLeft = 0;
//     let initialMargin = "";
//     let lastTouchTime = 0;
//     let lastClickTime = 0;

//     // Add ARIA attributes for accessibility
//     slider.setAttribute("role", "region");
//     slider.setAttribute("aria-label", "Project images carousel");

//     // Add visual indicator for scrollable content
//     const scrollIndicator = document.createElement("div");
//     scrollIndicator.className = "scroll-indicator";
//     scrollIndicator.innerHTML = "<span>Scroll for more</span>";
//     scrollIndicator.style.cssText = `
//       position: absolute;
//       right: 15px;
//       bottom: 15px;
//       background: rgba(0,0,0,0.7);
//       color: white;
//       padding: 5px 10px;
//       border-radius: 4px;
//       font-size: 12px;
//       opacity: 0.8;
//       transition: opacity 0.3s;
//       pointer-events: none;
//     `;
//     slider.parentNode.style.position = "relative";
//     slider.parentNode.appendChild(scrollIndicator);

//     // Hide indicator after scrolling
//     const hideScrollIndicator = () => {
//       scrollIndicator.style.opacity = "0";
//       setTimeout(() => {
//         scrollIndicator.style.display = "none";
//       }, 300);
//     };

//     if (window.innerWidth >= 1440) {
//       initialMargin = window.getComputedStyle(slider).marginLeft;
//     }

//     // Touch event handlers with improved performance
//     slider.addEventListener(
//       "touchstart",
//       (e) => {
//         isDragging = true;
//         startX = e.touches[0].pageX - slider.offsetLeft;
//         scrollLeft = slider.scrollLeft;
//         slider.style.scrollBehavior = "auto";
//         lastTouchTime = Date.now();
//       },
//       { passive: false }
//     );

//     slider.addEventListener("touchend", () => {
//       isDragging = false;
//       slider.style.scrollBehavior = "smooth";

//       // Snap to closest card after touch end
//       const scrollAmount = getScrollAmount();
//       const remainder = slider.scrollLeft % scrollAmount;

//       if (remainder > scrollAmount / 2) {
//         slider.scrollLeft += scrollAmount - remainder;
//       } else {
//         slider.scrollLeft -= remainder;
//       }

//       hideScrollIndicator();
//     });

//     slider.addEventListener(
//       "touchmove",
//       (e) => {
//         if (!isDragging) return;
//         const x = e.touches[0].pageX - slider.offsetLeft;
//         const walk = (x - startX) * 1.5; // Increased sensitivity
//         slider.scrollLeft = scrollLeft - walk;
//         e.preventDefault(); // Prevent page scrolling while dragging
//         hideScrollIndicator();
//       },
//       { passive: false }
//     );

//     // Improved click navigation
//     slider.addEventListener("click", (e) => {
//       // Prevent accidental clicks during drag
//       if (isDragging || Date.now() - lastTouchTime < 300) {
//         return;
//       }

//       // Prevent double clicks
//       if (Date.now() - lastClickTime < 300) {
//         return;
//       }
//       lastClickTime = Date.now();

//       const clickX = e.clientX - slider.getBoundingClientRect().left;
//       const sliderCenterX = slider.offsetWidth / 2;
//       const scrollAmount = getScrollAmount();

//       if (clickX < sliderCenterX) {
//         // Scroll left with boundary check
//         slider.scrollBy({
//           left: -scrollAmount,
//           behavior: "smooth",
//         });
//       } else {
//         // Scroll right with boundary check
//         slider.scrollBy({
//           left: scrollAmount,
//           behavior: "smooth",
//         });
//       }
//     });

//     // Mouse event handlers
//     slider.addEventListener("mousedown", (e) => {
//       isDragging = true;
//       startX = e.pageX - slider.offsetLeft;
//       scrollLeft = slider.scrollLeft;
//       slider.style.scrollBehavior = "auto";
//       slider.style.cursor = "grabbing";
//       e.preventDefault();
//     });

//     slider.addEventListener("mouseleave", () => {
//       if (isDragging) {
//         isDragging = false;
//         slider.style.scrollBehavior = "smooth";
//         slider.style.cursor = "grab";
//       }
//     });

//     slider.addEventListener("mouseup", () => {
//       isDragging = false;
//       slider.style.scrollBehavior = "smooth";
//       slider.style.cursor = "grab";

//       // Snap to closest card after mouse up
//       const scrollAmount = getScrollAmount();
//       const remainder = slider.scrollLeft % scrollAmount;

//       if (remainder > scrollAmount / 2) {
//         slider.scrollLeft += scrollAmount - remainder;
//       } else {
//         slider.scrollLeft -= remainder;
//       }
//     });

//     slider.addEventListener("mousemove", (e) => {
//       if (!isDragging) return;
//       e.preventDefault();
//       const x = e.pageX - slider.offsetLeft;
//       const walk = (x - startX) * 1.5; // Increased sensitivity
//       slider.scrollLeft = scrollLeft - walk;
//       hideScrollIndicator();
//     });

//     // Add keyboard navigation for accessibility
//     slider.tabIndex = 0;
//     slider.addEventListener("keydown", (e) => {
//       if (e.key === "ArrowLeft") {
//         slider.scrollBy({
//           left: -getScrollAmount(),
//           behavior: "smooth",
//         });
//         e.preventDefault();
//       } else if (e.key === "ArrowRight") {
//         slider.scrollBy({
//           left: getScrollAmount(),
//           behavior: "smooth",
//         });
//         e.preventDefault();
//       }
//     });

//     // Enhanced margin update function
//     function updateMargins() {
//       // Calculate appropriate margin based on screen size
//       let sliderMargin;

//       if (window.innerWidth >= 1440) {
//         sliderMargin = (window.innerWidth - 1440) / 2;
//       } else if (window.innerWidth >= 992) {
//         sliderMargin = 15;
//       } else if (window.innerWidth >= 768) {
//         sliderMargin = 10;
//       } else {
//         sliderMargin = 15; // Mobile default
//       }

//       // Apply margins
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

//       // Update scroll indicator position
//       if (window.innerWidth <= 576) {
//         scrollIndicator.style.right = "10px";
//         scrollIndicator.style.bottom = "10px";
//       } else {
//         scrollIndicator.style.right = "15px";
//         scrollIndicator.style.bottom = "15px";
//       }
//     }

//     // Initialize margins
//     updateMargins();

//     // Add scroll snap points for better UX
//     const cards = slider.querySelectorAll(".project-card");
//     cards.forEach((card) => {
//       card.style.scrollSnapAlign = "start";
//     });

//     // Optimize resize event with debounce
//     window.addEventListener("resize", debounce(updateMargins, 100));

//     // Show scroll indicator when slider is in view
//     const sliderObserver = new IntersectionObserver(
//       (entries) => {
//         entries.forEach((entry) => {
//           if (entry.isIntersecting) {
//             if (slider.scrollWidth > slider.clientWidth) {
//               scrollIndicator.style.display = "block";
//               scrollIndicator.style.opacity = "0.8";

//               // Auto-hide after 3 seconds
//               setTimeout(hideScrollIndicator, 3000);
//             }
//           }
//         });
//       },
//       { threshold: 0.1 }
//     );

//     sliderObserver.observe(slider);
//   });

//   // ===== About Section Scroll Enhancement =====
//   const teamInfo = document.querySelector(".team-info");
//   const servicesInfo = document.querySelector(".services-info");
//   const aboutSection = document.querySelector(".about-section");

//   if (teamInfo && servicesInfo && aboutSection) {
//     let isFooterAtTop = false;
//     let touchStartY = 0;
//     let lastScrollTop = 0;
//     let scrollTimeout;

//     // Improved intersection observer with options
//     const observerOptions = {
//       threshold: [0, 0.1, 0.5],
//       rootMargin: "-10px 0px 0px 0px",
//     };

//     const observer = new IntersectionObserver((entries) => {
//       entries.forEach((entry) => {
//         isFooterAtTop = entry.isIntersecting && entry.intersectionRatio > 0.1;

//         // Add class for styling when section is in view
//         if (entry.isIntersecting) {
//           aboutSection.classList.add("in-view");
//         } else {
//           aboutSection.classList.remove("in-view");
//         }
//       });
//     }, observerOptions);

//     observer.observe(aboutSection);

//     // Enhanced scroll handling with momentum scrolling
//     const handleScroll = (event, isTouch = false) => {
//       if (!isFooterAtTop) {
//         return; // Let default scrolling happen
//       }

//       event.preventDefault();

//       const maxScrollTop = teamInfo.scrollHeight - teamInfo.clientHeight;
//       let scrollAmount;

//       if (isTouch) {
//         const touchY = event.touches[0].clientY;
//         scrollAmount = touchStartY - touchY;
//         touchStartY = touchY;
//       } else {
//         scrollAmount = event.deltaY;
//       }

//       // Apply easing for smoother scrolling
//       scrollAmount = scrollAmount * 0.8;

//       // Handle boundary conditions with momentum
//       if (teamInfo.scrollTop >= maxScrollTop && scrollAmount > 0) {
//         // At bottom of team-info, continue website scrolling
//         window.scrollBy({
//           top: scrollAmount,
//           behavior: "auto",
//         });
//       } else if (teamInfo.scrollTop <= 0 && scrollAmount < 0) {
//         // At top of team-info, continue website scrolling up
//         window.scrollBy({
//           top: scrollAmount,
//           behavior: "auto",
//         });
//       } else {
//         // Scroll team-info with momentum
//         teamInfo.scrollTop += scrollAmount;

//         // Clear previous timeout
//         clearTimeout(scrollTimeout);

//         // Add momentum effect
//         scrollTimeout = setTimeout(() => {
//           const currentScrollTop = teamInfo.scrollTop;
//           const delta = currentScrollTop - lastScrollTop;

//           if (Math.abs(delta) > 10) {
//             const momentum = delta * 0.2;

//             // Animate with momentum
//             let start = null;
//             const animate = (timestamp) => {
//               if (!start) start = timestamp;
//               const progress = timestamp - start;

//               if (progress < 300) {
//                 teamInfo.scrollTop += momentum * (1 - progress / 300);
//                 requestAnimationFrame(animate);
//               }
//             };

//             requestAnimationFrame(animate);
//           }
//         }, 50);

//         lastScrollTop = teamInfo.scrollTop;
//       }
//     };

//     // Touch event handlers for team-info section
//     teamInfo.addEventListener(
//       "touchstart",
//       (event) => {
//         touchStartY = event.touches[0].clientY;
//       },
//       { passive: true }
//     );

//     // Improved wheel event handling
//     servicesInfo.addEventListener(
//       "wheel",
//       (event) => {
//         if (isFooterAtTop) {
//           handleScroll(event);
//         }
//       },
//       { passive: false }
//     );

//     // Improved touch event handling
//     servicesInfo.addEventListener(
//       "touchmove",
//       (event) => {
//         if (isFooterAtTop) {
//           handleScroll(event, true);
//         }
//       },
//       { passive: false }
//     );

//     // Add keyboard navigation for accessibility
//     aboutSection.tabIndex = 0;
//     aboutSection.addEventListener("keydown", (e) => {
//       if (isFooterAtTop && (e.key === "ArrowUp" || e.key === "ArrowDown")) {
//         const scrollAmount = e.key === "ArrowUp" ? -50 : 50;
//         teamInfo.scrollTop += scrollAmount;
//         e.preventDefault();
//       }
//     });

//     // Add scroll indicator for team-info section
//     if (teamInfo.scrollHeight > teamInfo.clientHeight) {
//       const scrollIndicator = document.createElement("div");
//       scrollIndicator.className = "team-scroll-indicator";
//       scrollIndicator.innerHTML = "<span>Scroll for more</span>";
//       scrollIndicator.style.cssText = `
//         position: absolute;
//         bottom: 15px;
//         left: 50%;
//         transform: translateX(-50%);
//         background: rgba(0,0,0,0.7);
//         color: white;
//         padding: 5px 10px;
//         border-radius: 4px;
//         font-size: 12px;
//         opacity: 0.8;
//         transition: opacity 0.3s;
//         pointer-events: none;
//       `;

//       teamInfo.style.position = "relative";
//       teamInfo.appendChild(scrollIndicator);

//       // Hide indicator after scrolling
//       teamInfo.addEventListener(
//         "scroll",
//         debounce(() => {
//           scrollIndicator.style.opacity = "0";
//           setTimeout(() => {
//             scrollIndicator.style.display = "none";
//           }, 300);
//         }, 200)
//       );
//     }
//   }

//   // ===== Responsive Image Loading =====
//   // Load appropriate image sizes based on screen width
//   function loadResponsiveImages() {
//     const projectImages = document.querySelectorAll(
//       ".project-img, .project-img-small"
//     );

//     projectImages.forEach((img) => {
//       const originalSrc = img.getAttribute("data-src") || img.src;

//       // Skip if already processed
//       if (img.getAttribute("data-processed")) return;

//       // Store original source
//       if (!img.getAttribute("data-src")) {
//         img.setAttribute("data-src", originalSrc);
//       }

//       // Determine appropriate image size
//       let newSrc = originalSrc;
//       if (window.innerWidth <= 576) {
//         // Mobile version (smaller)
//         newSrc = originalSrc.replace(/\.(webp|jpg|png)$/, "-mobile.$1");
//       }

//       // Set new source if different
//       if (newSrc !== img.src) {
//         // Create image loader
//         const loader = new Image();
//         loader.onload = () => {
//           img.src = newSrc;
//           img.setAttribute("data-processed", "true");
//         };
//         loader.onerror = () => {
//           // Fallback to original if mobile version doesn't exist
//           img.setAttribute("data-processed", "true");
//         };
//         loader.src = newSrc;
//       } else {
//         img.setAttribute("data-processed", "true");
//       }
//     });
//   }

//   // Load responsive images on page load and resize
//   loadResponsiveImages();
//   window.addEventListener("resize", debounce(loadResponsiveImages, 200));

//   // ===== Navbar Enhancement =====
//   const navbar = document.querySelector(".navbar");

//   if (navbar) {
//     let lastScrollY = window.scrollY;
//     let ticking = false;

//     // Hide navbar on scroll down, show on scroll up
//     function updateNavbar() {
//       const currentScrollY = window.scrollY;

//       if (currentScrollY > lastScrollY && currentScrollY > 100) {
//         // Scrolling down - hide navbar
//         navbar.style.transform = "translateY(-100%)";
//       } else {
//         // Scrolling up - show navbar
//         navbar.style.transform = "translateX(-50%)";
//       }

//       lastScrollY = currentScrollY;
//       ticking = false;
//     }

//     window.addEventListener("scroll", () => {
//       if (!ticking) {
//         window.requestAnimationFrame(updateNavbar);
//         ticking = true;
//       }
//     });

//     // Add transition for smooth hiding/showing
//     navbar.style.transition = "transform 0.3s ease";
//   }
// });
document.addEventListener("DOMContentLoaded", () => {
  // ===== Performance Utilities =====
  function debounce(func, wait = 20, immediate = true) {
    let timeout;
    return function () {
      const context = this,
        args = arguments;
      const later = function () {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      const callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  }

  // ===== Project Sliders Enhancement =====
  const sliders = document.querySelectorAll(".projects-slider");

  function getScrollAmount() {
    if (window.innerWidth <= 576) {
      return window.innerWidth * 0.85;
    } else if (window.innerWidth <= 768) {
      return 350;
    } else if (window.innerWidth <= 992) {
      return 400;
    } else {
      return 453;
    }
  }

  sliders.forEach((slider) => {
    let isDragging = false;
    let startX = 0;
    let scrollLeft = 0;
    let initialMargin = "";
    let lastTouchTime = 0;
    let lastClickTime = 0;

    slider.setAttribute("role", "region");
    slider.setAttribute("aria-label", "Project images carousel");

    const scrollIndicator = document.createElement("div");
    scrollIndicator.className = "scroll-indicator";
    scrollIndicator.innerHTML = "<span>Scroll for more</span>";
    scrollIndicator.style.cssText = `
      position: absolute;
      right: 15px;
      bottom: 15px;
      background: rgba(0,0,0,0.7);
      color: white;
      padding: 5px 10px;
      border-radius: 4px;
      font-size: 12px;
      opacity: 0.8;
      transition: opacity 0.3s;
      pointer-events: none;
      z-index: 10;
    `;

    if (slider.parentNode) {
      slider.parentNode.style.position = "relative";
      slider.parentNode.appendChild(scrollIndicator);
    }

    const hideScrollIndicator = () => {
      scrollIndicator.style.opacity = "0";
      setTimeout(() => {
        scrollIndicator.style.display = "none";
      }, 300);
    };

    if (window.innerWidth >= 1440) {
      initialMargin = window.getComputedStyle(slider).marginLeft;
    }

    slider.addEventListener(
      "touchstart",
      (e) => {
        isDragging = true;
        startX = e.touches[0].pageX - slider.offsetLeft;
        scrollLeft = slider.scrollLeft;
        slider.style.scrollBehavior = "auto";
        lastTouchTime = Date.now();
      },
      { passive: true }
    ); // Changed to passive for better performance

    slider.addEventListener("touchend", () => {
      isDragging = false;
      slider.style.scrollBehavior = "smooth";

      const scrollAmount = getScrollAmount();
      const remainder = slider.scrollLeft % scrollAmount;

      if (remainder > scrollAmount / 2) {
        slider.scrollLeft += scrollAmount - remainder;
      } else {
        slider.scrollLeft -= remainder;
      }

      hideScrollIndicator();
    });

    slider.addEventListener(
      "touchmove",
      (e) => {
        if (!isDragging) return;

        const x = e.touches[0].pageX - slider.offsetLeft;
        const walk = (x - startX) * 1.5;

        // Only prevent default if significant horizontal movement
        if (Math.abs(walk) > 10) {
          e.preventDefault();
          slider.scrollLeft = scrollLeft - walk;
          hideScrollIndicator();
        }
      },
      { passive: false }
    );

    slider.addEventListener("click", (e) => {
      if (isDragging || Date.now() - lastTouchTime < 300) {
        return;
      }

      if (Date.now() - lastClickTime < 300) {
        return;
      }
      lastClickTime = Date.now();

      const clickX = e.clientX - slider.getBoundingClientRect().left;
      const sliderCenterX = slider.offsetWidth / 2;
      const scrollAmount = getScrollAmount();

      if (clickX < sliderCenterX) {
        slider.scrollBy({
          left: -scrollAmount,
          behavior: "smooth",
        });
      } else {
        slider.scrollBy({
          left: scrollAmount,
          behavior: "smooth",
        });
      }
    });

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

      const scrollAmount = getScrollAmount();
      const remainder = slider.scrollLeft % scrollAmount;

      if (remainder > scrollAmount / 2) {
        slider.scrollLeft += scrollAmount - remainder;
      } else {
        slider.scrollLeft -= remainder;
      }
    });

    slider.addEventListener("mousemove", (e) => {
      if (!isDragging) return;
      e.preventDefault();
      const x = e.pageX - slider.offsetLeft;
      const walk = (x - startX) * 1.5;
      slider.scrollLeft = scrollLeft - walk;
      hideScrollIndicator();
    });

    slider.tabIndex = 0;
    slider.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") {
        slider.scrollBy({
          left: -getScrollAmount(),
          behavior: "smooth",
        });
        e.preventDefault();
      } else if (e.key === "ArrowRight") {
        slider.scrollBy({
          left: getScrollAmount(),
          behavior: "smooth",
        });
        e.preventDefault();
      }
    });

    function updateMargins() {
      let sliderMargin;

      if (window.innerWidth >= 1440) {
        sliderMargin = (window.innerWidth - 1440) / 2;
      } else if (window.innerWidth >= 992) {
        sliderMargin = 15;
      } else if (window.innerWidth >= 768) {
        sliderMargin = 10;
      } else {
        sliderMargin = 15;
      }

      slider.style.marginLeft = `${sliderMargin}px`;

      const project = slider.closest(".project");
      if (project) {
        const info = project.querySelector(".project-info");
        const widgets = project.querySelector(".widgets-container");

        if (info) {
          info.style.setProperty("--info-margin", `${sliderMargin}px`);
        }

        if (widgets) {
          widgets.style.setProperty("--widgets-margin", `${sliderMargin}px`);
        }
      }

      if (window.innerWidth <= 576) {
        scrollIndicator.style.right = "10px";
        scrollIndicator.style.bottom = "10px";
      } else {
        scrollIndicator.style.right = "15px";
        scrollIndicator.style.bottom = "15px";
      }
    }

    updateMargins();

    const cards = slider.querySelectorAll(".project-card");
    cards.forEach((card) => {
      card.style.scrollSnapAlign = "start";
    });

    window.addEventListener("resize", debounce(updateMargins, 100));

    const sliderObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (slider.scrollWidth > slider.clientWidth) {
              scrollIndicator.style.display = "block";
              scrollIndicator.style.opacity = "0.8";
              setTimeout(hideScrollIndicator, 3000);
            }
          }
        });
      },
      { threshold: 0.1 }
    );

    sliderObserver.observe(slider);
  });

  // ===== About Section Scroll Enhancement =====
  const teamInfo = document.querySelector(".team-info");
  const servicesInfo = document.querySelector(".services-info");
  const aboutSection = document.querySelector(".about-section");

  if (teamInfo && servicesInfo && aboutSection) {
    let isFooterAtTop = false;
    let touchStartY = 0;

    // Fix for mobile scrolling issues at the bottom of the page
    const isMobile = window.innerWidth <= 768;

    // Use different approach for mobile vs desktop
    if (isMobile) {
      // On mobile, use simpler approach with native scrolling
      teamInfo.style.overflow = "auto";
      teamInfo.style.webkitOverflowScrolling = "touch";

      // Add scroll indicator
      const scrollIndicator = document.createElement("div");
      scrollIndicator.className = "team-scroll-indicator";
      scrollIndicator.innerHTML = "<span>Scroll for more</span>";
      scrollIndicator.style.cssText = `
        position: absolute;
        bottom: 15px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0,0,0,0.7);
        color: white;
        padding: 5px 10px;
        border-radius: 4px;
        font-size: 12px;
        opacity: 0.8;
        transition: opacity 0.3s;
        pointer-events: none;
        z-index: 10;
      `;

      teamInfo.style.position = "relative";
      teamInfo.appendChild(scrollIndicator);

      // Hide indicator after scrolling
      teamInfo.addEventListener(
        "scroll",
        debounce(() => {
          scrollIndicator.style.opacity = "0";
          setTimeout(() => {
            scrollIndicator.style.display = "none";
          }, 300);
        }, 200)
      );
    } else {
      // Desktop version with custom scroll handling
      const observerOptions = {
        threshold: [0, 0.1, 0.5],
        rootMargin: "-10px 0px 0px 0px",
      };

      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          isFooterAtTop = entry.isIntersecting && entry.intersectionRatio > 0.1;

          if (entry.isIntersecting) {
            aboutSection.classList.add("in-view");
          } else {
            aboutSection.classList.remove("in-view");
          }
        });
      }, observerOptions);

      observer.observe(aboutSection);

      const handleScroll = (event, isTouch = false) => {
        if (!isFooterAtTop) {
          return; // Let default scrolling happen
        }

        event.preventDefault();

        const maxScrollTop = teamInfo.scrollHeight - teamInfo.clientHeight;
        let scrollAmount;

        if (isTouch) {
          const touchY = event.touches[0].clientY;
          scrollAmount = touchStartY - touchY;
          touchStartY = touchY;
        } else {
          scrollAmount = event.deltaY;
        }

        scrollAmount = scrollAmount * 0.8;

        if (teamInfo.scrollTop >= maxScrollTop && scrollAmount > 0) {
          window.scrollBy({
            top: scrollAmount,
            behavior: "auto",
          });
        } else if (teamInfo.scrollTop <= 0 && scrollAmount < 0) {
          window.scrollBy({
            top: scrollAmount,
            behavior: "auto",
          });
        } else {
          teamInfo.scrollTop += scrollAmount;
        }
      };

      teamInfo.addEventListener(
        "touchstart",
        (event) => {
          touchStartY = event.touches[0].clientY;
        },
        { passive: true }
      );

      servicesInfo.addEventListener(
        "wheel",
        (event) => {
          if (isFooterAtTop) {
            handleScroll(event);
          }
        },
        { passive: false }
      );

      servicesInfo.addEventListener(
        "touchmove",
        (event) => {
          if (isFooterAtTop) {
            handleScroll(event, true);
          }
        },
        { passive: false }
      );

      aboutSection.tabIndex = 0;
      aboutSection.addEventListener("keydown", (e) => {
        if (isFooterAtTop && (e.key === "ArrowUp" || e.key === "ArrowDown")) {
          const scrollAmount = e.key === "ArrowUp" ? -50 : 50;
          teamInfo.scrollTop += scrollAmount;
          e.preventDefault();
        }
      });

      // Add scroll indicator for team-info section
      if (teamInfo.scrollHeight > teamInfo.clientHeight) {
        const scrollIndicator = document.createElement("div");
        scrollIndicator.className = "team-scroll-indicator";
        scrollIndicator.innerHTML = "<span>Scroll for more</span>";
        scrollIndicator.style.cssText = `
          position: absolute;
          bottom: 15px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(0,0,0,0.7);
          color: white;
          padding: 5px 10px;
          border-radius: 4px;
          font-size: 12px;
          opacity: 0.8;
          transition: opacity 0.3s;
          pointer-events: none;
          z-index: 10;
        `;

        teamInfo.style.position = "relative";
        teamInfo.appendChild(scrollIndicator);

        teamInfo.addEventListener(
          "scroll",
          debounce(() => {
            scrollIndicator.style.opacity = "0";
            setTimeout(() => {
              scrollIndicator.style.display = "none";
            }, 300);
          }, 200)
        );
      }
    }
  }

  // ===== Optimize Images =====
  function optimizeImages() {
    const projectImages = document.querySelectorAll(
      ".project-img, .project-img-small"
    );

    projectImages.forEach((img) => {
      if (!img.hasAttribute("loading")) {
        img.setAttribute("loading", "lazy");
      }
    });
  }

  optimizeImages();
  window.addEventListener("resize", debounce(optimizeImages, 200));

  // ===== Navbar Enhancement =====
  const navbar = document.querySelector(".navbar");

  if (navbar) {
    // FIX 1: Ensure navbar is initially centered
    navbar.style.transform = "translateX(-50%)";

    let lastScrollY = window.scrollY;
    let ticking = false;

    function updateNavbar() {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        navbar.style.transform = "translateY(-100%)";
      } else {
        navbar.style.transform = "translateX(-50%)";
      }

      lastScrollY = currentScrollY;
      ticking = false;
    }

    window.addEventListener("scroll", () => {
      if (!ticking) {
        window.requestAnimationFrame(updateNavbar);
        ticking = true;
      }
    });

    navbar.style.transition = "transform 0.3s ease";
  }
});
