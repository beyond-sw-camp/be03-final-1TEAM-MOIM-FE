<template>
  <v-container fluid class="pa-0 eisenhower-matrix">
    <v-row no-gutters class="justify-center">
      <EventDetail ref="dialog"></EventDetail>
      <!-- 조각 1 -->
      <v-col cols="2" class="pa-3" style="flex-basis: 30%; max-width: 22%;">
        <v-card id="Q1" class="mb-3 d-flex justify-center align-center" dark
                style="height: 60px; font-size: 1.3em; font-weight: bold;">
          중요 & 긴급하지 않음
        </v-card>
        <draggable
            class="drag-area"
            :list="eventsQ1"
            group="events"
            @change="updateEventsTo1"
        >
          <template #item="{ element }">
            <v-card
                :key="element.id"
                class="mb-3 event-item"
                prepend-icon="mdi-check-circle-outline"
                :title="element.title"
                :subtitle="formatDate(element.startDate)"
                @click="onEventClick(element)"
            >
            </v-card>
          </template>
        </draggable>
      </v-col>

      <!-- 조각 2 -->
      <v-col cols="2" class="pa-3" style="flex-basis: 30%; max-width: 22%;">
        <v-card id="Q2" class="mb-3 d-flex justify-center align-center" dark
                style="height: 60px; font-size: 1.3em; font-weight: bold;">
          중요 & 긴급
        </v-card>

        <draggable
            class="drag-area"
            :list="eventsQ2"
            group="events"
            @change="updateEventsTo2"
        >
          <template #item="{ element }">
            <v-card
                :key="element.id"
                class="mb-3 event-item"
                prepend-icon="mdi-check-circle-outline"
                :title="element.title"
                :subtitle="formatDate(element.startDate)"
                @click="onEventClick(element)"
            >
            </v-card>
          </template>
        </draggable>
      </v-col>

      <!-- 조각 3 -->
      <v-col cols="2" class="pa-3" style="flex-basis: 30%; max-width: 22%;">
        <v-card id="Q3" class="mb-3 d-flex justify-center align-center" dark
                style="height: 60px; font-size: 1.3em; font-weight: bold;">
          중요하지 않음 & 긴급
        </v-card>

        <draggable
            class="drag-area"
            :list="eventsQ3"
            group="events"
            @change="updateEventsTo3"
        >
          <template #item="{ element }">
            <v-card
                :key="element.id"
                class="mb-3 event-item"
                prepend-icon="mdi-check-circle-outline"
                :title="element.title"
                :subtitle="formatDate(element.startDate)"
                @click="onEventClick(element)"
            >
            </v-card>
          </template>
        </draggable>
      </v-col>

      <!-- 조각 4 -->
      <v-col cols="2" class="pa-3" style="flex-basis: 30%; max-width: 22%;">
        <v-card id="Q4" class="mb-3 d-flex justify-center align-center" dark
                style="height: 60px; font-size: 1.3em; font-weight: bold;">
          중요하지 않음 & 긴급하지 않음
        </v-card>

        <draggable
            class="drag-area"
            :list="eventsQ4"
            group="events"
            @change="updateEventsTo4"
        >
          <template #item="{ element }">
            <v-card
                :key="element.id"
                class="mb-3 event-item"
                prepend-icon="mdi-check-circle-outline"
                :title="element.title"
                :subtitle="formatDate(element.startDate)"
                @click="onEventClick(element)"
            >
            </v-card>
          </template>
        </draggable>
      </v-col>

    </v-row>
  </v-container>
</template>

<script>
import moment from "moment"; // 날짜 포맷을 위해 moment.js 사용
import draggable from "vuedraggable";
import axiosInstance from "@/axios";
import EventDetail from "@/pages/search/EventDetail.vue";

export default {
  components: {
    EventDetail,
    draggable,
  },
  data() {
    return {
      eventsQ1: [], // Q1 분면의 이벤트 데이터를 저장할 배열
      eventsQ2: [], // Q2 분면의 이벤트 데이터
      eventsQ3: [], // Q3 분면의 이벤트 데이터
      eventsQ4: [], // Q4 분면의 이벤트 데이터
      authToken: "",
    };
  },

  created() {
    this.authToken = this.getAuthToken(); // 토큰 설정
    // console.log("Current auth token:", this.authToken); // 현재 토큰 값 로그 출력
    if (this.authToken) {
      this.connectSSE(); // SSE 연결 설정
      this.fetchEvents("Q1"); // 이벤트 데이터 가져오기
      this.fetchEvents("Q2");
      this.fetchEvents("Q3");
      this.fetchEvents("Q4");
    }
  },

  methods: {
    onEventClick(result) {
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
          result.repeatParent,
          result.alarmYn,
      );
    },
    async updateEventsTo1(event) {
      console.log("이거시 이벤트다잉 ", event);
      if (!this.authToken) {
        console.error("Authentication token is missing");
        return;
      }
      // 요소가 추가된 경우에만 처리
      if (event.added) {
        const eventElement = event.added.element;
        if (!eventElement) {
          console.error("Dragged element is missing");
          return;
        }
        const eventId = eventElement.id;
        console.log("이벤트의 아이디 ", eventId);

        const url = `${process.env.VUE_APP_API_BASE_URL}/api/events/matrixUpdate/${eventId}/Q1`;
        const headers = {
          Authorization: `Bearer ${this.authToken}`,
          "Content-Type": "application/json",
        };

        try {
          const response = await axiosInstance.patch(url, {}, {headers});
          if (response.data.success && response.data.data) {
            console.log("수정 요청 성공함");
          } else {
            console.error("수정 요청 실패함");
          }
        } catch (error) {
          console.error("메트릭스 실패", error);
        }
      } else {
        console.log("No element was added to Q1");
      }
    },

    async updateEventsTo2(event) {
      if (!this.authToken) {
        console.error("Authentication token is missing");
        return;
      }
      // 요소가 추가된 경우에만 처리
      if (event.added) {
        const eventElement = event.added.element;
        if (!eventElement) {
          console.error("Dragged element is missing");
          return;
        }
        const eventId = eventElement.id;
        console.log("이벤트의 아이디 ", eventId);

        const url = `${process.env.VUE_APP_API_BASE_URL}/api/events/matrixUpdate/${eventId}/Q2`;
        const headers = {
          Authorization: `Bearer ${this.authToken}`,
          "Content-Type": "application/json",
        };

        try {
          const response = await axiosInstance.patch(url, {}, {headers});
          if (response.data.success && response.data.data) {
            console.log("수정 요청 성공함");
          } else {
            console.error("수정 요청 실패함");
          }
        } catch (error) {
          console.error("메트릭스 실패", error);
        }
      } else {
        console.log("No element was added to Q2");
      }
    }
    ,
    async updateEventsTo3(event) {
      if (!this.authToken) {
        console.error("Authentication token is missing");
        return;
      }
      // 요소가 추가된 경우에만 처리
      if (event.added) {
        const eventElement = event.added.element;
        if (!eventElement) {
          console.error("Dragged element is missing");
          return;
        }
        const eventId = eventElement.id;
        console.log("이벤트의 아이디 ", eventId);

        const url = `${process.env.VUE_APP_API_BASE_URL}/api/events/matrixUpdate/${eventId}/Q3`;
        const headers = {
          Authorization: `Bearer ${this.authToken}`,
          "Content-Type": "application/json",
        };

        try {
          const response = await axiosInstance.patch(url, {}, {headers});
          if (response.data.success && response.data.data) {
            console.log("수정 요청 성공함");
          } else {
            console.error("수정 요청 실패함");
          }
        } catch (error) {
          console.error("메트릭스 실패", error);
        }
      } else {
        console.log("No element was added to Q3");
      }
    }
    ,

    async updateEventsTo4(event) {
      if (!this.authToken) {
        console.error("Authentication token is missing");
        return;
      }
      // 요소가 추가된 경우에만 처리
      if (event.added) {
        const eventElement = event.added.element;
        if (!eventElement) {
          console.error("Dragged element is missing");
          return;
        }
        const eventId = eventElement.id;
        console.log("이벤트의 아이디 ", eventId);

        const url = `${process.env.VUE_APP_API_BASE_URL}/api/events/matrixUpdate/${eventId}/Q4`;
        const headers = {
          Authorization: `Bearer ${this.authToken}`,
          "Content-Type": "application/json",
        };

        try {
          const response = await axiosInstance.patch(url, {}, {headers});
          if (response.data.success && response.data.data) {
            console.log("수정 요청 성공함");
          } else {
            console.error("수정 요청 실패함");
          }
        } catch (error) {
          console.error("메트릭스 실패", error);
        }
      } else {
        console.log("No element was added to Q4");
      }
    }
    ,

    getAuthToken() {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        console.error("No authentication token found.");
        return "";
      }
      return token;
    },

    connectSSE() {
      if (!this.authToken) {
        console.error("Authentication token is missing");
        return;
      }
      const headers = {
        Authorization: `Bearer ${this.authToken}`,
        "Content-Type": "text/event-stream",
      }; // 헤더 설정 방식을 통일
      const eventSource = new EventSource(`${process.env.VUE_APP_API_BASE_URL}/connect`, {
        headers,
      });
      eventSource.onmessage = function (event) {
        console.log("New event from server:", event.data);
      };
      eventSource.onerror = function (error) {
        console.error("EventSource failed:", error);
        eventSource.close();
      };
    },
    async fetchEvents(matrix) {
      // 토큰이 없을 경우 로그를 출력하고 함수를 종료합니다.
      if (!this.authToken) {
        console.error("Authentication token is missing");
        return;
      }

      const headers = {Authorization: `Bearer ${this.authToken}`}; // 헤더 설정 방식을 통일
      const url = `${process.env.VUE_APP_API_BASE_URL}/api/events/matrix/${matrix}`;
      // console.log("Request URL:", url); // 요청 URL 확인

      try {
        const response = await axiosInstance.get(url, {headers});
        if (response.data.success && response.data.data) {
          this[`events${matrix}`] = response.data.data; // 직접 data 필드를 참조
          console.log(`Data received for ${matrix}:`, this[`events${matrix}`]);
        } else {
          console.error(`No data received for ${matrix}`, response.data);
        }
      } catch (error) {
        console.error(
            `Error fetching events for ${matrix}:`,
            error.response ? error.response.data : "No response"
        );
      }
    },
    formatDate(value) {
      return value ? moment(String(value)).format("MM/DD/YYYY hh:mm") : "";
    },
  },
};
</script>

<style scoped>
.EisenhowerParent {
  position: absolute;
  width: 100%;
  height: 100%;
  right: 5%;
  /* 오른쪽 끝에 위치 사이드바 위치에 따라 바꾸기!!! */
  top: 10vh;
  /* 헤더의 높이값에따라 바꾸기!!! */
}

.eisenhower-matrix {
  margin-top: -13%;
  height: 100vh;
  /* Full viewport height */
}

.event-item {
  font-size: 1.25rem;
}

.v-col {
  background-color: #f0f0f0; /* Light grey */
  border-radius: 1rem; /* Round corners */
  margin: 0.5rem; /* Some margin around every column */
}

#Q1 {
  background: #f3676b;
}

#Q2 {
  background: #f08d75;
}

#Q3 {
  background: #8fdcb2;
}

#Q4 {
  background: #4672d3;
}
</style>
