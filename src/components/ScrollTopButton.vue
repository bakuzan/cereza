<template>
  <button
    v-if="showButton"
    type="button"
    :class="classes"
    aria-label="Click to scroll to the top of the page"
    title="Scroll to the top"
    @click="onClick()"
  ></button>
</template>

<script lang="ts">
import classNames from 'classnames';
import { Component, Prop, Vue } from 'vue-property-decorator';

import getWindowScrollPosition from '@/utils/getWindowScrollPosition';

@Component
export default class ScrollTopButton extends Vue {
  @Prop({ default: '' }) readonly className!: string;
  @Prop({ default: 100 }) readonly offset!: number;

  private position = 0;
  private timer = 0;
  private unlisten: () => void = () => null;

  //Lifecycle
  mounted() {
    this.unlisten = this.setupListeners();
  }

  beforeDestroy() {
    this.unlisten();
  }

  // Computed
  get classes() {
    return classNames('scroll-top', 'ripple', this.className);
  }

  get showButton() {
    return this.position > this.offset;
  }

  // Methods
  private onClick() {
    window.scrollTo(0, 0);
  }

  private setupListeners() {
    const handleScroll = () => {
      const value = getWindowScrollPosition();

      clearTimeout(this.timer);
      this.timer = window.setTimeout(() => {
        if (value !== this.position) {
          this.position = value;
        }
      }, 250);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }
}
</script>

<style scoped lang="scss">
.scroll-top {
  background: none;
  border: none;
  position: fixed !important;
  bottom: 20px;
  right: 20px;
  width: 3rem;
  height: 3rem;
  padding: 0;
  box-shadow: 1px 1px 5px 0px;
  cursor: pointer;
  background-color: var(--scroll-top-button--background, #fff);
  color: var(--scroll-top-button--colour, #000);

  &::before {
    content: '\25B2\FE0F';
    font-size: 2.7rem;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }

  &:hover {
    background-color: var(--scroll-top-button--background-hover, #efefef);
  }
}
</style>
