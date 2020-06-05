<template>
  <div class="gallery-viewer">
    <div
      :class="{ 'reader-pane': true, 'reader-pane--gallery': !isReader }"
      v-crz-on-top="onPageTop"
    >
      <component
        v-for="(item, index) of data.images"
        :key="index"
        :id="`page_${index + 1}`"
        :is="isReader ? 'div' : 'Button'"
        class="reader-entry"
        @click="onImageSelect(item)"
      >
        <img
          class="reader-entry__image"
          :src="item.image"
          :alt="`Page ${index + 1} of ${data.images.length}`"
        />
        <div v-if="isReader" class="reader-entry__counter">{{ index + 1 }}</div>
      </component>
    </div>
    <div class="gallery-viewer__footer">
      <Button class="gallery-viewer__button" :link="true" @click="onClose()"
        >Back to directory</Button
      >
    </div>
    <div class="gallery-viewer__info">
      {{ data.images.length }}
      {{ isReader ? 'pages' : 'images' }}
    </div>

    <GoToWidget
      v-if="isReader"
      :max="data.images.length"
      @submit="onGoToSubmit"
    />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

import { ApolloResponse } from '@i/ApolloResponse';
import { ConfirmationResponse } from '@i/ConfirmationResponse';
import { CRZImage } from '@i/CRZImage';
import { GalleryResponse } from '@i/GalleryResponse';

import Button from '@/components/Button.vue';
import GoToWidget from '@/components/GoToWidget.vue';

import { OnTop } from '@/directives/OnTop';
import { ReaderMode } from '@/constants';

@Component({
  components: {
    Button,
    GoToWidget
  },
  directives: { OnTop }
})
export default class GalleryViewer extends Vue {
  @Prop({ required: true }) readonly data!: GalleryResponse;
  @Prop({ required: true }) readonly location!: string;
  @Prop({ required: true }) readonly mode!: ReaderMode;

  // Computed
  get isReader() {
    return this.mode === ReaderMode.Reader;
  }

  // Methods
  private onGoToSubmit(pageNumber: string) {
    const loc = this.location;
    this.$router.replace(`${this.$route.path}?loc=${loc}#page_${pageNumber}`);
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

  private onClose() {
    this.$emit('close');
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
