<template>
  <div>
    <!-- used v-show instead of v-if for efficiency -->
    <reactions-input-page v-show="page == 'input'" />
    <generation-results-page v-if="page == 'output'" :model="reactionNetworkGenerated" />
  </div>
</template>


<script>
import ReactionsInputPage from './reactions-input-page.vue';
import GenerationResultsPage from './generation-results-page.vue';
import * as R from '../../shared/reaction-network';

let rn = new R.ReactionNetwork("Test Model", [
  new R.Reaction([new R.Term(1, "X1"), new R.Term(1, "X2")], [new R.Term(2, "X2"), new R.Term(1, "X3")]),
  new R.Reaction([new R.Term(1, "X4")], [], true),
]);

export default {
  props: [],
  components: {ReactionsInputPage, GenerationResultsPage},

  data: function() {
    return {
      page: "input",
      reactionNetworkGenerated: null,
    };
  },

  methods: {},
  eventHandlers: {
    "backToReactionsInput": function() {
      this.page = "input";
    },
    "generateFiles": function(reactionNetwork) {
      this.reactionNetworkGenerated = reactionNetwork;
      this.page = "output";
    }
  }
}
</script>
