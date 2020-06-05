<template>
  <section class="widget">
    <header class="widget__header">
      <h2 class="widget__title">{{ title }}</h2>

      <Button
        v-if="showClose"
        class="widget__button"
        :aria-label="closeLabel"
        :title="closeLabel"
        @click="onClose"
      >
        <CrossIcon />
      </Button>
    </header>
    <slot></slot>
  </section>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit } from 'vue-property-decorator';

import Button from '@/components/Button.vue';
import CrossIcon from '@/components/Icons/CrossIcon.vue';

@Component({ components: { Button, CrossIcon } })
export default class Widget extends Vue {
  @Prop() readonly title!: string;
  @Prop({ default: false }) readonly showClose!: boolean;

  // Computed
  get closeLabel() {
    return `Close ${this.title ?? ''}`;
  }

  // Methods
  @Emit('close')
  private onClose(event: Event) {
    return event;
  }
}
</script>

<style scoped lang="scss">
.widget {
  padding: 5px;

  &__header {
    display: flex;
    justify-content: space-between;
  }

  &__title {
    display: flex;
    align-items: center;
    font-size: 1.25rem;
    margin: 5px 0;
  }
}
</style>
