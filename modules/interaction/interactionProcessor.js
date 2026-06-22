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
    let allMatches = [];

    for (const letter of letters) {
      if (letter === draggedElement) continue;

      const letterRect = letter.getBoundingClientRect();

      const overlapWidth = Math.max(
        0,
        Math.min(draggedRect.right, letterRect.right) -
          Math.max(draggedRect.left, letterRect.left),
      );

      const overlapHeight = Math.max(
        0,
        Math.min(draggedRect.bottom, letterRect.bottom) -
          Math.max(draggedRect.top, letterRect.top),
      );

      const area = overlapWidth * overlapHeight;

      if (area > maxArea) {
        maxArea = area;
        bestMatch = letter;
      }

      if (area > 0) {
        allMatches.push(letter);
      }
    }

    const otherMatches = allMatches.filter((letter) => letter !== bestMatch);

    return [bestMatch, ...otherMatches];
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

  getRandomPosition(container, element) {
    const containerRect = container.getBoundingClientRect();
    const elementRect = element.getBoundingClientRect();
    const elementWidth = element.offsetWidth;
    const elementHeight = element.offsetHeight;
    const elements = this.getLetterElements();
    const maxX = containerRect.width - elementRect.width;
    const maxY = containerRect.height - elementRect.height;

    function isOverlapping(x, y) {
      return elements.some((other) => {
        if (other === element) return false;

        const otherLeft = parseFloat(other.style.left) || 0;
        const otherTop = parseFloat(other.style.top) || 0;
        const otherWidth = other.offsetWidth;
        const otherHeight = other.offsetHeight;

        return !(
          x + elementWidth <= otherLeft ||
          x >= otherLeft + otherWidth ||
          y + elementHeight <= otherTop ||
          y >= otherTop + otherHeight
        );
      });
    }

    function findPosition(attempt = 0) {
      if (attempt >= 100) return null;

      const x = Math.random() * maxX;
      const y = Math.random() * maxY;

      if (isOverlapping(x, y)) {
        return findPosition(attempt + 1);
      }

      return { x, y };
    }

    return findPosition();
  }
}
