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
      <path
        d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"
      />
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
