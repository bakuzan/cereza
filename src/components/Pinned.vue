<template>
  <Widget title="Pinned">
    <ApolloQuery :query="require('../graphql/Pinned.gql')">
      <template slot-scope="{ result: { loading, error, data } }">
        <LoadingBouncer v-if="loading" />

        <ErrorBlock
          v-else-if="error"
          :data="error"
          message="Failed to fetch pinned."
        />

        <div v-else-if="data && data.allPinned.length" class="result apollo">
          <ul class="grid pinned">
            <li
              v-for="item of data.allPinned"
              :key="item.path"
              class="pinned__entry"
            >
              <Button class="pin-button" @click="onSelect(item)">
                <PinIcon :fill="true" />
                <div class="pinned__name" :title="item.path">
                  {{ resolveFolderName(item.path) }}
                </div>
              </Button>
            </li>
          </ul>
        </div>

        <div
          v-else-if="data && data.allPinned.length === 0"
          class="no-result apollo"
        >
          No pinned directories.
        </div>
      </template>
    </ApolloQuery>
  </Widget>
</template>

<script lang="ts">
import { Component, Emit, Vue } from 'vue-property-decorator';

import { Pinned } from '@i/Pinned';
import Button from '@/components/Button.vue';
import PinIcon from '@/components/Icons/PinIcon.vue';
import ErrorBlock from '@/components/ErrorBlock.vue';
import LoadingBouncer from '@/components/LoadingBouncer.vue';
import Widget from '@/components/Widget.vue';

@Component({
  components: { Button, PinIcon, ErrorBlock, LoadingBouncer, Widget }
})
export default class PinnedList extends Vue {
  @Emit('select')
  onSelect(item: Pinned) {
    return item;
  }

  private resolveFolderName(path: string) {
    return path.split('\\').pop();
  }
}
</script>

<style scoped lang="scss">
.pinned {
  grid-auto-rows: 1fr;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 5px;

  &__entry {
    display: flex;
    align-items: center;
    border: 1px solid transparent;

    &:hover {
      border-color: var(--accent-colour);
    }
  }

  &__name {
    font-size: 1.2rem;
  }
}

.pin-button {
  width: 100%;
}
</style>
