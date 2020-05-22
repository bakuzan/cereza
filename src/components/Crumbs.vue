<template>
  <div class="crumbs">
    <Button
      v-for="crumb of parts"
      :key="crumb.path"
      :class="crumb.class"
      :link="true"
      :disabled="crumb.isLast"
      @click="onCrumbSelect(crumb.path)"
    >
      <div>{{ crumb.text }}</div>
    </Button>
  </div>
</template>

<script lang="ts">
import classNames from 'classnames';
import { Component, Vue, Prop, Watch, Emit } from 'vue-property-decorator';

import Button from '@/components/Button.vue';

interface Crumb {
  class: string;
  isLast: boolean;
  path: string;
  text: string;
}

@Component({
  components: {
    Button
  }
})
export default class Crumbs extends Vue {
  @Prop({ default: '' }) readonly path!: string;
  private parts: Crumb[] = [];

  mounted() {
    this.setPathParts(this.path);
  }

  @Watch('path')
  onPathChange(newPath: string, oldPath: string) {
    if (oldPath !== newPath) {
      this.$nextTick(() => this.setPathParts(newPath));
    }
  }

  private setPathParts(path: string) {
    this.parts = path
      .split('\\')
      .filter((x) => x !== '')
      .map((text, i, arr) => {
        const num = i + 1;
        const isLast = arr.length === num;
        const path = [...arr.slice(0, num), ''].join('\\');

        return {
          class: classNames('crumb', {
            'crumb--active': !isLast
          }),
          isLast,
          path,
          text
        };
      });
  }

  @Emit('select')
  private onCrumbSelect(path: string) {
    return path;
  }
}
</script>

<style lang="scss" scoped>
.crumbs {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  padding: 2px 5px;
}

.crumb--active > div::after {
  content: '\\';
}
</style>
