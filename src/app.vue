<template>
  <div id="root">
    <div v-if="app == 'app-menu'" style="text-align: center; margin-top: 80px;">
      <div>
        <img src="logo.png" style="height: 120px;" />
      </div>
      <div @click="app = 'file-generation'" style="border: solid black 1px; margin: 40px; cursor: pointer;">
        <h1>File Generation</h1>
        <p>Enter reactions for use by different CRNT tools.</p>
      </div>
      <div @click="app = 'equation-conversion'" style="border: solid black 1px; margin: 40px; cursor: pointer;">
        <h1>Equation Conversion</h1>
        <p>Enter the differential equations to generate a reaction network.</p>
      </div>
    </div>
    <file-generation-app v-if="app == 'file-generation'" />
    <equation-conversion-app v-if="app == 'equation-conversion'" />
  </div>
</template>


<script>
import FileGenerationApp from './file-generation/vue-components/file-generation-app.vue';
import EquationConversionApp from './equation-conversion/vue-components/equation-conversion-app.vue';

export default {
  components: {
    FileGenerationApp,
    EquationConversionApp,
  },
  props: [],
  data: function() {
    return {
      app: "app-menu",
    };
  },
  methods: {},
  eventHandlers: {
    "backToMenu": function() {
      this.app = "app-menu";
    },
  }
}
</script>
