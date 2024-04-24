<template>
  <v-dialog v-model="dialog" max-width="600">
    <v-card class="pa-4">
      <v-card-title class="text-h5" style="width: 100%; display: flex; align-items: center;">
        <v-icon class="mr-2" style="font-size: 40px;">mdi-account-multiple-plus</v-icon>
        <!-- <div v-if="notificationType"
            class="title-text"
            style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;"
        >{{title}}
        </div> -->
        <div
            class="title-text"
            style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;"
        >"{{ hostNickname }}" 님이 "{{title}}" 참여를 요청했습니다.
        </div>
        <v-spacer></v-spacer>
        <v-btn class="no-shadow" density="comfortable" icon="mdi-close" @click="dialog = false"></v-btn>
      </v-card-title>
      <v-card-text class="mt-5">
        <v-row>
          <v-col cols="12" md="2"><h4>시작일</h4></v-col>
          <v-col cols="12" md="10">
            <input type="datetime-local" :value="startDate" readonly>
          </v-col>
          <v-col cols="12" md="2"><h4>종료일</h4></v-col>
          <v-col cols="12" md="10">
            <input type="datetime-local" :value="endDate" readonly>
          </v-col>
          <!-- 필요 시간 조회 -->
          <v-col cols="12" md="2" v-if="runningTime">
            <v-icon class="mr-2">mdi-clock-time-eight-outline</v-icon>
          </v-col>
          <v-col cols="12" md="10" v-if="runningTime">
            <input type="text" :value="runningTime" readonly>
          </v-col>
          <!-- 장소 조회 -->
          <v-col cols="12" md="2" v-if="place">
            <v-icon class="mr-2">mdi-map-marker</v-icon>
          </v-col>
          <v-col cols="12" md="10" v-if="place">
            <input type="text" :value="place" readonly>
          </v-col>
          <!-- 참여자 조회-->
          <v-col cols="12" md="2" v-if="members">
            <v-icon class="mr-2">mdi-account-multiple</v-icon>
          </v-col>
          <v-col cols="12" md="10" v-if="members">
              <v-chip
                v-for="(member, index) in members"
                :key="index"
                :prepend-avatar="profileImage"
                :text="member"
              ></v-chip>
          </v-col>
          <!-- 내용 조회 -->
          <v-col cols="12" md="2" v-if="contents">
            <v-icon class="mr-2">mdi-format-align-left</v-icon>
          </v-col>
          <v-col cols="12" md="10" v-if="contents">
            <v-textarea :value="contents" variant="solo-filled" readonly auto-grow></v-textarea>
          </v-col>
          <!-- 파일 다운로드 -->
          <v-col cols="12" md="2" v-if="fileUrl">
            <v-icon class="mr-2">mdi-file-multiple-outline</v-icon>
          </v-col>
          <v-col cols="12" md="10" v-if="fileUrl">
            <v-btn :href="fileUrl" target="_blank" download>파일 다운로드</v-btn>
          </v-col>
          <v-col cols="12" md="2"><h4>마감일</h4></v-col>
          <v-col cols="12" md="10">
            <input type="datetime-local" :value="voteDeadline" readonly>
          </v-col>
           <!-- 추천일정 선택 -->
           <!-- <v-col cols="12" md="2"><h4>추천 일정</h4></v-col>
           <v-col cols="12" md="10">
             <v-container>
               <v-radio-group
                 v-model="choiceEvent"
                 :rules="[
                   (value) => !!value || '3가지 선택지 중 하나를 선택해주세요',
                 ]"
                 required
               >
                 <v-radio value="1">
                   <template v-slot:label>
                     <div>중요 & 긴급하지 않음</div>
                   </template>
                 </v-radio>
               </v-radio-group>
             </v-container>
           </v-col>  -->

        </v-row>
      </v-card-text>
      <!-- <v-card-actions v-if="notificationType">
        <v-spacer/>
        <v-btn color="#3085d6" text @click="confirm('Y')">확정</v-btn>
        <v-btn color="#d33" text @click="confirm('N')">취소</v-btn>
      </v-card-actions> -->
      <v-card-actions>
        <v-spacer/>
        <v-btn color="#3085d6" text @click="vote('Y')">수락</v-btn>
        <v-btn color="#d33" text @click="vote('N')">거부</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import axiosInstance from "@/axios";
import Swal from 'sweetalert2'

export default {
  data() {
    return {
      dialog: false,
      notificationType: '',
      hostNickname: '',
      groupId: "",
      groupInfoId: "",
      title: '',
      startDate: '',
      endDate: '',
      runningTime: null,
      members: [],
      place: '',
      voteDeadline: '',
      contents: '',
      fileUrl: '',
      choiceEvent: '',
    };
  },
  methods: {
    openDialog(groupId, hostNickname) {
      this.hostNickname = hostNickname;
      this.groupId = groupId;
      this.dialog = true;
      this.getMoimInfo(groupId);
    },
    choiceDialog(groupId, message, notificationType) {
      this.title = message;
      this.groupId = groupId;
      this.notificationType = notificationType;
      this.dialog = true;
      this.getMoimInfo(groupId);
      this.getavailable(groupId);
    },
    async getMoimInfo(groupId) {
      try {
        const token = localStorage.getItem("accessToken");
        if (token == null) {
          alert("로그인이 필요합니다.");
          this.$router.push({name: "Login"});
          return;
        }
        const headers = {Authorization: `Bearer ${token}`};
        const response = await axiosInstance.get(`${process.env.VUE_APP_API_BASE_URL}/api/groups/pending/${groupId}`, {headers});
        const groupInfo = response.data.data;
        console.log("그룹 정보", groupInfo)
        this.title = groupInfo.title
        this.startDate = `${groupInfo.expectStartDate} ${groupInfo.expectStartTime}`
        this.endDate = `${groupInfo.expectEndDate} ${groupInfo.expectEndTime}`
        this.runningTime = this.convertMinutes(groupInfo.runningTime)
        this.groupInfoId = groupInfo.groupInfos[0].id
        console.log("getMoimInfo의 id", this.groupInfoId)
        const members = [];
        members.push(this.hostNickname)
        groupInfo.groupInfos.forEach(member => {
          members.push(member.nickname);
        });
        console.log(members)
        this.members = members;
        console.log("this.members", this.members)
        this.place = groupInfo.place
        this.voteDeadline = groupInfo.voteDeadline
        this.contents = groupInfo.contents

      } catch (error) {
        console.log(error);
      }
    },
    async getavailable(groupId) {
      try {
        const token = localStorage.getItem("accessToken");
        if (token == null) {
          alert("로그인이 필요합니다.");
          this.$router.push({name: "Login"});
          return;
        }
        const headers = {Authorization: `Bearer ${token}`};
        const response = await axiosInstance.get(`${process.env.VUE_APP_API_BASE_URL}/api/groups/${groupId}/choice`, {headers});
        const availableDays = response.data.data;
        console.log("추천 일정 리스트", availableDays)
        
      } catch (error) {
        console.log(error);
      }
    },
    convertMinutes(minutes) {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      
      if (minutes >= 60) {
        return `${hours}시간 ${remainingMinutes}분`;
      } else {
        return `${remainingMinutes}분`;
      }
    },
    async vote(agreeYn) {
      const token = localStorage.getItem("accessToken");
      const headers = {Authorization: `Bearer ${token}`};
      try {
        const response = await axiosInstance.post(`${process.env.VUE_APP_API_BASE_URL}/api/groups/${this.groupId}/groupInfo/${this.groupInfoId}/notification?agreeYn=${agreeYn}`, {headers});
        console.log("vote 정보 ", this.groupId, this.groupInfoId)
        console.log("답", response.data.data)
        this.dialog = false;
        if(response.data.data.isAgree == "Y") {
          Swal.fire({
            title: '참여 완료되었습니다.',
            icon: 'success'
          })
        }
        if(response.data.data.isAgree == "N") {
          Swal.fire({
            title: '참여 거부하였습니다.',
            icon: 'error'
          })
        }
      }catch(e){
        alert(e)
      }
      
    },
    async confirm(confirmYn) {
      console.log(confirmYn)
      // const token = localStorage.getItem("accessToken");
      // const headers = {Authorization: `Bearer ${token}`};
      // try {
        // const response = await axiosInstance.post(`${process.env.VUE_APP_API_BASE_URL}/api/groups/${this.groupId}/groupInfo/${this.groupInfoId}/notification?agreeYn=${agreeYn}`, {headers});
        // console.log("vote 정보 ", this.groupId, this.groupInfoId)
        // console.log("답", response.data.data)
        // this.dialog = false;
        // if(response.data.data.isAgree == "Y") {
        //   Swal.fire({
        //     title: '참여 완료되었습니다.',
        //     icon: 'success'
        //   })
        // }
        // if(response.data.data.isAgree == "N") {
        //   Swal.fire({
        //     title: '참여 거부하였습니다.',
        //     icon: 'error'
        //   })
        // }
      // }catch(e){
      //   alert(e)
      // }
      
    }
  }
};
</script>

<style>
.no-shadow {
  box-shadow: none !important;
}
</style>