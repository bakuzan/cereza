<template>
  <div class="icon">
    <svg
      viewBox="0 0 24 24"
      width="24"
      height="24"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      :class="{
        icon__svg: true,
        'icon__svg--filled': fill,
        'icon__svg--contrast': contrast
      }"
    >
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class PinIcon extends Vue {
  @Prop({ default: false }) readonly contrast!: boolean;
  @Prop({ default: false }) readonly fill!: boolean;
}
</script>

<style scoped lang="scss">
.icon {
  padding: 2px;

  &__svg {
    $svg: &;
    stroke: var(--accent-colour);

    &--contrast {
      stroke: var(--accent-contrast);
    }

    &--filled {
      fill: var(--accent-colour);
    }

    &--filled.icon__svg--contrast {
      fill: var(--accent-contrast);
    }
  }
}
</style>
