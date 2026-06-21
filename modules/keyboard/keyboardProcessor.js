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
      if (!letter.trim()) return;

      const letterElement = document.createElement("span");
      letterElement.classList.add("letter");
      letterElement.style.position = "static";
      letterElement.textContent = letter + "";
      letterElement.dataset.id = crypto.randomUUID();

      this.dragProcessor.makeDraggable(letterElement);

      this.resultViewElement.appendChild(letterElement);
    });
  }
}
