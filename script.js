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
      // slider.style.cursor = "grabbing";
      e.preventDefault();
    });

    slider.addEventListener("mouseleave", () => {
      if (isDragging) {
        isDragging = false;
        slider.style.scrollBehavior = "smooth";
        // slider.style.cursor = "grab";
      }
    });

    slider.addEventListener("mouseup", () => {
      isDragging = false;
      slider.style.scrollBehavior = "smooth";
      // slider.style.cursor = "grab";

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

// Cursor
if (window.innerWidth >= 992) {
  const cursor = document.querySelector(".custom-cursor");
  const sliders = document.querySelectorAll(".projects-slider");

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
      cursor.classList.remove("slider-hover");
      cursor.classList.remove("arrow-active");
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
}

// Carousel
document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll(".slider-btn");
  const contentItems = document.querySelectorAll(".content-item");

  // Function to set active content
  function setActiveContent(category) {
    // Remove active class from all buttons and content items
    buttons.forEach((btn) => btn.classList.remove("active"));
    contentItems.forEach((item) => item.classList.remove("active"));

    // Add active class to selected button
    const activeButton = document.querySelector(
      `.slider-btn[data-category="${category}"]`
    );
    if (activeButton) {
      activeButton.classList.add("active");
    }

    // Add active class to corresponding content item
    const activeContent = document.getElementById(category);
    if (activeContent) {
      activeContent.classList.add("active");
    }
  }

  // Add click event listeners to all buttons
  buttons.forEach((button) => {
    button.addEventListener("click", function () {
      const category = this.getAttribute("data-category");
      setActiveContent(category);
    });
  });

  // Auto-rotate through slides every 5 seconds
  let currentIndex = 0;
  const categories = Array.from(buttons).map((btn) =>
    btn.getAttribute("data-category")
  );

  function autoRotate() {
    currentIndex = (currentIndex + 1) % categories.length;
    setActiveContent(categories[currentIndex]);
  }

  // Start auto-rotation
  const intervalId = setInterval(autoRotate, 5000);

  // Stop auto-rotation when user interacts with buttons
  buttons.forEach((button) => {
    button.addEventListener("click", function () {
      clearInterval(intervalId);
      // Update current index based on clicked button
      currentIndex = categories.indexOf(this.getAttribute("data-category"));
    });
  });
});

const sliderSection = document.querySelector(".slider-section");
const images = document.querySelectorAll(".images-slider > div");
const textOptions = document.querySelectorAll(".text-slider > div");

function activateSlide(index) {
  // Update images - show only the selected one
  images.forEach((imgDiv, i) => {
    imgDiv.classList.toggle("active", i === index);
    imgDiv.classList.toggle("hidden", i !== index);
  });

  // Update text options - make only the selected one active
  textOptions.forEach((textDiv, i) => {
    const h3 = textDiv.querySelector("h3");
    const p = textDiv.querySelector("p");

    if (i === index) {
      h3.classList.add("activ-text");
      p.classList.add("activ-text");
    } else {
      h3.classList.remove("activ-text");
      p.classList.remove("activ-text");
    }
  });
}

// Add click event listeners to each text option
textOptions.forEach((textOption, index) => {
  textOption.addEventListener("click", () => {
    activateSlide(index);
  });

  // Make text options appear clickable
  textOption.style.cursor = "pointer";
});

// Intersection observer to detect when slider-section is in view
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        activateSlide(0); // Activate first slide when section comes into view
      }
    });
  },
  {
    threshold: 0.4, // Trigger when 40% is visible
  }
);

observer.observe(sliderSection);

// Initialize the first slide as active
activateSlide(0);

// Add this to your existing JavaScript to create progress indicators
document.addEventListener("DOMContentLoaded", () => {
  // Create progress indicators
  const textOptions = document.querySelectorAll(".text-slider > div");
  const sliderSection = document.querySelector(".slider-section");

  // Create progress container if it doesn't exist
  if (!document.querySelector(".slider-progress")) {
    const progressContainer = document.createElement("div");
    progressContainer.className = "slider-progress";

    // Create a dot for each slide
    textOptions.forEach((_, index) => {
      const dot = document.createElement("div");
      dot.className = "slider-progress-dot";
      if (index === 0) dot.classList.add("active");

      // Add click event to each dot
      dot.addEventListener("click", () => {
        activateSlide(index);
      });

      progressContainer.appendChild(dot);
    });

    sliderSection.appendChild(progressContainer);
  }

  // Update the original activateSlide function to also update progress dots
  const originalActivateSlide = window.activateSlide;

  window.activateSlide = (index) => {
    // Call the original function
    originalActivateSlide(index);

    // Update progress dots
    const dots = document.querySelectorAll(".slider-progress-dot");
    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === index);
    });
  };

  // Add keyboard navigation
  document.addEventListener("keydown", (e) => {
    if (!document.querySelector(".slider-section:hover")) return;

    const activeIndex = Array.from(textOptions).findIndex((div) =>
      div.querySelector("h3.activ-text")
    );

    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      const nextIndex = (activeIndex + 1) % textOptions.length;
      activateSlide(nextIndex);
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      const prevIndex =
        (activeIndex - 1 + textOptions.length) % textOptions.length;
      activateSlide(prevIndex);
    }
  });

  // Make text options keyboard focusable
  textOptions.forEach((option) => {
    option.setAttribute("tabindex", "0");
    option.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        const index = Array.from(textOptions).indexOf(option);
        activateSlide(index);
      }
    });
  });

  // Show progress dots on mobile
  const mediaQuery = window.matchMedia("(max-width: 767px)");
  function handleScreenChange(e) {
    const progressContainer = document.querySelector(".slider-progress");
    if (progressContainer) {
      progressContainer.style.display = e.matches ? "flex" : "none";
    }
  }

  mediaQuery.addEventListener("change", handleScreenChange);
  handleScreenChange(mediaQuery);
});
