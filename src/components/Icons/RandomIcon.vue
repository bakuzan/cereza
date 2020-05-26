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
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class RandomIcon extends Vue {
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
