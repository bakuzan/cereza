<template>
  <div :class="selectClasses">
    <select
      v-if="options.length"
      :id="id"
      :name="name"
      :value="value"
      :disabled="disabled"
      class="select-box__input"
      @change="handleChange"
    >
      <option v-if="allowNulls" :value="null" class="select-box__option"
        >None</option
      >
      <option
        v-if="isRequiredWithNoValue"
        :value="null"
        class="select-box__option"
        >Please select a {{ text }}</option
      >
      <option
        v-for="item in options"
        :key="item.value"
        :value="item.value"
        class="select-box__option"
        >{{ item.text }}</option
      >
    </select>
    <label :for="id">{{ label }}</label>
  </div>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue } from 'vue-property-decorator';
import classNames from 'classnames';

export interface SelectOption {
  value: string | number;
  text: string;
}

@Component
export default class SelectBox extends Vue {
  @Prop({ required: true }) readonly id!: string;
  @Prop({ required: true }) readonly name!: string;
  @Prop({ default: '' }) readonly label!: string;
  @Prop({ default: '' }) readonly value!: string | number;
  @Prop({ required: true }) readonly options!: SelectOption[];
  @Prop({ default: false }) readonly allowNulls!: boolean;
  @Prop({ default: false }) readonly required!: boolean;
  @Prop({ default: false }) readonly disabled!: boolean;

  // Computed
  get selectClasses() {
    return classNames('select-box', 'has-float-label');
  }

  get isRequiredWithNoValue() {
    return this.required && !this.value;
  }

  // Methods
  @Emit('select')
  private handleChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    return { value: target.value, name: this.name };
  }
}
</script>

<style lang="scss" scoped>
@import '../styles/_extensions';

.select-box {
  flex: 1;
  padding: 5px;
  min-height: 35px;
  box-sizing: content-box;

  &::after {
    @extend %down-caret-rhs;
  }

  &__input {
    width: 100%;
    background-color: inherit;
    color: inherit;
  }

  &__option {
    background-color: inherit;
    color: inherit;
  }
}

.has-float-label select:focus {
  border-color: var(--accent-colour);
}
</style>
