<template>
  <v-container class="search-results">
    <v-row v-if="results.length > 0">
      <EventDetail ref="dialog"></EventDetail>
      <v-col cols="12" v-for="result in results" :key="result.id">
        <v-card
            class="mx-auto result-card"
            :title="result.title"
            :subtitle="formatDate(result.startDate)"
            max-width="800"
            @click="onResultClick(result)"
            link>
          <template v-slot:prepend>
            <v-btn
                class="circle-button"
            >
              {{ getDay(result.startDate) }}
            </v-btn>
          </template>
          <template v-slot:append>
            <v-list lines="one" class="result-card-time">
              <v-list-item
                  :title="'시작'"
                  :subtitle="formatDateAndTime(result.startDate)"
              />
              <v-list-item
                  :title="'종료'"
                  :subtitle="formatDateAndTime(result.endDate)"
              />
            </v-list>
          </template>
          <v-text-field>{{result}}</v-text-field>
        </v-card>
      </v-col>
    </v-row>
    <v-row justify="center" v-else>
      <p>검색 결과가 없습니다.</p>
    </v-row>
  </v-container>
</template>

<script>
import {useSearchStore} from "@/stores/searchStore";
import {computed} from "vue";
import EventDetail from "@/pages/search/EventDetail.vue";

export default {
  components: {
    EventDetail,
  },
  methods: {
    onResultClick(result) {
      this.$refs.dialog.openDialog(result.title, result.memo);
    }
  },
  setup() {
    const searchStore = useSearchStore();
    const results = computed(() => searchStore.results);

    // 날짜 문자열을 받아서 "일"을 반환한다.
    const getDay = (dateString) => {
      const date = new Date(dateString);
      return date.getDate();
    }

    // 날짜 문자열을 받아서 "YYYY년 m월, 요일" 형태로 반환한다.
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = date.getMonth() + 1; // getMonth()는 0에서 11까지의 값을 반환하기 때문에 1을 더한다.
      const dayNames = ["일", "월", "화", "수", "목", "금", "토"];
      const day = dayNames[date.getDay()];
      return `${year}년 ${month}월, ${day}`;
    }

    // 날짜 문자열을 "연 월 일 오전|오후 시 분" 형태로 반환
    const formatDateAndTime = (dateString) => {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = date.getMonth() + 1; // getMonth()는 0에서 11까지의 값을 반환하기 때문에 1을 더한다.
      const day = date.getDate();
      let hours = date.getHours();
      const minutes = date.getMinutes();

      const ampm = hours >= 12 ? '오후' : '오전';

      // 12시간제로 변환
      hours = hours % 12;
      hours = hours ? hours : 12; // hours가 0일 경우 12로 변경

      return `${year}년 ${month}월 ${day}일 ${ampm} ${hours}:${minutes < 10 ? '0' + minutes : minutes}`;
    }

    return {
      results: results,
      getDay: getDay,
      formatDate: formatDate,
      formatDateAndTime: formatDateAndTime
    }
  }
}
</script>

<style>
.search-results {
  margin-top: -15%;
}

.circle-button {
  border-radius: 50%; /* 원형 버튼을 만들기 위한 CSS */
  min-width: 50px; /* 버튼의 최소 너비 */
  min-height: 50px; /* 버튼의 최소 높이 */
  width: 50px; /* 버튼의 너비를 고정값으로 설정 */
  height: 50px; /* 버튼의 높이를 고정값으로 설정 */
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.25);
  background-color: #E0BB76;
  color: #162A2C;
  margin-right: 20px;
  margin-left: 10px;
}

.result-card {
  background-color: #FEFCF6;
}
`
.result-card-time {
  background-color: #FEFCF6;
}
</style>