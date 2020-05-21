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
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
export default Vue.extend({});
</script>

<style scoped lang="scss">
.icon {
  padding: 2px;

  svg {
    stroke: var(--accent-colour);
  }
}
</style>
