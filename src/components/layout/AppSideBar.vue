<template>
  <v-navigation-drawer permanent>
    <v-list>
      <v-list-item
        :prepend-avatar="profileImage"
        :subtitle="email"
        :title="nickname"
      ></v-list-item>
    </v-list>

    <v-divider></v-divider>

    <v-list density="compact" nav>
      <v-list-item
        prepend-icon="mdi-widgets"
        title="일정 생성"
        value="createEvent"
        @click="createEventClicked"
      ></v-list-item>
      <EventDialog ref="EventCreate"></EventDialog>
      <v-list-item prepend-icon="mdi-widgets" title="모임 생성" value="createMoim" @click="createMoimClicked"></v-list-item>
      <MoimDialog ref="MoimCreate"></MoimDialog>
      <v-list-item prepend-icon="mdi-trello" title="Eisenhower Matrix" @click="goToEisenhowerMatrix"></v-list-item>
      <v-list-item prepend-icon="mdi-calendar" title="FullCalendar 테스트" @click="goTo('fullCalendarComponent')"></v-list-item>
      <v-list-item prepend-icon="mdi-view-dashboard" title="모임 리스트" @click="goToMoimList"></v-list-item>
    </v-list>
  </v-navigation-drawer>

  <v-main style="height: 250px"></v-main>
</template>

<script>
import EventDialog from '@/pages/event/EventDialog.vue';
import MoimDialog from '@/pages/moim/MoimDialog.vue';


// import {useMainStore} from "@/stores";
import axiosInstance from "@/axios";

export default {
  name: "AppSidebar",
  // setup() {
  //   const mainStore = useMainStore();
  //   return {
  //     mainStore
  //   }
  // },
  components: {
    EventDialog,
    MoimDialog

  },
  data() {
    return {
      profileImage: "",
      email: "",
      nickname: "",
    };
  },

  mounted() {
    this.fetchUserData();
  },
  methods: {
    async fetchUserData() {
      const authToken = localStorage.getItem("accessToken");
      const url = `${process.env.VUE_APP_API_BASE_URL}/api/members`;
      if (!authToken) {
        console.error("인증 토큰이 없습니다.");
        return;
      }
      try {
        const response = await axiosInstance.get(url, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        if (response.data.success && response.data.status === "OK") {
          const userData = response.data.data;
          this.profileImage = userData.profileImage;
          this.email = userData.email;
          this.nickname = userData.nickname;
          console.log("profileImage ", this.profileImage);
        } else {
          console.error("Failed to fetch user data");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    },

    createEventClicked() {
      console.log("일정 생성 클릭");
      this.$refs.EventCreate.openDialog();
    },
    createMoimClicked() {
      console.log("모임 생성 클릭");
      this.$refs.MoimCreate.openDialog();
    },
    goTo(route) {
      this.$router.push({ name: route });
    },
    goToEisenhowerMatrix() {
      this.$router.push({ path: '/EisenhowerMatrix' });
    },

    goToMoimList() {
      this.$router.push({ path: '/MoimList' });
    },
    

  }
}
</script>

