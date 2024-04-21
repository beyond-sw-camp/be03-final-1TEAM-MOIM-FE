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

export default {
  name: "AppHeader",

  data() {
    return {
      searchClosed: true,
      searchQuery: null,
      authToken: this.getAuthToken(),
    };
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
        // 검색 이후 검색 결과 페이지로 이동함
        this.$router.push({name: "Search"});
      } catch (error) {
        console.error("Error occurred when searching events: ", error);
        searchStore.setResults([]);
      }
    },
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