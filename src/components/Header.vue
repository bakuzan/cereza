<template>
  <nav
    :class="classes"
    :aria-hidden="!hovered && shouldFade"
    @mouseenter="onMouseIn"
    @mouseleave="onMouseOut"
  >
    <h1 class="app-title">
      <router-link class="app-title__link" to="/">Cereza</router-link>
    </h1>
    <div class="flex-spacer"></div>
    <router-link class="app-header__link" to="/">Home</router-link>|
    <router-link class="app-header__link" to="/settings">Settings</router-link>
  </nav>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { Route } from 'vue-router';
import classNames from 'classnames';

@Component
export default class Header extends Vue {
  private hovered = false;
  private shouldFade = true;

  @Watch('$route')
  private onRouteChange(nValue: Route, oValue: Route) {
    const hasChange = nValue.name !== oValue.name;
    const isReader = nValue.name === 'Reader';

    if (hasChange) {
      this.shouldFade = isReader;
    }
  }

  // Computed
  get classes() {
    return classNames('app-header', {
      'app-header--faded': this.shouldFade
    });
  }

  // Methods
  private onMouseIn() {
    this.hovered = true;
  }

  private onMouseOut() {
    this.hovered = false;
  }
}
</script>

<style lang="scss" scoped>
$padding: 5px;

.app-header {
  position: fixed;
  display: flex;
  align-items: center;
  height: calc(var(--header-height) - #{$padding * 2});
  width: calc(100% - #{$padding * 2});
  padding: $padding;
  background-color: var(--base-colour);
  color: var(--contrast-colour);
  box-shadow: 0px 0px 5px 3px var(--accent-colour);
  z-index: 1000;

  &--faded {
    opacity: 0;
    transition: all 0.2s ease-in-out;

    &__link {
      pointer-events: none;
      visibility: hidden;
    }

    &:hover {
      opacity: 1;

      .app-header__link {
        pointer-events: unset;
        visibility: visible;
      }
    }
  }

  &__link {
    color: var(--contrast-colour);

    &.router-link-exact-active {
      color: var(--accent-colour);
    }
  }
}

.app-title {
  margin: 0 5px;

  &__link,
  &__link:hover {
    text-decoration: none;
    color: inherit;
  }

  &__link:hover {
    color: var(--accent-colour);
  }
}
</style>
