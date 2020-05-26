<template>
  <div class="input-container">
    <label :class="classes" :for="name">
      <input
        :id="name"
        :name="name"
        :checked="checked"
        :disabled="disabled"
        type="checkbox"
        class="tickbox__input"
        @change="onChange"
      />
      {{ label }}
    </label>
  </div>
</template>

<script lang="ts">
import classNames from 'classnames';
import { Component, Emit, Prop, Vue } from 'vue-property-decorator';

@Component
export default class Tickbox extends Vue {
  @Prop({ required: true }) readonly id!: string | number;
  @Prop({ required: true }) readonly name!: string;
  @Prop({ default: '' }) readonly className!: string;
  @Prop({ default: '' }) readonly label!: string;
  @Prop({ required: true }) readonly checked!: boolean;
  @Prop({ default: false }) readonly disabled!: boolean;

  // Computed
  get classes() {
    return classNames('tickbox', this.className);
  }

  // Methods
  @Emit('change')
  private onChange(event: Event) {
    const target = event.target as HTMLInputElement;
    return { checked: target.checked, name: this.name };
  }
}
</script>

<style lang="scss" scoped>
.tickbox {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 2px;
  cursor: pointer;
}

.tickbox__input {
  // eslint-disable-next-line
  appearance: none; // scss-lint:disable-line unknown-property
  transition: all 0.3s;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 20px;
  height: 20px;
  margin: -2px 5px 0;

  &:before,
  &:checked:before {
    color: var(--tickbox-default-colour, #000);
    transition: all 0.3s;
    cursor: pointer;
    z-index: 1;
  }

  &:before {
    content: '\2610';
    font-size: 2em;
  }

  &:disabled:before {
    content: '\274c';
    color: #666;
    cursor: default;
  }

  &:checked:before {
    content: '\2611';
    color: var(--accent-colour);
  }
}
</style>