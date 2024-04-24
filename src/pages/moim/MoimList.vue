<template>
  <v-row>
    <v-container fluid class="search-results">
      <v-col cols="12" md="4">
        <v-row v-if="moims.length > 0">
          <v-col cols="12" v-for="moim in moims" :key="moim.id">
            <v-card
              class="mx-auto result-card"
              :title="moim.title"
              :subtitle="moim.hostNickname"
              max-width="800"
              @click="onMoimClick(moim)"
              link
            >
              <template v-slot:prepend>
                <v-btn class="circle-button">
                  {{ getStatus(moim) }}
                </v-btn>
              </template>
              <template v-slot:append>
                <v-list lines="one" class="result-card-time">
                  <v-list-item title="마감시간" :subtitle="moim.voteDeadline" />
                  <v-list-item title="확정시간" :subtitle="moim.confirmedDate" />
                </v-list>
              </template>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
      <!-- 모임 상세 페이지 -->
      <v-col cols="12" md="4"> </v-col>
    </v-container>
  </v-row>
</template>

<script>
import axiosInstance from "@/axios";

export default {
  data() {
    return {
      moims: [],
      userEmail: "",
      gusetEmail: "",
      status: "",
    };
  },
  created() {
    this.fetchMoims();
    this.getUserData();
  },
  methods: {
    //모임 상세페이지
    onMoimClick(moim) {
      alert(`Moim with ID ${moim.id} clicked`);
    },

    async fetchMoims() {
      const authToken = localStorage.getItem("accessToken");
      const url = `${process.env.VUE_APP_API_BASE_URL}/api/groups/groups`;
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
          this.moims = response.data.data;
        }
      } catch (error) {
        console.error("Error fetching moims:", error);
        this.moims = [];
      }


    },
    async getUserData(){
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
          this.userEmail = response.data.data.email;
          console.log("사용자 이메일", response.data.data.email);

        } else {
          console.error("Failed to fetch user data");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    },

    getStatus(moim) {
      if (moim.hostEmail === this.userEmail) {
        return moim.isConfirmed === 'N' ? '대기' : '확정';
      }else{
        // 호스트가 아닌 모임일때
        const guest = moim.guestEmailNicknameIsAgreed.find(g => g[0] === this.userEmail);
        if (moim.isConfirmed === 'N') {
          if (guest && guest[2] === 'P') {
            return 'new';
          } else {
            return '대기';
          }
        }else{
          return '확정'
        }
      }
    },

  },
};
</script>

<style>
.search-results {
  margin-top: -250px;
}
.circle-button {
  border-radius: 50%;
  min-width: 50px;
  min-height: 50px;
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.25);
  background-color: #e0bb76;
  color: #162a2c;
  margin-right: 20px;
  margin-left: 10px;
}

.result-card {
  background-color: #fefcf6;
}

.result-card-time {
  background-color: #fefcf6;
}
</style>
``
