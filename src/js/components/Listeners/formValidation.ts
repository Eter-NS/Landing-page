interface CustomErrorMessages {
  patternMismatch?: string;
  valueMissing?: string;
  tooShort?: string;
  tooLong?: string;
}
type ErrorMessages = Required<CustomErrorMessages>;

class FormValidation {
  form: HTMLFormElement;
  _inputElements: (HTMLInputElement | HTMLTextAreaElement)[];
  _button: HTMLButtonElement | HTMLInputElement;
  _errorMessages: ErrorMessages;

  constructor(
    public name: string,
    customErrMessages: CustomErrorMessages = {}
  ) {
    this.form = this._checkNullPossibility(document.querySelector(name));
    this.form.noValidate = true;
    const _inputElementsWithSubmit = Array.from(
      this.form.querySelectorAll("input")
    );
    this._inputElements = this._removeSubmitTypeInputs(
      _inputElementsWithSubmit
    );
    this._inputElements.push(
      this._checkNullPossibility(this.form.querySelector("textarea"))
    );
    this._button = this._checkNullPossibility(
      this.form.querySelector("button") ??
        this.form.querySelector("input[type=submit]")
    );

    this._errorMessages = this._defineErrorMessages(customErrMessages);
    this._boundListeners;
  }
  // Listeners
  private _boundListeners() {
    this.form.addEventListener("input", (e) => {
      this._checkInput(e.target as HTMLInputElement | HTMLTextAreaElement);
    });
  }

  // Validators
  private _checkInput = (element: HTMLInputElement | HTMLTextAreaElement) => {
    const localErrFlag = !element.checkValidity(),
      validity = element.validity;

    this._toggleError(element, localErrFlag, this._passErrorMessage(validity));
  };

  private _passErrorMessage = (validity: ValidityState): string => {
    const errorMessagesArray: string[] = [];
    if (validity.patternMismatch)
      errorMessagesArray.push(this._errorMessages["patternMismatch"]);
    if (validity.valueMissing)
      errorMessagesArray.push(this._errorMessages["valueMissing"]);
    if (validity.tooShort)
      errorMessagesArray.push(this._errorMessages["tooShort"]);
    if (validity.tooLong)
      errorMessagesArray.push(this._errorMessages["tooLong"]);

    return errorMessagesArray.join(" <br>");
  };

  private _toggleError = (
    element: HTMLInputElement | HTMLTextAreaElement,
    status: boolean,
    message: string = ""
  ) => {
    let brotherElement = element.nextElementSibling;

    if (brotherElement) {
      brotherElement.innerHTML = message;
      brotherElement.classList.toggle("error-text", status);
    } else if (status) {
      brotherElement = document.createElement("p");
      brotherElement.innerHTML = message;
      brotherElement.classList.add("error-text");
    } else {
      return;
    }
  };

  // Data filters
  private _checkNullPossibility<T>(element: T | null) {
    if (element != null) {
      return element;
    } else {
      throw new Error("The element is null");
    }
  }
  private _removeSubmitTypeInputs<T extends HTMLInputElement>(inputs: T[]) {
    return inputs.filter((element) => element.type !== "submit");
  }

  _defineErrorMessages(userMessages: CustomErrorMessages): ErrorMessages {
    const defaultMessages: ErrorMessages = {
      patternMismatch: "This is not an email 😓",
      valueMissing: "This space is empty 😟",
      tooShort: "Your value is too short, please expand it",
      tooLong: "Your value is too short, please reduce it",
    };

    return { ...defaultMessages, ...userMessages };
  }
}

export { FormValidation };
export type { CustomErrorMessages, ErrorMessages };
