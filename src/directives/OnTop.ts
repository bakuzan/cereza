import Vue, { DirectiveOptions } from 'vue';

import { getPageFromHash } from '@/utils';

interface VuePlus extends Vue {
  observers?: IntersectionObserver[];
  observerTimer?: number;
}

export const OnTop: DirectiveOptions = {
  bind: function(root, data, node) {
    const callback = data.value;

    if (!node.context) {
      return;
    }

    const vm: VuePlus = Object.assign(node.context, {
      observers: [],
      observerTimer: 0
    });

    Array.from(root.children).forEach((page) => {
      const obs = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting || entry.rootBounds === null) {
          return;
        }

        window.clearTimeout(vm.observerTimer);
        vm.observerTimer = window.setTimeout(() => {
          const pageId = entry.target.id;
          const delta = entry.boundingClientRect.top <= 0 ? 1 : -1;
          const curr = getPageFromHash(pageId);
          const newPageId = `#page_${curr + delta}`;
          callback(newPageId);
        }, 500);
      });

      obs.observe(page);

      if (vm.observers) {
        vm.observers.push(obs);
      }
    });
  },
  unbind: function(_, data, node) {
    const vm = node.context as VuePlus;

    if (vm.observers) {
      window.clearTimeout(vm.observerTimer);
      vm.observers.forEach((x) => x.disconnect());
    }
  }
};

Vue.directive('crz-on-top', OnTop);
