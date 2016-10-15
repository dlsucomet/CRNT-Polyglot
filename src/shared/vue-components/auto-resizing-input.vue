<script>
import { Key } from '../utils';

export default {
  render: function(h) {
    let parentListeners = this.$options._parentListeners;
    let myListeners = {};
    for (let eventName in parentListeners) {
      // TODO: check if there are problems with efficiency
      myListeners[eventName] = (function(event) {
        this.$emit(eventName, event);
      }).bind(this);
    }
    
    myListeners["input"] = this.onInput;
    myListeners["blur"] = this.onBlur;
    myListeners["keydown"] = this.onKeyDown;

    return h("textarea", { on: myListeners, class: { invalid: this.enteredInvalid && this.isInvalid } }, this.value);
  },

  mounted: function() {
    this.resize();
  },

  updated: function() {
    this.resize();
  },


  props: ["value", "validator"],

  data: function() {
    return {
      enteredInvalid: !this.validator(this.value),
    };
  },

  computed: {
    isInvalid: function() {
      return !this.validator(this.value);
    }
  },

  methods: {
    resize: function() {
      resizeToFitText(this.$el);
    },
    onInput: function(event) {
      let newValue = event.target.value;
      newValue = newValue.replace(/\r?\n/g, '');
      // force the input to remove the newlines
      event.target.value = newValue;
      this.$emit('input', newValue);
    },
    onBlur: function(event) {
      this.enteredInvalid = !this.validator(this.value);
      this.$emit('blur', event);
    },
    onKeyDown: function(event) {
      if (event.keyCode === Key.Enter) {
        event.preventDefault();
      }
      this.$emit('keydown', event);
    }
  },

  eventHandlers: {}
}

function resizeToFitText(elem) {
  let topPadding = getComputedStyle(elem).getPropertyValue("padding-top"); 
  let bottomPadding = getComputedStyle(elem).getPropertyValue("padding-bottom");
  let padding = parseInt(topPadding) + parseInt(bottomPadding);
  elem.style.height = "0";
  elem.style.height = (elem.scrollHeight - padding) + "px";
}
</script>
