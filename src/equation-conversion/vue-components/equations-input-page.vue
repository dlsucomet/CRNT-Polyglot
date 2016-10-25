<template>
  <div>
      <div class="nav-bar">
        <ul class="nav">
          <li>
            <a>File</a>
            <ul>
              <li><a @click="openFile()">Open CRNTP File</a></li>
              <li><a @click="saveFile()">Save CRNTP File</a></li>
              <li><a @click="backToMenu()">Back to Menu</a></li> 
            </ul>
          </li>
          <li><a @click="convertEquations()">Convert Equations</a></li>
          <img src="logo.png" style="margin-top: 3px; height: 35px; float: right;" />
        </ul>
      </div>

      <div class="content">
        <input class="model-name-input" v-model="modelName" placeholder="Unnamed Model" />
        <button class="icon-text-button clear-button" @click="clearEquations()"><span class="sq-button red-bg typcn typcn-trash"></span> Clear Equations</button>

        <ol class="equation-table">
            <li class="equation-row" v-for="(equation, index) in equations" :key="equation.id" :data-index="index">
              <span class="row-number">{{index + 1}}</span>
              <span>d</span>
              <input class="variable-input" v-model="equation.variable" @keyup="changeRow($event, index)" placeholder="variable" />
              <span>/dt</span>
              <span>=</span>
              <auto-resizing-input class="expression-input" v-model="equation.expression" @keyup="changeRow($event, index)" :validator="validExpression"
                placeholder="derivative (example: -X2^4 + 4 X1^3 X2^-1 - 3 X1^-0.5)" />
              <button class="sq-button red-bg remove-button" @click="removeEquation(index)"><span class="typcn typcn-times"></span></button>
            </li>
        </ol>

        <div class="row">
          <button class="icon-text-button" @click="addEmptyEquation()"><span class="sq-button green-bg typcn typcn-plus"></span> Add an Equation</button>
        </div>
      </div>
  </div>
</template>


<script>
import AutoResizingInput from '../../shared/vue-components/auto-resizing-input.vue';
import { Key, saveTextFile } from '../../shared/utils';
import * as DE from '../differential-equations';

export default {
  props: [],
  components: {AutoResizingInput},

  data: function() {
    return {
      modelName: "",
      equations: [new EquationInput()],
      tipsModalVisible: false,
      hasUnsavedChanges: false,
      validVariable: validVariable,
      validExpression: validExpression,
      ok: () => true,
    };
  },

  watch: {
    reactions: {
      deep: true,
      handler: function() {
        this.hasUnsavedChanges = true;
      },
    }
  },

  methods: {
    openFile: function() {
      // TODO: check if unsaved changes exist!
      let fileInput = document.createElement('input');
      fileInput.setAttribute('type', 'file');
      fileInput.setAttribute('accept', '.crntp');
      fileInput.style.display = 'none';

      let vm = this;
      fileInput.addEventListener('change', function(event) {
        let file = fileInput.files[0];
        let reader = new FileReader();
        reader.onload = function(event) {
          let fileText = event.target.result;
          let data = JSON.parse(fileText);
          vm.modelName = data.modelName;
          vm.equations = data.equations.map(obj => new EquationInput(obj.variable, obj.derivative));
        };
        reader.readAsText(file);
      });

      document.body.appendChild(fileInput);
      fileInput.click();
      document.body.removeChild(fileInput);
    },
    saveFile: function() {
      let jsonRep = {
        version: "1.0",
        type: "system-of-equations",
        modelName: this.modelName,
        equations: this.equations.map((e) => ({
            variable: e.variable,
            derivative: e.expression,
        })),
      };

      let name = this.modelName || "Unnamed Model";
      saveTextFile(name + ".crntp", JSON.stringify(jsonRep));
      this.hasUnsavedChanges = false;
    },
    backToMenu: function() {
      this.signalEvent("backToMenu");
    },
    convertEquations: function() {
      // TODO: check for errors first (!)
      let modelName = this.modelName || "Unnamed Model";
      let equations = this.equations.map(r => r.toEquation());
      let sysOfEq = new DE.SystemOfEquations(modelName, equations);
      this.signalEvent("convertEquations", sysOfEq);
    },
    changeRow: function(event, index) {
      if (event.keyCode !== Key.Enter) {
        return;
      }

      let target = event.shiftKey ? index - 1 : index + 1;

      if (target === this.equations.length) {
        this.addEmptyEquation();
      }

      this.$nextTick(function () {
        let nextRowInput = document.querySelector(`.equation-row[data-index="${target}"] > .variable-input`);
        nextRowInput.focus();

        // move cursor to the end
        let theEnd = nextRowInput.value.length;
        nextRowInput.setSelectionRange(theEnd, theEnd);
      });
    },

    clearEquations: function() {
      this.equations = [new EquationInput()];
    },
    removeEquation: function(index) {
      this.equations.splice(index, 1);
      if (this.equations.length < 1) {
        this.equations.push(new EquationInput());
      }
    },
    addEmptyEquation: function() {
      this.equations.push(new EquationInput());
    },
  },

  eventHandlers: {}
}

let id = 0;

class EquationInput {
  constructor(variable = "", expression = "") {
    this.id = id++;
    this.variable = variable;
    this.expression = expression;
  }

  toEquation() {
    let variable = this.variable;

    let terms = this.expression.trim()
      .replace(/\^\-/g, "^~")
      .split(/\s*(\+|\-)\s*/)
      .map(t => t.replace(/\^~/g, "^-"))
    ;
    if (terms[0] === "") {
      terms.shift();
    } else {
      terms.unshift("+");
    }

    let derivative = [];
    for (let i = 0; i < terms.length; i += 2) {
      let sign = terms[i] === "+" ? DE.Sign.Positive : DE.Sign.Negative;
      let term = DE.Term.fromString(terms[i+1].trim().replace(/\s+/g, ' '));
      derivative.push({
        sign: sign,
        term: term,
      });
    }

    return new DE.DifferentialEquation(variable, derivative);
  }
}

function validVariable(input) {
  return /^[_A-Za-z][_0-9A-Za-z]*$/.test(input);
}

function validExpression(input) {
  if (input === "" || input.trim() === "0") {
    return true;
  }

  // TODO: ^ and $ and fix
  return true;
}

</script>
