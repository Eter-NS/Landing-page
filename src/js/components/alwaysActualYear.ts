export default function alwaysActualYear() {
  const footerTrademarkElement =
    document.querySelector<HTMLParagraphElement>(".footer__trademark");

  if (!footerTrademarkElement?.textContent)
    throw new Error(
      "The .footer__trademark element is not defined in the document or its name has changed"
    );

  footerTrademarkElement.textContent =
    footerTrademarkElement.textContent.replace(
      "{year}",
      `${new Date().getFullYear()}`
    );
}
