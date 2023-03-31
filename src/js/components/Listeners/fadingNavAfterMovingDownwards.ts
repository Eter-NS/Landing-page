import throttle from "../throttle func";

const fadingNavAfterMovingDownwards = {
  navElement: document.querySelector<HTMLTableSectionElement>(".navbar"),
  savedScrollPosition: 0,

  checkScrollMovement() {
    if (!this.navElement)
      throw new Error(
        "The .navbar element is not defined in the document or its name has changed"
      );
    const isMovingDownwards = window.scrollY > this.savedScrollPosition;
    this.navElement.classList.toggle("fade-out", isMovingDownwards);
    this.savedScrollPosition = window.scrollY;
  },

  start() {
    this.checkScrollMovement = this.checkScrollMovement.bind(this);
    // desktop mode
    document.addEventListener("wheel", () => {
      throttle(this.checkScrollMovement, 300)();
    });
    // mobile mode
    document.addEventListener("touchmove", () => {
      throttle(this.checkScrollMovement, 300)();
    });
  },
};

export default fadingNavAfterMovingDownwards;
