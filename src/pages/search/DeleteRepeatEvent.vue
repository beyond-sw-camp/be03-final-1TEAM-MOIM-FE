<template>
  <v-dialog v-model="delRepeatDialog" max-width="400px">
    <v-card class="pa-4">
      <v-card-title>반복 일정 삭제</v-card-title>
      <v-divider class="mt-3"></v-divider>
      <v-card-text class="px-4" style="height: 300px">
        <v-radio-group v-model="selectedOption">
          <v-radio label="현재 일정" value="current"></v-radio>
          <v-radio label="현재 일정 및 향후 일정" value="current_and_future"></v-radio>
          <v-radio label="모든 일정" value="all"></v-radio>
        </v-radio-group>
      </v-card-text>
      <v-card-actions>
        <v-spacer/>
        <v-btn color="primary" text @click="delRepeatDialog = false">취소</v-btn>
        <v-btn color="primary" text @click="deleteSchedule">확인</v-btn>
      </v-card-actions>
      <v-card-text>
        <p>Event ID: {{ eventId }}</p>
        <p>Repeat Parent: {{ repeatParent }}</p>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    eventId: Number,
    repeatParent: Number,
  },
  data() {
    return {
      delRepeatDialog: false,
      selectedOption: null,
    };
  },
  methods: {
    openDeleteRepeatEventDialog() {
      this.delRepeatDialog = true;
    }
  }
}

</script>

<style scoped>

</style>