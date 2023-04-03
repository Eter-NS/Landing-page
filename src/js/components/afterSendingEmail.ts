export default function afterSendingEmail(sectionElement: HTMLElement | null) {
  if (!sectionElement) throw new Error("The element does not exist");
  while (sectionElement.children.length !== 1) {
    if (sectionElement.lastElementChild)
      sectionElement.removeChild(sectionElement.lastElementChild);
  }
  sectionElement.classList.add("is-sent");
  const documentFragment = document.createDocumentFragment(),
    p = document.createElement("p"),
    p2 = document.createElement("p");
  p.classList.add("contact__p");
  p2.classList.add("contact__p");
  p.textContent = "Thank you for your time 😃";
  p2.textContent = "I will text you very soon!";
  documentFragment.appendChild(p);
  documentFragment.appendChild(p2);

  sectionElement.append(documentFragment);
}
