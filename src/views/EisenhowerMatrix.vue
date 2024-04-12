<template>
  <div class="EisenhowerParent">
    <v-container fluid class="pa-0 eisenhower-matrix">
      
      <v-row class="flex-nowrap">
        <v-col cols="12" class="d-flex flex-column">
          <!-- Horizontal labels -->
          <v-row class="emergency-text">
            <v-col cols="6" class="d-flex justify-center align-end pr-2 label-horizontal">긴급</v-col>
            <v-col cols="6" class="d-flex justify-center align-end pl-2 label-horizontal">긴급하지 않음</v-col>
          </v-row>
          
          <!-- 위의 2분면 -->
          <v-row class="flex-grow-1">
            <v-col cols="2" class="d-flex align-end flex-column label-vertical-container">
              <div class="label-vertical">중요</div>
            </v-col>

            <!-- 1분면 -->
            <v-col cols="5" class="border-right border-bottom pa-3">
              <v-card id="Q1" class="fill-height" dark>
                <v-card-text class="subtitle-1">
                 <div v-for="event in eventsQ1" :key="event.id" class="event-item">
                  {{ event.title }} - {{ formatDate(event.startDate) }}
                </div>
                </v-card-text>
              </v-card>
            </v-col>

          <!-- 2분명 -->
            <v-col cols="5" class="border-bottom pa-3">
              <v-card id="Q2" class="fill-height" dark>
                <v-card-text class="subtitle-1">
                  <div v-for="event in eventsQ2" :key="event.id" class="event-item">
                    {{ event.title }} - {{ formatDate(event.startDate) }}
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
            

            <v-col cols="2" class="d-flex align-end flex-column label-vertical-container">
              <div class="label-vertical">중요하지 않음</div>
            </v-col>
          </v-row>
          
          <!-- 밑의 2분면 -->
          <v-row class="flex-grow-1">
            <v-col cols="2"></v-col> 
            <v-col cols="5" class="border-right pa-3">

            <!-- 3분면 -->
              <v-card id="Q3" class="fill-height" dark>
                <v-card-text class="subtitle-1">
                <div v-for="event in eventsQ3" :key="event.id" class="event-item">
                  {{ event.title }} - {{ formatDate(event.startDate) }}
                </div>
                </v-card-text>
              </v-card>
            </v-col>


          <!-- 4분면 -->
            <v-col cols="5" class="pa-3">
              <v-card id="Q4" class="fill-height" dark>
                <v-card-text class="subtitle-1">
                  <div v-for="event in eventsQ4" :key="event.id" class="event-item">
                    {{ event.title }} - {{ formatDate(event.startDate) }}
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import axios from 'axios';
import moment from 'moment'; // 날짜 포맷을 위해 moment.js 사용
export default {
    data(){
        return{
            eventsQ1: [], // Q1 분면의 이벤트 데이터를 저장할 배열
            eventsQ2: [], // Q2 분면의 이벤트 데이터
            eventsQ3: [], // Q3 분면의 이벤트 데이터
            eventsQ4: [], // Q4 분면의 이벤트 데이터
            authToken: '',
        
        }
    },
    
    created() {
      this.authToken = this.getAuthToken(); // 토큰 설정
      // console.log("Current auth token:", this.authToken); // 현재 토큰 값 로그 출력
      if (this.authToken) {
          this.connectSSE(); // SSE 연결 설정
          this.fetchEvents('Q1'); // 이벤트 데이터 가져오기
          this.fetchEvents('Q2');
          this.fetchEvents('Q3');
          this.fetchEvents('Q4');
      }
    },

    methods: {
      getAuthToken() {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            alert("로그인 후 이용해 주세요");
            this.$router.push('/login'); // Vue Router를 사용해 로그인 페이지로 리다이렉트
            return '';
        }
        return token;
      },

        connectSSE() {
        if (!this.authToken) {
            console.error("Authentication token is missing");
            return;
        }
        const headers = { Authorization: `Bearer ${this.authToken}` }; // 헤더 설정 방식을 통일
            const eventSource = new EventSource(`${process.env.VUE_APP_API_BASE_URL}/connect`, { headers });
            eventSource.onmessage = function(event) {
                console.log('New event from server:', event.data);
            };
            eventSource.onerror = function(error) {
                console.error('EventSource failed:', error);
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
          this[`events${matrix}`] = response.data.data;  // 직접 data 필드를 참조
          console.log(`Data received for ${matrix}:`, this[`events${matrix}`]);
        } else {
          console.error(`No data received for ${matrix}`, response.data);
        }
      } catch (error) {
        console.error(`Error fetching events for ${matrix}:`, error.response ? error.response.data : "No response");
      }
    
    },
    formatDate(value) {
        return value ? moment(String(value)).format('MM/DD/YYYY hh:mm') : '';
    },
    },
}
</script>


<style scoped>
.EisenhowerParent {
  position: absolute; 
  width: 100%;
  height: 100%; 
  right: 5%; /* 오른쪽 끝에 위치 사이드바 위치에 따라 바꾸기!!! */
  top: 10vh; /* 헤더의 높이값에따라 바꾸기!!! */
  
}
.eisenhower-matrix {
  height: 100vh; /* Full viewport height */
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
  height: 100%; /* Full height to match quadrant height */
}

.label-horizontal {
  font-size: 1.25rem; /* Font size for horizontal labels */
  
}

.fill-height {
  height: 50; /* Each quadrant should fill half of its container's height */
}
.event-item{
  font-size: 1.25rem;
}
.emergency-text{
  padding-left: 10%;
}
#Q1{
  background: #F3676B;
}
#Q2{
  background : #F08D75
}
#Q3{
  background : #8FDCB2
}
#Q4{
  background : #4672D3
}

</style>
