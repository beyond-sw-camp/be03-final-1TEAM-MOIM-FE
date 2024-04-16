import { jwtDecode } from "jwt-decode";
import axios from "axios";

const methods = {
    async setToken(url) {

        // Header에 토큰 설정
        axios.defaults.headers.common["Authorization"] = 
        `Bearer ` + localStorage.getItem("accessToken");

        // 만료 시간이 지났을 경우, Refresh Token을 이용하여 Access Token 재발급
        const expiredTime = localStorage.getItem("expiredTime");
        const now = new Date();
        const currentTime = now.getTime();
        const diffTime = expiredTime * 1000 - currentTime;

        // 토큰 만료 시간 - 현재 시간이 10초 미만일 경우 Refresh Token을 헤더에 넣어서 서버에 요청
        if (diffTime < 10000){
            console.log("Token 재발급 요청");
            axios.defaults.headers.common["Authorization_Refresh"] = 
            `Bearer ` + localStorage.getItem("refreshToken");

            await axios.get(process.env.VUE_APP_API_BASE_URL + url).then(
                (response) => {
                    localStorage.setItem("accessToken", response.data.Authorization);
                    const decodedAccessToken = jwtDecode(response.data.Authorization);
                    localStorage.setItem("role", decodedAccessToken.role);
                    localStorage.setItem("expiredTime", decodedAccessToken.exp);
                    axios.defaults.headers.common["Authorization"] = 
                    localStorage.getItem("accessToken");
                },
                (error) => {
                    localStorage.clear();
                    console.error(error);
                    history.back();

                    return Promise.reject(error);
                }
            )
        }
    }
}

export default {
    install(app) {
        app.config.globalProperties.$token = methods.setToken;
    },
}