<template>
  <v-dialog v-model="isDialogOpen" max-width="600">
    <v-card class="pa-4">
      <v-card-title>
        <v-icon class="mr-2">mdi-calendar-plus</v-icon>
        모임 생성
      </v-card-title>
      <v-card-text>
        <v-row dense>
          <!-- 제목 -->
          <v-col cols="12" sm="12">
            <v-text-field
              label="제목을 입력하세요"
              :rules="[(value) => !!value || '']"
              required
              v-model="title"
            >
            </v-text-field>
          </v-col>

          <!-- 참여자 추가 (Auto-complete) -->
          <v-col cols="12">
            <v-autocomplete
              v-model="friends"
              :items="people"
              color="blue-grey-lighten-2"
              item-text="email"
              item-value="email"
              label="참여자를 추가하세요"
              chips
              dense
              multiple
              closable-chips
              autocomplete="on"
              :rules="[
                (v) => !!v.length || '최소 한명의 참가자가 있어야 모임이 생성됩니다.',
              ]"
            >
              >
              <!-- 참여자 추가하세요 뜨는 부분 -->
              <template v-slot:chip="{ props, item }">
                <v-chip
                  v-bind="props"
                  :prepend-avatar="item.raw.profileImage"
                  :text="item.raw.nickname"
                ></v-chip>
              </template>

              <!-- 눌렀을때 뜨는 부분 -->
              <template v-slot:item="{ props, item }">
                <v-list-item
                  v-bind="props"
                  :prepend-avatar="item.raw.profileImage"
                  :title="item.raw.nickname"
                  :subtitle="item.raw.email"
                ></v-list-item>
              </template>

              <template v-slot:selection="{ item, index }">
                <v-chip :key="index" closable @click:close="removeFriend(item.id)">
                  {{ item.nickname }} ({{ item.email }})
                </v-chip>
              </template>
            </v-autocomplete>
          </v-col>

          <!-- 장소 -->
          <v-col cols="12" sm="12">
            <v-text-field label="장소를 입력하세요" v-model="place"> </v-text-field>
          </v-col>

          <!-- 예상 모임 시간 -->
          <v-col cols="12" md="12"><h4>예상 모임 시간</h4></v-col>
          <v-col cols="12" md="7">
            <v-text-field
              type="number"
              v-model="runningTime"
              label="예상 모임 시간"
              :rules="[(value) => !!value || '']"
              required
            >
            </v-text-field>
          </v-col>
          <v-col cols="12" md="5">
            <v-select
              v-model="runningTimeType"
              :items="runningtimeTypes"
              label="시간 단위"
            >
            </v-select>
          </v-col>

          <!-- 시작/종료 날짜 -->
          <v-col cols="12" md="3"><h4>시작일</h4></v-col>
          <v-col cols="12" md="9">
            <input
              type="date"
              v-model="expectStartDate"
              :rules="[(value) => !!value || '']"
              required
            />
          </v-col>
          <v-col cols="12" md="3"><h4>종료일</h4></v-col>
          <v-col cols="12" md="9">
            <input
              type="date"
              v-model="expectEndDate"
              :rules="[(value) => !!value || '']"
              required
            />
          </v-col>
          <!-- 시작/종료 시간 -->
          <v-col cols="12" md="3"><h4>시작 시간</h4></v-col>
          <v-col cols="12" md="9">
            <input
              type="time"
              v-model="expectStartTime"
              :rules="[(value) => !!value || '']"
              required
            />
          </v-col>
          <v-col cols="12" md="3"><h4>종료 시간</h4></v-col>
          <v-col cols="12" md="9">
            <input
              type="time"
              v-model="expectEndTime"
              :rules="[(value) => !!value || '']"
              required
            />
          </v-col>

          <!-- 투표 종료 시간 -->
          <v-col cols="12" md="3"><h4>투표 종료 시간</h4></v-col>
          <v-col cols="12" md="9">
            <input
              type="datetime-local"
              v-model="voteDeadline"
              :rules="[(value) => !!value || '']"
              required
            />
          </v-col>

          <!-- 투표 마감 전 알림 -->
          <v-col cols="12" md="12"><h4>투표 마감 전 알림</h4></v-col>
          <v-col cols="12" md="7">
            <v-text-field type="number" v-model="alertQuantity" label="알람 시간">
            </v-text-field>
          </v-col>
          <v-col cols="12" md="5">
            <v-select v-model="timeType" :items="timeTypes" label="시간 단위"> </v-select>
          </v-col>

          <!-- 메모 -->
          <v-col cols="12" md="12">
            <v-text-field label="메모를 입력하세요." v-model="contents"> </v-text-field>
          </v-col>
        </v-row>
      </v-card-text>

      <!-- 파일 -->
      <v-col cols="12" md="12">
        <v-file-input
          v-model="files"
          label="File input"
          placeholder="Upload your documents"
          prepend-icon="mdi-paperclip"
          show-size
          multiple
        >
          <template v-slot:selection="{ fileNames }">
            <template v-for="fileName in fileNames" :key="fileName">
              <v-chip class="me-2" color="primary" size="small" label>
                {{ fileName }}
              </v-chip>
            </template>
          </template>
        </v-file-input>
      </v-col>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" @click="createMoim">생성</v-btn>
        <v-btn color="blue darken-1" @click="closeDialog">취소</v-btn>
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
      isDialogOpen: false,
      title: "",
      friends: [],
      people: [],
      place: "",
      runningTime: null,
      voteDeadline: "",
      expectStartDate: "",
      expectEndDate: "",
      expectStartTime: "",
      contents: "",
      files: [],
      alertQuantity: null,
      alertType: "",
      timeType: "분",
      timeTypes: ["분", "시간", "일"],
      runningTimeType: "분",
      runningtimeTypes: ["분", "시간"],

      // closeDialog: "",
    };
  },
  mounted() {
    this.fetchPeople();
  },

  methods: {
    selectOpenDialog(selectInfo) {
      console.log("view", selectInfo.view);
      console.log("start", selectInfo.start);
      console.log("startStr", selectInfo.startStr);
      console.log("startStr", selectInfo.endStr);
      if (selectInfo.view.type == "dayGridMonth") {
        // string 타입의 날짜를 Date 객체로 변환
        let dateObject = new Date(selectInfo.endStr);
        // 1일을 빼기 위해 24시간 * 60분 * 60초 * 1000밀리초를 빼줌
        dateObject.setTime(dateObject.getTime() - 1 * 24 * 60 * 60 * 1000);
        // 변경된 날짜를 string으로 변환
        let newDateString = dateObject.toISOString().split("T")[0];
        this.startDateTime = selectInfo.startStr + "T00:00:00";
        this.endDateTime = newDateString + "T23:59:00";
      } else {
        this.startDateTime = selectInfo.startStr.split("+")[0];
        this.endDateTime = selectInfo.endStr.split("+")[0];
      }
      this.isDialogOpen = true;
    },
    openDialog() {
      this.isDialogOpen = true;
    },
    closeDialog() {
      this.isDialogOpen = false;
      // isDialogOpen = computed(() => mainStore.isDialogOpen);
    },

    async fetchPeople() {
      const authToken = localStorage.getItem("accessToken");
      const url = `${process.env.VUE_APP_API_BASE_URL}/api/members/search`;
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

        if (response.data.success && Array.isArray(response.data.data)) {
          this.people = response.data.data.map((user) => ({
            id: user.id,
            name: user.nickname,
            profileImage:
              user.profileImage ||
              "https://moim-bucket.s3.ap-northeast-2.amazonaws.com/members/default_profile.png",
            nickname: user.nickname,
            email: user.email,
          }));
          console.log("사람들 정보", this.people);
          console.log("1번 사람사람", this.people[0]);
        } else {
          console.error("사람들을 불러오는데 실패했습니다: API 에러 반환", response.data);
          this.people = [];
        }
      } catch (error) {
        console.error("사람들을 불러오는데 실패했습니다:", error);
        this.people = [];
      }
    },

    // onMounted(fetchPeople);

    removeFriend(id) {
      this.friends = this.friends.filter((p) => p.id !== id);
    },

    // async createMoim() {
    //   const formData = new FormData();
    //   formData.append("title", this.title);
    //   formData.append("memo", this.memo);
    //   formData.append("place", this.place);
    //   formData.append("startDate", this.startDate);
    //   formData.append("endDate", this.endDate);
    //   formData.append("startTime", this.startTime);
    //   formData.append("endTime", this.endTime);
    //   formData.append("people", JSON.stringify(this.friends.map((p) => p.id)));

    //   try {
    //     await axios.post("http://localhost:8080/api/events", formData, {
    //       headers: {
    //         "Content-Type": "multipart/form-data",
    //       },
    //     });
    //     this.isDialogOpen = false;
    //   } catch (error) {
    //     console.error("이벤트 생성 실패:", error);
    //   }
    // },
    async createMoim() {
      if (!this.title) {
        alert("제목을 입력하세요.");
        return;
      }
      if (!this.runningTime) {
        alert("모임 예상시간을 입력하세요.");
        return;
      }

      if (!this.expectStartDate) {
        alert("시작일을 입력하세요.");
        return;
      }
      if (!this.expectEndDate) {
        alert("종료일을 입력하세요.");
        return;
      }
      if (!this.expectStartTime) {
        alert("시작시간을 입력하세요.");
        return;
      }
      if (!this.expectEndTime) {
        alert("종료시간을 입력하세요.");
        return;
      }
      if (!this.voteDeadline) {
        alert("투표마감일을 입력하세요.");
        return;
      }

      if (new Date(this.expectStartDate) > new Date(this.expectEndDate)) {
        alert("시작일은 종료일보다 전이어야 합니다.");
        return;
      }

      // 시간 비교
      let startDateTime = new Date("1970-01-01T" + this.expectStartTime + ":00");
      let endDateTime = new Date("1970-01-01T" + this.expectEndTime + ":00");
      let durationMinutes = (endDateTime - startDateTime) / 60000; 

      if (startDateTime >= endDateTime) {
        alert("시작시간은 종료시간보다 전이어야 합니다.");
        return;
      }

      // 알림 설정 관련
      const alarmYn = this.alertQuantity ? "Y" : "N";
      let alarmType;
      if (this.timeType === "분") alarmType = "MIN";
      if (this.timeType === "시간") alarmType = "HOUR";
      if (this.timeType === "일") alarmType = "DAY";

      //러닝타임
      let runningTime;
      if (this.runningTimeType === "분") runningTime = this.runningTime
      if (this.runningTimeType === "시간") runningTime = this.runningTime * 60;
      // if (this.runningTimeType === "일") runningTime = this.runningTime * 1440;

      if (durationMinutes < runningTime) {
        alert("예상 모임 시간보다 짧은 시간을 설정하였습니다. 시간 설정을 확인해 주세요.");
        return;
      }


      const formData = new FormData();
      formData.append('title', this.title);
      formData.append('place', this.place);
      formData.append('runningTime', runningTime);
      formData.append('expectStartDate', this.expectStartDate);
      formData.append('expectEndDate', this.expectEndDate);
      formData.append('expectStartTime', this.expectStartTime);
      formData.append('expectEndTime', this.expectEndTime);
      formData.append('voteDeadline', this.voteDeadline.replace('T', ' '));
      formData.append('contents', this.contents);
      formData.append('alarmYn', alarmYn);
      console.log(this.title)
      console.log(runningTime)
      console.log(this.expectStartDate)
      console.log(this.expectStartTime)
      console.log(this.voteDeadline)

      // // groupRequest 조립
      // let groupRequest = {
      //   title: this.title,
      //   place: this.place,
      //   runningTime: runningTime,
      //   expectStartDate: this.expectStartDate,
      //   expectEndDate: this.expectEndDate,
      //   expectStartTime: this.expectStartTime,
      //   expectEndTime: this.expectEndTime,
      //   voteDeadline: this.voteDeadline,
      //   contents: this.contents,
      //   alarmYn: alarmYn,
      // };

      // Blob 객체로 변환
      // const groupRequestBlob = new Blob([JSON.stringify(groupRequest)], {
      //   type: "application/json",
      // });

      // alarmRequests 조립
      const alarmList = [];
      if (this.alertQuantity) {
        alarmList.push({
          deadlineAlarm: this.alertQuantity,
          alarmTimeType: alarmType,
        });
      }
      const alarmBlob = new Blob([JSON.stringify(alarmList)], {
        type: "application/json",
      });

      //groupInfoRequests 조립
      const groupInfoList = this.friends.map((friend) => ({ memberEmail: friend }));
      console.log(groupInfoList)
      const groupInfoBlob = new Blob([JSON.stringify(groupInfoList)], {
        type: "application/json",
      });
      console.log("??", this.friends[0])
      console.log("추가된 참가자", groupInfoList);

      // formData.append("groupRequest", groupRequestBlob);
      formData.append("groupInfoRequests", groupInfoBlob);
      formData.append("groupAlarmRequests", alarmBlob);

      
      if (this.files.length > 0) {
        this.files.forEach(file => {
          formData.append("files", file);
        });
      }

      console.log(formData)

      // const TOKEN = localStorage.getItem("accessToken");
      const authToken = localStorage.getItem("accessToken");
      const url = `${process.env.VUE_APP_API_BASE_URL}/api/groups/create`;

      if (!authToken) {
        console.error("인증 토큰이 없습니다.");
        return;
      }

      try {
        await axiosInstance.post(url, formData, {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "multipart/form-data",
          },
        });
        console.log("모임 등록완료");

        this.closeDialog();
        window.location.reload();
        Swal.fire({
            title: '모임이 등록되었습니다.',
            icon: 'success'
          })
        
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>
