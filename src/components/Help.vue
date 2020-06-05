<template>
  <div class="help">
    <Button class="help__button" @click="onHelp">
      <RandomIcon :aria-label="label" :title="label" />
    </Button>
    <TabTrap
      :isActive="showHelp"
      firstSelector=".widget__button"
      lastSelector=".widget__button"
    >
      <Widget
        v-if="showHelp"
        v-crz-outside-click="onOutsideClick"
        class="help__widget"
        :show-close="true"
        :style="widgetStyle"
        :title="title"
        @close="onClose"
      >
        <slot></slot>
      </Widget>
    </TabTrap>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import classNames from 'classnames';

import Button from '@/components/Button.vue';
import RandomIcon from '@/components/Icons/RandomIcon.vue';
import TabTrap from '@/components/TabTrap.vue';
import Widget from '@/components/Widget.vue';

import { OutsideClick } from '@/directives/OutsideClick';

@Component({
  components: { Button, RandomIcon, TabTrap, Widget },
  directives: { OutsideClick }
})
export default class Help extends Vue {
  @Prop({ required: true }) readonly title!: string;

  private showHelp = false;
  private widgetStyle = {};

  // Computed
  get label() {
    return `Help: ${this.title}`;
  }

  // Methods
  private onHelp() {
    this.showHelp = !this.showHelp;
    this.updateWidgetPositioning();
  }

  private onOutsideClick(event: Event) {
    const isChild = this.$el.contains(event.target as HTMLElement);

    if (!isChild) {
      this.showHelp = !this.showHelp;
      this.updateWidgetPositioning();
    }
  }

  private onClose() {
    this.showHelp = false;
    this.updateWidgetPositioning();
  }

  private updateWidgetPositioning() {
    this.$nextTick(() => {
      const widget = this.$el.querySelector('.help__widget');
      const hasKeys = Object.keys(this.widgetStyle).length > 0;

      if (widget && !hasKeys) {
        const rect = widget.getBoundingClientRect();
        const willOverflow = window.innerWidth - rect.width - rect.left < 0;

        this.widgetStyle = willOverflow ? { left: `unset`, right: `5px` } : {};
      }
    });
  }
}
</script>

<style lang="scss" scoped>
.help {
  position: relative;
  background-color: inherit;

  &__widget {
    position: absolute;
    top: 5px;
    left: 5px;
    background-color: inherit;
    min-width: 350px;
    box-shadow: 0px 0px 2px 1px var(--accent-colour);
    z-index: 100;
  }
}
</style>
