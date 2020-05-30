<template>
  <div v-if="showWidget" class="goto-widget" v-crz-outside-click="onClose">
    <form
      name="goToForm"
      novalidate
      autocomplete="off"
      @submit.prevent="onGoToSubmit"
    >
      <InputBox
        type="number"
        id="goToPage"
        name="goToPage"
        label="Jump to page"
        :auto-focus="true"
        :min="1"
        :max="max"
        :value="goToPage"
        @change="onGoToPageChange"
      />
    </form>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

import InputBox from '@/components/InputBox.vue';
import { OutsideClick } from '@/directives/OutsideClick';
import { EventKey } from '@/constants';

@Component({ components: { InputBox }, directives: { OutsideClick } })
export default class GoToWidget extends Vue {
  @Prop({ required: true }) readonly max!: number;

  private goToPage = '';
  private showWidget = false;
  private unsub: (() => void) | null = null;

  // Lifecycle
  mounted() {
    window.addEventListener('keypress', this.onKeyPress);
    this.unsub = () => window.removeEventListener('keypress', this.onKeyPress);
  }

  beforeDestroy() {
    if (this.unsub) {
      this.unsub();
    }
  }

  // Methods
  private onKeyPress(event: KeyboardEvent) {
    if (event.key === EventKey.KeyG && !this.showWidget) {
      this.showWidget = true;
      requestAnimationFrame(() => this.$el.querySelector('input')?.focus());
    }
  }

  private onClose() {
    this.showWidget = false;
  }

  private onGoToPageChange({ value }: { value: string }) {
    this.goToPage = value;
  }

  private onGoToSubmit() {
    if (this.goToPage) {
      this.$emit('submit', this.goToPage);
      this.goToPage = '';
      this.showWidget = false;
    }
  }
}
</script>

<style lang="scss" scoped>
.goto-widget {
  background-color: var(--base-colour);
  position: fixed;
  top: 50%;
  left: 50%;
  min-width: 150px;
  padding: 10px;
  transform: translateX(-50%) translateY(-50%);
  box-shadow: 1px 1px 1px 1px var(--accent-colour);
  z-index: 200;
}
</style>
<style lang="scss">
.goto-widget .input-box__input {
  color: var(--contrast-colour);
}
</style>
