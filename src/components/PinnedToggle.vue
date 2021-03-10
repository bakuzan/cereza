<template>
  <ApolloMutation
    :mutation="require('../graphql/mutations/TogglePinned.gql')"
    :variables="{ path: directoryLocation }"
    @done="() => null"
  >
    <template v-slot="{ mutate, loading: mutateLoading, error: mutateError }">
      <ApolloQuery
        :query="require('../graphql/IsDirectoryPinned.gql')"
        :variables="{ path: directoryLocation }"
      >
        <template slot-scope="{ result: pinRes }">
          <Button
            v-if="pinRes && pinRes.data"
            :class="{
              'pin-button': true,
              'pin-button--pinned': pinRes.data.isDirectoryPinned,
              'pin-button--unpinned': !pinRes.data.isDirectoryPinned
            }"
            :primary="true"
            :disabled="pinRes.loading || mutateLoading"
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
              v-if="!pinRes.loading && !mutateLoading"
              :fill="true"
              :contrast="!pinRes.data.isDirectoryPinned"
            />
            {{
              pinRes.loading || mutateLoading
                ? ''
                : pinRes.data.isDirectoryPinned
                ? 'Unpin'
                : 'Pin'
            }}
          </Button>
          <p v-if="mutateError">
            Failed directory
            {{ pinRes.data.isDirectoryPinned ? ' unpinning' : ' pinning' }}:
            {{ mutateError }}
          </p>
        </template>
      </ApolloQuery>
    </template>
  </ApolloMutation>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

import Button from '@/components/Button.vue';
import PinIcon from '@/components/Icons/PinIcon.vue';

import { CRZDataProxy } from '@/types/CRZDataProxy';

@Component({
  components: { Button, PinIcon }
})
export default class PinnedList extends Vue {
  @Prop({ required: true }) directoryLocation!: string;

  private onUpdate(client: CRZDataProxy) {
    client.deleteQueryCRZ('allPinned');
  }
}
</script>

<style scoped lang="scss">
.pin-button {
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
</style>
