<template>
  <div class="EisenhowerParent">
    <v-container fluid class="pa-0 eisenhower-matrix">
      <v-col cols="12" class="d-flex flex-column">
        <!-- Horizontal labels -->
        <v-row class="emergency-text">
          <v-col cols="6" class="d-flex justify-center align-end pr-2 label-horizontal"
            >긴급</v-col
          >
          <v-col cols="6" class="d-flex justify-center align-end pl-2 label-horizontal"
            >긴급하지 않음</v-col
          >
        </v-row>

        <!-- 위의 2분면 -->
        <v-row class="flex-grow-1">
          <v-col cols="2" class="d-flex align-end flex-column label-vertical-container">
            <div class="label-vertical">중요</div>
          </v-col>

          <!-- 1분면 -->
          <v-col cols="5" class="border-right border-bottom pa-3" focused>
            <v-card id="Q1" class="fill-height" dark>
              <draggable
                class="drag-area"
                :list="eventsQ1"
                group="events"
                @change="updateEventsTo1"
              >
                <template #item="{ element }">
                  <div :key="element.id" class="event-item">
                    {{ element.title }} - {{ formatDate(element.startDate) }}
                  </div>
                </template>
              </draggable>
            </v-card>
          </v-col>

          <!-- 2분명 -->
          <v-col cols="5" class="border-bottom pa-3" focused>
            <v-card id="Q2" class="fill-height" dark>
              <draggable
                class="drag-area"
                :list="eventsQ2"
                group="events"
                @change="updateEventsTo2"
              >
                <template #item="{ element }">
                  <div :key="element.id" class="event-item">
                    {{ element.title }} - {{ formatDate(element.startDate) }}
                  </div>
                </template>
              </draggable>
            </v-card>
          </v-col>
        </v-row>

        <!-- 밑의 2분면 -->
        <v-row class="flex-grow-1">
          <v-col cols="2" class="d-flex align-end flex-column label-vertical-container">
            <div class="label-vertical">중요하지 않음</div>
          </v-col>

          <!-- 3분면 -->
          <v-col cols="5" class="border-right pa-3" focused>
            <v-card id="Q3" class="fill-height" dark>
              <draggable
                class="drag-area"
                :list="eventsQ3"
                group="events"
                @change="updateEventsTo3"
              >
                <template #item="{ element }">
                  <div :key="element.id" class="event-item">
                    {{ element.title }} - {{ formatDate(element.startDate) }}
                  </div>
                </template>
              </draggable>
            </v-card>
          </v-col>

          <!-- 4분면 -->
          <v-col cols="5" class="pa-3" focused>
            <v-card id="Q4" class="fill-height" dark>
              <draggable
                class="drag-area"
                :list="eventsQ4"
                group="events"
                @change="updateEventsTo4"
              >
                <template #item="{ element }">
                  <div :key="element.id" class="event-item">
                    {{ element.title }} - {{ formatDate(element.startDate) }}
                  </div>
                </template>
              </draggable>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-container>
  </div>
</template>

<script>
import axios from "axios";
import moment from "moment"; // 날짜 포맷을 위해 moment.js 사용
import draggable from "vuedraggable";

export default {
  components: {
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
    async updateEventsTo1(event) {
      console.log("이거시 이벤트다잉 " , event);
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
      const response = await axios.patch(url, {}, { headers });
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
      const response = await axios.patch(url, {}, { headers });
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
      const response = await axios.patch(url, {}, { headers });
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
      const response = await axios.patch(url, {}, { headers });
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

      const headers = { Authorization: `Bearer ${this.authToken}` }; // 헤더 설정 방식을 통일
      const url = `${process.env.VUE_APP_API_BASE_URL}/api/events/matrix/${matrix}`;
      // console.log("Request URL:", url); // 요청 URL 확인

      try {
        const response = await axios.get(url, { headers });
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
  height: 100vh;
  /* Full viewport height */
}

.border-right {
  border-right: 2px solid black;
}

.border-bottom {
  border-bottom: 2px solid black;
}

.label-vertical {
  writing-mode: tb-rl;
}

.label-vertical-container {
  height: 100%;
  /* Full height to match quadrant height */
}

.label-horizontal {
  font-size: 1.25rem;
  /* Font size for horizontal labels */
}

.fill-height {
  height: 50;
  /* Each quadrant should fill half of its container's height */
}

.event-item {
  font-size: 1.25rem;
}

.emergency-text {
  padding-left: 10%;
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
