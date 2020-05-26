<template>
  <div class="page settings">
    <h2 class="page__title">Settings</h2>
    <div class="settings__content">
      <SelectBox
        id="theme"
        name="theme"
        label="Theme"
        :value="theme"
        :options="themeOptions"
        @select="onThemeSelect"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

import SelectBox, { SelectOption } from '@/components/SelectBox.vue';
import { store } from '@/utils/localStorage';

@Component({
  components: { SelectBox },
  metaInfo() {
    return {
      title: 'Settings'
    };
  }
})
export default class Settings extends Vue {
  private readonly themeOptions: SelectOption[] = [
    { value: 'classic', text: 'Classic' },
    { value: 'bayo2', text: 'Two' },
    { value: 'bayo3', text: 'Three' }
  ];

  private theme = '';

  // Lifecycle
  mounted() {
    this.theme = store.getKey('theme');
  }

  // Methods
  private onThemeSelect({ value }: { value: string }) {
    this.theme = value;
    store.set({ theme: value });
  }
}
</script>

<style lang="scss" scoped>
.settings__content {
  margin: 20px 0;
}
</style>
