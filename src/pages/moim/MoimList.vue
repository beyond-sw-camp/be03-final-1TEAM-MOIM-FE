<template>
  <v-container fluid class="search-results">
    <v-row>
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
      <v-col cols="12" md="8">
        <v-card class="pa-4">
          <div v-if="selectedMoim">
            <v-card-title
              class="text-h5"
              style="width: 100%; display: flex; align-items: center"
            >
              <div
                class="title-text"
                style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap"
              >
                {{ selectedMoim.title }}
              </div>
              <v-spacer></v-spacer>
              <v-btn
                class="no-shadow"
                density="comfortable"
                icon="mdi-close"
                @click="dialog = false"
              ></v-btn>
            </v-card-title>

            <v-card-text class="mt-5">
              <v-row>
                <v-col cols="12" md="2"><h4>호스트</h4></v-col>
                <v-col cols="12" md="10">
                  <input type="text" :value="selectedMoim.hostNickname" readonly />
                </v-col>
                <v-col cols="12" md="2"><h4>참여자 투표현황</h4></v-col>
                <v-col cols="12" md="10">
                  <div
                    v-for="guest in selectedMoim.guestEmailNicknameIsAgreed"
                    :key="guest[0]"
                    class="participant-info"
                  >
                    {{ guest[1] }} <span v-html="getAgreementIcon(guest[2])"></span>
                  </div>
                </v-col>
                <v-col cols="12" md="2"><h4>시작일</h4></v-col>
                <v-col cols="12" md="10">
                  <input type="text" :value="selectedMoim.expectStartDate" readonly />
                </v-col>
                <v-col cols="12" md="2"><h4>종료일</h4></v-col>
                <v-col cols="12" md="10">
                  <input type="text" :value="selectedMoim.expectEndDate" readonly />
                </v-col>
                <v-col cols="12" md="2"><h4>필요 시간</h4></v-col>
                <v-col cols="12" md="10">
                  <input type="text" :value="selectedMoim.runningTime + ' 분'" readonly />
                </v-col>
                <v-col cols="12" md="2"><h4>장소</h4></v-col>
                <v-col cols="12" md="10">
                  <input type="text" :value="selectedMoim.place" readonly />
                </v-col>
                <v-col cols="12" md="2"><h4>투표 마감일</h4></v-col>
                <v-col cols="12" md="10">
                  <input
                    type="datetime-local"
                    :value="selectedMoim.voteDeadline"
                    readonly
                  />
                </v-col>
                <v-col cols="12" md="2"><h4>메모</h4></v-col>
                <v-col cols="12" md="10">
                  <v-textarea
                    :value="selectedMoim.contents"
                    readonly
                    auto-grow
                  ></v-textarea>
                </v-col>
                <!-- 파일 다운로드 -->
                <v-col cols="12" md="12" v-if="selectedMoim.filePath">
                  <v-row>
                    <v-col cols="12" md="2"><h4>파일</h4></v-col>
                    <v-col cols="12" md="10">
                      <v-btn :href="selectedMoim.filePath" target="_blank" download
                        >파일 다운로드</v-btn
                      >
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </v-card-text>

            <v-card-text v-if="getStatus(selectedMoim) === 'new'">
              <v-spacer />
              <v-btn color="#3085d6" text @click="vote('Y')">수락</v-btn>
              <v-btn color="#d33" text @click="vote('N')">거부</v-btn>
            </v-card-text>
          </div>

          <!-- 아무것도 클릭 안했을 시 -->
          <div v-else>
            <p>모임을 클릭하세요.</p>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axiosInstance from "@/axios";
import Swal from "sweetalert2";

export default {
  data() {
    return {
      moims: [],
      userEmail: "",
      selectedMoim: null,
    };
  },
  created() {
    this.fetchMoims();
    this.getUserData();
  },
  methods: {
    onMoimClick(moim) {
      // alert(`Moim with ID ${moim.id} clicked`);
      this.selectedMoim = moim;
      console.log("Selected moim's file URL:", this.selectedMoim.filePath);
      console.log("Selected moim's Group ID:", this.selectedMoim.id);
      console.log("Selected moim's Group Info ID:", this.selectedMoim.guestEmailNicknameIsAgreed[2]);
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
    async getUserData() {
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
        } else {
          console.error("Failed to fetch user data");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    },

    getStatus(moim) {
      if (moim.hostEmail === this.userEmail) {
        return moim.isConfirmed === "N" ? "대기" : "확정";
      } else {
        // 호스트가 아닌 모임일때
        const guest = moim.guestEmailNicknameIsAgreed.find(
          (g) => g[0] === this.userEmail
        );
        if (moim.isConfirmed === "N") {
          if (guest && guest[2] === "P") {
            return "new";
          } else {
            return "대기";
          }
        } else {
          return "확정";
        }
      }
    },
    getAgreementIcon(status) {
      if (status === "Y") {
        return '<i class="fa-regular fa-square-check" style="color: #3085d6;"></i>';
      } else if (status === "N") {
        return '<i class="fa-regular fa-square-check" style="color: #d33;"></i>';
      } else if (status === "P") {
        return '<i class="fa-regular fa-square" style="color: #000000;"></i>';
      }
    },
    async vote(agreeYn) {
      const token = localStorage.getItem("accessToken");
      const headers = { Authorization: `Bearer ${token}` };
      if (!this.selectedMoim || !this.selectedMoim.id ) {
      console.error("모임 정보가 선택되지 않았거나 필요한 정보가 누락되었습니다.");
      return;
    }
    const groupId = this.selectedMoim.id;

    const guest = this.selectedMoim.guestEmailNicknameIsAgreed.find(g => g[0] === this.userEmail);
    if (!guest) {
      console.error("사용자의 참가 정보를 찾을 수 없습니다.");
      return;
    }
    const groupInfoId = guest[3];
      try {
        const response = await axiosInstance.post(
          `${process.env.VUE_APP_API_BASE_URL}/api/groups/${groupId}/groupInfo/${groupInfoId}/notification?agreeYn=${agreeYn}`,
          { headers }
        );
        
        this.dialog = false;
        if (response.data.data.isAgree == "Y") {
          Swal.fire({
            title: "참여 완료되었습니다.",
            icon: "success",
          });
        }
        if (response.data.data.isAgree == "N") {
          Swal.fire({
            title: "참여 거부하였습니다.",
            icon: "error",
          });
        }
      } catch (e) {
        alert(e);
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
.participant-info {
  display: flex;
  align-items: center; /* 텍스트와 아이콘의 높이를 중앙으로 맞춤 */
  margin-bottom: 10px; /* 각 참여자 정보 사이의 간격 */
}

.participant-info span {
  margin-left: 8px; /* 아이콘과 텍스트 사이의 간격 */
}


</style>
``
