<template>
  <v-app-bar title="MOIM" @click="homeClicked">
  </v-app-bar>
</template>

<script>
export default {
  name: "AppSidebar",
  methods: {
    homeClicked() {
      console.log("홈페이지 클릭!");
      this.$router.push('/calendar')
    }
  }
}
</script>

<style scoped>

</style>