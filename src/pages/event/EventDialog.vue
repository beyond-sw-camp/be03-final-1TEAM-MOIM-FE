<template>
  <v-dialog v-model="isDialogOpen" max-width="600" :persistent="true">
    <v-card class="pa-4">
      <v-card-title>
        <v-icon class="mr-2">mdi-calendar-plus</v-icon>
        일정 생성
      </v-card-title>
      <v-card-text>
        <v-row dense>
          <v-col cols="12" sm="2"><h4>제목</h4></v-col>
          <v-col cols="12" sm="10">
            <v-text-field
              label="제목을 입력하세요"
              :rules="[(value) => !!value || '']"
              required
              v-model="title"
            >
            </v-text-field>
          </v-col>
          <v-col cols="12" md="2"><h4>시작일</h4></v-col>
          <v-col cols="12" md="10">
            <input type="datetime-local" v-model="startDateTime" />
          </v-col>
          <v-col cols="12" md="2"><h4>종료일</h4></v-col>
          <v-col cols="12" md="10">
            <input type="datetime-local" v-model="endDateTime" />
          </v-col>
          <v-col cols="12" sm="2"><h4>장소</h4></v-col>
          <v-col cols="12" sm="10">
            <v-text-field
              label="장소를 입력하세요"
              :rules="[(value) => !!value || '']"
              required
              v-model="place"
            >
            </v-text-field>
          </v-col>
          <v-col cols="12" sm="2"><h4>메모</h4></v-col>
          <v-col cols="12" md="10">
            <v-textarea auto-grow label="메모를 입력하세요." v-model="memo">
            </v-textarea>
          </v-col>
          <v-col cols="12" md="2"><h4>할 일</h4></v-col>
          <v-col cols="12" sm="10">
            <v-row dense v-for="(todo, index) in todos" :key="index">
              <v-col cols="2" sm="1">
                <v-checkbox v-model="todo.done"> </v-checkbox>
              </v-col>
              <v-col cols="9" sm="9">
                <v-text-field
                  variant="underlined"
                  label="내용"
                  v-model="todo.text"
                  :rules="[rules.required]"
                >
                </v-text-field>
              </v-col>
              <v-col cols="12" sm="1">
                <v-btn flat @click="removeTodo(index)">삭제</v-btn>
              </v-col>
            </v-row>
            <v-btn flat @click="addTodo">할 일 추가</v-btn>
          </v-col>
          <v-col cols="12" md="2"><h4>중요도</h4></v-col>
          <v-col cols="12" sm="10">
            <v-container>
              <v-radio-group
                v-model="radios"
                :rules="[
                  (value) => !!value || '4가지 선택지 중 하나를 선택해주세요',
                ]"
                required
              >
                <v-radio value="Q1">
                  <template v-slot:label>
                    <div>중요 & 긴급하지 않음</div>
                  </template>
                </v-radio>
                <v-radio value="Q2">
                  <template v-slot:label>
                    <div>중요 & 긴급</div>
                  </template>
                </v-radio>
                <v-radio value="Q3">
                  <template v-slot:label>
                    <div>중요하지 않음 & 긴급</div>
                  </template>
                </v-radio>
                <v-radio value="Q4">
                  <template v-slot:label>
                    <div>중요하지 않음 & 긴급하지 않음</div>
                  </template>
                </v-radio>
              </v-radio-group>
            </v-container>
          </v-col>
          <v-col cols="12" md="2"><h4>알림</h4></v-col>
          <v-col cols="12" md="5">
            <v-text-field
              type="number"
              v-model="alertQuantity"
              label="알람 시간"
            >
            </v-text-field>
          </v-col>
          <v-col cols="12" md="5">
            <v-select v-model="timeType" :items="timeTypes" label="시간 단위">
            </v-select>
          </v-col>
          <v-col cols="12" md="2"><h4>반복</h4></v-col>
          <v-col cols="12" md="5">
            <v-select
              v-model="repeatType"
              :items="repeatTypes"
              label="반복 단위"
            >
            </v-select>
          </v-col>
          <v-col cols="12" md="2"><h4>반복종료</h4></v-col>
          <v-col cols="12" md="3">
            <input type="date" v-model="repeatEndDate" />
          </v-col>
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
        </v-row>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" @click="createEvent">생성</v-btn>
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
      memo: "",
      place: "",
      radios: "Q1",
      startDateTime: null,
      endDateTime: null,
      alertQuantity: null,
      timeType: "",
      timeTypes: ["분", "시간", "일"],
      repeatEndDate: null,
      repeatType: null,
      repeatTypes: ["매년", "매월", "매주", "매일"],
      todos: [],
      rules: {
        required: (value) => !!value || "내용을 입력해주세요.",
      },
      files: [],
    };
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
      this.title = "";
      this.memo = "";
      this.place = "";
      this.timeType = "";
      this.alertQuantity = null;
      this.todos = [];
      this.files = [];
      this.repeatEndDate = null;
      this.repeatType = null;
      this.isDialogOpen = false;
    },
    addTodo() {
      this.todos.push({ text: "", done: false });
    },
    removeTodo(index) {
      this.todos.splice(index, 1);
    },
    async createEvent() {
      if (!this.title) {
        alert("제목을 입력하세요.");
        return;
      }

      if (!this.startDateTime) {
        alert("시작일을 입력하세요.");
        return;
      }

      if (!this.endDateTime) {
        alert("종료일을 입력하세요.");
        return;
      }

      // 알림 설정 관련
      const alarmYn = this.alertQuantity ? "Y" : "N";
      let alarmType;
      if (this.timeType === "분") alarmType = "M";
      if (this.timeType === "시간") alarmType = "H";
      if (this.timeType === "일") alarmType = "D";

      // eventRequest 조립
      let eventRequest = {
        title: this.title,
        memo: this.memo,
        startDate: this.startDateTime,
        endDate: this.endDateTime,
        place: this.place,
        matrix: this.radios,
        alarmYn: alarmYn,
      };
      const eventBlob = new Blob([JSON.stringify(eventRequest)], {
        type: "application/json",
      });

      // alarmRequests 조립
      const alarmList = [];
      if (this.alertQuantity) {
        alarmList.push({
          setTime: this.alertQuantity,
          alarmType: alarmType,
        });
      }
      const alarmBlob = new Blob([JSON.stringify(alarmList)], {
        type: "application/json",
      });

      const formData = new FormData();
      formData.append("eventRequest", eventBlob);
      formData.append("alarmRequests", alarmBlob);

      // repeatRequest 조립
      if (this.repeatType != null) {
        let repeatType;
        if (this.repeatType === "매년") repeatType = "Y";
        if (this.repeatType === "매월") repeatType = "M";
        if (this.repeatType === "매주") repeatType = "W";
        if (this.repeatType === "매일") repeatType = "D";
        let repeatRequest = {
          repeatType: repeatType,
          repeatEndDate: this.repeatEndDate,
        };
        const repeatBlob = new Blob([JSON.stringify(repeatRequest)], {
          type: "application/json",
        });
        formData.append("repeatRequest", repeatBlob);
      }

      // toDoListRequests 조립
      const toDoList = [];
      if (this.todos.length > 0) {
        for (const todo of this.todos) {
          let isChecked = todo.done ? "Y" : "N";

          if (!todo.text) {
            alert("내용을 입력하세요.");
            return;
          }

          toDoList.push({
            contents: todo.text,
            isChecked: isChecked,
          });
        }
        const toDoBlob = new Blob([JSON.stringify(toDoList)], {
          type: "application/json",
        });
        formData.append("toDoListRequests", toDoBlob);
      }

      if (this.files && this.files.length > 0) {
        // 우선 단일 파일만 전송할 수 있도록 설정
        formData.append("file", this.files[0]);
      }

      try {
        const response = axiosInstance.post("/api/events", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        console.log(response);
        this.closeDialog();
        Swal.fire({
            title: '일정이 생성되었습니다.',
            icon: 'success'
          })
           window.location.reload();
        // this.$router.push({ name: "fullCalendarComponent" });
      } catch (error) {
        console.error(error);
      }
      // const TOKEN = localStorage.getItem("accessToken");
      // const url = `${process.env.VUE_APP_API_BASE_URL}/api/events`;

      // try {
      //   await axios.post(url, formData, {
      //     headers: {
      //       Authorization: `Bearer ${TOKEN}`,
      //       "Content-Type": "multipart/form-data",
      //     },
      //   });
      //   console.log("등록완료");

      //   this.closeDialog();
      //   window.alert(this.title + " 일정이 생성되었습니다.");
      //   window.location.reload();
      // } catch (error) {
      //   console.log(error);
      // }
    },
  },
};
</script>
