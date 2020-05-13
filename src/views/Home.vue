<template>
  <div class="page home">
    <div class="home-image"></div>
    <Disks @select="handleSelect" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Disks from '@/components/Disks.vue';
import { Disk } from '@i/Disk';

@Component({
  components: { Disks },
  metaInfo() {
    return {
      title: 'Home'
    };
  }
})
export default class Home extends Vue {
  private handleSelect(item: Disk) {
    this.$router.push(`/directory?loc=${item.path}`);
  }
}
</script>

<style lang="scss" scoped>
.home-image {
  position: fixed;
  top: var(--header-height);
  background: url('../assets/logo.png') no-repeat center;
  width: 100vw;
  height: 100vh;
  opacity: 0.25;
  pointer-events: none;
}
</style>
