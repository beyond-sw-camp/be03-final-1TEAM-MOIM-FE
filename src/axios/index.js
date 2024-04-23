import axios from "axios";

// Axios 인스턴스 생성 (URL 호출 시 기본 값 세팅)
const axiosInstance = axios.create({
  baseURL: `${process.env.VUE_APP_API_BASE_URL}`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Access Token 가져오는 함수
const getAccessToken = () => {
  return localStorage.getItem("accessToken");
};

// Refresh Token 가져오는 함수
const getRefreshToken = () => {
  return localStorage.getItem("refreshToken");
};

const setAccessToken = (token) => {
  localStorage.setItem("accessToken", token);
};

// Axios Interceptor 설정
// 요청 시
axiosInstance.interceptors.request.use(
  async (config) => {
    const accessToken = getAccessToken();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    console.log(config);
    return config;
  },
  (error) => {
    // 요청 에러 처리
    return Promise.reject(error);
  }
);

// 서버에서 응답 받을 시
axiosInstance.interceptors.response.use(
  (response) => {
    console.log(response);
    return response;
  },
  async (error) => {
    console.error(error);
    console.log("에러다!");
    const originalRequest = error.config;
    console.log(originalRequest);
    if (error.response.status === 401 && !originalRequest._retry) {
      console.log("if문 안에 들어왔다!");
      originalRequest._retry = true;
      const refreshToken = getRefreshToken();
      console.log("Refresh Token 서버로 보낸다!!");
      const response = await axios.post(
        `${process.env.VUE_APP_API_BASE_URL}/api/auth/reissue`,
        {},
        {
          headers: {
            Authorization_Refresh: `Bearer ${refreshToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(
        "서버에서 재발급된 Access Token 받아왔다! 아래에 응답값 출력!"
      );
      console.log(response);
      const accessToken = response.data.Authorization;
      setAccessToken(accessToken);
      const updatedAccessToken = getAccessToken();
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${updatedAccessToken}`;
      return axiosInstance(originalRequest);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;

// 아래 코드는 추후 사용할 수 있음
// const decodeToken = (token) => {
//   if (!token) {
//     return null;
//   }
//   return jwtDecode(token);
// };

// // Access Token 유효성 검증 함수
// const isAccessTokenExpired = (token) => {
//   const decodedToken = decodeToken(token);
//   const expirationDate = new Date(decodedToken[EXPIRATION_KEY]);
//   const now = new Date();
//   const remainingTime = expirationDate.getTime() * 1000 - now.getTime();

//   console.log("만료 기한: " + expirationDate);
//   console.log("현재 시각: " + now);
//   console.log("남은 시간: " + remainingTime);

//   // 만료 시간이 30초 이하 남았으면 만료 처리
//   return remainingTime <= 30 * 1000;
// };
