<template>
    <v-container fluid>
        <v-row>
            <v-col cols="12" md="5">
                <div class="left-panel">
                    <!-- 회원가입 폼 -->
                    <v-card class="register-form">
                        <v-form>
                            <!-- 이메일 입력 칸 -->
                            <v-text-field label="이메일" prepend-inner-icon="mdi-email" v-model="email"
                                :rules="[rules.required, rules.email]" :disabled="emailCodeSent" outlined>
                                <template v-slot:append>
                                    <!-- 중복 체크 버튼이 emailDuplicated가 true일 때만 표시되도록 함 -->
                                    <v-btn text @click="checkEmail" v-if="emailDuplicated">중복 체크</v-btn>
                                    <!-- 인증 코드 전송 버튼이 emailDuplicated가 false일 때만 표시되도록 함 -->
                                    <v-btn text @click="sendEmailCode" v-else :disabled="emailCodeSent">인증 코드 전송</v-btn>
                                </template>
                            </v-text-field>

                            <span v-show="emailCodeSent" class="text-red-800 p-2 rounded-md mt-2" disabled>유효시간: {{ timer }}초</span>
                            <!-- 인증코드 입력 칸 -->
                            <v-text-field label="인증 코드 입력" prepend-inner-icon="mdi-lock" v-model="authCode" :disabled="emailCodeVerified"
                                outlined>
                                <template v-slot:append>
                                    <!-- 여기에 인증 코드 검증 버튼 추가 -->
                                    <v-btn text @click="verifyCode" :disabled="emailCodeVerified">인증 코드 검증</v-btn>
                                </template>

                            </v-text-field>

                            <!-- 닉네임 입력 칸 -->
                            <v-text-field label="닉네임" prepend-inner-icon="mdi-account" v-model="nickname"
                                :rules="[rules.required]" :disabled="!nicknameDuplicated" outlined>
                                <template v-slot:append>
                                    <!-- 닉네임 중복 체크 버튼 -->
                                    <v-btn text @click="checkNickname" :disabled="!nicknameDuplicated">중복 체크</v-btn>
                                </template>
                            </v-text-field>

                            <!-- 비밀번호 입력 칸 -->
                            <v-text-field label="비밀번호" prepend-inner-icon="mdi-lock" v-model="password"
                                :type="showPassword ? 'text' : 'password'"
                                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                                @click:append="showPassword = !showPassword" :rules="[rules.required]"
                                outlined></v-text-field>

                            <!-- 비밀번호 확인 입력 칸 -->
                            <v-text-field label="비밀번호 확인" prepend-inner-icon="mdi-lock" v-model="passwordConfirm"
                                :type="showPasswordConfirm ? 'text' : 'password'"
                                :append-icon="showPasswordConfirm ? 'mdi-eye' : 'mdi-eye-off'"
                                @click:append="showPasswordConfirm = !showPasswordConfirm"
                                :rules="[rules.required, rules.passwordMatch]" outlined></v-text-field>

                            <v-file-input
                                label="프로필 이미지 선택"
                                prepend-icon="mdi-camera"
                                @change="previewImage"
                                outlined
                            ></v-file-input>
                            <!-- 이미지 미리보기 -->
                            <v-img
                                v-if="profileImage"
                                :src="imageUrl"
                                aspect-ratio="1"
                                class="mt-3"
                                style="max-width: 200px; max-height: 200px"
                            ></v-img>

                            <!-- 회원가입 버튼 -->
                            <v-btn color="primary" @click="register">회원가입</v-btn>
                        </v-form>
                    </v-card>

                </div>
            </v-col>

            <!-- 오른쪽 컬럼 -->
            <v-col cols="12" md="7">
                <div class="right-panel" style="background-color: #6F8A6B; ">
                    <v-img src="../assets/image_1.png" style="max-height: 100%; max-width: 100%;" />
                </div>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import axiosInstance from "@/axios";

export default {
    data() {
        return {
            email: '',
            authCode: '',
            nickname: '',
            password: '',
            passwordConfirm: '',
            profileImage: '',
            showPassword: false,
            showPasswordConfirm: false,
            // 중복 체크 초기값을 true로 설정하여 인증 코드 요청 버튼이 처음에는 표시되지 않도록 함
            emailDuplicated: true, 
            nicknameDuplicated: true,
            emailCodeSent: false,
            emailCodeVerified: false,
            timer: 180,
            rules: {
                required: value => !!value || '필수 입력 사항입니다.',
                email: value => /.+@.+\..+/.test(value) || '유효한 이메일 주소를 입력해주세요.',
                passwordMatch: () => this.password === this.passwordConfirm || '비밀번호가 일치하지 않습니다.'
            }
        }
    },
    methods: {
        previewImage(event){
            this.profileImage = event.target.files[0];
            if (this.profileImage){
                this.imageUrl = URL.createObjectURL(this.profileImage);
            }
        },
        async sendEmailCode() {
            // 이메일 인증 코드 요청 로직
            if (confirm("입력한 이메일로 인증 번호를 발송하시겠습니까?")){
                alert("입력된 이메일로 인증 번호를 발송하였습니다.");
                await axiosInstance.post(
                    `${process.env.VUE_APP_API_BASE_URL}/api/auth/send`, {},
                    {
                        params: {
                            email: this.email,
                        },
                    }
                );
                this.emailCodeSent = true;
                this.startTimer();
            }
        },
        async verifyCode(){
            if (!this.authCode) {
                alert("인증 코드를 입력해주세요.");
                return;
            }
            try {
                const response = await axiosInstance.post(
                    `${process.env.VUE_APP_API_BASE_URL}/api/auth/verify`, {},
                    {
                        params: {
                            email: this.email,
                            authCode: this.authCode,
                        }
                    }
                );

                if (response.status === 200){
                    this.emailCodeVerified = true;
                    alert("인증 코드가 확인되었습니다.");
                    clearInterval(this.intervalId);
                }
            } catch(error){
                console.error(error);
                alert(error.response.data.error.message);
            }
        },
        startTimer(){
            this.isTimerStarted = true;
            this.intervalId = setInterval(() => {
                this.timer--;
                if (this.timer === 0){
                    clearInterval(this.intervalId);
                    this.isTimerStarted = false;
                    alert("유효 시간이 만료되었습니다. 다시 시도해주세요");
                    window.location.reload();
                }
            }, 1000);
        },
        async checkEmail() {
            const isEmailRequired = this.rules.required(this.email);
            if (isEmailRequired !== true){
                alert('이메일을 입력하세요.');
                return;
            }
            const isEmailValid = this.rules.email(this.email);
            if (isEmailValid !== true) { // email 규칙이 true를 반환하지 않는 경우, 에러 메시지(isEmailValid)를 표시
                alert(isEmailValid); // 유효한 이메일 주소를 입력해주세요.
                return;
            }

            // 이메일 중복 확인 로직
            try {
                const response = await axiosInstance.post(`${process.env.VUE_APP_API_BASE_URL}/api/auth/email-validate`, {},
                {
                    params: {
                        email: this.email,
                    },
                });
                console.log(response);

                if (response.status === 200){
                    this.emailDuplicated = false;
                    alert("사용 가능한 이메일입니다.");
                }   
            } catch(error){
                console.error(error);
                alert(error.response.data.error.message);
            }
        },
        async checkNickname() {
            // 닉네임 중복 확인 로직
            if (!this.nickname) {
                alert("닉네임을 입력해주세요.");
                return;
            }

            try {
                const response = await axiosInstance.post(`${process.env.VUE_APP_API_BASE_URL}/api/auth/nickname-validate`, {},
                {
                    params: {
                        nickname: this.nickname,
                    },
                });
                console.log(response);

                if (response.status === 200){
                    this.nicknameDuplicated = false;
                    alert("사용 가능한 닉네임입니다.");
                }
            } catch(error){
                console.error(error);
                alert(error.response.data.error.message);
            }
        },
        async register() {
            // 회원가입 로직
            if (this.emailDuplicated && 
            this.nicknameDuplicated && 
            !this.emailCodeSent && 
            !this.emailCodeVerified){
                alert("입력되지 않은 값이 있습니다.");
                return;
            }
            const isPasswordMatch = this.rules.passwordMatch();
            if (isPasswordMatch !== true){
                alert('비밀번호가 일치하지 않습니다.');
                return;
            }

            const registerData = new FormData();
            registerData.append("email", this.email);
            registerData.append("password", this.password);
            registerData.append("nickname", this.nickname);
            if (this.profileImage){
                registerData.append("profileImage", this.profileImage);
            }

            let headers = {
                'Content-Type': 'multipart/form-data'
            };

            try {
                const response = await axiosInstance.post(`${process.env.VUE_APP_API_BASE_URL}/api/auth/sign-up`, registerData, { headers });
                console.log(response);

                if (response.status === 200){
                    alert("회원가입이 완료되었습니다.");
                    this.$router.push({ name: 'login'});
                }
            } catch(error){
                console.error(error);
                alert(error);
            }


            
        }
    }
};
</script>

<style scoped>
.left-panel {
    padding-top: 20%;
    height: 95vh;
    background-color: #FFFFFF;
}
.right-panel {
    /* 오른쪽 패널 스타일링 */
    background-color: #6F8A6B;
    height: 95vh; 
    display: flex; 
    justify-content: center; 
    align-items: center;
}
.register-form {
    border: 1px solid #000; /* 로그인 폼 테두리 추가 */
    max-width: 70vh; /* 적절한 최대 너비 설정 */
}
</style>