<template>
  <div id="root">
    <!--<app-menu v-if="app == 'app-menu'" />-->
    <file-generation-app v-if="app == 'file-generation'" />
    <!--<equations-conversion-app v-if="app == 'equations-conversion'" />-->
    <!--<auto-resizing-input v-model="val" :validator="validator" class="hi" /> {{ val }}-->
  </div>
</template>


<script>
import FileGenerationApp from './file-generation/vue-components/file-generation-app.vue';

export default {
  components: {FileGenerationApp},
  props: [],
  data: function() {
    return {
      app: "file-generation",
    };
  },
  methods: {},
  eventHandlers: {}
}
</script>
