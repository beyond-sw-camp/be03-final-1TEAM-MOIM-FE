<template>
  <v-dialog v-model="dialog" max-width="600">
    <v-card class="pa-4">
      <v-card-title class="text-h5">
        <v-icon class="mr-2">mdi-calendar-check-outline</v-icon>
        {{ title }}
      </v-card-title>
      <v-card-text>
        <v-row dense>
          <v-col cols="12" md="2"><h4>시작일</h4></v-col>
          <v-col cols="12" md="10">
            {{ startDate }}
          </v-col>
<!--          <v-col cols="12" md="2"><h4>종료일</h4></v-col>-->
<!--          <v-col cols="12" md="10">-->
<!--            <input type="datetime-local" :value="endDateTime" readonly>-->
<!--          </v-col>-->
<!--          <v-col cols="12" md="2"><h4>장소</h4></v-col>-->
<!--          <v-col cols="12" md="10">-->
<!--            <input type="text" :value="place" readonly>-->
<!--          </v-col>-->
<!--          <v-col cols="12" md="2"><h4>중요도</h4></v-col>-->
<!--          <v-col cols="12" md="10">-->
<!--            <input type="text" :value="getEisenhowerMatrixLabel(radios)" readonly>-->
<!--          </v-col>-->
<!--          &lt;!&ndash; <v-col cols="12" md="2"><h4>알림</h4></v-col>-->
<!--          <v-col cols="12" md="10">-->
<!--            <v-text-field :value="`알림 ${alertQuantity} ${getTimeTypeLabel(timeType)}`" readonly>-->
<!--            </v-text-field>-->
<!--          </v-col> &ndash;&gt;-->
<!--          <v-col cols="12" md="2"><h4>메모</h4></v-col>-->
<!--          <v-col cols="12" md="10">-->
<!--            <input type="text" :value="memo" readonly>-->
<!--          </v-col>-->
<!--          <v-col cols="12" md="12">-->
<!--            &lt;!&ndash; 파일 목록은 보여주되, 다운로드 링크나 뷰어를 제공할 수 있습니다. &ndash;&gt;-->
<!--            &lt;!&ndash; <v-subheader>첨부 파일</v-subheader> &ndash;&gt;-->
<!--            <v-list dense>-->
<!--              <v-list-item v-for="file in files" :key="file.name">-->
<!--                &lt;!&ndash; <v-list-item-content>-->
<!--                  <v-list-item-title>{{ file.name }}</v-list-item-title>-->
<!--                </v-list-item-content> &ndash;&gt;-->
<!--              </v-list-item>-->
<!--            </v-list>-->
<!--          </v-col>-->
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
export default {
  data() {
    return {
      dialog: false,
      title: '',
      memo: '',
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
      this.matrix = matrix;
      this.fileUrl = fileUrl;
      this.deleteYn = deleteYn;
      this.alarmYn = alarmYn;
      this.dialog = true;
    }
  }
};
</script>


<style scoped>

</style>