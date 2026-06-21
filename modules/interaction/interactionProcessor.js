export class InteractionProcessor {
  box = null;
  startX = 0;
  startY = 0;
  transformProcessor = null;

  constructor(transformProcessor) {
    this.transformProcessor = transformProcessor;
  }

  checkOffSetX(event, x) {
    return document.elementFromPoint(event.clientX - x, event.clientY);
  }

  checkOffSetY(event, y) {
    return document.elementFromPoint(event.clientX, event.clientY - y);
  }

  checkOffSet(event, x, y) {
    return document.elementFromPoint(event.clientX - x, event.clientY - y);
  }

  checkINSetX(event, x) {
    return document.elementFromPoint(event.clientX + x, event.clientY);
  }

  checkINSetY(event, y) {
    return document.elementFromPoint(event.clientX, event.clientY + y);
  }

  checkINSet(event, x, y) {
    return document.elementFromPoint(event.clientX + x, event.clientY + y);
  }

  check(event) {
    return document.elementFromPoint(event.clientX, event.clientY);
  }

  checkUnder(event, draggedElement, { offsetX, offsetY }) {
    const rectDragged = draggedElement.getBoundingClientRect();
    const inSetX = Math.round(rectDragged.width - offsetX);
    const inSetY = Math.round(rectDragged.height - offsetY);

    draggedElement.style.pointerEvents = "none";

    const targetOff = this.checkOffSet(event, offsetX, offsetY);
    const targetOffX = this.checkOffSetX(event, offsetX);
    const targetOffY = this.checkOffSetY(event, offsetY);
    const targetIn = this.checkINSet(event, inSetX, inSetY);
    const targetInX = this.checkINSetX(event, inSetX);
    const targetInY = this.checkINSetY(event, inSetY);
    const target = this.check(event);

    draggedElement.style.pointerEvents = "auto";

    return (
      targetOff?.closest(".letter") ||
      targetIn?.closest(".letter") ||
      target?.closest(".letter") ||
      targetOffX?.closest(".letter") ||
      targetOffY?.closest(".letter") ||
      targetInX?.closest(".letter") ||
      targetInY?.closest(".letter")
    );
  }

  select(e) {
    if (e.buttons !== 1) return;

    const selection = {
      left: Math.min(this.startX, e.clientX),
      right: Math.max(this.startX, e.clientX),
      top: Math.min(this.startY, e.clientY),
      bottom: Math.max(this.startY, e.clientY),
    };

    const width = selection.right - selection.left;
    const height = selection.bottom - selection.top;

    this.box.style.left = `${selection.left}px`;
    this.box.style.top = `${selection.top}px`;
    this.box.style.width = `${width}px`;
    this.box.style.height = `${height}px`;

    document.querySelectorAll(".letter").forEach((el) => {
      const rect = el.getBoundingClientRect();

      const intersects =
        rect.left < selection.right &&
        rect.right > selection.left &&
        rect.top < selection.bottom &&
        rect.bottom > selection.top;

      if (intersects) {
        el.classList.add("selected");
      } else {
        el.classList.remove("selected");
      }
    });
  }

  switchSelection() {
    document.addEventListener("mousedown", (e) => {
      this.startX = e.clientX;
      this.startY = e.clientY;

      this.box = document.createElement("div");
      this.box.className = "selection-box";
      document.body.appendChild(this.box);
    });

    document.addEventListener("mousemove", (e) => {
      if (!this.box) return;

      this.select(e);
    });

    document.addEventListener("mouseup", () => {
      if (this.box) {
        this.box.remove();
        this.box = null;
      }
    });
  }

  getLetterElements() {
    return Array.from(document.getElementsByClassName("letter"));
  }

  getSelectedLetters() {
    return this.getLetterElements().filter((letter) =>
      letter.classList.contains("selected"),
    );
  }

  unsetSelected(elements) {
    elements.forEach((element) => {
      element.classList.remove("selected");
    });
  }

  checkForViewUnder = (draggedElement, letterUnder) => {
    const positionUnder = window.getComputedStyle(letterUnder).position;
    return positionUnder !== "absolute";
  };

  checkForViewLetterOver = (draggedElement, letterUnder) => {
    const isLetterUnderActive = letterUnder?.classList.contains("active");
    const isDraggedElementActive = draggedElement?.classList.contains("active");
    return isLetterUnderActive && !isDraggedElementActive;
  };
}
