<template>
  <div id="reel" class="page reel">
    <ApolloQuery
      :query="require('../graphql/Reel.gql')"
      :variables="{ path: directoryLocation }"
    >
      <template slot-scope="{ result: { loading, error, data } }">
        <LoadingBouncer v-if="loading" />

        <ErrorBlock
          v-else-if="error"
          :data="error"
          message="Failed to fetch reel contents."
        />

        <div v-else-if="data && data.reel" class="result apollo">
          <div class="reel__header">
            <h2 class="page__title">{{ data.reel.folderName }}</h2>
            <Button
              class="reel__button"
              aria-label="Back to directory"
              title="Back to directory"
              @click="onCloseReel()"
            >
              <CrossIcon />
            </Button>
          </div>
          <div v-if="data.reel.canReel" class="reel-pane">
            <ReelViewer :data="data.reel.videos" />
          </div>
          <div v-else>
            <p>This directory is not a valid reel viewer directory.</p>
            <Button class="reel__button" :link="true" @click="onCloseReel()"
              >Back to directory</Button
            >
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
import ReelViewer from '@/components/ReelViewer.vue';

@Component({
  components: { Button, CrossIcon, ErrorBlock, LoadingBouncer, ReelViewer },
  metaInfo() {
    return {
      title: 'Reel'
    };
  }
})
export default class Reel extends Vue {
  // Lifecycle
  //   mounted() {}

  // Computed
  get directoryLocation() {
    const loc = this.$route.query['loc'];
    return (loc instanceof Array ? loc.pop() : loc) ?? '';
  }

  // Methods
  private onCloseReel() {
    const param = window.encodeURIComponent(this.directoryLocation);
    this.$router.push(`/directory?loc=${param}`);
  }
}
</script>

<style lang="scss" scoped>
.reel {
  background: var(--base-colour);
  color: var(--contrast-colour);
  margin: -5px;

  .page__title {
    margin-left: 10px;
  }

  &__header {
    display: flex;
    flex-flow: wrap;
    justify-content: space-between;
    align-items: center;
  }

  &__button {
    color: var(--contrast-colour);
  }
}

.reel-pane {
  padding: 5px;
}
</style>