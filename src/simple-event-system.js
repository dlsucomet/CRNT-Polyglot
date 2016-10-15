Plugin = {};
Plugin.install = function(Vue, options) {
  let eventBus = new Vue();

  Vue.mixin({
    created: function() {
      let eventHandlers = this.$options.eventHandlers;
      if (eventHandlers) {
        // bind handler functions to the current vue instance
        let boundedHandlers = {};
        for (let event in eventHandlers) {
          let handler = eventHandlers[event];
          if (typeof handler === "string") {
            handler = this.methods[handler];
          }
          boundedHandlers[event] = handler.bind(this);
        }

        for (let event in boundedHandlers) {
          eventBus.$on(event, boundedHandlers[event]);
        }

        // keep the bounded handler functions for removal on beforeDestroy
        this.$options._eventHandlers = boundedHandlers;
      }
    },

    beforeDestroy: function() {
      let boundedHandlers = this.$options._eventHandlers;
      if (boundedHandlers) {
        for (let event in boundedHandlers) {
          eventBus.$off(event, boundedHandlers[event]);
        }
      }
    },
    
    methods: {
      signalEvent: function(event, ...args) {
        eventBus.$emit(event, ...args);
      }
    }
  });
}

export default Plugin;
