const KEY_ACTIONS = new Map([
  ["ArrowLeft", "left"], ["KeyA", "left"], ["ArrowRight", "right"], ["KeyD", "right"],
  ["ArrowDown", "down"], ["KeyS", "down"], ["ArrowUp", "up"], ["KeyW", "up"],
  ["Space", "jump"], ["KeyJ", "attack"], ["KeyK", "rush"], ["KeyM", "map"],
]);

export function createInput(root) {
  const held = new Set();
  const pressed = new Set();
  const released = new Set();
  const pointerActions = new Map();

  function setDown(action) {
    if (!held.has(action)) pressed.add(action);
    held.add(action);
  }

  function setUp(action) {
    if (held.delete(action)) released.add(action);
  }

  function onKeyDown(event) {
    const action = KEY_ACTIONS.get(event.code);
    if (!action) return;
    event.preventDefault();
    setDown(action);
  }

  function onKeyUp(event) {
    const action = KEY_ACTIONS.get(event.code);
    if (!action) return;
    event.preventDefault();
    setUp(action);
  }

  function onPointerDown(event) {
    const button = event.target.closest("[data-action]");
    if (!button) return;
    event.preventDefault();
    const action = button.dataset.action;
    pointerActions.set(event.pointerId, action);
    button.setPointerCapture?.(event.pointerId);
    button.classList.add("is-held");
    setDown(action);
  }

  function onPointerUp(event) {
    const action = pointerActions.get(event.pointerId);
    if (!action) return;
    pointerActions.delete(event.pointerId);
    root.querySelectorAll(`[data-action="${action}"]`).forEach((button) => button.classList.remove("is-held"));
    setUp(action);
  }

  window.addEventListener("keydown", onKeyDown, { passive: false });
  window.addEventListener("keyup", onKeyUp, { passive: false });
  root.addEventListener("pointerdown", onPointerDown, { passive: false });
  root.addEventListener("pointerup", onPointerUp);
  root.addEventListener("pointercancel", onPointerUp);

  return {
    held: (action) => held.has(action),
    consume(action) {
      const had = pressed.has(action);
      pressed.delete(action);
      return had;
    },
    consumeRelease(action) {
      const had = released.has(action);
      released.delete(action);
      return had;
    },
    clearEdges() {
      pressed.clear();
      released.clear();
    },
    destroy() {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      root.removeEventListener("pointerdown", onPointerDown);
      root.removeEventListener("pointerup", onPointerUp);
      root.removeEventListener("pointercancel", onPointerUp);
    },
  };
}
