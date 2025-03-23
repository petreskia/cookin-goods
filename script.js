document.addEventListener("DOMContentLoaded", () => {
  const sliders = document.querySelectorAll(".projects-slider");

  sliders.forEach((slider, index) => {
    let isDragging = false;
    let startX = 0;
    let scrollLeft = 0;
    let initialMargin = "";

    if (window.innerWidth >= 1440) {
      initialMargin = window.getComputedStyle(slider).marginLeft;
    }

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
      const fixedScrollAmount = 453;

      if (clickX < sliderCenterX) {
        slider.scrollLeft -= fixedScrollAmount;
      } else {
        slider.scrollLeft += fixedScrollAmount;
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

// About Section scroll

document.addEventListener("DOMContentLoaded", () => {
  const teamInfo = document.querySelector(".team-info");
  const servicesInfo = document.querySelector(".services-info");
  const aboutSection = document.querySelector(".about-section");

  let isFooterAtTop = false;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        isFooterAtTop = entry.isIntersecting; // Update flag based on intersection
      });
    },
    { threshold: 0 }
  );

  observer.observe(aboutSection);

  servicesInfo.addEventListener("wheel", (event) => {
    event.preventDefault();

    if (isFooterAtTop) {
      const maxScrollTop = teamInfo.scrollHeight - teamInfo.clientHeight;

      if (teamInfo.scrollTop >= maxScrollTop && event.deltaY > 0) {
        window.scrollBy({ top: event.deltaY, behavior: "auto" });
      } else {
        teamInfo.scrollTop += event.deltaY;

        if (teamInfo.scrollTop < 0) {
          teamInfo.scrollTop = 0;
        } else if (teamInfo.scrollTop > maxScrollTop) {
          teamInfo.scrollTop = maxScrollTop;
        }
      }

      if (teamInfo.scrollTop === 0 && event.deltaY < 0) {
        window.scrollBy({ top: event.deltaY, behavior: "auto" });
      }
    } else {
      window.scrollBy({ top: event.deltaY, behavior: "auto" });
    }
  });

  servicesInfo.addEventListener("touchmove", (event) => {
    event.preventDefault();

    if (isFooterAtTop) {
      const maxScrollTop = teamInfo.scrollHeight - teamInfo.clientHeight;

      if (
        teamInfo.scrollTop >= maxScrollTop &&
        event.touches[0].clientY < event.touches[0].clientY
      ) {
        window.scrollBy({
          top: event.touches[0].clientY - event.touches[0].clientY,
          behavior: "auto",
        });
      } else {
        teamInfo.scrollTop +=
          event.touches[0].clientY - event.touches[0].clientY;

        if (teamInfo.scrollTop < 0) {
          teamInfo.scrollTop = 0;
        } else if (teamInfo.scrollTop > maxScrollTop) {
          teamInfo.scrollTop = maxScrollTop;
        }
      }

      if (
        teamInfo.scrollTop === 0 &&
        event.touches[0].clientY > event.touches[0].clientY
      ) {
        window.scrollBy({
          top: event.touches[0].clientY - event.touches[0].clientY,
          behavior: "auto",
        });
      }
    } else {
      window.scrollBy({
        top: event.touches[0].clientY - event.touches[0].clientY,
        behavior: "auto",
      });
    }
  });
});
