<template>
  <div>
      <div class="nav-bar">
        <ul class="nav">
          <li>
            <a @click="goBack()">Back to Input</a>
          </li>
          <img src="logo.png" style="margin-top: 3px; height: 35px; float: right;" />
        </ul>
      </div>

      <div class="content">
        <template v-if="model">
          <div v-for="(result, index) in results" class="generation-result">
            <div class="row">
              <h1>{{result.generator.name}}</h1>
              <button @click="downloadFile(index)" class="download-button">Download</button>
            </div>
            <p class="generation-description">{{result.generator.description}}</p>
            <pre class="generation-output">{{result.output}}</pre>
          </div>
        </template>
        <p v-else>
          {{model}}
          No reaciton network given.
        </p>
      </div>
  </div>
</template>


<script>
import AutoResizingInput from '../../shared/vue-components/auto-resizing-input.vue';
import { saveTextFile } from '../../shared/utils';

import ControlFileGenerator from '../file-generators/control';
import CRNToolboxFileGenerator from '../file-generators/crn-toolbox';
import ErnestFileGenerator from '../file-generators/ernest';


let fileGenerators = [
  new ErnestFileGenerator(),
  new ControlFileGenerator(),
  new CRNToolboxFileGenerator(),
];


export default {
  props: ["model"],
  components: {},
  
  data: function() {
    return {
      fileGenerators: fileGenerators,
    };
  },

  computed: {
    results: function() {
      return fileGenerators.map((generator) => ({
        generator: generator,
        output: generator.generateFile(this.model),
      }));
    },
  },

  methods: {
    downloadFile: function(index) {
      console.log(index);
      let fileGenerator = this.results[index].generator;
      let reactionNetwork = this.model;

      let output = this.results[index].output;
      let fileName = `${reactionNetwork.modelName} (${fileGenerator.name})${fileGenerator.fileExtension}`;

      saveTextFile(fileName, output);
    },
    goBack: function() {
      this.signalEvent("backToReactionsInput");
    },
  },
  
  eventHandlers: {}
}
</script>

