<template>
  <div class="error">{{ message }}</div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class ErrorBlock extends Vue {
  @Prop() readonly message!: string;
}
</script>

<style lang="scss" scoped>
.error {
  color: var(--danger-colour);
}
</style>
