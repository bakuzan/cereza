<template>
  <div class="gallery-viewer">
    <div
      :class="{ 'reader-pane': true, 'reader-pane--gallery': !isReader }"
      v-crz-on-top="onPageTop"
    >
      <component
        v-for="item of images"
        :key="item.pageNumber"
        :id="`page_${item.pageNumber}`"
        :is="isReader ? 'div' : 'Button'"
        class="reader-entry"
        @click="onImageSelect(item)"
      >
        <img
          v-crz-on-intersect="onLoadMore"
          class="reader-entry__image"
          :src="item.image"
          :alt="`Page ${item.pageNumber} of ${data.totalImagesCount}`"
          :data-page-number="item.pageNumber"
        />
        <div v-if="isReader" class="reader-entry__counter">
          {{ item.pageNumber }}
        </div>
      </component>
    </div>
    <div class="gallery-viewer__footer">
      <Button class="gallery-viewer__button" :link="true" @click="onClose()"
        >Back to directory</Button
      >
    </div>
    <div class="gallery-viewer__info">
      {{ data.totalImagesCount }}
      {{ isReader ? 'pages' : 'images' }}
    </div>

    <GoToWidget
      v-if="isReader"
      :max="data.totalImagesCount"
      @submit="onGoToSubmit"
    />
  </div>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue } from 'vue-property-decorator';
import { SmartQuery } from 'vue-apollo';

import { ApolloResponse } from '@i/ApolloResponse';
import { ConfirmationResponse } from '@i/ConfirmationResponse';
import { CRZImage } from '@i/CRZImage';
import { GalleryResponse } from '@i/GalleryResponse';
import { GalleryView } from '@i/GalleryView';

import Button from '@/components/Button.vue';
import GoToWidget from '@/components/GoToWidget.vue';

import { OnIntersect } from '@/directives/OnIntersect';
import { OnTop } from '@/directives/OnTop';
import calculateGalleryPage from '@/utils/calculateGalleryPage';
import { ReaderMode } from '@/constants';
import { getPageFromHash } from '../utils';
import { isGalleryView } from '@/utils/guards';

@Component({
  components: {
    Button,
    GoToWidget
  },
  directives: { OnIntersect, OnTop }
})
export default class GalleryViewer extends Vue {
  @Prop({ required: true }) readonly data!: GalleryResponse;
  @Prop({ required: true }) readonly location!: string;
  @Prop({ required: true }) readonly mode!: ReaderMode;
  @Prop({ required: true }) readonly query!: SmartQuery<{
    page: number;
    size: number;
  }>;

  private hasMore = true;

  // Computed
  get isReader() {
    return this.mode === ReaderMode.Reader;
  }

  get images() {
    return Array(this.data.totalImagesCount)
      .fill(null)
      .map(
        (_, i) =>
          this.data.images.find((x) => x.pageNumber === i + 1) ?? {
            image: undefined,
            pageNumber: i + 1,
            url: ''
          }
      );
  }

  // Methods
  private onGoToSubmit(pageNumber: string) {
    this.onPageTop(`#page_${pageNumber}`, 'true');
  }

  private async onImageSelect(item: CRZImage) {
    if (this.isReader) {
      return;
    }

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

  private async onLoadMore(imageNumber: number) {
    if (this.query.loading) {
      return;
    }

    const page = calculateGalleryPage(imageNumber);

    await this.query.fetchMore({
      variables: {
        page,
        size: 25
      },
      updateQuery: (prev: GalleryView, result) => {
        const fetchMoreResult = result.fetchMoreResult;

        if (!isGalleryView(fetchMoreResult)) {
          this.hasMore = false;
          return prev;
        }

        const images = [
          ...prev.gallery.images,
          ...fetchMoreResult.gallery.images
        ].sort((a, b) => b.pageNumber - a.pageNumber);

        const totalImages = fetchMoreResult.gallery.totalImagesCount;
        this.hasMore = images.length !== totalImages;

        return Object.assign({}, prev, fetchMoreResult, {
          gallery: {
            ...fetchMoreResult.gallery,
            images
          }
        });
      }
    });
  }

  private onPageTop(hash: string, scroll = 'false') {
    const currPage = getPageFromHash(this.$route.hash);
    const nextPage = getPageFromHash(hash);

    const isSamePage = currPage === nextPage;
    const isNextPage = currPage + 1 === nextPage;
    const isPrevPage = currPage - 1 === nextPage;
    const currScroll = this.$route.query['scroll'];
    const scrollChanged =
      currScroll && currScroll !== scroll && scroll !== 'true';

    if (isSamePage || (!isNextPage && !isPrevPage && scrollChanged)) {
      return;
    }

    this.$router.replace({
      hash,
      name: 'Reader',
      query: {
        ...this.$route.query,
        scroll
      }
    });
  }

  @Emit('close')
  private onClose(event: Event) {
    return event;
  }
}
</script>

<style scoped lang="scss">
.gallery-viewer {
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
    transition: all 0.25s ease-in-out;

    &:hover {
      background-color: var(--base-colour);
    }
  }
}

.reader-pane {
  display: grid;
  grid-auto-rows: 1fr;

  &--gallery {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 5px;
    padding: 0 5px;
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
