<template>
  <v-dialog v-model="dialog" max-width="600">
    <v-card class="pa-4">
      <v-card-title class="text-h5">
        <v-icon class="mr-2">mdi-calendar-check-outline</v-icon>
        {{ title }}
      </v-card-title>
      <v-card-text class="mt-5">
        <v-row>
          <v-col cols="12" md="2"><h4>시작일</h4></v-col>
          <v-col cols="12" md="10">
            <input type="datetime-local" :value="startDate" readonly>
          </v-col>
          <v-col cols="12" md="2"><h4>종료일</h4></v-col>
          <v-col cols="12" md="10">
            <input type="datetime-local" :value="endDate" readonly>
          </v-col>
          <!-- 장소 조회 -->
          <v-col cols="12" md="2" v-if="place">
            <v-icon class="mr-2">mdi-map-marker</v-icon>
          </v-col>
          <v-col cols="12" md="10" v-if="place">
            <input type="text" :value="place" readonly>
          </v-col>
          <!-- 아이젠하워 매트릭스 조회 -->
          <v-col cols="12" md="2">
            <v-icon class="mr-2">mdi-alert-circle-outline</v-icon>
          </v-col>
          <v-col cols="12" md="10">
            <input type="text" :value="matrix" readonly>
          </v-col>
          <!-- 알람 조회 -->
          <v-col cols="12" md="2" v-if="displayAlarmInfo">
            <v-icon class="mr-2">mdi-bell-outline</v-icon>
          </v-col>
          <v-col cols="12" md="10" v-if="displayAlarmInfo">
            <p v-html="displayAlarmInfo"></p>
          </v-col>
          <!-- 메모 조회 -->
          <v-col cols="12" md="2" v-if="memo">
            <v-icon class="mr-2">mdi-format-align-left</v-icon>
          </v-col>
          <v-col cols="12" md="10" v-if="memo">
            <v-textarea :value="memo" variant="solo-filled" readonly auto-grow></v-textarea>
          </v-col>
          <!-- 파일 다운로드 -->
          <v-col cols="12" md="2" v-if="fileUrl">
            <v-icon class="mr-2">mdi-file-multiple-outline</v-icon>
          </v-col>
          <v-col cols="12" md="10" v-if="fileUrl">
            <v-btn :href="fileUrl" download>파일 다운로드</v-btn>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-spacer/>
        <v-btn color="green darken-1" text @click="dialog = false">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import {matrixToDescription} from "@/utils/common";
import axios from "axios";

export default {
  data() {
    return {
      dialog: false,
      title: '',
      startDate: '',
      endDate: '',
      place: '',
      matrix: '',
      memo: '',
      alarmInfo: '',
      displayAlarmInfo: '',
      fileUrl: '',
    };
  },
  methods: {
    openDialog(id, nickname, title, memo, startDate, endDate, place, matrix, fileUrl, deleteYn, alarmYn) {
      this.id = id;
      this.nickname = nickname;
      this.title = title;
      this.memo = memo;
      this.startDate = startDate;
      this.endDate = endDate;
      this.place = place;
      this.matrix = matrixToDescription(matrix);
      this.fileUrl = fileUrl;
      this.deleteYn = deleteYn;
      this.alarmYn = alarmYn;
      this.dialog = true;
      this.getAlarmInfo(id);
    },
    async getAlarmInfo(eventId) {
      try {
        const token = localStorage.getItem("accessToken");
        if (token == null) {
          alert("로그인이 필요합니다.");
          this.$router.push({ name: "Login" });
          return;
        }
        const headers = { Authorization: `Bearer ${token}` };
        const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/api/events/search/alarm/${eventId}`, { headers });
        this.alarmInfo = response.data.data;
        this.displayAlarmInfo = this.alarmInfo.map(alarm => {
          let timeUnit = '';
          switch(alarm.alarmType) {
            case 'M':
              timeUnit = '분';
              break;
            case 'H':
              timeUnit = '시간';
              break;
            case 'D':
              timeUnit = '일';
              break;
            default:
              timeUnit = '';
          }
          return `${alarm.setTime}${timeUnit} 전<br/>`;
        }).join('');

        console.log('The alarm info is: ', this.alarmInfo);
      } catch(error) {
        console.log(error);
      }
    },
  }
};
</script>


<style scoped>

</style>