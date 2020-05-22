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
            <Button
              class="reader__button"
              aria-label="Back to directory"
              title="Back to directory"
              @click="onCloseReader()"
            >
              <CrossIcon />
            </Button>
          </div>
          <div v-if="data.gallery.canGallery" class="reader-pane">
            <div
              v-for="(image, index) of data.gallery.images"
              :key="index"
              :id="`page_${index + 1}`"
              class="reader-entry"
            >
              <img
                class="reader-entry__image"
                :src="image"
                :alt="`Page ${index + 1} of ${data.gallery.images.length}`"
              />
              <div class="reader-entry__counter">{{ index + 1 }}</div>
            </div>
            <div class="reader-pane__footer">
              <Button
                class="reader__button"
                :link="true"
                @click="onCloseReader()"
                >Back to directory</Button
              >
            </div>
            <div class="reader-pane__info">
              {{ data.gallery.images.length }} pages
            </div>
          </div>
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

import scrollToAnchor from '@/utils/scrollToAnchor';

@Component({
  components: { Button, CrossIcon, ErrorBlock, LoadingBouncer },
  metaInfo() {
    return {
      title: 'Reader'
    };
  }
})
export default class Reader extends Vue {
  // Lifecycle
  mounted() {
    scrollToAnchor('#reader', -55);
  }

  // Computed
  get directoryLocation() {
    const loc = this.$route.query['loc'];
    return (loc instanceof Array ? loc.pop() : loc) ?? '';
  }

  // Methods
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
  margin: -5px;
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
</style>

<style lang="scss">
.reader__button .icon svg {
  stroke: var(--contrast-colour);
}
</style>
