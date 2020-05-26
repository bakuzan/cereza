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
      <polyline points="12 16 16 12 12 8" />
      <line x1="8" y1="12" x2="16" y2="12" />
    </svg>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class ArrowRight extends Vue {
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
