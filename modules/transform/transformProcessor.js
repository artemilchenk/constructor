export class TransformProcessor {
  container = null;

  constructor(container) {
    this.container = container;
  }
  shift(draggedElement, x, y) {
    draggedElement.style.left = `${x}px`;
    draggedElement.style.top = `${y}px`;
  }

  setStartShift(draggedElement) {
    draggedElement._startShiftX = draggedElement.style.left;
    draggedElement._startShiftY = draggedElement.style.top;
  }

  swap(draggedElement, letterUnder) {
    if (letterUnder.style.position === "static") {
      draggedElement.style.position = "static";
    } else letterUnder.style.position = draggedElement._prevPosition;

    letterUnder.style.left = `${draggedElement._startShiftX}`;
    letterUnder.style.top = `${draggedElement._startShiftY}`;
  }
}
