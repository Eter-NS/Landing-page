type ButtonElement = HTMLButtonElement | null;
type MenuElement = HTMLUListElement | null;

export default function buttonListening(
  buttonElement: string,
  menuElement: string
): void {
  const button: ButtonElement = document.querySelector(buttonElement),
    menu: MenuElement = document.querySelector(menuElement);

  if (!button || !menu)
    throw new Error(
      "The connection with button/menu failed, please check the name of your element"
    );

  button.addEventListener("click", (): void => {
    menu.ariaExpanded = menu.ariaExpanded === "true" ? "false" : "true";
  });
}
