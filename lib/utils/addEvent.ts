export function addEventListener<E extends Window, K extends keyof WindowEventMap>(
  element: E,
  type: K,
  listener: (ev: WindowEventMap[K]) => any,
  options?: boolean | AddEventListenerOptions,
): () => void;
export function addEventListener<E extends HTMLElement, K extends keyof HTMLElementEventMap>(
  element: E,
  type: K,
  listener: (ev: HTMLElementEventMap[K]) => any,
  options?: boolean | AddEventListenerOptions,
): () => void;
export function addEventListener<E extends Document, K extends keyof DocumentEventMap>(
  element: E,
  type: K,
  listener: (ev: DocumentEventMap[K]) => any,
  options?: boolean | AddEventListenerOptions,
): () => void;
export function addEventListener(
  element: Window | Document | HTMLElement,
  type: keyof HTMLElementEventMap | keyof DocumentEventMap | keyof WindowEventMap,
  listener: (event: any) => void,
  options?: boolean | AddEventListenerOptions,
) {
  element.addEventListener(type, listener, options);
  return () => {
    element.removeEventListener(type, listener);
  };
}
