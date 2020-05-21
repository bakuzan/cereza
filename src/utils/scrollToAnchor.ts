function getTargetOffset(hash: string) {
  const id = window.decodeURI(hash.replace(`#`, ``));

  if (id !== ``) {
    const element = document.getElementById(id);

    if (element) {
      return element.offsetTop;
    }
  }

  return null;
}

export default function scrollToAnchor(selector: string, anchorOffset = 0) {
  const container = document.querySelector(selector);

  if (!container) {
    return;
  }

  const hashOffset = getTargetOffset(window.location.hash);
  if (hashOffset !== null) {
    window.scrollTo(0, hashOffset + anchorOffset);
    return;
  }

  const obs = new MutationObserver(([entry], self) => {
    const hasAdded = entry.addedNodes.length;
    if (hasAdded) {
      requestAnimationFrame(() => {
        const offset = getTargetOffset(window.location.hash);

        if (offset !== null) {
          window.scrollTo(0, offset + anchorOffset);
          self.disconnect();
        }
      });
    }
  });

  obs.observe(container, {
    attributes: false,
    childList: true,
    subtree: true
  });
}
