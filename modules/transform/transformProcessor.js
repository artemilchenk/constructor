export class TransformProcessor {
  container = null;

  constructor(container) {
    this.container = container;
  }
  shift(draggedElement, x, y) {
    if (!draggedElement._startShiftX || !draggedElement._startShiftY) {
      draggedElement._startShiftX = x;
      draggedElement._startShiftY = y;
    }

    draggedElement.style.left = `${x}px`;
    draggedElement.style.top = `${y}px`;
  }

  resetStartShift(draggedElement) {
    draggedElement._startShiftX = null;
    draggedElement._startShiftY = null;
  }

  swap(draggedElement, letterUnder) {
    if (letterUnder.style.position === "static") {
      draggedElement.style.position = "static";
    } else letterUnder.style.position = draggedElement._prevPosition;

    letterUnder.style.left = `${draggedElement._startShiftX}px`;
    letterUnder.style.top = `${draggedElement._startShiftY}px`;
  }
}
