<template>
  <div class="no-top-margin">
    <v-sheet class="d-flex" height="54" tile>
      <v-select v-model="type" :items="types" class="ma-2" label="View Mode" variant="outlined" dense
        hide-details></v-select>
      <v-select v-model="weekday" :items="weekdays" class="ma-2" label="weekdays" variant="outlined" dense
        hide-details></v-select>
    </v-sheet>
    <v-sheet>

      <v-calendar ref="calendar" v-model="value" :events="events" :view-mode="type" :weekdays="weekday"
        @click="saveEventId">
      </v-calendar>
    </v-sheet>
  </div>
</template>

<script>
import { useDate } from 'vuetify'
import axios from 'axios';

export default {
  data: () => ({
    type: 'month',
    types: ['month', 'week', 'day'],
    weekday: [0, 1, 2, 3, 4, 5, 6],
    weekdays: [
      { title: 'Sun - Sat', value: [0, 1, 2, 3, 4, 5, 6] },
      { title: 'Mon - Sun', value: [1, 2, 3, 4, 5, 6, 0] },
      { title: 'Mon - Fri', value: [1, 2, 3, 4, 5] },
      { title: 'Mon, Wed, Fri', value: [1, 3, 5] },
    ],
    value: [new Date()],
    events: [],
    currentDate: new Date(),
    month: new Date().getMonth() + 1, // 현재 월로 초기화
    adapter: useDate(),
    eventId: '',

  }),
  mounted() {
    // this.adapter = useDate()
    const start = this.adapter.startOfDay(this.adapter.startOfMonth(this.currentDate));
    const end = this.adapter.endOfDay(this.adapter.endOfMonth(this.currentDate));
    const year = this.currentDate.getFullYear(); // 연도 추출
    // const month = this.currentDate.getMonth() + 1; // 월 추출 (0부터 시작하므로 +1)
    // this.month는 이미 현재 월로 초기화되어 있으므로 여기서 그대로 사용
    this.fetchEvents({ start, end, month: this.month, year })
  },
  watch: {
    // 'value'를 감시하고 있는 감시자 함수
    value(newValue) {
      const start = this.adapter.startOfDay(this.adapter.startOfMonth(this.currentDate));
      const end = this.adapter.endOfDay(this.adapter.endOfMonth(this.currentDate));
      const year = newValue[0].getFullYear(); // 연도 업데이트
      this.month = newValue[0].getMonth() + 1;
      this.fetchEvents({ start, end, month: this.month, year })
    }
  },
  methods: {
    // 이벤트 아이디 저장
    saveEventId(event) {
      const eventId = event;
      console.log('Event Clicked hihi:', eventId);

      console.log(this.id);
    },

    // 

    // showEvent(event) {
    //   console.log('Event Clicked:', event)

    // },
    // prev () {
    //   this.$refs.calendar.prev()
    // },
    // next () {
    //   this.$refs.calendar.next()
    //   },
    // handleDateChange(date) {
    //   this.currentDate = new Date(date);
    //   this.reloadEvents();
    // },
    // reloadEvents() {
    //   const adapter = useDate();
    //   const start = adapter.startOfDay(adapter.startOfMonth(this.currentDate));
    //   const end = adapter.endOfDay(adapter.endOfMonth(this.currentDate));
    //   const year = this.currentDate.getFullYear();
    //   const month = this.currentDate.getMonth() + 1;
    //   this.fetchEvents({start, end, month, year});
    // },
    async fetchEvents({ start, end, month, year }) {
      try {
        const token = localStorage.getItem("accessToken");
        const headers = { Authorization: `Bearer ${token}` };
        if (token == null) {
          alert("로그인이 필요합니다.");
          this.$router.push({ name: "Login" });
          return;
        }
        const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/api/events/monthly/${year}/${month}`, { headers });
        const getEvents = response.data.data;
        console.log(getEvents);
        const min = start
        const max = end
        console.log(min, max);
        console.log(this.value);
        // const days = (max.getTime() - min.getTime()) / 86400000
        // const eventCount = events.length;
        // console.log(eventCount);
        const events = [];
        getEvents.forEach(event =>
          events.push({
            // title: event.title + "("+event.id+")",
            title: event.title,
            id: event.id,
            start: new Date(event.startDate),
            end: new Date(event.endDate),
          }));
        this.events = events;
      } catch (error) {
        console.log(error);
      }
    },
    // getEvents({start, end}) {
    // const events = []

    // const min = start;
    // const max = end;
    // const days = (max.getTime() - min.getTime()) / 86400000
    // const eventCount = this.rnd(days, days + 20)

    // for (let i = 0; i < eventCount; i++) {
    //   const allDay = this.rnd(0, 3) === 0
    //   const firstTimestamp = this.rnd(min.getTime(), max.getTime())
    //   const first = new Date(firstTimestamp - (firstTimestamp % 900000))
    //   const secondTimestamp = this.rnd(2, allDay ? 288 : 8) * 900000
    //   const second = new Date(first.getTime() + secondTimestamp)

    //   events.push({
    //     title: this.titles[this.rnd(0, this.titles.length - 1)],
    //     start: first,
    //     end: second,
    //     color: this.colors[this.rnd(0, this.colors.length - 1)],
    //     allDay: !allDay,
    //   })
    //   }

    //   this.events = events
    // },
    getEventColor(event) {
      return event.color
    },
    rnd(a, b) {
      return Math.floor((b - a + 1) * Math.random()) + a
    },
  },
}
</script>

<style scoped>
.no-top-margin {
  margin-top: 0 !important;
}
</style>