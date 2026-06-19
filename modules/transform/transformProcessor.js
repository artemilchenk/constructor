export class TransformProcessor {
  startShift = null;
  container = null;

  constructor(container) {
    this.container = container;
  }
  shift(draggedElement, x, y) {
    if (!this.startShift)
      this.startShift = {
        x,
        y,
      };

    draggedElement.style.left = `${x}px`;
    draggedElement.style.top = `${y}px`;
  }

  resetStartShift() {
    this.startShift = null;
  }

  get startShift() {
    return this.startShift;
  }

  swap(letterUnder) {
    letterUnder.style.left = `${this.startShift.x}px`;
    letterUnder.style.top = `${this.startShift.y}px`;
  }
}
