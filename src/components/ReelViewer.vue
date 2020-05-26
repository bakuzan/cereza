<template>
  <div class="reel-viewer">
    <div class="reel-viewer__content video">
      <div class="video__player">
        <video
          v-if="activeVideo === null"
          id="videoPlayer"
          class="reel-viewer-active-video"
          controls
        ></video>
        <video
          v-else
          id="videoPlayer"
          class="reel-viewer-active-video"
          controls
          preload="auto"
          :autoplay="autoCycle"
          :src="activeVideo.url"
          :type="`video/${activeVideo.extension}`"
        ></video>
      </div>
      <h3 class="video__name">{{ activeVideo ? activeVideo.name : '' }}</h3>
      <div class="video__controls controls">
        <Tickbox
          id="autoCycle"
          class-name="controls__tickbox"
          name="autoCycle"
          label="Auto cycle"
          :checked="autoCycle"
          @change="onAutoCycle"
        />
        <div class="flex-spacer"></div>
        <Button
          v-if="activeVideo !== null"
          class="controls__button"
          :primary="true"
          :disabled="activeIndex === 0"
          @click="onChangeVideo(-1)"
        >
          <ArrowLeft :contrast="true" />Previous
        </Button>
        <Button
          v-if="activeVideo !== null"
          class="controls__button"
          :primary="true"
          :disabled="activeIndex === data.length - 1"
          @click="onChangeVideo(1)"
        >
          Next
          <ArrowRight :contrast="true" />
        </Button>
        <Button class="controls__button" :primary="true" @click="onRandom">
          <RandomIcon :contrast="true" />Random
        </Button>
      </div>
    </div>
    <div class="reel-viewer__sidebar">
      <ul class="videos">
        <li v-for="item of data" :key="item.fullName" class="videos__item">
          <Button
            :class="{
              videos__button: true,
              'videos__button--active': isActive(item)
            }"
            :title="item.name"
            :aria-label="
              `${item.name}${isActive(item) ? ' : active video' : ''}`
            "
            :disabled="isActive(item)"
            @click="onVideoSelect(item)"
          >
            <PlayIcon :show="isActive(item)" :contrast="true" />
            <div :aria-hidden="true">{{ item.name }}</div>
          </Button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

import { CRZVideo } from '@i/CRZVideo';
import Button from '@/components/Button.vue';
import Tickbox from '@/components/Tickbox.vue';
import PlayIcon from '@/components/Icons/PlayIcon.vue';
import ArrowLeft from '@/components/Icons/ArrowLeft.vue';
import ArrowRight from '@/components/Icons/ArrowRight.vue';
import RandomIcon from '@/components/Icons/RandomIcon.vue';
import { getRandomInt } from '@/utils/random';

const DURATION_CAP_SECONDS = 6;

const defaultMeta = {
  played: 0
};

@Component({
  components: { Button, PlayIcon, ArrowLeft, ArrowRight, RandomIcon, Tickbox }
})
export default class ReelViewer extends Vue {
  @Prop({ default: [] }) readonly data!: CRZVideo[];

  private autoCycle = false;
  private activeVideo: CRZVideo | null = null;
  private destroyListeners: (() => void) | null = null;
  private meta = { ...defaultMeta };

  // Lifecycle
  beforeDestroy() {
    if (this.destroyListeners) {
      this.destroyListeners();
    }
  }

  // Computed
  get activeIndex() {
    return this.data.findIndex(
      (x) => this.activeVideo && x.fullName === this.activeVideo.fullName
    );
  }

  // Methods
  private isActive(item: CRZVideo) {
    return this.activeVideo && this.activeVideo.fullName === item.fullName;
  }

  private onRandom() {
    const randomIndex = getRandomInt(0, this.data.length - 1);
    const item = this.data[randomIndex];
    this.onVideoSelect(item);
  }

  private onChangeVideo(diff: number) {
    const newIndex = this.activeIndex + diff;
    const item = this.data[newIndex];

    if (item) {
      this.onVideoSelect(item);
    }
  }

  private onAutoCycle() {
    this.autoCycle = !this.autoCycle;
  }

  private onVideoSelect(item: CRZVideo) {
    this.activeVideo = item;
    this.meta = { ...defaultMeta };
    this.setupListeners();
  }

  private setupListeners() {
    const vid = document.getElementById('videoPlayer');

    if (!vid) {
      return;
    }

    if (this.destroyListeners) {
      this.destroyListeners();
    }

    vid.addEventListener('ended', this.onVideoEnd);
    this.destroyListeners = () =>
      vid.removeEventListener('ended', this.onVideoEnd);
  }

  private onVideoEnd(event: Event) {
    const vid = event.srcElement as HTMLVideoElement;
    const duration = vid.duration;
    const played = this.meta.played + 1;
    this.meta.played = played;

    if (!this.autoCycle) {
      return;
    }

    const isShort = duration < DURATION_CAP_SECONDS;
    const isBelowAccumulativeLimit = duration * played < DURATION_CAP_SECONDS;

    if (isShort && isBelowAccumulativeLimit) {
      vid.play();
    } else {
      this.onChangeVideo(1);
    }
  }
}
</script>

<style scoped lang="scss">
@import '../styles/_mixins';

$max-height: 500px;
$max-width: 100%;

.reel-viewer {
  display: grid;
  gap: 5px;
  grid-auto-rows: minmax(500px, auto);
  grid-template-columns: repeat(8, minmax(100px, 1fr));
  grid-template-areas: 'vc vc vc vc vc vc vs vs';

  @include respondToAll((xxs, xs)) {
    grid-template-areas: 'vc vc vc vc vc vc vc vc' 'vs vs vs vs vs vs vs vs';
  }

  &__content {
    grid-area: vc;
  }

  &__sidebar {
    grid-area: vs;
    border: 1px dashed var(--accent-colour);
  }
}

.reel-viewer-active-video {
  max-width: $max-width;
  max-height: $max-height;
}

.video {
  &__player {
    width: $max-width;
    min-height: $max-height;
  }

  &__name,
  &__controls {
    padding: 5px;
    margin: 10px 0;
  }

  &__controls {
    display: flex;
  }
}

.controls {
  display: flex;

  &__button {
    margin: 0 2px;
  }
}

.videos {
  padding-left: 5px;
  list-style-type: none;

  &__item {
    border: 1px solid transparent;

    &:focus,
    &:hover {
      border-color: var(--accent-colour);
    }
  }

  &__button {
    width: 100%;

    &--active[disabled],
    &--active[disabled]:hover {
      background-color: var(--accent-colour);
      color: var(--accent-contrast);
    }
  }
}
</style>
<style lang="scss">
.controls__tickbox {
  --tickbox-default-colour: var(--contrast-colour);
}
</style>
