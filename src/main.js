import Vue from 'vue';
import SimpleEventSystem from './simple-event-system.js';
import App from './App.vue';

Vue.use(SimpleEventSystem);

new Vue({
  el: '#root',
  render: h => h(App)
});
