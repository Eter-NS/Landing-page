export default function IntersectionObserverForSections(
  elementArray: string[]
) {
  const addedDOMElements: Array<HTMLElement> = [];
  /* parameter type checking */
  if (typeof elementArray !== "object" || !("push" in elementArray)) {
    throw new Error(
      `The elementArray is not an Array, please check the input parameter.`
    );
  }
  /* defining observer */
  const observerOptions: IntersectionObserverInit = {
      rootMargin: `-15%`,
      //   threshold: 0.5,
    },
    observer = new IntersectionObserver(observerCallback, observerOptions);

  /* query over each DOM element, then adding it to observer.observe() */
  elementArray.forEach((nameOfDOMElement) => {
    const matchedElement =
      document.querySelector<HTMLElement>(nameOfDOMElement);
    if (!matchedElement) {
      throw new Error(
        `The element has not been found, please check the entries of the input parameter.`
      );
    }
    addedDOMElements.push(matchedElement);

    observer.observe(matchedElement);
  });

  /* functions */

  function observerCallback(entries: IntersectionObserverEntry[]) {
    entries.forEach((el) => {
      if (el.isIntersecting) {
        el.target.classList.remove("is-hidden");
      } else {
        el.boundingClientRect.bottom - window.innerHeight * 0.2 <= 0
          ? el.target.classList.remove("is-hidden")
          : el.target.classList.add("is-hidden");
      }
    });
  }
}
