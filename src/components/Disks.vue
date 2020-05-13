<template>
  <Widget title="Disks">
    <ApolloQuery :query="require('../graphql/Disks.gql')">
      <template slot-scope="{ result: { loading, error, data } }">
        <LoadingBouncer v-if="loading" />

        <ErrorBlock v-else-if="error" :data="error" message="Failed to fetch disks." />

        <div v-else-if="data" class="result apollo">
          <ul class="grid disks">
            <li v-for="item of data.disks" :key="item.path" class="disks__entry">
              <Button class="disk-button" @click="onSelect(item)">
                <DiskIcon />
                <div class="disks__name">{{ item.name }}</div>
              </Button>
            </li>
          </ul>
        </div>

        <div v-else class="no-result apollo"></div>
      </template>
    </ApolloQuery>
  </Widget>
</template>

<script lang="ts">
import { Component, Emit, Vue } from 'vue-property-decorator';

import { Disk } from '@i/Disk';
import Button from '@/components/Button.vue';
import DiskIcon from '@/components/Icons/DiskIcon.vue';
import ErrorBlock from '@/components/ErrorBlock.vue';
import LoadingBouncer from '@/components/LoadingBouncer.vue';
import Widget from '@/components/Widget.vue';

@Component({
  components: { Button, DiskIcon, ErrorBlock, LoadingBouncer, Widget }
})
export default class Disks extends Vue {
  @Emit('select')
  onSelect(item: Disk) {
    return item;
  }
}
</script>

<style scoped lang="scss">
.disks {
  grid-auto-rows: 1fr;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
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

.disk-button {
  width: 100%;
}
</style>
