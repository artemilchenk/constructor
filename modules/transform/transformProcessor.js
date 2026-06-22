export class TransformProcessor {
  container = null;

  constructor(container) {
    this.container = container;
  }
  shift(draggedElement, x, y) {
    draggedElement.style.left = `${x}px`;
    draggedElement.style.top = `${y}px`;
  }

  swap(draggedElement, targetElement) {
    if (targetElement.style.position === "static") {
      draggedElement.style.position = "static";
    } else targetElement.style.position = draggedElement._prevPosition;

    targetElement.style.left = `${draggedElement._dragPrevLeft}px`;
    targetElement.style.top = `${draggedElement._dragPrevTop}px`;

    draggedElement.style.left = `${targetElement._dragCurrentLeft}px`;
    draggedElement.style.top = `${targetElement._dragCurrentTop}px`;
  }
}
