<template>
  <div id="reader" class="page reader">
    <ApolloQuery
      :query="require('../graphql/Gallery.gql')"
      :variables="{ path: directoryLocation, page: initialPage, size: 25 }"
      :skip="initialPage === null"
    >
      <template slot-scope="{ result: { loading, error, data }, query }">
        <LoadingBouncer v-if="loading" />

        <ErrorBlock
          v-if="error"
          :data="error"
          message="Failed to fetch gallery contents."
        />

        <div v-else-if="data && data.gallery" class="result apollo">
          <div class="reader__header">
            <h2 class="page__title">{{ data.gallery.folderName }}</h2>
            <div class="flex-spacer"></div>
            <RadioButtonGroup
              id="mode"
              name="mode"
              :value="mode"
              :options="modeOptions"
              @change="onModeChange"
            />

            <Help title="Reader keyboard controls">
              <table class="shortcuts-table">
                <thead>
                  <tr>
                    <th style="text-align: left">Control</th>
                    <th>Shortcut</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="item of readerShortcuts"
                    :key="item.name"
                    class="shortcuts-table__row"
                  >
                    <td>{{ item.name }}</td>
                    <td style="text-align: center">{{ item.shortcut }}</td>
                  </tr>
                </tbody>
              </table>
            </Help>
            <Button
              class="reader__button"
              aria-label="Back to directory"
              title="Back to directory"
              @click="onCloseReader()"
            >
              <CrossIcon />
            </Button>
          </div>
          <GalleryViewer
            v-if="data.gallery.canGallery"
            :data="data.gallery"
            :location="directoryLocation"
            :mode="mode"
            :query="query"
            @close="onCloseReader()"
          />
          <div v-else>
            <p>This directory is not a valid gallery reader directory.</p>
            <Button class="reader__button" :link="true" @click="onCloseReader()"
              >Back to directory</Button
            >
          </div>
        </div>

        <div v-else class="no-result apollo"></div>
      </template>
    </ApolloQuery>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

import Button from '@/components/Button.vue';
import CrossIcon from '@/components/Icons/CrossIcon.vue';
import ErrorBlock from '@/components/ErrorBlock.vue';
import LoadingBouncer from '@/components/LoadingBouncer.vue';
import RadioButtonGroup from '@/components/RadioButtonGroup.vue';
import Help from '@/components/Help.vue';
import GalleryViewer from '@/components/GalleryViewer.vue';

import { getPageFromHash } from '@/utils';
import { store } from '@/utils/localStorage';
import scrollToAnchor from '@/utils/scrollToAnchor';
import initReaderControls from '@/utils/userControls/reader';
import calculateGalleryPage from '@/utils/calculateGalleryPage';
import { getLocation } from '@/utils/routeArgs';
import { ReaderMode } from '@/constants';

@Component({
  components: {
    Button,
    CrossIcon,
    ErrorBlock,
    LoadingBouncer,
    RadioButtonGroup,
    GalleryViewer,
    Help
  },
  metaInfo() {
    return {
      title: 'Reader'
    };
  }
})
export default class Reader extends Vue {
  private readonly modeOptions = [
    { value: ReaderMode.Reader, label: 'Reader' },
    { value: ReaderMode.Gallery, label: 'Gallery' }
  ];

  private readerShortcuts = [
    { name: 'Back a page', shortcut: ',' },
    { name: 'Forward a page', shortcut: '.' }
  ];

  private initialPage: number | null = null;
  private removeControls: (() => void) | null = null;

  // Lifecycle
  mounted() {
    scrollToAnchor('#reader', -55);
    this.removeControls = initReaderControls(this);

    const hashNumber = getPageFromHash(this.$route.hash);
    this.initialPage = calculateGalleryPage(Number(hashNumber));
  }

  beforeDestroy() {
    if (this.removeControls) {
      this.removeControls();
    }
  }

  // Computed
  get directoryLocation() {
    return getLocation(this.$route);
  }

  get mode() {
    const mode = this.$route.query['mode'];
    const activeMode = mode instanceof Array ? mode.pop() : mode;
    const preferredModes = new Map(store.getKey('galleryFallbackModes'));

    return (
      activeMode ??
      preferredModes.get(this.directoryLocation) ??
      ReaderMode.Reader
    );
  }

  // Methods
  private onModeChange({ value }: { value: string }) {
    this.$router.replace({
      hash: undefined,
      name: 'Reader',
      query: {
        ...this.$route.query,
        mode: value
      }
    });

    const preferredModes = new Map(store.getKey('galleryFallbackModes'));
    preferredModes.set(this.directoryLocation, value);

    store.set({ galleryFallbackModes: Array.from(preferredModes.entries()) });
  }

  private onCloseReader() {
    const param = window.encodeURIComponent(this.directoryLocation);
    this.$router.push(`/directory?loc=${param}`);
  }
}
</script>

<style lang="scss" scoped>
.reader {
  background: var(--base-colour);
  color: var(--contrast-colour);
  padding-top: calc(5px + var(--header-height));
  margin: -5px;
  margin-top: calc(-5px - var(--header-height));
  z-index: 10;

  > div,
  .result {
    background-color: inherit;
  }

  .page__title {
    margin-left: 10px;
  }

  &__header {
    display: flex;
    flex-flow: wrap;
    justify-content: space-between;
    align-items: center;
    background-color: inherit;
  }

  &__button {
    color: var(--contrast-colour);
  }
}

.shortcuts-table {
  padding: 5px;

  th {
    border-bottom: 1px solid var(--accent-colour);
  }

  &__row {
    padding: 2px 0;
  }
}
</style>

<style lang="scss">
.reader__button .icon svg {
  stroke: var(--contrast-colour);
}
</style>
