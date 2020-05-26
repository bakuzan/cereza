<template>
  <div :class="appClasses">
    <nav class="app-header">
      <h1 class="app-title">
        <router-link class="app-title__link" to="/">Cereza</router-link>
      </h1>
      <div class="flex-spacer"></div>
      <router-link class="app-header__link" to="/">Home</router-link>|
      <router-link class="app-header__link" to="/settings">Settings</router-link>
    </nav>
    <main>
      <router-view />
      <div class="app-image"></div>
      <ScrollTopButton />
    </main>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import classNames from 'classnames';

import ScrollTopButton from '@/components/ScrollTopButton.vue';
import { store } from '@/utils/localStorage';

@Component({
  components: { ScrollTopButton },
  metaInfo() {
    return {
      titleTemplate: (value) => (value ? `${value} | Cereza` : 'Cereza'),
      htmlAttrs: {
        lang: 'en'
      }
    };
  }
})
export default class App extends Vue {
  private theme = '';
  private unwatchTheme: () => void = () => null;

  // Lifecycle
  mounted() {
    this.theme = store.getKey('theme');
    this.unwatchTheme = store.subscribe(
      'theme',
      (value: string) => (this.theme = value)
    );
  }

  beforeDestory() {
    this.unwatchTheme();
  }

  // Computed
  get appClasses() {
    return classNames('app', 'theme', `theme--${this.theme}`);
  }
}
</script>

<style lang="scss">
@import './styles/_ripple.scss';
@import './styles/_floatLabel.scss';

:root {
  --font-family: 'Lucida Console', 'Courier New', monospace;
  --font-size: 16px;

  --header-height: 50px;

  --highlight-one: #a32822;
  --highlight-one-offset: #{lighten(#a32822, 10%)};
  --highlight-two: #5f90e6;
  --highlight-two-offset: #{lighten(#5f90e6, 10%)};
  --highlight-three: #7b0fc7;
  --highlight-three-offset: #{lighten(#7b0fc7, 10%)};

  --base-colour: #0d0804;
  --contrast-colour: #f1f1f1;

  --accent-colour: var(--highlight-one);
  --accent-colour--hover: var(--highlight-one-offset);
  --accent-contrast: #fff;

  --danger-colour: red;
  --disabled-colour: #cccccc;
}

.theme {
  --scroll-top-button--background: var(--highlight-one);
  --scroll-top-button--background-hover: var(--highlight-one-offset);
  --scroll-top-button--colour: var(--accent-contrast);

  .app-image {
    background: url('./assets/logo.png') no-repeat center;
  }

  &--bayo2 {
    --accent-colour: var(--highlight-two);
    --accent-colour--hover: var(--highlight-two-offset);
    --accent-contrast: #fff;

    --scroll-top-button--background: var(--highlight-two);
    --scroll-top-button--background-hover: var(--highlight-two-offset);
    --scroll-top-button--colour: var(--accent-contrast);

    .app-image {
      background: url('./assets/logo_bayo2.png') no-repeat center;
    }
  }

  &--bayo3 {
    --accent-colour: var(--highlight-three);
    --accent-colour--hover: var(--highlight-three-offset);
    --accent-contrast: #fff;

    --scroll-top-button--background: var(--highlight-three);
    --scroll-top-button--background-hover: var(--highlight-three-offset);
    --scroll-top-button--colour: var(--accent-contrast);

    .app-image {
      background: url('./assets/logo_bayo3.png') no-repeat center;
    }
  }
}

html,
body {
  min-height: 100vh;
  padding: 0;
  margin: 0;
}

body {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body,
button,
input {
  font-family: var(--font-family);
  font-size: var(--font-size);
}

main {
  min-height: calc(100vh - var(--header-height) - 5px);
  padding: 5px;
  padding-top: calc(var(--header-height) + 5px);
  overflow-x: hidden;
}

a {
  color: var(--accent-colour);

  &:focus,
  &:hover,
  &:active {
    color: var(--accent-colour--hover);
  }
}

input {
  background-color: inherit;
}

.input-container {
  flex: 1;
  padding: 5px;
  min-height: 35px;
  box-sizing: content-box;

  input[type='text'],
  input[type='number'],
  input[type='date'],
  input[type='url'] {
    width: 100%;
    box-sizing: border-box;
  }

  > button {
    max-height: 32px;
    margin: {
      top: auto;
      bottom: auto;
    }
  }
}

.has-float-label input:focus {
  border-color: var(--accent-colour);
}

// General helpers...
.flex {
  display: flex;

  &--spaced {
    justify-content: space-between;
  }

  &--end {
    justify-content: flex-end;
  }
}

.flex-spacer {
  display: flex;
  flex: 1;
}

.page {
  min-height: calc(100vh - var(--header-height));

  &__title {
    font-size: 1.3rem;
    margin: 10px 0;
    margin-right: 10px;
  }
}

.grid {
  display: grid;
  padding: 0;
  list-style-type: none;
}
</style>

<style lang="scss" scoped>
$padding: 5px;

.app-image {
  position: fixed;
  top: var(--header-height);
  width: 100vw;
  height: 100vh;
  opacity: 0.25;
  pointer-events: none;
  z-index: -1;
}

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
