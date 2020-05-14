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

        <ErrorBlock
          v-else-if="error"
          :data="error"
          message="Failed to fetch directory contents."
        />

        <div v-else-if="data && data.directory" class="result apollo">
          <div>put response based controls here...like gallery button</div>
          <ul class="grid directory-list">
            <li
              v-for="item of data.directory.entries"
              :key="item.path"
              class="directory-item"
            >
              <Button
                class="directory-item__button"
                @click="handleSelect(item)"
              >
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
import { Component, Vue, Watch } from 'vue-property-decorator';
import { Route } from 'vue-router';

import { DirectoryEntry } from '@i/DirectoryEntry';
import { ConfirmationResponse } from '@i/ConfirmationResponse';
import Button from '@/components/Button.vue';
import ErrorBlock from '@/components/ErrorBlock.vue';
import LoadingBouncer from '@/components/LoadingBouncer.vue';
import Widget from '@/components/Widget.vue';
import FileIcon from '@/components/Icons/FileIcon.vue';
import FolderIcon from '@/components/Icons/FolderIcon.vue';
import ImageIcon from '@/components/Icons/ImageIcon.vue';
import VideoIcon from '@/components/Icons/VideoIcon.vue';
import Crumbs from '@/components/Crumbs.vue';

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
    Crumbs
  },
  metaInfo() {
    return {
      title: 'Directory'
    };
  }
})
export default class Directory extends Vue {
  @Watch('$route')
  onRouteChange(newRoute: Route, oldRoute: Route) {
    const prev = oldRoute.query['loc'];
    const curr = newRoute.query['loc'];

    if (prev !== curr) {
      window.scrollTo(0, 0);
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
</style>

<style lang="scss">
.directory-item__button:hover svg {
  stroke: var(--accent-contrast);
  fill: var(--accent-colour);
}
</style>
