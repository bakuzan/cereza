<template>
  <div class="icon">
    <svg
      viewBox="0 0 24 24"
      width="32"
      height="32"
      stroke-width="1"
      fill="none"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
      <polyline points="13 2 13 9 20 9" />
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
