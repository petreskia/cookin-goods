document.addEventListener("DOMContentLoaded", () => {
  // ===== Performance Utilities =====
  // const debounce = (func, wait = 20, immediate = true) => {
  //   let timeout;
  //   return function (...args) {
  //     const context = this;
  //     const later = () => {
  //       timeout = null;
  //       if (!immediate) func.apply(context, args);
  //     };
  //     const callNow = immediate && !timeout;
  //     clearTimeout(timeout);
  //     timeout = setTimeout(later, wait);
  //     if (callNow) func.apply(context, args);
  //   };
  // };

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

    slider.style.willChange = "scroll-position"; // Hint browser to optimize

    let rafPending = false;

    slider.addEventListener(
      "touchmove",
      (e) => {
        if (!isDragging) return;

        const x = e.touches[0].pageX - slider.offsetLeft;
        const y = e.touches[0].pageY;
        const walkX = (x - startX) * 2.5;
        const walkY = y - startY;

        // Determine scroll intent
        if (
          !isScrollingHorizontally &&
          Math.abs(walkX) > Math.abs(walkY) &&
          Math.abs(walkX) > 10
        ) {
          isScrollingHorizontally = true;
        }

        if (isScrollingHorizontally) {
          e.preventDefault(); // Prevent vertical scroll
          if (!rafPending) {
            rafPending = true;
            requestAnimationFrame(() => {
              slider.scrollLeft = scrollLeft - walkX;
              rafPending = false;
            });
          }
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
      e.preventDefault();
    });

    slider.addEventListener("mouseleave", () => {
      if (isDragging) {
        isDragging = false;
        slider.style.scrollBehavior = "smooth";
      }
    });

    slider.addEventListener("mouseup", () => {
      isDragging = false;
      slider.style.scrollBehavior = "smooth";

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
      slider.scrollLeft = scrollLeft - (x - startX) * 2;
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
        w >= 1440 ? (w - 1440) / 2 : w >= 992 ? 10 : w >= 768 ? 10 : 10;
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

if (window.innerWidth >= 992) {
  const cursor = document.querySelector(".custom-cursor");
  const sliders = document.querySelectorAll(".projects-slider");
  const footer = document.querySelector("footer");

  // Move the cursor with mouse
  document.addEventListener("mousemove", (e) => {
    cursor.style.left = e.clientX + "px";
    cursor.style.top = e.clientY + "px";
  });

  sliders.forEach((slider) => {
    // Handle hover state
    slider.addEventListener("mouseenter", () => {
      cursor.classList.add("slider-hover");
    });

    slider.addEventListener("mouseleave", () => {
      cursor.classList.remove("slider-hover", "arrow-active");
      cursor.textContent = "";
    });

    // Handle direction arrows
    slider.addEventListener("mousemove", (e) => {
      const rect = slider.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;

      const canScrollLeft = slider.scrollLeft > 0;
      const canScrollRight =
        slider.scrollLeft + slider.clientWidth < slider.scrollWidth - 1;

      if (e.clientX < centerX) {
        if (canScrollLeft) {
          cursor.textContent = "←";
          cursor.classList.add("arrow-active");
        } else {
          cursor.textContent = "";
          cursor.classList.remove("arrow-active");
        }
      } else {
        if (canScrollRight) {
          cursor.textContent = "→";
          cursor.classList.add("arrow-active");
        } else {
          cursor.textContent = "";
          cursor.classList.remove("arrow-active");
        }
      }
    });

    // Update cursor when scrolling
    slider.addEventListener("scroll", () => {
      const mouseEvent = new MouseEvent("mousemove", {
        clientX: parseInt(cursor.style.left),
        clientY: parseInt(cursor.style.top),
      });
      slider.dispatchEvent(mouseEvent);
    });
  });

  // Footer hover effect
  if (footer) {
    footer.addEventListener("mouseenter", () => {
      cursor.classList.add("footer-hover");
    });

    footer.addEventListener("mouseleave", () => {
      cursor.classList.remove("footer-hover");
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const sliderSection = document.querySelector(".slider-section");
  const images = document.querySelectorAll(".images-slider > div");
  const textOptions = document.querySelectorAll(".text-slider > div");

  // Create and append progress dots
  const createProgressDots = () => {
    if (!document.querySelector(".slider-progress")) {
      const progressContainer = document.createElement("div");
      progressContainer.className = "slider-progress";

      textOptions.forEach((_, index) => {
        const dot = document.createElement("div");
        dot.className = "slider-progress-dot";
        if (index === 0) dot.classList.add("active");

        dot.addEventListener("click", () => activateSlide(index));
        progressContainer.appendChild(dot);
      });

      sliderSection.appendChild(progressContainer);
    }
  };

  const updateTextVisibility = (textDiv, isActive) => {
    const h3 = textDiv.querySelector("h3");
    const p = textDiv.querySelector("p");
    const span = textDiv.querySelector("span");

    if (isActive) {
      h3.classList.add("activ-text");
      span.classList.remove("d-none");
      p.classList.add("d-none");
    } else {
      h3.classList.remove("activ-text");
      span.classList.add("d-none");
      p.classList.remove("d-none");
    }
  };

  // Main activation logic
  const activateSlide = (index) => {
    images.forEach((imgDiv, i) => {
      imgDiv.classList.toggle("active", i === index);
      imgDiv.classList.toggle("hidden", i !== index);
    });

    textOptions.forEach((textDiv, i) => {
      updateTextVisibility(textDiv, i === index);
    });

    document
      .querySelectorAll(".slider-progress-dot")
      .forEach((dot, i) => dot.classList.toggle("active", i === index));

    currentIndex = index;
  };

  // Make text options interactive
  textOptions.forEach((textDiv, index) => {
    textDiv.style.cursor = "pointer";
    textDiv.setAttribute("tabindex", "0");

    textDiv.addEventListener("click", () => activateSlide(index));
    textDiv.addEventListener("keydown", (e) => {
      if (["Enter", " "].includes(e.key)) {
        e.preventDefault();
        activateSlide(index);
      }
    });
  });

  // Keyboard navigation (only if slider-section hovered)
  document.addEventListener("keydown", (e) => {
    if (!sliderSection.matches(":hover")) return;

    if (["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp"].includes(e.key)) {
      const nextIndex =
        e.key === "ArrowRight" || e.key === "ArrowDown"
          ? (currentIndex + 1) % textOptions.length
          : (currentIndex - 1 + textOptions.length) % textOptions.length;

      activateSlide(nextIndex);
    }
  });

  // Show/hide progress dots on mobile only
  const handleMobileDots = (e) => {
    const dots = document.querySelector(".slider-progress");
    if (dots) dots.style.display = e.matches ? "flex" : "none";
  };

  const mediaQuery = window.matchMedia("(max-width: 767px)");
  mediaQuery.addEventListener("change", handleMobileDots);

  // Auto-rotate
  let currentIndex = 0;
  const autoInterval = setInterval(() => {
    currentIndex = (currentIndex + 1) % textOptions.length;
    activateSlide(currentIndex);
  }, 5000);

  // Stop auto-rotate on manual interaction
  textOptions.forEach((div, index) => {
    div.addEventListener("click", () => {
      clearInterval(autoInterval);
      currentIndex = index;
    });
  });

  // Intersection Observer to trigger first slide
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) activateSlide(0);
      });
    },
    { threshold: 0.4 }
  );

  observer.observe(sliderSection);
  createProgressDots();
  handleMobileDots(mediaQuery);
  activateSlide(0);
});
