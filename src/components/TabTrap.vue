<template>
  <component
    :is="element"
    :ref="containerRef"
    style="background-color: inherit;"
  >
    <input
      v-if="isActive"
      type="text"
      class="tab-trap tab-trap--top"
      @focus="focusCycler"
    />
    <slot></slot>
    <input
      v-if="isActive"
      type="text"
      class="tab-trap tab-trap--bottom"
      @focus="focusCycler"
    />
  </component>
</template>

<script lang="ts">
import { Component, Watch, Prop, Vue } from 'vue-property-decorator';

import { generateUniqueId } from '@/utils';

@Component
export default class TabTrap extends Vue {
  @Prop({ required: true }) readonly isActive!: boolean;
  @Prop({ default: 'div' }) readonly element!: string;
  @Prop({ required: true }) readonly firstSelector!: string;
  @Prop({ required: true }) readonly lastSelector!: string;

  private containerRef = generateUniqueId();

  // Methods
  @Watch('isActive')
  private onIsActiveChange(currActive: boolean, prevActive: boolean) {
    const nowActive = !prevActive && currActive;
    const wasActive = !currActive && prevActive;

    if (nowActive) {
      this.focusFirstSelector();
    } else if (wasActive) {
      this.$emit('deactivate');
    }
  }

  private focusFirstSelector() {
    this.$nextTick(() => {
      const ref = this.$refs[this.containerRef] as HTMLElement;
      const target = ref.querySelector<HTMLElement>(this.firstSelector);

      if (target) {
        target.focus();
      }
    });
  }

  private focusCycler(e: FocusEvent) {
    const prev = e.relatedTarget as HTMLElement;
    const curr = e.target as HTMLElement;

    const isPrevATrap = prev && prev.className.includes('tab-trap');
    const isCurrTopTrap = curr.className.includes('tab-trap--top');
    const ref = this.$refs[this.containerRef] as HTMLElement;

    if (isPrevATrap) {
      const targetSelector = isCurrTopTrap
        ? this.firstSelector
        : this.lastSelector;

      const targetElement = ref.querySelector<HTMLElement>(targetSelector);
      targetElement?.focus();
      return;
    }

    const nextTrapClass = isCurrTopTrap
      ? '.tab-trap--bottom'
      : '.tab-trap--top';

    const nextTrap = ref.querySelector<HTMLElement>(nextTrapClass);

    if (nextTrap === document.activeElement) {
      const targetElement = ref.querySelector<HTMLElement>(this.firstSelector);
      targetElement?.focus();
      return;
    }

    nextTrap?.focus();
  }
}
</script>

<style lang="scss" scoped>
.tab-trap {
  position: absolute;
  height: 0;
  width: 0;
  padding: 0;
  border: none;
  margin: 0;
  opacity: 0;
}
</style>
