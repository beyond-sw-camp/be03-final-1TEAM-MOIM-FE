<template>
  <v-dialog v-model="dialog" max-width="500">
    <v-card>
      <v-card-title class="headline">{{ title }}</v-card-title>
      <v-card-text>
        {{ message }}
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="green darken-1" text @click="dialog = false">취소</v-btn>
        <v-btn color="green darken-1" text @click="confirm">확인</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    title: String,
    message: String,
  },
  data() {
    return {
      dialog: false,
    };
  },
  methods: {
    openDialog() {
      this.dialog = true;
    },
    confirm() {
      this.$emit("confirm");
      this.dialog = false;
    },
  },
};
</script>