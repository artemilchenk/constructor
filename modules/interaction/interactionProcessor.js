export class InteractionProcessor {
  box = null;
  startX = 0;
  startY = 0;
  transformProcessor = null;

  constructor(transformProcessor) {
    this.transformProcessor = transformProcessor;
  }

  checkUnder(draggedElement) {
    const draggedRect = draggedElement.getBoundingClientRect();
    const letters = this.getLetterElements();

    let bestMatch = null;
    let maxArea = 0;

    for (const letter of letters) {
      if (letter === draggedElement) continue;

      const targetRec = letter.getBoundingClientRect();

      const overlapWidth = Math.max(
        0,
        Math.min(draggedRect.right, targetRec.right) -
          Math.max(draggedRect.left, targetRec.left),
      );

      const overlapHeight = Math.max(
        0,
        Math.min(draggedRect.bottom, targetRec.bottom) -
          Math.max(draggedRect.top, targetRec.top),
      );

      const area = overlapWidth * overlapHeight;

      if (area > maxArea) {
        maxArea = area;
        bestMatch = letter;
      }
    }

    return bestMatch;
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
}
