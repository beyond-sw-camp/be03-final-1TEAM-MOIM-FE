<template>
    <v-container fluid>
        <!-- 화면을 가득 채우기 위해 fluid 속성 사용 -->
        <v-row>
            <!-- 왼쪽 컬럼 -->
            <v-col cols="12" md="5">
                <div class="left-panel">

                    <v-card class="login-form">
                        <v-form
                            v-model="form"
                            @submit.prevent="onSubmit"
                        >
                            <v-text-field
                                v-model="email"
                                :readonly="loading"
                                :rules="[rules.required, rules.email]"
                                label="이메일"
                                placeholder="이메일을 입력해주세요"
                                clearable
                            ></v-text-field>
                            <v-text-field
                                :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
                                :type="visible ? 'text' : 'password'"
                                v-model="password"
                                :readonly="loading"
                                :rules="[rules.required]"
                                label="비밀번호"
                                placeholder="비밀번호를 입력해주세요"
                                @click:append-inner="visible = !visible"
                                clearable
                            ></v-text-field>

                            <br>

                            <v-btn
                                :disabled="!form"
                                :loading="loading"
                                color="#000000"
                                size="large"
                                type="submit"
                                variant="elevated"
                                block
                            >
                            로그인
                            </v-btn>
                            <v-btn color="blue" class="mt-3">
                                <router-link to="register">회원가입</router-link>
                            </v-btn>
                            <v-btn
                                color="red"
                                class="mt-2"
                                block
                                @click="googleLogin"
                            >
                            구글 로그인
                            </v-btn>
                            <v-btn
                                color="yellow darken-1"
                                class="mt-2"
                                block
                                @click="kakaoLogin"
                            >
                            카카오 로그인
                            </v-btn>
                        </v-form>
                    </v-card>
                </div>
            </v-col>

            <!-- 오른쪽 컬럼 -->
            <v-col cols="12" md="7">
                <div class="right-panel">
                    <!-- 이미지 추가 -->
                    <v-img src="../assets/image_1.png" style="max-height: 100%; max-width: 100%;"/>
                </div>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

export default {
    data() {
        return {
            form: false,
            email: '',
            password: '',
            loading: false,
            visible: false,
            rules: {
                required: value => !!value || "값을 입력해주세요",
                email: value => {
                    const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                    return pattern.test(value) || '이메일 형식이 맞지 않습니다.'
                },
            },
        }
    },
    methods: {
        onSubmit() {
            if (!this.form){
                return;
            }
            this.loading = true;
            setTimeout(() => (this.loading = false), 2000)
            this.doLogin();
        },
        async doLogin(){
            const loginData = {
                email: this.email,
                password: this.password
            }
            console.log(loginData);
            try {
                const response = await axios.post(`${process.env.VUE_APP_API_BASE_URL}/login`, loginData);
                console.log(response);
                const accessToken = response.data.Authorization;
                const refreshToken = response.data.Authorization_Refresh;
                if (accessToken && refreshToken){
                    const decodedAccessToken = jwtDecode(accessToken);
                    localStorage.setItem("accessToken", accessToken);
                    localStorage.setItem("refreshToken", refreshToken);
                    localStorage.setItem("expiredTime", decodedAccessToken.exp);
                    this.$router.push({ name: 'MainPage'});
                } else {
                    console.log("200 OK But Not Token");
                    alert("로그인 실패");
                }
            } catch(error){
                console.error(error);
                alert(error.response.data);
            }
        },
        googleLogin(){
            window.location.href = `${process.env.VUE_APP_API_BASE_URL}/oauth2/authorization/google?redirect_uri=http://localhost:8081/oauth2/redirect`;
        }
    }
};
</script>

<style scoped>
.login-form {
    border: 1px solid #000; /* 로그인 폼 테두리 추가 */
    max-width: 400px; /* 적절한 최대 너비 설정 */
}

.left-panel {
    /* 왼쪽 패널 스타일링 */
    padding-top: 40%; /* 상단으로부터의 간격 조정 */
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
</style>
