<template>
  <v-dialog v-model="dialog" max-width="600">
    <v-card class="pa-4">
      <v-card-title class="text-h5" style="width: 100%; display: flex; align-items: center;">
        <v-icon class="mr-2" style="font-size: 25px;">mdi-calendar-check-outline</v-icon>
        <div
            class="title-text"
            style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;"
        >{{ title }}
        </div>
        <v-spacer></v-spacer>
        <v-btn class="no-shadow" density="comfortable" icon="mdi-close" @click="dialog = false"></v-btn>
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
            <v-btn :href="fileUrl" target="_blank" download>파일 다운로드</v-btn>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-spacer/>
        <v-btn color="green darken-1" text @click="goToUpdateEvent">수정</v-btn>
        <v-btn color="green darken-1" text @click="showDeleteDialog" v-if="repeatParent != null">삭제</v-btn>
        <v-btn color="green darken-1" text @click="deleteSingleEvent" v-else>단일 일정 삭제</v-btn>
      </v-card-actions>
      <DeleteRepeatEvent
          ref="delRepeatDialog"
          :eventId="id"
          :repeatParent="repeatParent"
      />
    </v-card>
  </v-dialog>
</template>

<script>
import {matrixToDescription} from "@/utils/common";
import DeleteRepeatEvent from "@/pages/search/DeleteRepeatEvent.vue";
import {useEventStore} from "@/stores/updateEventStore";
import axiosInstance from "@/axios";

export default {
  components: {DeleteRepeatEvent},
  data() {
    return {
      dialog: false,
      title: '',
      startDate: '',
      endDate: '',
      place: '',
      matrix: '',
      originalMatrix: '',
      memo: '',
      alarmInfo: '',
      displayAlarmInfo: '',
      fileUrl: '',
    };
  },
  methods: {
    goToUpdateEvent() {
      const eventStore = useEventStore();
      const event = {
        id: this.id,
        title: this.title,
        memo: this.memo,
        startDate: this.startDate,
        endDate: this.endDate,
        place: this.place,
        matrix: this.originalMatrix,
        alarmYn: this.alarmYn,
        fileUrl: this.fileUrl,
      }
      eventStore.setCurrentEvent(event);
      this.$router.push({name: "updateEvent"});
    },
    openDialog(id, nickname, title, memo, startDate, endDate, place, matrix, fileUrl, deleteYn, repeatParent, alarmYn) {
      this.id = id;
      this.nickname = nickname;
      this.title = title;
      this.memo = memo;
      this.startDate = startDate;
      this.endDate = endDate;
      this.place = place;
      this.matrix = matrixToDescription(matrix);
      this.originalMatrix = matrix;
      this.fileUrl = fileUrl;
      this.deleteYn = deleteYn;
      this.alarmYn = alarmYn;
      this.repeatParent = repeatParent;
      this.dialog = true;
      this.getAlarmInfo(id);
    },
    showDeleteDialog() {
      this.$refs.delRepeatDialog.openDeleteRepeatEventDialog();
    },
    async getAlarmInfo(eventId) {
      try {
        const token = localStorage.getItem("accessToken");
        if (token == null) {
          alert("로그인이 필요합니다.");
          this.$router.push({name: "Login"});
          return;
        }
        const headers = {Authorization: `Bearer ${token}`};
        const response = await axiosInstance.get(`${process.env.VUE_APP_API_BASE_URL}/api/events/search/alarm/${eventId}`, {headers});
        this.alarmInfo = response.data.data;
        this.displayAlarmInfo = this.alarmInfo.map(alarm => {
          let timeUnit = '';
          switch (alarm.alarmType) {
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
      } catch (error) {
        console.log(error);
      }
    },

    async deleteSingleEvent() {
      try {
        const token = localStorage.getItem("accessToken");
        if (token == null) {
          alert("로그인이 필요합니다.");
          this.$router.push({name: "Login"});
          return;
        }
        const headers = {Authorization: `Bearer ${token}`};
        const response = await axiosInstance.delete(`${process.env.VUE_APP_API_BASE_URL}/api/events/${this.id}`, {headers});
        if (response.status === 200) {
          alert('단일 일정 삭제 성공');
          location.reload(); // or some other code you want to run after delete
        } else {
          alert('단일 일정 삭제 실패');
        }
      } catch (error) {
        console.log(error);
        alert('단일 일정 삭제 실패');
      }
    }
  }
};
</script>

<style>
.no-shadow {
  box-shadow: none !important;
}
</style>