import Vue, { DirectiveOptions } from 'vue';

interface VuePlus extends Vue {
  observer?: IntersectionObserver;
}

export const OnIntersect: DirectiveOptions = {
  bind: function(root, data, node) {
    const callback = data.value;

    if (!node.context) {
      return;
    }

    node.context.$nextTick(() => {
      const rect = root?.parentElement?.getBoundingClientRect();
      const margin = Math.max(rect?.height ?? 400, 300) * 1.25;

      const vm: VuePlus = Object.assign(node.context, {
        observer: undefined
      });

      const obs = new IntersectionObserver(
        ([entry], self) => {
          const hasSrc = !!entry.target.getAttribute('src');
          const num = Number(entry.target.getAttribute('data-page-number'));

          if (!entry.isIntersecting) {
            return;
          }

          if (hasSrc) {
            // Job done, just ignore.
            self.disconnect();
            return;
          }

          callback(num);
          self.disconnect();
        },
        {
          rootMargin: `${margin}px 0px ${margin}px 0px`
        }
      );

      const vnode = node.elm as HTMLElement;
      const hasSrc = !!vnode?.getAttribute('src');

      if (!hasSrc) {
        obs.observe(root);
        vm.observer = obs;
      }
    });
  },
  unbind: function(_, data, node) {
    const vm = node.context as VuePlus;
    vm.observer?.disconnect();
  }
};

Vue.directive('crz-on-intersect', OnIntersect);
