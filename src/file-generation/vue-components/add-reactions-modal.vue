<template>
  <div class="modal add-modal">
    <div class="modal-box">
      <h2>Add Independent Reactions</h2>
      <button @click="close()" class="close-button"><span class="typcn typcn-times"></span></button>
      <label>Variable
      <input v-model="variable" /></label>
      <label>Start
      <input type="number" v-model="startNum" /></label>
      <label>End
      <input type="number" v-model="endNum" /></label>
      <button class="green-bg add-button" @click="addReactions()">Add</button>
    </div>
  </div>
</template>


<script>
export default {
  components: {},
  props: [],

  data: function() {
    return {
      variable: "X",
      startNum: "1",
      endNum: "10",
    };
  },

  methods: {
    close: function() {
      this.signalEvent("closeAddReactionsModal");
    },
    addReactions: function() {
      this.signalEvent(
        "addIndependentReactions",
        this.variable, 
        this.startNum, 
        this.endNum
      );
    }
  },

  eventHandlers: {},
}
</script>
