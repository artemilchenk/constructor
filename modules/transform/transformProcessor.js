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

  swap(draggedElement, targetElement) {
    if (targetElement.style.position === "static") {
      draggedElement.style.position = "static";
    } else targetElement.style.position = draggedElement._prevPosition;

    targetElement.style.left = `${draggedElement._startShiftX}`;
    targetElement.style.top = `${draggedElement._startShiftY}`;
  }
}
