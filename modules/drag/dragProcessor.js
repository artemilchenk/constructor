export class DragProcessor {
  draggedElement = null;
  interactionProcessor = null;
  transformProcessor = null;

  offsetX = 0;
  offsetY = 0;

  container = null;
  containerRect = null;

  dragStartLeft = 0;
  dragStartTop = 0;

  constructor(container, interactionProcessor, transformProcessor) {
    this.container = container;
    this.interactionProcessor = interactionProcessor;
    this.transformProcessor = transformProcessor;

    this.container.style.position = "relative";

    document.addEventListener("mousemove", this.onMouseMove);
    document.addEventListener("mouseup", this.onMouseUp);
  }

  makeDraggable(el) {
    el.addEventListener("mousedown", (e) => {
      e.preventDefault();
      e.stopPropagation();

      if (el.classList.contains("selected")) {
        el.classList.remove("selected");
      }

      this.draggedElement = el;

      this.containerRect = this.container.getBoundingClientRect();

      const rect = el.getBoundingClientRect();

      this.dragStartLeft = rect.left - this.containerRect.left - 4;
      this.dragStartTop = rect.top - this.containerRect.top - 4;

      el.style.position = "absolute";
      el.style.left = `${this.dragStartLeft}px`;
      el.style.top = `${this.dragStartTop}px`;

      this.offsetX = e.clientX - rect.left;
      this.offsetY = e.clientY - rect.top;

      el.style.zIndex = 1000;
    });
  }

  onMouseMove = (e) => {
    if (!this.draggedElement) return;

    const x = e.clientX - this.containerRect.left - this.offsetX;
    const y = e.clientY - this.containerRect.top - this.offsetY;

    this.transformProcessor.shift(this.draggedElement, x, y);
  };

  onMouseUp = (e) => {
    if (!this.draggedElement) return;

    this.draggedElement.style.zIndex = 0;

    const letterUnder = this.interactionProcessor.checkUnder(
      e,
      this.draggedElement,
      { offsetX: this.offsetX, offsetY: this.offsetY },
    );

    if (letterUnder) {
      if (
        this.interactionProcessor.checkForViewUnder(
          this.draggedElement,
          letterUnder,
        )
      ) {
        this.draggedElement.style.position = "unset";
      } else if (
        this.interactionProcessor.checkForViewLetterOver(
          this.draggedElement,
          letterUnder,
        )
      ) {
        letterUnder.style.position = "unset";
      } else {
        this.draggedElement.classList.add("active");
        this.transformProcessor.swap(letterUnder);
      }
    }

    this.draggedElement.classList.add("active");

    this.transformProcessor.resetStartShift();
    this.draggedElement = null;
  };
}
