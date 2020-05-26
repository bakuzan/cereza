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
      <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18" />
      <line x1="7" y1="2" x2="7" y2="22" />
      <line x1="17" y1="2" x2="17" y2="22" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <line x1="2" y1="7" x2="7" y2="7" />
      <line x1="2" y1="17" x2="7" y2="17" />
      <line x1="17" y1="17" x2="22" y2="17" />
      <line x1="17" y1="7" x2="22" y2="7" />
    </svg>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class FilmIcon extends Vue {
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
