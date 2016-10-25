<template>
  <div>
    <!-- used v-show instead of v-if for efficiency -->
    <equations-input-page v-show="page == 'input'" />
    <conversion-results-page v-if="page == 'output'" :model="equationsEntered" />
  </div>
</template>


<script>
import EquationsInputPage from './equations-input-page.vue';
import ConversionResultsPage from './conversion-results-page.vue';

export default {
  props: [],
  components: {EquationsInputPage, ConversionResultsPage},

  data: function() {
    return {
      page: "input",
      equationsEntered: null,
    };
  },

  methods: {},
  eventHandlers: {
    "backToEquationsInput": function() {
      this.page = "input";
    },
    "convertEquations": function(equations) {
      this.equationsEntered = equations;
      this.page = "output";
    }
  }
}
</script>
