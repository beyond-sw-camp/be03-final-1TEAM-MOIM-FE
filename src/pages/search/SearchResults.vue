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
            <v-btn class="circle-button">
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
import {getDay, formatDate, formatDateAndTime} from "@/utils/date-utils";

export default {
  components: {
    EventDetail,
  },
  methods: {
    onResultClick(result) {
      this.$refs.dialog.openDialog(
          result.id,
          result.nickname,
          result.title,
          result.memo,
          result.startDate,
          result.endDate,
          result.place,
          result.matrix,
          result.fileUrl,
          result.deleteYn,
          result.alarmYn,
      );
    }
  },
  setup() {
    const searchStore = useSearchStore();
    const results = computed(() => searchStore.results);

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

.result-card-time {
  background-color: #FEFCF6;
}
</style>