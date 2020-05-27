import Vue from 'vue';

import addOutsideClick from '../utils/addOutsideClick';

export const OutsideClick = {
  acceptStatement: true,
  bind(element: HTMLElement, binding: any, vnode: Vue.VNode) {
    const vm = vnode.context as any;
    vm.removeOutsideClick = addOutsideClick(element, binding.value);
  },
  unbind(_: any, __: any, vnode: Vue.VNode) {
    const vm = vnode.context as any;
    vm.removeOutsideClick && vm.removeOutsideClick();
  }
};

Vue.directive('crz-outside-click', OutsideClick);
