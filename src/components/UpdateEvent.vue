<template>
  <v-container>
    <v-form ref="form" lazy-validation>
      <v-text-field
          v-model="eventTitle"
          label="일정 제목"
          :rules="rules.title"
          @blur="$refs.form.validate()"/>
      <!-- Event Start Date Field -->
      <v-text-field
          v-model="eventStartDate"
          label="일정 시작 날짜"
          type="datetime-local"
          :rules="[rules.startNotAfterEnd()]"
          @blur="$refs.form.validate()"/>
      <!-- Event End Date Field -->
      <v-text-field
          v-model="eventEndDate"
          label="일정 종료 날짜"
          type="datetime-local"
          :rules="[rules.endNotBeforeStart()]"
          @blur="$refs.form.validate()"/>
      <v-btn @click="updateForm">수정 완료</v-btn>
    </v-form>
    <p>Event ID: {{ eventId }}</p>
    <p>Event Title: {{ eventTitle }}</p>
    <p>Event Memo: {{ eventMemo }}</p>
    <p>Event StartDate: {{eventStartDate}}</p>
    <p>Event EndDate: {{eventEndDate}}</p>
    <p>Event Place: {{eventPlace}}</p>
    <p>Event Matrix: {{eventMatrix}}</p>
    <p>Event AlarmYn: {{eventAlarmYn}}</p>
    <p>Event FileUrl: {{eventFileUrl}}</p>
  </v-container>
</template>

<script>
import {useEventStore} from "@/stores/updateEventStore";
import axios from "axios";

export default {
  data() {
    return {
      eventId: '',
      eventTitle: '',
      eventMemo: '',
      eventStartDate: '',
      eventEndDate: '',
      eventPlace: '',
      eventMatrix: '',
      eventAlarmYn: '',
      eventFileUrl: '',
      rules: {
        title: [
          v => !!v || "제목은 필수 항목입니다!",
          v => (v && v.length <= 20) || "제목은 20자 이내로 작성되어야 합니다."
        ],
        dateTime: [
          v => !!v || "날짜와 시간은 필수 항목입니다!",
          v => !isNaN(Date.parse(v)) || "유효한 날짜와 시간을 입력해주세요."
        ],
        startNotAfterEnd: () => {
          if (this.eventStartDate && this.eventEndDate) {
            return (
                new Date(this.eventStartDate) <= new Date(this.eventEndDate)
            ) || '시작 일시가 종료 일시 이후일 수 없습니다.';
          }
          return true;
        },
        endNotBeforeStart: () => {
          if (this.eventStartDate && this.eventEndDate) {
            return (
                new Date(this.eventEndDate) >= new Date(this.eventStartDate)
            ) || '종료 일시가 시작 일시 이전일 수 없습니다.';
          }
          return true;
        },
      }
    }
  },
  mounted() {
    const eventStore = useEventStore();
    this.eventId = eventStore.currentEvent.id;
    this.eventTitle = eventStore.currentEvent.title;
    this.eventMemo = eventStore.currentEvent.memo;
    this.eventStartDate = eventStore.currentEvent.startDate;
    this.eventEndDate = eventStore.currentEvent.endDate;
    this.eventPlace = eventStore.currentEvent.place;
    this.eventMatrix = eventStore.currentEvent.matrix;
    this.eventAlarmYn = eventStore.currentEvent.alarmYn;
    this.eventFileUrl = eventStore.currentEvent.fileUrl;
  },
  beforeUnmount() {
    // 페이지를 떠날 때 상태를 다시 초기화
    const eventStore = useEventStore();
    eventStore.clearCurrentEvent();
  },
  methods: {
    async updateForm() {

      // eventRequest 조립
      let eventRequest = {
        title: this.eventTitle,
        memo: this.eventMemo,
        startDate: this.eventStartDate,
        endDate: this.eventEndDate,
        place: this.eventPlace,
        matrix: this.eventMatrix,
        alarmYn: this.eventAlarmYn,
      }
      const eventBlob = new Blob([JSON.stringify(eventRequest)], {type: 'application/json'});
      console.log(eventBlob);

      const formData = new FormData();
      formData.append('eventRequest', eventBlob);

      if (this.files && this.files.length > 0) {
        // 우선 단일 파일만 전송할 수 있도록 설정
        formData.append('file', this.files[0]);
      }

      const TOKEN = localStorage.getItem('accessToken');
      const url = `${process.env.VUE_APP_API_BASE_URL}/api/events/${this.eventId}`;

      try {
        await axios.patch(url, formData, {
          headers: {
            Authorization: `Bearer ${TOKEN}`,
            "Content-Type": "multipart/form-data"
          }
        });
        console.log("수정 완료")

        window.alert(this.title + " 일정이 수정되었습니다.")
        window.location.reload();
      } catch (error) {
        console.log(error);
      }
    }
  }
}
</script>
<style>
</style>