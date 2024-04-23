<template>
  <v-container>
    하이하이
    <p>Event ID: {{ eventId }}</p>
    <p>Event Title: {{ eventTitle }}</p>
  </v-container>
</template>

<script>
import {useEventStore} from "@/stores/updateEventStore";

export default {
  data() {
    return {
      eventId: '',
      eventTitle: '',
    }
  },
  mounted() {
    const eventStore = useEventStore();
    this.eventId = eventStore.currentEvent.id;
    this.eventTitle = eventStore.currentEvent.title;
  },
  beforeUnmount() {
    // 페이지를 떠날 때 상태를 다시 초기화
    const eventStore = useEventStore();
    eventStore.clearCurrentEvent();
  }
}

</script>
<style>
</style>