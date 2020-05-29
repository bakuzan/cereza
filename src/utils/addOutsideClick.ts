import { EventKey } from '@/constants';

function createListeners(name: string, cb: EventListenerOrEventListenerObject) {
  window.addEventListener(name, cb);
  return () => window.removeEventListener(name, cb);
}

export default function addOutsideClick(
  element: HTMLElement,
  onOutsideClick: (e: Event) => void
) {
  function handleClick(event: Event) {
    const isDescendantOfRoot = element.contains(event.target as Node);

    if (!isDescendantOfRoot) {
      onOutsideClick(event);
    }
  }

  function handleKeyDown(event: Event) {
    const e = event as KeyboardEvent;

    if (e.key === EventKey.Escape) {
      onOutsideClick(event);
    }
  }

  const undoKey = createListeners('keydown', handleKeyDown);
  const undoClick = createListeners('click', handleClick);

  return () => {
    undoKey();
    undoClick();
  };
}
