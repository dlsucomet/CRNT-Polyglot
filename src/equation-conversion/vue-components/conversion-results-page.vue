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
        <div class="row">
          <h1>Complex Vector</h1>
          <button @click="downloadComplexVector()" class="download-button">Download</button>
        </div>
        <p v-for="complex in complexVector">
          {{complex.toString()}}
        </p>


        <div class="row">
          <h1>Kinetic Order Matrix</h1>
          <button @click="downloadKineticOrderMatrix()" class="download-button">Download</button>
        </div>
        <table>
          <thead>
            <tr>
              <th></th>
              <th v-for="col in kineticOrderMatrix.numCols">
                  {{model.variables.get(col-1)}}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in kineticOrderMatrix.numRows">
              <th>r{{row}}</th>
              <td v-for="col in kineticOrderMatrix.numCols">
                {{ kineticOrderMatrix.get(row-1, col-1) }}
              </td>
            </tr>
          </tbody>
        </table>
        
        <div class="row">
          <h1>Stoichiometric Matrix</h1>
          <button @click="downloadStoichiometricMatrix()" class="download-button">Download</button>
        </div>
        <table>
          <thead>
            <tr>
              <th></th>
              <th v-for="col in stoichiometricMatrix.numCols">
                  r{{col}}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in stoichiometricMatrix.numRows">
              <th>{{model.variables.get(row-1)}}</th>
              <td v-for="col in stoichiometricMatrix.numCols">
                {{ stoichiometricMatrix.get(row-1, col-1) }}
              </td>
            </tr>
          </tbody>
        </table>
        
        <div class="row">
          <h1>Reaction Network of the Stoichiometric Representation</h1>
          <div v-for="(generator, index) in generators">
            <button @click="downloadStoicReactionNetwork(index)" class="download-button" style="margin-left: 20px;">Download {{generator.name}}</button>
          </div>
        </div>
        <div>
          <pre style="font-family: 'Open Sans'">
            {{stoicReactionNetwork.toString().replace(/.*/, '')}}
          </pre>
        </div>

        <div class="row">
          <h1>Reaction Network of the Total Representation</h1>
          <div v-for="(generator, index) in generators">
            <button @click="downloadTotalReactionNetwork(index)" class="download-button" style="margin-left: 20px;">Download {{generator.name}}</button>
          </div>
        </div>
        <div>
          <pre style="font-family: 'Open Sans'">
            {{totalReactionNetwork.toString().replace(/.*/, '')}}
          </pre>
        </div>
      </div>
  </div>
</template>


<script>
import AutoResizingInput from '../../shared/vue-components/auto-resizing-input.vue';
import { saveTextFile } from '../../shared/utils';

import * as CA from '../conversion-algorithms';

import ControlFileGenerator from '../../file-generation/file-generators/control';
import CRNToolboxFileGenerator from '../../file-generation/file-generators/crn-toolbox';
import ErnestFileGenerator from '../../file-generation/file-generators/ernest';

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
      generators: fileGenerators,
    };
  },

  computed: {
    complexVector: function() {
      return CA.complexVector(this.model);
    },
    kineticOrderMatrix: function() {
      let kom = CA.kineticOrderMatrix(this.model);
      console.log(kom.toString());
      return kom;
    },
    stoichiometricMatrix: function() {
      return CA.stoichiometricMatrix(this.model);
    },
    stoicReactionNetwork: function() {
      return CA.stoicReactionNetwork(this.model);
    },
    totalReactionNetwork: function() {
      return CA.totalReactionNetwork(this.model);
    },
  },

  methods: {
    downloadComplexVector: function() {
      let output = this.complexVector.join('\r\n');
      let fileName = `${this.model.modelName} - Complex Vector.txt`;
      saveTextFile(fileName, output);
    },
    downloadKineticOrderMatrix: function() {
      let kom = this.kineticOrderMatrix;
      let output = '';
      for (let row = 0; row < kom.numRows; row++) {
        for (let col = 0; col < kom.numCols; col++) {
          if (col !== 0) {
            output += '\t';
          }
          output += kom.get(row, col);
        }
        output += '\r\n';
      }

      let fileName = `${this.model.modelName} - Kinetic Order Matrix.txt`;
      saveTextFile(fileName, output);
    },
    downloadStoichiometricMatrix: function() {
      let sm = this.stoichiometricMatrix;
      let output = '';
      for (let row = 0; row < sm.numRows; row++) {
        for (let col = 0; col < sm.numCols; col++) {
          if (col !== 0) {
            output += '\t';
          }

          output += sm.get(row, col);
        }
        output += '\r\n';
      }

      let fileName = `${this.model.modelName} - Stoichiometric Matrix.txt`;
      saveTextFile(fileName, output);
    },
    downloadStoicReactionNetwork: function(generatorIndex) {
      let fileGenerator = this.generators[generatorIndex];
      let output = fileGenerator.generateFile(this.stoicReactionNetwork);
      let fileName = `${this.model.modelName} - Reaction Network of the Stoichiometric Representation (${fileGenerator.name})${fileGenerator.fileExtension}`;
      saveTextFile(fileName, output);
    },
    downloadTotalReactionNetwork: function(generatorIndex) {
      let fileGenerator = this.generators[generatorIndex];
      let output = fileGenerator.generateFile(this.totalReactionNetwork);
      let fileName = `${this.model.modelName} - Reaction Network of the Total Representation (${fileGenerator.name})${fileGenerator.fileExtension}`;
      saveTextFile(fileName, output);
    },
    goBack: function() {
      this.signalEvent("backToEquationsInput");
    },
  },
  
  eventHandlers: {}
}
</script>

