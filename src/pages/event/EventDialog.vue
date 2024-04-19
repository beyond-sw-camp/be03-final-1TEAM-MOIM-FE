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
// import {useMainStore} from '@/stores'

export default {
  // setup() {
  //   const mainStore = useMainStore();
  //   const isDialogOpen = mainStore.isDialogOpen;
  //   const closeDialog = mainStore.closeDialog;

  //   return {
  //     mainStore,
  //     isDialogOpen,
  //     closeDialog
  //   };
  // },

  data () {
    return {
      isDialogOpen: false,
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
    } 
  },

  methods: {
    selectOpenDialog(selectInfo) {
      if(selectInfo.view)
      console.log("start", selectInfo.start);
      console.log("view" ,selectInfo.view);
      // string 타입의 날짜를 Date 객체로 변환
      let dateObject = new Date(selectInfo.endStr);
      // 1일을 빼기 위해 24시간 * 60분 * 60초 * 1000밀리초를 빼줌
      dateObject.setTime(dateObject.getTime() - (1 * 24 * 60 * 60 * 1000));
      // 변경된 날짜를 string으로 변환
      let newDateString = dateObject.toISOString().split('T')[0];
      this.startDateTime = selectInfo.startStr + "T00:00:00";
      this.endDateTime = newDateString + "T23:59:00";
      this.isDialogOpen = true;
    },
    openDialog() {
      this.isDialogOpen = true;
    },
    closeDialog() {
      this.isDialogOpen = false;
    },
    async createEvent() {

      // 알림 설정 관련
      const alarmYn = this.alertQuantity ? 'Y' : 'N';
      let alarmType;
      if (this.timeType === '분') alarmType = 'M';
      if (this.timeType === '시간') alarmType = 'H';
      if (this.timeType === '일') alarmType = 'D';

      // eventRequest 조립
      let eventRequest = {
        title: this.title,
        memo: this.memo,
        startDate: this.startDateTime,
        endDate: this.endDateTime,
        place: this.place,
        matrix: this.radios,
        alarmYn: alarmYn
      }
      const eventBlob = new Blob([JSON.stringify(eventRequest)], { type: 'application/json' });

      const alarmList = [];
      if (this.alertQuantity) {
        alarmList.push({
          setTime: this.alertQuantity,
          alarmType: alarmType,
        });
      }

      const alarmBlob = new Blob([JSON.stringify(alarmList)], { type: 'application/json' });

      const formData = new FormData();
      formData.append('alarmRequests', alarmBlob);  
      formData.append('eventRequest', eventBlob);

      if (this.files && this.files.length > 0) {
        // 우선 단일 파일만 전송할 수 있도록 설정
        formData.append('file', this.files[0]);
      }

      
      

      const TOKEN = localStorage.getItem('accessToken');
      const url = `${process.env.VUE_APP_API_BASE_URL}/api/events`;

      try {
        await axios.post(url, formData, {
          headers: {
            "Authorization": `Bearer ${TOKEN}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        console.log("등록완료")
      
        this.closeDialog();
        window.alert(this.title + " 일정이 생성되었습니다.")
        window.location.reload();

      } catch (error) {
        console.log(error)
      }
    },

    // formatDate(dateTimeStr) {
    //   const dateTime = new Date(dateTimeStr);
    //   console.log("이게머야", dateTime.toISOString())
    //   return dateTime.toISOString().slice(0,19);
    // },
  }
}
</script>