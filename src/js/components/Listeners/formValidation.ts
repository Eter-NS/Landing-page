import afterSendingEmail from "../afterSendingEmail";

interface CustomErrorMessages {
  patternMismatch?: string;
  valueMissing?: string;
  tooShort?: string;
  tooLong?: string;
  summaryErrorOnButton?: string;
  textPatternMismatch?: string;
}
type ErrorMessages = Required<CustomErrorMessages>;
type inputType = HTMLInputElement | HTMLTextAreaElement;
type sendFormatData = {
  [key: string]: string;
};

class FormValidation {
  _form: HTMLFormElement;
  _inputElements: inputType[];
  _button: HTMLButtonElement | HTMLInputElement;
  _errorMessages: ErrorMessages;
  _inputErrorLog: { [key: string]: boolean };

  constructor(
    public name: string,
    customErrMessages: CustomErrorMessages = {}
  ) {
    this._form = this._checkNullPossibility(document.querySelector(name));
    // turns the standard HTML Validation off
    this._form.noValidate = true;
    const _inputElementsWithSubmit = Array.from(
      this._form.querySelectorAll("input")
    );
    this._inputElements = this._removeSubmitTypeInputs(
      _inputElementsWithSubmit
    );
    this._inputElements.push(
      this._checkNullPossibility(this._form.querySelector("textarea"))
    );
    this._button = this._checkNullPossibility(
      this._form.querySelector("button") ??
        this._form.querySelector("input[type=submit]")
    );

    this._errorMessages = this._defineErrorMessages(customErrMessages);
    this._inputErrorLog = {
      emailInput: false,
      topicInput: false,
      messageInput: false,
    };
    this._boundListeners();
  }
  // Listeners
  private _boundListeners() {
    this._inputElements.forEach((input) => {
      input.onblur = (e) => {
        this._setAttributes(e.target as inputType);
        this._checkInput(e.target as inputType);
      };
    });

    this._form.onsubmit = (e) => {
      e.preventDefault();
      const hasError = this._beforeSend(this._inputElements);
      if (hasError) {
        this._toggleError(
          this._button,
          hasError,
          this._errorMessages.summaryErrorOnButton
        );
        return;
      }
      this._send().then(() => {
        afterSendingEmail(this._form.parentElement);
      });
      // .catch((error) => {
      //   console.error(error);
      // });
    };
  }

  // Validators
  private _checkInput = (element: inputType) => {
    const localErrFlag = !element.checkValidity(),
      validity = element.validity;

    // This if prevents refreshing the error display if it is written correctly
    if (this._inputErrorLog[element.id] || localErrFlag) {
      if (element.type === "email") {
        this._toggleError(
          element,
          localErrFlag,
          this._passErrorMessage(validity)
        );
      } else {
        this._toggleError(
          element,
          localErrFlag,
          this._passErrorMessage(validity, "textPatternMismatch")
        );
      }
      this._inputErrorLog[element.id] = localErrFlag;
    }
    return localErrFlag;
  };
  private _beforeSend = (elements: inputType[]): boolean => {
    let hasError = false;
    elements.forEach((el) => {
      hasError = this._checkInput(el);
      if (hasError) return;
    });
    return hasError;
  };

  /*
  Not implemented entirely - reason - no REST API implemented
  */
  private _send = async () => {
    const sendPackageObj: sendFormatData = {
      emailInput: "",
      topicInput: "",
      messageInput: "",
    };
    this._inputElements.forEach(({ id, value }) => {
      sendPackageObj[id] = value;
    });
    // const options: RequestInit = {
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   method: "POST",
    //   cache: "no-cache",
    //   body: JSON.stringify(sendPackageObj),
    // };

    // const response = await fetch("http://localhost:9586/", options);
    return Promise.resolve();
  };

  // error message handling
  private _passErrorMessage = (
    validity: ValidityState,
    trigger: string = ""
  ): string => {
    let errorMessagesArray: string[] = [];

    if (validity.patternMismatch || trigger === "patternMismatch")
      errorMessagesArray.push(this._errorMessages["patternMismatch"]);

    if (validity.valueMissing || trigger === "valueMissing")
      errorMessagesArray.push(this._errorMessages["valueMissing"]);

    if (validity.tooShort || trigger === "tooShort")
      errorMessagesArray.push(this._errorMessages["tooShort"]);

    if (validity.tooLong || trigger === "tooLong")
      errorMessagesArray.push(this._errorMessages["tooLong"]);

    if (trigger === "textPatternMismatch") {
      if (errorMessagesArray.includes(this._errorMessages["patternMismatch"])) {
        // replaces the messages from patternMismatch to textPatternMismatch
        errorMessagesArray = errorMessagesArray.filter(
          (errMes) => errMes !== this._errorMessages["patternMismatch"]
        );
        errorMessagesArray.push(this._errorMessages["textPatternMismatch"]);
      }
    }

    return errorMessagesArray.join(" <br>");
  };

  private _toggleError = (
    element: inputType | HTMLButtonElement,
    status: boolean,
    message: string = ""
  ) => {
    let brotherElement = element.nextElementSibling as HTMLElement;

    if (brotherElement?.hasAttribute("data-error-element")) {
      brotherElement.innerHTML = message;
      brotherElement.style.display = status ? "block" : "none";
    } else if (status) {
      brotherElement = document.createElement("p");
      brotherElement.dataset.errorElement = "true";
      brotherElement.innerHTML = message;
      brotherElement.classList.add("error-text");
      element.parentElement?.append(brotherElement);
    } else {
      return;
    }
  };

  // Assigning validation attributes (in case if anyone would have changed them)
  private _setAttributes(element: inputType) {
    if (element.type === "email") {
      element.required = true;
      element.setAttribute("autocomplete", "email");
      const emailRegExp = /^[\w\d\.]+@[\w\d]+\.[\w]{2,3}$/.source;
      element.setAttribute("pattern", `${emailRegExp}`);
      element.setAttribute("maxLength", "40");
    } else if (element.type === "text") {
      element.required = true;
      const subjectRegExp = /^[^<>]*$/.source;
      element.setAttribute("pattern", `${subjectRegExp}`);
      element.setAttribute("maxLength", "40");
      element.setAttribute("minLength", "6");
    } else if (element.localName === "textarea") {
      element.required = true;
      const messageRegExp = /^[^<>]*$/.source;
      element.setAttribute("pattern", `${messageRegExp}`);
      element.setAttribute("minLength", "10");
    } else {
      throw new Error("Unknown HTML element has been found");
    }
  }

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
      tooShort: "Your value is too short, please expand it.",
      tooLong: "Your value is too short, please reduce it.",
      summaryErrorOnButton: "Oops, you've missed some elements above 🤔",
      textPatternMismatch: "Hey, you can't write '<' and '>' here!",
    };

    return { ...defaultMessages, ...userMessages };
  }
}

export { FormValidation };
export type { CustomErrorMessages, ErrorMessages };
