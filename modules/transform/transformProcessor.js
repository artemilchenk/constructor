export class TransformProcessor {
  container = null;

  constructor(container) {
    this.container = container;
  }
  shift(draggedElement, x, y) {
    draggedElement.style.left = `${x}px`;
    draggedElement.style.top = `${y}px`;
  }

  swap(dragged, target) {
    if (target.style.position === "static") {
      dragged.style.position = "static";
    } else target.style.position = dragged._prevPosition;

    dragged._dragCurrentLeft = `${target._dragCurrentLeft}`
    dragged._dragCurrentTop = `${target._dragCurrentTop}`

    dragged.style.left = `${dragged._dragCurrentLeft}px`;
    dragged.style.top = `${dragged._dragCurrentTop}px`;

    target._dragCurrentLeft = `${dragged._dragPrevLeft}`;
    target._dragCurrentTop = `${dragged._dragPrevTop}`;

    target.style.left = `${target._dragCurrentLeft}px`;
    target.style.top = `${target._dragCurrentTop}px`;
  }
}
