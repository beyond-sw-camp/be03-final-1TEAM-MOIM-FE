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
  <v-bottom-sheet v-model="processingSheet" inset>
    <v-card class="bottom-sheet-card">
      <v-card-text class="bottom-sheet-text" v-if="processing">{{ processingMessage }}</v-card-text>
      <v-card-text class="bottom-sheet-text" v-else>{{ completionMessage }}</v-card-text>
    </v-card>
  </v-bottom-sheet>
</template>

<script>
import axiosInstance from "@/axios";

export default {
  props: {
    eventId: Number,
    repeatParent: Number,
  },
  data() {
    return {
      delRepeatDialog: false,
      selectedOption: null,
      processingSheet: false,
      processing: false,
      processingMessage: "삭제 중...",
      completionMessage: "일정이 삭제되었습니다."
    };
  },
  methods: {
    openDeleteRepeatEventDialog() {
      this.delRepeatDialog = true;
    },
    async deleteSchedule() {
      try {
        this.processing = true;
        this.processingSheet = true;
        const token = localStorage.getItem("accessToken");
        const headers = { Authorization: `Bearer ${token}` };

        // deleteType 설정
        let deleteType = 'only';
        if (this.selectedOption === 'all') {
          deleteType = 'all';
        } else if (this.selectedOption === 'current_and_future') {
          deleteType = 'after';
        }

        await axiosInstance.delete(`${process.env.VUE_APP_API_BASE_URL}/api/events/repeat/${this.eventId}?deleteType=${deleteType}`, { headers });
        this.delRepeatDialog = false;

        this.processing = false;
        setTimeout(() => {
          this.processingSheet = false
        }, 3000);

        this.delRepeatDialog = false;

      } catch(error) {
        console.error("일정 삭제 중 오류가 발생했습니다. " + error);
      }
    },
  }
}
</script>

<style scoped>
.bottom-sheet-card {
  background-color: #1c2021;
  padding: 0 !important;
  max-width: 20%;
  margin: auto;
  display: flex;
  justify-content: center;
  align-items: center;
}
.bottom-sheet-text {
  color: #FFFFFF;
  padding: 16px;
  text-align: center;
  display: inline-block;
}
</style>