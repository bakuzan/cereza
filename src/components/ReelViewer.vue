<template>
  <div class="reel-viewer">
    <div class="reel-viewer__content video">
      <div class="video__player">
        <video
          v-if="activeVideo === null && isVideoReel"
          id="videoPlayer"
          class="reel-viewer-active-video"
          controls
        ></video>
        <video
          v-else-if="activeVideo && isVideoReel"
          id="videoPlayer"
          class="reel-viewer-active-video"
          controls
          preload="auto"
          :autoplay="autoCycle"
          :src="activeVideo.url"
          :type="`video/${activeVideo.extension}`"
        ></video>
        <audio
          v-if="activeVideo === null && isAudioReel && !isVideoReel"
          id="videoPlayer"
          class="reel-viewer-active-video"
          controls
        ></audio>
        <audio
          v-else-if="activeVideo && isAudioReel && !isVideoReel"
          id="videoPlayer"
          class="reel-viewer-active-video"
          controls
          preload="auto"
          :autoplay="autoCycle"
          :src="activeVideo.url"
          :type="`audio/${activeVideo.extension}`"
        ></audio>
      </div>
      <h3 class="video__name">
        {{ activeVideo ? activeVideo.name : '' }}
        <div class="video__playback-speed">
          ({{ meta.playbackSpeed }}x speed)
        </div>
        <Button
          v-if="activeVideo"
          class="action-button"
          aria-label="Open parent folder"
          title="Open parent folder"
          @click="openParentFolder(activeVideo)"
        >
          <FolderIcon />
        </Button>
      </h3>
      <div class="video__controls controls">
        <div>
          <Tickbox
            id="autoCycle"
            class-name="controls__tickbox"
            name="autoCycle"
            label="Auto cycle"
            :checked="autoCycle"
            @change="onAutoCycle"
          />
          <Tickbox
            v-if="autoCycle"
            id="randomCycle"
            class-name="controls__tickbox"
            name="randomCycle"
            label="Randomise cycle"
            :checked="randomCycle"
            @change="onRandomCycle"
          />
        </div>
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
          :disabled="activeIndex === filteredData.length - 1"
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
      <InputBox
        id="filter"
        class-name="filter-box video-filter"
        name="filter"
        label="Filter videos..."
        :value="filter"
        @change="onFilter"
        @keypress.stop="() => null"
      />
      <SortOptionsBlock :selected="sort" @change="onSortChange" />
      <ul class="reel-viewer__directory">
        <li
          v-for="folder of directory"
          :key="folder.folderName"
          class="reel-viewer__directory-item"
        >
          <h4
            v-if="folderName !== folder.folderName"
            class="reel-viewer__directory-name"
          >
            {{ folder.folderName }}
          </h4>
          <ul
            :class="{
              videos: true,
              'videos--no-padding': folderName === folder.folderName
            }"
          >
            <li
              v-for="item of folder.items"
              :key="item.key"
              class="videos__item"
            >
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
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit } from 'vue-property-decorator';

import { CRZMedia } from '@i/CRZMedia';
import { SortOptions } from '@i/SortOptions';
import { ApolloResponse } from '@i/ApolloResponse';
import { ConfirmationResponse } from '@i/ConfirmationResponse';

import FolderIcon from '@/components/Icons/FolderIcon.vue';
import Button from '@/components/Button.vue';
import InputBox from '@/components/InputBox.vue';
import Tickbox from '@/components/Tickbox.vue';
import PlayIcon from '@/components/Icons/PlayIcon.vue';
import ArrowLeft from '@/components/Icons/ArrowLeft.vue';
import ArrowRight from '@/components/Icons/ArrowRight.vue';
import RandomIcon from '@/components/Icons/RandomIcon.vue';
import SortOptionsBlock from '@/components/SortOptions.vue';

import { getRandomInt } from '@/utils/random';
import { getLocation } from '@/utils/routeArgs';
import initReelControls from '@/utils/userControls/reel';

const DURATION_CAP_SECONDS = 6;

const defaultMeta = {
  played: 0,
  playbackSpeed: 1
};

@Component({
  components: {
    Button,
    PlayIcon,
    ArrowLeft,
    ArrowRight,
    RandomIcon,
    Tickbox,
    InputBox,
    SortOptionsBlock,
    FolderIcon
  }
})
export default class ReelViewer extends Vue {
  @Prop({ default: [] }) readonly data!: CRZMedia[];
  @Prop({ default: '' }) readonly folderName!: string;
  @Prop({ required: true }) readonly isAudioReel!: boolean;
  @Prop({ required: true }) readonly isVideoReel!: boolean;
  @Prop({ required: true }) readonly sort!: SortOptions;

  private autoCycle = false;
  private randomCycle = false;
  private filter = '';
  private destroyListeners: (() => void) | null = null;
  private removeControls: (() => void) | null = null;
  private meta = { ...defaultMeta };

  // Lifecycle
  mounted() {
    this.removeControls = initReelControls({
      onChange: this.onChangeVideo,
      onPlaybackSpeedChange: (speed: number) =>
        (this.meta.playbackSpeed = speed),
      onRandom: this.onRandom,
      onToggleAutoCycle: this.onAutoCycle,
      onToggleRandomisedCycle: this.onRandomCycle,
      selector: '#videoPlayer'
    });
  }

  beforeDestroy() {
    if (this.destroyListeners) {
      this.destroyListeners();
    }

    if (this.removeControls) {
      this.removeControls();
    }
  }

  // Computed
  get selected() {
    const selected = this.$route.query['selected'];
    return (selected instanceof Array ? selected.pop() : selected) ?? '';
  }

  get filteredData() {
    return this.data.filter((x) => x.name.toLowerCase().includes(this.filter));
  }

  get isNameSorted() {
    return this.sort.field === 'Name';
  }

  get directory() {
    if (this.isNameSorted) {
      return Array.from(new Set(this.filteredData.map((x) => x.folderName)))
        .map((folderName) => ({
          folderName,
          items: this.filteredData.filter((x) => x.folderName === folderName)
        }))
        .filter((x) => x.items.length);
    } else {
      return [{ folderName: this.folderName, items: this.filteredData }];
    }
  }

  get activeIndex() {
    return this.filteredData.findIndex(
      (x) => this.selected && x.key === this.selected
    );
  }

  get activeVideo() {
    if (this.activeIndex === -1) {
      return null;
    }

    return this.filteredData[this.activeIndex] ?? null;
  }

  // Methods
  private onFilter({ value }: { value: string }) {
    this.$set(this, 'filter', value.toLowerCase());
  }

  @Emit('updateSort')
  private onSortChange(option: SortOptions) {
    return option;
  }

  private isActive(item: CRZMedia) {
    return this.activeVideo && this.activeVideo.key === item.key;
  }

  private onRandom() {
    const maxNumber = this.filteredData.length - 1;
    const randomIndex = getRandomInt(0, maxNumber);
    const item = this.filteredData[randomIndex];
    this.onVideoSelect(item);
  }

  private onChangeVideo(diff: number) {
    const newIndex = this.activeIndex + diff;
    const item = this.filteredData[newIndex];

    if (item) {
      this.onVideoSelect(item);
    }
  }

  private onAutoCycle() {
    this.autoCycle = !this.autoCycle;

    if (this.autoCycle && this.destroyListeners === null) {
      this.setupListeners();
    }
  }

  private onRandomCycle() {
    this.randomCycle = this.autoCycle && !this.randomCycle;
  }

  private onVideoSelect(item: CRZMedia) {
    this.$router.replace({
      name: 'Reel',
      query: {
        ...this.$route.query,
        selected: item.key
      }
    });

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
    } else if (this.randomCycle) {
      this.onRandom();
    } else {
      this.onChangeVideo(1);
    }
  }

  private async openParentFolder(file: CRZMedia) {
    const path = file.folderPath; // `${baseLocation}\\${file.folderName}`.replace(/\\\\/g, '\\');

    const result = await this.$apollo.query<
      ApolloResponse<ConfirmationResponse>
    >({
      fetchPolicy: 'network-only',
      query: require('../graphql/Action.gql'),
      variables: { path }
    });

    if (!result.data?.action.success) {
      // TODO Handle error
      console.error(`Failed action @ ${path}`, result);
    }
  }
}
</script>

<style scoped lang="scss">
@import '../styles/_mixins';

$filter-box-height: 46px;
$sort-options-height: 45px;

$max-height: 500px;
$max-width: 100%;

.reel-viewer {
  display: grid;
  gap: 5px;
  grid-auto-rows: minmax(500px, auto);
  grid-template-columns: repeat(9, minmax(100px, 1fr));
  grid-template-areas: 'vc vc vc vc vc vc vs vs vs';

  @include respondToAll((xxs, xs)) {
    grid-template-areas: 'vc vc vc vc vc vc vc vc vc' 'vs vs vs vs vs vs vs vs vs';
  }

  &__content {
    grid-area: vc;
  }

  &__sidebar {
    grid-area: vs;
    border: 1px dashed var(--accent-colour);
  }

  &__directory {
    list-style-type: none;
    max-height: calc(
      100vh - (var(--header-height) * 2) - #{$filter-box-height} - #{$sort-options-height}
    );
    padding: 0;
    margin: 0;
    overflow: auto;
  }

  &__directory-name {
    margin: 1em 0.5em;
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

  &__playback-speed {
    display: inline-block;
    font-size: 0.8rem;
    font-weight: lighter;
    margin: 0 5px;
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
  list-style-type: none;
  padding: 0;
  margin: 0;

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
    &--active[disabled]:focus,
    &--active[disabled]:hover {
      --disabled-colour: var(--accent-colour);

      background-color: var(--accent-colour);
      color: var(--accent-contrast);
    }
  }
}
</style>
<style lang="scss">
.video-filter input {
  color: inherit !important;
}

.controls__tickbox {
  --tickbox-default-colour: var(--contrast-colour);
}
</style>
