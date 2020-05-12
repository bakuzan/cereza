<template>
  <div class="app">
    <nav class="app-header">
      <h1 class="app-title">Cereza</h1>
      <div class="flex-spacer"></div>
      <router-link class="app-header__link" to="/">Home</router-link>|
      <router-link class="app-header__link" to="/about">About</router-link>
    </nav>
    <main>
      <router-view />
    </main>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({
  metaInfo() {
    return {
      titleTemplate: (value) => (value ? `${value} | Cereza` : 'Cereza'),
      htmlAttrs: {
        lang: 'en'
      }
    };
  }
})
export default class App extends Vue {}
</script>

<style lang="scss">
:root {
  --font-family: 'Lucida Console', 'Courier New', monospace;
  --font-size: 16px;

  --header-height: 50px;
  --highlight-one: #a32822;
  --highlight-two: #5f90e6;
  --highlight-three: #7b0fc7;

  --base-colour: #0d0804;
  --contrast-colour: #f1f1f1;
  --accent-colour: var(--highlight-one);
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
button {
  font-family: var(--font-family);
  font-size: var(--font-size);
}

main {
  min-height: calc(100vh - var(--header-height));
  padding-top: var(--header-height);
  overflow-x: hidden;
}

// General helpers...
.flex-spacer {
  display: flex;
  flex: 1;
}
</style>

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

  &__link {
    color: var(--contrast-colour);
  }
}

.app-title {
  margin: 0 5px;
}
</style>