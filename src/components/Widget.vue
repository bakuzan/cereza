<template>
  <section class="widget">
    <header class="widget__header">
      <h2 class="widget__title">{{ title }}</h2>
    </header>
    <slot></slot>
  </section>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class Widget extends Vue {
  @Prop() readonly title!: string;
}
</script>

<style scoped lang="scss">
.widget {
  padding: 5px;

  &__title {
    font-size: 1.25rem;
    margin: 5px 0;
  }
}
</style>
