<template>
  <div :class="classes">
    <label
      v-for="(item, i) in options"
      :key="item.value"
      :for="getKey(i)"
      :aria-checked="item.value === value"
      class="radio"
    >
      <input
        type="radio"
        class="radio__input"
        v-bind="item"
        :id="getKey(i)"
        :name="name"
        :value="item.value"
        :checked="item.value === value"
        @change="onChange"
      />
      <span>{{ item.label }}</span>
    </label>
  </div>
</template>

<script lang="ts">
import classNames from 'classnames';
import { Component, Emit, Prop, Vue } from 'vue-property-decorator';

export interface RadioOption extends Partial<HTMLInputElement> {
  label?: string;
}

@Component
export default class RadioButtonGroup extends Vue {
  @Prop({ required: true }) readonly id!: string;
  @Prop({ required: true }) readonly name!: string;
  @Prop({ required: true }) readonly value!: string | number | boolean;
  @Prop({ default: [] }) readonly options!: RadioOption[];
  @Prop({ default: false }) readonly column!: boolean;

  // Computed
  get classes() {
    return classNames('radio-button-group', {
      'radio-button-group--column': this.column
    });
  }

  // Methods
  private getKey(i: number) {
    return `${this.id}-${i}`;
  }

  @Emit('change')
  private onChange(event: Event) {
    const target = event.target as HTMLInputElement;
    return { value: target.value, name: this.name };
  }
}
</script>

<style lang="scss" scoped>
.radio-button-group {
  display: flex;
  padding: 5px;

  &--column {
    flex-direction: column;
  }
}

.radio-button-group:not(.radio-button-group--column) {
  .radio {
    padding: 0 5px;
  }
}

.radio {
  display: inline-flex;
  align-items: center;
  cursor: pointer;

  &__input {
    appearance: none;
    padding-right: 2px;
    margin: 0;
    pointer-events: none;

    &::after {
      content: '\25ef';
      color: var(--accent-colour, #aaa);
      font-size: 1.2rem;
      vertical-align: middle;
    }

    &:checked::after {
      content: '\25c9';
      color: var(--accent-colour, #aaa);
      font-size: 1.5rem;
    }

    &[disabled]::after,
    &[disabled] + span {
      color: #bbb !important;
    }
  }
}
</style>
