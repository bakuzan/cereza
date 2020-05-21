<template>
  <div class="page directory">
    <div class="directory__header">
      <h2 class="page__title">Directory</h2>
      <Crumbs :path="directoryLocation" @select="navigateTo" />
    </div>
    <ApolloQuery
      :query="require('../graphql/Directory.gql')"
      :variables="{ path: directoryLocation }"
    >
      <template slot-scope="{ result: { loading, error, data } }">
        <LoadingBouncer v-if="loading" />

        <ErrorBlock v-else-if="error" :data="error" message="Failed to fetch directory contents." />

        <div v-else-if="data && data.directory" class="result apollo">
          <div class="flex flex--spaced">
            <InputBox
              id="filter"
              class="filter-box"
              name="filter"
              label="Filter current directory..."
              :value="filter"
              @change="onFilter"
            />
            <ApolloMutation
              :mutation="require('../graphql/mutations/TogglePinned.gql')"
              :variables="{ path: directoryLocation }"
              @done="onDone"
            >
              <template v-slot="{ mutate, loading: mutateLoading, error: mutateError }">
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
          <ul class="grid directory-list">
            <li
              v-for="item of data.directory.entries.filter((x) =>
                x.name.toLowerCase().includes(filter)
              )"
              :key="item.path"
              class="directory-item"
            >
              <Button class="directory-item__button" @click="handleSelect(item)">
                <FolderIcon v-if="item.isDirectory" />
                <ImageIcon v-else-if="item.isImage" />
                <VideoIcon v-else-if="item.isVideo" />
                <FileIcon v-else />

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
import VueApollo from 'vue-apollo';
import { Component, Vue, Watch } from 'vue-property-decorator';
import { Route } from 'vue-router';
import { FetchResult } from 'apollo-link';

import { DirectoryEntry } from '@i/DirectoryEntry';
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
  onRouteChange(newRoute: Route, oldRoute: Route) {
    const prev = oldRoute.query['loc'];
    const curr = newRoute.query['loc'];

    if (prev !== curr) {
      window.scrollTo(0, 0);
      this.filter = '';
    }
  }

  get directoryLocation() {
    const loc = this.$route.query['loc'];
    return (loc instanceof Array ? loc.pop() : loc) ?? '';
  }

  private async handleSelect(item: DirectoryEntry) {
    if (item.isDirectory) {
      this.navigateTo(item.path);
    } else {
      const result = await this.$apollo.query<ConfirmationResponse>({
        fetchPolicy: 'network-only',
        query: require('../graphql/FileAction.gql'),
        variables: { path: item.path }
      });

      if (!result.data.success) {
        // TODO
        // Handle error
        console.error(result, item);
      }
    }
  }

  private navigateTo(directory: string) {
    const param = window.encodeURIComponent(directory);
    this.$router.push(`/directory?loc=${param}`);
  }

  private onFilter(value: string) {
    this.filter = value.toLowerCase();
  }

  private onUpdate(client: CRZDataProxy) {
    client.deleteQueryCRZ('allPinned');
  }

  private onDone(result: FetchResult<ConfirmationResponse>) {
    // Placeholder
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
}

.directory-list {
  grid-auto-rows: 1fr;
  grid-auto-columns: 1fr;
  gap: 5px;
}

.directory-item {
  display: flex;
  align-items: center;
  border: 1px solid transparent;

  &__button {
    width: 100%;

    &:hover {
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

  &:hover {
    border-color: var(--accent-colour);
  }
}

.pin-button {
  justify-content: space-evenly;
  min-height: 2.5rem;
  min-width: 100px;

  &--pinned {
    background-color: var(--disabled-colour);
  }

  &--unpinned {
    background-color: var(--accent-colour);
    color: var(--accent-contrast);
  }
}
</style>

<style lang="scss">
.directory-item__button:hover svg {
  stroke: var(--accent-contrast);
  fill: var(--accent-colour);
}
</style>
