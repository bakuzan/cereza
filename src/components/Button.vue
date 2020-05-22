<template>
  <button
    :class="buttonClasses"
    :type="type"
    :disabled="disabled"
    @click="onClick"
  >
    <slot></slot>
  </button>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue } from 'vue-property-decorator';
import classNames from 'classnames';

@Component
export default class Button extends Vue {
  @Prop({ default: 'button' }) readonly type!: string;
  @Prop() readonly className!: string;
  @Prop({ default: false }) readonly primary!: boolean;
  @Prop({ default: false }) readonly centered!: boolean;
  @Prop({ default: false }) readonly link!: boolean;
  @Prop({ default: false }) readonly disabled!: boolean;

  get buttonClasses() {
    return classNames(
      'button',
      {
        'button--primary': this.primary,
        'button--link': this.link,
        'button--centered': this.centered
      },
      'ripple',
      this.className
    );
  }

  @Emit('click')
  onClick(event: MouseEvent) {
    return event;
  }
}
</script>

<style lang="scss" scoped>
.button {
  appearance: none;
  display: flex;
  align-items: center;
  background-color: inherit;
  color: inherit;
  padding: 5px;
  border: none;
  white-space: nowrap;
  min-height: 1rem;
  text-decoration: none;
  cursor: pointer;

  &:disabled {
    background-color: var(--disabled-colour) !important;
    cursor: default;
  }
}

.button--centered {
  justify-content: center;
}

.button--primary {
  background-color: var(--accent-colour);
  color: var(--accent-contrast);

  &:focus,
  &:hover,
  &:active {
    background-color: var(--accent-colour--hover);
  }
}

.button--link {
  color: var(--accent-colour);
  text-decoration: underline;

  &:focus,
  &:hover,
  &:active {
    color: var(--accent-colour--hover);
  }

  &:disabled {
    color: inherit;
    text-decoration: none;
  }
}
</style>
