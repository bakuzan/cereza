<template>
  <div :class="classes">
    <input
      :id="id"
      :type="type"
      :name="name"
      :value="value"
      :maxLength="maxLength"
      :disabled="disabled"
      class="input-box__input"
      placeholder=" "
      autocomplete="off"
      @input="handleChange"
      @focus="onFocus"
      @blur="onBlur"
      @keydown="onKeyDown"
    />
    <label :for="id" class="input-box__label">{{ label }}</label>
    <Button v-show="showClearButton" :class-name="clearClasses" @click="clearAndFocusInput">
      <CrossIcon />
    </Button>
    <span v-show="showCount" class="input-box__count">{{ countText }}</span>
  </div>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue } from 'vue-property-decorator';
import classNames from 'classnames';

import Button from '@/components/Button.vue';
import CrossIcon from '@/components/Icons/CrossIcon.vue';
import { getEventValue } from '@/utils';

@Component({
  components: {
    Button,
    CrossIcon
  }
})
export default class InputBox extends Vue {
  @Prop({ required: true }) readonly id!: string;
  @Prop({ default: 'text' }) readonly type!: string;
  @Prop({ required: true }) readonly name!: string;
  @Prop({ default: 'Filter' }) readonly label!: string;
  @Prop({
    default: '',
    validator: (value) => typeof value === 'string' || typeof value === 'number'
  })
  readonly value!: string | number;
  @Prop({ default: '' }) readonly className!: string;
  @Prop({ default: '' }) readonly clearButtonClass!: string;
  @Prop({ default: undefined }) readonly maxLength: number | undefined;
  @Prop({ default: undefined }) readonly max: number | undefined;
  @Prop({ default: false }) readonly disabled!: boolean;

  private clearTimer = 0;

  get showClearButton() {
    return !!this.value && this.isTextInput;
  }

  get isTextInput() {
    return this.type === 'text';
  }

  get classes() {
    const notClearable = !!this.isTextInput;
    return classNames(
      'input-box',
      'input-container',
      'has-float-label',
      {
        'input-box--not-clearable': notClearable
      },
      this.className
    );
  }

  get clearClasses() {
    return classNames('input-box__clear', this.clearButtonClass);
  }

  get hasMaxNumber() {
    return this.type === 'number' && this.max && !isNaN(this.max);
  }

  get showCount() {
    return !!this.maxLength || this.hasMaxNumber;
  }

  get countText() {
    if (typeof this.value === 'string' && this.maxLength) {
      return `${this.value.length}/${this.maxLength}`;
    }

    if (this.hasMaxNumber) {
      return `out of ${this.max ?? '?'}`;
    }

    return '';
  }

  // Methods
  private clearAndFocusInput() {
    this.$emit('change', { value: '', name: this.name });

    clearTimeout(this.clearTimer);
    this.clearTimer = window.setTimeout(
      () => (this.$el?.firstChild as HTMLInputElement)?.focus(),
      100
    );
  }

  @Emit('change')
  private handleChange(event: KeyboardEvent) {
    const target = event.target as HTMLInputElement;
    const value = getEventValue(target);

    return { value, name: this.name };
  }

  @Emit('focus')
  private onFocus(event: InputEvent) {
    return event;
  }

  @Emit('blur')
  private onBlur(event: InputEvent) {
    return event;
  }

  @Emit('key-down')
  private onKeyDown(event: KeyboardEvent) {
    return event;
  }
}
</script>


<style lang="scss" scoped>
.input-box {
  &__label {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    max-width: calc(100% - 15px);
  }

  > input {
    display: flex;
    flex: 1 0 100%;
  }

  &:not(.input-box--not-clearable) > input {
    padding-right: 1.5em !important;
  }

  &__clear {
    $width: 24px;
    justify-content: center;
    position: relative;
    right: $width;
    min-width: $width;
    padding: 1px 2px;
  }

  &__count {
    position: absolute;
    right: 10px;
    bottom: -5px;
    top: auto;
    left: auto;
    font-size: 0.5rem;
  }

  input[type='date'] {
    &::-webkit-calendar-picker-indicator,
    &::-webkit-inner-spin-button {
      appearance: none;
      display: none;
    }
  }
}
</style>
