<template>
  <v-dialog v-model="dialog" max-width="600">
    <v-card>
      <v-card-title class="text-h5">{{ localTitle }}</v-card-title>
      <v-card-text>{{ localMemo }}</v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn color="green darken-1" text @click="dialog = false">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  data() {
    return {
      dialog: false,
      localTitle: '',
      localMemo: '',
    };
  },
  methods: {
    openDialog(title, memo) {
      this.localTitle = title;
      this.localMemo = memo;
      this.dialog = true;
    }
  }
};
</script>


<style scoped>

</style>