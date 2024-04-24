<template>
  <div class='demo-app'>
    <div class='demo-app-main'>
      <v-sheet>
        <FullCalendar ref="fullCalendar" class='demo-app-calendar' :options='calendarOptions'>
        </FullCalendar>
      </v-sheet>
    </div>
  </div>
  <EventDetailDialog ref="EventDetail"></EventDetailDialog>
  <EventDialog ref="EventCreate"></EventDialog>

</template>

<script>
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import EventDetailDialog from '../pages/event/EventDetailDialog.vue'
import EventDialog from '../pages/event/EventDialog.vue'
import axiosInstance from "@/axios";

export default {
  components: {
    FullCalendar, // make the <FullCalendar> tag available
    EventDetailDialog,
    EventDialog
  },
  data() {
    return {
      events: [],
      calendarOptions: {
        plugins: [ dayGridPlugin, timeGridPlugin, interactionPlugin ],
        headerToolbar: {
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        initialView: 'dayGridMonth',
        selectable: true,
        select: this.handleDateSelect,
        eventClick: this.handleEventClick,
        events: this.events,
        datesSet: this.handleDatesSet
      },
    }
  },
  methods: {
     // 일정 누르면 상세보기로 바꾸기
    handleEventClick(clickInfo) {
      this.$refs.EventDetail.openDialog(clickInfo.event.id)
    },
    // 날짜 누르면 이벤트 등록하게 바꾸기
    handleDateSelect(selectInfo) {
      this.$refs.EventCreate.selectOpenDialog(selectInfo);
    },
    async fetchEvents({ startStr }) {
      // 날짜 정보에서 연도와 월 추출
      const startDate = new Date(startStr);
      console.log("시작일자", startDate)
      const selectDate = new Date(startDate.setDate(startDate.getDate() + 7));
      console.log("중간이라고 생각함" ,selectDate)
      const year = startDate.getFullYear();
      const month = startDate.getMonth() + 1;
      console.log(year, 'fetchevent year ', month, "fetchevent month ")
      try {
        const token = localStorage.getItem("accessToken");
        const headers = { Authorization: `Bearer ${token}` };
        console.log(token)
        if (token == null) {
          alert("로그인이 필요합니다.");
          this.$router.push({ name: "Login" });
          return;
        }
        const response = await axiosInstance.get(`${process.env.VUE_APP_API_BASE_URL}/api/events/monthly/${year}/${month}`, { headers });
        const getEvents = response.data.data;
        console.log(getEvents)
        const events = [];
        getEvents.forEach(event =>
          events.push({
            title: event.title,
            id: event.id,
            start: new Date(event.startDate),
            end: new Date(event.endDate),
          }));
        this.events = events;

        // FullCalendar에 이벤트 업데이트
        this.$refs.fullCalendar.getApi().removeAllEvents();
        this.$refs.fullCalendar.getApi().addEventSource(this.events);
      } catch (error) {
        console.log(error);
      }
    },
    handleDatesSet({ start, end, startStr, endStr }) {
      console.log(start, "handleDatesSet start ", end, " ", startStr, " ", endStr, " ")
      this.fetchEvents({ startStr });
    },
  }
}
</script>

<style lang='css'>

.demo-app {
  display: flex;
  min-height: 100%;
  font-family: Arial, Helvetica Neue, Helvetica, sans-serif;
  font-size: 14px;
}

.demo-app-main {
  flex-grow: 1;
  padding: 3em;
}

</style>