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
              <!--<li>
                <a>Import File</a>
              </li>-->
            </ul>
          </li>
          <li><a @click="generateFiles()">Generate Files</a></li>
          <img src="logo.png" style="margin-top: 3px; height: 35px; float: right;" />
        </ul>
      </div>
      <!--<nav-test :model="menu"></nav-test>-->

      <div class="content">
        <input class="model-name-input" v-model="modelName" placeholder="Unnamed Model" />
        <button class="icon-text-button clear-button" @click="clearReactions()"><span class="sq-button red-bg typcn typcn-trash"></span> Clear Reactions</button>

        <ol class="reaction-table">
            <li class="reaction-row" v-for="(reaction, index) in reactions" :key="reaction.id" :data-index="index">
              <span class="row-number">{{index + 1}}</span>
              <auto-resizing-input class="left-input" v-model="reaction.left" placeholder="Ø" @keyup="changeRow($event, index)" :validator="validExpression" />
              <button class="sq-button blue-bg arrow-button" @click="reaction.nextArrow()" @keydown="changeArrow($event, reaction)">
                <img v-show="reaction.arrow == '->'" src="images/arrow-right.png" style="width: 25px;" />
                <img v-show="reaction.arrow == '<-->'" src="images/arrow-both.png" style="width: 25px;" />
                <img v-show="reaction.arrow == '<-'" src="images/arrow-left.png" style="width: 25px;" />
              </button>
              <auto-resizing-input class="right-input" v-model="reaction.right" placeholder="Ø" @keyup="changeRow($event, index)" :validator="validExpression" />
              <button class="sq-button red-bg remove-button" @click="removeReaction(index)"><span class="typcn typcn-times"></span></button>
            </li>
        </ol>

        <div class="row">
          <button class="icon-text-button" @click="addEmptyReaction()"><span class="sq-button green-bg typcn typcn-plus"></span> Add a Reaction</button>
        </div>
        <div class="row">
          <button class="icon-text-button" @click="showAddReactionsModal()"><span class="sq-button green-bg typcn typcn-plus"></span> Add Independent Reactions</button>
        </div>
        <add-reactions-modal v-show="addReactionsModalVisible" />
      </div>
  </div>
</template>


<script>
import AddReactionsModal from './add-reactions-modal.vue';
import NavTest from './nav-test.vue';
import AutoResizingInput from '../../shared/vue-components/auto-resizing-input.vue';
import { Key, saveTextFile } from '../../shared/utils';
import * as RN from '../../shared/reaction-network';

export default {
  props: [],
  components: {AddReactionsModal, AutoResizingInput, NavTest},

  created: function() {
    this.menu = { "File": { "Open File": this.openFile }, "Generate Files": this.generateFiles };
  },

  data: function() {
    return {
      menu: {},
      modelName: "",
      reactions: [new ReactionInput()],
      addReactionsModalVisible: false,
      tipsModalVisible: false,
      validExpression: validExpression,
      hasUnsavedChanges: false,
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
          vm.reactions = data.reactions.map(obj => new ReactionInput(obj.left, obj.right, obj.arrow));
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
        type: "reaction-network",
        modelName: this.modelName,
        reactions: this.reactions.map((r) => ({
            left: r.left,
            right: r.right,
            arrow: r.arrow,
        })),
      };

      let name = this.modelName || "Unnamed Model";
      saveTextFile(name + ".crntp", JSON.stringify(jsonRep));
      this.hasUnsavedChanges = false;
    },
    backToMenu: function() {
      this.signalEvent("backToMenu");
    },
    generateFiles: function() {
      // TODO: check for errors first (!)
      let modelName = this.modelName || "Unnamed Model";
      let reactions = this.reactions.map(r => r.toReaction());
      let reactionNetwork = new RN.ReactionNetwork(modelName, reactions);
      this.signalEvent("generateFiles", reactionNetwork);
    },
    changeRow: function(event, index) {
      if (event.keyCode !== Key.Enter) {
        return;
      }

      let target = event.shiftKey ? index - 1 : index + 1;

      if (target === this.reactions.length) {
        this.addEmptyReaction();
      }

      this.$nextTick(function () {
        let nextRowInput = document.querySelector(`.reaction-row[data-index="${target}"] > .left-input`);
        nextRowInput.focus();

        // move cursor to the end
        let theEnd = nextRowInput.value.length;
        nextRowInput.setSelectionRange(theEnd, theEnd);
      });
    },
    changeArrow: function(event, reaction) {
      switch (event.keyCode) {
        case Key.ArrowDown: case Key.ArrowRight:
          reaction.nextArrow();
          return;
        case Key.ArrowUp: case Key.ArrowLeft:
          reaction.prevArrow();
          return;
      }
    },
    showAddReactionsModal: function() {
      this.addReactionsModalVisible = true;
    },
    hideAddReactionsModal: function() {
      this.addReactionsModalVisible = false;
    },
    clearReactions: function() {
      this.reactions = [new ReactionInput()];
    },
    removeReaction: function(index) {
      this.reactions.splice(index, 1);
      if (this.reactions.length < 1) {
        this.reactions.push(new ReactionInput());
      }
    },
    addEmptyReaction: function() {
      this.reactions.push(new ReactionInput());
    },
    addIndependentReactions: function(variable, startNum, endNum) {
      for (let i = startNum; i <= endNum; i++) {
        this.reactions.push(new ReactionInput(variable + i, "", Arrow.ToRight));        
      }
    }

  },

  eventHandlers: {
    closeAddReactionsModal: function() {
      this.hideAddReactionsModal();
    },
    addIndependentReactions: function(variable, startNum, endNum) {
      this.addIndependentReactions(variable, startNum, endNum);
      this.hideAddReactionsModal();
    },
  }
}

let id = 0;

class ReactionInput {
  constructor(left = "", right = "", arrow = Arrow.ToRight) {
    this.id = id++;
    this.left = left;
    this.right = right;
    this.arrow = arrow;
  }

  nextArrow() {
    this.arrow = nextArrow(this.arrow);
  }

  prevArrow() {
    this.arrow = prevArrow(this.arrow);
  }

  toReaction() {
    let reactant = stringToComplex(this.left);
    let product = stringToComplex(this.right);

    if (this.arrow === Arrow.ToLeft) {
      // swap reactant and product
      [reactant, product] = [product, reactant];
    }
    let reversible = this.arrow === Arrow.BothWays;

    return new RN.Reaction(reactant, product, reversible);
  }
}

function stringToComplex(input) {
  input = input.trim() || "0";
  if (input === "0") {
    return [];
  }

  let terms = (
    input
      .split(/\s*\+\s*/)
      .map(str => {
        let g = str.match(/^(\d*)\s*([_A-Za-z]\w*)$/);
        if (g === null) {
          throw "invalid term: " + str;
        }
        let coeff = g[1] ? parseInt(g[1]) : 1;
        let species = g[2];
        return new RN.Term(coeff, species);
      })
  );

  return terms;
}


let Arrow = {
  ToLeft: "<-",
  ToRight: "->",
  BothWays: "<-->",
}

// The cycle order is "->" then "<-->" then "<-".
function nextArrow(arrow) {
  switch (arrow) {
    case Arrow.ToRight: return Arrow.BothWays;
    case Arrow.BothWays: return Arrow.ToLeft;
    case Arrow.ToLeft: return Arrow.ToRight;
  }
}

function prevArrow(arrow) {
  switch (arrow) {
    case Arrow.ToRight: return Arrow.ToLeft;
    case Arrow.BothWays: return Arrow.ToRight;
    case Arrow.ToLeft: return Arrow.BothWays;
  }
}


function validExpression(input) {
  if (input === "" || input.trim() === "0") {
    return true;
  }
  let terms = input.trim().split(/\s*\+\s*/);
  return terms.every(t => (/\d*\s*[_A-Za-z][_0-9A-Za-z]*/).test(t));
}

</script>
