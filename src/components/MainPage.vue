<template>
  <v-app class="rounded rounded-md">
    <AppHeader></AppHeader>
    <AppSideBar></AppSideBar>
    <v-main class="no-top-margin">
      <router-view class="no-padding"/>
    </v-main>
  </v-app>
</template>

<script setup>
import AppSideBar from "@/components/layout/AppSideBar.vue";
import AppHeader from "@/components/layout/AppHeader.vue";
</script>

<style scoped>
.no-top-margin {
  margin-top: 0 !important;
}

.no-padding {
  padding: 0 !important;
}
</style>