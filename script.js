document.addEventListener("DOMContentLoaded", () => {
  const sliders = document.querySelectorAll(".projects-slider");
  const videoOverlays = document.querySelectorAll(".video-overlay");

  sliders.forEach((slider, index) => {
    console.log("Slider Index:", index, slider);
    const cardWidth = slider.querySelector(".project-card").offsetWidth + 15;
    const sliderWidth = slider.offsetWidth;
    const contentWidth = slider.scrollWidth;
    let marginRemoved = false;
    let atStart = true;

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

    // Update margins on initial load
    updateMargins();

    slider.addEventListener("click", (e) => {
      console.log("Clicked Slider Index:", index);
      console.log("Clicked Target:", e.target);
      console.log("Before Scroll:", slider.scrollLeft);
      const clickX = e.clientX - slider.getBoundingClientRect().left;
      const sliderCenterX = sliderWidth / 2;

      if (clickX < sliderCenterX) {
        slider.scrollLeft -= cardWidth;
      } else {
        slider.scrollLeft += cardWidth;
      }

      console.log("After Scroll:", slider.scrollLeft);
      e.stopPropagation();

      if (!marginRemoved && slider.scrollLeft !== 0) {
        slider.style.marginLeft = "0";
        marginRemoved = true;
      }

      if (atStart && marginRemoved) {
        slider.style.transition = "scroll-left 0.5s ease-in-out";
        slider.style.marginLeft = "";
        marginRemoved = false;
        atStart = false;
        setTimeout(() => {
          slider.style.transition = "";
        }, 500);
      }

      atStart = slider.scrollLeft === 0;
    });

    slider.addEventListener("scroll", () => {
      if (slider.scrollLeft < 0) {
        slider.scrollLeft = 0;
      } else if (slider.scrollLeft > contentWidth - sliderWidth) {
        slider.scrollLeft = contentWidth - sliderWidth;
      }

      if (!marginRemoved && slider.scrollLeft !== 0) {
        slider.style.marginLeft = "0";
        marginRemoved = true;
      }

      atStart = slider.scrollLeft === 0;
    });

    // Update margins on resize
    window.addEventListener("resize", updateMargins);
  });

  videoOverlays.forEach((overlay) => {
    overlay.addEventListener("click", (e) => {
      e.preventDefault();
      const slider = overlay.closest(".projects-slider");
      if (slider) {
        const sliderRect = slider.getBoundingClientRect();
        const clickX = e.clientX - sliderRect.left;
        const clickY = e.clientY - sliderRect.top;
        slider.dispatchEvent(
          new MouseEvent("click", {
            clientX: e.clientX,
            clientY: e.clientY,
            bubbles: false,
            cancelable: true,
            view: window,
          })
        );
      }
      e.stopPropagation();
    });
  });
});
