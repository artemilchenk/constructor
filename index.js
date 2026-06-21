import { KeyboardProcessor } from "./modules/keyboard/keyboardProcessor.js";
import DragProcessor from "./modules/drag/dragProcessor.js";
import { InteractionProcessor } from "./modules/interaction/interactionProcessor.js";
import { TransformProcessor } from "./modules/transform/transformProcessor.js";

const input = document.getElementById("input");
const button = document.getElementById("button");
const view = document.getElementById("view");

const transformProcessor = new TransformProcessor(view);
const interactionProcessor = new InteractionProcessor(transformProcessor);

interactionProcessor.switchSelection();

const dragProcessor = new DragProcessor(
  view,
  interactionProcessor,
  transformProcessor,
);

const keyboardProcessor = new KeyboardProcessor({
  inputElement: input,
  buttonElement: button,
  resultViewElement: view,
  dragProcessor,
});
