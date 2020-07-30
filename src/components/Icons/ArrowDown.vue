<template>
  <div class="icon">
    <svg
      viewBox="0 0 24 24"
      width="24"
      height="24"
      stroke-width="2"
      fill="none"
      stroke-linecap="round"
      stroke-linejoin="round"
      :class="{
        icon__svg: true,
        'icon__svg--contrast': contrast
      }"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="8 12 12 16 16 12" />
      <line x1="12" y1="8" x2="12" y2="16" />
    </svg>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class ArrowDown extends Vue {
  @Prop({ default: false }) readonly contrast!: boolean;
}
</script>

<style scoped lang="scss">
.icon {
  padding: 2px;

  &__svg {
    stroke: var(--accent-colour);

    &--contrast {
      stroke: var(--accent-contrast);
    }
  }
}
</style>
