<template>
  <div class="page home">
    <PinnedList @select="handleSelect" />
    <Disks @select="handleSelect" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

import { Disk } from '@i/Disk';
import { Pinned } from '@i/Pinned';
import Disks from '@/components/Disks.vue';
import PinnedList from '@/components/Pinned.vue';

@Component({
  components: { Disks, PinnedList },
  metaInfo() {
    return {
      title: 'Home'
    };
  }
})
export default class Home extends Vue {
  private handleSelect(item: Disk | Pinned) {
    const param = window.encodeURIComponent(item.path);
    this.$router.push(`/directory?loc=${param}`);
  }
}
</script>
