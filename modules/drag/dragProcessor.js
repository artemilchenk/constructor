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

      this.draggedElement.forEach((element, index) => {
        const rect = element.getBoundingClientRect();

        element._dragOffsetX = e.clientX - rect.left;
        element._dragOffsetY = e.clientY - rect.top;

        element._dragStartLeft = rect.left - this.containerRect.left - 4;
        element._dragStartTop = rect.top - this.containerRect.top - 4;

        element.style.left = `${element._dragStartLeft}px`;
        element.style.top = `${element._dragStartTop}px`;
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

    this.draggedElement.forEach((element) => {
      const letterUnder = this.interactionProcessor.checkUnder(e, element, {
        offsetX: element._dragOffsetX,
        offsetY: element._dragOffsetY,
      });

      if (letterUnder) {
        if(!this.draggedElement.includes(letterUnder)){
          if (this.interactionProcessor.checkForViewUnder(element, letterUnder)) {
            console.log(0)
            element.classList.remove("active");
            element.style.position = "unset";
          } else if (
              this.interactionProcessor.checkForViewLetterOver(element, letterUnder)
          ) {
            console.log(1)
            letterUnder.style.position = "unset";
            element.classList.remove("active");
          } else {
            this.transformProcessor.swap(letterUnder);
          }
        }
      } else {
        element.classList.add("active");
      }

      element.classList.remove("active-drag");
    });

    this.transformProcessor.resetStartShift();
    this.draggedElement = null;
  };
}

export default DragProcessor;
