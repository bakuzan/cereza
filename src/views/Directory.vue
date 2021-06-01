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
      :variables="{ path: directoryLocation, isRecursive, sort }"
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
            <Tickbox
              id="isRecursive"
              class-name="check-box"
              name="isRecursive"
              label="Include subfolders"
              :checked="isRecursive"
              @change="onIsRecursive"
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
            <PinnedToggle :directoryLocation="directoryLocation" />
          </div>
          <div class="result__count">
            Showing
            {{
              data.directory.entries.filter((x) =>
                x.name.toLowerCase().includes(filter)
              ).length
            }}
            of
            {{ data.directory.entries.length
            }}{{ getLevelsMessage(data.directory.entries) }}
          </div>
          <SortOptionsBlock :selected="sort" @change="onSortChange" />
          <ul class="grid directory-list">
            <DirectoryListItem
              v-for="tree of asTree(data.directory.entries)"
              :key="tree.item.path"
              :item="tree.item"
              :children="tree.children"
              :force-show-children="hasFilter"
              @select="handleSelect"
            />
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
import { SortOptions } from '@i/SortOptions';

import Button from '@/components/Button.vue';
import ErrorBlock from '@/components/ErrorBlock.vue';
import LoadingBouncer from '@/components/LoadingBouncer.vue';
import Widget from '@/components/Widget.vue';
import FolderIcon from '@/components/Icons/FolderIcon.vue';
import BookIcon from '@/components/Icons/BookIcon.vue';
import FilmIcon from '@/components/Icons/FilmIcon.vue';
import PinnedToggle from '@/components/PinnedToggle.vue';
import SortOptionsBlock from '@/components/SortOptions.vue';

import Crumbs from '@/components/Crumbs.vue';
import InputBox from '@/components/InputBox.vue';
import Tickbox from '@/components/Tickbox.vue';
import DirectoryListItem from '@/components/DirectoryListItem.vue';

import { getLocation, getRecursive, getSort } from '@/utils/routeArgs';

interface DirectoryTree {
  item: DirectoryEntry;
  children: DirectoryTree[];
}

@Component({
  components: {
    Button,
    ErrorBlock,
    LoadingBouncer,
    Widget,
    FolderIcon,
    BookIcon,
    FilmIcon,
    Crumbs,
    InputBox,
    Tickbox,
    DirectoryListItem,
    PinnedToggle,
    SortOptionsBlock
  },
  metaInfo() {
    return {
      title: 'Directory'
    };
  }
})
export default class Directory extends Vue {
  private filter = '';
  private isRecursive = false;
  private sort = { field: 'Name', order: 'ASC' };

  beforeMount() {
    this.isRecursive = getRecursive(this.$route);
    this.sort = getSort(this.$route);
  }

  @Watch('$route')
  onRouteChange() {
    this.filter = '';
  }

  // Computed
  get directoryLocation() {
    return getLocation(this.$route);
  }

  get hasFilter() {
    return this.filter.length > 0;
  }

  // Methods
  private asTree(items: DirectoryEntry[]) {
    const tree: DirectoryTree[] = items.map((item) => ({ item, children: [] }));

    for (const leaf of tree) {
      leaf.children = tree.filter(
        (x) =>
          x.item.parentName === leaf.item.name &&
          x.item.name.toLowerCase().includes(this.filter)
      );
    }

    return tree.filter(
      (x) =>
        x.item.level === 0 &&
        (x.children.length || x.item.name.toLowerCase().includes(this.filter))
    );
  }

  private getLevelsMessage(items: DirectoryEntry[]) {
    const levels = new Set(
      items
        .filter((x) => x.name.toLowerCase().includes(this.filter))
        .map((x) => x.level)
    );

    return this.isRecursive ? ` across ${levels.size} levels` : '';
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
    const sorted = [this.sort.field, this.sort.order].join('__');

    this.$router.push(
      `/directory?loc=${param}&recursive=${this.isRecursive}&sort=${sorted}`
    );
  }

  private onFilter({ value }: { value: string }) {
    this.$set(this, 'filter', value.toLowerCase());
  }

  private onIsRecursive() {
    this.isRecursive = !this.isRecursive;
  }

  private onSortChange(option: SortOptions) {
    this.$set(this, 'sort', option);
  }

  private onReader() {
    const param = window.encodeURIComponent(this.directoryLocation);
    this.$router.push(`/gallery-reader?loc=${param}`);
  }

  private onReel() {
    const param = window.encodeURIComponent(this.directoryLocation);
    const sorted = [this.sort.field, this.sort.order].join('__');

    this.$router.push(
      `/reel-viewer?loc=${param}&recursive=${this.isRecursive}&sort=${sorted}`
    );
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
  grid-auto-rows: auto;
  grid-auto-columns: 1fr;
  gap: 5px;
}

.can-do-button {
  justify-content: space-evenly;
  min-height: 2.5rem;
  min-width: 100px;
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
