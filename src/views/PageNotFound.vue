<template>
  <div class="page not-found">404 | Page not found.</div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({
  metaInfo() {
    return {
      title: '404: Page not found'
    };
  }
})
export default class PageNotFound extends Vue {}
</script>

<style lang="scss" scoped>
.not-found {
  margin: 25px;
}
</style>
