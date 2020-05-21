<template>
  <div class="page reader">
    <ApolloQuery
      :query="require('../graphql/Gallery.gql')"
      :variables="{ path: directoryLocation }"
    >
      <template slot-scope="{ result: { loading, error, data } }">
        <LoadingBouncer v-if="loading" />

        <ErrorBlock v-else-if="error" :data="error" message="Failed to fetch gallery contents." />

        <div v-else-if="data && data.gallery" class="result apollo">
          <div class="reader__header">
            <h2 class="page__title">{{ data.gallery.folderName }}</h2>
            <Button
              aria-label="Back to directory"
              title="Back to directory"
              @click="onCloseReader()"
            >
              <CrossIcon />
            </Button>
          </div>
          <div v-if="data.gallery.canGallery" class="reader-pane">
            <div v-for="(image, index) of data.gallery.images" :key="index" class="reader-entry">
              <img
                class="reader-entry__image"
                :src="image"
                :alt="`Page ${index + 1} of ${data.gallery.images.length}`"
              />
              <div class="reader-entry__counter">{{ index + 1 }}</div>
            </div>
          </div>
          <div v-else>
            <p>This directory is not a valid gallery reader directory.</p>
            <Button :link="true" @click="onCloseReader()">Back to directory</Button>
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

@Component({
  components: { Button, CrossIcon, ErrorBlock, LoadingBouncer },
  metaInfo() {
    console.log('Reader...', this);
    return {
      title: 'Reader'
    };
  }
})
export default class Reader extends Vue {
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
  &__header {
    display: flex;
    flex-flow: wrap;
    align-items: center;
  }
}

.reader-pane {
  background: var(--base-colour);
  height: 100%;
  width: 100%;
}

.reader-entry {
  &__image {
    max-width: 100%;
    display: block;
    margin: 3px auto;
  }

  &__counter {
    position: relative;
    width: 30px;
    background-color: var(--base-colour);
    color: var(--accent-colour);
    padding-left: 5px;
    padding-right: 5px;
    margin-left: auto;
    margin-right: auto;
    margin-top: -12px;
    border: 1px solid var(--accent-colour);
    border-radius: 10px;
    text-align: center;
    z-index: 100;
  }
}
</style>