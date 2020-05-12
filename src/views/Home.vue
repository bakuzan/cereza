<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    <HelloWorld msg="Cereza" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import HelloWorld from '@/components/HelloWorld.vue';

@Component({
  components: { HelloWorld },
  metaInfo() {
    return {
      title: 'Home'
    };
  }
})
export default class Home extends Vue {}
</script>
