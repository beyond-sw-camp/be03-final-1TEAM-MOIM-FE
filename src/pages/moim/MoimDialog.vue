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
          <v-col cols="12" md="3"><h4>참여자</h4></v-col>
          <v-col cols="12">
            <v-autocomplete
              v-model="people"
              :items="people"
              color="blue-grey-lighten-2"
              item-text="nickname"
              item-value="id"
              label="참여자를 추가하세요"
              chips
              dense
              multiple
              :rules="[
                (v) => !!v.length || '최소 한명의 참가자가 있어야 모임이 생성됩니다.',
              ]"
            >
              >
              
              <template v-slot:chip="{ props, item }">
                <v-chip
                  v-bind="props"
                  :prepend-avatar="item.profileImage"
                  :text="item.nickname"
                ></v-chip>
              </template>

              <!-- <template v-slot:item="{ props, item }">
                <v-list-item
                  v-bind="props"
                  :prepend-avatar="item.profileImage"
                  :title="item.nickname"  
                  :subtitle="item.email" 
                ></v-list-item>
              </template> -->


              <template v-slot:selection="{ item, index }">
                <v-chip :key="index" closable @click:close="removeFriend(item.id)">
                  {{ item.nickname }} ({{ item.email }})
                </v-chip>
              </template>
            </v-autocomplete>
          </v-col>

          <!-- 장소 -->
          <v-col cols="12" sm="12">
            <v-text-field
              label="장소를 입력하세요"
              :rules="[(value) => !!value || '장소 필수?']"
              required
              v-model="place"
            >
            </v-text-field>
          </v-col>

          <!-- 예상 모임 시간 -->
          <v-col cols="12" md="3"><h4>예상 모임 시간</h4></v-col>
          <v-col cols="12" md="9">
            <input type="time" v-model="startDate" />
          </v-col>

          <!-- 시작/종료 날짜 -->
          <v-col cols="12" md="3"><h4>시작일</h4></v-col>
          <v-col cols="12" md="9">
            <input type="date" v-model="startDate" />
          </v-col>
          <v-col cols="12" md="3"><h4>종료일</h4></v-col>
          <v-col cols="12" md="9">
            <input type="date" v-model="endDate" />
          </v-col>
          <!-- 시작/종료 시간 -->
          <v-col cols="12" md="3"><h4>시작 시간</h4></v-col>
          <v-col cols="12" md="9">
            <input type="time" v-model="startTime" />
          </v-col>
          <v-col cols="12" md="3"><h4>종료 시간</h4></v-col>
          <v-col cols="12" md="9">
            <input type="time" v-model="endTime" />
          </v-col>

          <!-- 메모 -->
          <v-col cols="12" md="12">
            <v-text-field label="메모를 입력하세요." v-model="memo"> </v-text-field>
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
import { ref, onMounted, computed } from "vue";
import axios from "axios";
import { useMainStore } from "@/stores/index.js";

export default {
  setup() {
    const mainStore = useMainStore();
    const title = ref("");
    const people = ref([]);
    // const people = [
    //   { nickname: 'Sandra Adams', group: 'Group 1' },
    //   { nickname: 'Ali Connors', group: 'Group 1'},
    //   { nickname: 'Trevor Hansen', group: 'Group 1'},
    //   { nickname: 'Tucker Smith', group: 'Group 1'},
    //   { nickname: 'Britta Holt', group: 'Group 2'},
    //   { nickname: 'Jane Smith ', group: 'Group 2'},
    //   { nickname: 'John Smith', group: 'Group 2' },
    //   { nickname: 'Sandra Williams', group: 'Group 2'},
    // ];
    const place = ref("");
    const startDate = ref("");
    const endDate = ref("");
    const startTime = ref("");
    const endTime = ref("");
    const memo = ref("");

    const isDialogOpen = computed(() => mainStore.isDialogOpen);

    const fetchPeople = async () => {
      const authToken = localStorage.getItem("accessToken");
      if (!authToken) {
        console.error("인증 토큰이 없습니다.");
        return;
      }

      try {
        const response = await axios.get("http://localhost:8080/api/members/search", {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        if (response.data.success && Array.isArray(response.data.data)) {
          people.value = response.data.data.map(user => ({...user,
            profileImage: user.profileImage || 'https://moim-bucket.s3.ap-northeast-2.amazonaws.com/members/default_profile.png'  // 기본 이미지 설정
          }));
          console.log( '사람들 정보' , people.value);
          console.log('1번 사람사람', people.value[0]);
        } else {
          console.error("사람들을 불러오는데 실패했습니다: API 에러 반환", response.data);
          people.value = [];
        }
      } catch (error) {
        console.error("사람들을 불러오는데 실패했습니다:", error);
        people.value = [];
      }
    };

    onMounted(fetchPeople);

    const removeFriend = (id) => {
      people.value = people.value.filter((f) => f.id !== id);
    };

    const createEvent = async () => {
      const formData = new FormData();
      formData.append("title", title.value);
      formData.append("memo", memo.value);
      formData.append("place", place.value);
      formData.append("startDate", startDate.value);
      formData.append("endDate", endDate.value);
      formData.append("startTime", startTime.value);
      formData.append("endTime", endTime.value);
      formData.append("people", JSON.stringify(people.value.map((f) => f.id)));

      try {
        await axios.post("http://localhost:8080/api/events", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        mainStore.closeDialog();
      } catch (error) {
        console.error("이벤트 생성 실패:", error);
      }
    };

    return {
      title,

      people,
      place,
      startDate,
      endDate,
      startTime,
      endTime,
      memo,
      isDialogOpen,
      fetchPeople,
      removeFriend,
      createEvent,
    };
  },
};
</script>
