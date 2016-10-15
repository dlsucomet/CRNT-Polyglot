<template>
  <div class="nav-bar">
    <ul class="nav">
      <li v-for="(menuItem, menuName) in model">
        <a @click="runAction($event, menuName)" :class="{ 'menu-open': openMenu == menuName }">{{ menuName }}</a>
        <ul v-if="isSubmenu(menuItem)" :style="{ display: openMenu == menuName ? 'block' : 'none' }">
          <li v-for="(subItem, subName) in menuItem">
            <a @click="runAction($event, menuName, subName)">{{ subName }}</a>
          </li>
        </ul>
      </li>
    <img src="logo.png" style="margin-top: 3px; height: 35px; float: right;" />
    </ul>
  </div>
</template>

<script>
export default {
  props: ["model"],
  components: {},

  created: function() {
    let vm = this;
    document.body.addEventListener("click", function() {
      vm.openMenu = null;
    });
  },
  
  data: function() {
    return {
      openMenu: null,
    };
  },

  methods: {
    isSubmenu: function(menuItem) {
      return typeof menuItem === "object";
    },
    runAction: function(event, menuName, submenuName) {
      let menuItem = this.model[menuName];
      if (submenuName !== undefined) {
        let submenuItem = menuItem[submenuName];
        this.openMenu = null;
        submenuItem();
      } else if (this.isSubmenu(menuItem)) {
        this.openMenu = this.openMenu === menuName ? null : menuName;
      } else {
        this.openMenu = null;
        menuItem();
      }
      event.stopPropagation();
    }
  },
  
  eventHandlers: {}
}
</script>

