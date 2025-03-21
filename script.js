document.addEventListener("DOMContentLoaded", () => {
  const sliders = document.querySelectorAll(".projects-slider");

  sliders.forEach((slider, index) => {
    let isDragging = false;
    let startX = 0;
    let scrollLeft = 0;
    let initialMargin = "";

    function getCardWidth(card) {
      return card.offsetWidth + 15;
    }

    if (window.innerWidth >= 1440) {
      initialMargin = window.getComputedStyle(slider).marginLeft;
    }

    function removeMargin() {
      if (initialMargin) {
        slider.style.marginLeft = "0";
      }
    }

    slider.addEventListener("mousedown", removeMargin);
    slider.addEventListener("touchstart", removeMargin);
    slider.addEventListener("click", removeMargin);

    slider.addEventListener(
      "wheel",
      (e) => {
        e.preventDefault();
        document.body.style.overflowY = "hidden";

        window.scrollBy({
          left: e.deltaY,
          behavior: "smooth",
        });

        setTimeout(() => {
          document.body.style.overflowY = "auto";
        }, 300);
      },
      { passive: false }
    );

    slider.addEventListener("touchstart", (e) => {
      isDragging = true;
      startX = e.touches[0].pageX - slider.offsetLeft;
      scrollLeft = slider.scrollLeft;
      slider.style.scrollBehavior = "auto";
    });

    slider.addEventListener("touchend", () => {
      isDragging = false;
      slider.style.scrollBehavior = "smooth";
    });

    slider.addEventListener("touchmove", (e) => {
      if (!isDragging) return;
      const x = e.touches[0].pageX - slider.offsetLeft;
      const walk = (x - startX) * 1;
      slider.scrollLeft = scrollLeft - walk;
    });

    slider.addEventListener("click", (e) => {
      if (isDragging) {
        return;
      }

      const clickX = e.clientX - slider.getBoundingClientRect().left;
      const sliderCenterX = slider.offsetWidth / 2;
      const firstCardWidth = getCardWidth(
        slider.querySelector(".project-card")
      );

      if (clickX < sliderCenterX) {
        slider.scrollLeft -= firstCardWidth;
      } else {
        slider.scrollLeft += firstCardWidth;
      }
    });

    slider.addEventListener("mousedown", (e) => {
      e.preventDefault();
      isDragging = true;
      startX = e.pageX - slider.offsetLeft;
      scrollLeft = slider.scrollLeft;
      slider.style.scrollBehavior = "auto";
    });

    slider.addEventListener("mouseleave", () => {
      isDragging = false;
      slider.style.scrollBehavior = "smooth";
    });

    slider.addEventListener("mouseup", () => {
      isDragging = false;
      slider.style.scrollBehavior = "smooth";
    });

    slider.addEventListener("mousemove", (e) => {
      if (!isDragging) return;
      e.preventDefault();
      const x = e.pageX - slider.offsetLeft;
      const walk = (x - startX) * 1;
      slider.scrollLeft = scrollLeft - walk;
    });

    function smoothReturn() {
      slider.style.scrollBehavior = "smooth";
      slider.scrollLeft = 0;
      setTimeout(() => {
        slider.style.scrollBehavior = "auto";
      }, 500);
    }

    slider.addEventListener("scroll", () => {
      if (slider.scrollLeft === 0) {
        slider.style.marginLeft = initialMargin;
      }
    });

    function updateMargins() {
      const sliderMargin = parseInt(window.getComputedStyle(slider).marginLeft);
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
    }
    updateMargins();
    window.addEventListener("resize", updateMargins);
  });
});
