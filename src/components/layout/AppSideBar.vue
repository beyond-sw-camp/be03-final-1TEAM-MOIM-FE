<template>
  <v-navigation-drawer
      expand-on-hover
      rail
  >
    <v-list>
      <v-list-item
          prepend-avatar="https://randomuser.me/api/portraits/women/85.jpg"
          subtitle="sandra_a88@gmailcom"
          title="Sandra Adams"
      ></v-list-item>
    </v-list>

    <v-divider></v-divider>

    <v-list density="compact" nav>
      <v-list-item prepend-icon="mdi-folder" title="My Files" value="myfiles"></v-list-item>
      <v-list-item prepend-icon="mdi-account-multiple" title="Shared with me" value="shared"></v-list-item>
      <v-list-item prepend-icon="mdi-star" title="Starred" value="starred"></v-list-item>
      <v-list-item prepend-icon="mdi-widgets" title="Eisenhower Matrix" value="matrix" @click="eisenhowerMatrixClicked"></v-list-item>
      <v-list-item prepend-icon="mdi-widgets" title="일정 생성" value="createEvent" @click="createEventClicked"></v-list-item>
    </v-list>
  </v-navigation-drawer>

  <v-main style="height: 250px"></v-main>
</template>

<script>

import {useMainStore} from "@/stores";

export default {
  name: "AppSidebar",
  setup() {
    const mainStore = useMainStore();
    return {
      mainStore
    }
  },
  methods: {
    eisenhowerMatrixClicked() {
      console.log("아이젠하워 매트릭스 클릭!")
      this.$router.push('/test');
    },
    createEventClicked() {
      console.log("일정 생성 클릭");
      this.mainStore.openDialog();
    },
  }
}
</script>