/* eslint-disable @typescript-eslint/no-explicit-any */
import Vue, { DirectiveOptions } from 'vue';

import addOutsideClick from '../utils/addOutsideClick';

export const OutsideClick: DirectiveOptions = {
  bind(element, binding, vnode) {
    const vm = vnode.context as Vue;
    Object.assign(
      vm,
      'removeOutsideClick',
      addOutsideClick(element, binding.value)
    );
  },
  unbind(_, __, vnode) {
    const vm = vnode.context as Vue;

    if ('removeOutsideClick' in vm) {
      (vm as any).removeOutsideClick();
    }
  }
};

Vue.directive('crz-outside-click', OutsideClick);
