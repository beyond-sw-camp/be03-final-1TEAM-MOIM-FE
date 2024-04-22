<template>
  <v-app-bar
      color="teal-darken-4"
      image="https://picsum.photos/seed/picsum/1920/1080"
  >
    <template v-slot:prepend>
      <v-app-bar-nav-icon></v-app-bar-nav-icon>
    </template>

    <v-app-bar-title>MOIM</v-app-bar-title>

    <v-spacer></v-spacer>
    

    <v-menu>
      <template v-slot:activator="{ props }">
        <v-btn icon v-bind="props" @click="getNotification">
          <v-badge color="red" :content="newNotification">
            <v-icon>mdi-bell-outline</v-icon>
          </v-badge>
        </v-btn>
      </template>

      <v-list style="max-height: 300px; overflow-y: auto;">
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :value="i"
        >
          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
            <v-list-item-subtitle>{{ item.subtitle }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-menu>

    <!-- <v-menu offset-y v-model="menu">
      <template #activator="{ on, attrs }">
        <v-btn icon v-bind="attrs" v-on="on">
          <v-icon>mdi-bell-outline</v-icon>
        </v-btn>
      </template>
  
      <v-list>
        <v-list-item v-for="(item, index) in notifications" :key="index">
          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
            <v-list-item-subtitle>{{ item.subtitle }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-menu> -->

    <v-text-field
        @focus="searchClosed=false"
        @blur="searchClosed=true"
        v-model="searchQuery"
        placeholder="일정 검색"
        prepend-inner-icon="mdi-magnify"
        class="expanding-search mt-6"
        :class="{ 'closed': searchClosed && !searchQuery }"
        filled
        dense
        clearable
        @keydown.enter="searchEvents"
        @click:append="searchEvents"
    ></v-text-field>

    <v-btn icon>
      <v-icon>mdi-dots-vertical</v-icon>
    </v-btn>
  </v-app-bar>
</template>

<script>
import axios from "axios";
import { useSearchStore } from '@/stores/searchStore'
import { EventSourcePolyfill } from 'event-source-polyfill';

export default {
  name: "AppHeader",

  data() {
    return {
      searchClosed: true,
      searchQuery: null,
      authToken: this.getAuthToken(),
      items: [],
      newNotification : 0,
    };
  },
  created() {
    if(localStorage.getItem('accessToken') != null){
      const token = localStorage.getItem('accessToken');
      var sse = new EventSourcePolyfill('http://localhost:8080/connect', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      sse.addEventListener('connect', (e) => {
        const { data: receivedConnectData } = e;
        console.log('connect event data: ',receivedConnectData); 
      });
      sse.addEventListener('sendEventAlarm', e => { 
        const obj = JSON.parse(e.data);
        this.newNotification = this.newNotification + 1;
        // let timeAgo = this.calculateTimeAgo(obj.sendTime)
        // this.items.push({
        //   title: obj.message,
        //   subtitle: timeAgo
        // }) 
        console.log(obj)
        console.log(this.items[0].message); 
      });
    }
  },
  methods: {
    getAuthToken() {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        alert("로그인 후 이용해 주세요");
        this.$router.push({name: "login"});
        return "";
      }
      return token;
    },

    async searchEvents() {
      // 토큰 관련 에러 처리
      if (!this.authToken) {
        console.error("Authentication token is missing");
        return;
      }
      // 검색어를 입력하지 않은 경우
      if (!this.searchQuery) return;

      const headers = {
        Authorization: `Bearer ${this.authToken}`
      };
      const url = `${process.env.VUE_APP_API_BASE_URL}/api/events/search/${this.searchQuery}`;
      const searchStore = useSearchStore();

      try {
        const response = await axios.get(url, {headers});
        console.log("!!!" + response.data.success);
        console.log("!!!" + response.data.data);
        if (response.data.success && response.data.data) {
          searchStore.setResults(response.data.data)
        } else {
          searchStore.setResults([]);
        }
      } catch (error) {
        console.error("Error occurred when searching events: ", error);
        searchStore.setResults([]);
      }
      // 검색 이후 항상 검색 결과 페이지로 이동함
      this.$router.push({name: "Search"});
    },
    async getNotification() {
      try {
        const token = localStorage.getItem("accessToken");
        const headers = { Authorization: `Bearer ${token}` };
        console.log(token)
        if (token == null) {
          alert("로그인이 필요합니다.");
          this.$router.push({ name: "Login" });
          return;
        }
        const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/api/notification`, { headers });
        const getNotifications = response.data.data;
        console.log(getNotifications);
        const notifications = [];
        let timeAgo;
        getNotifications.forEach(noti => {
          timeAgo = this.calculateTimeAgo(noti.sendTime),
          notifications.push({
              title: noti.message,
              subtitle: timeAgo
          });
        });
        this.items = notifications;
      } catch (error) {
        if(error.response.data.error.type == 'NotificationNotFoundException') {
          this.items = [{title: '알림이 없습니다.'}];
        }
        console.log(error);
      }
    },
    calculateTimeAgo(timestamp) {
      const currentTime = new Date(); // 현재 시간
      const givenTime = new Date(timestamp); // 주어진 시간 데이터

      const timeDiff = currentTime - givenTime; // 현재 시간과 주어진 시간의 차이 (밀리초 단위)

       // 밀리초를 분으로 변환
      const minutes = Math.floor((timeDiff / 1000) / 60);

      if (minutes < 1) {
        return "방금";
      } else if (minutes < 60) {
        return minutes + "분 전";
      } else {
        const hours = Math.floor(minutes / 60);
        if (hours < 24) {
          return hours + "시간 전";
        } else {
          const days = Math.floor(hours / 24);
          return days + "일 전";
        }
      }
    }
  },
};
</script>

<style lang="sass">
.v-app-bar
  color: #162A2C
  .v-icon, .v-text-field, .v-app-bar-title
    color: #162A2C !important
.v-input.expanding-search
  transition: 0.3s
  max-width: 20%
  .v-input__slot
    cursor: pointer !important
    &:before, &:after
      border-color: transparent !important
  &.closed
    max-width: 45px
    .v-input__slot
      background: transparent !important
</style>