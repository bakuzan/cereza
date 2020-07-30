<template>
  <li class="directory-item">
    <div class="directory-item__content">
      <Button v-if="hasChildren" class="directory-item__toggle" @click="toggleChildren()">
        <ArrowDownIcon v-if="isExpanded" title="Collapse children" aria-label="Collapse children" />
        <ArrowRightIcon v-else title="Expand children" aria-label="Expand children" />
      </Button>
      <Button class="directory-item__button" @click="onSelect(item)">
        <FolderIcon v-if="item.isDirectory" title="Folder" aria-label="Folder" />
        <ShortcutIcon v-else-if="item.isShortcut" title="Shortcut" aria-label="Shortcut" />
        <ImageIcon v-else-if="item.isImage" title="Image" aria-label="Image" />
        <VideoIcon v-else-if="item.isVideo" title="Video" aria-label="Video" />
        <FileIcon v-else title="File" aria-label="File" />

        <div class="directory-item__name">{{ item.name }}</div>
      </Button>
    </div>
    <div v-if="isExpanded" class="directory-item__children">
      <DirectoryListItem
        v-for="entry of children"
        :key="entry.item.path"
        :item="entry.item"
        :children="entry.children"
        :force-show-children="forceShowChildren"
        @select="onSelect(item)"
      />
    </div>
  </li>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue } from 'vue-property-decorator';

import { DirectoryEntry } from '@i/DirectoryEntry';
import Button from '@/components/Button.vue';
import FileIcon from '@/components/Icons/FileIcon.vue';
import FolderIcon from '@/components/Icons/FolderIcon.vue';
import ImageIcon from '@/components/Icons/ImageIcon.vue';
import VideoIcon from '@/components/Icons/VideoIcon.vue';
import ShortcutIcon from '@/components/Icons/ShortcutIcon.vue';
import ArrowRightIcon from '@/components/Icons/ArrowRight.vue';
import ArrowDownIcon from '@/components/Icons/ArrowDown.vue';

@Component({
  components: {
    Button,
    FileIcon,
    FolderIcon,
    ImageIcon,
    VideoIcon,
    ShortcutIcon,
    ArrowRightIcon,
    ArrowDownIcon
  }
})
export default class DirectoryListItem extends Vue {
  @Prop({ required: true }) item!: DirectoryEntry;
  @Prop({ default: [] }) children!: DirectoryEntry[];
  @Prop({ default: false }) forceShowChildren!: boolean;

  private showChildren = false;

  // Computed
  get hasChildren() {
    return this.children.length > 0;
  }

  get isExpanded() {
    return this.forceShowChildren || this.showChildren;
  }

  // Methods
  private toggleChildren() {
    this.showChildren = !this.showChildren;
  }

  @Emit('select')
  private onSelect(item: DirectoryEntry) {
    return item;
  }
}
</script>

<style scoped lang="scss">
.directory-item {
  display: flex;
  flex-direction: column;

  &__content {
    display: flex;
    flex: 1;
  }

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

  &__children {
    padding-left: 38px;
  }
}
</style>
<style lang="scss">
.directory-item__toggle,
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
