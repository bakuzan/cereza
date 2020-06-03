<template>
  <div id="reader" class="page reader">
    <ApolloQuery
      :query="require('../graphql/Gallery.gql')"
      :variables="{ path: directoryLocation }"
    >
      <template slot-scope="{ result: { loading, error, data } }">
        <LoadingBouncer v-if="loading" />

        <ErrorBlock
          v-else-if="error"
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
            <Button
              class="reader__button"
              aria-label="Back to directory"
              title="Back to directory"
              @click="onCloseReader()"
            >
              <CrossIcon />
            </Button>
          </div>
          <div
            v-if="data.gallery.canGallery"
            :class="{ 'reader-pane': true, 'reader-pane--gallery': !isReader }"
            v-crz-on-top="onPageTop"
          >
            <component
              v-for="(item, index) of data.gallery.images"
              :key="index"
              :id="`page_${index + 1}`"
              :is="isReader ? 'div' : 'Button'"
              class="reader-entry"
              @click="onImageSelect(item)"
            >
              <img
                class="reader-entry__image"
                :src="item.image"
                :alt="`Page ${index + 1} of ${data.gallery.images.length}`"
              />
              <div v-if="isReader" class="reader-entry__counter">
                {{ index + 1 }}
              </div>
            </component>
            <div class="reader-pane__footer">
              <Button
                class="reader__button"
                :link="true"
                @click="onCloseReader()"
                >Back to directory</Button
              >
            </div>
            <div class="reader-pane__info">
              {{ data.gallery.images.length }}
              {{ isReader ? 'pages' : 'images' }}
            </div>
          </div>
          <div v-else>
            <p>This directory is not a valid gallery reader directory.</p>
            <Button class="reader__button" :link="true" @click="onCloseReader()"
              >Back to directory</Button
            >
          </div>

          <GoToWidget
            v-if="isReader"
            :max="data.gallery.images.length"
            @submit="onGoToSubmit"
          />
        </div>

        <div v-else class="no-result apollo"></div>
      </template>
    </ApolloQuery>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

import { ApolloResponse } from '@i/ApolloResponse';
import { ConfirmationResponse } from '@i/ConfirmationResponse';
import { CRZImage } from '@i/CRZImage';

import Button from '@/components/Button.vue';
import CrossIcon from '@/components/Icons/CrossIcon.vue';
import ErrorBlock from '@/components/ErrorBlock.vue';
import LoadingBouncer from '@/components/LoadingBouncer.vue';
import GoToWidget from '@/components/GoToWidget.vue';
import RadioButtonGroup from '@/components/RadioButtonGroup.vue';

import { OnTop } from '@/directives/OnTop';
import scrollToAnchor from '@/utils/scrollToAnchor';
import initReaderControls from '@/utils/userControls/reader';

enum ReaderMode {
  Gallery = 'gallery',
  Reader = 'reader'
}

@Component({
  components: {
    Button,
    CrossIcon,
    ErrorBlock,
    LoadingBouncer,
    GoToWidget,
    RadioButtonGroup
  },
  directives: { OnTop },
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

  private removeControls: (() => void) | null = null;

  // Lifecycle
  mounted() {
    scrollToAnchor('#reader', -55);
    this.removeControls = initReaderControls(this);
  }

  beforeDestroy() {
    if (this.removeControls) {
      this.removeControls();
    }
  }

  // Computed
  get directoryLocation() {
    const loc = this.$route.query['loc'];
    return (loc instanceof Array ? loc.pop() : loc) ?? '';
  }

  get mode() {
    const mode = this.$route.query['mode'];
    return (mode instanceof Array ? mode.pop() : mode) ?? ReaderMode.Reader;
  }

  get isReader() {
    return this.mode === ReaderMode.Reader;
  }

  // Methods
  private onGoToSubmit(pageNumber: string) {
    const loc = this.$route.query['loc'];
    this.$router.replace(`${this.$route.path}?loc=${loc}#page_${pageNumber}`);
  }

  private onModeChange({ value }: { value: string }) {
    this.$router.replace({
      hash: undefined,
      name: 'Reader',
      query: {
        ...this.$route.query,
        mode: value
      }
    });
  }

  private onCloseReader() {
    const param = window.encodeURIComponent(this.directoryLocation);
    this.$router.push(`/directory?loc=${param}`);
  }

  private async onImageSelect(item: CRZImage) {
    const result = await this.$apollo.query<
      ApolloResponse<ConfirmationResponse>
    >({
      fetchPolicy: 'network-only',
      query: require('../graphql/Action.gql'),
      variables: { path: item.url }
    });

    if (!result.data?.action.success) {
      // TODO Handle error
      console.error(`Failed action @ ${item.url}`, result);
    }
  }

  private onPageTop(hash: string) {
    if (this.$route.hash === hash) {
      return;
    }

    this.$router.replace({
      hash,
      name: 'Reader',
      query: {
        ...this.$route.query,
        scroll: 'false'
      }
    });
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

  .page__title {
    margin-left: 10px;
  }

  &__header {
    display: flex;
    flex-flow: wrap;
    justify-content: space-between;
    align-items: center;
  }

  &__button {
    color: var(--contrast-colour);
  }
}

.reader-pane {
  &--gallery {
    display: grid;
    grid-auto-rows: 1fr;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 5px;
    padding: 0 5px;
  }

  &__footer {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px 0;
  }

  &__info {
    position: fixed;
    left: 0;
    bottom: 0;
    padding: 5px;
    margin: 5px;
  }
}

.reader-entry {
  &__image {
    max-width: 100%;
    display: block;
    margin: 5px auto;
  }

  &__counter {
    position: relative;
    width: 30px;
    background-color: var(--base-colour);
    color: var(--contrast-colour);
    padding-left: 5px;
    padding-right: 5px;
    margin-left: auto;
    margin-right: auto;
    margin-top: -12px;
    border: 1px solid var(--contrast-colour);
    border-radius: 10px;
    text-align: center;
    z-index: 100;
  }
}

.button.reader-entry {
  border: 1px solid transparent;

  &:focus,
  &:hover,
  &:active {
    border-color: var(--accent-colour);
  }
}
</style>

<style lang="scss">
.reader__button .icon svg {
  stroke: var(--contrast-colour);
}
</style>
