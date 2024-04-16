<template>
  <v-dialog v-model="isDialogOpen" max-width="600">
    <v-card class="pa-4">
      <v-card-title>
        <v-icon class="mr-2">mdi-calendar-plus</v-icon>
        일정 생성
      </v-card-title>
      <v-card-text>
        <v-row dense>
          <v-col cols="12" sm="12">
            <v-text-field label="제목을 입력하세요"
                          :rules="[value => !!value || '']"
                          required
                          v-model="title">
            </v-text-field>
          </v-col>
          <v-col cols="12" md="2"><h4>시작일</h4></v-col>
          <v-col cols="12" md="10">
            <input type="datetime-local" v-model="startDateTime">
          </v-col>
          <v-col cols="12" md="2"><h4>종료일</h4></v-col>
          <v-col cols="12" md="10">
            <input type="datetime-local" v-model="endDateTime">
          </v-col>
          <v-col cols="12" sm="12">
            <v-text-field label="장소를 입력하세요"
                          :rules="[value => !!value || '']"
                          required
                          v-model="place">
            </v-text-field>
          </v-col>
          <v-col cols="12" sm="12"><h4>아이젠하워 매트릭스 중요도</h4></v-col>
          <v-col cols="12" sm="12">
            <v-container fluid>
              <v-radio-group v-model="radios"
                             :rules="[value => !!value || '4가지 선택지 중 하나를 선택해주세요']"
                             required>
                <v-radio value="Q1">
                  <template v-slot:label>
                    <div>중요 & 긴급하지 않음</div>
                  </template>
                </v-radio>
                <v-radio value="Q2">
                  <template v-slot:label>
                    <div>중요 & 긴급</div>
                  </template>
                </v-radio>
                <v-radio value="Q3">
                  <template v-slot:label>
                    <div>중요하지 않음 & 긴급</div>
                  </template>
                </v-radio>
                <v-radio value="Q4">
                  <template v-slot:label>
                    <div>중요하지 않음 & 긴급하지 않음</div>
                  </template>
                </v-radio>
              </v-radio-group>
            </v-container>
          </v-col>
          <v-col cols="12" md="2"><h4>알림</h4></v-col>
          <v-col cols="12" md="5">
            <v-text-field
                type="number"
                v-model="alertQuantity"
                label="알람 시간">
            </v-text-field>
          </v-col>
          <v-col cols="12" md="5">
            <v-select
                v-model="timeType"
                :items="timeTypes"
                label="시간 단위" >
            </v-select>
          </v-col>
          <v-col cols="12" md="12">
            <v-text-field
                label="메모를 입력하세요."
                v-model="memo">
            </v-text-field>
          </v-col>
          <v-col cols="12" md="12">
            <v-file-input
                v-model="files"
                label="File input"
                placeholder="Upload your documents"
                prepend-icon="mdi-paperclip"
                show-size
                multiple>
              <template v-slot:selection="{ fileNames }">
                <template v-for="fileName in fileNames" :key="fileName">
                  <v-chip class="me-2" color="primary" size="small" label>
                    {{ fileName }}
                  </v-chip>
                </template>
              </template>
            </v-file-input>
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" @click="createEvent">생성</v-btn>
        <v-btn color="blue darken-1" @click="closeDialog">취소</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import axios from 'axios';
import {useMainStore} from '@/stores'
import {jwtDecode} from "jwt-decode";

export default {
  setup() {
    const mainStore = useMainStore();
    const isDialogOpen = mainStore.isDialogOpen;
    const closeDialog = mainStore.closeDialog;

    return {
      mainStore,
      isDialogOpen,
      closeDialog
    };
  },

  data: () => ({
    title: '',
    memo: '',
    place: '',
    radios: null,
    startDateTime: null,
    endDateTime: null,
    alertQuantity: null,
    timeType: '분',
    timeTypes: ['분', '시간', '일'],
    files: [],
  }),

  methods: {
    async createEvent() {
      const TOKEN = localStorage.getItem('accessToken');
      const email = jwtDecode(TOKEN).email;
      const url = `${process.env.VUE_APP_API_BASE_URL}/api/events`;

      // 알림 설정 관련
      const alarmYn = this.alertQuantity ? 'Y' : 'N';
      let alarmType;
      if (this.timeType === '분') alarmType = 'M';
      else if (this.timeType === '시간') alarmType = 'H';
      else alarmType = 'D';

      const alarmSetting = [];
      if (this.alertQuantity) {
        alarmSetting.push({
          setTime: String(this.alertQuantity),
          alarmType: String(alarmType),
        });
      }

      // let alarmJsonInfo = JSON.stringfy(alarmSetting);
      // const alarmRequest = new Blob([alarmJsonInfo], { type: 'application/json' });

      console.log("토큰: " + TOKEN);
      console.log("이메일: " + email);
      console.log("url: " + url);
      console.log("alarmSetting을 알아보자: " + JSON.stringify(alarmSetting));
      console.log("alarmSetting을 알아보자: " + typeof alarmSetting);
      console.log("alarmSetting을 알아보자: " + typeof alarmSetting);


      const formData = new FormData();
      formData.append('nickname', email);
      formData.append('title', this.title);
      formData.append('memo', this.memo);
      formData.append('startDate', this.formatDate(this.startDateTime));
      formData.append('endDate', this.formatDate(this.endDateTime));
      formData.append('place', this.place);
      formData.append('matrix', this.radios);
      formData.append('alarmYn', alarmYn);
      formData.append('alarmRequest', JSON.stringify(alarmSetting));

      if (this.files && this.files.length > 0) {
        // 우선 단일 파일만 전송할 수 있도록 설정
        formData.append('file', this.files[0]);
      }

      await axios.post(url, formData, {
        headers: {
          "Authorization": `Bearer ${TOKEN}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      this.closeDialog();
    },

    formatDate(dateTimeStr) {
      const dateTime = new Date(dateTimeStr);
      return dateTime.toISOString().slice(0,19);
    },
  }
}
</script>