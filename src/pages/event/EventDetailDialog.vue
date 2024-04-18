<template>
  <v-dialog v-model="isVisible" max-width="600" :persistent="true">
    <v-card class="pa-4">
      <v-card-title>
        <v-icon class="mr-2">mdi-calendar-check</v-icon>
        일정 상세 정보
      </v-card-title>
      <v-card-text>
        <v-row dense>
          <v-col cols="12" sm="12">
            <v-text-field label="제목"
                          :value="title"
                          readonly>
            </v-text-field>
          </v-col>
          <v-col cols="12" md="2"><h4>시작일</h4></v-col>
          <v-col cols="12" md="10">
            <input type="datetime-local" :value="startDateTime" readonly>
          </v-col>
          <v-col cols="12" md="2"><h4>종료일</h4></v-col>
          <v-col cols="12" md="10">
            <input type="datetime-local" :value="endDateTime" readonly>
          </v-col>
          <v-col cols="12" sm="12">
            <v-text-field label="장소"
                          :value="place"
                          readonly>
            </v-text-field>
          </v-col>
          <v-col cols="12" sm="12"><h4>아이젠하워 매트릭스 중요도</h4></v-col>
          <v-col cols="12" sm="12">
            <v-text-field :value="getEisenhowerMatrixLabel(radios)" readonly>
            </v-text-field>
          </v-col>
          <v-col cols="12" md="2"><h4>알림</h4></v-col>
          <v-col cols="12" md="10">
            <v-text-field :value="`알림 ${alertQuantity} ${getTimeTypeLabel(timeType)}`" readonly>
            </v-text-field>
          </v-col>
          <v-col cols="12" md="12">
            <v-text-field
                label="메모"
                :value="memo"
                readonly>
            </v-text-field>
          </v-col>
          <v-col cols="12" md="12">
            <!-- 파일 목록은 보여주되, 다운로드 링크나 뷰어를 제공할 수 있습니다. -->
            <!-- <v-subheader>첨부 파일</v-subheader> -->
            <v-list dense>
              <v-list-item v-for="file in files" :key="file.name">
                <!-- <v-list-item-content>
                  <v-list-item-title>{{ file.name }}</v-list-item-title>
                </v-list-item-content> -->
              </v-list-item>
            </v-list>
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" @click="closeDialog">닫기</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>


<script>
export default {
  props: ['eventId'],
  watch: {
    isVisible(newVal) {
      if(!newVal) {
        this.resetEventId();
      }
    }
  },
  data() {
    return {
      // Dialog 상태
      isVisible: false,
      // 상세 정보를 위한 데이터
      title: 'Vue.js Workshop',
      startDateTime: '2024-04-20T09:00',
      endDateTime: '2024-04-20T17:00',
      place: 'Seoul, South Korea',
      radios: 'Q2', // Eisenhower Matrix 선택 값
      alertQuantity: '30',
      timeType: 'minutes',
      memo: 'Bring your own laptop.',
      files: [
        { name: 'Workshop Outline.pdf' },
        { name: 'Preparation Guide.pdf' }
      ],
      // 시간 단위 선택 항목
      timeTypes: [
        { text: 'Minutes', value: 'minutes' },
        { text: 'Hours', value: 'hours' },
        { text: 'Days', value: 'days' }
      ],
    };
  },
  methods: {
    openDialog() {
      this.isVisible = true;
      console.log("넘어온 이벤트 아이디", this.eventId)
      this.$emit('resetEventId');
    },
    closeDialog() {
      this.isVisible = false;
      this.resetEventId();
      // this.$emit('update:isVisible', false);
    },
    resetEventId() {
      this.$emit('resetEventId');
    },
    // Eisenhower Matrix 라벨 반환
    getEisenhowerMatrixLabel(value) {
      const labels = {
        Q1: '중요 & 긴급하지 않음',
        Q2: '중요 & 긴급',
        Q3: '중요하지 않음 & 긴급',
        Q4: '중요하지 않음 & 긴급하지 않음'
      };
      return labels[value] || '알 수 없음';
    },
    // 시간 단위 라벨 반환
    getTimeTypeLabel(value) {
      const found = this.timeTypes.find(type => type.value === value);
      return found ? found.text : '알 수 없음';
    }
  }
}
</script>
