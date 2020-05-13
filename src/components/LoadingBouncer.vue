<template>
  <div :class="classes">
    <div v-for="i in range" :key="i" :class="bouncerClasses" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import classNames from 'classnames';

@Component
export default class LoadingBouncer extends Vue {
  @Prop({ default: undefined }) readonly cirlceClass: string | undefined;
  @Prop({ default: true }) readonly local!: boolean;
  private range = [1, 2, 3];

  get classes() {
    return classNames('loading-bouncer', {
      'loading-bouncer--local': this.local,
      'loading-bouncer--fixed': !this.local
    });
  }

  get bouncerClasses() {
    return classNames(
      'loading-bouncer__circle',
      'themed-background',
      this.cirlceClass
    );
  }
}
</script>

<style lang="scss" scoped>
@keyframes bouncing {
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0.1;
    transform: translateY(-1rem);
  }
}

.loading-bouncer {
  display: flex;
  justify-content: center;

  &--fixed {
    position: fixed;
    top: 50px;
    right: 0;
  }

  &--local {
    display: flex;
    align-items: center;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
  }

  &__circle {
    width: 1rem;
    height: 1rem;
    margin: 1.5rem 0.2rem;
    border-radius: 50%;
    animation: bouncing 0.6s infinite alternate;

    &:nth-child(2) {
      animation-delay: 0.2s;
    }

    &:nth-child(3) {
      animation-delay: 0.4s;
    }
  }
}
</style>
