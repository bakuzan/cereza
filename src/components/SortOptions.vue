<template>
  <div class="sort-options">
    <RadioButtonGroup
      id="sortField"
      name="sortField"
      :value="selected.field"
      :options="options"
      @change="onChangeField"
    />
    <Tickbox
      id="order"
      class-name="order-check-box"
      name="order"
      label="Descending"
      :checked="order"
      @change="onChangeOrder"
    />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

import RadioButtonGroup from '@/components/RadioButtonGroup.vue';
import Tickbox from '@/components/Tickbox.vue';

import { SortOptions } from '@i/SortOptions';

@Component({ components: { RadioButtonGroup, Tickbox } })
export default class SortOptionsBlock extends Vue {
  @Prop() readonly selected!: SortOptions;

  private options = [
    { value: 'Name', label: 'Name' },
    { value: 'Time', label: 'Time' }
  ];

  // Computed
  get order() {
    return this.selected.order === 'DESC';
  }

  // Methods
  private onChangeField({ value }: { value: string }) {
    this.$emit('change', { field: value, order: this.selected.order });
  }

  private onChangeOrder({ checked }: { checked: boolean }) {
    this.$emit('change', {
      field: this.selected.field,
      order: checked ? 'DESC' : 'ASC'
    });
  }
}
</script>

<style scoped lang="scss">
.sort-options {
  display: flex;
}
.sort-options .input-container {
  display: flex;
  flex: 0;
  align-items: center;
  margin: 0 15px;
}
</style>
