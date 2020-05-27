<template>
  <div class="page directory">
    <div class="directory__header">
      <h2 class="page__title">Directory</h2>
      <Crumbs :path="directoryLocation" @select="navigateTo" />
      <div class="flex-spacer" />
      <Button class="action-button" @click="onAction(directoryLocation)">
        <FolderIcon />
        <div class="action-button__name">Explorer</div>
      </Button>
    </div>
    <ApolloQuery
      :query="require('../graphql/Directory.gql')"
      :variables="{ path: directoryLocation }"
    >
      <template slot-scope="{ result: { loading, error, data } }">
        <LoadingBouncer v-if="loading" />

        <ErrorBlock
          v-else-if="error"
          :data="error"
          message="Failed to fetch directory contents."
        />

        <div v-else-if="data && data.directory" class="result apollo">
          <div class="flex flex--spaced directory__actions">
            <InputBox
              id="filter"
              class-name="filter-box"
              name="filter"
              label="Filter current directory..."
              :value="filter"
              @change="onFilter"
            />
            <div class="flex-spacer"></div>
            <div>
              <Button
                v-if="data.directory.canGallery"
                class="can-do-button"
                :primary="true"
                @click="onReader()"
              >
                <BookIcon :contrast="true" />Reader Mode
              </Button>
              <Button
                v-if="data.directory.canReel"
                class="can-do-button"
                :primary="true"
                @click="onReel()"
              >
                <FilmIcon :contrast="true" />Reel Mode
              </Button>
            </div>
            <ApolloMutation
              :mutation="require('../graphql/mutations/TogglePinned.gql')"
              :variables="{ path: directoryLocation }"
              @done="() => null"
            >
              <template
                v-slot="{ mutate, loading: mutateLoading, error: mutateError }"
              >
                <ApolloQuery
                  :query="require('../graphql/IsDirectoryPinned.gql')"
                  :variables="{ path: directoryLocation }"
                >
                  <template slot-scope="{ result: pinResult }">
                    <Button
                      v-if="pinResult && pinResult.data"
                      :class="{
                        'pin-button': true,
                        'pin-button--pinned': pinResult.data.isDirectoryPinned,
                        'pin-button--unpinned': !pinResult.data
                          .isDirectoryPinned
                      }"
                      :primary="true"
                      :disabled="pinResult.loading || mutateLoading"
                      @click="
                        mutate({
                          update: onUpdate,
                          refetchQueries: [
                            {
                              query: require('../graphql/IsDirectoryPinned.gql'),
                              variables: { path: directoryLocation }
                            }
                          ]
                        })
                      "
                    >
                      <PinIcon
                        v-if="!pinResult.loading && !mutateLoading"
                        :fill="true"
                        :contrast="!pinResult.data.isDirectoryPinned"
                      />
                      {{
                        pinResult.loading || mutateLoading
                          ? ''
                          : pinResult.data.isDirectoryPinned
                          ? 'Unpin'
                          : 'Pin'
                      }}
                    </Button>
                    <p v-if="mutateError">
                      Failed directory
                      {{ data.isDirectoryPinned ? ' unpinning' : ' pinning' }}:
                      {{ mutateError }}
                    </p>
                  </template>
                </ApolloQuery>
              </template>
            </ApolloMutation>
          </div>
          <div class="result__count">
            Showing
            {{
              data.directory.entries.filter((x) =>
                x.name.toLowerCase().includes(filter)
              ).length
            }}
            of
            {{ data.directory.entries.length }}
          </div>
          <ul class="grid directory-list">
            <li
              v-for="item of data.directory.entries.filter((x) =>
                x.name.toLowerCase().includes(filter)
              )"
              :key="item.path"
              class="directory-item"
            >
              <Button
                class="directory-item__button"
                @click="handleSelect(item)"
              >
                <FolderIcon
                  v-if="item.isDirectory"
                  title="Folder"
                  aria-label="Folder"
                />
                <ShortcutIcon
                  v-else-if="item.isShortcut"
                  title="Shortcut"
                  aria-label="Shortcut"
                />
                <ImageIcon
                  v-else-if="item.isImage"
                  title="Image"
                  aria-label="Image"
                />
                <VideoIcon
                  v-else-if="item.isVideo"
                  title="Video"
                  aria-label="Video"
                />
                <FileIcon v-else title="File" aria-label="File" />

                <div class="directory-item__name">{{ item.name }}</div>
              </Button>
            </li>
          </ul>
        </div>

        <div v-else class="no-result apollo"></div>
      </template>
    </ApolloQuery>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';

import { DirectoryEntry } from '@i/DirectoryEntry';
import { ApolloResponse } from '@i/ApolloResponse';
import { ConfirmationResponse } from '@i/ConfirmationResponse';

import { CRZDataProxy } from '@/types/CRZDataProxy';
import Button from '@/components/Button.vue';
import ErrorBlock from '@/components/ErrorBlock.vue';
import LoadingBouncer from '@/components/LoadingBouncer.vue';
import Widget from '@/components/Widget.vue';
import FileIcon from '@/components/Icons/FileIcon.vue';
import FolderIcon from '@/components/Icons/FolderIcon.vue';
import ImageIcon from '@/components/Icons/ImageIcon.vue';
import VideoIcon from '@/components/Icons/VideoIcon.vue';
import PinIcon from '@/components/Icons/PinIcon.vue';
import BookIcon from '@/components/Icons/BookIcon.vue';
import FilmIcon from '@/components/Icons/FilmIcon.vue';
import ShortcutIcon from '@/components/Icons/ShortcutIcon.vue';
import Crumbs from '@/components/Crumbs.vue';
import InputBox from '@/components/InputBox.vue';

@Component({
  components: {
    Button,
    ErrorBlock,
    LoadingBouncer,
    Widget,
    FileIcon,
    FolderIcon,
    ImageIcon,
    VideoIcon,
    PinIcon,
    BookIcon,
    FilmIcon,
    ShortcutIcon,
    Crumbs,
    InputBox
  },
  metaInfo() {
    return {
      title: 'Directory'
    };
  }
})
export default class Directory extends Vue {
  private filter = '';

  @Watch('$route')
  onRouteChange() {
    this.filter = '';
  }

  get directoryLocation() {
    const loc = this.$route.query['loc'];
    return (loc instanceof Array ? loc.pop() : loc) ?? '';
  }

  private handleSelect(item: DirectoryEntry) {
    if (item.isDirectory) {
      this.navigateTo(item.path);
    } else {
      this.onAction(item.path);
    }
  }

  private async onAction(path: string) {
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

  private navigateTo(directory: string) {
    const param = window.encodeURIComponent(directory);
    this.$router.push(`/directory?loc=${param}`);
  }

  private onFilter({ value }: { value: string }) {
    this.$set(this, 'filter', value.toLowerCase());
  }

  private onUpdate(client: CRZDataProxy) {
    client.deleteQueryCRZ('allPinned');
  }

  private onReader() {
    const param = window.encodeURIComponent(this.directoryLocation);
    this.$router.push(`/gallery-reader?loc=${param}`);
  }

  private onReel() {
    const param = window.encodeURIComponent(this.directoryLocation);
    this.$router.push(`/reel-viewer?loc=${param}`);
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/_mixins.scss';

.directory {
  &__header {
    display: flex;
    flex-flow: wrap;
    align-items: center;
  }

  @include respondToAll((xxs, xs)) {
    &__actions {
      flex-wrap: wrap;
      margin-bottom: 15px;
    }
  }
}

.action-button,
.directory-item__button {
  border: 1px solid transparent;

  &:focus,
  &:hover,
  &:active {
    border-color: var(--accent-colour);
  }
}

.directory-list {
  grid-auto-rows: 1fr;
  grid-auto-columns: 1fr;
  gap: 5px;
}

.directory-item {
  display: flex;
  align-items: center;

  &__button {
    width: 100%;

    &:focus,
    &:hover,
    &:active {
      .directory-item__name {
        text-decoration: underline;
      }
    }
  }

  &__name {
    font-size: 1.2rem;
    white-space: pre-line;
    text-align: left;
  }
}

.pin-button,
.can-do-button {
  justify-content: space-evenly;
  min-height: 2.5rem;
  min-width: 100px;
}

.pin-button--pinned {
  background-color: var(--disabled-colour);
  color: inherit;

  &:focus,
  &:hover,
  &:active {
    background-color: var(--disabled-colour);
  }
}

.result {
  &.apollo {
    margin: 10px 0;

    @include respondToAll((xxs, xs)) {
      margin: 20px 0;
    }
  }

  &__count {
    font-size: 0.75rem;
    margin: 5px;
  }
}

.filter-box {
  min-width: 250px;
}
</style>

<style lang="scss">
.action-button,
.directory-item__button {
  &:focus,
  &:hover,
  &:active {
    svg {
      stroke: var(--accent-contrast);
      fill: var(--accent-colour);
    }
  }
}
</style>
