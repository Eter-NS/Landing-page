export default function moveToSection() {
  const linksToSections =
    document.querySelectorAll<HTMLLinkElement>(".moveLink");

  const sections = Array.from(
    document.querySelectorAll<HTMLTableSectionElement>("section")
  );

  const navbarHeight = document
    .querySelector<HTMLTableSectionElement>("nav")
    ?.getBoundingClientRect().height as number;
  const securityMarginForMovement = 25;

  linksToSections.forEach((linkElement) => {
    linkElement.addEventListener("click", () => {
      const destinationName = linkElement.dataset.destination;
      const destinationElement = sections.find(
        (section) => section.id === destinationName
      );

      const destinationYPosition =
        destinationElement!.getBoundingClientRect().top;
      if (destinationName === "home") {
        const homeYPosition = 0;
        window.scrollTo({ behavior: "smooth", top: homeYPosition });
      } else {
        const movement =
          document.documentElement.scrollTop +
          (destinationYPosition - navbarHeight - securityMarginForMovement);
        window.scrollTo({
          behavior: "smooth",
          top: movement,
        });
      }
    });
  });
}

/*

function scrollToY(scrollTargetY, speed) {
  var scrollY = window.scrollY,
    scrollTargetY = scrollTargetY || 0,
    speed = speed || 2000,
    currentTime = 0;

  // min time .1, max time .8 seconds
  var time = Math.max(.1, Math.min(Math.abs(scrollY - scrollTargetY) / speed, .8));

  // add animation loop
  function tick() {
    currentTime += 1 / 60;
    var p = currentTime / time;
    var t = p;

    if (p < 1) {
      requestAnimationFrame(tick);
      window.scrollTo(0, scrollY + ((scrollTargetY - scrollY) * t));
    } else {
      window.scrollTo(0, scrollTargetY);
    }
  }

  // call it once to get started
  tick();
}

// scroll it!
scrollToY(500, 1500);

*/
