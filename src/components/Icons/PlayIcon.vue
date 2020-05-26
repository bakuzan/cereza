<template>
  <div class="icon">
    <svg
      v-if="show"
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
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class PlayIcon extends Vue {
  @Prop({ default: false }) readonly contrast!: boolean;
  @Prop({ default: true }) readonly show!: boolean;
}
</script>

<style scoped lang="scss">
.icon {
  $size: 24px;

  padding: 2px;
  min-height: $size;
  min-width: $size;

  &__svg {
    stroke: var(--accent-colour);

    &--contrast {
      stroke: var(--accent-contrast);
    }
  }
}
</style>
