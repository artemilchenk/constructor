export class KeyboardProcessor {
  constructor({
    inputElement,
    buttonElement,
    resultViewElement,
    dragProcessor,
  }) {
    this.inputElement = inputElement;
    this.buttonElement = buttonElement;
    this.resultViewElement = resultViewElement;
    this.dragProcessor = dragProcessor;

    this.buttonElement.addEventListener("click", () => {
      this.renderText();
    });
  }

  renderText() {
    this.resultViewElement.innerHTML = "";

    this.inputElement.value.split("").forEach((letter) => {
      const letterElement = document.createElement("span");
      letterElement.classList.add("letter");
      letterElement.textContent = letter + "";

      this.dragProcessor.makeDraggable(letterElement);

      this.resultViewElement.appendChild(letterElement);
    });
  }
}
