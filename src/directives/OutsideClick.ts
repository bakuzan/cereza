/* eslint-disable @typescript-eslint/no-explicit-any */
import Vue, { DirectiveOptions } from 'vue';

import addOutsideClick from '../utils/addOutsideClick';

interface VuePlus extends Vue {
  removeOutsideClick?: () => void;
}

export const OutsideClick: DirectiveOptions = {
  bind(element, binding, vnode) {
    const vm = vnode.context as Vue;
    Object.assign(vm, {
      removeOutsideClick: addOutsideClick(element, binding.value)
    });
  },
  unbind(_, __, vnode) {
    const vm = vnode.context as VuePlus;

    if (vm.removeOutsideClick) {
      vm.removeOutsideClick();
    }
  }
};

Vue.directive('crz-outside-click', OutsideClick);
