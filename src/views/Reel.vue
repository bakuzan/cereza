<template>
  <div id="reel" class="page reel">
    <ApolloQuery
      :query="require('../graphql/Reel.gql')"
      :variables="{ path: directoryLocation, isRecursive }"
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

            <div class="flex-spacer"></div>
            <div class="reel__option">
              <Tickbox
                id="isRecursive"
                class-name="recursive-check-box"
                name="isRecursive"
                label="Include subfolders"
                :checked="isRecursive"
                @change="onIsRecursive"
              />
            </div>
            <Help title="Reel keyboard controls">
              <table class="shortcuts-table">
                <thead>
                  <tr>
                    <th style="text-align:left;">Control</th>
                    <th>Shortcut</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="item of reelShortcuts"
                    :key="item.name"
                    class="shortcuts-table__row"
                  >
                    <td>{{ item.name }}</td>
                    <td style="text-align:center;">{{ item.shortcut }}</td>
                  </tr>
                </tbody>
              </table>
            </Help>
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
            <ReelViewer
              :folder-name="data.reel.folderName"
              :data="data.reel.videos"
            />
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
import Help from '@/components/Help.vue';
import Tickbox from '@/components/Tickbox.vue';

@Component({
  components: {
    Button,
    CrossIcon,
    ErrorBlock,
    LoadingBouncer,
    ReelViewer,
    Help,
    Tickbox
  },
  metaInfo() {
    return {
      title: 'Reel'
    };
  }
})
export default class Reel extends Vue {
  private isRecursive = false;
  private reelShortcuts = [
    { name: 'Previous video', shortcut: 'p' },
    { name: 'Next video', shortcut: 'n' },
    { name: 'Random video', shortcut: 'r' },
    { name: 'Focus filter box', shortcut: 's' },
    { name: 'Toggle auto cycle', shortcut: 'a' },
    { name: 'Toggle looping', shortcut: 'l' },

    { name: 'Toggle play/pause', shortcut: 'Spacebar' },
    { name: 'Toggle fullscreen', shortcut: 'f' },

    { name: 'Decrease playback rate 0.25x', shortcut: '-' },
    { name: 'Increase playback rate 0.25x', shortcut: '=' },
    { name: 'Reset playback rate', shortcut: '0' },

    { name: 'Skip -5s', shortcut: ',' },
    { name: 'Skip -30s', shortcut: '<' },
    { name: 'Skip -60s', shortcut: '\\' },

    { name: 'Skip +5s', shortcut: '.' },
    { name: 'Skip +30s', shortcut: '>' },
    { name: 'Skip +60s', shortcut: '/' }
  ];

  // Computed
  get directoryLocation() {
    const loc = this.$route.query['loc'];
    return (loc instanceof Array ? loc.pop() : loc) ?? '';
  }

  // Methods
  private onIsRecursive() {
    this.isRecursive = !this.isRecursive;
  }

  private onCloseReel() {
    const param = window.encodeURIComponent(this.directoryLocation);
    this.$router.push(`/directory?loc=${param}`);
  }
}
</script>

<style lang="scss" scoped>
.reel {
  padding-bottom: 5px;
  margin: -5px;

  &,
  .result {
    background: var(--base-colour);
    color: var(--contrast-colour);
  }

  .page__title {
    margin-left: 10px;
  }

  &__header {
    display: flex;
    flex-flow: wrap;
    align-items: center;
    background-color: inherit;
  }

  &__button {
    color: var(--contrast-colour);
  }
}

.reel-pane {
  padding: 5px;
}

.shortcuts-table {
  padding: 5px;

  th {
    border-bottom: 1px solid var(--accent-colour);
  }

  &__row {
    padding: 2px 0;
  }
}
</style>

<style lang="scss">
.recursive-check-box {
  --tickbox-default-colour: var(--accent-colour);
  margin: auto 0;
}

.reel__option .input-container {
  display: flex;
}
</style>
