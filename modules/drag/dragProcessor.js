class DragProcessor {
  draggedElement = null;
  interactionProcessor = null;
  transformProcessor = null;

  container = null;
  containerRect = null;

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

      const selected = this.interactionProcessor.getSelectedLetters();

      if (selected.includes(el)) {
        this.draggedElement = selected;
      } else this.draggedElement = [el];

      this.draggedElement.forEach((letter) => {
        letter.classList.add("active-drag");
      });

      this.interactionProcessor.unsetSelected(selected);

      this.containerRect = this.container.getBoundingClientRect();

      this.draggedElement.forEach((element) => {
        const rect = element.getBoundingClientRect();

        element._dragOffsetX = e.clientX - rect.left;
        element._dragOffsetY = e.clientY - rect.top;

        element._dragPrevLeft = rect.left - this.containerRect.left - 4;
        element._dragPrevTop = rect.top - this.containerRect.top - 4;

        element._prevPosition = element.style.position;

        element.style.left = `${element._dragPrevLeft}px`;
        element.style.top = `${element._dragPrevTop}px`;
      });
    });
  }

  onMouseMove = (e) => {
    if (!this.draggedElement) return;

    this.draggedElement.forEach((element) => {
      element.style.position = "absolute";

      const x = e.clientX - this.containerRect.left - element._dragOffsetX;
      const y = e.clientY - this.containerRect.top - element._dragOffsetY;

      this.transformProcessor.shift(element, x, y);
    });
  };

  onMouseUp = (e) => {
    if (!this.draggedElement) return;

    this.draggedElement.forEach((dragged) => {
      const rect = dragged.getBoundingClientRect();

      dragged._dragCurrentLeft = rect.left - this.containerRect.left - 4;
      dragged._dragCurrentTop = rect.top - this.containerRect.top - 4;

      const target = this.interactionProcessor.checkUnder(dragged);

      dragged.classList.remove("active-drag");

      if (!target) return;

      this.transformProcessor.swap(dragged, target);
    });

    this.draggedElement = null;
  };
}

export default DragProcessor;
